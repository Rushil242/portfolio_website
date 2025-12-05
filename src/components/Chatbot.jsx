import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { GoogleGenAI } from '@google/genai'

const SYSTEM_PROMPT = `You are Nexus Assistant, the AI concierge for Rushil and Dhanush's AI Automation Agency. 
Your personality: Professional, concise, and sales-oriented.
Your goals:
1. Answer questions about the agency's services (AI automation, workflow optimization, custom AI solutions)
2. Explain how we save businesses time and money through automation
3. Guide users toward booking a strategy call
Keep responses brief (2-3 sentences max). Always end with a soft call-to-action when appropriate.`

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm Nexus, your AI assistant. How can I help you learn about our automation solutions today?" }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

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
        className="fixed bottom-6 right-6 z-50 p-4 bg-lime-accent text-obsidian rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(217, 249, 157, 0.3)',
            '0 0 40px rgba(217, 249, 157, 0.5)',
            '0 0 20px rgba(217, 249, 157, 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] glass-card rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="bg-gradient-to-r from-lime-accent/20 to-lime-500/20 p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lime-accent/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-lime-accent" />
                </div>
                <div>
                  <h3 className="font-grotesk font-semibold text-white">Nexus Assistant</h3>
                  <p className="text-xs text-gray-400">AI-Powered Support</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-slate' : 'bg-lime-accent/20'
                  }`}>
                    {message.role === 'user' ? 
                      <User className="w-4 h-4 text-gray-300" /> : 
                      <Bot className="w-4 h-4 text-lime-accent" />
                    }
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-lime-accent text-obsidian rounded-br-md' 
                      : 'bg-slate/50 text-gray-200 rounded-bl-md'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-lime-accent/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-lime-accent" />
                  </div>
                  <div className="bg-slate/50 p-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-lime-accent rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about our services..."
                  className="flex-1 bg-slate/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-lime-accent/50"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={isLoading}
                  className="p-3 bg-lime-accent text-obsidian rounded-xl disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
