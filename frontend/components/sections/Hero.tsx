"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react"; // Free icons

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-center bg-white bg-dot-pattern overflow-hidden">
      
      {/* 1. Subtle Background Gradient (Focus light) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none" />
      
      <div className="z-10 container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        
        {/* 2. Trust Badge (The Psychology Play) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          Available for Q1 Projects
        </motion.div>

        {/* 3. The "Pain Point" Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight lg:text-6xl text-gray-900 max-w-4xl"
        >
          Automate your busy work with <span className="text-blue-600">Intelligent Agents</span>.
        </motion.h1>

        {/* 4. The Benefit Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
        >
          Don't hire more staff. Hire AI. I build custom, secure automation agents that handle your <span className="font-semibold text-gray-800">Sales, Support, and Data Entry</span> 24/7.
        </motion.p>

        {/* 5. The "Action" Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 min-w-[300px]"
        >
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 text-lg px-8">
            Try the Live Demos <Zap className="ml-2 h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="lg" className="text-gray-700 border-gray-300 hover:bg-gray-50 text-lg px-8">
            Book a Strategy Call
          </Button>
        </motion.div>

        {/* 6. The "Trust Signals" (Bank-grade reassurance) */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 0.5 }}
           className="pt-8 flex items-center space-x-8 text-sm text-gray-400 font-medium"
        >
            <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1"/> 100% Data Privacy</div>
            <div className="flex items-center"><ArrowRight className="w-4 h-4 mr-1"/> No Monthly Fees</div>
            <div className="flex items-center"><Zap className="w-4 h-4 mr-1"/> Deployed in 48 Hours</div>
        </motion.div>
      </div>
    </section>
  );
}