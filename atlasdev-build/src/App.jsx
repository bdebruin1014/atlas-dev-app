import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Layouts
import TopNavigation from '@/components/TopNavigation';
import ProjectLayout from '@/components/layouts/ProjectLayout';
import OpportunityLayout from '@/components/layouts/OpportunityLayout';
import BankAccountLayout from '@/components/layouts/BankAccountLayout';

// Main Pages
import HomePage from '@/pages/HomePage';
import ProjectsListPage from '@/pages/ProjectsListPage';
import PipelineListPage from '@/pages/PipelineListPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import OpportunityDetailPage from '@/pages/OpportunityDetailPage';

// Accounting Pages
import AccountingEntitiesListPage from '@/pages/accounting/AccountingEntitiesListPage';
import EntityAccountingDashboard from '@/pages/accounting/EntityAccountingDashboard';
import BankAccountsPage from '@/pages/accounting/BankAccountsPage';
import BankAccountRegisterPage from '@/pages/accounting/BankAccountRegisterPage';
import BankingPage from '@/pages/accounting/BankingPage';
import ReconciliationPage from '@/pages/accounting/ReconciliationPage';
import AggregatePaymentsPage from '@/pages/accounting/AggregatePaymentsPage';
import ChartOfAccountsPage from '@/pages/accounting/ChartOfAccountsPage';
import VendorsPage from '@/pages/accounting/VendorsPage';
import BillsPage from '@/pages/accounting/BillsPage';
import PaymentsPage from '@/pages/accounting/PaymentsPage';
import JournalEntriesPage from '@/pages/accounting/JournalEntriesPage';
import InvoicesPage from '@/pages/accounting/InvoicesPage';
import FinancialReportsPage from '@/pages/accounting/FinancialReportsPage';
import EntityCapitalPage from '@/pages/accounting/EntityCapitalPage';
import ConsolidatedViewPage from '@/pages/accounting/ConsolidatedViewPage';

// Investor Pages
import InvestorsPage from '@/pages/investors/InvestorsPage';
import CapitalCallsPage from '@/pages/investors/CapitalCallsPage';

// Operations Pages
import GlobalTasksPage from '@/pages/operations/GlobalTasksPage';

// Main App Layout Component
const MainLayout = ({ children }) => (
  <div className="flex flex-col h-screen bg-[#F7FAFC]">
    <TopNavigation />
    <main className="flex-1 overflow-hidden">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Helmet>
        <title>AtlasDev | Real Estate Development Platform</title>
        <meta name="description" content="Comprehensive real estate development management platform" />
      </Helmet>
      
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />

        {/* Projects */}
        <Route path="/projects" element={<MainLayout><ProjectsListPage /></MainLayout>} />
        <Route path="/project/:projectId/*" element={<MainLayout><ProjectLayout /></MainLayout>}>
          <Route index element={<Navigate to="overview/basic-info" replace />} />
          <Route path=":module/:section" element={<ProjectDetailPage />} />
        </Route>

        {/* Pipeline / Opportunities */}
        <Route path="/pipeline" element={<MainLayout><PipelineListPage /></MainLayout>} />
        <Route path="/pipeline/opportunity/:opportunityId/*" element={<MainLayout><OpportunityLayout /></MainLayout>}>
          <Route index element={<Navigate to="overview/basic-info" replace />} />
          <Route path=":module/:section" element={<OpportunityDetailPage />} />
        </Route>

        {/* Accounting - Entity List */}
        <Route path="/accounting/entities" element={<MainLayout><AccountingEntitiesListPage /></MainLayout>} />
        
        {/* Accounting - Entity Dashboard */}
        <Route path="/accounting/entity/:entityId" element={<MainLayout><EntityAccountingDashboard /></MainLayout>} />
        <Route path="/accounting/entity/:entityId/chart-of-accounts" element={<MainLayout><ChartOfAccountsPage /></MainLayout>} />
        <Route path="/accounting/entity/:entityId/capital" element={<MainLayout><EntityCapitalPage /></MainLayout>} />

        {/* Accounting - Bank Account Routes (Qualia-style three-column) */}
        <Route path="/accounting/entity/:entityId/bank/:accountId/*" element={<MainLayout><BankAccountLayout /></MainLayout>}>
          <Route index element={<Navigate to="register" replace />} />
          <Route path="register" element={<BankAccountRegisterPage />} />
          <Route path="banking" element={<BankingPage />} />
          <Route path="reconciliation" element={<ReconciliationPage />} />
          <Route path="aggregate-payments" element={<AggregatePaymentsPage />} />
          <Route path="reports" element={<FinancialReportsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
        </Route>

        {/* Accounting - Global Pages */}
        <Route path="/accounting/bank-accounts" element={<MainLayout><BankAccountsPage /></MainLayout>} />
        <Route path="/accounting/chart-of-accounts" element={<MainLayout><ChartOfAccountsPage /></MainLayout>} />
        <Route path="/accounting/vendors" element={<MainLayout><VendorsPage /></MainLayout>} />
        <Route path="/accounting/bills" element={<MainLayout><BillsPage /></MainLayout>} />
        <Route path="/accounting/payments" element={<MainLayout><PaymentsPage /></MainLayout>} />
        <Route path="/accounting/journal-entries" element={<MainLayout><JournalEntriesPage /></MainLayout>} />
        <Route path="/accounting/invoices" element={<MainLayout><InvoicesPage /></MainLayout>} />
        <Route path="/accounting/reports" element={<MainLayout><FinancialReportsPage /></MainLayout>} />
        <Route path="/accounting/consolidated" element={<MainLayout><ConsolidatedViewPage /></MainLayout>} />

        {/* Investors */}
        <Route path="/investors" element={<MainLayout><InvestorsPage /></MainLayout>} />
        <Route path="/investors/capital-accounts" element={<MainLayout><EntityCapitalPage /></MainLayout>} />
        <Route path="/investors/capital-calls" element={<MainLayout><CapitalCallsPage /></MainLayout>} />
        <Route path="/investors/distributions" element={<MainLayout><CapitalCallsPage /></MainLayout>} />
        <Route path="/investors/ownership" element={<MainLayout><ConsolidatedViewPage /></MainLayout>} />

        {/* Operations */}
        <Route path="/operations/tasks" element={<MainLayout><GlobalTasksPage /></MainLayout>} />
        <Route path="/calendar" element={<MainLayout><GlobalTasksPage /></MainLayout>} />
        <Route path="/contacts" element={<MainLayout><VendorsPage /></MainLayout>} />

        {/* Settings */}
        <Route path="/settings" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/settings/profile" element={<MainLayout><HomePage /></MainLayout>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
