import React, { useState } from 'react';
import { Plus, Search, Download, RefreshCw, Landmark, Eye, Edit2, Link, ArrowUpRight, ArrowDownRight, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const BankingPage = ({ selectedEntity, flatEntities }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [bankAccounts, setBankAccounts] = useState([
    { id: 'acct-1', name: 'Operating Account', bank: 'Chase Bank', number: '****4521', entity: 'vanrock', type: 'checking', balance: 2450000, available: 2450000, lastSync: '2024-12-28 10:30 AM', status: 'connected' },
    { id: 'acct-2', name: 'Payroll Account', bank: 'Chase Bank', number: '****7832', entity: 'vanrock', type: 'checking', balance: 125000, available: 125000, lastSync: '2024-12-28 10:30 AM', status: 'connected' },
    { id: 'acct-3', name: 'Construction Account', bank: 'First National', number: '****7891', entity: 'watson', type: 'checking', balance: 1850000, available: 1650000, lastSync: '2024-12-28 09:15 AM', status: 'connected' },
    { id: 'acct-4', name: 'Reserve Account', bank: 'Wells Fargo', number: '****3344', entity: 'sunset', type: 'savings', balance: 425000, available: 425000, lastSync: '2024-12-27 04:00 PM', status: 'needs-attention' },
    { id: 'acct-5', name: 'Operating Account', bank: 'Bank of America', number: '****9012', entity: 'oslo', type: 'checking', balance: 920000, available: 920000, lastSync: '2024-12-28 10:45 AM', status: 'connected' },
    { id: 'acct-6', name: 'Money Market', bank: 'Fidelity', number: '****5678', entity: 'olive-brynn', type: 'savings', balance: 2500000, available: 2500000, lastSync: '2024-12-28 08:00 AM', status: 'connected' },
  ]);

  const recentTransactions = [
    { id: 1, date: '2024-12-28', description: 'Wire Transfer - Rental Income', amount: 145000, type: 'credit', status: 'cleared' },
    { id: 2, date: '2024-12-27', description: 'ACH Payment - Smith Construction', amount: -85000, type: 'debit', status: 'cleared' },
    { id: 3, date: '2024-12-26', description: 'Check #5567 - Property Tax', amount: -45000, type: 'debit', status: 'pending' },
    { id: 4, date: '2024-12-24', description: 'Wire Transfer - Lot Sale', amount: 285000, type: 'credit', status: 'cleared' },
    { id: 5, date: '2024-12-23', description: 'ACH Payment - Ferguson Supply', amount: -48500, type: 'debit', status: 'cleared' },
    { id: 6, date: '2024-12-22', description: 'Internal Transfer', amount: -75000, type: 'debit', status: 'cleared' },
    { id: 7, date: '2024-12-22', description: 'Wire Transfer - Loan Draw', amount: 500000, type: 'credit', status: 'cleared' },
    { id: 8, date: '2024-12-20', description: 'ACH Payment - Insurance', amount: -28500, type: 'debit', status: 'cleared' },
  ];

  const totalBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalAvailable = bankAccounts.reduce((sum, acc) => sum + acc.available, 0);

  const [formData, setFormData] = useState({
    name: '',
    bank: '',
    number: '',
    type: 'checking',
    entity: selectedEntity || '',
  });

  const handleAddAccount = () => {
    const newAccount = {
      id: `acct-${bankAccounts.length + 1}`,
      ...formData,
      balance: 0,
      available: 0,
      lastSync: 'Not connected',
      status: 'pending',
    };
    setBankAccounts(prev => [...prev, newAccount]);
    setShowAddModal(false);
    setFormData({ name: '', bank: '', number: '', type: 'checking', entity: selectedEntity || '' });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Banking</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-1" />Sync All</Button>
          <Button className="bg-[#047857] hover:bg-[#065f46]" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1" />Add Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Accounts</p>
          <p className="text-xl font-semibold">{bankAccounts.length}</p>
        </div>
        <div className="bg-white border rounded-lg p-4 border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-500">Total Balance</p>
          <p className="text-xl font-semibold">${(totalBalance / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-white border rounded-lg p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-xl font-semibold text-green-600">${(totalAvailable / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-white border rounded-lg p-4 border-l-4 border-l-amber-500">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-xl font-semibold text-amber-600">${((totalBalance - totalAvailable) / 1000).toFixed(0)}K</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Accounts List */}
        <div className="col-span-2">
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Bank Accounts</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search accounts..." className="pl-9 w-64" />
              </div>
            </div>
            <div className="divide-y">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  className={cn(
                    "flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedAccount?.id === account.id && "bg-green-50 border-l-4 border-l-[#047857]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", account.type === 'checking' ? "bg-blue-100" : "bg-green-100")}>
                      <Landmark className={cn("w-5 h-5", account.type === 'checking' ? "text-blue-600" : "text-green-600")} />
                    </div>
                    <div>
                      <p className="font-medium">{account.name}</p>
                      <p className="text-xs text-gray-500">{account.bank} • {account.number}</p>
                      <p className="text-xs text-gray-400">{flatEntities?.find(e => e.id === account.entity)?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${account.balance.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {account.status === 'connected' ? (
                        <><CheckCircle className="w-3 h-3 text-green-500" /><span className="text-gray-500">Synced {account.lastSync}</span></>
                      ) : (
                        <><AlertTriangle className="w-3 h-3 text-amber-500" /><span className="text-amber-600">Needs attention</span></>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Details / Recent Activity */}
        <div className="space-y-4">
          {selectedAccount ? (
            <>
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{selectedAccount.name}</h3>
                  <Button variant="outline" size="sm"><Link className="w-4 h-4 mr-1" />Reconnect</Button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Bank</span><span>{selectedAccount.bank}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Account</span><span className="font-mono">{selectedAccount.number}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="capitalize">{selectedAccount.type}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Entity</span><span>{flatEntities?.find(e => e.id === selectedAccount.entity)?.name}</span></div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between"><span className="text-gray-500">Current Balance</span><span className="font-semibold">${selectedAccount.balance.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Available</span><span className="text-green-600">${selectedAccount.available.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Recent Transactions</h3>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", tx.amount > 0 ? "bg-green-100" : "bg-red-100")}>
                          {tx.amount > 0 ? <ArrowDownRight className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-600" />}
                        </div>
                        <div>
                          <p className="text-sm">{tx.description}</p>
                          <p className="text-xs text-gray-500">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("font-medium text-sm", tx.amount > 0 ? "text-green-600" : "text-gray-900")}>
                          {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                        </p>
                        <span className={cn("text-xs px-1.5 py-0.5 rounded", tx.status === 'cleared' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border rounded-lg p-12 text-center">
              <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select an account to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Add Bank Account</h3>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Account Name *</label>
                <Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Operating Account" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Bank Name *</label>
                <Input value={formData.bank} onChange={(e) => setFormData(prev => ({ ...prev, bank: e.target.value }))} placeholder="e.g., Chase Bank" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Account Number (last 4)</label>
                  <Input value={formData.number} onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))} placeholder="****1234" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Account Type</label>
                  <select className="w-full border rounded-md px-3 py-2" value={formData.type} onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}>
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="money-market">Money Market</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Entity *</label>
                <select className="w-full border rounded-md px-3 py-2" value={formData.entity} onChange={(e) => setFormData(prev => ({ ...prev, entity: e.target.value }))}>
                  <option value="">Select entity...</option>
                  {flatEntities?.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                <p className="font-medium mb-1">Connect via Plaid</p>
                <p className="text-xs">After adding, you can connect this account to automatically import transactions.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="bg-[#047857] hover:bg-[#065f46]" onClick={handleAddAccount}>Add Account</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankingPage;
