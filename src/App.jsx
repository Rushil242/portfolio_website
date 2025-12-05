import { motion } from 'framer-motion'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import Chatbot from './components/Chatbot'
import InvoiceEngine from './components/InvoiceEngine'
import ContentMultiplier from './components/ContentMultiplier'
import DataExtractor from './components/DataExtractor'
import TeamSection from './components/TeamSection'
import Footer from './components/Footer'

function PlaygroundSection({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian to-slate">
      <Hero />
      <TrustBar />
      
      <section id="playground" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-grotesk text-4xl md:text-5xl font-bold text-white mb-4">
              The <span className="text-gradient">Playground</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Don't take our word for it—try our AI tools yourself. 
              These are live demos of systems we build for clients.
            </p>
          </motion.div>
          
          <div className="space-y-12">
            <PlaygroundSection>
              <InvoiceEngine />
            </PlaygroundSection>
            
            <PlaygroundSection>
              <ContentMultiplier />
            </PlaygroundSection>
            
            <PlaygroundSection>
              <DataExtractor />
            </PlaygroundSection>
          </div>
        </div>
      </section>
      
      <TeamSection />
      <Footer />
      <Chatbot />
    </div>
  )
}

export default App
