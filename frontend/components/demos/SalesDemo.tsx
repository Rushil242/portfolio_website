"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, RefreshCw, Trophy } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Lead = {
  lead_score: number;
  budget: string;
  location: string;
  status: string;
  summary: string;
};

export default function SalesDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]); // Store the full list
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch the leads when the component loads
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`);
      const data = await res.json();
      setLeads(data);
    } catch {
      console.error("Failed to fetch leads");
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: [...messages, userMsg], 
          message: userMsg.content,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);

      // 2. IF LEAD CAPTURED: Refresh the table instantly
      if (data.lead_captured) {
        await fetchLeads(); // This pulls the new sorted list
      }

    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
      
      {/* LEFT: CHATBOT (Same as before) */}
      <Card className="md:col-span-2 flex flex-col overflow-hidden border-gray-200 shadow-sm bg-white">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900">Sarah (Sales Agent)</h3>
                <p className="text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"/> 
                    Online
                </p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
            {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                    <p>Say &quot;Hi&quot; to start qualifying...</p>
                </div>
            )}
            
            {messages.map((m, i) => (
                <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                    }`}>
                        {m.content}
                    </div>
                </motion.div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none text-xs text-gray-500 animate-pulse">
                        Sarah is typing...
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <Input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1"
                />
                <Button type="submit" disabled={loading || !input.trim()} className="bg-blue-600">
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
      </Card>

      {/* RIGHT: LIVE RANKED SPREADSHEET (The New View) */}
      <Card className="md:col-span-1 border-gray-200 shadow-md flex flex-col overflow-hidden bg-white">
        {/* Table Header */}
        <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
            <h3 className="font-semibold text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400"/> Live Lead Ranking
            </h3>
            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">HubSpot Sync</span>
        </div>

        {/* Table Header Row */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
            <div className="col-span-1 text-center">Score</div>
            <div className="col-span-3">Details</div>
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <AnimatePresence>
                {leads.map((lead, i) => (
                    <motion.div 
                        key={i}
                        layout // Enables smooth sorting animation
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`grid grid-cols-4 gap-2 p-3 border-b border-gray-100 bg-white hover:bg-blue-50 transition-colors ${i === 0 ? "bg-yellow-50/50" : ""}`}
                    >
                        {/* Score Column */}
                        <div className="col-span-1 flex flex-col items-center justify-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                                lead.lead_score >= 80 ? "border-green-500 text-green-700 bg-green-50" : 
                                lead.lead_score >= 50 ? "border-yellow-500 text-yellow-700 bg-yellow-50" : 
                                "border-gray-300 text-gray-500"
                            }`}>
                                {lead.lead_score}
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className="col-span-3 flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-sm text-gray-800 truncate">{lead.location || "Unknown"}</span>
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{lead.status}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Budget: {lead.budget || "N/A"}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1 line-clamp-1 italic">
                                &quot;{lead.summary}&quot;
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {leads.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">
                    No leads yet. Start chatting to populate the CRM.
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="p-2 bg-gray-100 text-center text-[10px] text-gray-400">
            <RefreshCw className="w-3 h-3 inline mr-1 animate-spin-slow"/> 
            Auto-sorting by priority...
        </div>
      </Card>
    </div>
  );
}