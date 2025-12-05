import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSpreadsheet, Download, Send, CheckCircle, Upload, X } from 'lucide-react'
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

export default function InvoiceEngine() {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
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
    
    doc.setFillColor(11, 15, 25)
    doc.rect(0, 0, 210, 297, 'F')
    
    doc.setTextColor(217, 249, 157)
    doc.setFontSize(24)
    doc.text('INVOICE', 20, 30)
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text(`Client: ${formData.clientName}`, 20, 50)
    doc.text(`Email: ${formData.clientEmail}`, 20, 60)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70)
    
    doc.setDrawColor(255, 255, 255)
    doc.line(20, 80, 190, 80)
    
    let y = 95
    doc.setFontSize(10)
    doc.text('Description', 20, y)
    doc.text('Qty', 120, y)
    doc.text('Price', 145, y)
    doc.text('Total', 170, y)
    y += 10
    
    formData.items.forEach((item) => {
      doc.text(item.description || 'Item', 20, y)
      doc.text(String(item.quantity), 120, y)
      doc.text(`$${item.price.toFixed(2)}`, 145, y)
      doc.text(`$${(item.quantity * item.price).toFixed(2)}`, 170, y)
      y += 8
    })
    
    y += 10
    doc.line(20, y, 190, y)
    y += 10
    doc.setTextColor(217, 249, 157)
    doc.setFontSize(14)
    doc.text(`TOTAL: $${calculateTotal().toFixed(2)}`, 145, y)
    
    doc.save(`invoice_${formData.clientName || 'client'}.pdf`)
    
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-lime-accent/20 flex items-center justify-center">
          <FileSpreadsheet className="w-6 h-6 text-lime-accent" />
        </div>
        <div>
          <h3 className="font-grotesk text-xl font-bold text-white">Instant Invoice Engine</h3>
          <p className="text-gray-400 text-sm">Generate professional invoices in seconds</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              isDragging ? 'border-lime-accent bg-lime-accent/10' : 'border-white/20'
            }`}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">
              Drag & drop .xlsx file for bulk import
            </p>
            {bulkData && (
              <p className="text-lime-accent text-sm mt-2">
                {bulkData.length} records loaded!
              </p>
            )}
          </div>

          <div className="space-y-3">
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              placeholder="Client Name"
              className="w-full bg-slate/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-accent/50"
            />
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleInputChange}
              placeholder="Client Email"
              className="w-full bg-slate/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-accent/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Line Items</label>
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="Description"
                  className="flex-1 bg-slate/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-lime-accent/50"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  placeholder="Qty"
                  className="w-16 bg-slate/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-lime-accent/50"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  placeholder="Price"
                  className="w-24 bg-slate/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm text-center focus:outline-none focus:border-lime-accent/50"
                />
                <button
                  onClick={() => removeItem(index)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addItem}
              className="text-lime-accent text-sm hover:underline"
            >
              + Add Item
            </button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 bg-obsidian/50">
          <h4 className="font-grotesk text-lg font-semibold text-white mb-4">Live Preview</h4>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Client:</span>
              <span className="text-white">{formData.clientName || '—'}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Email:</span>
              <span className="text-white">{formData.clientEmail || '—'}</span>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              {formData.items.map((item, index) => (
                <div key={index} className="flex justify-between py-1">
                  <span className="text-gray-300">{item.description || 'Item'} x{item.quantity}</span>
                  <span className="text-white">${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4 flex justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="font-bold text-lime-accent text-lg">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <motion.button
              onClick={generatePDF}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-lime-accent text-obsidian font-semibold rounded-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </motion.button>
            <motion.button
              onClick={generatePDF}
              className="flex items-center justify-center gap-2 px-4 py-3 glass-card rounded-xl text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-6 py-4 bg-lime-accent text-obsidian rounded-xl shadow-lg z-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Invoice generated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
