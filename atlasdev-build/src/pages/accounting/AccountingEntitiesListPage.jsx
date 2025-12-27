import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Plus, Search, Building, ChevronRight, CreditCard, DollarSign,
  TrendingUp, TrendingDown, PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Family Office Entity Structure
const mockEntities = [
  { id: 1, name: 'VanRock Holdings LLC', code: 'VRH', type: 'Holding Company', parent: null, ownership: null, taxId: '12-3456789', assets: 12500000, liabilities: 8200000, equity: 4300000, bankAccounts: 3, status: 'active', members: [{ name: 'Olive Brynn LLC', ownership: 50 }, { name: 'Other Partners', ownership: 50 }] },
  { id: 2, name: 'Watson House LLC', code: 'WHL', type: 'Project Entity', parent: 'VanRock Holdings LLC', ownership: 100, taxId: '12-3456790', assets: 18000000, liabilities: 14000000, equity: 4000000, bankAccounts: 2, status: 'active', members: [{ name: 'VanRock Holdings LLC', ownership: 100 }] },
  { id: 3, name: 'Oslo Townhomes LLC', code: 'OTL', type: 'Project Entity', parent: 'VanRock Holdings LLC', ownership: 100, taxId: '12-3456791', assets: 4500000, liabilities: 3200000, equity: 1300000, bankAccounts: 1, status: 'active', members: [{ name: 'VanRock Holdings LLC', ownership: 100 }] },
  { id: 4, name: 'Olive Brynn LLC', code: 'OBL', type: 'Personal Holding', parent: null, ownership: null, taxId: '12-3456792', assets: 8500000, liabilities: 1200000, equity: 7300000, bankAccounts: 2, status: 'active', members: [{ name: 'Bryan Van Orsdol', ownership: 100 }] },
  { id: 5, name: 'VanRock Construction LLC', code: 'VRC', type: 'Operating Entity', parent: 'VanRock Holdings LLC', ownership: 100, taxId: '12-3456793', assets: 1250000, liabilities: 450000, equity: 800000, bankAccounts: 2, status: 'active', members: [{ name: 'VanRock Holdings LLC', ownership: 100 }] },
  { id: 6, name: 'Pine Valley LLC', code: 'PVL', type: 'Project Entity', parent: 'VanRock Holdings LLC', ownership: 100, taxId: '12-3456794', assets: 2800000, liabilities: 2100000, equity: 700000, bankAccounts: 1, status: 'active', members: [{ name: 'VanRock Holdings LLC', ownership: 100 }] },
];

const typeConfig = {
  'Holding Company': { color: 'bg-purple-100 text-purple-800' },
  'Project Entity': { color: 'bg-blue-100 text-blue-800' },
  'Operating Entity': { color: 'bg-green-100 text-green-800' },
  'Personal Holding': { color: 'bg-orange-100 text-orange-800' },
};

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const AccountingEntitiesListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredEntities = mockEntities.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || e.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalAssets = mockEntities.reduce((a, e) => a + e.assets, 0);
  const totalLiabilities = mockEntities.reduce((a, e) => a + e.liabilities, 0);
  const totalEquity = mockEntities.reduce((a, e) => a + e.equity, 0);

  return (
    <>
      <Helmet><title>Entities | Accounting | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Entities</h1><p className="text-gray-500">Manage your legal entities and their financials</p></div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Entity</Button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Entities</p><p className="text-2xl font-bold">{mockEntities.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Assets</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAssets)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Liabilities</p><p className="text-2xl font-bold text-red-600">{formatCurrency(totalLiabilities)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Equity</p><p className="text-2xl font-bold text-green-600">{formatCurrency(totalEquity)}</p></CardContent></Card>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search entities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-48"><SelectValue placeholder="All Types" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Holding Company">Holding Company</SelectItem><SelectItem value="Project Entity">Project Entity</SelectItem><SelectItem value="Operating Entity">Operating Entity</SelectItem><SelectItem value="Personal Holding">Personal Holding</SelectItem></SelectContent></Select>
          </div>
          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead>Entity</TableHead><TableHead>Type</TableHead><TableHead>Parent</TableHead><TableHead className="text-right">Assets</TableHead><TableHead className="text-right">Liabilities</TableHead><TableHead className="text-right">Equity</TableHead><TableHead className="text-center">Bank Accounts</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredEntities.map(entity => (
                  <TableRow key={entity.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/accounting/entity/${entity.id}`)}>
                    <TableCell><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Building className="w-5 h-5 text-gray-600" /></div><div><p className="font-semibold text-gray-900">{entity.name}</p><p className="text-xs text-gray-500">{entity.code}</p></div></div></TableCell>
                    <TableCell><Badge className={typeConfig[entity.type]?.color}>{entity.type}</Badge></TableCell>
                    <TableCell className="text-gray-600">{entity.parent || '-'}</TableCell>
                    <TableCell className="text-right font-medium text-blue-600">{formatCurrency(entity.assets)}</TableCell>
                    <TableCell className="text-right font-medium text-red-600">{formatCurrency(entity.liabilities)}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">{formatCurrency(entity.equity)}</TableCell>
                    <TableCell className="text-center"><div className="flex items-center justify-center gap-1"><CreditCard className="w-4 h-4 text-gray-400" /><span>{entity.bankAccounts}</span></div></TableCell>
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

export default AccountingEntitiesListPage;
