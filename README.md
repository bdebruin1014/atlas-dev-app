# AtlasDev - Real Estate Development Platform

A comprehensive platform for managing real estate development from deal sourcing through disposition, with full multi-entity accounting, investor relations, and family office capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (or 20)
- npm or yarn
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Supabase credentials
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# Start development server
npm run dev
```

Open http://localhost:5173

### Database Setup

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run migrations in order:
   - `supabase/migrations/001_schema.sql` - Core tables
   - `supabase/migrations/002_accounting_module.sql` - Accounting & ownership tracking
4. Copy your project URL and anon key to `.env`

## 🏗 Features

### Project Management
- Full project lifecycle tracking
- Budget management with hierarchical categories
- Milestone and schedule tracking
- Construction draw processing

### Multi-Entity Accounting
- **Ownership Hierarchy**: Track ownership through multiple entity layers
- **Capital Accounts**: Contributions, distributions, allocations per owner
- **Chart of Accounts**: Entity-specific GL accounts
- **Financial Statements**: Balance sheet, income statement, cash flow
- **K-1 Management**: Track K-1s received from passive investments

### Investor Relations
- Investor CRM with accreditation tracking
- Capital call processing
- Distribution management
- Investor portal

### Operations
- Task management
- Calendar integration
- Contact management

## 📁 Project Structure

```
atlasdev/
├── src/
│   ├── components/
│   │   └── ui/           # Reusable UI components (shadcn/ui style)
│   ├── contexts/         # React contexts (Auth, etc.)
│   ├── lib/              # Utilities and Supabase client
│   ├── pages/
│   │   ├── auth/         # Login, signup, password reset
│   │   ├── accounting/   # Entity accounting pages
│   │   ├── finance/      # Bills, invoices, journal entries
│   │   ├── investors/    # Investor management
│   │   └── operations/   # Tasks, calendar
│   ├── App.jsx           # Main app with routing
│   └── main.jsx          # Entry point
├── supabase/
│   └── migrations/       # Database schemas
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🔧 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix primitives)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **State**: React Query + Context
- **Forms**: React Hook Form + Zod

## 🔐 Environment Variables

```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 📦 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Self-Hosted (Ubuntu)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build
npm install
npm run build

# Serve with nginx or PM2
npm install -g serve
pm2 start "serve -s dist -l 3000" --name atlasdev
```

## 🗄 Database Schema

### Core Tables
- `entities` - Legal entities (LLCs, companies)
- `projects` - Development projects
- `assets` - Operating properties
- `contacts` - CRM contacts
- `users` - System users

### Accounting Tables
- `beneficial_owners` - Ultimate individuals/trusts
- `ownership_interests` - Who owns what percentage
- `entity_accounts` - Chart of accounts per entity
- `journal_entries` - GL journal entries
- `capital_accounts` - Partner capital tracking

### Investor Tables
- `investors` - External investors
- `investment_vehicles` - Funds, syndications
- `capital_calls` - Capital call management
- `distributions` - Distribution tracking

## 📝 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## 📄 License

Private - VanRock Holdings LLC

## Deployment Status

✅ Vercel configuration and environment variables configured for production deployment on Vercel.
