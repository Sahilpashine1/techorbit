# TechOrbit 🚀

**India's Smartest AI-Powered Tech Career Platform**

TechOrbit is a comprehensive career intelligence platform designed for developers, tech professionals, and freshers. It combines real-time job aggregation, AI-driven resume analysis, tech news, and smart networking—all wrapped in a sleek, dark-mode First Next.js 15+ architecture.

## 🌟 Key Features

* **Global & Local Job Board**: Aggregates live jobs from LinkedIn, Indeed, Glassdoor, Naukri, and more. Features an interactive toggle to switch between India-specific and Worldwide roles, alongside salary estimation algorithms.
* **AI Career Guidance (Resume Analyzer)**: Leverages Google Gemini and PDF parsing to scan your uploaded resume, rate your ATS score, and generate actionable improvement insights.
* **Tech News Pulse**: Real-time technology news aggregator pulling from Reddit (`/r/programming`, `/r/technology`) and top-tier global tech publications.
* **Smart Networking**: Profile integration and social elements to find mentors and connect with peers.
* **Authentication**: Seamless user login/registration powered by NextAuth and MongoDB/Mongoose.
* **Modern UI/UX**: Built with Tailwind CSS v4, Framer Motion, and custom glassmorphism styles for a premium user experience.

## 🛠️ Technology Stack

* **Framework**: React 19 + Next.js 16.1.6 (App Router)
* **Styling**: Tailwind CSS v4 + Custom CSS (Glassmorphism & Gradients)
* **Animations**: Framer Motion
* **Database**: MongoDB (Mongoose ODMs)
* **Authentication**: NextAuth.js + Bcrypt
* **AI & Processing**: Google Gemini API, `pdf-parse` (Server-side document reading)
* **Web Scraping / APIs**: Apify Client, RSS Parser, Adzuna/Jsearch Integrations

## 🚀 Getting Started

### Prerequisites
* Node.js v20+
* MongoDB URI
* API Keys for Gemini, Apify, Adzuna (optional for extended live job access)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/techorbit.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your environment variables:
   ```env
   MONGODB_URI=your_mongo_connection_string
   NEXTAUTH_SECRET=your_jwt_secret
   NEXTAUTH_URL=http://localhost:3000
   RAPIDAPI_KEY=optional_jsearch_key
   ADZUNA_APP_ID=optional_adzuna_id
   ADZUNA_API_KEY=optional_adzuna_key
   APIFY_API_TOKEN=optional_apify_token
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment
Ready for Vercel. Ensure `pdf-parse` is added to `serverExternalPackages` in `next.config.ts`, deploy your project, and add your custom domains.
