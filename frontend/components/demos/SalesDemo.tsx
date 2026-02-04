"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, CheckCircle, Sparkles } from "lucide-react"; // Icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function SalesDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState<any | null>(null); // To store the "captured" lead
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
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
      // Send the WHOLE history to the backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agent/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: [...messages, userMsg], // Send previous + new message
          message: userMsg.content,
        }),
      });

      const data = await res.json();
      
      // Add Bot Reply
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);

      // DID WE CAPTURE A LEAD?
      if (data.lead_captured) {
        setLeadData(data.data); // Update the CRM panel on the right
      }

    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px]">
      
      {/* LEFT: CHAT INTERFACE (Span 2 columns) */}
      <Card className="md:col-span-2 flex flex-col overflow-hidden border-gray-200 shadow-sm bg-white">
        
        {/* Chat Header */}
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

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
            {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                    <p>Say "Hi" to start qualifying...</p>
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

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white">
            <form 
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-2"
            >
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

      {/* RIGHT: LIVE CRM (Span 1 column) */}
      <Card className="md:col-span-1 bg-gray-900 text-white border-none shadow-xl flex flex-col relative overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 blur-[60px] opacity-20 pointer-events-none" />

        <div className="p-4 border-b border-gray-800">
            <h3 className="font-mono text-sm text-gray-400 uppercase tracking-widest">Live CRM Feed</h3>
        </div>

        <div className="flex-1 p-6 flex items-center justify-center">
            {!leadData ? (
                <div className="text-center opacity-40 space-y-3">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 mx-auto flex items-center justify-center">
                        <User className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-mono">Waiting for qualified lead...</p>
                </div>
            ) : (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full space-y-6"
                >
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-3 ring-1 ring-green-500/50">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Lead Captured!</h2>
                        <p className="text-green-400 text-sm font-medium">Synced to HubSpot</p>
                    </div>

                    <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span className="text-gray-400 text-xs uppercase">Score</span>
                            <span className="font-bold text-yellow-400 text-xl">{leadData.lead_score}/100</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Budget</span>
                            <span className="font-medium">{leadData.budget || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Location</span>
                            <span className="font-medium text-right max-w-[120px] truncate">{leadData.location || "N/A"}</span>
                        </div>
                        <div className="pt-2">
                            <span className="block text-gray-400 text-xs uppercase mb-1">AI Analysis</span>
                            <p className="text-xs text-gray-300 italic">"{leadData.summary}"</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
      </Card>
    </div>
  );
}