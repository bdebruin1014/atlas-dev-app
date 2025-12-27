import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Plus, Search, Filter, Building2, MapPin, Calendar, 
  DollarSign, MoreHorizontal, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const mockProjects = [
  { id: 1, name: 'Watson House', code: 'PRJ-001', type: 'Multifamily', status: 'construction', entity: 'Watson House LLC', address: '123 Main St, Greenville, SC', budget: 18000000, spent: 12500000, units: 48, startDate: '2024-01-15', targetCompletion: '2025-06-30' },
  { id: 2, name: 'Oslo Townhomes', code: 'PRJ-002', type: 'Townhomes', status: 'pre_development', entity: 'Oslo Townhomes LLC', address: '456 Oslo Dr, Spartanburg, SC', budget: 4500000, spent: 250000, units: 12, startDate: '2024-06-01', targetCompletion: '2025-12-31' },
  { id: 3, name: 'Cedar Mill Apartments', code: 'PRJ-003', type: 'Multifamily', status: 'acquisition', entity: 'Cedar Mill LLC', address: '789 Cedar Mill Rd, Anderson, SC', budget: 8500000, spent: 0, units: 24, startDate: null, targetCompletion: '2026-03-15' },
  { id: 4, name: 'Pine Valley Lots', code: 'PRJ-004', type: 'Lot Development', status: 'construction', entity: 'Pine Valley LLC', address: '321 Pine Valley Way, Easley, SC', budget: 2800000, spent: 1200000, units: 45, startDate: '2024-03-01', targetCompletion: '2024-12-15' },
  { id: 5, name: 'Riverside Spec Homes', code: 'PRJ-005', type: 'Spec Building', status: 'stabilized', entity: 'Riverside Homes LLC', address: '555 Riverside Dr, Greer, SC', budget: 3200000, spent: 3100000, units: 4, startDate: '2023-06-01', targetCompletion: '2024-04-30' },
];

const statusConfig = {
  acquisition: { label: 'Acquisition', color: 'bg-blue-100 text-blue-800' },
  pre_development: { label: 'Pre-Development', color: 'bg-purple-100 text-purple-800' },
  construction: { label: 'Construction', color: 'bg-yellow-100 text-yellow-800' },
  stabilized: { label: 'Stabilized', color: 'bg-green-100 text-green-800' },
  disposition: { label: 'Disposition', color: 'bg-orange-100 text-orange-800' },
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ProjectsListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredProjects = mockProjects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalBudget = mockProjects.reduce((a, p) => a + p.budget, 0);
  const totalSpent = mockProjects.reduce((a, p) => a + p.spent, 0);
  const totalUnits = mockProjects.reduce((a, p) => a + p.units, 0);

  return (
    <>
      <Helmet><title>Projects | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-500">Manage your real estate development projects</p>
            </div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]">
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase">Total Projects</p>
                <p className="text-2xl font-bold">{mockProjects.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase">Total Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase">Total Spent</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalSpent)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase">Total Units</p>
                <p className="text-2xl font-bold">{totalUnits}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search projects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="acquisition">Acquisition</SelectItem>
                <SelectItem value="pre_development">Pre-Development</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="stabilized">Stabilized</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Multifamily">Multifamily</SelectItem>
                <SelectItem value="Townhomes">Townhomes</SelectItem>
                <SelectItem value="Lot Development">Lot Development</SelectItem>
                <SelectItem value="Spec Building">Spec Building</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Projects Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map(project => (
                  <TableRow 
                    key={project.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/project/${project.id}/overview/basic-info`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{project.name}</p>
                          <p className="text-xs text-gray-500">{project.code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{project.type}</TableCell>
                    <TableCell className="text-gray-600">{project.entity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="text-sm">{project.address.split(',')[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(project.budget)}</TableCell>
                    <TableCell className="text-right text-blue-600">{formatCurrency(project.spent)}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[project.status]?.color}>
                        {statusConfig[project.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProjectsListPage;
