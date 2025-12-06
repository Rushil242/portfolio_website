import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileSearch, Upload, CheckCircle, FileText } from 'lucide-react'

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
    <div className="border border-white/10 rounded-2xl backdrop-blur-2xl bg-obsidian/40 overflow-hidden">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-lime-accent/10 flex items-center justify-center">
            <FileSearch className="w-6 h-6 text-lime-accent" />
          </div>
          <div>
            <h3 className="font-grotesk text-2xl font-bold text-white">Document Data Extractor</h3>
            <p className="text-gray-400 text-sm">AI-powered document parsing</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {!extractedData && !isScanning && (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-16 text-center transition-all ${
                isDragging 
                  ? 'border-lime-accent bg-lime-accent/5' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="w-20 h-20 mx-auto mb-6 rounded-xl border-2 border-gray-600 border-dashed flex items-center justify-center">
                <FileText className="w-10 h-10 text-gray-500" />
              </div>
              
              <p className="text-white text-lg font-medium mb-2">Drag & Drop PDF</p>
              <p className="text-gray-500 text-sm">or click to browse files</p>
              
              <div className="mt-8 flex justify-center gap-3">
                {['PDF', 'PNG', 'JPG'].map((type) => (
                  <span key={type} className="px-3 py-1 bg-slate/50 rounded text-xs text-gray-400 font-mono">
                    .{type.toLowerCase()}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {isScanning && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center"
            >
              <div className="w-32 h-40 mx-auto bg-slate/30 rounded-lg relative overflow-hidden border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileSearch className="w-12 h-12 text-gray-600" />
                </div>
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-lime-accent"
                  style={{ boxShadow: '0 0 20px rgba(217, 249, 157, 0.8)' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <p className="text-lime-accent mt-6 font-medium text-lg">Analyzing document...</p>
              <p className="text-gray-500 text-sm mt-2 font-mono">{fileName}</p>
            </motion.div>
          )}

          {extractedData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-lime-accent/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-lime-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Extraction Complete</p>
                    <p className="text-gray-500 text-sm font-mono">{fileName}</p>
                  </div>
                </div>
                <button
                  onClick={resetExtractor}
                  className="text-lime-accent text-sm hover:underline"
                >
                  Scan another
                </button>
              </div>

              <div className="bg-slate/20 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  <div className="col-span-5">Field</div>
                  <div className="col-span-5">Extracted Value</div>
                  <div className="col-span-2 text-right">Confidence</div>
                </div>
                
                {extractedData.map((row, index) => (
                  <motion.div
                    key={row.field}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-800 last:border-0 hover:bg-slate/30 transition-colors"
                  >
                    <div className="col-span-5 text-gray-400 text-sm">{row.field}</div>
                    <div className="col-span-5 text-white font-medium text-sm">{row.value}</div>
                    <div className="col-span-2 text-right">
                      <span className="px-2 py-1 bg-lime-accent/20 text-lime-accent rounded text-xs font-mono">
                        {row.confidence}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <motion.button
                  className="flex-1 px-6 py-4 bg-lime-accent text-obsidian font-semibold rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Export to CSV
                </motion.button>
                <motion.button
                  className="px-6 py-4 border border-white/10 rounded-xl text-white hover:bg-white/5 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Copy JSON
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
