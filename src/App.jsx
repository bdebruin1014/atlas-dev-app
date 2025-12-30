import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import TopNavigation from '@/components/TopNavigation';
import LoadingState from '@/components/LoadingState';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } } });

// ============================================
// CORE PAGE IMPORTS
// ============================================
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

// ============================================
// ACCOUNTING MODULE
// ============================================
const AccountingSidebar = lazy(() => import('@/components/AccountingSidebar'));
const AccountingEntitiesListPage = lazy(() => import('@/pages/accounting/AccountingEntitiesListPage'));
const EntityOwnershipHierarchyPage = lazy(() => import('@/pages/accounting/EntityOwnershipHierarchyPage'));
const EntityDashboardPage = lazy(() => import('@/pages/accounting/EntityDashboardPage'));
const EntityChartOfAccountsPage = lazy(() => import('@/pages/accounting/EntityChartOfAccountsPage'));
const EntityTransactionsPage = lazy(() => import('@/pages/accounting/EntityDashboardPage'));
const EntityBankingPage = lazy(() => import('@/pages/accounting/EntityDashboardPage'));
const EntityReconciliationPage = lazy(() => import('@/pages/accounting/EntityDashboardPage'));
const EntityInvoicesPage = lazy(() => import('@/pages/accounting/EntityDashboardPage'));
const EntityBillsPage = lazy(() => import('@/pages/accounting/EntityDashboardPage'));
const EntityReportsPage = lazy(() => import('@/pages/accounting/EntityDashboardPage'));
const EntityOwnershipPage = lazy(() => import('@/pages/accounting/EntityOwnershipPage'));
const EntityTasksPage = lazy(() => import('@/pages/accounting/EntityTasksPage'));

// ============================================
// INVESTMENT MANAGEMENT MODULE
// ============================================
const InvestmentsSidebar = lazy(() => import('@/components/InvestmentsSidebar'));
const InvestmentsListPage = lazy(() => import('@/pages/investments/InvestmentsListPage'));
const InvestmentDashboardPage = lazy(() => import('@/pages/investments/InvestmentDashboardPage'));
const DealInvestorsPage = lazy(() => import('@/pages/investments/DealInvestorsPage'));
const DealSubscriptionsPage = lazy(() => import('@/pages/investments/DealSubscriptionsPage'));
const DealDistributionsPage = lazy(() => import('@/pages/investments/DealDistributionsPage'));
const DealDocumentsPage = lazy(() => import('@/pages/investments/DealDocumentsPage'));
const DealTasksPage = lazy(() => import('@/pages/investments/DealTasksPage'));

// ============================================
// INVESTOR DIRECTORY & DETAIL MODULE
// ============================================
const InvestorSidebar = lazy(() => import('@/components/InvestorSidebar'));
const InvestorDirectoryPage = lazy(() => import('@/pages/investors/InvestorDirectoryPage'));
const InvestorDashboardPage = lazy(() => import('@/pages/investors/InvestorDashboardPage'));
const InvestorProfilePage = lazy(() => import('@/pages/investors/InvestorProfilePage'));
const InvestorInvestmentsPage = lazy(() => import('@/pages/investors/InvestorInvestmentsPage'));
const InvestorDocumentsPage = lazy(() => import('@/pages/investors/InvestorDocumentsPage'));
const InvestorPortalPage = lazy(() => import('@/pages/investors/InvestorPortalPage'));

// ============================================
// ASSET MANAGEMENT MODULE
// ============================================
const AssetManagementSidebar = lazy(() => import('@/components/AssetManagementSidebar'));
const AssetManagementListPage = lazy(() => import('@/pages/assets/AssetManagementListPage'));
const AssetDashboardPage = lazy(() => import('@/pages/investments/InvestmentDashboardPage'));

// ============================================
// FAMILY OFFICE MODULE
// ============================================
const FamilyOfficeSidebar = lazy(() => import('@/components/FamilyOfficeSidebar'));
const FamilyOfficeListPage = lazy(() => import('@/pages/family-office/FamilyOfficeListPage'));
const FamilyOfficeDashboardPage = lazy(() => import('@/pages/investments/InvestmentDashboardPage'));

// ============================================
// ADMIN MODULE
// ============================================
const AdminSidebar = lazy(() => import('@/components/AdminSidebar'));
const AdminOverviewPage = lazy(() => import('@/pages/admin/AdminOverviewPage'));
const AdminPage = lazy(() => import('@/pages/admin/AdminPage'));
const HomePlanLibraryPage = lazy(() => import('@/pages/admin/HomePlanLibraryPage'));
const BudgetTemplatesPage = lazy(() => import('@/pages/admin/BudgetTemplatesPage'));
const ProformaTemplatesPage = lazy(() => import('@/pages/admin/ProformaTemplatesPage'));
const ScheduleTemplatesPage = lazy(() => import('@/pages/admin/ScheduleTemplatesPage'));
const DealTemplatesPage = lazy(() => import('@/pages/admin/DealTemplatesPage'));
const AdminTaskTemplatesPage = lazy(() => import('@/pages/admin/TaskTemplatesPage'));
const MilestoneTemplatesPage = lazy(() => import('@/pages/admin/MilestoneTemplatesPage'));
const AdminProjectTemplatesPage = lazy(() => import('@/pages/admin/ProjectTemplatesPage'));
const COATemplatesPage = lazy(() => import('@/pages/admin/COATemplatesPage'));

// ============================================
// OPERATIONS & REPORTS
// ============================================
const OperationsDashboard = lazy(() => import('@/pages/OperationsDashboard'));
const GlobalTasksPage = lazy(() => import('@/pages/GlobalTasksPage'));
const TeamsPage = lazy(() => import('@/pages/operations/TeamsPage'));
const ReportsLayout = lazy(() => import('@/components/ReportsLayout'));
const PresetReportsPage = lazy(() => import('@/pages/reports/PresetReportsPage'));
const CustomReportsPage = lazy(() => import('@/pages/reports/CustomReportsPage'));
const SubscribedReportsPage = lazy(() => import('@/pages/reports/SubscribedReportsPage'));
const ReportPackagesPage = lazy(() => import('@/pages/reports/ReportPackagesPage'));
const TrendsPage = lazy(() => import('@/pages/reports/TrendsPage'));

// ============================================
// EOS MODULE
// ============================================
const EOSMainPage = lazy(() => import('@/pages/eos/EOSMainPage'));
const EOSDetailPage = lazy(() => import('@/pages/eos/EOSDetailPage'));

// ============================================
// PROJECT MODULE (43 pages)
// ============================================
const ActualsVsBudgetPage = lazy(() => import('@/pages/projects/ActualsVsBudgetPage'));
const BidsPage = lazy(() => import('@/pages/projects/BidsPage'));
const BudgetPage = lazy(() => import('@/pages/projects/BudgetPage'));
const CashFlowPage = lazy(() => import('@/pages/projects/CashFlowPage'));
const ChangeOrdersPage = lazy(() => import('@/pages/projects/ChangeOrdersPage'));
const ClosingChecklistPage = lazy(() => import('@/pages/projects/ClosingChecklistPage'));
const CommitmentsPage = lazy(() => import('@/pages/projects/CommitmentsPage'));
const CompliancePage = lazy(() => import('@/pages/projects/CompliancePage'));
const ProjectContactsPage = lazy(() => import('@/pages/projects/ContactsPage'));
const DailyLogsPage = lazy(() => import('@/pages/projects/DailyLogsPage'));
const DashboardWidgetsPage = lazy(() => import('@/pages/projects/DashboardWidgetsPage'));
const DealAnalysisPage = lazy(() => import('@/pages/projects/DealAnalysisPage'));
const DocumentsPage = lazy(() => import('@/pages/projects/DocumentsPage'));
const DrawRequestsPage = lazy(() => import('@/pages/projects/DrawRequestsPage'));
const EquityCallsPage = lazy(() => import('@/pages/projects/EquityCallsPage'));
const InspectionsPage = lazy(() => import('@/pages/projects/InspectionsPage'));
const InsurancePage = lazy(() => import('@/pages/projects/InsurancePage'));
const InvestorPortalProjectPage = lazy(() => import('@/pages/projects/InvestorPortalPage'));
const MarketingPage = lazy(() => import('@/pages/projects/MarketingPage'));
const MeetingNotesPage = lazy(() => import('@/pages/projects/MeetingNotesPage'));
const NotesPage = lazy(() => import('@/pages/projects/NotesPage'));
const OffersPage = lazy(() => import('@/pages/projects/OffersPage'));
const PermitsPage = lazy(() => import('@/pages/projects/PermitsPage'));
const PhotosPage = lazy(() => import('@/pages/projects/PhotosPage'));
const ProformaPage = lazy(() => import('@/pages/projects/ProformaPage'));
const ProjectComparisonPage = lazy(() => import('@/pages/projects/ProjectComparisonPage'));
const ProjectDistributionsPage = lazy(() => import('@/pages/projects/ProjectDistributionsPage'));
const ProjectLoansPage = lazy(() => import('@/pages/projects/ProjectLoansPage'));
const ProjectOverviewPage = lazy(() => import('@/pages/projects/ProjectOverviewPage'));
const PropertyDetailsPage = lazy(() => import('@/pages/projects/PropertyDetailsPage'));
const PunchListPage = lazy(() => import('@/pages/projects/PunchListPage'));
const RFIsPage = lazy(() => import('@/pages/projects/RFIsPage'));
const ProjectReportsPage = lazy(() => import('@/pages/projects/ReportsPage'));
const SalesPage = lazy(() => import('@/pages/projects/SalesPage'));
const SchedulePage = lazy(() => import('@/pages/projects/SchedulePage'));
const ProjectSettingsPage = lazy(() => import('@/pages/projects/SettingsPage'));
const SubmittalsPage = lazy(() => import('@/pages/projects/SubmittalsPage'));
const TasksPage = lazy(() => import('@/pages/projects/TasksPage'));
const TaxDocumentsPage = lazy(() => import('@/pages/projects/TaxDocumentsPage'));
const TimelineGanttPage = lazy(() => import('@/pages/projects/TimelineGanttPage'));
const UnitDetailsPage = lazy(() => import('@/pages/projects/UnitDetailsPage'));
const VendorsPage = lazy(() => import('@/pages/projects/VendorsPage'));
const WarrantyPage = lazy(() => import('@/pages/projects/WarrantyPage'));

const BudgetModuleRouter = lazy(() => import('@/features/budgets/components/BudgetModuleRouter'));

// ============================================
// PROTECTED ROUTE & LAYOUTS
// ============================================
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

const AdminLayout = ({ children }) => (
  <div className="flex h-[calc(100vh-40px)]">
    <Suspense fallback={<LoadingState />}><AdminSidebar /></Suspense>
    <div className="flex-1 overflow-auto"><Suspense fallback={<LoadingState />}>{children}</Suspense></div>
  </div>
);

const AccountingEntityLayout = ({ children }) => {
  const entity = { name: 'Highland Park Development LLC', type: 'project', cashBalance: 485000, ytdRevenue: 3200000, ytdExpenses: 2485000 };
  return (
    <div className="flex h-[calc(100vh-40px)]">
      <Suspense fallback={<LoadingState />}><AccountingSidebar entity={entity} /></Suspense>
      <div className="flex-1 overflow-auto"><Suspense fallback={<LoadingState />}>{children}</Suspense></div>
    </div>
  );
};

const InvestmentDealLayout = ({ children }) => {
  const deal = { name: 'Highland Park Lofts', stage: 'raising_capital', totalRaised: 1875000, investorCount: 12 };
  return (
    <div className="flex h-[calc(100vh-40px)]">
      <Suspense fallback={<LoadingState />}><InvestmentsSidebar deal={deal} /></Suspense>
      <div className="flex-1 overflow-auto"><Suspense fallback={<LoadingState />}>{children}</Suspense></div>
    </div>
  );
};

// Investor Detail Layout
const InvestorDetailLayout = ({ children }) => {
  const investor = { name: 'John Smith', accreditationStatus: 'verified', totalInvested: 450000, activeDeals: 3 };
  return (
    <div className="flex h-[calc(100vh-40px)]">
      <Suspense fallback={<LoadingState />}><InvestorSidebar investor={investor} /></Suspense>
      <div className="flex-1 overflow-auto"><Suspense fallback={<LoadingState />}>{children}</Suspense></div>
    </div>
  );
};

const AssetLayout = ({ children }) => {
  const asset = { name: 'Highland Park Lofts', status: 'operating', currentValue: 9200000, noi: 485000 };
  return (
    <div className="flex h-[calc(100vh-40px)]">
      <Suspense fallback={<LoadingState />}><AssetManagementSidebar asset={asset} /></Suspense>
      <div className="flex-1 overflow-auto"><Suspense fallback={<LoadingState />}>{children}</Suspense></div>
    </div>
  );
};

const FamilyOfficeLayout = ({ children }) => {
  const familyOffice = { name: 'Olive Brynn Family Office', primaryOwner: 'Bryan de Bruin', netWorth: 8300000, entityCount: 8 };
  return (
    <div className="flex h-[calc(100vh-40px)]">
      <Suspense fallback={<LoadingState />}><FamilyOfficeSidebar familyOffice={familyOffice} /></Suspense>
      <div className="flex-1 overflow-auto"><Suspense fallback={<LoadingState />}>{children}</Suspense></div>
    </div>
  );
};

// ============================================
// APP ROUTES
// ============================================
const AppContent = () => (
  <Routes>
    {/* Auth Routes */}
    <Route path="/login" element={<Suspense fallback={<LoadingState />}><LoginPage /></Suspense>} />
    <Route path="/signup" element={<Suspense fallback={<LoadingState />}><SignUpPage /></Suspense>} />
    <Route path="/forgot-password" element={<Suspense fallback={<LoadingState />}><ForgotPasswordPage /></Suspense>} />

    {/* Core Routes */}
    <Route path="/" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
    <Route path="/projects" element={<ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/projects/compare" element={<ProtectedRoute><AppLayout><ProjectComparisonPage /></AppLayout></ProtectedRoute>} />
    
    {/* Project Detail Routes (43 pages) */}
    <Route path="/project/:projectId" element={<ProtectedRoute><AppLayout><ProjectDetailPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/overview" element={<ProtectedRoute><AppLayout><ProjectOverviewPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/dashboard" element={<ProtectedRoute><AppLayout><DashboardWidgetsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/deal-analysis" element={<ProtectedRoute><AppLayout><DealAnalysisPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/offers" element={<ProtectedRoute><AppLayout><OffersPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/property-details" element={<ProtectedRoute><AppLayout><PropertyDetailsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/schedule" element={<ProtectedRoute><AppLayout><SchedulePage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/daily-logs" element={<ProtectedRoute><AppLayout><DailyLogsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/rfis" element={<ProtectedRoute><AppLayout><RFIsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/submittals" element={<ProtectedRoute><AppLayout><SubmittalsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/change-orders" element={<ProtectedRoute><AppLayout><ChangeOrdersPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/punch-list" element={<ProtectedRoute><AppLayout><PunchListPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/inspections" element={<ProtectedRoute><AppLayout><InspectionsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/permits" element={<ProtectedRoute><AppLayout><PermitsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/photos" element={<ProtectedRoute><AppLayout><PhotosPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/timeline" element={<ProtectedRoute><AppLayout><TimelineGanttPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/budget" element={<ProtectedRoute><AppLayout><BudgetPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/actuals" element={<ProtectedRoute><AppLayout><ActualsVsBudgetPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/cash-flow" element={<ProtectedRoute><AppLayout><CashFlowPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/proforma" element={<ProtectedRoute><AppLayout><ProformaPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/loans" element={<ProtectedRoute><AppLayout><ProjectLoansPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/draws" element={<ProtectedRoute><AppLayout><DrawRequestsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/commitments" element={<ProtectedRoute><AppLayout><CommitmentsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/bids" element={<ProtectedRoute><AppLayout><BidsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/vendors" element={<ProtectedRoute><AppLayout><VendorsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/contacts" element={<ProtectedRoute><AppLayout><ProjectContactsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/sales" element={<ProtectedRoute><AppLayout><SalesPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/marketing" element={<ProtectedRoute><AppLayout><MarketingPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/units" element={<ProtectedRoute><AppLayout><UnitDetailsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/closing" element={<ProtectedRoute><AppLayout><ClosingChecklistPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/warranty" element={<ProtectedRoute><AppLayout><WarrantyPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/investor-portal" element={<ProtectedRoute><AppLayout><InvestorPortalProjectPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/distributions" element={<ProtectedRoute><AppLayout><ProjectDistributionsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/equity-calls" element={<ProtectedRoute><AppLayout><EquityCallsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/tax-documents" element={<ProtectedRoute><AppLayout><TaxDocumentsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/tasks" element={<ProtectedRoute><AppLayout><TasksPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/documents" element={<ProtectedRoute><AppLayout><DocumentsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/notes" element={<ProtectedRoute><AppLayout><NotesPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/meetings" element={<ProtectedRoute><AppLayout><MeetingNotesPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/compliance" element={<ProtectedRoute><AppLayout><CompliancePage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/insurance" element={<ProtectedRoute><AppLayout><InsurancePage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/reports" element={<ProtectedRoute><AppLayout><ProjectReportsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/settings" element={<ProtectedRoute><AppLayout><ProjectSettingsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/project/:projectId/*" element={<ProtectedRoute><AppLayout><ProjectDetailPage /></AppLayout></ProtectedRoute>} />

    {/* Other Core Routes */}
    <Route path="/entities" element={<ProtectedRoute><AppLayout><EntitiesPage /></AppLayout></ProtectedRoute>} />
    <Route path="/opportunities" element={<ProtectedRoute><AppLayout><OpportunitiesPage /></AppLayout></ProtectedRoute>} />
    <Route path="/opportunity/:opportunityId/*" element={<ProtectedRoute><AppLayout><OpportunityDetailPage /></AppLayout></ProtectedRoute>} />
    <Route path="/contacts" element={<ProtectedRoute><AppLayout><ContactsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/calendar" element={<ProtectedRoute><AppLayout><CalendarPage /></AppLayout></ProtectedRoute>} />
    <Route path="/settings/*" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

    {/* ============================================ */}
    {/* ACCOUNTING MODULE */}
    {/* ============================================ */}
    <Route path="/accounting" element={<ProtectedRoute><AppLayout><AccountingEntitiesListPage /></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/hierarchy" element={<ProtectedRoute><AppLayout><EntityOwnershipHierarchyPage /></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityDashboardPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/details" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityDashboardPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/ownership" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityOwnershipPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/tasks" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityTasksPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/chart-of-accounts" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityChartOfAccountsPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/banking" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityBankingPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/transactions" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityTransactionsPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/journal-entries" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityTransactionsPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/reconciliation" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityReconciliationPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/invoices" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityInvoicesPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/bills" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityBillsPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/payments" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityDashboardPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/intercompany" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityDashboardPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/due-to-from" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityDashboardPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/reports" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityReportsPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/trial-balance" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityReportsPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/cash-flow" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityReportsPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/settings" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityDashboardPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />
    <Route path="/accounting/:entityId/*" element={<ProtectedRoute><AppLayout><AccountingEntityLayout><EntityDashboardPage /></AccountingEntityLayout></AppLayout></ProtectedRoute>} />

    {/* ============================================ */}
    {/* INVESTOR DIRECTORY & DETAIL MODULE */}
    {/* ============================================ */}
    <Route path="/investors/directory" element={<ProtectedRoute><AppLayout><InvestorDirectoryPage /></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorDashboardPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/profile" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorProfilePage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/investments" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorInvestmentsPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/capital" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorInvestmentsPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/distributions" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorInvestmentsPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/performance" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorInvestmentsPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/documents" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorDocumentsPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/documents/*" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorDocumentsPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/portal" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorPortalPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/emails" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorPortalPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/notifications" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorPortalPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/accreditation" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorProfilePage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/kyc" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorProfilePage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/tax-forms" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorDocumentsPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/portal-access" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorProfilePage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/settings" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorProfilePage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investors/:investorId/*" element={<ProtectedRoute><AppLayout><InvestorDetailLayout><InvestorDashboardPage /></InvestorDetailLayout></AppLayout></ProtectedRoute>} />

    {/* ============================================ */}
    {/* INVESTMENT MANAGEMENT MODULE */}
    {/* ============================================ */}
    <Route path="/investments" element={<ProtectedRoute><AppLayout><InvestmentsListPage /></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><InvestmentDashboardPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/summary" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><InvestmentDashboardPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/tasks" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><DealTasksPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/investors" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><DealInvestorsPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/subscriptions" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><DealSubscriptionsPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/capital-calls" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><DealSubscriptionsPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/ownership" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><DealInvestorsPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/distributions" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><DealDistributionsPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/waterfall" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><DealDistributionsPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/performance" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><InvestmentDashboardPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/documents" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><DealDocumentsPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/k1s" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><DealDocumentsPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/reports" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><DealDocumentsPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/updates" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><InvestmentDashboardPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/notifications" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><InvestmentDashboardPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/settings" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><InvestmentDashboardPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />
    <Route path="/investments/:dealId/*" element={<ProtectedRoute><AppLayout><InvestmentDealLayout><InvestmentDashboardPage /></InvestmentDealLayout></AppLayout></ProtectedRoute>} />

    {/* ============================================ */}
    {/* ASSET MANAGEMENT MODULE */}
    {/* ============================================ */}
    <Route path="/assets" element={<ProtectedRoute><AppLayout><AssetManagementListPage /></AppLayout></ProtectedRoute>} />
    <Route path="/assets/:assetId" element={<ProtectedRoute><AppLayout><AssetLayout><AssetDashboardPage /></AssetLayout></AppLayout></ProtectedRoute>} />
    <Route path="/assets/:assetId/*" element={<ProtectedRoute><AppLayout><AssetLayout><AssetDashboardPage /></AssetLayout></AppLayout></ProtectedRoute>} />

    {/* ============================================ */}
    {/* FAMILY OFFICE MODULE */}
    {/* ============================================ */}
    <Route path="/family-office" element={<ProtectedRoute><AppLayout><FamilyOfficeListPage /></AppLayout></ProtectedRoute>} />
    <Route path="/family-office/:officeId" element={<ProtectedRoute><AppLayout><FamilyOfficeLayout><FamilyOfficeDashboardPage /></FamilyOfficeLayout></AppLayout></ProtectedRoute>} />
    <Route path="/family-office/:officeId/*" element={<ProtectedRoute><AppLayout><FamilyOfficeLayout><FamilyOfficeDashboardPage /></FamilyOfficeLayout></AppLayout></ProtectedRoute>} />

    {/* Reports */}
    <Route path="/reports" element={<ProtectedRoute><AppLayout><ReportsLayout /></AppLayout></ProtectedRoute>}>
      <Route index element={<Navigate to="/reports/preset" replace />} />
      <Route path="preset" element={<PresetReportsPage />} />
      <Route path="preset/:category" element={<PresetReportsPage />} />
      <Route path="custom" element={<CustomReportsPage />} />
      <Route path="subscribed" element={<SubscribedReportsPage />} />
      <Route path="packages" element={<ReportPackagesPage />} />
      <Route path="trends" element={<TrendsPage />} />
    </Route>

    {/* Admin Routes with Sidebar */}
    <Route path="/admin" element={<ProtectedRoute><AppLayout><AdminLayout><AdminOverviewPage /></AdminLayout></AppLayout></ProtectedRoute>} />
    <Route path="/admin/home-plans" element={<ProtectedRoute><AppLayout><AdminLayout><HomePlanLibraryPage /></AdminLayout></AppLayout></ProtectedRoute>} />
    <Route path="/admin/budget-templates" element={<ProtectedRoute><AppLayout><AdminLayout><BudgetTemplatesPage /></AdminLayout></AppLayout></ProtectedRoute>} />
    <Route path="/admin/proforma-templates" element={<ProtectedRoute><AppLayout><AdminLayout><ProformaTemplatesPage /></AdminLayout></AppLayout></ProtectedRoute>} />
    <Route path="/admin/schedule-templates" element={<ProtectedRoute><AppLayout><AdminLayout><ScheduleTemplatesPage /></AdminLayout></AppLayout></ProtectedRoute>} />
    <Route path="/admin/deal-templates" element={<ProtectedRoute><AppLayout><AdminLayout><DealTemplatesPage /></AdminLayout></AppLayout></ProtectedRoute>} />
    <Route path="/admin/task-templates" element={<ProtectedRoute><AppLayout><AdminLayout><AdminTaskTemplatesPage /></AdminLayout></AppLayout></ProtectedRoute>} />
    <Route path="/admin/milestone-templates" element={<ProtectedRoute><AppLayout><AdminLayout><MilestoneTemplatesPage /></AdminLayout></AppLayout></ProtectedRoute>} />
    <Route path="/admin/project-templates" element={<ProtectedRoute><AppLayout><AdminLayout><AdminProjectTemplatesPage /></AdminLayout></AppLayout></ProtectedRoute>} />
    <Route path="/admin/coa-templates" element={<ProtectedRoute><AppLayout><AdminLayout><COATemplatesPage /></AdminLayout></AppLayout></ProtectedRoute>} />
    <Route path="/admin/*" element={<ProtectedRoute><AppLayout><AdminLayout><AdminPage /></AdminLayout></AppLayout></ProtectedRoute>} />

    {/* Operations */}
    <Route path="/operations" element={<ProtectedRoute><AppLayout><OperationsDashboard /></AppLayout></ProtectedRoute>} />
    <Route path="/operations/tasks" element={<ProtectedRoute><AppLayout><GlobalTasksPage /></AppLayout></ProtectedRoute>} />
    <Route path="/operations/teams" element={<ProtectedRoute><AppLayout><TeamsPage /></AppLayout></ProtectedRoute>} />

    {/* EOS Module */}
    <Route path="/eos" element={<ProtectedRoute><AppLayout><EOSMainPage /></AppLayout></ProtectedRoute>} />
    <Route path="/eos/:programId/*" element={<ProtectedRoute><AppLayout><EOSDetailPage /></AppLayout></ProtectedRoute>} />

    {/* Budget Tools */}
    <Route path="/budgets/*" element={<ProtectedRoute><AppLayout><BudgetModuleRouter /></AppLayout></ProtectedRoute>} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router
              future={{
                        v7_startTransition: true,
                                  v7_relativeSplatPath: true,
                                          }}
                                                >
        <Helmet><title>AtlasDev | Real Estate Development Platform</title></Helmet>
        <AuthProvider><AppContent /><Toaster /></AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
