import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, MapPin, Calendar, DollarSign, Users, FileText, Plus, 
  Edit, Trash2, Download, Upload, Eye, CheckCircle, Clock, AlertTriangle,
  Camera, Mail, MessageSquare, Phone, ExternalLink, MoreHorizontal,
  TrendingUp, TrendingDown, Percent, Calculator, FileSpreadsheet, Send
} from 'lucide-react';

// Mock Data
const mockProject = {
  id: 1,
  name: 'Watson House',
  code: 'PRJ-001',
  address: '1234 Watson Street',
  city: 'Denver',
  state: 'CO',
  zip: '80202',
  entity: 'Watson House LLC',
  status: 'construction',
  type: 'Multifamily',
  units: 24,
  sqft: 28500,
  lotSize: 0.75,
  zoning: 'R-3',
  purchasePrice: 850000,
  estimatedValue: 4200000,
  constructionBudget: 2800000,
  startDate: '2024-03-15',
  estimatedCompletion: '2025-06-30',
  description: 'Modern 24-unit multifamily development in downtown Denver area.',
};

const mockBudget = [
  { id: 1, category: 'Land Acquisition', budgeted: 850000, actual: 850000, committed: 0 },
  { id: 2, category: 'Site Work', budgeted: 185000, actual: 142000, committed: 28000 },
  { id: 3, category: 'Foundation', budgeted: 220000, actual: 215000, committed: 0 },
  { id: 4, category: 'Framing', budgeted: 480000, actual: 320000, committed: 145000 },
  { id: 5, category: 'Electrical', budgeted: 195000, actual: 85000, committed: 95000 },
  { id: 6, category: 'Plumbing', budgeted: 175000, actual: 72000, committed: 88000 },
  { id: 7, category: 'HVAC', budgeted: 165000, actual: 45000, committed: 110000 },
  { id: 8, category: 'Finishes', budgeted: 330000, actual: 0, committed: 125000 },
];

const mockTimeline = [
  { id: 1, milestone: 'Land Acquisition', startDate: '2024-01-15', endDate: '2024-03-15', status: 'completed', progress: 100 },
  { id: 2, milestone: 'Permits & Approvals', startDate: '2024-02-01', endDate: '2024-04-30', status: 'completed', progress: 100 },
  { id: 3, milestone: 'Site Work', startDate: '2024-04-01', endDate: '2024-05-15', status: 'completed', progress: 100 },
  { id: 4, milestone: 'Foundation', startDate: '2024-05-01', endDate: '2024-06-30', status: 'completed', progress: 100 },
  { id: 5, milestone: 'Framing', startDate: '2024-06-15', endDate: '2024-09-30', status: 'in_progress', progress: 75 },
  { id: 6, milestone: 'MEP Rough-In', startDate: '2024-08-01', endDate: '2024-11-30', status: 'in_progress', progress: 45 },
  { id: 7, milestone: 'Drywall & Finishes', startDate: '2024-11-01', endDate: '2025-03-31', status: 'not_started', progress: 0 },
  { id: 8, milestone: 'Final Inspections', startDate: '2025-04-01', endDate: '2025-05-31', status: 'not_started', progress: 0 },
];

const mockDraws = [
  { id: 1, drawNumber: 1, date: '2024-04-15', amount: 425000, status: 'funded', description: 'Initial draw - Land & permits' },
  { id: 2, drawNumber: 2, date: '2024-06-01', amount: 285000, status: 'funded', description: 'Site work & foundation start' },
  { id: 3, drawNumber: 3, date: '2024-07-15', amount: 315000, status: 'funded', description: 'Foundation completion' },
  { id: 4, drawNumber: 4, date: '2024-09-01', amount: 380000, status: 'funded', description: 'Framing progress' },
  { id: 5, drawNumber: 5, date: '2024-10-15', amount: 295000, status: 'pending', description: 'MEP rough-in' },
];

const mockPurchaseOrders = [
  { id: 1, poNumber: 'PO-001', vendor: 'ABC Lumber Co', amount: 145000, date: '2024-06-01', status: 'delivered' },
  { id: 2, poNumber: 'PO-002', vendor: 'Metro Electric Supply', amount: 95000, date: '2024-07-15', status: 'partial' },
  { id: 3, poNumber: 'PO-003', vendor: 'Denver Plumbing Wholesale', amount: 88000, date: '2024-08-01', status: 'ordered' },
  { id: 4, poNumber: 'PO-004', vendor: 'HVAC Solutions Inc', amount: 110000, date: '2024-08-15', status: 'ordered' },
];

const mockInvestors = [
  { id: 1, name: 'Bryan V.', entity: 'Olive Brynn LLC', commitment: 500000, funded: 500000, ownership: 25, type: 'GP' },
  { id: 2, name: 'John Smith', entity: 'Smith Family Trust', commitment: 400000, funded: 400000, ownership: 20, type: 'LP' },
  { id: 3, name: 'Sarah Johnson', entity: 'SJ Investments LLC', commitment: 300000, funded: 300000, ownership: 15, type: 'LP' },
];

const mockDocuments = [
  { id: 1, name: 'Purchase Agreement.pdf', category: 'Legal', size: '2.4 MB', date: '2024-01-20', uploadedBy: 'Bryan V.' },
  { id: 2, name: 'Survey Report.pdf', category: 'Due Diligence', size: '5.1 MB', date: '2024-02-15', uploadedBy: 'Title Co' },
  { id: 3, name: 'Construction Plans.pdf', category: 'Construction', size: '18.7 MB', date: '2024-03-01', uploadedBy: 'Architect' },
  { id: 4, name: 'Building Permit.pdf', category: 'Permits', size: '1.2 MB', date: '2024-04-15', uploadedBy: 'Bryan V.' },
];

// Section Components
const BasicInfoSection = ({ project }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Basic Information</h1>
      <Button><Edit className="w-4 h-4 mr-2" />Edit</Button>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">Project Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-gray-500">Project Name</Label><p className="font-medium">{project.name}</p></div>
            <div><Label className="text-gray-500">Project Code</Label><p className="font-medium">{project.code}</p></div>
            <div><Label className="text-gray-500">Entity</Label><p className="font-medium">{project.entity}</p></div>
            <div><Label className="text-gray-500">Project Type</Label><p className="font-medium">{project.type}</p></div>
            <div><Label className="text-gray-500">Status</Label><Badge className="bg-yellow-500 text-black">{project.status}</Badge></div>
            <div><Label className="text-gray-500">Units</Label><p className="font-medium">{project.units}</p></div>
          </div>
          <div><Label className="text-gray-500">Description</Label><p className="text-gray-700">{project.description}</p></div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle className="text-lg">Location</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Label className="text-gray-500">Address</Label><p className="font-medium">{project.address}</p></div>
            <div><Label className="text-gray-500">City</Label><p className="font-medium">{project.city}</p></div>
            <div><Label className="text-gray-500">State</Label><p className="font-medium">{project.state}</p></div>
            <div><Label className="text-gray-500">ZIP</Label><p className="font-medium">{project.zip}</p></div>
            <div><Label className="text-gray-500">Zoning</Label><p className="font-medium">{project.zoning}</p></div>
          </div>
          <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
            <span className="ml-2 text-gray-500">Map View</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle className="text-lg">Financial Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-gray-500">Purchase Price</Label><p className="font-medium text-lg">${project.purchasePrice.toLocaleString()}</p></div>
            <div><Label className="text-gray-500">Construction Budget</Label><p className="font-medium text-lg">${project.constructionBudget.toLocaleString()}</p></div>
            <div><Label className="text-gray-500">Total Investment</Label><p className="font-medium text-lg">${(project.purchasePrice + project.constructionBudget).toLocaleString()}</p></div>
            <div><Label className="text-gray-500">Estimated Value</Label><p className="font-medium text-lg text-emerald-600">${project.estimatedValue.toLocaleString()}</p></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle className="text-lg">Timeline</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-gray-500">Start Date</Label><p className="font-medium">{project.startDate}</p></div>
            <div><Label className="text-gray-500">Est. Completion</Label><p className="font-medium">{project.estimatedCompletion}</p></div>
            <div><Label className="text-gray-500">Lot Size</Label><p className="font-medium">{project.lotSize} acres</p></div>
            <div><Label className="text-gray-500">Building SF</Label><p className="font-medium">{project.sqft.toLocaleString()} SF</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const PropertyDetailsSection = ({ project }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Property Details</h1>
      <Button><Edit className="w-4 h-4 mr-2" />Edit</Button>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Physical Characteristics</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between"><span className="text-gray-500">Lot Size</span><span className="font-medium">{project.lotSize} acres</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Building SF</span><span className="font-medium">{project.sqft.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Units</span><span className="font-medium">{project.units}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Stories</span><span className="font-medium">3</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Parking Spaces</span><span className="font-medium">48</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Zoning & Entitlements</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between"><span className="text-gray-500">Current Zoning</span><span className="font-medium">{project.zoning}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Density Allowed</span><span className="font-medium">35 units/acre</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Height Limit</span><span className="font-medium">45 feet</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Setbacks</span><span className="font-medium">Front: 20', Side: 10'</span></div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ProjectSettingsSection = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <h1 className="text-2xl font-bold text-gray-900">Project Settings</h1>
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Email Notifications</p><p className="text-sm text-gray-500">Receive updates via email</p></div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Budget Alerts</p><p className="text-sm text-gray-500">Alert when budget exceeds threshold</p></div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Access & Permissions</CardTitle></CardHeader>
        <CardContent>
          <p className="text-gray-500">Manage who can view and edit this project.</p>
          <Button className="mt-4">Manage Team Access</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

const BudgetSection = ({ budget }) => {
  const totalBudget = budget.reduce((sum, b) => sum + b.budgeted, 0);
  const totalActual = budget.reduce((sum, b) => sum + b.actual, 0);
  const totalCommitted = budget.reduce((sum, b) => sum + b.committed, 0);
  
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Construction Budget</h1>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button><Plus className="w-4 h-4 mr-2" />Add Line Item</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Budget</p><p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Actual Spent</p><p className="text-2xl font-bold text-blue-600">${totalActual.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Committed</p><p className="text-2xl font-bold text-yellow-600">${totalCommitted.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Remaining</p><p className="text-2xl font-bold text-emerald-600">${(totalBudget - totalActual - totalCommitted).toLocaleString()}</p></CardContent></Card>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Budgeted</TableHead>
              <TableHead className="text-right">Actual</TableHead>
              <TableHead className="text-right">Committed</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead className="text-right">% Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budget.map((item) => {
              const remaining = item.budgeted - item.actual - item.committed;
              const percentUsed = ((item.actual + item.committed) / item.budgeted * 100).toFixed(0);
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell className="text-right">${item.budgeted.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${item.actual.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${item.committed.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${remaining.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Progress value={percentUsed} className="w-16 h-2" />
                      <span className="text-sm">{percentUsed}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const TimelineSection = ({ timeline }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Project Timeline</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Add Milestone</Button>
    </div>
    
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Milestone</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeline.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.milestone}</TableCell>
              <TableCell>{item.startDate}</TableCell>
              <TableCell>{item.endDate}</TableCell>
              <TableCell>
                <Badge className={
                  item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                }>
                  {item.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={item.progress} className="w-24 h-2" />
                  <span className="text-sm">{item.progress}%</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

const DrawsSection = ({ draws }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Draw Requests</h1>
      <Button><Plus className="w-4 h-4 mr-2" />New Draw Request</Button>
    </div>
    
    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Drawn</p><p className="text-2xl font-bold">${draws.filter(d => d.status === 'funded').reduce((s, d) => s + d.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">${draws.filter(d => d.status === 'pending').reduce((s, d) => s + d.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Draw Count</p><p className="text-2xl font-bold">{draws.length}</p></CardContent></Card>
    </div>
    
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Draw #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {draws.map((draw) => (
            <TableRow key={draw.id}>
              <TableCell className="font-medium">Draw {draw.drawNumber}</TableCell>
              <TableCell>{draw.date}</TableCell>
              <TableCell>{draw.description}</TableCell>
              <TableCell className="text-right">${draw.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={draw.status === 'funded' ? 'bg-green-500' : 'bg-yellow-500'}>{draw.status}</Badge>
              </TableCell>
              <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

const PurchaseOrdersSection = ({ purchaseOrders }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Create PO</Button>
    </div>
    
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PO Number</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.map((po) => (
            <TableRow key={po.id}>
              <TableCell className="font-medium">{po.poNumber}</TableCell>
              <TableCell>{po.vendor}</TableCell>
              <TableCell>{po.date}</TableCell>
              <TableCell className="text-right">${po.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={
                  po.status === 'delivered' ? 'bg-green-500' :
                  po.status === 'partial' ? 'bg-blue-500' : 'bg-yellow-500'
                }>{po.status}</Badge>
              </TableCell>
              <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

const InvestorsSection = ({ investors }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Project Investors</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Add Investor</Button>
    </div>
    
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Investor</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Commitment</TableHead>
            <TableHead className="text-right">Funded</TableHead>
            <TableHead className="text-right">Ownership %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investors.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium">{inv.name}</TableCell>
              <TableCell>{inv.entity}</TableCell>
              <TableCell><Badge variant="outline">{inv.type}</Badge></TableCell>
              <TableCell className="text-right">${inv.commitment.toLocaleString()}</TableCell>
              <TableCell className="text-right">${inv.funded.toLocaleString()}</TableCell>
              <TableCell className="text-right">{inv.ownership}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

const DocumentsSection = ({ documents }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
      <Button><Upload className="w-4 h-4 mr-2" />Upload</Button>
    </div>
    
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />{doc.name}
              </TableCell>
              <TableCell><Badge variant="outline">{doc.category}</Badge></TableCell>
              <TableCell>{doc.size}</TableCell>
              <TableCell>{doc.date}</TableCell>
              <TableCell>{doc.uploadedBy}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

const PhotosSection = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Photos</h1>
      <Button><Upload className="w-4 h-4 mr-2" />Upload Photos</Button>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {[1,2,3,4,5,6,7,8].map(i => (
        <Card key={i} className="aspect-square flex items-center justify-center bg-gray-100">
          <Camera className="w-8 h-8 text-gray-400" />
        </Card>
      ))}
    </div>
  </div>
);

const EmailsSection = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Emails</h1>
      <Button><Send className="w-4 h-4 mr-2" />Compose</Button>
    </div>
    <Card><CardContent className="p-8 text-center text-gray-500">
      <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>Email integration coming soon</p>
    </CardContent></Card>
  </div>
);

const NotesSection = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Add Note</Button>
    </div>
    <Card>
      <CardContent className="p-4">
        <Textarea placeholder="Add a note..." className="min-h-[100px]" />
        <Button className="mt-2">Save Note</Button>
      </CardContent>
    </Card>
  </div>
);

// Generic placeholder for sections not yet fully implemented
const PlaceholderSection = ({ title }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <Card>
      <CardContent className="p-8 text-center text-gray-500">
        <p>This section is under development</p>
        <Button className="mt-4">Coming Soon</Button>
      </CardContent>
    </Card>
  </div>
);

// Main Component
const ProjectDetailPage = () => {
  const { projectId, module, section } = useParams();
  const currentModule = module || 'overview';
  const currentSection = section || 'basic-info';

  // Section routing
  const sectionKey = `${currentModule}/${currentSection}`;
  
  const sectionComponents = {
    'overview/basic-info': <BasicInfoSection project={mockProject} />,
    'overview/property-details': <PropertyDetailsSection project={mockProject} />,
    'overview/project-settings': <ProjectSettingsSection />,
    'acquisition/purchase-contract': <PlaceholderSection title="Purchase Contract" />,
    'acquisition/due-diligence': <PlaceholderSection title="Due Diligence" />,
    'acquisition/title-survey': <PlaceholderSection title="Title & Survey" />,
    'acquisition/closing': <PlaceholderSection title="Closing" />,
    'construction/budget': <BudgetSection budget={mockBudget} />,
    'construction/timeline': <TimelineSection timeline={mockTimeline} />,
    'construction/purchase-orders': <PurchaseOrdersSection purchaseOrders={mockPurchaseOrders} />,
    'construction/draws': <DrawsSection draws={mockDraws} />,
    'construction/change-orders': <PlaceholderSection title="Change Orders" />,
    'construction/daily-logs': <PlaceholderSection title="Daily Logs" />,
    'construction/inspections': <PlaceholderSection title="Inspections" />,
    'construction/warranty': <PlaceholderSection title="Warranty" />,
    'disposition/pricing': <PlaceholderSection title="Pricing" />,
    'disposition/listings': <PlaceholderSection title="Listings" />,
    'disposition/offers': <PlaceholderSection title="Offers" />,
    'disposition/sales-contracts': <PlaceholderSection title="Sales Contracts" />,
    'disposition/closings': <PlaceholderSection title="Closings" />,
    'finance/pro-forma': <PlaceholderSection title="Pro Forma" />,
    'finance/loans': <PlaceholderSection title="Loans" />,
    'finance/equity': <PlaceholderSection title="Equity" />,
    'finance/expenses': <PlaceholderSection title="Expenses" />,
    'finance/invoices': <PlaceholderSection title="Invoices" />,
    'investors/investor-list': <InvestorsSection investors={mockInvestors} />,
    'investors/capital-accounts': <PlaceholderSection title="Capital Accounts" />,
    'investors/distributions': <PlaceholderSection title="Distributions" />,
    'investors/k1-documents': <PlaceholderSection title="K-1 Documents" />,
    'documents/documents': <DocumentsSection documents={mockDocuments} />,
    'documents/photos': <PhotosSection />,
    'documents/emails': <EmailsSection />,
    'documents/notes': <NotesSection />,
  };

  return sectionComponents[sectionKey] || <BasicInfoSection project={mockProject} />;
};

export default ProjectDetailPage;
