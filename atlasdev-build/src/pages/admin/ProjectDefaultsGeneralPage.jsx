import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileText, DollarSign, Home, Calendar } from 'lucide-react';

const ProjectDefaultsGeneralPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Project Defaults - General</h1><p className="text-gray-500">Configure default settings for new projects</p></div>

    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Basic Info Defaults</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Default Project Type</Label><Select defaultValue="spec"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="lot">Lot Development</SelectItem><SelectItem value="spec">Spec Building</SelectItem><SelectItem value="flip">Fix & Flip</SelectItem><SelectItem value="btr">Build to Rent</SelectItem></SelectContent></Select></div>
          <div><Label>Default Entity</Label><Select defaultValue="vrh"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="vrh">VanRock Holdings LLC</SelectItem><SelectItem value="new">Create New Entity</SelectItem></SelectContent></Select></div>
          <div><Label>Default Market</Label><Input defaultValue="Denver Metro" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" />Loan Defaults</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Default Loan Type</Label><Select defaultValue="construction"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="construction">Construction Loan</SelectItem><SelectItem value="acquisition">Acquisition Loan</SelectItem><SelectItem value="bridge">Bridge Loan</SelectItem></SelectContent></Select></div>
          <div><Label>Default Interest Rate</Label><Input defaultValue="8.5" type="number" step="0.1" /></div>
          <div><Label>Default LTC %</Label><Input defaultValue="75" type="number" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Home className="w-5 h-5" />Earnest & Commissions</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Default Earnest Money %</Label><Input defaultValue="1" type="number" step="0.5" /></div>
          <div><Label>Default Buyer Agent Commission %</Label><Input defaultValue="2.5" type="number" step="0.1" /></div>
          <div><Label>Default Seller Agent Commission %</Label><Input defaultValue="2.5" type="number" step="0.1" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Taxes & Prorations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Tax Proration Method</Label><Select defaultValue="calendar"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="calendar">Calendar Year</SelectItem><SelectItem value="fiscal">Fiscal Year</SelectItem></SelectContent></Select></div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Include HOA prorations</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Include utility prorations</p></div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default ProjectDefaultsGeneralPage;
