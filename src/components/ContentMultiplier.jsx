import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Copy, CheckCircle, Linkedin, Instagram, Twitter, Loader, Image } from 'lucide-react'
import { GoogleGenAI } from '@google/genai'

export default function ContentMultiplier() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const generateContent = async () => {
    if (!input.trim() || isLoading) return
    
    setIsLoading(true)
    setResults(null)

    const prompt = `You are a social media content expert. Take this one-line draft and create 3 unique variations optimized for different platforms. Return ONLY valid JSON with no markdown formatting.

Draft: "${input}"

Return this exact JSON structure:
{
  "linkedin": "Professional, detailed version with industry insights (2-3 paragraphs)",
  "instagram": "Casual, engaging version with emoji suggestions and image idea in brackets [IMAGE: description]",
  "twitter": "Concise, punchy version under 280 characters with relevant hashtags"
}`

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
      
      if (!apiKey) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setResults({
          linkedin: `${input}\n\nIn today's rapidly evolving business landscape, this insight couldn't be more relevant. As industry leaders, we must embrace innovation and adapt to stay competitive.\n\nThe data shows that organizations implementing these strategies see 40% higher engagement rates. What's your take on this approach?`,
          instagram: `✨ ${input} ✨\n\n[IMAGE: Minimalist workspace with laptop, morning light streaming through window]\n\nThis changed everything for us 🚀\n\nDouble tap if you agree! 👇\n\n#productivity #growth #success #mindset #entrepreneurlife`,
          twitter: `${input.slice(0, 200)}\n\nThis is the future. 🚀\n\n#innovation #tech #business`,
        })
      } else {
        const ai = new GoogleGenAI({ apiKey })
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        })
        
        const text = response.text || ''
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          setResults(JSON.parse(jsonMatch[0]))
        }
      }
    } catch (error) {
      console.error('Content generation error:', error)
      setResults({
        linkedin: `Professional insight: ${input}. This resonates with current industry trends.`,
        instagram: `✨ ${input} [IMAGE: Inspiring visual] #trending`,
        twitter: `${input.slice(0, 250)} #innovation`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="border border-white/10 rounded-2xl backdrop-blur-2xl bg-obsidian/40 overflow-hidden">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-lime-accent/10 flex items-center justify-center">
            <Wand2 className="w-6 h-6 text-lime-accent" />
          </div>
          <div>
            <h3 className="font-grotesk text-2xl font-bold text-white">Content Multiplier</h3>
            <p className="text-gray-400 text-sm">One idea, three platforms</p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateContent()}
            placeholder="Enter your content idea..."
            className="w-full h-16 bg-slate/30 border border-white/10 rounded-xl px-6 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-lime-accent/50 focus:bg-slate/40 transition-all text-center"
          />
          <motion.button
            onClick={generateContent}
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-lime-accent text-obsidian font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Wand2 className="w-5 h-5" />
            )}
            Generate
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl p-6 animate-pulse bg-slate/20 h-64" />
              ))}
            </motion.div>
          )}

          {results && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="bg-gradient-to-b from-gray-100 to-white text-gray-900 rounded-xl overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">LinkedIn</span>
                  </div>
                  <motion.button
                    onClick={() => copyToClipboard(results.linkedin, 0)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedIndex === 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                    {results.linkedin}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                  padding: '2px'
                }}
              >
                <div className="bg-obsidian rounded-xl h-full">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center">
                        <Instagram className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-white">Instagram</span>
                    </div>
                    <motion.button
                      onClick={() => copyToClipboard(results.instagram, 1)}
                      className="p-2 text-gray-400 hover:text-pink-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {copiedIndex === 1 ? (
                        <CheckCircle className="w-4 h-4 text-lime-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                  <div className="p-4">
                    <div className="aspect-square bg-slate/30 rounded-lg mb-4 flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-600" />
                    </div>
                    <p className="text-gray-200 text-sm whitespace-pre-line leading-relaxed">
                      {results.instagram}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black text-white rounded-xl overflow-hidden border border-gray-800"
              >
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-black flex items-center justify-center border border-gray-700">
                      <Twitter className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">X / Twitter</span>
                  </div>
                  <motion.button
                    onClick={() => copyToClipboard(results.twitter, 2)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {copiedIndex === 2 ? (
                      <CheckCircle className="w-4 h-4 text-lime-accent" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
                <div className="p-4">
                  <p className="text-gray-100 text-sm whitespace-pre-line leading-relaxed">
                    {results.twitter}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
