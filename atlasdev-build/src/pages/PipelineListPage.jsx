import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Target, MapPin, DollarSign, Calendar, Grid, List, Kanban } from 'lucide-react';

const mockOpportunities = [
  { id: 1, name: 'Riverside Commons', code: 'OPP-001', status: 'analysis', type: 'Multifamily', city: 'Aurora', state: 'CO', askingPrice: 2500000, source: 'Broker - CBRE', dateAdded: '2024-10-15' },
  { id: 2, name: 'Maple Street Lots', code: 'OPP-002', status: 'due_diligence', type: 'Land', city: 'Boulder', state: 'CO', askingPrice: 850000, source: 'Direct', dateAdded: '2024-10-20' },
  { id: 3, name: 'Downtown Mixed Use', code: 'OPP-003', status: 'offer', type: 'Mixed Use', city: 'Denver', state: 'CO', askingPrice: 4200000, source: 'Broker - Marcus & Millichap', dateAdded: '2024-10-25' },
  { id: 4, name: 'Cherry Creek Townhomes', code: 'OPP-004', status: 'lead', type: 'Townhomes', city: 'Denver', state: 'CO', askingPrice: 3100000, source: 'LoopNet', dateAdded: '2024-11-01' },
  { id: 5, name: 'Stapleton Parcel', code: 'OPP-005', status: 'dead', type: 'Land', city: 'Denver', state: 'CO', askingPrice: 1500000, source: 'Auction', dateAdded: '2024-09-15' },
];

const PipelineListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('kanban');

  const filteredOpportunities = mockOpportunities.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    lead: 'bg-gray-500 text-white',
    analysis: 'bg-blue-500 text-white',
    offer: 'bg-purple-500 text-white',
    due_diligence: 'bg-yellow-500 text-black',
    under_contract: 'bg-green-500 text-white',
    closed: 'bg-emerald-600 text-white',
    dead: 'bg-red-500 text-white',
  };

  const pipelineStages = ['lead', 'analysis', 'offer', 'due_diligence', 'under_contract'];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
        <Button><Plus className="w-4 h-4 mr-2" />New Opportunity</Button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{mockOpportunities.filter(o => o.status !== 'dead').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">In Analysis</p><p className="text-2xl font-bold text-blue-600">{mockOpportunities.filter(o => o.status === 'analysis').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Under Offer</p><p className="text-2xl font-bold text-purple-600">{mockOpportunities.filter(o => o.status === 'offer').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Due Diligence</p><p className="text-2xl font-bold text-yellow-600">{mockOpportunities.filter(o => o.status === 'due_diligence').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Pipeline Value</p><p className="text-2xl font-bold">${(mockOpportunities.filter(o => o.status !== 'dead').reduce((s, o) => s + o.askingPrice, 0) / 1000000).toFixed(1)}M</p></CardContent></Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search opportunities..." 
              className="pl-9 w-64" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="due_diligence">Due Diligence</SelectItem>
              <SelectItem value="under_contract">Under Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === 'kanban' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('kanban')}><Kanban className="w-4 h-4" /></Button>
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}><Grid className="w-4 h-4" /></Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineStages.map((stage) => (
            <div key={stage} className="flex-shrink-0 w-72">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium capitalize">{stage.replace('_', ' ')}</h3>
                  <Badge variant="outline">{filteredOpportunities.filter(o => o.status === stage).length}</Badge>
                </div>
                <div className="space-y-3">
                  {filteredOpportunities.filter(o => o.status === stage).map((opp) => (
                    <Card 
                      key={opp.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/pipeline/${opp.id}/overview/basic-info`)}
                    >
                      <CardContent className="p-3">
                        <p className="font-medium">{opp.name}</p>
                        <p className="text-xs text-gray-500">{opp.code}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-gray-500">{opp.city}</span>
                          <span className="text-sm font-medium">${(opp.askingPrice / 1000000).toFixed(2)}M</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <Card 
              key={opp.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/pipeline/${opp.id}/overview/basic-info`)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{opp.name}</CardTitle>
                      <p className="text-xs text-gray-500">{opp.code}</p>
                    </div>
                  </div>
                  <Badge className={statusColors[opp.status]}>{opp.status.replace('_', ' ')}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{opp.city}, {opp.state}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <DollarSign className="w-4 h-4" />
                    <span>${(opp.askingPrice / 1000000).toFixed(2)}M asking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-xs">{opp.source}</span>
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
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Opportunity</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Asking Price</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Source</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpportunities.map((opp) => (
                  <tr 
                    key={opp.id} 
                    className="border-t cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/pipeline/${opp.id}/overview/basic-info`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{opp.name}</p>
                          <p className="text-xs text-gray-500">{opp.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{opp.city}, {opp.state}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{opp.type}</Badge></td>
                    <td className="px-4 py-3 text-right font-medium">${(opp.askingPrice / 1000000).toFixed(2)}M</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{opp.source}</td>
                    <td className="px-4 py-3"><Badge className={statusColors[opp.status]}>{opp.status.replace('_', ' ')}</Badge></td>
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

export default PipelineListPage;
