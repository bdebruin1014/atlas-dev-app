import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenTool, Upload, Trash2 } from 'lucide-react';

const SignaturePage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Document Signature</h1><p className="text-gray-500">Upload your signature for use on documents</p></div>

    <Card>
      <CardHeader><CardTitle>Your Signature</CardTitle><CardDescription>This signature will be used on documents based on admin configurations</CardDescription></CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4">
          <div className="w-full h-32 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">No signature uploaded</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button><Upload className="w-4 h-4 mr-2" />Upload Signature</Button>
          <Button variant="outline"><PenTool className="w-4 h-4 mr-2" />Draw Signature</Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Signature Guidelines</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-2 text-gray-600">
          <li>• Use a clear, high-resolution image (PNG preferred)</li>
          <li>• Signature should be on a white or transparent background</li>
          <li>• Recommended size: 400x200 pixels minimum</li>
          <li>• Your signature will be automatically scaled to fit documents</li>
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default SignaturePage;
