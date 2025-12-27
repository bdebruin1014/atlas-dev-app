import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import TopNavigation from '@/components/TopNavigation';
import LoadingState from '@/components/LoadingState';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));
const EntitiesPage = lazy(() => import('@/pages/EntitiesPage'));
const OpportunitiesPage = lazy(() => import('@/pages/OpportunitiesPage'));
const ContactsPage = lazy(() => import('@/pages/ContactsPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

// Accounting
const AccountingPage = lazy(() => import('@/pages/AccountingPage'));
const EntityAccountingDashboard = lazy(() => import('@/pages/accounting/EntityAccountingDashboard'));
const BankAccountsPage = lazy(() => import('@/pages/accounting/BankAccountsPage'));
const ChartOfAccountsPage = lazy(() => import('@/pages/accounting/ChartOfAccountsPage'));
const VendorsPage = lazy(() => import('@/pages/accounting/VendorsPage'));
const BillsPage = lazy(() => import('@/pages/accounting/BillsPage'));
const PaymentsPage = lazy(() => import('@/pages/accounting/PaymentsPage'));
const JournalEntriesPage = lazy(() => import('@/pages/finance/JournalEntriesPage'));
const InvoicesPage = lazy(() => import('@/pages/finance/InvoicesPage'));
const ReconciliationPage = lazy(() => import('@/pages/finance/ReconciliationPage'));
const EntityCapitalPage = lazy(() => import('@/pages/accounting/EntityCapitalPage'));
const ReportsPage = lazy(() => import('@/pages/accounting/ReportsPage'));
const TrialBalanceReport = lazy(() => import('@/pages/accounting/TrialBalanceReport'));
const ProfitLossReport = lazy(() => import('@/pages/accounting/ProfitLossReport'));
const BalanceSheetReport = lazy(() => import('@/pages/accounting/BalanceSheetReport'));
const GeneralLedgerReport = lazy(() => import('@/pages/accounting/GeneralLedgerReport'));

// Investors
const InvestorsPage = lazy(() => import('@/pages/InvestorsPage'));
const InvestorDashboardPage = lazy(() => import('@/pages/InvestorDashboardPage'));
const InvestorDistributionsOverview = lazy(() => import('@/pages/InvestorDistributionsOverview'));
const CapitalCallsPage = lazy(() => import('@/pages/CapitalCallsPage'));

// Operations
const OperationsDashboard = lazy(() => import('@/pages/operations/OperationsDashboard'));
const GlobalTasksPage = lazy(() => import('@/pages/operations/GlobalTasksPage'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Layout with Navigation
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNavigation />
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<LoadingState />}>
          {children}
        </Suspense>
      </main>
    </div>
  );
};

// Main App Content
const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <Suspense fallback={<LoadingState />}><LoginPage /></Suspense>
      } />
      <Route path="/signup" element={
        <Suspense fallback={<LoadingState />}><SignUpPage /></Suspense>
      } />
      <Route path="/forgot-password" element={
        <Suspense fallback={<LoadingState />}><ForgotPasswordPage /></Suspense>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout><HomePage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/projects" element={
        <ProtectedRoute>
          <AppLayout><ProjectsPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/project/:projectId/*" element={
        <ProtectedRoute>
          <AppLayout><ProjectDetailPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/entities" element={
        <ProtectedRoute>
          <AppLayout><EntitiesPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/opportunities" element={
        <ProtectedRoute>
          <AppLayout><OpportunitiesPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/contacts" element={
        <ProtectedRoute>
          <AppLayout><ContactsPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/calendar" element={
        <ProtectedRoute>
          <AppLayout><CalendarPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings/*" element={
        <ProtectedRoute>
          <AppLayout><SettingsPage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Accounting Routes */}
      <Route path="/accounting" element={
        <ProtectedRoute>
          <AppLayout><AccountingPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId" element={
        <ProtectedRoute>
          <AppLayout><EntityAccountingDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/dashboard" element={
        <ProtectedRoute>
          <AppLayout><EntityAccountingDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/banking" element={
        <ProtectedRoute>
          <AppLayout><BankAccountsPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/chart-of-accounts" element={
        <ProtectedRoute>
          <AppLayout><ChartOfAccountsPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/vendors" element={
        <ProtectedRoute>
          <AppLayout><VendorsPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/bills" element={
        <ProtectedRoute>
          <AppLayout><BillsPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/payments" element={
        <ProtectedRoute>
          <AppLayout><PaymentsPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/journal-entries" element={
        <ProtectedRoute>
          <AppLayout><JournalEntriesPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/invoices" element={
        <ProtectedRoute>
          <AppLayout><InvoicesPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/reconciliation" element={
        <ProtectedRoute>
          <AppLayout><ReconciliationPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/capital/*" element={
        <ProtectedRoute>
          <AppLayout><EntityCapitalPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/reports" element={
        <ProtectedRoute>
          <AppLayout><ReportsPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/reports/trial-balance" element={
        <ProtectedRoute>
          <AppLayout><TrialBalanceReport /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/reports/profit-loss" element={
        <ProtectedRoute>
          <AppLayout><ProfitLossReport /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/reports/balance-sheet" element={
        <ProtectedRoute>
          <AppLayout><BalanceSheetReport /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/accounting/entity/:entityId/reports/general-ledger" element={
        <ProtectedRoute>
          <AppLayout><GeneralLedgerReport /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Investor Routes */}
      <Route path="/investors" element={
        <ProtectedRoute>
          <AppLayout><InvestorDashboardPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/investors/directory" element={
        <ProtectedRoute>
          <AppLayout><InvestorsPage /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/investors/distributions" element={
        <ProtectedRoute>
          <AppLayout><InvestorDistributionsOverview /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/investors/capital-calls" element={
        <ProtectedRoute>
          <AppLayout><CapitalCallsPage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Operations Routes */}
      <Route path="/operations" element={
        <ProtectedRoute>
          <AppLayout><OperationsDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/operations/tasks" element={
        <ProtectedRoute>
          <AppLayout><GlobalTasksPage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <Helmet>
        <title>AtlasDev | Real Estate Development Platform</title>
      </Helmet>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
