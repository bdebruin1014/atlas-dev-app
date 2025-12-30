import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layout Components
import TopNavigation from '@/components/TopNavigation';
import ProjectSidebar from '@/components/ProjectSidebar';
import OpportunitySidebar from '@/components/OpportunitySidebar';
import EntityAccountingSidebar from '@/components/EntityAccountingSidebar';

// Core Pages
import HomePage from '@/pages/HomePage';
import ProjectsListPage from '@/pages/ProjectsListPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import PipelineListPage from '@/pages/PipelineListPage';
import OpportunityDetailPage from '@/pages/OpportunityDetailPage';
import CalendarPage from '@/pages/CalendarPage';

// Operations Pages
import GlobalTasksPage from '@/pages/operations/GlobalTasksPage';
import TaskTemplatesPage from '@/pages/operations/TaskTemplatesPage';
import MilestoneTemplatesPage from '@/pages/operations/MilestoneTemplatesPage';
import OperationsReportsPage from '@/pages/operations/OperationsReportsPage';
import ProductLibraryPage from '@/pages/operations/ProductLibraryPage';

// Investor Pages
import InvestorContactsPage from '@/pages/investors/InvestorContactsPage';
import InvestmentsPage from '@/pages/investors/InvestmentsPage';
import CapitalRaisingPage from '@/pages/investors/CapitalRaisingPage';

// Accounting Pages
import AccountingEntitiesListPage from '@/pages/accounting/AccountingEntitiesListPage';
import EntityAccountingDashboard from '@/pages/accounting/EntityAccountingDashboard';
import BankAccountsPage from '@/pages/accounting/BankAccountsPage';
import BankAccountRegisterPage from '@/pages/accounting/BankAccountRegisterPage';
import ReconciliationPage from '@/pages/accounting/ReconciliationPage';
import DepositsPage from '@/pages/accounting/DepositsPage';
import WireTrackingPage from '@/pages/accounting/WireTrackingPage';
import BillsPage from '@/pages/accounting/BillsPage';
import PaymentsPage from '@/pages/accounting/PaymentsPage';
import InvoicesPage from '@/pages/accounting/InvoicesPage';
import JournalEntriesPage from '@/pages/accounting/JournalEntriesPage';
import CapitalAccountsPage from '@/pages/accounting/CapitalAccountsPage';
import DistributionsPage from '@/pages/accounting/DistributionsPage';
import K1DocumentsPage from '@/pages/accounting/K1DocumentsPage';
import FinancialReportsPage from '@/pages/accounting/FinancialReportsPage';
import TrialBalancePage from '@/pages/accounting/TrialBalancePage';
import ChartOfAccountsPage from '@/pages/accounting/ChartOfAccountsPage';

// Settings
import SettingsPage from '@/pages/SettingsPage';

// Main Layout with Top Navigation
const MainLayout = () => (
  <div className="flex flex-col h-screen">
    <TopNavigation />
    <main className="flex-1 overflow-hidden">
      <Outlet />
    </main>
  </div>
);

// Project Layout with Dark Sidebar
const ProjectLayout = () => (
  <div className="flex h-full">
    <ProjectSidebar />
    <div className="flex-1 overflow-hidden">
      <Outlet />
    </div>
  </div>
);

// Opportunity Layout with Dark Sidebar
const OpportunityLayout = () => (
  <div className="flex h-full">
    <OpportunitySidebar />
    <div className="flex-1 overflow-hidden">
      <Outlet />
    </div>
  </div>
);

// Entity Accounting Layout with Dark Sidebar
const EntityAccountingLayout = () => (
  <div className="flex h-full">
    <EntityAccountingSidebar />
    <div className="flex-1 overflow-hidden">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Home */}
          <Route path="/" element={<HomePage />} />
          
          {/* Calendar */}
          <Route path="/calendar" element={<CalendarPage />} />
          
          {/* Operations */}
          <Route path="/operations/tasks" element={<GlobalTasksPage />} />
          <Route path="/operations/task-templates" element={<TaskTemplatesPage />} />
          <Route path="/operations/milestone-templates" element={<MilestoneTemplatesPage />} />
          <Route path="/operations/reports" element={<OperationsReportsPage />} />
          <Route path="/operations/product-library" element={<ProductLibraryPage />} />
          
          {/* Projects List */}
          <Route path="/projects" element={<ProjectsListPage />} />
          
          {/* Project Detail with Dark Sidebar */}
          <Route path="/project/:projectId" element={<ProjectLayout />}>
            <Route index element={<Navigate to="overview/basic-info" replace />} />
            <Route path=":module" element={<ProjectDetailPage />} />
            <Route path=":module/:section" element={<ProjectDetailPage />} />
          </Route>
          
          {/* Pipeline / Opportunities List */}
          <Route path="/pipeline" element={<PipelineListPage />} />
          
          {/* Opportunity Detail with Dark Sidebar */}
          <Route path="/pipeline/:opportunityId" element={<OpportunityLayout />}>
            <Route index element={<Navigate to="overview/basic-info" replace />} />
            <Route path=":module" element={<OpportunityDetailPage />} />
            <Route path=":module/:section" element={<OpportunityDetailPage />} />
          </Route>
          
          {/* Investors */}
          <Route path="/investors" element={<Navigate to="/investors/contacts" replace />} />
          <Route path="/investors/contacts" element={<InvestorContactsPage />} />
          <Route path="/investors/investments" element={<InvestmentsPage />} />
          <Route path="/investors/capital-raising" element={<CapitalRaisingPage />} />
          
          {/* Accounting - Entities List (main entry point) */}
          <Route path="/accounting" element={<Navigate to="/accounting/entities" replace />} />
          <Route path="/accounting/entities" element={<AccountingEntitiesListPage />} />
          
          {/* Entity Accounting Detail with Dark Sidebar */}
          <Route path="/accounting/entities/:entityId" element={<EntityAccountingLayout />}>
            <Route index element={<EntityAccountingDashboard />} />
            <Route path="bank-accounts" element={<BankAccountsPage />} />
            <Route path="register" element={<BankAccountRegisterPage />} />
            <Route path="reconciliation" element={<ReconciliationPage />} />
            <Route path="deposits" element={<DepositsPage />} />
            <Route path="wire-tracking" element={<WireTrackingPage />} />
            <Route path="bills" element={<BillsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="journal-entries" element={<JournalEntriesPage />} />
            <Route path="capital" element={<CapitalAccountsPage />} />
            <Route path="distributions" element={<DistributionsPage />} />
            <Route path="k1-documents" element={<K1DocumentsPage />} />
            <Route path="reports" element={<FinancialReportsPage />} />
            <Route path="trial-balance" element={<TrialBalancePage />} />
            <Route path="chart-of-accounts" element={<ChartOfAccountsPage />} />
          </Route>
          
          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/profile" element={<SettingsPage />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
