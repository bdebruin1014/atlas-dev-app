import React from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const ContactsPage = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-500">Manage your contacts and relationships</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" />Add Contact</Button>
      </div>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input type="text" placeholder="Search contacts..." className="pl-10" />
        </div>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts yet</h3>
          <p className="text-gray-500 mb-4">Add your first contact to get started</p>
          <Button><Plus className="w-4 h-4 mr-2" />Add Contact</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsPage;
