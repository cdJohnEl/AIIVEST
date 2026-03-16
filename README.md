# 🚀 AIVEST — AI-Powered Crypto Investment Platform

<p align="center">
  <img src="public/vite.svg" width="60" alt="AIVEST Logo" />
</p>

<p align="center">
  <strong>Institutional-grade, AI-driven investment platform built on Web3 infrastructure.</strong><br/>
  Anonymous crypto deposits · Intelligent portfolio management · Real-time AI insights
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss" />
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Full Firebase Auth with extended user profiles (name, age, gender, country, phone, etc.) |
| 📊 **Dynamic Portfolio** | Real-time investment tracking with animated charts |
| 💰 **Crypto Deposits** | Multi-currency crypto payments (BTC, ETH, USDT, USDC, XMR, LTC) |
| 🏦 **Investment Plans** | Multiple AI-managed investment tiers with auto-compounding returns |
| 🤖 **AI Insights** | GROQ-powered AI market analysis and trade signals |
| 📝 **AI Blog Generator** | One-click AI blog post generation for the admin panel |
| 🔗 **Referral System** | Automated referral codes, bonus distribution ($50/referral), network tracking |
| 👤 **User Profiles** | Full profile editing with demographic data |
| 🛡️ **Admin Panel** | Full management of users, transactions, investments, and blog content |
| 💸 **Withdrawal Approvals** | Admin-controlled withdrawal approval workflow |
| 🔍 **Admin User Insights** | Full financial + referral overview per user |
| 🕵️ **Privacy (Anonymous Mode)** | Tornado Cash, MixBTC, and Wasabi wallet privacy integrations |
| 🌐 **Web3 Wallet** | RainbowKit-powered wallet connection for on-chain transactions |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Custom Design System
- **Backend / Database**: Firebase (Firestore + Authentication)
- **AI**: GROQ API (LLaMA 3)
- **Web3**: wagmi + viem + RainbowKit
- **UI Components**: shadcn/ui (Radix primitives)
- **Charts**: Recharts
- **Notifications**: Sonner

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9
- A Firebase project (Firestore enabled)
- A GROQ API key (https://console.groq.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/AIVEST.git
cd AIVEST/app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and fill in your GROQ API key
```

### Configuration

Create a `.env` file in the `app/` directory (see `.env.example`). Firebase is configured directly in `src/lib/firebase.ts` — update the `firebaseConfig` object with your own project credentials.

```bash
# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── admin/        # Admin-specific components (UserProfileModal, etc.)
│   │   └── ui/           # shadcn/ui base components
│   ├── contexts/         # React Contexts (AuthContext, InvestmentContext)
│   ├── lib/              # Utility libraries (firebase, groq, blockchain, web3)
│   ├── pages/            # Page-level components
│   │   └── admin/        # Admin dashboard pages
│   ├── sections/         # Landing page sections
│   └── main.tsx          # Application entry point
├── public/               # Static assets
├── index.html
├── vite.config.ts
└── tailwind.config.js
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# GROQ AI API Key — Get yours at https://console.groq.com
VITE_GROQ_API_KEY=your_groq_api_key_here
```

> **Note**: Firebase client credentials are configured in `src/lib/firebase.ts`. These are public-facing keys and are safe to commit. Firebase security is enforced via Firestore Security Rules on the server side.

---

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory, ready to deploy to any static host (Vercel, Netlify, Firebase Hosting, etc.).

---

## 👑 Admin Access

To grant admin access to a user, manually update their `role` field in Firestore:

```
Collection: users
Document:   <uid>
Field:      role  →  "admin"
```

---

## 🔐 Security Notes

- **Never commit** `.env` files, Firebase Admin SDK JSON keys, or any service account credentials.
- Firebase Firestore Security Rules should be configured to restrict data access by user role.
- The anonymous payment integrations (Tornado Cash, MixBTC) are UI mockups for demonstration purposes.

---

## 📄 License

This project is proprietary. All rights reserved.

---

<p align="center">Built with ❤️ for the future of decentralized finance.</p>
