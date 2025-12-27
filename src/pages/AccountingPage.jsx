import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ChevronRight, Calculator, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

const mockEntities = [
  { id: 1, name: 'VanRock Holdings LLC', type: 'Holding', lastActivity: '2024-12-20', cash: 2300000, pendingBills: 3, unreconciledTxns: 12 },
  { id: 2, name: 'Watson House LLC', type: 'Project', lastActivity: '2024-12-19', cash: 125000, pendingBills: 5, unreconciledTxns: 8 },
  { id: 3, name: 'Oslo Development LLC', type: 'Asset', lastActivity: '2024-12-18', cash: 85000, pendingBills: 1, unreconciledTxns: 3 },
  { id: 4, name: 'Carolina Affordable Housing', type: 'Nonprofit', lastActivity: '2024-12-15', cash: 320000, pendingBills: 2, unreconciledTxns: 5 },
];

const AccountingPage = () => {
  const navigate = useNavigate();

  const totalCash = mockEntities.reduce((sum, e) => sum + e.cash, 0);
  const totalPendingBills = mockEntities.reduce((sum, e) => sum + e.pendingBills, 0);
  const totalUnreconciledTxns = mockEntities.reduce((sum, e) => sum + e.unreconciledTxns, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accounting</h1>
        <p className="text-gray-500">Manage finances across all entities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Cash</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCash, { compact: true })}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Entities</p>
              <p className="text-2xl font-bold text-gray-900">{mockEntities.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Bills</p>
              <p className="text-2xl font-bold text-gray-900">{totalPendingBills}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">To Reconcile</p>
              <p className="text-2xl font-bold text-gray-900">{totalUnreconciledTxns}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entity Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Entity</CardTitle>
        </CardHeader>
        <div className="divide-y divide-gray-100">
          {mockEntities.map(entity => (
            <div
              key={entity.id}
              onClick={() => navigate(`/accounting/entity/${entity.id}`)}
              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{entity.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{entity.type}</Badge>
                    <span className="text-xs text-gray-500">Last activity: {entity.lastActivity}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Cash</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(entity.cash, { compact: true })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="font-semibold text-yellow-600">{entity.pendingBills} bills</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AccountingPage;
