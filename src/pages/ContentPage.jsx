import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Copy, CheckCircle, Linkedin, Instagram, Twitter, Loader, Image, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GoogleGenAI } from '@google/genai'

export default function ContentPage() {
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
    <div className="min-h-screen bg-obsidian pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-lime-accent transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-grotesk text-4xl font-bold text-white mb-3">Content Multiplier</h1>
          <p className="text-gray-400 text-lg">Transform one idea into platform-optimized content</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 mb-8">
            <label className="text-sm font-medium text-gray-300 mb-3 block">Enter Your Raw Idea</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your content idea here..."
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-accent transition-colors resize-none"
            />
            <motion.button
              onClick={generateContent}
              disabled={isLoading}
              className="mt-4 w-full px-6 py-4 bg-lime-accent text-obsidian font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Content
                </>
              )}
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
                  <div key={i} className="rounded-xl p-6 animate-pulse bg-slate-900 border border-slate-800 h-64" />
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
                  className="bg-gradient-to-b from-gray-100 to-white text-gray-900 rounded-xl overflow-hidden border border-gray-200"
                >
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                        <Linkedin className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">LinkedIn</span>
                    </div>
                    <motion.button
                      onClick={() => copyToClipboard(results.linkedin, 0)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
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
                  <div className="p-5">
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
                  <div className="bg-slate-900 rounded-xl h-full border border-slate-800">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center">
                          <Instagram className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-white">Instagram</span>
                      </div>
                      <motion.button
                        onClick={() => copyToClipboard(results.instagram, 1)}
                        className="p-2 text-gray-400 hover:text-pink-400 transition-colors rounded-lg hover:bg-slate-800"
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
                    <div className="p-5">
                      <div className="aspect-square bg-slate-800 rounded-lg mb-4 flex items-center justify-center border border-slate-700">
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
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-900"
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
                  <div className="p-5">
                    <p className="text-gray-100 text-sm whitespace-pre-line leading-relaxed">
                      {results.twitter}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
