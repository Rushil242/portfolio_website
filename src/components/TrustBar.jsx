import { motion } from 'framer-motion'

const techStack = [
  { name: 'Python', icon: '🐍' },
  { name: 'Gemini AI', icon: '✨' },
  { name: 'React', icon: '⚛️' },
  { name: 'Stripe', icon: '💳' },
  { name: 'TensorFlow', icon: '🧠' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'AWS', icon: '☁️' },
]

export default function TrustBar() {
  const doubledStack = [...techStack, ...techStack]
  
  return (
    <section className="py-12 bg-obsidian/50 border-y border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <motion.p
          className="text-center text-sm text-gray-500 uppercase tracking-widest"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Powered by Industry-Leading Technology
        </motion.p>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-obsidian to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-obsidian to-transparent z-10" />
        
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {doubledStack.map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-gray-400"
            >
              <span className="text-2xl">{tech.icon}</span>
              <span className="text-lg font-medium">{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
