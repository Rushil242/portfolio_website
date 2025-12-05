import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Copy, CheckCircle, Linkedin, Instagram, Facebook, Loader } from 'lucide-react'
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
  "facebook": "Community-focused, conversational version that encourages discussion"
}`

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
      
      if (!apiKey) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setResults({
          linkedin: `🎯 ${input}\n\nIn today's rapidly evolving business landscape, this insight couldn't be more relevant. As leaders, we must embrace change and innovation to stay competitive.\n\nThe key takeaway? Action beats perfection every time. What steps are you taking to implement this in your organization?`,
          instagram: `✨ ${input} ✨\n\n[IMAGE: Minimalist workspace with laptop and coffee, morning light]\n\nDouble tap if you agree! 👇\n\n#productivity #motivation #success #mindset`,
          facebook: `Hey everyone! 👋\n\n${input}\n\nI've been thinking about this a lot lately and wanted to share with our amazing community. What are your thoughts? Have you experienced something similar?\n\nDrop a comment below - I'd love to hear your perspective! 💬`,
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
        facebook: `Hey community! ${input} - What do you think?`,
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

  const platforms = [
    { key: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-500/20 text-blue-400' },
    { key: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-500/20 text-pink-400' },
    { key: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600/20 text-blue-300' },
  ]

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-lime-accent/20 flex items-center justify-center">
          <Wand2 className="w-6 h-6 text-lime-accent" />
        </div>
        <div>
          <h3 className="font-grotesk text-xl font-bold text-white">Content Multiplier</h3>
          <p className="text-gray-400 text-sm">One idea → Three platforms</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateContent()}
            placeholder="Enter your content idea in one line..."
            className="flex-1 bg-slate/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-lime-accent/50"
          />
          <motion.button
            onClick={generateContent}
            disabled={isLoading}
            className="px-6 py-4 bg-lime-accent text-obsidian font-semibold rounded-xl flex items-center gap-2 disabled:opacity-50"
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
              className="grid md:grid-cols-3 gap-4"
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-slate/50 rounded w-1/3 mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate/50 rounded w-full" />
                    <div className="h-3 bg-slate/50 rounded w-5/6" />
                    <div className="h-3 bg-slate/50 rounded w-4/6" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {results && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-4"
            >
              {platforms.map((platform, index) => (
                <motion.div
                  key={platform.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${platform.color}`}>
                      <platform.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{platform.name}</span>
                    </div>
                    <motion.button
                      onClick={() => copyToClipboard(results[platform.key], index)}
                      className="p-2 text-gray-400 hover:text-lime-accent transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {copiedIndex === index ? (
                        <CheckCircle className="w-4 h-4 text-lime-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                    {results[platform.key]}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
