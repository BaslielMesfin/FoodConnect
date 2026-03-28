# FoodConnect

A real-time food rescue logistics platform that connects surplus food donors — restaurants, hotels, and caterers — with shelters and community kitchens in need. Built to tackle food waste and hunger simultaneously.

## Features

### Donor Portal
- **Surplus Posting** — Post available food with category, weight, expiry, and pickup window
- **Active Pickups** — Track claimed donations with real-time status updates
- **History** — Full archive of past donations with status indicators
- **Analytics** — Visual breakdowns of donation trends, categories, and impact metrics

### Shelter Portal
- **Live Discovery Map** — Interactive Leaflet map showing all available donations nearby
- **One-Click Claiming** — Claim donations directly from the map or feed
- **Dispatch Panel** — Manage active pickups and mark completions
- **Partner Directory** — View all donors you've received food from with aggregated stats
- **Analytics** — Intake trends, category distribution, and donor diversity metrics

### Driver Hand-off System
- **Unique Pickup Links** — Each donation generates a shareable driver link
- **PIN Verification** — 4-digit PIN system for secure food handoffs
- **No Login Required** — Drivers access their pickup view without authentication
- **Live Status Polling** — Automatic status refresh without page reloads

### Account & Settings
- **Google OAuth** — One-click sign-in via Google
- **Email/Password** — Traditional registration with role selection (Donor/Shelter)
- **Profile Management** — Update organization name, phone, and address
- **Responsive Layout** — Full mobile support with collapsible sidebar

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS Custom Properties |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Auth.js (NextAuth v5) |
| Maps | Leaflet + React-Leaflet |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or hosted via [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))
- Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/BaslielMesfin/FoodConnect.git
cd FoodConnect

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host:5432/foodconnect"
AUTH_SECRET="your-random-secret-key"
AUTH_URL="http://localhost:3000"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/
│   ├── actions/          # Server actions (donation, driver, user)
│   ├── api/              # API routes (auth, registration)
│   ├── donor/            # Donor portal pages
│   ├── shelter/          # Shelter portal pages
│   ├── settings/         # Account settings
│   ├── pickup/[token]/   # Driver hand-off view
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/
│   ├── donor/            # Donor-specific components
│   ├── shelter/          # Shelter-specific components
│   ├── layout/           # Dashboard layout with sidebar
│   ├── providers/        # Auth session provider
│   └── shared/           # Reusable UI components
├── lib/                  # Auth config, Prisma client, utilities
└── types/                # TypeScript type extensions
```

## Deployment

This project is optimized for [Vercel](https://vercel.com). Import the GitHub repository, add your environment variables, and deploy.

## License

MIT
