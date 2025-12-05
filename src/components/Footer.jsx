import { motion } from 'framer-motion'
import { Calendar, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-16 bg-obsidian border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div>
            <h3 className="font-grotesk text-2xl font-bold text-white mb-2">
              Ready to Automate?
            </h3>
            <p className="text-gray-400">
              Let's discuss how AI can transform your business.
            </p>
          </div>
          
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-lime-accent text-obsidian font-semibold rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="w-5 h-5" />
            Book Strategy Call
            <ArrowUpRight className="w-5 h-5" />
          </motion.a>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10">
          <div className="flex gap-6">
            <a href="#playground" className="text-gray-400 hover:text-lime-accent transition-colors">
              Demos
            </a>
            <a href="#architects" className="text-gray-400 hover:text-lime-accent transition-colors">
              Team
            </a>
            <a href="#contact" className="text-gray-400 hover:text-lime-accent transition-colors">
              Contact
            </a>
          </div>
          
          <p className="text-gray-500 text-sm">
            © 2024 Nexus AI Agency. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
