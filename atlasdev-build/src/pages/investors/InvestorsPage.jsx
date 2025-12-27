import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Search, Users, Building, DollarSign, ChevronRight, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockInvestors = [
  { id: 1, name: 'Olive Brynn LLC', type: 'Entity', contact: 'Bryan Van Orsdol', email: 'bryan@olivebrynn.com', phone: '(555) 123-4567', entities: ['VanRock Holdings LLC'], totalCommitment: 3000000, totalContributed: 2150000, totalDistributions: 320000, status: 'active' },
  { id: 2, name: 'Smith Family Trust', type: 'Trust', contact: 'Robert Smith', email: 'robert@smithtrust.com', phone: '(555) 234-5678', entities: ['VanRock Holdings LLC'], totalCommitment: 1800000, totalContributed: 1290000, totalDistributions: 192000, status: 'active' },
  { id: 3, name: 'Johnson Investments', type: 'Entity', contact: 'Michael Johnson', email: 'michael@johnsoninv.com', phone: '(555) 345-6789', entities: ['VanRock Holdings LLC'], totalCommitment: 1200000, totalContributed: 860000, totalDistributions: 128000, status: 'active' },
  { id: 4, name: 'Williams Capital', type: 'Entity', contact: 'Sarah Williams', email: 'sarah@williamscap.com', phone: '(555) 456-7890', entities: ['Watson House LLC'], totalCommitment: 500000, totalContributed: 500000, totalDistributions: 0, status: 'active' },
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const InvestorsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredInvestors = mockInvestors.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || i.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalCommitment = mockInvestors.reduce((a, i) => a + i.totalCommitment, 0);
  const totalContributed = mockInvestors.reduce((a, i) => a + i.totalContributed, 0);
  const totalDistributions = mockInvestors.reduce((a, i) => a + i.totalDistributions, 0);

  return (
    <>
      <Helmet><title>Investors | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Investors</h1><p className="text-gray-500">Manage investors across all entities</p></div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Investor</Button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Investors</p><p className="text-2xl font-bold">{mockInvestors.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Commitments</p><p className="text-2xl font-bold">{formatCurrency(totalCommitment)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Contributed</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(totalContributed)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Distributions</p><p className="text-2xl font-bold text-green-600">{formatCurrency(totalDistributions)}</p></CardContent></Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search investors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-40"><SelectValue placeholder="All Types" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Entity">Entity</SelectItem><SelectItem value="Trust">Trust</SelectItem><SelectItem value="Individual">Individual</SelectItem></SelectContent></Select>
          </div>

          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead>Investor</TableHead><TableHead>Type</TableHead><TableHead>Contact</TableHead><TableHead>Entities</TableHead><TableHead className="text-right">Commitment</TableHead><TableHead className="text-right">Contributed</TableHead><TableHead className="text-right">Distributions</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredInvestors.map(investor => (
                  <TableRow key={investor.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div><div><p className="font-medium">{investor.name}</p><p className="text-xs text-gray-500">{investor.email}</p></div></div></TableCell>
                    <TableCell><Badge variant="outline">{investor.type}</Badge></TableCell>
                    <TableCell><div><p className="font-medium">{investor.contact}</p><p className="text-xs text-gray-500">{investor.phone}</p></div></TableCell>
                    <TableCell>{investor.entities.map((e, i) => <Badge key={i} variant="outline" className="mr-1">{e}</Badge>)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(investor.totalCommitment)}</TableCell>
                    <TableCell className="text-right font-mono text-blue-600">{formatCurrency(investor.totalContributed)}</TableCell>
                    <TableCell className="text-right font-mono text-green-600">{formatCurrency(investor.totalDistributions)}</TableCell>
                    <TableCell><ChevronRight className="w-4 h-4 text-gray-400" /></TableCell>
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

export default InvestorsPage;
