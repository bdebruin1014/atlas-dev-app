import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, Play, CheckCircle, Clock, ExternalLink } from 'lucide-react';

const courses = [
  { id: 1, name: 'Getting Started with AtlasDev', description: 'Basic usage and navigation', status: 'completed', progress: 100 },
  { id: 2, name: 'Project Management', description: 'Managing projects from start to finish', status: 'in-progress', progress: 65 },
  { id: 3, name: 'Financial Management', description: 'Accounting and financial tracking', status: 'available', progress: 0 },
  { id: 4, name: 'Investor Relations', description: 'Managing investor communications and distributions', status: 'available', progress: 0 },
  { id: 5, name: 'Construction Management', description: 'Draw requests and construction oversight', status: 'available', progress: 0 },
  { id: 6, name: 'Document Management', description: 'Creating and managing documents', status: 'available', progress: 0 },
  { id: 7, name: 'Advanced Reporting', description: 'Creating custom reports and analytics', status: 'available', progress: 0 },
];

const TrainingPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Training</h1><p className="text-gray-500">Access training courses and learning materials</p></div>
      <Button variant="outline"><ExternalLink className="w-4 h-4 mr-2" />Open Training Portal</Button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><CheckCircle className="w-8 h-8 text-emerald-500" /><div><p className="text-sm text-gray-500">Completed</p><p className="text-2xl font-bold">1</p></div></div></CardContent></Card>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><Clock className="w-8 h-8 text-yellow-500" /><div><p className="text-sm text-gray-500">In Progress</p><p className="text-2xl font-bold">1</p></div></div></CardContent></Card>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><GraduationCap className="w-8 h-8 text-blue-500" /><div><p className="text-sm text-gray-500">Available</p><p className="text-2xl font-bold">{courses.filter(c => c.status === 'available').length}</p></div></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle>Your Training Courses</CardTitle><CardDescription>Courses available at training.atlasdev.com</CardDescription></CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.description}</p>
                </div>
                {course.status === 'completed' && <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>}
                {course.status === 'in-progress' && <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>}
                {course.status === 'available' && <Badge variant="outline">Available</Badge>}
              </div>
              {course.status !== 'available' && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
              )}
              <div className="mt-3">
                <Button variant={course.status === 'available' ? 'default' : 'outline'} size="sm">
                  <Play className="w-4 h-4 mr-1" />
                  {course.status === 'completed' ? 'Review' : course.status === 'in-progress' ? 'Continue' : 'Start'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default TrainingPage;
