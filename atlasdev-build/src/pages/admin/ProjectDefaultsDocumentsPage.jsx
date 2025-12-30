import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Package, Mail, Truck } from 'lucide-react';

const ProjectDefaultsDocumentsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Project Defaults - Documents & Shipping</h1><p className="text-gray-500">Configure default document and shipping settings</p></div>

    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Default Documents</CardTitle><CardDescription>Documents automatically included in new projects</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span>Purchase Contract Template</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span>Due Diligence Checklist</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span>Closing Checklist</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span>Investor Summary Template</span>
            <Switch />
          </div>
          <Button variant="outline" className="w-full">Manage Document Templates</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Document Packages</CardTitle><CardDescription>Default document packages for project types</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between items-center mb-2"><p className="font-medium">Lot Development Package</p><Badge>8 docs</Badge></div>
            <p className="text-sm text-gray-500">Survey, plat, environmental, zoning...</p>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between items-center mb-2"><p className="font-medium">Spec Build Package</p><Badge>12 docs</Badge></div>
            <p className="text-sm text-gray-500">Plans, permits, inspections, warranties...</p>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between items-center mb-2"><p className="font-medium">Closing Package</p><Badge>15 docs</Badge></div>
            <p className="text-sm text-gray-500">HUD, deed, title, disclosures...</p>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader><CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5" />Shipping Defaults</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-2">Default Shipping Method</p>
              <Select defaultValue="fedex">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="usps">USPS</SelectItem>
                  <SelectItem value="courier">Local Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="font-medium mb-2">Default Service Level</p>
              <Select defaultValue="overnight">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="overnight">Overnight</SelectItem>
                  <SelectItem value="2day">2-Day</SelectItem>
                  <SelectItem value="ground">Ground</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default ProjectDefaultsDocumentsPage;
