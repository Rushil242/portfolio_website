# Nexus AI Agency Portfolio

## Overview
A production-ready, high-performance portfolio website for an AI Automation Agency founded by Rushil CV and Dhanush Battu. The site demonstrates technical competence through live interactive demos ("Micro-Apps") and is designed to convert high-ticket international clients.

## Tech Stack
- **Frontend**: React 19 + Vite 7
- **Styling**: Tailwind CSS with custom design system
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **AI Engine**: Google Gemini API (@google/genai)
- **Utilities**: jsPDF (PDF generation), xlsx (Excel parsing)

## Design System
- **Theme**: "High-Finance Tech" - authoritative, clean, expensive
- **Canvas Colors**: Deep Obsidian (#0B0F19) to Slate (#1E293B)
- **Accent**: Electric Lime (#D9F99D)
- **Typography**: Space Grotesk (headers), Inter (body)
- **Effects**: Heavy glassmorphism with white noise textures

## Project Structure
```
/
├── src/
│   ├── App.jsx                    # Main app with layout
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # Global styles + Tailwind
│   └── components/
│       ├── Hero.jsx               # Hero section with animations
│       ├── TrustBar.jsx           # Tech stack marquee
│       ├── Chatbot.jsx            # Gemini-powered chat widget
│       ├── InvoiceEngine.jsx      # PDF invoice generator
│       ├── ContentMultiplier.jsx  # Social media content AI
│       ├── DataExtractor.jsx      # Document parsing demo
│       ├── TeamSection.jsx        # Founders section
│       └── Footer.jsx             # Footer with CTA
├── index.html                     # HTML template
├── vite.config.js                 # Vite config (port 5000)
├── tailwind.config.js             # Custom Tailwind theme
└── package.json                   # Dependencies
```

## Interactive Demos (Micro-Apps)

### 1. Agency Brain Chatbot
- Floating chat widget powered by Gemini AI
- Professional, sales-oriented persona "Nexus Assistant"
- Falls back to mock responses if API key missing

### 2. Instant Invoice Engine
- Split-screen UI (input vs. live preview)
- Manual form input or drag-drop .xlsx bulk import
- PDF generation with jsPDF
- Success animations

### 3. Content Multiplier
- One-line input generates 3 platform variations
- LinkedIn (professional), Instagram (casual), Facebook (community)
- One-click copy functionality
- Gemini-powered with mock fallback

### 4. Document Data Extractor
- Scanner visual with animated laser line
- Simulates PDF/invoice extraction
- Clean React table output with confidence scores

## Founders Section
- Rushil CV - Lead AI Architect
- Dhanush Battu - Head of Operations & Strategy
- Glowing ring borders with hover effects
- LinkedIn and email links

## Environment Variables
- `VITE_GEMINI_API_KEY` - Required for live AI features (optional, has mock fallback)

## Development
```bash
npm run dev      # Start dev server on port 5000
npm run build    # Build for production
npm run preview  # Preview production build
```

## Deployment
- **Type**: Static site
- **Build**: `npm run build`
- **Output**: `dist/`

## Configuration Notes
- Vite configured with `allowedHosts: true` for Replit proxy
- HMR uses WSS protocol for Replit tunneling
- All demos work without API key (using mock responses)

## Recent Changes
- **2024-12-05**: Complete rebuild
  - Implemented "High-Finance Tech" design system
  - Created 4 interactive AI demo micro-apps
  - Added Gemini AI integration with fallbacks
  - Built responsive layout with Framer Motion animations
  - Set up static deployment configuration

## User Preferences
None specified yet.
