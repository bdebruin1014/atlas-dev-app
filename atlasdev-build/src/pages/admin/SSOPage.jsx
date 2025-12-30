import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { KeyRound, Shield, Link2 } from 'lucide-react';

const SSOPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Single Sign-On</h1><p className="text-gray-500">Configure SSO for your organization</p></div>

    <div className="grid grid-cols-2 gap-4">
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><KeyRound className="w-5 h-5 text-gray-600" /></div><div><p className="text-sm text-gray-500">SAML SSO</p><p className="text-xl font-bold">Not Configured</p></div></div></CardContent></Card>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Shield className="w-5 h-5 text-gray-600" /></div><div><p className="text-sm text-gray-500">OAuth 2.0</p><p className="text-xl font-bold">Not Configured</p></div></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle>SAML Configuration</CardTitle><CardDescription>Enable SAML-based single sign-on with your identity provider</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Enable SAML SSO</p><p className="text-sm text-gray-500">Allow users to sign in with SAML</p></div>
          <Switch />
        </div>
        <div className="p-4 border rounded-lg space-y-4">
          <div><p className="text-sm font-medium text-gray-700">Identity Provider SSO URL</p><p className="text-sm text-gray-400">Not configured</p></div>
          <div><p className="text-sm font-medium text-gray-700">Identity Provider Certificate</p><p className="text-sm text-gray-400">Not uploaded</p></div>
        </div>
        <Button variant="outline">Configure SAML</Button>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>OAuth 2.0 / OpenID Connect</CardTitle><CardDescription>Enable OAuth-based authentication</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Enable OAuth SSO</p><p className="text-sm text-gray-500">Allow users to sign in with OAuth</p></div>
          <Switch />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Button variant="outline" className="h-16"><img src="https://www.google.com/favicon.ico" className="w-6 h-6 mr-2" />Google</Button>
          <Button variant="outline" className="h-16"><img src="https://www.microsoft.com/favicon.ico" className="w-6 h-6 mr-2" />Microsoft</Button>
          <Button variant="outline" className="h-16"><Link2 className="w-6 h-6 mr-2" />Custom OAuth</Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default SSOPage;
