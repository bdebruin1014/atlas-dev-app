import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, TrendingUp, Users, DollarSign } from 'lucide-react';

const campaigns = [
  { id: 1, project: 'Riverside Commons', target: 2000000, raised: 1400000, investors: 4, status: 'active', deadline: '2024-12-15' },
  { id: 2, project: 'Mountain View Lots', target: 800000, raised: 800000, investors: 3, status: 'completed', deadline: '2024-10-01' },
  { id: 3, project: 'Downtown Mixed Use', target: 3500000, raised: 875000, investors: 2, status: 'active', deadline: '2025-02-01' },
];

const CapitalRaisingPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Capital Raising</h1>
      <Button><Plus className="w-4 h-4 mr-2" />New Campaign</Button>
    </div>
    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Target</p><p className="text-2xl font-bold">${(campaigns.reduce((s, c) => s + c.target, 0) / 1000000).toFixed(1)}M</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Raised</p><p className="text-2xl font-bold text-emerald-600">${(campaigns.reduce((s, c) => s + c.raised, 0) / 1000000).toFixed(2)}M</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Active Campaigns</p><p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Remaining</p><p className="text-2xl font-bold text-yellow-600">${((campaigns.reduce((s, c) => s + c.target, 0) - campaigns.reduce((s, c) => s + c.raised, 0)) / 1000000).toFixed(2)}M</p></CardContent></Card>
    </div>
    <div className="grid grid-cols-1 gap-4">
      {campaigns.map((c) => (
        <Card key={c.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{c.project}</CardTitle>
            <Badge className={c.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}>{c.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div><p className="text-sm text-gray-500">Target</p><p className="font-bold">${(c.target / 1000000).toFixed(1)}M</p></div>
              <div><p className="text-sm text-gray-500">Raised</p><p className="font-bold text-emerald-600">${(c.raised / 1000000).toFixed(2)}M</p></div>
              <div><p className="text-sm text-gray-500">Investors</p><p className="font-bold">{c.investors}</p></div>
              <div><p className="text-sm text-gray-500">Deadline</p><p className="font-bold">{c.deadline}</p></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span>Progress</span><span>{Math.round(c.raised / c.target * 100)}%</span></div>
              <Progress value={c.raised / c.target * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default CapitalRaisingPage;
