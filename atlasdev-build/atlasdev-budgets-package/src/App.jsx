import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import TopNavigation from '@/components/TopNavigation';
import LoadingState from '@/components/LoadingState';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } } });

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));
const EntitiesPage = lazy(() => import('@/pages/EntitiesPage'));
const OpportunitiesPage = lazy(() => import('@/pages/OpportunitiesPage'));
const OpportunityDetailPage = lazy(() => import('@/pages/OpportunityDetailPage'));
const ContactsPage = lazy(() => import('@/pages/ContactsPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

const AccountingPage = lazy(() => import('@/pages/AccountingPage'));
const FamilyOfficeDashboard = lazy(() => import('@/pages/FamilyOfficeDashboard'));
const AssetManagementPage = lazy(() => import('@/pages/AssetManagementPage'));
const AssetManagementDashboard = lazy(() => import('@/pages/AssetManagementDashboard'));

const InvestorsPage = lazy(() => import('@/pages/InvestorsPage'));
const InvestorDashboardPage = lazy(() => import('@/pages/InvestorDashboardPage'));
const InvestorDistributionsOverview = lazy(() => import('@/pages/InvestorDistributionsOverview'));
const CapitalCallsPage = lazy(() => import('@/pages/CapitalCallsPage'));

const OperationsDashboard = lazy(() => import('@/pages/OperationsDashboard'));
const GlobalTasksPage = lazy(() => import('@/pages/GlobalTasksPage'));
const TaskTemplatesPage = lazy(() => import('@/pages/operations/TaskTemplatesPage'));
const ProjectTemplatesPage = lazy(() => import('@/pages/operations/ProjectTemplatesPage'));
const TeamsPage = lazy(() => import('@/pages/operations/TeamsPage'));

const ReportsLayout = lazy(() => import('@/components/ReportsLayout'));
const PresetReportsPage = lazy(() => import('@/pages/reports/PresetReportsPage'));
const CustomReportsPage = lazy(() => import('@/pages/reports/CustomReportsPage'));
const SubscribedReportsPage = lazy(() => import('@/pages/reports/SubscribedReportsPage'));
const ReportPackagesPage = lazy(() => import('@/pages/reports/ReportPackagesPage'));
const TrendsPage = lazy(() => import('@/pages/reports/TrendsPage'));

const AdminSidebar = lazy(() => import('@/components/AdminSidebar'));
const AdminOverviewPage = lazy(() => import('@/pages/admin/AdminOverviewPage'));
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'));

// Budget Tools
const BudgetModuleRouter = lazy(() => import('@/features/budgets/components/BudgetModuleRouter'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <TopNavigation />
    <main className="flex-1 overflow-auto"><Suspense fallback={<LoadingState />}>{children}</Suspense></main>
  </div>
);

const AppContent = () => (
  <Routes>
    <Route path="/login" element={<Suspense fallback={<LoadingState />}><LoginPage /></Suspense>} />
    <Route path="/signup" element={<Suspense fallback={<LoadingState />}><SignUpPage /></Suspense>} />
    <Route path="/forgot-password" element={<Suspense fallback={<LoadingState />}><ForgotPasswordPage /></Suspense>} />

    <Route path="/" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
    <Route path="/projects" element={<ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/*" element={<ProtectedRoute><AppLayout><ProjectDetailPage /></AppLayout></ProtectedRoute>} />
    <Route path="/entities" element={<ProtectedRoute><AppLayout><EntitiesPage /></AppLayout></ProtectedRoute>} />
    <Route path="/opportunities" element={<ProtectedRoute><AppLayout><OpportunitiesPage /></AppLayout></ProtectedRoute>} />
    <Route path="/opportunity/:opportunityId/*" element={<ProtectedRoute><AppLayout><OpportunityDetailPage /></AppLayout></ProtectedRoute>} />
    <Route path="/contacts" element={<ProtectedRoute><AppLayout><ContactsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/calendar" element={<ProtectedRoute><AppLayout><CalendarPage /></AppLayout></ProtectedRoute>} />
    <Route path="/settings/*" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

    <Route path="/reports" element={<ProtectedRoute><AppLayout><ReportsLayout /></AppLayout></ProtectedRoute>}>
      <Route index element={<Navigate to="/reports/preset" replace />} />
      <Route path="preset" element={<PresetReportsPage />} />
      <Route path="preset/:category" element={<PresetReportsPage />} />
      <Route path="custom" element={<CustomReportsPage />} />
      <Route path="subscribed" element={<SubscribedReportsPage />} />
      <Route path="packages" element={<ReportPackagesPage />} />
      <Route path="trends" element={<TrendsPage />} />
    </Route>

    <Route path="/admin" element={<ProtectedRoute><AppLayout><div className="flex h-[calc(100vh-40px)]"><AdminSidebar /><div className="flex-1 overflow-auto"><AdminOverviewPage /></div></div></AppLayout></ProtectedRoute>} />
    <Route path="/admin/*" element={<ProtectedRoute><AppLayout><div className="flex h-[calc(100vh-40px)]"><AdminSidebar /><div className="flex-1 overflow-auto"><AdminPage /></div></div></AppLayout></ProtectedRoute>} />

    {/* Accounting - Full QuickBooks replacement */}
    <Route path="/accounting" element={<ProtectedRoute><AppLayout><AccountingPage /></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/*" element={<ProtectedRoute><AppLayout><AccountingPage /></AppLayout></ProtectedRoute>} />

    {/* Family Office - Standalone wealth management */}
    <Route path="/family-office" element={<ProtectedRoute><AppLayout><FamilyOfficeDashboard /></AppLayout></ProtectedRoute>} />
    <Route path="/family-office/*" element={<ProtectedRoute><AppLayout><FamilyOfficeDashboard /></AppLayout></ProtectedRoute>} />

    {/* Asset Management - Rental property operations */}
    <Route path="/assets" element={<ProtectedRoute><AppLayout><AssetManagementPage /></AppLayout></ProtectedRoute>} />
    <Route path="/assets/:assetId/*" element={<ProtectedRoute><AppLayout><AssetManagementDashboard /></AppLayout></ProtectedRoute>} />

    {/* Investors */}
    <Route path="/investors" element={<ProtectedRoute><AppLayout><InvestorDashboardPage /></AppLayout></ProtectedRoute>} />
    <Route path="/investors/directory" element={<ProtectedRoute><AppLayout><InvestorsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/investors/distributions" element={<ProtectedRoute><AppLayout><InvestorDistributionsOverview /></AppLayout></ProtectedRoute>} />
    <Route path="/investors/capital-calls" element={<ProtectedRoute><AppLayout><CapitalCallsPage /></AppLayout></ProtectedRoute>} />

    {/* Operations */}
    <Route path="/operations" element={<ProtectedRoute><AppLayout><OperationsDashboard /></AppLayout></ProtectedRoute>} />
    <Route path="/operations/tasks" element={<ProtectedRoute><AppLayout><GlobalTasksPage /></AppLayout></ProtectedRoute>} />
    <Route path="/operations/teams" element={<ProtectedRoute><AppLayout><TeamsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/operations/task-templates" element={<ProtectedRoute><AppLayout><TaskTemplatesPage /></AppLayout></ProtectedRoute>} />
    <Route path="/operations/project-templates" element={<ProtectedRoute><AppLayout><ProjectTemplatesPage /></AppLayout></ProtectedRoute>} />

    {/* Budget Tools */}
    <Route path="/budgets/*" element={<ProtectedRoute><AppLayout><BudgetModuleRouter /></AppLayout></ProtectedRoute>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Helmet><title>AtlasDev | Real Estate Development Platform</title></Helmet>
        <AuthProvider><AppContent /><Toaster /></AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
