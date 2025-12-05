import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSearch, Upload, Table, CheckCircle } from 'lucide-react'

const mockExtractedData = [
  { field: 'Invoice Number', value: 'INV-2024-0892', confidence: '98%' },
  { field: 'Vendor Name', value: 'Tech Solutions Inc.', confidence: '95%' },
  { field: 'Invoice Date', value: 'Dec 1, 2024', confidence: '99%' },
  { field: 'Due Date', value: 'Dec 31, 2024', confidence: '97%' },
  { field: 'Total Amount', value: '$4,250.00', confidence: '99%' },
  { field: 'Tax Amount', value: '$382.50', confidence: '96%' },
  { field: 'Payment Terms', value: 'Net 30', confidence: '92%' },
]

export default function DataExtractor() {
  const [isScanning, setIsScanning] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      startScanning()
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setFileName(file.name)
      startScanning()
    }
  }

  const startScanning = () => {
    setIsScanning(true)
    setExtractedData(null)
    
    setTimeout(() => {
      setIsScanning(false)
      setExtractedData(mockExtractedData)
    }, 3000)
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-lime-accent/20 flex items-center justify-center">
          <FileSearch className="w-6 h-6 text-lime-accent" />
        </div>
        <div>
          <h3 className="font-grotesk text-xl font-bold text-white">Document Data Extractor</h3>
          <p className="text-gray-400 text-sm">AI-powered document parsing</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-lime-accent/50 transition-colors"
          >
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  <div className="w-24 h-32 mx-auto bg-slate/50 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileSearch className="w-10 h-10 text-gray-500" />
                    </div>
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-lime-accent shadow-lg shadow-lime-accent/50"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                  <p className="text-lime-accent mt-4 font-medium">Scanning document...</p>
                  <p className="text-gray-500 text-sm mt-1">{fileName}</p>
                </motion.div>
              ) : extractedData ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto bg-lime-accent/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-lime-accent" />
                  </div>
                  <p className="text-white font-medium">Extraction Complete!</p>
                  <p className="text-gray-400 text-sm mt-1">{fileName}</p>
                  <button
                    onClick={() => {
                      setExtractedData(null)
                      setFileName('')
                    }}
                    className="mt-4 text-lime-accent text-sm hover:underline"
                  >
                    Scan another document
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-1">Drop your document here</p>
                  <p className="text-gray-500 text-sm">Supports PDF, PNG, JPG</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 p-4 glass-card rounded-xl">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Supported Documents</h4>
            <div className="flex flex-wrap gap-2">
              {['Invoices', 'Receipts', 'Contracts', 'Resumes', 'Forms'].map((type) => (
                <span key={type} className="px-3 py-1 bg-slate/50 rounded-full text-xs text-gray-300">
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 bg-obsidian/50">
          <div className="flex items-center gap-2 mb-4">
            <Table className="w-5 h-5 text-lime-accent" />
            <h4 className="font-grotesk font-semibold text-white">Extracted Data</h4>
          </div>

          <AnimatePresence mode="wait">
            {extractedData ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-gray-400 font-medium">Field</th>
                      <th className="text-left py-2 text-gray-400 font-medium">Value</th>
                      <th className="text-right py-2 text-gray-400 font-medium">Conf.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedData.map((row, index) => (
                      <motion.tr
                        key={row.field}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-white/5"
                      >
                        <td className="py-3 text-gray-400">{row.field}</td>
                        <td className="py-3 text-white font-medium">{row.value}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-1 bg-lime-accent/20 text-lime-accent rounded text-xs">
                            {row.confidence}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-64 flex items-center justify-center text-gray-500"
              >
                <div className="text-center">
                  <FileSearch className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Upload a document to see extracted data</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
