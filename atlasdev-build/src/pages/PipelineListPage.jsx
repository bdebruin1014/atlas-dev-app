import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Plus, Search, Target, MapPin, DollarSign, ChevronRight, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const mockOpportunities = [
  { id: 1, name: 'Highland Park Mixed-Use', propertyType: 'Mixed-Use', status: 'qualified', stage: 'Due Diligence', address: '5800 N Figueroa St, Los Angeles, CA', askingPrice: 4200000, targetOffer: 3850000, source: 'Broker Referral', createdDate: '2023-10-24' },
  { id: 2, name: 'Riverside Industrial', propertyType: 'Industrial', status: 'new', stage: 'Initial Review', address: '2100 Commerce Way, Riverside, CA', askingPrice: 2800000, targetOffer: 2500000, source: 'Direct Mail', createdDate: '2024-01-10' },
  { id: 3, name: 'Downtown Office Building', propertyType: 'Office', status: 'offer_submitted', stage: 'Negotiation', address: '450 Main St, Charlotte, NC', askingPrice: 8500000, targetOffer: 7800000, source: 'Broker Referral', createdDate: '2023-11-15' },
  { id: 4, name: 'Suburban Retail Center', propertyType: 'Retail', status: 'under_contract', stage: 'Due Diligence', address: '1200 Shopping Blvd, Greenville, SC', askingPrice: 5600000, targetOffer: 5200000, source: 'Off-Market', createdDate: '2023-12-01' },
  { id: 5, name: 'Medical Office Complex', propertyType: 'Medical Office', status: 'new', stage: 'Initial Review', address: '300 Health Way, Spartanburg, SC', askingPrice: 3200000, targetOffer: null, source: 'Auction', createdDate: '2024-01-20' },
];

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-800' },
  qualified: { label: 'Qualified', color: 'bg-emerald-100 text-emerald-800' },
  offer_submitted: { label: 'Offer Submitted', color: 'bg-yellow-100 text-yellow-800' },
  under_contract: { label: 'Under Contract', color: 'bg-purple-100 text-purple-800' },
  closed_won: { label: 'Closed Won', color: 'bg-green-100 text-green-800' },
  closed_lost: { label: 'Closed Lost', color: 'bg-red-100 text-red-800' },
};

const formatCurrency = (amount) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const PipelineListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOpportunities = mockOpportunities.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalValue = mockOpportunities.reduce((a, o) => a + o.askingPrice, 0);
  const activeCount = mockOpportunities.filter(o => !['closed_won', 'closed_lost'].includes(o.status)).length;

  return (
    <>
      <Helmet><title>Pipeline | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
              <p className="text-gray-500">Track acquisition opportunities</p>
            </div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]">
              <Plus className="w-4 h-4 mr-2" /> New Opportunity
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase">Total Opportunities</p>
                <p className="text-2xl font-bold">{mockOpportunities.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase">Active</p>
                <p className="text-2xl font-bold text-blue-600">{activeCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase">Total Pipeline Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase">Under Contract</p>
                <p className="text-2xl font-bold text-purple-600">{mockOpportunities.filter(o => o.status === 'under_contract').length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search opportunities..." 
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="offer_submitted">Offer Submitted</SelectItem>
                <SelectItem value="under_contract">Under Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Opportunities Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Opportunity</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Asking Price</TableHead>
                  <TableHead className="text-right">Target Offer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.map(opp => (
                  <TableRow 
                    key={opp.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/pipeline/opportunity/${opp.id}/overview/basic-info`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{opp.name}</p>
                          <p className="text-xs text-gray-500">{opp.source}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{opp.propertyType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="text-sm">{opp.address.split(',')[0]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{opp.stage}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(opp.askingPrice)}</TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium">{formatCurrency(opp.targetOffer)}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[opp.status]?.color}>
                        {statusConfig[opp.status]?.label}
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

export default PipelineListPage;
