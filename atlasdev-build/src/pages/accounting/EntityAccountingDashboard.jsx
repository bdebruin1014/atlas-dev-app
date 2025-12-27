import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  ChevronLeft, Building, CreditCard, BookOpen, Receipt, DollarSign,
  TrendingUp, TrendingDown, PieChart, Users, BarChart3, FileText,
  Plus, ChevronRight, ArrowUpRight, ArrowDownRight, Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const mockEntities = {
  1: { id: 1, name: 'VanRock Holdings LLC', code: 'VRH', type: 'Holding Company', taxId: '12-3456789', assets: 12500000, liabilities: 8200000, equity: 4300000, 
    members: [{ id: 1, name: 'Olive Brynn LLC', ownership: 50, capitalAccount: 2150000 }, { id: 2, name: 'Smith Family Trust', ownership: 30, capitalAccount: 1290000 }, { id: 3, name: 'Johnson Investments', ownership: 20, capitalAccount: 860000 }],
    bankAccounts: [{ id: 1, name: 'Operating Account', bank: 'First National Bank', balance: 1250000 }, { id: 2, name: 'Reserve Account', bank: 'First National Bank', balance: 500000 }, { id: 3, name: 'Payroll Account', bank: 'First National Bank', balance: 85000 }],
    subsidiaries: [{ id: 2, name: 'Watson House LLC', ownership: 100, equity: 4000000 }, { id: 3, name: 'Oslo Townhomes LLC', ownership: 100, equity: 1300000 }, { id: 5, name: 'VanRock Construction LLC', ownership: 100, equity: 800000 }],
  },
  2: { id: 2, name: 'Watson House LLC', code: 'WHL', type: 'Project Entity', taxId: '12-3456790', assets: 18000000, liabilities: 14000000, equity: 4000000,
    members: [{ id: 1, name: 'VanRock Holdings LLC', ownership: 100, capitalAccount: 4000000 }],
    bankAccounts: [{ id: 1, name: 'Operating Account', bank: 'First National Bank', balance: 450000 }, { id: 2, name: 'Escrow Account', bank: 'Secure Title Co', balance: 125000 }],
    subsidiaries: [],
  },
  4: { id: 4, name: 'Olive Brynn LLC', code: 'OBL', type: 'Personal Holding', taxId: '12-3456792', assets: 8500000, liabilities: 1200000, equity: 7300000,
    members: [{ id: 1, name: 'Bryan Van Orsdol', ownership: 100, capitalAccount: 7300000 }],
    bankAccounts: [{ id: 1, name: 'Main Account', bank: 'Private Bank', balance: 2500000 }, { id: 2, name: 'Investment Account', bank: 'Private Bank', balance: 1800000 }],
    investments: [{ entity: 'VanRock Holdings LLC', ownership: 50, value: 2150000 }],
  },
};

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const recentTransactions = [
  { id: 1, date: '2024-06-15', description: 'Draw payment - Watson House', type: 'expense', amount: -450000, category: 'Construction' },
  { id: 2, date: '2024-06-12', description: 'Management fee distribution', type: 'income', amount: 25000, category: 'Fee Income' },
  { id: 3, date: '2024-06-10', description: 'Insurance premium', type: 'expense', amount: -12500, category: 'Insurance' },
  { id: 4, date: '2024-06-08', description: 'Investor distribution - Q2', type: 'distribution', amount: -150000, category: 'Distributions' },
  { id: 5, date: '2024-06-05', description: 'Capital call - Oslo project', type: 'capital', amount: 500000, category: 'Capital' },
];

const EntityAccountingDashboard = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const entity = mockEntities[entityId] || mockEntities[1];

  return (
    <>
      <Helmet><title>{entity.name} | Accounting | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4">
            <button onClick={() => navigate('/accounting/entities')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-3">
              <ChevronLeft className="w-4 h-4" /> Back to Entities
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"><Building className="w-6 h-6 text-gray-600" /></div>
                <div><h1 className="text-2xl font-bold text-gray-900">{entity.name}</h1><p className="text-gray-500">{entity.type} • {entity.code} • EIN: {entity.taxId}</p></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> Reports</Button>
                <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Transaction</Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Financial Summary */}
            <div className="grid grid-cols-4 gap-4">
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Assets</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(entity.assets)}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Liabilities</p><p className="text-2xl font-bold text-red-600">{formatCurrency(entity.liabilities)}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Equity</p><p className="text-2xl font-bold text-green-600">{formatCurrency(entity.equity)}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Cash Balance</p><p className="text-2xl font-bold">{formatCurrency(entity.bankAccounts.reduce((a, b) => a + b.balance, 0))}</p></CardContent></Card>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Bank Accounts */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">Bank Accounts</CardTitle>
                  <Button variant="ghost" size="sm" className="text-emerald-600"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {entity.bankAccounts.map(account => (
                      <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/accounting/entity/${entityId}/bank/${account.id}/register`)}>
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <div><p className="font-medium text-sm">{account.name}</p><p className="text-xs text-gray-500">{account.bank}</p></div>
                        </div>
                        <div className="text-right"><p className="font-semibold">{formatCurrency(account.balance)}</p><ChevronRight className="w-4 h-4 text-gray-400 inline" /></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Members / Capital Accounts */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">Members & Capital</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/accounting/entity/${entityId}/capital`)} className="text-emerald-600">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {entity.members.map(member => (
                      <div key={member.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{member.name}</p>
                          <Badge variant="outline">{member.ownership}%</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Capital Account</span>
                          <span className="font-semibold text-green-600">{formatCurrency(member.capitalAccount)}</span>
                        </div>
                        <Progress value={member.ownership} className="h-1 mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subsidiaries / Investments */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">{entity.subsidiaries?.length > 0 ? 'Subsidiaries' : 'Investments'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {entity.subsidiaries?.length > 0 ? (
                    <div className="space-y-3">
                      {entity.subsidiaries.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => navigate(`/accounting/entity/${sub.id}`)}>
                          <div><p className="font-medium text-sm">{sub.name}</p><p className="text-xs text-gray-500">{sub.ownership}% owned</p></div>
                          <div className="text-right"><p className="font-semibold text-green-600">{formatCurrency(sub.equity)}</p></div>
                        </div>
                      ))}
                    </div>
                  ) : entity.investments?.length > 0 ? (
                    <div className="space-y-3">
                      {entity.investments.map((inv, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div><p className="font-medium text-sm">{inv.entity}</p><p className="text-xs text-gray-500">{inv.ownership}% ownership</p></div>
                          <p className="font-semibold text-blue-600">{formatCurrency(inv.value)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No subsidiaries or investments</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm" className="text-emerald-600">View All</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50"><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Category</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell>{formatDate(tx.date)}</TableCell>
                        <TableCell className="font-medium">{tx.description}</TableCell>
                        <TableCell><Badge variant="outline">{tx.category}</Badge></TableCell>
                        <TableCell className="capitalize">{tx.type}</TableCell>
                        <TableCell className={cn("text-right font-medium", tx.amount >= 0 ? "text-green-600" : "text-red-600")}>
                          {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/accounting/entity/${entityId}/chart-of-accounts`)}>
                <CardContent className="pt-4 flex items-center gap-3"><BookOpen className="w-8 h-8 text-blue-600" /><div><p className="font-semibold">Chart of Accounts</p><p className="text-sm text-gray-500">View & manage accounts</p></div></CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => navigate('/accounting/bills')}>
                <CardContent className="pt-4 flex items-center gap-3"><Receipt className="w-8 h-8 text-orange-600" /><div><p className="font-semibold">Bills & Payables</p><p className="text-sm text-gray-500">Manage AP</p></div></CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => navigate('/accounting/journal-entries')}>
                <CardContent className="pt-4 flex items-center gap-3"><FileText className="w-8 h-8 text-purple-600" /><div><p className="font-semibold">Journal Entries</p><p className="text-sm text-gray-500">Manual entries</p></div></CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => navigate('/accounting/reports')}>
                <CardContent className="pt-4 flex items-center gap-3"><BarChart3 className="w-8 h-8 text-green-600" /><div><p className="font-semibold">Reports</p><p className="text-sm text-gray-500">Financial statements</p></div></CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntityAccountingDashboard;
