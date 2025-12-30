import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BarChart3, Search, FileText, Calendar, AlertCircle,
  DollarSign, Users, CheckSquare, TrendingUp, Building2
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const PresetReportsPage = () => {
  const { category = 'general' } = useParams();
  const navigate = useNavigate();

  const categoryTitles = {
    general: 'General Reports',
    development: 'Development Reports',
    accounting: 'Accounting Reports',
    construction: 'Construction Reports',
    investors: 'Investor Reports',
    contacts: 'Contacts Reports',
    tasks: 'Tasks Reports',
  };

  const reportsByCategory = {
    general: [
      { id: 'open-projects', title: 'Open Projects', description: 'Projects created within a date range.', icon: FileText },
      { id: 'source-of-business', title: 'Source of Business', description: 'Referral volumes within a date range.', icon: Users },
      { id: 'project-status', title: 'Project Status', description: 'Cancelled, Closed, & Opened Projects', icon: BarChart3 },
      { id: 'closing-projects', title: 'Closing Projects', description: 'Projects closing within a date range.', icon: Building2 },
      { id: 'critical-issues', title: 'Critical Issues', description: 'Projects with outstanding critical issues.', icon: AlertCircle },
      { id: 'loan-commitments', title: 'Loan Commitments', description: 'Projects with loan commitments in a date range.', icon: DollarSign },
      { id: 'calendar', title: 'Calendar', description: 'List of appointments.', icon: Calendar },
      { id: 'commissions', title: 'Commissions', description: 'Projects with earned commission.', icon: DollarSign },
    ],
    development: [
      { id: 'active-developments', title: 'Active Developments', description: 'All active development projects.', icon: Building2 },
      { id: 'lot-inventory', title: 'Lot Inventory', description: 'Available lots by subdivision.', icon: FileText },
      { id: 'construction-starts', title: 'Construction Starts', description: 'Projects starting construction.', icon: TrendingUp },
      { id: 'completion-timeline', title: 'Completion Timeline', description: 'Projected completion dates.', icon: Calendar },
    ],
    accounting: [
      { id: 'revenue-summary', title: 'Revenue Summary', description: 'Revenue by project and entity.', icon: DollarSign },
      { id: 'expense-report', title: 'Expense Report', description: 'Expenses by category.', icon: FileText },
      { id: 'profit-loss', title: 'Profit & Loss', description: 'P&L by project or entity.', icon: BarChart3 },
      { id: 'cash-flow', title: 'Cash Flow', description: 'Cash flow projections.', icon: TrendingUp },
    ],
    construction: [
      { id: 'draw-schedule', title: 'Draw Schedule', description: 'Upcoming and past draw requests.', icon: DollarSign },
      { id: 'budget-variance', title: 'Budget Variance', description: 'Budget vs actual by project.', icon: BarChart3 },
      { id: 'change-orders', title: 'Change Orders', description: 'All change orders by status.', icon: FileText },
      { id: 'inspection-schedule', title: 'Inspection Schedule', description: 'Upcoming inspections.', icon: Calendar },
    ],
    investors: [
      { id: 'investor-summary', title: 'Investor Summary', description: 'Capital contributions by investor.', icon: Users },
      { id: 'distribution-report', title: 'Distribution Report', description: 'Distributions by project.', icon: DollarSign },
      { id: 'k1-status', title: 'K-1 Status', description: 'K-1 document delivery status.', icon: FileText },
      { id: 'irr-report', title: 'IRR Report', description: 'Internal rate of return by project.', icon: TrendingUp },
    ],
    contacts: [
      { id: 'contact-list', title: 'Contact List', description: 'All contacts by type.', icon: Users },
      { id: 'vendor-list', title: 'Vendor List', description: 'Vendors by category.', icon: Building2 },
      { id: 'lender-contacts', title: 'Lender Contacts', description: 'All lender relationships.', icon: Users },
    ],
    tasks: [
      { id: 'overdue-tasks', title: 'Overdue Tasks', description: 'Tasks past due date.', icon: AlertCircle },
      { id: 'upcoming-tasks', title: 'Upcoming Tasks', description: 'Tasks due in next 7 days.', icon: Calendar },
      { id: 'task-completion', title: 'Task Completion', description: 'Task completion rate by project.', icon: CheckSquare },
      { id: 'milestone-status', title: 'Milestone Status', description: 'Milestone progress by project.', icon: TrendingUp },
    ],
  };

  const reports = reportsByCategory[category] || reportsByCategory.general;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <h1 className="text-lg font-semibold text-gray-900">{categoryTitles[category]}</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search reports..."
            className="pl-9 w-64 h-9 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => navigate(`/reports/view/${report.id}`)}
            className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-[#047857] hover:shadow-sm transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <report.icon className="w-8 h-8 text-gray-400 mb-3 group-hover:text-[#047857]" />
              <h3 className="text-sm font-medium text-[#047857] mb-1">{report.title}</h3>
              <p className="text-xs text-gray-500">{report.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PresetReportsPage;
