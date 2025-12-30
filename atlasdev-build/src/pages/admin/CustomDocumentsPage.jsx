import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileText, Search, Edit, Copy, Download } from 'lucide-react';

const documents = [
  { id: 1, name: 'Purchase Agreement', category: 'Legal', type: 'DOCX', smartTags: 12, lastUpdated: '2024-10-15' },
  { id: 2, name: 'Draw Request Form', category: 'Construction', type: 'PDF', smartTags: 8, lastUpdated: '2024-09-20' },
  { id: 3, name: 'Investor Commitment Letter', category: 'Investors', type: 'DOCX', smartTags: 15, lastUpdated: '2024-08-10' },
  { id: 4, name: 'Change Order Form', category: 'Construction', type: 'PDF', smartTags: 6, lastUpdated: '2024-10-01' },
  { id: 5, name: 'Distribution Notice', category: 'Investors', type: 'DOCX', smartTags: 10, lastUpdated: '2024-09-15' },
  { id: 6, name: 'Project Summary Report', category: 'Reports', type: 'DOCX', smartTags: 20, lastUpdated: '2024-10-20' },
];

const CustomDocumentsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Custom Documents</h1><p className="text-gray-500">Create custom documents with smart tags</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Create Document</Button>
    </div>

    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Custom Documents</p><p className="text-2xl font-bold">{documents.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Categories</p><p className="text-2xl font-bold">5</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Smart Tags Available</p><p className="text-2xl font-bold">85+</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Prepackaged</p><p className="text-2xl font-bold text-gray-400">50+</p></CardContent></Card>
    </div>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Documents</CardTitle>
        <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search documents..." className="pl-9" /></div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Document Name</TableHead><TableHead>Category</TableHead><TableHead>Type</TableHead><TableHead className="text-center">Smart Tags</TableHead><TableHead>Last Updated</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" />{doc.name}</div></TableCell>
                <TableCell><Badge variant="outline">{doc.category}</Badge></TableCell>
                <TableCell><Badge variant="secondary">{doc.type}</Badge></TableCell>
                <TableCell className="text-center">{doc.smartTags}</TableCell>
                <TableCell className="text-gray-500">{doc.lastUpdated}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default CustomDocumentsPage;
