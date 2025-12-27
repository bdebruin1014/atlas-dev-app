import React from 'react';
import { Target, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const OpportunitiesPage = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-gray-500">Track potential deals and acquisitions</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Opportunity
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input type="text" placeholder="Search opportunities..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities yet</h3>
          <p className="text-gray-500 mb-4">Start tracking potential deals and acquisitions</p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Opportunity
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpportunitiesPage;
