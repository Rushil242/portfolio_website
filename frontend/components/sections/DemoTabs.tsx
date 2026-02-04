"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceDemo from "@/components/demos/InvoiceDemo";
import SalesDemo from "@/components/demos/SalesDemo";

export default function DemoTabs() {
  return (
    <section className="py-20 bg-gray-50" id="demos">
      <div className="container px-4 mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            See the Agents in <span className="text-blue-600">Action</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Test our most popular agents right here. No sign-up required.
          </p>
        </div>

        {/* The Interactive Dashboard */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[600px]">
          <Tabs defaultValue="finance" className="w-full">
            
            {/* The Tab Headers */}
            <div className="border-b border-gray-100 bg-gray-50/50 p-2">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="finance">Finance Agent</TabsTrigger>
                <TabsTrigger value="sales">Sales Agent</TabsTrigger>
                <TabsTrigger value="ops">SOP Expert</TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: FINANCE (Live) */}
            <TabsContent value="finance" className="p-6 md:p-10 outline-none">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            Invoice Extraction Agent
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">Live Demo</span>
                        </h3>
                        <p className="text-gray-500">Upload an invoice to see how we extract structured data for your accounting software.</p>
                    </div>
                    <InvoiceDemo />
                </div>
            </TabsContent>

            {/* TAB 2: SALES (Now Live) */}
            <TabsContent value="sales" className="p-6 md:p-10 outline-none">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            Lead Qualification Agent
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-200">Interactive</span>
                        </h3>
                        <p className="text-gray-500">
                            Pretend you are a customer looking for a house. Watch the "CRM" on the right update automatically when you give your budget.
                        </p>
                    </div>
                    <SalesDemo />
                </div>
            </TabsContent>

             {/* TAB 3: OPS (Placeholder for now) */}
             <TabsContent value="ops" className="p-10 text-center">
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <p className="text-gray-400">SOP Agent Loading...</p>
                </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </section>
  );
}