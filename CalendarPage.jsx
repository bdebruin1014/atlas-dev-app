import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const CalendarPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-500">View and manage your schedule</p>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar Coming Soon</h3>
          <p className="text-gray-500">Track deadlines, meetings, and important dates</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
