# AtlasDev - Real Estate Development Platform

A comprehensive real estate development management platform for VanRock Holdings LLC.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will start at `http://localhost:5173`

### 3. Demo Mode
The app runs in **demo mode** by default, using mock data. No Supabase configuration required to test the UI.

## Project Structure

```
atlasdev/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── ui/          # shadcn/ui components
│   │   └── accounting/  # Accounting-specific components
│   ├── contexts/        # React contexts (Auth)
│   ├── lib/             # Utilities and Supabase client
│   ├── pages/           # Page components
│   └── services/        # API/data services
├── .env                 # Environment variables (create from .env.example)
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### Currently Implemented
- ✅ Authentication (with demo mode)
- ✅ Dashboard with portfolio overview
- ✅ Projects list and detail views
- ✅ Entities management
- ✅ Accounting module shell
  - Entity selector
  - Banking dashboard
  - Chart of accounts
  - Bills management
  - Journal entries
  - Financial reports
- ✅ Investor relations dashboard
- ✅ Operations dashboard
- ✅ Responsive navigation

### Coming Soon
- 🔄 Full Supabase integration
- 🔄 Complete accounting CRUD
- 🔄 Document management
- 🔄 Construction draws
- 🔄 Capital account tracking

## Connecting to Supabase

1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env`
3. Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_DEMO_MODE=false
```

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router v6

## Development Notes

### Theme Colors
- Primary: Emerald (`#2F855A`, `#276749`)
- Background: Gray-50 (`#F9FAFB`)
- Cards: White with subtle borders

### Code Style
- Functional components with hooks
- Lazy loading for pages
- Error boundaries for resilience
- Toast notifications for feedback

## License

Private - VanRock Holdings LLC
