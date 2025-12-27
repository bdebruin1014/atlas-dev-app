import React from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

const mockInvestors = [
  { id: 1, name: 'Johnson Family Trust', type: 'Trust', commitment: 2500000, funded: 2000000, email: 'johnson@email.com' },
  { id: 2, name: 'ABC Capital Partners', type: 'Entity', commitment: 5000000, funded: 4500000, email: 'invest@abccapital.com' },
  { id: 3, name: 'Sarah Williams', type: 'Individual', commitment: 500000, funded: 500000, email: 'sarah@email.com' },
];

const InvestorsPage = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investors</h1>
          <p className="text-gray-500">{mockInvestors.length} investors</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" />Add Investor</Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input type="text" placeholder="Search investors..." className="pl-10" />
        </div>
      </div>

      <Card>
        <div className="divide-y divide-gray-100">
          {mockInvestors.map(investor => (
            <div key={investor.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{investor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{investor.type}</Badge>
                    <span className="text-sm text-gray-500">{investor.email}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(investor.commitment, { compact: true })}</p>
                <p className="text-sm text-gray-500">{formatCurrency(investor.funded, { compact: true })} funded</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InvestorsPage;
