import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Building2, Target, DollarSign, TrendingUp, AlertCircle, CheckCircle, 
  Clock, Calendar, Users, FileText, ArrowUpRight, ArrowDownRight, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

const dashboardData = {
  activeProjects: 5,
  pipelineOpportunities: 8,
  totalAssets: 47550000,
  cashBalance: 5415000,
  monthlyExpenses: 1250000,
  pendingApprovals: 12,
};

const recentActivity = [
  { id: 1, type: 'payment', description: 'Draw payment to BuildRight Construction', amount: -450000, project: 'Watson House', date: '2024-06-15' },
  { id: 2, type: 'deposit', description: 'Capital contribution received', amount: 250000, project: 'VanRock Holdings', date: '2024-06-12' },
  { id: 3, type: 'invoice', description: 'Invoice from ABC Lumber Supply', amount: -28500, project: 'Watson House', date: '2024-06-10' },
  { id: 4, type: 'payment', description: 'Permit fees paid', amount: -8500, project: 'Watson House', date: '2024-06-08' },
];

const upcomingTasks = [
  { id: 1, title: 'Review draw request #5', project: 'Watson House', due: '2024-06-20', priority: 'high' },
  { id: 2, title: 'Complete monthly reconciliation', project: 'All Entities', due: '2024-06-30', priority: 'medium' },
  { id: 3, title: 'Investor distribution Q2', project: 'VanRock Holdings', due: '2024-07-01', priority: 'high' },
  { id: 4, title: 'Insurance renewal review', project: 'Watson House', due: '2024-07-15', priority: 'low' },
];

const projectStatus = [
  { name: 'Watson House', progress: 65, budget: 18000000, spent: 12500000, status: 'on_track' },
  { name: 'Oslo Townhomes', progress: 15, budget: 4500000, spent: 250000, status: 'on_track' },
  { name: 'Pine Valley Lots', progress: 85, budget: 2800000, spent: 2400000, status: 'ahead' },
  { name: 'Cedar Mill Apartments', progress: 5, budget: 8500000, spent: 125000, status: 'delayed' },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet><title>Dashboard | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back, Bryan. Here's your portfolio overview.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate('/projects')}>
              <CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-500 uppercase">Active Projects</p><p className="text-2xl font-bold">{dashboardData.activeProjects}</p></div><Building2 className="w-8 h-8 text-emerald-600" /></div></CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate('/pipeline')}>
              <CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-500 uppercase">Pipeline</p><p className="text-2xl font-bold">{dashboardData.pipelineOpportunities}</p></div><Target className="w-8 h-8 text-blue-600" /></div></CardContent>
            </Card>
            <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-500 uppercase">Total Assets</p><p className="text-2xl font-bold">{formatCurrency(dashboardData.totalAssets)}</p></div><TrendingUp className="w-8 h-8 text-green-600" /></div></CardContent></Card>
            <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-500 uppercase">Cash Balance</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(dashboardData.cashBalance)}</p></div><DollarSign className="w-8 h-8 text-blue-600" /></div></CardContent></Card>
            <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-500 uppercase">Monthly Expenses</p><p className="text-2xl font-bold text-red-600">{formatCurrency(dashboardData.monthlyExpenses)}</p></div><ArrowDownRight className="w-8 h-8 text-red-600" /></div></CardContent></Card>
            <Card><CardContent className="pt-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-500 uppercase">Pending Approvals</p><p className="text-2xl font-bold text-yellow-600">{dashboardData.pendingApprovals}</p></div><AlertCircle className="w-8 h-8 text-yellow-600" /></div></CardContent></Card>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Project Status */}
            <Card className="col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-base">Project Status</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectStatus.map(project => (
                    <div key={project.name} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2"><p className="font-medium">{project.name}</p><Badge className={project.status === 'on_track' ? 'bg-green-100 text-green-800' : project.status === 'ahead' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}>{project.status.replace('_', ' ')}</Badge></div>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 mb-2" />
                      <div className="flex justify-between text-xs text-gray-500"><span>Spent: {formatCurrency(project.spent)}</span><span>Budget: {formatCurrency(project.budget)}</span></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center justify-between">Upcoming Tasks<Button variant="ghost" size="sm" onClick={() => navigate('/operations/tasks')}>View All</Button></CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map(task => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between"><p className="font-medium text-sm">{task.title}</p><Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">{task.priority}</Badge></div>
                      <p className="text-xs text-gray-500 mt-1">{task.project}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {task.due}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader className="pb-2"><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", activity.amount >= 0 ? "bg-green-100" : "bg-red-100")}>
                        {activity.amount >= 0 ? <ArrowUpRight className="w-5 h-5 text-green-600" /> : <ArrowDownRight className="w-5 h-5 text-red-600" />}
                      </div>
                      <div><p className="font-medium text-sm">{activity.description}</p><p className="text-xs text-gray-500">{activity.project} • {activity.date}</p></div>
                    </div>
                    <span className={cn("font-semibold", activity.amount >= 0 ? "text-green-600" : "text-red-600")}>{activity.amount >= 0 ? '+' : ''}{formatCurrency(activity.amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HomePage;
