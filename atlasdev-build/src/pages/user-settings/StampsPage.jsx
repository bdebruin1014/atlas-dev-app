import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Stamp, Trash2, Upload } from 'lucide-react';

const StampsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Document Stamps</h1><p className="text-gray-500">Upload private custom stamps to apply to documents</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Add Stamp</Button>
    </div>

    <Card>
      <CardHeader><CardTitle>Your Stamps</CardTitle><CardDescription>Private stamps only visible to you</CardDescription></CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Stamp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No custom stamps uploaded</p>
          <p className="text-sm">Upload stamps like initials, approval marks, or custom logos</p>
          <Button className="mt-4"><Upload className="w-4 h-4 mr-2" />Upload Stamp</Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Stamp Guidelines</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-2 text-gray-600">
          <li>• Supported formats: PNG, JPEG, SVG</li>
          <li>• Maximum file size: 2MB</li>
          <li>• Transparent background recommended for best results</li>
          <li>• Stamps can be applied to PDF documents</li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default StampsPage;
