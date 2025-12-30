import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, User, Mail, Phone, Eye } from 'lucide-react';

const investors = [
  { id: 1, name: 'John Smith', entity: 'Smith Family Trust', email: 'john@smithtrust.com', phone: '(303) 555-1234', totalInvested: 850000, activeDeals: 3, type: 'LP' },
  { id: 2, name: 'Sarah Johnson', entity: 'SJ Investments LLC', email: 'sarah@sjinvest.com', phone: '(303) 555-5678', totalInvested: 625000, activeDeals: 2, type: 'LP' },
  { id: 3, name: 'Michael Chen', entity: 'Chen Capital Partners', email: 'mike@chencap.com', phone: '(720) 555-9012', totalInvested: 1200000, activeDeals: 4, type: 'LP' },
  { id: 4, name: 'Emily Davis', entity: 'Davis Holdings LLC', email: 'emily@davishold.com', phone: '(303) 555-3456', totalInvested: 400000, activeDeals: 1, type: 'LP' },
];

const InvestorContactsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Investor Contacts</h1>
        <Button><Plus className="w-4 h-4 mr-2" />Add Investor</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Investors</p><p className="text-2xl font-bold">{investors.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Invested</p><p className="text-2xl font-bold">${(investors.reduce((s, i) => s + i.totalInvested, 0) / 1000000).toFixed(2)}M</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Active Deals</p><p className="text-2xl font-bold">{investors.reduce((s, i) => s + i.activeDeals, 0)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Avg Investment</p><p className="text-2xl font-bold">${Math.round(investors.reduce((s, i) => s + i.totalInvested, 0) / investors.length / 1000)}K</p></CardContent></Card>
      </div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search investors..." className="pl-9" /></div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Investor</TableHead><TableHead>Entity</TableHead><TableHead>Contact</TableHead><TableHead className="text-right">Total Invested</TableHead><TableHead className="text-center">Active Deals</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {investors.map((inv) => (
              <TableRow key={inv.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-emerald-600" /></div>{inv.name}</div></TableCell>
                <TableCell>{inv.entity}</TableCell>
                <TableCell><div className="text-sm"><div className="flex items-center gap-1"><Mail className="w-3 h-3" />{inv.email}</div><div className="flex items-center gap-1 text-gray-500"><Phone className="w-3 h-3" />{inv.phone}</div></div></TableCell>
                <TableCell className="text-right font-medium">${inv.totalInvested.toLocaleString()}</TableCell>
                <TableCell className="text-center"><Badge variant="outline">{inv.activeDeals}</Badge></TableCell>
                <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default InvestorContactsPage;
