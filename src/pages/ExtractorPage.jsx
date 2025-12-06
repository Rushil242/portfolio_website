import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSearch, Upload, CheckCircle, FileText, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const mockExtractedData = [
  { field: 'Invoice Number', value: 'INV-2024-0892', confidence: '98%' },
  { field: 'Vendor Name', value: 'Tech Solutions Inc.', confidence: '95%' },
  { field: 'Invoice Date', value: 'Dec 1, 2024', confidence: '99%' },
  { field: 'Due Date', value: 'Dec 31, 2024', confidence: '97%' },
  { field: 'Total Amount', value: '$4,250.00', confidence: '99%' },
  { field: 'Tax Amount', value: '$382.50', confidence: '96%' },
  { field: 'Payment Terms', value: 'Net 30', confidence: '92%' },
]

export default function ExtractorPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [fileName, setFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      startScanning()
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
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

  const resetExtractor = () => {
    setExtractedData(null)
    setFileName('')
    setIsScanning(false)
  }

  return (
    <div className="min-h-screen bg-obsidian pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-lime-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-grotesk text-4xl font-bold text-white mb-3">Document Data Extractor</h1>
          <p className="text-gray-400 text-lg">AI-powered document parsing and data extraction</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            {!extractedData && !isScanning && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-900 rounded-xl p-12 border border-slate-800"
              >
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-20 text-center transition-all ${
                    isDragging
                      ? 'border-lime-accent bg-lime-accent/5'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="w-24 h-24 mx-auto mb-6 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-500" />
                  </div>

                  <p className="text-white text-xl font-medium mb-2">Drag & Drop PDF</p>
                  <p className="text-gray-500 text-sm mb-6">or click to browse files</p>

                  <div className="flex justify-center gap-3">
                    {['PDF', 'PNG', 'JPG'].map((type) => (
                      <span key={type} className="px-4 py-2 bg-slate-800 rounded-lg text-xs text-gray-400 font-mono border border-slate-700">
                        .{type.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {isScanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-xl p-16 border border-slate-800 text-center"
              >
                <div className="w-40 h-48 mx-auto bg-slate-800 rounded-lg relative overflow-hidden border border-slate-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileSearch className="w-16 h-16 text-gray-600" />
                  </div>
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-lime-accent"
                    style={{ boxShadow: '0 0 20px rgba(217, 249, 157, 0.8)' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
                <p className="text-lime-accent mt-8 font-medium text-xl">Analyzing document...</p>
                <p className="text-gray-500 text-sm mt-3 font-mono">{fileName}</p>
              </motion.div>
            )}

            {extractedData && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-lime-accent/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-lime-accent" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg">Extraction Complete</p>
                      <p className="text-gray-500 text-sm font-mono">{fileName}</p>
                    </div>
                  </div>
                  <button
                    onClick={resetExtractor}
                    className="text-lime-accent text-sm hover:underline font-medium"
                  >
                    Scan another
                  </button>
                </div>

                <div className="overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs text-gray-400 uppercase tracking-wider border-b border-slate-800 bg-slate-800/50">
                    <div className="col-span-5 font-semibold">Field</div>
                    <div className="col-span-5 font-semibold">Extracted Value</div>
                    <div className="col-span-2 text-right font-semibold">Confidence</div>
                  </div>

                  {extractedData.map((row, index) => (
                    <motion.div
                      key={row.field}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="col-span-5 text-gray-400 text-sm">{row.field}</div>
                      <div className="col-span-5 text-white font-medium text-sm">{row.value}</div>
                      <div className="col-span-2 text-right">
                        <span className="px-3 py-1 bg-lime-accent/20 text-lime-accent rounded-full text-xs font-mono">
                          {row.confidence}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 flex gap-3 bg-slate-800/30">
                  <motion.button
                    className="flex-1 px-6 py-4 bg-lime-accent text-obsidian font-semibold rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Export to CSV
                  </motion.button>
                  <motion.button
                    className="px-6 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white hover:bg-slate-800 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Copy JSON
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
