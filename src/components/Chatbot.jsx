import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { GoogleGenAI } from '@google/genai'

const SYSTEM_PROMPT = `You are Nexus Assistant, the AI concierge for Rushil and Dhanush's AI Automation Agency. 
Your personality: Professional, concise, and sales-oriented.
Your goals:
1. Answer questions about the agency's services (AI automation, workflow optimization, custom AI solutions)
2. Explain how we save businesses time and money through automation
3. Guide users toward booking a strategy call
Keep responses brief (2-3 sentences max). Always end with a soft call-to-action when appropriate.`

export default function Chatbot() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm Nexus, your AI assistant. How can I help you explore our automation solutions today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (location.pathname === '/') {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [location.pathname])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
      
      if (!apiKey) {
        const mockResponses = [
          "Great question! Our AI solutions typically save businesses 40-60% on operational costs. Want to see specific case studies? I'd recommend booking a quick call with our team.",
          "We specialize in automating repetitive tasks like data entry, customer support, and document processing. The ROI is usually visible within the first month!",
          "Absolutely! Our team handles everything from custom chatbots to full workflow automation. Would you like to schedule a free strategy session?",
        ]
        await new Promise(resolve => setTimeout(resolve, 1000))
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: mockResponses[Math.floor(Math.random() * mockResponses.length)]
        }])
      } else {
        const ai = new GoogleGenAI({ apiKey })
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: "Understood. I'll act as Nexus Assistant." }] },
            ...messages.map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
          ]
        })
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response.text || "I apologize, I couldn't process that. Could you rephrase?"
        }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having a moment. Could you try again? Or feel free to email us directly!"
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-lime-accent text-obsidian rounded-full shadow-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)' }}
          >
            <div className="bg-slate-900 p-4 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-lime-accent" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-lime-accent rounded-full border-2 border-slate-900" />
                </div>
                <div>
                  <h3 className="font-grotesk font-semibold text-white text-sm">Nexus Assistant</h3>
                  <p className="text-xs text-lime-accent">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-800">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-slate-700' : 'bg-slate-900'
                  }`}>
                    {message.role === 'user' ?
                      <User className="w-3.5 h-3.5 text-gray-300" /> :
                      <Bot className="w-3.5 h-3.5 text-lime-accent" />
                    }
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-slate-700 text-white rounded-2xl rounded-br-sm'
                      : 'bg-slate-900 text-gray-100 rounded-2xl rounded-bl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-lime-accent" />
                  </div>
                  <div className="bg-slate-900 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-lime-accent/60 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-5 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-lime-accent transition-colors"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="w-11 h-11 bg-lime-accent text-obsidian rounded-full flex items-center justify-center disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
