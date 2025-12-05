import { useState } from 'react'
import './App.css'

function App() {
  const [selectedAgent, setSelectedAgent] = useState(null)

  const aiAgents = [
    {
      id: 1,
      name: 'Content Generator',
      description: 'AI-powered content creation tool that generates blog posts, articles, and creative writing.',
      status: 'Live',
      demoUrl: '#',
      features: ['Natural language processing', 'Multiple writing styles', 'SEO optimization']
    },
    {
      id: 2,
      name: 'Code Assistant',
      description: 'Intelligent coding companion that helps with code generation, debugging, and optimization.',
      status: 'Live',
      demoUrl: '#',
      features: ['Multiple languages', 'Code refactoring', 'Bug detection']
    },
    {
      id: 3,
      name: 'Data Analyzer',
      description: 'Advanced data analysis tool that processes and visualizes complex datasets.',
      status: 'Live',
      demoUrl: '#',
      features: ['Pattern recognition', 'Predictive analytics', 'Custom visualizations']
    },
    {
      id: 4,
      name: 'Customer Support Bot',
      description: 'Intelligent chatbot that handles customer inquiries with natural conversation.',
      status: 'Live',
      demoUrl: '#',
      features: ['24/7 availability', 'Multi-language support', 'Sentiment analysis']
    }
  ]

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">AI Agents Portfolio</h1>
          <nav>
            <a href="#agents">Agents</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h2 className="hero-title">Experience AI Agents in Action</h2>
          <p className="hero-subtitle">
            Explore our collection of intelligent AI agents. Each agent is live and ready to demonstrate its capabilities.
          </p>
        </div>
      </section>

      <section id="agents" className="agents-section">
        <div className="container">
          <h2 className="section-title">Live AI Agents</h2>
          <div className="agents-grid">
            {aiAgents.map((agent) => (
              <div 
                key={agent.id} 
                className="agent-card"
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="agent-header">
                  <h3>{agent.name}</h3>
                  <span className="status-badge">{agent.status}</span>
                </div>
                <p className="agent-description">{agent.description}</p>
                <div className="agent-features">
                  {agent.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                <button className="try-button">Try Live Demo →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="container">
          <h2 className="section-title">About This Portfolio</h2>
          <p className="about-text">
            This portfolio showcases a collection of working AI agents built to solve real-world problems.
            Each agent is live and interactive, allowing clients to experience the capabilities firsthand.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 AI Agents Portfolio. All rights reserved.</p>
        </div>
      </footer>

      {selectedAgent && (
        <div className="modal-overlay" onClick={() => setSelectedAgent(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAgent(null)}>×</button>
            <h2>{selectedAgent.name}</h2>
            <p>{selectedAgent.description}</p>
            <h3>Features:</h3>
            <ul>
              {selectedAgent.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button className="demo-button">Launch Demo</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
