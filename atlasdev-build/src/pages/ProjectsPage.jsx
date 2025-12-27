import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, FolderKanban, Building2, MapPin, DollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

const mockProjects = [
  { id: 1, name: 'Watson House', code: 'PRJ-001', status: 'construction', type: 'Multifamily', units: 48, budget: 18000000, spent: 12500000, location: 'Greenville, SC', endDate: '2025-06-30' },
  { id: 2, name: 'Oslo Townhomes', code: 'PRJ-002', status: 'pre_development', type: 'BTR', units: 32, budget: 14000000, spent: 2500000, location: 'Spartanburg, SC', endDate: '2025-12-31' },
  { id: 3, name: 'Cedar Mill Apartments', code: 'PRJ-003', status: 'construction', type: 'Multifamily', units: 72, budget: 22000000, spent: 18500000, location: 'Greer, SC', endDate: '2025-03-15' },
];

const statusColors = {
  pre_development: 'bg-blue-100 text-blue-800',
  construction: 'bg-yellow-100 text-yellow-800',
  lease_up: 'bg-purple-100 text-purple-800',
  stabilized: 'bg-green-100 text-green-800',
};

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = mockProjects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500">{mockProjects.length} active projects</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <Link key={project.id} to={`/project/${project.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.code}</p>
                    </div>
                  </div>
                  <Badge className={cn(statusColors[project.status])}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    {project.type} • {project.units} units
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(project.spent, { compact: true })} / {formatCurrency(project.budget, { compact: true })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Target: {formatDate(project.endDate)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium">{Math.round((project.spent / project.budget) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(project.spent / project.budget) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
