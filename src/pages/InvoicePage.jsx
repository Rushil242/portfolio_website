import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSpreadsheet, Download, Send, CheckCircle, Upload, X, Plus, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

export default function InvoicePage() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    invoiceNumber: 'INV-001',
    items: [{ description: '', quantity: 1, price: 0 }],
  })
  const [bulkData, setBulkData] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = field === 'description' ? value : Number(value)
    setFormData({ ...formData, items: newItems })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }],
    })
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      })
    }
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.xlsx')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
        setBulkData(data)
      }
      reader.readAsBinaryString(file)
    }
  }, [])

  const generatePDF = () => {
    const doc = new jsPDF()

    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, 210, 297, 'F')

    doc.setTextColor(0, 0, 0)
    doc.setFont('times', 'bold')
    doc.setFontSize(28)
    doc.text('INVOICE', 20, 35)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Invoice #: ${formData.invoiceNumber}`, 20, 48)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 55)

    doc.setDrawColor(200, 200, 200)
    doc.line(20, 65, 190, 65)

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.text('Bill To:', 20, 78)
    doc.setFont('helvetica', 'bold')
    doc.text(formData.clientName || 'Client Name', 20, 86)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    doc.text(formData.clientEmail || 'client@email.com', 20, 93)

    let y = 115
    doc.setFillColor(245, 245, 245)
    doc.rect(20, y - 6, 170, 10, 'F')
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    doc.text('DESCRIPTION', 22, y)
    doc.text('QTY', 120, y)
    doc.text('PRICE', 145, y)
    doc.text('TOTAL', 170, y)
    y += 12

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    formData.items.forEach((item) => {
      doc.text(item.description || 'Item', 22, y)
      doc.text(String(item.quantity), 122, y)
      doc.text(`$${item.price.toFixed(2)}`, 145, y)
      doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 170, y)
      y += 10
    })

    y += 5
    doc.setDrawColor(200, 200, 200)
    doc.line(120, y, 190, y)
    y += 12
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Total Due:', 135, y)
    doc.text(`$${calculateTotal().toFixed(2)}`, 170, y)

    doc.save(`invoice_${formData.invoiceNumber}.pdf`)

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-obsidian pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-lime-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-grotesk text-4xl font-bold text-white mb-3">Invoice Engine</h1>
          <p className="text-gray-400 text-lg">Generate professional invoices in seconds</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <h2 className="font-grotesk text-xl font-semibold text-white mb-6">Invoice Configuration</h2>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center mb-6 transition-all ${
                  isDragging ? 'border-lime-accent bg-lime-accent/5' : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Drop .xlsx file for bulk import</p>
                {bulkData && (
                  <p className="text-lime-accent text-sm mt-2 font-medium">
                    {bulkData.length} records loaded
                  </p>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs tracking-wide text-gray-400 uppercase mb-2 block font-medium">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="Enter client name"
                    className="w-full bg-slate-800 border border-slate-700 focus:border-lime-accent outline-none px-4 py-3 text-white rounded-lg transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-wide text-gray-400 uppercase mb-2 block font-medium">Client Email</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    placeholder="client@company.com"
                    className="w-full bg-slate-800 border border-slate-700 focus:border-lime-accent outline-none px-4 py-3 text-white rounded-lg transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-wide text-gray-400 uppercase mb-2 block font-medium">Invoice Number</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-lime-accent outline-none px-4 py-3 text-white rounded-lg transition-colors"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <label className="text-xs tracking-wide text-gray-400 uppercase block font-medium">Line Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="flex-1 bg-slate-800 border border-slate-700 focus:border-lime-accent outline-none px-3 py-2.5 text-white text-sm rounded-lg transition-colors"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      className="w-20 bg-slate-800 border border-slate-700 focus:border-lime-accent outline-none px-3 py-2.5 text-white text-sm text-center rounded-lg transition-colors"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      placeholder="Price"
                      className="w-28 bg-slate-800 border border-slate-700 focus:border-lime-accent outline-none px-3 py-2.5 text-white text-sm text-center rounded-lg transition-colors"
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addItem}
                  className="flex items-center gap-2 text-lime-accent text-sm hover:text-lime-300 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Line Item
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 mb-6">
              <h2 className="font-grotesk text-xl font-semibold text-white mb-6">Live Preview</h2>

              <div className="bg-white text-black rounded-sm shadow-2xl p-8 aspect-[1/1.4]">
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">INVOICE</h2>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>#{formData.invoiceNumber}</p>
                    <p>{currentDate}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bill To</p>
                  <p className="font-semibold text-gray-900">{formData.clientName || 'Client Name'}</p>
                  <p className="text-gray-500 text-sm">{formData.clientEmail || 'client@email.com'}</p>
                </div>

                <div className="border-t border-gray-100">
                  <div className="grid grid-cols-12 gap-2 py-3 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 py-3 text-sm border-b border-gray-50">
                      <div className="col-span-6 text-gray-700">{item.description || 'Item'}</div>
                      <div className="col-span-2 text-center text-gray-600">{item.quantity}</div>
                      <div className="col-span-2 text-right text-gray-600">${item.price.toFixed(2)}</div>
                      <div className="col-span-2 text-right font-medium text-gray-900">${(item.quantity * item.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t-2 border-gray-900">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Due</span>
                    <span className="text-2xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={generatePDF}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-lime-accent text-obsidian font-semibold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5" />
                Download PDF
              </motion.button>
              <motion.button
                onClick={generatePDF}
                className="px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white hover:bg-slate-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-6 py-4 bg-lime-accent text-obsidian rounded-xl shadow-lg z-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Invoice generated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
