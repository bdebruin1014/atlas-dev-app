import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Receipt, CreditCard, FileText, ArrowLeftRight, Ban } from 'lucide-react';

const AccountingPreferencesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Accounting Preferences</h1><p className="text-gray-500">Configure accounting and financial settings</p></div>

    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Payee Labels</CardTitle><CardDescription>Configure default payee label options</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">Vendor</Button>
          <Button variant="outline" className="w-full justify-start">Contractor</Button>
          <Button variant="outline" className="w-full justify-start">Subcontractor</Button>
          <Button variant="outline" className="w-full justify-start">Supplier</Button>
          <Button variant="ghost" size="sm">+ Add Label</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sequence Numbers</CardTitle><CardDescription>Configure automatic numbering</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Bill Numbers</p><p className="text-sm text-gray-500">Next: BILL-1045</p></div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Invoice Numbers</p><p className="text-sm text-gray-500">Next: INV-2024-089</p></div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Journal Entry Numbers</p><p className="text-sm text-gray-500">Next: JE-1234</p></div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Automatic Clearing</CardTitle><CardDescription>Configure auto-clearing rules</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Auto-clear matched transactions</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Clear on bank sync</p></div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Receipts & Disbursements</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Require receipt attachment</p></div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Aggregate small disbursements</p><p className="text-sm text-gray-500">Combine transactions under $100</p></div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Voiding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Require void reason</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Void approval required</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Order Transfers</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Allow inter-entity transfers</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Auto-create balancing entries</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AccountingPreferencesPage;
