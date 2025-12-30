import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, QrCode, Mail } from 'lucide-react';

const QRPackagesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">QR Packages</h1><p className="text-gray-500">Automatically send documents by emailing scanned QR codes</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Create QR Package</Button>
    </div>

    <Card>
      <CardHeader><CardTitle>How QR Packages Work</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><QrCode className="w-8 h-8 text-blue-600" /></div>
            <p className="font-medium">1. Create QR Code</p>
            <p className="text-sm text-gray-500">Generate a unique QR code for a document package</p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3"><Mail className="w-8 h-8 text-emerald-600" /></div>
            <p className="font-medium">2. Scan & Email</p>
            <p className="text-sm text-gray-500">User scans QR and emails the result</p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3"><Badge className="w-8 h-8 text-purple-600">✓</Badge></div>
            <p className="font-medium">3. Auto-Process</p>
            <p className="text-sm text-gray-500">Documents automatically filed to project</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>QR Packages</CardTitle></CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <QrCode className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No QR packages configured</p>
          <p className="text-sm">Create a package to get started</p>
          <Button className="mt-4"><Plus className="w-4 h-4 mr-2" />Create QR Package</Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default QRPackagesPage;
