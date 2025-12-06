import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Calendar } from 'lucide-react'

export default function Navigation() {
  const [isDemosOpen, setIsDemosOpen] = useState(false)
  const location = useLocation()

  const demos = [
    { name: 'Invoice Engine', path: '/demos/invoice' },
    { name: 'Content Multiplier', path: '/demos/content' },
    { name: 'Data Extractor', path: '/demos/extractor' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-obsidian/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-grotesk text-2xl font-bold text-white tracking-tight">
            NEXUS
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-lime-accent' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              to="/#architects"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Team
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIsDemosOpen(true)}
              onMouseLeave={() => setIsDemosOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Live Demos
                <ChevronDown className={`w-4 h-4 transition-transform ${isDemosOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDemosOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {demos.map((demo) => (
                      <Link
                        key={demo.path}
                        to={demo.path}
                        className={`block px-4 py-3 text-sm transition-colors ${
                          isActive(demo.path)
                            ? 'bg-lime-accent/10 text-lime-accent'
                            : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {demo.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.a
            href="#contact"
            className="flex items-center gap-2 px-6 py-2.5 bg-lime-accent text-obsidian font-semibold rounded-lg text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="w-4 h-4" />
            Book Strategy Call
          </motion.a>
        </div>
      </div>
    </nav>
  )
}
