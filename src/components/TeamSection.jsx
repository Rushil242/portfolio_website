import { motion } from 'framer-motion'
import { Linkedin, Mail } from 'lucide-react'

const founders = [
  {
    name: 'Rushil CV',
    role: 'Lead AI Architect',
    image: 'https://via.placeholder.com/150',
    linkedin: 'https://linkedin.com/in/rushilcv',
    email: 'rushil.cv26@gmail.com',
  },
  {
    name: 'Dhanush Battu',
    role: 'Head of Operations & Strategy',
    image: 'https://via.placeholder.com/150',
    linkedin: 'https://linkedin.com/in/dhanushbattu',
    email: 'dhanushbattu123@gmail.com',
  },
]

export default function TeamSection() {
  return (
    <section id="architects" className="py-24 bg-gradient-to-b from-slate/30 to-obsidian">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-grotesk text-4xl md:text-5xl font-bold text-white mb-4">
            The <span className="text-gradient">Architects</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Meet the minds behind the automation revolution
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              className="glass-card rounded-2xl p-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="relative inline-block mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-lime-400"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(163, 230, 53, 0.3)',
                      '0 0 40px rgba(163, 230, 53, 0.5)',
                      '0 0 20px rgba(163, 230, 53, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-obsidian relative z-10"
                />
              </motion.div>
              
              <h3 className="font-grotesk text-2xl font-bold text-white mb-2">
                {founder.name}
              </h3>
              <p className="text-lime-accent font-medium mb-6">{founder.role}</p>
              
              <div className="flex justify-center gap-4">
                <motion.a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 glass-card rounded-full text-gray-400 hover:text-lime-accent hover:border-lime-accent/50 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href={`mailto:${founder.email}`}
                  className="p-3 glass-card rounded-full text-gray-400 hover:text-lime-accent hover:border-lime-accent/50 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail className="w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
