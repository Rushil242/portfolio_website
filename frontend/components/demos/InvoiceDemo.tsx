"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function InvoiceDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null); // Reset previous result
    }
  };

  const processInvoice = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/invoice`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[400px]">
      
      {/* LEFT: UPLOAD ZONE */}
      <Card className="p-6 flex flex-col justify-center items-center border-dashed border-2 border-gray-200 hover:border-blue-400 transition-colors bg-gray-50/50">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-8 h-8" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Invoice</h3>
        <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
          Upload any image or PDF invoice to see the AI extract data instantly.
        </p>

        <input 
          type="file" 
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden" 
          id="invoice-upload"
        />
        
        <label htmlFor="invoice-upload">
            <Button variant="outline" className="cursor-pointer" asChild>
                <span>{file ? file.name : "Select File"}</span>
            </Button>
        </label>

        <Button 
          onClick={processInvoice} 
          disabled={!file || loading}
          className="mt-4 w-full max-w-xs bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting...
            </>
          ) : (
            <>Run Extraction <ArrowRight className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </Card>

      {/* RIGHT: RESULTS TABLE (The "Excel" View) */}
      <Card className="p-0 overflow-hidden border-gray-200 bg-white relative">
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"/>
                <div className="w-3 h-3 rounded-full bg-yellow-400"/>
                <div className="w-3 h-3 rounded-full bg-green-400"/>
            </div>
            <span className="text-xs font-mono text-gray-500">ledger_entry.json</span>
        </div>

        <div className="p-6 h-full overflow-auto">
            {!result ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 opacity-50">
                    <FileText className="w-12 h-12" />
                    <p>Waiting for data...</p>
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="flex items-center text-green-600 mb-4">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">Extraction Complete</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 block text-xs uppercase tracking-wider">Vendor</span>
                            <span className="font-bold text-gray-900 text-lg">{result.vendor_name}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 block text-xs uppercase tracking-wider">Total</span>
                            <span className="font-bold text-green-600 text-lg">${result.total_amount}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 block text-xs uppercase tracking-wider">Date</span>
                            <span className="font-medium text-gray-700">{result.date}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 block text-xs uppercase tracking-wider">Tax</span>
                            <span className="font-medium text-gray-700">${result.tax_amount || "0.00"}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
      </Card>
    </div>
  );
}