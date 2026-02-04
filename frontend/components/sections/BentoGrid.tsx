"use client";

import { motion } from "framer-motion";
import { 
  Bot, 
  Receipt, 
  MessageSquareWarning, 
  CalendarClock, 
  ArrowUpRight 
} from "lucide-react";
import Link from "next/link"; // <--- Added Link component

const features = [
  {
    id: 1,
    title: "The 24/7 Sales Associate",
    desc: "Qualifies leads, answers FAQs, and books meetings.",
    icon: <Bot className="w-8 h-8 text-blue-500" />,
    stats: "+40% Conversion",
    colSpan: "md:col-span-2", 
    bg: "bg-blue-50/50",
    href: "#demos" // <--- Points to the Demo Section
  },
  {
    id: 2,
    title: "Invoice Extractor",
    desc: "Turns messy PDF invoices into structured Excel data.",
    icon: <Receipt className="w-8 h-8 text-green-600" />,
    stats: "Save 10hrs/week",
    colSpan: "md:col-span-1",
    bg: "bg-green-50/50",
    href: "#demos"
  },
  {
    id: 3,
    title: "Review Defender",
    desc: "Auto-drafts polite replies to Google/Yelp reviews.",
    icon: <MessageSquareWarning className="w-8 h-8 text-orange-500" />,
    stats: "Protect Brand",
    colSpan: "md:col-span-1",
    bg: "bg-orange-50/50",
    href: "#demos"
  },
  {
    id: 4,
    title: "SOP Operations Expert",
    desc: "Answers employee questions using your PDF manuals.",
    icon: <CalendarClock className="w-8 h-8 text-purple-500" />,
    stats: "Instant Answers",
    colSpan: "md:col-span-2", 
    bg: "bg-purple-50/50",
    href: "#demos"
  },
];

export default function BentoGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            A Complete <span className="text-blue-600">Automation Suite</span>
          </h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
            Click any agent below to test it in the live playground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Link key={feature.id} href={feature.href} className={feature.colSpan}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, cursor: "pointer" }}
                className={`group relative h-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${feature.bg}`} />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-gray-50 p-3 group-hover:bg-white group-hover:shadow-sm transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                    <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                      {feature.stats}
                    </span>
                    <div className="flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Try Demo <ArrowUpRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}