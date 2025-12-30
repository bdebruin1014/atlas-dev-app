import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Mail, RefreshCw, CheckCircle, Plus, Bold, Italic, Underline, Link2, Image } from 'lucide-react';

const EmailSettingsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Email Settings</h1><p className="text-gray-500">Configure your email sync and templates</p></div>

    <Card>
      <CardHeader><CardTitle>Sync Email</CardTitle><CardDescription>Connect your email account to send messages through AtlasDev</CardDescription></CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <div>
              <p className="font-medium">Email Synced</p>
              <p className="text-sm text-gray-500">bryan@vanrock.com</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-1" />Resync</Button>
            <Button variant="ghost" size="sm" className="text-red-500">Turn Off</Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Email Settings</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Copy Outgoing Emails</p>
            <p className="text-sm text-gray-500">Receive a blind carbon copy of emails sent through AtlasDev</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Email Signature</CardTitle><CardDescription>Customize your email signature</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg">
          <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
            <Button variant="ghost" size="sm"><Bold className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm"><Italic className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm"><Underline className="w-4 h-4" /></Button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <Button variant="ghost" size="sm"><Link2 className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm"><Image className="w-4 h-4" /></Button>
          </div>
          <Textarea 
            className="border-0 min-h-[150px] focus:ring-0" 
            defaultValue={`Bryan V.
Managing Partner
VanRock Holdings LLC
(303) 555-1234
bryan@vanrock.com`}
          />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Include "Sent from AtlasDev"</p></div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Email Templates</CardTitle>
          <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" />Create Template</Button>
        </div>
        <CardDescription>Create custom email templates for quick messaging</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No email templates created</p>
          <p className="text-sm">Create templates for frequently sent messages</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default EmailSettingsPage;
