"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvoiceDemo from "@/components/demos/InvoiceDemo";
import SalesDemo from "@/components/demos/SalesDemo";
import SOPDemo from "@/components/demos/SOPDemo";
import ReviewDemo from "@/components/demos/ReviewDemo";

export default function DemoTabs() {
  return (
    <section className="py-20 bg-gray-50" id="demos">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            See the Agents in <span className="text-blue-600">Action</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Test all production agents right here. No sign-up required.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden min-h-[600px]">
          <Tabs defaultValue="finance" className="w-full">
            <div className="border-b border-gray-100 bg-gray-50/50 p-2">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-3xl mx-auto">
                <TabsTrigger value="finance">Finance Agent</TabsTrigger>
                <TabsTrigger value="sales">Sales Agent</TabsTrigger>
                <TabsTrigger value="review">Review Agent</TabsTrigger>
                <TabsTrigger value="ops">SOP Expert</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="finance" className="p-6 md:p-10 outline-none">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    Invoice Extraction Agent
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">Live Demo</span>
                  </h3>
                  <p className="text-gray-500">Upload an invoice to extract structured fields for accounting workflows.</p>
                </div>
                <InvoiceDemo />
              </div>
            </TabsContent>

            <TabsContent value="sales" className="p-6 md:p-10 outline-none">
              <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    Lead Qualification Agent
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-200">Interactive</span>
                  </h3>
                  <p className="text-gray-500">Chat as a prospect and see lead capture + prioritization update in real time.</p>
                </div>
                <SalesDemo />
              </div>
            </TabsContent>

            <TabsContent value="review" className="p-6 md:p-10 outline-none">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    Review Defender Agent
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full border border-orange-200">Live Demo</span>
                  </h3>
                  <p className="text-gray-500">Convert difficult public feedback into calm, professional responses instantly.</p>
                </div>
                <ReviewDemo />
              </div>
            </TabsContent>

            <TabsContent value="ops" className="p-6 md:p-10 outline-none">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    SOP Operations Expert
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full border border-purple-200">Live Demo</span>
                  </h3>
                  <p className="text-gray-500">Upload SOP documents and ask grounded operational questions.</p>
                </div>
                <SOPDemo />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
