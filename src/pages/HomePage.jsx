import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import TeamSection from '../components/TeamSection'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian to-slate">
      <Hero />
      <TrustBar />
      <TeamSection />
      <Footer />
    </div>
  )
}
