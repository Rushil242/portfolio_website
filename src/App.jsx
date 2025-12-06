import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Chatbot from './components/Chatbot'
import HomePage from './pages/HomePage'
import InvoicePage from './pages/InvoicePage'
import ContentPage from './pages/ContentPage'
import ExtractorPage from './pages/ExtractorPage'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demos/invoice" element={<InvoicePage />} />
        <Route path="/demos/content" element={<ContentPage />} />
        <Route path="/demos/extractor" element={<ExtractorPage />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  )
}

export default App
