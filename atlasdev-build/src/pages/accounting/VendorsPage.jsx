import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Search, Users, Phone, Mail, MapPin, ChevronRight, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockVendors = [
  { id: 1, name: 'BuildRight Construction', type: 'General Contractor', contact: 'Sarah Johnson', phone: '(555) 234-5678', email: 'sarah@buildright.com', address: '123 Builder Lane, Greenville, SC', taxId: '45-6789012', balance: 450000, status: 'active' },
  { id: 2, name: 'ABC Lumber Supply', type: 'Materials Supplier', contact: 'Mike Davis', phone: '(555) 345-6789', email: 'mike@abclumber.com', address: '456 Industrial Blvd, Spartanburg, SC', taxId: '56-7890123', balance: 28500, status: 'active' },
  { id: 3, name: 'Elite HVAC Systems', type: 'Subcontractor', contact: 'Tom Wilson', phone: '(555) 456-7890', email: 'tom@elitehvac.com', address: '789 Climate Way, Anderson, SC', taxId: '67-8901234', balance: 45000, status: 'active' },
  { id: 4, name: 'City Electric', type: 'Subcontractor', contact: 'Lisa Chen', phone: '(555) 567-8901', email: 'lisa@cityelectric.com', address: '321 Power St, Greenville, SC', taxId: '78-9012345', balance: 32000, status: 'active' },
  { id: 5, name: 'Modern Design Studio', type: 'Professional Services', contact: 'Mike Williams', phone: '(555) 678-9012', email: 'mike@moderndesign.com', address: '555 Creative Ave, Charlotte, NC', taxId: '89-0123456', balance: 12500, status: 'active' },
  { id: 6, name: 'First National Bank', type: 'Financial Services', contact: 'Lisa Brown', phone: '(555) 789-0123', email: 'lisa@fnb.com', address: '100 Banking Center, Greenville, SC', taxId: '90-1234567', balance: 0, status: 'active' },
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const VendorsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const types = [...new Set(mockVendors.map(v => v.type))];
  const filteredVendors = mockVendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || v.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalBalance = mockVendors.reduce((a, v) => a + v.balance, 0);

  return (
    <>
      <Helmet><title>Vendors | Accounting | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Vendors</h1><p className="text-gray-500">Manage vendors and suppliers</p></div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Vendor</Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Vendors</p><p className="text-2xl font-bold">{mockVendors.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Active</p><p className="text-2xl font-bold text-green-600">{mockVendors.filter(v => v.status === 'active').length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Payable</p><p className="text-2xl font-bold text-red-600">{formatCurrency(totalBalance)}</p></CardContent></Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search vendors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-48"><SelectValue placeholder="All Types" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem>{types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          </div>

          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead>Vendor</TableHead><TableHead>Type</TableHead><TableHead>Contact</TableHead><TableHead>Phone</TableHead><TableHead>Email</TableHead><TableHead className="text-right">Balance Due</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredVendors.map(vendor => (
                  <TableRow key={vendor.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><Building className="w-5 h-5 text-gray-500" /></div><div><p className="font-medium">{vendor.name}</p><p className="text-xs text-gray-500">{vendor.address.split(',')[0]}</p></div></div></TableCell>
                    <TableCell><Badge variant="outline">{vendor.type}</Badge></TableCell>
                    <TableCell>{vendor.contact}</TableCell>
                    <TableCell className="text-gray-600">{vendor.phone}</TableCell>
                    <TableCell className="text-gray-600">{vendor.email}</TableCell>
                    <TableCell className="text-right font-medium text-red-600">{formatCurrency(vendor.balance)}</TableCell>
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

export default VendorsPage;
