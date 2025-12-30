# AtlasDev - Real Estate Development Platform

A comprehensive real estate development management platform for VanRock Holdings LLC.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Extract the files** to your project directory

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

The app runs in **Demo Mode** by default, so you can explore all features without setting up Supabase.

---

## 📁 Project Structure

```
atlasdev/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── accounting/      # Accounting-specific components
│   │   ├── TopNavigation.jsx
│   │   ├── LoadingState.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── ProjectContent.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── utils.js         # Utility functions (cn, formatCurrency, etc.)
│   │   └── supabase.js      # Supabase client
│   ├── pages/               # All page components
│   ├── services/            # Data services
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🔧 Configuration

### Environment Variables

The `.env` file is pre-configured for demo mode:

```env
# Demo mode - uses mock data (no database needed)
VITE_DEMO_MODE=true

# Supabase (required when DEMO_MODE=false)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Demo Mode

When `VITE_DEMO_MODE=true`:
- Authentication accepts any email/password
- All data is mock data (realistic but not persisted)
- Perfect for UI testing and demos

---

## 📱 Features

### Core Modules

| Module | Status | Description |
|--------|--------|-------------|
| Dashboard | ✅ Ready | Portfolio overview, activity feed, quick actions |
| Projects | ✅ Ready | Project list, detail views with tabs |
| Entities | ✅ Ready | Entity management, ownership structure |
| Accounting | ✅ Ready | Entity-level accounting, journal entries, reports |
| Investors | ✅ Ready | Investor dashboard, distributions, capital calls |
| Operations | ✅ Ready | Tasks, operations dashboard |
| Contacts | ✅ Ready | Contact management |
| Settings | ✅ Ready | User and system settings |

### Accounting Features

- Chart of Accounts
- Journal Entries (with balanced entry validation)
- Bills & Payments
- Vendors
- Bank Accounts
- Financial Reports (Trial Balance, P&L, Balance Sheet)
- Check Writing

---

## 🛠 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State:** React Query (TanStack Query)
- **Routing:** React Router v6
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Forms:** React Hook Form + Zod

---

## 📄 License

Proprietary - VanRock Holdings LLC
