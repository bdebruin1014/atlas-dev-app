import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, MapPin, Calendar, DollarSign, 
  Users, FileText, Settings, CheckSquare, BarChart3,
  ChevronRight, Edit, MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Mock project data
const mockProjectData = {
  id: 1,
  name: 'Watson House',
  code: 'PRJ-001',
  status: 'construction',
  type: 'Multifamily',
  entity: 'Watson House LLC',
  address: '123 Main Street',
  city: 'Greenville',
  state: 'SC',
  zip: '29601',
  units: 48,
  sqft: 52000,
  budget: 18000000,
  spent: 12500000,
  startDate: '2024-01-15',
  endDate: '2025-06-30',
  description: 'A 48-unit multifamily development in downtown Greenville.',
  team: [
    { id: 1, name: 'John Smith', role: 'Project Manager', email: 'john@example.com' },
    { id: 2, name: 'Sarah Johnson', role: 'Architect', email: 'sarah@example.com' },
    { id: 3, name: 'Mike Williams', role: 'Contractor', email: 'mike@example.com' },
  ],
  milestones: [
    { id: 1, name: 'Site Acquisition', date: '2024-01-15', status: 'complete' },
    { id: 2, name: 'Permits Approved', date: '2024-03-01', status: 'complete' },
    { id: 3, name: 'Foundation Complete', date: '2024-06-15', status: 'complete' },
    { id: 4, name: 'Framing Complete', date: '2024-10-01', status: 'in_progress' },
    { id: 5, name: 'Final Inspection', date: '2025-05-01', status: 'pending' },
    { id: 6, name: 'Certificate of Occupancy', date: '2025-06-30', status: 'pending' },
  ],
  budgetCategories: [
    { name: 'Land', budgeted: 3000000, spent: 3000000 },
    { name: 'Hard Costs', budgeted: 12000000, spent: 8500000 },
    { name: 'Soft Costs', budgeted: 2000000, spent: 850000 },
    { name: 'Contingency', budgeted: 1000000, spent: 150000 },
  ],
};

const statusColors = {
  pre_development: 'bg-blue-100 text-blue-800',
  construction: 'bg-yellow-100 text-yellow-800',
  lease_up: 'bg-purple-100 text-purple-800',
  stabilized: 'bg-green-100 text-green-800',
};

const milestoneStatusColors = {
  complete: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-gray-100 text-gray-600',
};

const ProjectContent = ({ project, tab = 'overview', subtab }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab);
  
  // Use mock data for now
  const data = mockProjectData;
  const budgetProgress = (data.spent / data.budget) * 100;

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/projects')}
              className="text-gray-500 hover:text-gray-900 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Projects
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
                  <Badge className={cn(statusColors[data.status])}>
                    {data.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{data.code} • {data.entity}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="draws">Draws</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{data.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Units</p>
                      <p className="font-medium">{data.units}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Square Footage</p>
                      <p className="font-medium">{data.sqft.toLocaleString()} SF</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Entity</p>
                      <p className="font-medium">{data.entity}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {data.address}, {data.city}, {data.state} {data.zip}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700">{data.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">Spent</span>
                      <span className="font-medium">{budgetProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={budgetProgress} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Budget</span>
                      <span className="font-medium">{formatCurrency(data.budget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Spent</span>
                      <span className="font-medium">{formatCurrency(data.spent)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-medium">Remaining</span>
                      <span className="font-bold text-emerald-600">
                        {formatCurrency(data.budget - data.spent)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Key Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center gap-4">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        milestone.status === 'complete' ? 'bg-green-500' :
                        milestone.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'
                      )} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{milestone.name}</p>
                      </div>
                      <Badge className={cn('text-xs', milestoneStatusColors[milestone.status])}>
                        {milestone.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm text-gray-500">{formatDate(milestone.date)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.budgetCategories.map((category) => {
                    const progress = (category.spent / category.budgeted) * 100;
                    return (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-gray-500">
                            {formatCurrency(category.spent)} / {formatCurrency(category.budgeted)}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{formatDate(data.startDate)}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Target Completion</p>
                    <p className="font-medium">{formatDate(data.endDate)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {data.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="font-medium">{milestone.name}</p>
                        <p className="text-sm text-gray-500">{formatDate(milestone.date)}</p>
                      </div>
                      <Badge className={cn(milestoneStatusColors[milestone.status])}>
                        {milestone.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.team.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                      <span className="text-sm text-gray-500">{member.email}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Documents</CardTitle>
                <Button size="sm">
                  <FileText className="w-4 h-4 mr-2" /> Upload
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No documents uploaded yet</p>
                  <p className="text-sm">Upload project documents to get started</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Draws Tab */}
          <TabsContent value="draws">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Draw Requests</CardTitle>
                <Button size="sm">
                  <DollarSign className="w-4 h-4 mr-2" /> New Draw
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No draw requests yet</p>
                  <p className="text-sm">Create a draw request to get started</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectContent;
