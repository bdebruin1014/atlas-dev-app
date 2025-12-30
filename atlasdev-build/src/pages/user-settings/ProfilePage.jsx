import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Camera, Mail, Phone, Briefcase, MapPin, Shield, Plus } from 'lucide-react';

const ProfilePage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Your Profile</h1><p className="text-gray-500">Manage your personal information and settings</p></div>

    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div><Label>First Name</Label><Input defaultValue="Bryan" /></div>
              <div><Label>Middle Name</Label><Input placeholder="Optional" /></div>
              <div><Label>Last Name</Label><Input defaultValue="V." /></div>
              <div><Label>Suffix</Label><Input placeholder="Jr., Sr., etc." /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Phone</Label><Input defaultValue="(303) 555-1234" /></div>
              <div><Label>Fax</Label><Input placeholder="Optional" /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Professional Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Job Title</Label><Input defaultValue="Managing Partner" /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>State License IDs</CardTitle>
              <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" />Add License</Button>
            </div>
            <CardDescription>Add license IDs for each state you operate in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Colorado</p>
                  <p className="text-sm text-gray-500">License #: CO-RE-12345</p>
                </div>
                <Badge className="bg-emerald-500">Default</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Texas</p>
                  <p className="text-sm text-gray-500">License #: TX-RE-67890</p>
                </div>
                <Button variant="ghost" size="sm">Set Default</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Login Email</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">bryan@vanrock.com</p>
                <p className="text-sm text-gray-500">This email is used to sign in to AtlasDev</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Profile Image</CardTitle></CardHeader>
          <CardContent className="text-center">
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <User className="w-16 h-16 text-emerald-600" />
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <Button variant="outline" className="w-full mb-2">Upload Image</Button>
            <Button variant="ghost" className="w-full text-red-500">Remove Image</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Your Permissions</CardTitle></CardHeader>
          <CardContent>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <p className="font-medium">Full Access</p>
              </div>
              <p className="text-sm text-gray-500">You have full administrative access to all features</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <div className="flex justify-end">
      <Button>Save Changes</Button>
    </div>
  </div>
);

export default ProfilePage;
