import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Building2, MapPin, DollarSign, Calendar, Grid, List } from 'lucide-react';

const mockProjects = [
  { id: 1, name: 'Watson House', code: 'PRJ-001', entity: 'Watson House LLC', status: 'construction', type: 'Multifamily', city: 'Denver', state: 'CO', budget: 3650000, progress: 65, startDate: '2024-03-15' },
  { id: 2, name: 'Oslo Townhomes', code: 'PRJ-002', entity: 'Oslo Townhomes LLC', status: 'pre_development', type: 'Townhomes', city: 'Aurora', state: 'CO', budget: 2200000, progress: 25, startDate: '2024-08-01' },
  { id: 3, name: 'Riverside Commons', code: 'PRJ-003', entity: 'Riverside LLC', status: 'acquisition', type: 'Mixed Use', city: 'Lakewood', state: 'CO', budget: 5500000, progress: 10, startDate: '2024-10-15' },
  { id: 4, name: 'Maple Street Lots', code: 'PRJ-004', entity: 'Maple Dev LLC', status: 'stabilized', type: 'Lot Development', city: 'Boulder', state: 'CO', budget: 1800000, progress: 100, startDate: '2023-06-01' },
];

const ProjectsListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const filteredProjects = mockProjects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    acquisition: 'bg-blue-500 text-white',
    pre_development: 'bg-purple-500 text-white',
    construction: 'bg-yellow-500 text-black',
    stabilized: 'bg-green-500 text-white',
    disposition: 'bg-orange-500 text-white',
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button><Plus className="w-4 h-4 mr-2" />New Project</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Projects</p><p className="text-2xl font-bold">{mockProjects.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">In Construction</p><p className="text-2xl font-bold text-yellow-600">{mockProjects.filter(p => p.status === 'construction').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Pre-Development</p><p className="text-2xl font-bold text-purple-600">{mockProjects.filter(p => p.status === 'pre_development').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Budget</p><p className="text-2xl font-bold">${(mockProjects.reduce((s, p) => s + p.budget, 0) / 1000000).toFixed(1)}M</p></CardContent></Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search projects..." 
              className="pl-9 w-64" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="acquisition">Acquisition</SelectItem>
              <SelectItem value="pre_development">Pre-Development</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="stabilized">Stabilized</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}><Grid className="w-4 h-4" /></Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/project/${project.id}/overview/basic-info`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-xs text-gray-500">{project.code}</p>
                    </div>
                  </div>
                  <Badge className={statusColors[project.status]}>{project.status.replace('_', ' ')}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{project.city}, {project.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <DollarSign className="w-4 h-4" />
                    <span>${(project.budget / 1000000).toFixed(2)}M budget</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Project</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Budget</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Progress</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr 
                    key={project.id} 
                    className="border-t cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/project/${project.id}/overview/basic-info`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-xs text-gray-500">{project.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{project.city}, {project.state}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{project.type}</Badge></td>
                    <td className="px-4 py-3 text-right font-medium">${(project.budget / 1000000).toFixed(2)}M</td>
                    <td className="px-4 py-3"><Badge className={statusColors[project.status]}>{project.status.replace('_', ' ')}</Badge></td>
                    <td className="px-4 py-3 text-right">{project.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectsListPage;
