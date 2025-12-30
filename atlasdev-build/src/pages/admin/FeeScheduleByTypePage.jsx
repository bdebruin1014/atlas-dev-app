import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Edit, ArrowRight } from 'lucide-react';

const projectTypes = [
  { id: 1, name: 'Lot Development', code: 'LOT', fees: 4, lastUpdated: '2024-10-15', color: 'bg-blue-500' },
  { id: 2, name: 'Spec Building', code: 'SPEC', fees: 5, lastUpdated: '2024-10-20', color: 'bg-emerald-500' },
  { id: 3, name: 'Fix & Flip', code: 'FLIP', fees: 3, lastUpdated: '2024-09-28', color: 'bg-yellow-500' },
  { id: 4, name: 'Build to Rent', code: 'BTR', fees: 6, lastUpdated: '2024-10-01', color: 'bg-purple-500' },
];

const FeeScheduleByTypePage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Fee Schedule by Project Type</h1><p className="text-gray-500">Configure fees specific to each project type</p></div>

    <div className="grid grid-cols-2 gap-4">
      {projectTypes.map((type) => (
        <Card key={type.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center`}>
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300" />
            </div>
            <h3 className="font-semibold">{type.name}</h3>
            <p className="text-sm text-gray-500 mb-3">Code: {type.code}</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{type.fees} fees</Badge>
              </div>
              <span className="text-xs text-gray-400">Updated {type.lastUpdated}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle>Fee Override Rules</CardTitle><CardDescription>Rules for when project-specific fees override defaults</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Project type fees override defaults</p><p className="text-sm text-gray-500">When a fee is defined for a project type, it replaces the default</p></div>
          <Badge className="bg-emerald-500">Active</Badge>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Allow per-project overrides</p><p className="text-sm text-gray-500">Users can modify fees on individual projects</p></div>
          <Badge className="bg-emerald-500">Active</Badge>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default FeeScheduleByTypePage;
