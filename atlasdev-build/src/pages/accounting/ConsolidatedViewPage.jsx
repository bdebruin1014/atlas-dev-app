import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { PieChart, Building, Users, DollarSign, TrendingUp, TrendingDown, ChevronRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Family Office Ownership Structure
// Bryan Van Orsdol → Olive Brynn LLC (100%) → VanRock Holdings LLC (50%) → Project Entities
const ownershipStructure = {
  beneficialOwner: { name: 'Bryan Van Orsdol', totalNetWorth: 7300000 },
  holdingCompanies: [
    { 
      id: 4, name: 'Olive Brynn LLC', ownership: 100, equity: 7300000,
      investments: [
        { entity: 'VanRock Holdings LLC', ownership: 50, value: 2150000, type: 'Operating Entity' },
        { entity: 'Cash & Investments', ownership: 100, value: 4300000, type: 'Liquid Assets' },
        { entity: 'Other Holdings', ownership: 100, value: 850000, type: 'Other' },
      ]
    }
  ]
};

const consolidatedBalanceSheet = {
  assets: [
    { category: 'Cash & Equivalents', amount: 5415000 },
    { category: 'Real Estate - Development', amount: 22500000 },
    { category: 'Real Estate - Held', amount: 4200000 },
    { category: 'Equipment & Vehicles', amount: 800000 },
    { category: 'Other Assets', amount: 635000 },
  ],
  liabilities: [
    { category: 'Construction Loans', amount: 14000000 },
    { category: 'Notes Payable', amount: 2650000 },
    { category: 'Accounts Payable', amount: 850000 },
    { category: 'Other Liabilities', amount: 750000 },
  ],
};

const entityPerformance = [
  { id: 1, name: 'VanRock Holdings LLC', type: 'Holding', revenue: 450000, expenses: 280000, netIncome: 170000, ytdReturn: 8.2 },
  { id: 2, name: 'Watson House LLC', type: 'Project', revenue: 0, expenses: 12500000, netIncome: -12500000, ytdReturn: 0, note: 'Under Construction' },
  { id: 3, name: 'Oslo Townhomes LLC', type: 'Project', revenue: 0, expenses: 250000, netIncome: -250000, ytdReturn: 0, note: 'Pre-Development' },
  { id: 5, name: 'VanRock Construction LLC', type: 'Operating', revenue: 2800000, expenses: 2450000, netIncome: 350000, ytdReturn: 12.5 },
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const ConsolidatedViewPage = () => {
  const navigate = useNavigate();

  const totalAssets = consolidatedBalanceSheet.assets.reduce((a, b) => a + b.amount, 0);
  const totalLiabilities = consolidatedBalanceSheet.liabilities.reduce((a, b) => a + b.amount, 0);
  const totalEquity = totalAssets - totalLiabilities;

  return (
    <>
      <Helmet><title>Consolidated View | Family Office | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Family Office Consolidated View</h1><p className="text-gray-500">Complete financial picture across all entities</p></div>
            <Button variant="outline"><Layers className="w-4 h-4 mr-2" /> Ownership Chart</Button>
          </div>

          {/* Net Worth Summary */}
          <Card className="mb-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Beneficial Owner: {ownershipStructure.beneficialOwner.name}</p>
                  <p className="text-4xl font-bold mt-2">{formatCurrency(totalEquity)}</p>
                  <p className="text-emerald-100 mt-1">Total Net Worth (Consolidated Equity)</p>
                </div>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center"><p className="text-emerald-100 text-sm">Total Assets</p><p className="text-2xl font-bold">{formatCurrency(totalAssets)}</p></div>
                  <div className="text-center"><p className="text-emerald-100 text-sm">Total Liabilities</p><p className="text-2xl font-bold">{formatCurrency(totalLiabilities)}</p></div>
                  <div className="text-center"><p className="text-emerald-100 text-sm">Entities</p><p className="text-2xl font-bold">{entityPerformance.length + 1}</p></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="balance-sheet">
            <TabsList><TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger><TabsTrigger value="performance">Entity Performance</TabsTrigger><TabsTrigger value="ownership">Ownership Structure</TabsTrigger></TabsList>

            <TabsContent value="balance-sheet" className="mt-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Assets */}
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-600" /> Assets</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {consolidatedBalanceSheet.assets.map((item, idx) => (
                          <TableRow key={idx}><TableCell>{item.category}</TableCell><TableCell className="text-right font-mono text-blue-600">{formatCurrency(item.amount)}</TableCell></TableRow>
                        ))}
                        <TableRow className="bg-blue-50 font-semibold"><TableCell>Total Assets</TableCell><TableCell className="text-right font-mono">{formatCurrency(totalAssets)}</TableCell></TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Liabilities & Equity */}
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-600" /> Liabilities & Equity</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        {consolidatedBalanceSheet.liabilities.map((item, idx) => (
                          <TableRow key={idx}><TableCell>{item.category}</TableCell><TableCell className="text-right font-mono text-red-600">{formatCurrency(item.amount)}</TableCell></TableRow>
                        ))}
                        <TableRow className="bg-red-50 font-semibold"><TableCell>Total Liabilities</TableCell><TableCell className="text-right font-mono">{formatCurrency(totalLiabilities)}</TableCell></TableRow>
                        <TableRow className="bg-green-50 font-semibold"><TableCell>Total Equity</TableCell><TableCell className="text-right font-mono text-green-600">{formatCurrency(totalEquity)}</TableCell></TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-4">
              <Card>
                <Table>
                  <TableHeader><TableRow className="bg-gray-50"><TableHead>Entity</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Revenue</TableHead><TableHead className="text-right">Expenses</TableHead><TableHead className="text-right">Net Income</TableHead><TableHead className="text-right">YTD Return</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {entityPerformance.map(entity => (
                      <TableRow key={entity.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/accounting/entity/${entity.id}`)}>
                        <TableCell><div><p className="font-medium">{entity.name}</p>{entity.note && <p className="text-xs text-gray-500">{entity.note}</p>}</div></TableCell>
                        <TableCell><Badge variant="outline">{entity.type}</Badge></TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(entity.revenue)}</TableCell>
                        <TableCell className="text-right font-mono text-red-600">{formatCurrency(entity.expenses)}</TableCell>
                        <TableCell className={`text-right font-mono font-medium ${entity.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(entity.netIncome)}</TableCell>
                        <TableCell className="text-right">{entity.ytdReturn > 0 ? <span className="text-green-600">+{entity.ytdReturn}%</span> : entity.ytdReturn < 0 ? <span className="text-red-600">{entity.ytdReturn}%</span> : <span className="text-gray-400">N/A</span>}</TableCell>
                        <TableCell><ChevronRight className="w-4 h-4 text-gray-400" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="ownership" className="mt-4">
              <div className="space-y-4">
                {/* Beneficial Owner */}
                <Card className="border-2 border-emerald-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-emerald-600" /></div>
                      <div><p className="font-semibold text-lg">{ownershipStructure.beneficialOwner.name}</p><p className="text-sm text-gray-500">Beneficial Owner</p></div>
                      <div className="ml-auto text-right"><p className="text-2xl font-bold text-green-600">{formatCurrency(ownershipStructure.beneficialOwner.totalNetWorth)}</p><p className="text-sm text-gray-500">Total Net Worth</p></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Holding Companies */}
                {ownershipStructure.holdingCompanies.map(holding => (
                  <Card key={holding.id} className="ml-8">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Building className="w-5 h-5 text-blue-600" /></div>
                        <div><p className="font-semibold">{holding.name}</p><p className="text-sm text-gray-500">{holding.ownership}% Owned</p></div>
                        <div className="ml-auto text-right"><p className="text-xl font-bold">{formatCurrency(holding.equity)}</p></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 ml-8">
                        {holding.investments.map((inv, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-sm">{inv.entity}</p>
                            <p className="text-xs text-gray-500">{inv.type} • {inv.ownership}%</p>
                            <p className="font-semibold mt-1">{formatCurrency(inv.value)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ConsolidatedViewPage;
