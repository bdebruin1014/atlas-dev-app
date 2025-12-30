import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Building2, ArrowRight } from 'lucide-react';

const entities = [
  { id: 1, name: 'VanRock Holdings LLC', code: 'VRH', type: 'Holding Company', status: 'active', balance: 1250000, accounts: 5, ytdRevenue: 450000 },
  { id: 2, name: 'Watson House LLC', code: 'WH', type: 'Project Entity', status: 'active', balance: 485000, accounts: 3, ytdRevenue: 0 },
  { id: 3, name: 'Oslo Townhomes LLC', code: 'OT', type: 'Project Entity', status: 'active', balance: 325000, accounts: 3, ytdRevenue: 0 },
  { id: 4, name: 'Olive Brynn LLC', code: 'OB', type: 'Personal Holding', status: 'active', balance: 890000, accounts: 4, ytdRevenue: 125000 },
  { id: 5, name: 'Riverside Commons LLC', code: 'RC', type: 'Project Entity', status: 'pending', balance: 50000, accounts: 2, ytdRevenue: 0 },
];

const AccountingEntitiesListPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Accounting - Entities</h1>
        <Button><Plus className="w-4 h-4 mr-2" />Add Entity</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Entities</p><p className="text-2xl font-bold">{entities.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Combined Balance</p><p className="text-2xl font-bold">${(entities.reduce((s, e) => s + e.balance, 0) / 1000000).toFixed(2)}M</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">YTD Revenue</p><p className="text-2xl font-bold text-emerald-600">${(entities.reduce((s, e) => s + e.ytdRevenue, 0) / 1000).toFixed(0)}K</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Bank Accounts</p><p className="text-2xl font-bold">{entities.reduce((s, e) => s + e.accounts, 0)}</p></CardContent></Card>
      </div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search entities..." className="pl-9" /></div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Entity</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Balance</TableHead><TableHead className="text-right">YTD Revenue</TableHead><TableHead className="text-center">Accounts</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {entities.map((e) => (
              <TableRow key={e.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/accounting/entities/${e.id}`)}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4 text-emerald-600" /></div><div><p>{e.name}</p><p className="text-xs text-gray-500">{e.code}</p></div></div></TableCell>
                <TableCell><Badge variant="outline">{e.type}</Badge></TableCell>
                <TableCell className="text-right font-medium">${e.balance.toLocaleString()}</TableCell>
                <TableCell className="text-right">${e.ytdRevenue.toLocaleString()}</TableCell>
                <TableCell className="text-center">{e.accounts}</TableCell>
                <TableCell><Badge className={e.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>{e.status}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm"><ArrowRight className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AccountingEntitiesListPage;
