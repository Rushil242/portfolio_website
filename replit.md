# AI Agents Portfolio

## Overview
This is a modern portfolio website built with React and Vite, designed to showcase working AI agents that clients can interact with live. The website features a clean, professional design with a dark theme and gradient accents.

## Project Structure

```
/
├── src/
│   ├── App.jsx          # Main application component with AI agents showcase
│   ├── App.css          # Application styles with modern gradients
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration (port 5000, host allowance)
├── package.json         # Project dependencies and scripts
└── .gitignore          # Git ignore rules
```

## Tech Stack
- **Frontend Framework**: React 19.2.1
- **Build Tool**: Vite 7.2.6
- **Styling**: Vanilla CSS with modern gradients and animations
- **Language**: JavaScript (ES Modules)

## Development

### Running Locally
The project is configured to run on port 5000 with the following command:
```bash
npm run dev
```

The Vite dev server is configured to:
- Bind to `0.0.0.0:5000` for Replit compatibility
- Allow all hosts for proxy support
- Enable HMR with WebSocket configuration

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment
The project is configured for static deployment:
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Deployment Type**: Static site

## Features
- Hero section with gradient title
- AI Agents showcase grid with 4 sample agents:
  - Content Generator
  - Code Assistant
  - Data Analyzer
  - Customer Support Bot
- Interactive agent cards with hover effects
- Modal popup for detailed agent information
- Fully responsive design
- Modern UI with gradient accents and glass-morphism effects

## Configuration Notes
- Vite config includes `allowedHosts: true` to work with Replit's proxy system
- HMR is configured for WebSocket tunneling through Replit
- All environment requirements are handled through the Vite configuration

## Recent Changes
- **2024-12-05**: Initial project setup
  - Created React + Vite portfolio website
  - Configured for Replit environment (port 5000, host allowance)
  - Implemented responsive AI agents showcase
  - Set up deployment configuration for static hosting

## User Preferences
None specified yet.
