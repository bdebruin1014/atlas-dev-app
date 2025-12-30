import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Target, DollarSign, TrendingUp, Calendar, 
  CheckSquare, AlertTriangle, Clock, ArrowRight, Plus
} from 'lucide-react';

const mockStats = {
  activeProjects: 5,
  opportunities: 12,
  totalInvestment: 18500000,
  pendingTasks: 24,
};

const mockRecentProjects = [
  { id: 1, name: 'Watson House', status: 'construction', progress: 65 },
  { id: 2, name: 'Oslo Townhomes', status: 'pre_development', progress: 25 },
  { id: 3, name: 'Riverside Commons', status: 'acquisition', progress: 10 },
];

const mockUpcomingTasks = [
  { id: 1, title: 'Review Watson House draw request', dueDate: '2024-11-05', priority: 'high' },
  { id: 2, title: 'Submit Oslo permit application', dueDate: '2024-11-08', priority: 'medium' },
  { id: 3, title: 'Schedule site inspection', dueDate: '2024-11-10', priority: 'low' },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Bryan</h1>
          <p className="text-gray-500">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/pipeline')}><Target className="w-4 h-4 mr-2" />New Opportunity</Button>
          <Button onClick={() => navigate('/projects')}><Plus className="w-4 h-4 mr-2" />New Project</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/projects')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Projects</p>
                <p className="text-3xl font-bold">{mockStats.activeProjects}</p>
              </div>
              <Building2 className="w-10 h-10 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/pipeline')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Opportunities</p>
                <p className="text-3xl font-bold">{mockStats.opportunities}</p>
              </div>
              <Target className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Investment</p>
                <p className="text-3xl font-bold">${(mockStats.totalInvestment / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/operations/tasks')}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Tasks</p>
                <p className="text-3xl font-bold">{mockStats.pendingTasks}</p>
              </div>
              <CheckSquare className="w-10 h-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => navigate(`/project/${project.id}/overview/basic-info`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <Badge variant="outline" className="text-xs">{project.status.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.progress}%</p>
                    <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Tasks</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/operations/tasks')}>View All <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUpcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
                    </div>
                  </div>
                  <Badge className={
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }>{task.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
