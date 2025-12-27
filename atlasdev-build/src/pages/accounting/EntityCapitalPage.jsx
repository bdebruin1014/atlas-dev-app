import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChevronLeft, Users, DollarSign, TrendingUp, TrendingDown, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const mockCapitalData = {
  1: {
    entity: 'VanRock Holdings LLC',
    totalCapital: 4300000,
    members: [
      { id: 1, name: 'Olive Brynn LLC', ownership: 50, initialContribution: 1500000, additionalContributions: 450000, distributions: -200000, earnings: 400000, currentBalance: 2150000 },
      { id: 2, name: 'Smith Family Trust', ownership: 30, initialContribution: 900000, additionalContributions: 270000, distributions: -120000, earnings: 240000, currentBalance: 1290000 },
      { id: 3, name: 'Johnson Investments', ownership: 20, initialContribution: 600000, additionalContributions: 180000, distributions: -80000, earnings: 160000, currentBalance: 860000 },
    ],
    transactions: [
      { id: 1, date: '2024-06-08', member: 'All Members', type: 'Distribution', description: 'Q2 Distribution', amount: -150000 },
      { id: 2, date: '2024-05-15', member: 'Olive Brynn LLC', type: 'Contribution', description: 'Capital call for Oslo project', amount: 250000 },
      { id: 3, date: '2024-05-15', member: 'Smith Family Trust', type: 'Contribution', description: 'Capital call for Oslo project', amount: 150000 },
      { id: 4, date: '2024-05-15', member: 'Johnson Investments', type: 'Contribution', description: 'Capital call for Oslo project', amount: 100000 },
      { id: 5, date: '2024-03-31', member: 'All Members', type: 'Earnings Allocation', description: 'Q1 Profit allocation', amount: 400000 },
    ]
  }
};

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const EntityCapitalPage = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const data = mockCapitalData[entityId] || mockCapitalData[1];

  return (
    <>
      <Helmet><title>Capital Accounts | {data.entity} | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white border-b px-6 py-4">
            <button onClick={() => navigate(`/accounting/entity/${entityId}`)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-3"><ChevronLeft className="w-4 h-4" /> Back to Entity</button>
            <div className="flex items-center justify-between">
              <div><h1 className="text-2xl font-bold text-gray-900">Capital Accounts</h1><p className="text-gray-500">{data.entity}</p></div>
              <div className="flex gap-2">
                <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export K-1s</Button>
                <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Record Transaction</Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-4 gap-4">
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Capital</p><p className="text-2xl font-bold text-green-600">{formatCurrency(data.totalCapital)}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Members</p><p className="text-2xl font-bold">{data.members.length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">YTD Contributions</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(data.members.reduce((a, m) => a + m.additionalContributions, 0))}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">YTD Distributions</p><p className="text-2xl font-bold text-red-600">{formatCurrency(Math.abs(data.members.reduce((a, m) => a + m.distributions, 0)))}</p></CardContent></Card>
            </div>

            <Tabs defaultValue="accounts">
              <TabsList><TabsTrigger value="accounts">Capital Accounts</TabsTrigger><TabsTrigger value="transactions">Transactions</TabsTrigger></TabsList>
              
              <TabsContent value="accounts" className="mt-4">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Member</TableHead>
                        <TableHead className="text-center">Ownership %</TableHead>
                        <TableHead className="text-right">Initial Contribution</TableHead>
                        <TableHead className="text-right">Additional Contributions</TableHead>
                        <TableHead className="text-right">Distributions</TableHead>
                        <TableHead className="text-right">Earnings Allocated</TableHead>
                        <TableHead className="text-right">Current Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.members.map(member => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Progress value={member.ownership} className="h-2 w-20" />
                              <span className="font-medium">{member.ownership}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">{formatCurrency(member.initialContribution)}</TableCell>
                          <TableCell className="text-right font-mono text-blue-600">{formatCurrency(member.additionalContributions)}</TableCell>
                          <TableCell className="text-right font-mono text-red-600">{formatCurrency(member.distributions)}</TableCell>
                          <TableCell className="text-right font-mono text-green-600">{formatCurrency(member.earnings)}</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{formatCurrency(member.currentBalance)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-gray-50 font-semibold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-center">100%</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(data.members.reduce((a, m) => a + m.initialContribution, 0))}</TableCell>
                        <TableCell className="text-right font-mono text-blue-600">{formatCurrency(data.members.reduce((a, m) => a + m.additionalContributions, 0))}</TableCell>
                        <TableCell className="text-right font-mono text-red-600">{formatCurrency(data.members.reduce((a, m) => a + m.distributions, 0))}</TableCell>
                        <TableCell className="text-right font-mono text-green-600">{formatCurrency(data.members.reduce((a, m) => a + m.earnings, 0))}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(data.totalCapital)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="mt-4">
                <Card>
                  <Table>
                    <TableHeader><TableRow className="bg-gray-50"><TableHead>Date</TableHead><TableHead>Member</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {data.transactions.map(tx => (
                        <TableRow key={tx.id}>
                          <TableCell>{formatDate(tx.date)}</TableCell>
                          <TableCell className="font-medium">{tx.member}</TableCell>
                          <TableCell><Badge variant="outline" className={tx.type === 'Distribution' ? 'border-red-300 text-red-700' : tx.type === 'Contribution' ? 'border-blue-300 text-blue-700' : 'border-green-300 text-green-700'}>{tx.type}</Badge></TableCell>
                          <TableCell className="text-gray-600">{tx.description}</TableCell>
                          <TableCell className={`text-right font-mono font-medium ${tx.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>{tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntityCapitalPage;
