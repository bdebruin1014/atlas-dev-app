import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Edit, Plus, User, Phone, Mail, FileText, CheckCircle2, Clock, 
  Upload, Download, TrendingUp, Calculator, Users, Search, Filter,
  Building2, MapPin, Calendar, DollarSign, Eye, Trash2, AlertTriangle,
  ArrowRight, Check, X, RefreshCw, ExternalLink, Scale, Landmark,
  ClipboardList, Home, Shield, PieChart, BarChart3, 
  Wallet, FolderOpen, MessageSquare, Send, ChevronRight, Paperclip,
  Package, ClipboardCheck, Handshake, FileSignature, Key, Video,
  PhoneCall, MoreHorizontal, Reply, Forward, Star, Archive,
  Inbox, SendHorizontal, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Utility functions
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};

// Mock project data
const mockProjectsData = {
  1: {
    id: 1, name: 'Watson House', code: 'PRJ-001', type: 'Multifamily', status: 'construction',
    entity: 'Watson House LLC', address: '123 Main Street', city: 'Greenville', state: 'SC', zip: '29601',
    county: 'Greenville', parcelId: '0123-45-67-890', acreage: 2.5, zoning: 'R-4', units: 48, sqft: 52000,
    budget: 18000000, spent: 12500000, committed: 3200000, startDate: '2024-01-15', targetCompletion: '2025-06-30',
    description: 'A 48-unit luxury multifamily development featuring modern amenities.',
    projectType: 'multifamily', jurisdiction: 'Greenville County',
    convertedFrom: { name: 'Highland Park Mixed-Use', id: 'OPP-001', date: '2023-12-01' },
    originalAskingPrice: 4500000, purchasePrice: 4200000, closingDate: '2024-01-15',
    acquisitionStages: [
      { stage: 'Lead Identified', date: '2023-08-15', status: 'complete' },
      { stage: 'Initial Analysis', date: '2023-08-22', status: 'complete' },
      { stage: 'Site Visit', date: '2023-09-01', status: 'complete' },
      { stage: 'LOI Submitted', date: '2023-09-15', status: 'complete' },
      { stage: 'LOI Accepted', date: '2023-09-25', status: 'complete' },
      { stage: 'Due Diligence', date: '2023-10-01', status: 'complete' },
      { stage: 'PSA Executed', date: '2023-11-15', status: 'complete' },
      { stage: 'Closed', date: '2023-12-01', status: 'complete' },
    ],
    loans: [{ id: 1, name: 'Construction Loan', lender: 'First National Bank', amount: 14000000, drawn: 10500000, rate: 7.25, term: 24, maturityDate: '2026-01-15', status: 'active' }],
  },
  2: {
    id: 2, name: 'Oslo Townhomes', code: 'PRJ-002', type: 'Townhomes', status: 'pre_development',
    entity: 'Oslo Townhomes LLC', address: '456 Oslo Drive', city: 'Spartanburg', state: 'SC', zip: '29302',
    county: 'Spartanburg', parcelId: '9876-54-32-100', acreage: 3.2, zoning: 'R-3', units: 12, sqft: 24000,
    budget: 4500000, spent: 250000, committed: 150000, startDate: '2024-06-01', targetCompletion: '2025-12-31',
    description: '12-unit townhome community with private garages.',
    projectType: 'townhomes', jurisdiction: 'Spartanburg County',
    loans: [{ id: 1, name: 'Acquisition Loan', lender: 'Regional Bank', amount: 3200000, drawn: 3200000, rate: 7.5, term: 18, maturityDate: '2025-12-01', status: 'active' }],
  },
};

// ============================================================================
// OVERVIEW SECTIONS
// ============================================================================
const BasicInfoSection = ({ project }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Project Information</CardTitle>
        <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div><Label className="text-xs uppercase text-gray-500">Project Name</Label><p className="font-medium">{project.name}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Project Code</Label><p className="font-medium">{project.code}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Entity</Label><p className="font-medium">{project.entity}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Project Type</Label><p className="font-medium">{project.type}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Status</Label><Badge className="bg-yellow-100 text-yellow-800 capitalize">{project.status?.replace('_', ' ')}</Badge></div>
          <div><Label className="text-xs uppercase text-gray-500">Start Date</Label><p className="font-medium">{formatDate(project.startDate)}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Target Completion</Label><p className="font-medium">{formatDate(project.targetCompletion)}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Total Budget</Label><p className="font-medium">{formatCurrency(project.budget)}</p></div>
          <div className="col-span-2"><Label className="text-xs uppercase text-gray-500">Description</Label><p className="text-gray-700">{project.description}</p></div>
        </div>
      </CardContent>
    </Card>
    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Budget</p><p className="text-2xl font-bold">{formatCurrency(project.budget)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Spent</p><p className="text-2xl font-bold text-red-600">{formatCurrency(project.spent)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Committed</p><p className="text-2xl font-bold text-yellow-600">{formatCurrency(project.committed)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Remaining</p><p className="text-2xl font-bold text-green-600">{formatCurrency(project.budget - project.spent - project.committed)}</p></CardContent></Card>
    </div>
  </div>
);

const PropertyProfileSection = ({ project }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Property Details</CardTitle>
        <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-x-8 gap-y-4">
          <div><Label className="text-xs uppercase text-gray-500">Address</Label><p className="font-medium">{project.address}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">City</Label><p className="font-medium">{project.city}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">State / ZIP</Label><p className="font-medium">{project.state} {project.zip}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">County</Label><p className="font-medium">{project.county}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Parcel ID</Label><p className="font-medium">{project.parcelId}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Acreage</Label><p className="font-medium">{project.acreage} acres</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Zoning</Label><p className="font-medium">{project.zoning}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Units</Label><p className="font-medium">{project.units}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Square Footage</Label><p className="font-medium">{project.sqft?.toLocaleString()} SF</p></div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-base font-semibold">Location</CardTitle></CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500"><MapPin className="w-8 h-8 mx-auto mb-2" /><p>Map Integration</p><p className="text-sm">{project.address}, {project.city}, {project.state}</p></div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ContactsSection = ({ project }) => {
  const contacts = [
    { id: 1, name: 'John Smith', role: 'Project Manager', company: 'VanRock Holdings', phone: '(555) 123-4567', email: 'john@vanrock.com', primary: true },
    { id: 2, name: 'Sarah Johnson', role: 'General Contractor', company: 'BuildRight Construction', phone: '(555) 234-5678', email: 'sarah@buildright.com' },
    { id: 3, name: 'Mike Williams', role: 'Architect', company: 'Modern Design Studio', phone: '(555) 345-6789', email: 'mike@moderndesign.com' },
    { id: 4, name: 'Lisa Brown', role: 'Lender Rep', company: 'First National Bank', phone: '(555) 456-7890', email: 'lisa@fnb.com' },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Project Contacts</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Contact</Button></div>
      <div className="grid grid-cols-2 gap-4">
        {contacts.map(c => (
          <Card key={c.id} className={cn(c.primary && "border-emerald-500 border-2")}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-gray-500" /></div><div><p className="font-semibold">{c.name}</p><p className="text-sm text-gray-500">{c.role}</p></div></div>
                {c.primary && <Badge className="bg-emerald-100 text-emerald-800">Primary</Badge>}
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-gray-600">{c.company}</p>
                <p className="flex items-center gap-2"><Phone className="w-3 h-3 text-gray-400" />{c.phone}</p>
                <p className="flex items-center gap-2"><Mail className="w-3 h-3 text-gray-400" />{c.email}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TasksSection = ({ project }) => {
  const tasks = [
    { id: 1, title: 'Submit permit application', status: 'complete', priority: 'high', dueDate: '2024-01-15', assignee: 'John Smith' },
    { id: 2, title: 'Review contractor bids', status: 'complete', priority: 'high', dueDate: '2024-01-20', assignee: 'Sarah Johnson' },
    { id: 3, title: 'Finalize floor plans', status: 'in_progress', priority: 'medium', dueDate: '2024-02-01', assignee: 'Mike Williams' },
    { id: 4, title: 'Order materials for Phase 1', status: 'in_progress', priority: 'high', dueDate: '2024-02-05', assignee: 'Sarah Johnson' },
    { id: 5, title: 'Schedule foundation inspection', status: 'pending', priority: 'medium', dueDate: '2024-02-15', assignee: 'John Smith' },
  ];
  const statusColors = { complete: 'bg-green-100 text-green-800', in_progress: 'bg-blue-100 text-blue-800', pending: 'bg-gray-100 text-gray-800' };
  const priorityColors = { high: 'text-red-600', medium: 'text-yellow-600', low: 'text-gray-600' };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Tasks</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Task</Button></div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead className="w-8"></TableHead><TableHead>Task</TableHead><TableHead>Assignee</TableHead><TableHead>Due Date</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {tasks.map(t => (<TableRow key={t.id}><TableCell><Checkbox checked={t.status === 'complete'} /></TableCell><TableCell className={cn(t.status === 'complete' && 'line-through text-gray-400')}>{t.title}</TableCell><TableCell>{t.assignee}</TableCell><TableCell>{formatDate(t.dueDate)}</TableCell><TableCell><span className={cn('font-medium capitalize', priorityColors[t.priority])}>{t.priority}</span></TableCell><TableCell><Badge className={statusColors[t.status]}>{t.status.replace('_', ' ')}</Badge></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

// ============================================================================
// ACQUISITION SECTIONS
// ============================================================================
const DealAnalysisSection = ({ project }) => {
  const purchasePrice = project.purchasePrice || 4200000;
  const closingCosts = purchasePrice * 0.02;
  const totalAcquisition = purchasePrice + closingCosts;
  const constructionBudget = project.budget - totalAcquisition;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><Calculator className="w-5 h-5" /> Deal Analysis</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Original Asking Price</span><span className="font-medium text-gray-400 line-through">{formatCurrency(project.originalAskingPrice)}</span></div>
            <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Negotiated Purchase Price</span><span className="font-medium text-green-600">{formatCurrency(purchasePrice)}</span></div>
            <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Closing Costs (2%)</span><span className="font-medium">{formatCurrency(closingCosts)}</span></div>
            <div className="flex justify-between items-center py-2 border-b bg-gray-50 px-2 -mx-2 font-semibold"><span>Total Acquisition Cost</span><span>{formatCurrency(totalAcquisition)}</span></div>
            <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Construction Budget</span><span className="font-medium">{formatCurrency(constructionBudget)}</span></div>
            <div className="flex justify-between items-center py-2 bg-emerald-50 px-2 -mx-2 font-bold"><span>Total Project Investment</span><span className="text-emerald-700">{formatCurrency(project.budget)}</span></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg text-center"><p className="text-xs text-gray-500 uppercase mb-1">Discount Achieved</p><p className="text-2xl font-bold text-blue-600">{((1 - purchasePrice / project.originalAskingPrice) * 100).toFixed(1)}%</p></div>
            <div className="p-4 bg-emerald-50 rounded-lg text-center"><p className="text-xs text-gray-500 uppercase mb-1">Savings</p><p className="text-2xl font-bold text-emerald-600">{formatCurrency(project.originalAskingPrice - purchasePrice)}</p></div>
            <div className="p-4 bg-purple-50 rounded-lg text-center"><p className="text-xs text-gray-500 uppercase mb-1">Price / Unit</p><p className="text-2xl font-bold text-purple-600">{formatCurrency(purchasePrice / project.units)}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const PipelineTrackerSection = ({ project }) => {
  const stages = project.acquisitionStages || [];
  return (
    <div className="space-y-6">
      {project.convertedFrom && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-white" /></div><div><p className="font-semibold text-emerald-800">Converted from Opportunity</p><p className="text-sm text-emerald-600">{project.convertedFrom.name} • Converted {formatDate(project.convertedFrom.date)}</p></div></div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Acquisition Pipeline History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stages.map((s, idx) => (
              <div key={s.stage} className="flex items-center gap-4">
                <div className="flex flex-col items-center"><div className={cn("w-4 h-4 rounded-full border-2", s.status === 'complete' ? "bg-green-500 border-green-500" : "bg-white border-gray-300")} />{idx < stages.length - 1 && <div className={cn("w-0.5 h-8", s.status === 'complete' ? "bg-green-500" : "bg-gray-200")} />}</div>
                <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="font-medium">{s.stage}</p><p className="text-sm text-gray-500">{formatDate(s.date)}</p></div><Badge className={s.status === 'complete' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{s.status}</Badge></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DueDiligenceSection = ({ project }) => {
  const items = [
    { category: 'Title', item: 'Title Commitment', status: 'complete', date: '2024-01-10', notes: 'Clear title confirmed' },
    { category: 'Title', item: 'Survey', status: 'complete', date: '2024-01-12', notes: 'ALTA survey received' },
    { category: 'Environmental', item: 'Phase I ESA', status: 'complete', date: '2024-01-15', notes: 'No RECs identified' },
    { category: 'Physical', item: 'Property Inspection', status: 'complete', date: '2024-01-08' },
    { category: 'Financial', item: 'Rent Roll Review', status: 'complete', date: '2024-01-05' },
    { category: 'Legal', item: 'Lease Review', status: 'complete', date: '2024-01-25' },
  ];
  const grouped = items.reduce((acc, i) => { if (!acc[i.category]) acc[i.category] = []; acc[i.category].push(i); return acc; }, {});
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Due Diligence Checklist</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Item</Button></div>
      <Card><CardContent className="pt-4"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Overall Progress</span><span className="text-sm text-gray-500">6 of 6 complete</span></div><Progress value={100} className="h-2" /></CardContent></Card>
      {Object.entries(grouped).map(([cat, items]) => (
        <Card key={cat}>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold uppercase text-gray-500">{cat}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((i, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-600" /><div><p className="font-medium">{i.item}</p>{i.notes && <p className="text-sm text-gray-500">{i.notes}</p>}</div></div><div className="flex items-center gap-4"><span className="text-sm text-gray-500">{formatDate(i.date)}</span><Badge className="bg-green-100 text-green-800">Complete</Badge></div></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const LegalSection = ({ project }) => {
  const docs = [
    { name: 'Purchase & Sale Agreement', status: 'executed', date: '2023-11-15', parties: 'Seller / Watson House LLC' },
    { name: 'Title Commitment', status: 'received', date: '2024-01-10', parties: 'Secure Title Co' },
    { name: 'Operating Agreement', status: 'executed', date: '2023-12-01', parties: 'Watson House LLC Members' },
    { name: 'Construction Contract', status: 'executed', date: '2024-01-20', parties: 'Watson House LLC / BuildRight' },
    { name: 'Loan Agreement', status: 'executed', date: '2024-01-15', parties: 'Watson House LLC / First National' },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Legal Documents</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Document</Button></div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Parties</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="w-20"></TableHead></TableRow></TableHeader>
          <TableBody>
            {docs.map((d, idx) => (<TableRow key={idx}><TableCell className="font-medium">{d.name}</TableCell><TableCell className="text-gray-600">{d.parties}</TableCell><TableCell>{formatDate(d.date)}</TableCell><TableCell><Badge className="bg-green-100 text-green-800 capitalize">{d.status}</Badge></TableCell><TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

// ============================================================================
// CONSTRUCTION SECTIONS
// ============================================================================
const PlansPermitsSection = ({ project }) => {
  const plans = [
    { name: 'Site Plan', version: 'v3.2', status: 'approved', date: '2024-01-20', author: 'Modern Design Studio' },
    { name: 'Architectural Plans', version: 'v4.1', status: 'approved', date: '2024-02-01', author: 'Modern Design Studio' },
    { name: 'Structural Plans', version: 'v2.0', status: 'approved', date: '2024-02-10', author: 'Strong Engineering' },
    { name: 'MEP Plans', version: 'v1.5', status: 'in_review', date: '2024-02-15', author: 'Systems Design Inc' },
    { name: 'Landscape Plans', version: 'v1.0', status: 'pending', date: null, author: 'Green Spaces LLC' },
  ];
  const permits = [
    { name: 'Building Permit', number: 'BP-2024-1234', status: 'issued', issueDate: '2024-02-20', expiryDate: '2025-02-20', authority: 'Greenville County' },
    { name: 'Grading Permit', number: 'GP-2024-567', status: 'issued', issueDate: '2024-01-25', expiryDate: '2025-01-25', authority: 'Greenville County' },
    { name: 'Utility Permit', number: 'UP-2024-890', status: 'pending', issueDate: null, expiryDate: null, authority: 'City of Greenville' },
  ];
  const statusColors = { approved: 'bg-green-100 text-green-800', in_review: 'bg-yellow-100 text-yellow-800', pending: 'bg-gray-100 text-gray-800', issued: 'bg-green-100 text-green-800' };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-base font-semibold">Plans</CardTitle><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Upload className="w-4 h-4 mr-2" /> Upload Plan</Button></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="bg-gray-50"><TableHead>Plan Set</TableHead><TableHead>Version</TableHead><TableHead>Author</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="w-20"></TableHead></TableRow></TableHeader>
            <TableBody>
              {plans.map((p, idx) => (<TableRow key={idx}><TableCell className="font-medium">{p.name}</TableCell><TableCell><Badge variant="outline">{p.version}</Badge></TableCell><TableCell>{p.author}</TableCell><TableCell>{formatDate(p.date)}</TableCell><TableCell><Badge className={statusColors[p.status]}>{p.status.replace('_', ' ')}</Badge></TableCell><TableCell><Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button></TableCell></TableRow>))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-base font-semibold">Permits</CardTitle><Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Permit</Button></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="bg-gray-50"><TableHead>Permit</TableHead><TableHead>Number</TableHead><TableHead>Authority</TableHead><TableHead>Issue Date</TableHead><TableHead>Expiry</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {permits.map((p, idx) => (<TableRow key={idx}><TableCell className="font-medium">{p.name}</TableCell><TableCell className="font-mono text-sm">{p.number}</TableCell><TableCell>{p.authority}</TableCell><TableCell>{formatDate(p.issueDate)}</TableCell><TableCell>{formatDate(p.expiryDate)}</TableCell><TableCell><Badge className={statusColors[p.status]}>{p.status}</Badge></TableCell></TableRow>))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const ScheduleSection = ({ project }) => {
  const milestones = [
    { name: 'Land Acquisition', planned: '2024-01-15', actual: '2024-01-15', status: 'complete' },
    { name: 'Permits Approved', planned: '2024-02-28', actual: '2024-03-05', status: 'complete' },
    { name: 'Site Work Complete', planned: '2024-04-15', actual: '2024-04-20', status: 'complete' },
    { name: 'Foundation Complete', planned: '2024-06-01', actual: null, status: 'in_progress' },
    { name: 'Framing Complete', planned: '2024-08-15', actual: null, status: 'pending' },
    { name: 'MEP Rough-In', planned: '2024-10-01', actual: null, status: 'pending' },
    { name: 'CO Issued', planned: '2025-05-01', actual: null, status: 'pending' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Project Schedule</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Milestone</Button></div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div key={m.name} className="flex items-center gap-4">
                <div className="flex flex-col items-center"><div className={cn("w-4 h-4 rounded-full border-2", m.status === 'complete' ? "bg-green-500 border-green-500" : m.status === 'in_progress' ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300")} />{idx < milestones.length - 1 && <div className={cn("w-0.5 h-8", m.status === 'complete' ? "bg-green-500" : "bg-gray-200")} />}</div>
                <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><p className="font-medium">{m.name}</p><p className="text-sm text-gray-500">Planned: {formatDate(m.planned)}{m.actual && <span className={cn("ml-2", new Date(m.actual) > new Date(m.planned) ? "text-red-600" : "text-green-600")}>• Actual: {formatDate(m.actual)}</span>}</p></div><Badge className={cn(m.status === 'complete' ? "bg-green-100 text-green-800" : m.status === 'in_progress' ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800")}>{m.status.replace('_', ' ')}</Badge></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const BudgetSection = ({ project }) => {
  const cats = [
    { code: '100', name: 'Land Acquisition', budget: 4200000, spent: 4200000, committed: 0 },
    { code: '200', name: 'Hard Costs - Site Work', budget: 1200000, spent: 850000, committed: 200000 },
    { code: '300', name: 'Hard Costs - Vertical', budget: 9500000, spent: 5200000, committed: 2500000 },
    { code: '400', name: 'Soft Costs - Design', budget: 800000, spent: 720000, committed: 50000 },
    { code: '500', name: 'Soft Costs - Legal', budget: 250000, spent: 180000, committed: 30000 },
    { code: '600', name: 'Financing Costs', budget: 1100000, spent: 630000, committed: 420000 },
    { code: '700', name: 'Contingency', budget: 950000, spent: 0, committed: 0 },
  ];
  const totals = cats.reduce((a, c) => ({ budget: a.budget + c.budget, spent: a.spent + c.spent, committed: a.committed + c.committed }), { budget: 0, spent: 0, committed: 0 });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Project Budget</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Edit className="w-4 h-4 mr-2" /> Edit Budget</Button></div>
      <div className="grid grid-cols-5 gap-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Budget</p><p className="text-xl font-bold">{formatCurrency(totals.budget)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Spent</p><p className="text-xl font-bold text-red-600">{formatCurrency(totals.spent)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Committed</p><p className="text-xl font-bold text-yellow-600">{formatCurrency(totals.committed)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Remaining</p><p className="text-xl font-bold text-green-600">{formatCurrency(totals.budget - totals.spent - totals.committed)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">% Complete</p><p className="text-xl font-bold">{((totals.spent / totals.budget) * 100).toFixed(1)}%</p></CardContent></Card>
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Code</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Budget</TableHead><TableHead className="text-right">Spent</TableHead><TableHead className="text-right">Committed</TableHead><TableHead className="text-right">Remaining</TableHead><TableHead className="w-24">Progress</TableHead></TableRow></TableHeader>
          <TableBody>
            {cats.map(c => (<TableRow key={c.code}><TableCell className="font-mono text-sm">{c.code}</TableCell><TableCell className="font-medium">{c.name}</TableCell><TableCell className="text-right">{formatCurrency(c.budget)}</TableCell><TableCell className="text-right text-red-600">{formatCurrency(c.spent)}</TableCell><TableCell className="text-right text-yellow-600">{formatCurrency(c.committed)}</TableCell><TableCell className={cn("text-right", (c.budget - c.spent - c.committed) < 0 ? "text-red-600 font-bold" : "text-green-600")}>{formatCurrency(c.budget - c.spent - c.committed)}</TableCell><TableCell><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min((c.spent / c.budget) * 100, 100)}%` }} /></div></TableCell></TableRow>))}
            <TableRow className="bg-gray-100 font-bold"><TableCell></TableCell><TableCell>TOTAL</TableCell><TableCell className="text-right">{formatCurrency(totals.budget)}</TableCell><TableCell className="text-right text-red-600">{formatCurrency(totals.spent)}</TableCell><TableCell className="text-right text-yellow-600">{formatCurrency(totals.committed)}</TableCell><TableCell className="text-right text-green-600">{formatCurrency(totals.budget - totals.spent - totals.committed)}</TableCell><TableCell></TableCell></TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const DrawsSection = ({ project }) => {
  const draws = [
    { number: 1, date: '2024-02-15', amount: 2500000, status: 'paid', description: 'Land acquisition' },
    { number: 2, date: '2024-03-20', amount: 1800000, status: 'paid', description: 'Site work and foundation' },
    { number: 3, date: '2024-04-25', amount: 2200000, status: 'paid', description: 'Vertical construction - Phase 1' },
    { number: 4, date: '2024-05-30', amount: 2100000, status: 'approved', description: 'Vertical construction - Phase 2' },
    { number: 5, date: '2024-06-28', amount: 1900000, status: 'pending', description: 'MEP and framing' },
  ];
  const loanAmount = project.loans?.[0]?.amount || 14000000;
  const totalDrawn = draws.filter(d => d.status === 'paid').reduce((a, d) => a + d.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Draw Schedule</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Draw Request</Button></div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Loan</p><p className="text-xl font-bold">{formatCurrency(loanAmount)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Drawn</p><p className="text-xl font-bold text-blue-600">{formatCurrency(totalDrawn)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Pending</p><p className="text-xl font-bold text-yellow-600">{formatCurrency(draws.filter(d => d.status !== 'paid').reduce((a, d) => a + d.amount, 0))}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Remaining</p><p className="text-xl font-bold text-green-600">{formatCurrency(loanAmount - totalDrawn)}</p></CardContent></Card>
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Draw #</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {draws.map(d => (<TableRow key={d.number}><TableCell className="font-medium">Draw {d.number}</TableCell><TableCell>{formatDate(d.date)}</TableCell><TableCell>{d.description}</TableCell><TableCell className="text-right font-medium">{formatCurrency(d.amount)}</TableCell><TableCell><Badge className={cn(d.status === 'paid' ? "bg-green-100 text-green-800" : d.status === 'approved' ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800")}>{d.status}</Badge></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const PurchaseOrdersSection = ({ project }) => {
  const pos = [
    { number: 'PO-001', vendor: 'BuildRight Construction', description: 'General construction contract', amount: 8500000, issued: '2024-01-20', status: 'active', invoiced: 5200000 },
    { number: 'PO-002', vendor: 'ABC Lumber Supply', description: 'Framing materials', amount: 450000, issued: '2024-02-15', status: 'active', invoiced: 320000 },
    { number: 'PO-003', vendor: 'Premium Windows Inc', description: 'Windows and doors', amount: 380000, issued: '2024-03-01', status: 'pending', invoiced: 0 },
    { number: 'PO-004', vendor: 'Elite HVAC Systems', description: 'HVAC equipment and install', amount: 620000, issued: '2024-03-10', status: 'pending', invoiced: 0 },
    { number: 'PO-005', vendor: 'City Electric', description: 'Electrical work', amount: 290000, issued: '2024-02-28', status: 'active', invoiced: 145000 },
  ];
  const totalPO = pos.reduce((a, p) => a + p.amount, 0);
  const totalInvoiced = pos.reduce((a, p) => a + p.invoiced, 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Purchase Orders</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Create PO</Button></div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total POs</p><p className="text-xl font-bold">{pos.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Value</p><p className="text-xl font-bold">{formatCurrency(totalPO)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Invoiced</p><p className="text-xl font-bold text-blue-600">{formatCurrency(totalInvoiced)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Remaining</p><p className="text-xl font-bold text-green-600">{formatCurrency(totalPO - totalInvoiced)}</p></CardContent></Card>
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>PO #</TableHead><TableHead>Vendor</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Invoiced</TableHead><TableHead>Status</TableHead><TableHead className="w-20"></TableHead></TableRow></TableHeader>
          <TableBody>
            {pos.map(p => (<TableRow key={p.number}><TableCell className="font-mono font-medium">{p.number}</TableCell><TableCell className="font-medium">{p.vendor}</TableCell><TableCell className="text-gray-600">{p.description}</TableCell><TableCell className="text-right">{formatCurrency(p.amount)}</TableCell><TableCell className="text-right text-blue-600">{formatCurrency(p.invoiced)}</TableCell><TableCell><Badge className={p.status === 'active' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{p.status}</Badge></TableCell><TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const InspectionsSection = ({ project }) => {
  // Templated inspections based on project type and jurisdiction
  const inspectionTemplates = {
    multifamily: [
      { category: 'Foundation', name: 'Footing Inspection', required: true },
      { category: 'Foundation', name: 'Foundation Wall Inspection', required: true },
      { category: 'Foundation', name: 'Slab Pre-Pour', required: true },
      { category: 'Framing', name: 'Rough Framing', required: true },
      { category: 'Framing', name: 'Shear Wall / Hold Down', required: true },
      { category: 'MEP', name: 'Electrical Rough-In', required: true },
      { category: 'MEP', name: 'Plumbing Rough-In', required: true },
      { category: 'MEP', name: 'Mechanical Rough-In', required: true },
      { category: 'Insulation', name: 'Insulation Inspection', required: true },
      { category: 'Final', name: 'Electrical Final', required: true },
      { category: 'Final', name: 'Plumbing Final', required: true },
      { category: 'Final', name: 'Mechanical Final', required: true },
      { category: 'Final', name: 'Building Final', required: true },
      { category: 'Fire', name: 'Fire Sprinkler Rough', required: true },
      { category: 'Fire', name: 'Fire Sprinkler Final', required: true },
      { category: 'Fire', name: 'Fire Alarm', required: true },
    ],
  };
  const inspections = [
    { ...inspectionTemplates.multifamily[0], status: 'passed', date: '2024-03-15', inspector: 'J. Davis', notes: 'All footings meet specs' },
    { ...inspectionTemplates.multifamily[1], status: 'passed', date: '2024-03-28', inspector: 'J. Davis' },
    { ...inspectionTemplates.multifamily[2], status: 'passed', date: '2024-04-10', inspector: 'M. Thompson' },
    { ...inspectionTemplates.multifamily[3], status: 'scheduled', date: '2024-06-15', inspector: null },
    { ...inspectionTemplates.multifamily[4], status: 'pending', date: null, inspector: null },
  ];
  const statusColors = { passed: 'bg-green-100 text-green-800', failed: 'bg-red-100 text-red-800', scheduled: 'bg-blue-100 text-blue-800', pending: 'bg-gray-100 text-gray-800' };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-lg font-semibold">Inspections</h3><p className="text-sm text-gray-500">Template: {project.projectType || 'Multifamily'} • {project.jurisdiction || 'Greenville County'}</p></div>
        <Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Schedule Inspection</Button>
      </div>
      <Card><CardContent className="pt-4"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Overall Progress</span><span className="text-sm text-gray-500">3 of 16 complete</span></div><Progress value={19} className="h-2" /></CardContent></Card>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Category</TableHead><TableHead>Inspection</TableHead><TableHead>Date</TableHead><TableHead>Inspector</TableHead><TableHead>Status</TableHead><TableHead className="w-20"></TableHead></TableRow></TableHeader>
          <TableBody>
            {inspections.map((i, idx) => (<TableRow key={idx}><TableCell className="text-gray-500">{i.category}</TableCell><TableCell className="font-medium">{i.name}</TableCell><TableCell>{formatDate(i.date)}</TableCell><TableCell>{i.inspector || '-'}</TableCell><TableCell><Badge className={statusColors[i.status]}>{i.status}</Badge></TableCell><TableCell>{i.status === 'pending' && <Button variant="outline" size="sm">Schedule</Button>}</TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const WarrantySection = ({ project }) => {
  const warranties = [
    { item: 'Roof System', vendor: 'Premium Roofing Co', startDate: '2025-05-01', duration: '20 years', expiryDate: '2045-05-01', type: 'Manufacturer', status: 'pending' },
    { item: 'HVAC Equipment', vendor: 'Elite HVAC Systems', startDate: '2025-05-01', duration: '10 years', expiryDate: '2035-05-01', type: 'Manufacturer', status: 'pending' },
    { item: 'Appliances', vendor: 'GE Appliances', startDate: '2025-05-01', duration: '2 years', expiryDate: '2027-05-01', type: 'Manufacturer', status: 'pending' },
    { item: 'Workmanship', vendor: 'BuildRight Construction', startDate: '2025-05-01', duration: '1 year', expiryDate: '2026-05-01', type: 'Contractor', status: 'pending' },
    { item: 'Structural', vendor: 'Watson House LLC', startDate: '2025-05-01', duration: '10 years', expiryDate: '2035-05-01', type: 'Builder', status: 'pending' },
  ];
  const claims = [];
  return (
    <div className="space-y-6">
      <Tabs defaultValue="warranties">
        <TabsList><TabsTrigger value="warranties">Warranties</TabsTrigger><TabsTrigger value="claims">Claims (0)</TabsTrigger></TabsList>
        <TabsContent value="warranties" className="space-y-4">
          <div className="flex items-center justify-between mt-4"><h3 className="text-lg font-semibold">Warranty Tracking</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Warranty</Button></div>
          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead>Item</TableHead><TableHead>Vendor</TableHead><TableHead>Type</TableHead><TableHead>Duration</TableHead><TableHead>Start Date</TableHead><TableHead>Expiry</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {warranties.map((w, idx) => (<TableRow key={idx}><TableCell className="font-medium">{w.item}</TableCell><TableCell>{w.vendor}</TableCell><TableCell><Badge variant="outline">{w.type}</Badge></TableCell><TableCell>{w.duration}</TableCell><TableCell>{formatDate(w.startDate)}</TableCell><TableCell>{formatDate(w.expiryDate)}</TableCell><TableCell><Badge className="bg-gray-100 text-gray-800">{w.status}</Badge></TableCell></TableRow>))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        <TabsContent value="claims">
          <Card className="mt-4"><CardContent className="py-12 text-center"><Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No warranty claims filed</p><Button className="mt-4 bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> File Claim</Button></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// ============================================================================
// DISPOSITION SECTIONS
// ============================================================================
const SalesOffersSection = ({ project }) => {
  const offers = [
    { id: 1, unit: 'Unit 101', buyer: 'John & Mary Smith', offerAmount: 425000, askingPrice: 450000, date: '2024-05-15', status: 'pending', agent: 'Jane Realtor' },
    { id: 2, unit: 'Unit 102', buyer: 'Tech Corp LLC', offerAmount: 440000, askingPrice: 450000, date: '2024-05-10', status: 'counter', agent: 'Bob Agent' },
    { id: 3, unit: 'Unit 201', buyer: 'Sarah Johnson', offerAmount: 475000, askingPrice: 475000, date: '2024-05-08', status: 'accepted', agent: 'Jane Realtor' },
    { id: 4, unit: 'Unit 202', buyer: 'Mike Williams', offerAmount: 455000, askingPrice: 475000, date: '2024-05-01', status: 'rejected', agent: 'Bob Agent' },
  ];
  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', counter: 'bg-blue-100 text-blue-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Sales & Offers</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Record Offer</Button></div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Units</p><p className="text-2xl font-bold">{project.units}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Active Offers</p><p className="text-2xl font-bold text-yellow-600">{offers.filter(o => o.status === 'pending' || o.status === 'counter').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Accepted</p><p className="text-2xl font-bold text-green-600">{offers.filter(o => o.status === 'accepted').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Available</p><p className="text-2xl font-bold text-blue-600">{project.units - offers.filter(o => o.status === 'accepted').length}</p></CardContent></Card>
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Unit</TableHead><TableHead>Buyer</TableHead><TableHead className="text-right">Asking</TableHead><TableHead className="text-right">Offer</TableHead><TableHead>Date</TableHead><TableHead>Agent</TableHead><TableHead>Status</TableHead><TableHead className="w-20"></TableHead></TableRow></TableHeader>
          <TableBody>
            {offers.map(o => (<TableRow key={o.id}><TableCell className="font-medium">{o.unit}</TableCell><TableCell>{o.buyer}</TableCell><TableCell className="text-right">{formatCurrency(o.askingPrice)}</TableCell><TableCell className={cn("text-right font-medium", o.offerAmount < o.askingPrice ? "text-red-600" : "text-green-600")}>{formatCurrency(o.offerAmount)}</TableCell><TableCell>{formatDate(o.date)}</TableCell><TableCell>{o.agent}</TableCell><TableCell><Badge className={statusColors[o.status]}>{o.status}</Badge></TableCell><TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const SalesContractsSection = ({ project }) => {
  const contracts = [
    { id: 1, unit: 'Unit 201', buyer: 'Sarah Johnson', contractPrice: 475000, earnestMoney: 10000, signedDate: '2024-05-12', closingDate: '2024-06-30', status: 'active', contingencies: ['Financing', 'Inspection'] },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Sales Contracts</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Contract</Button></div>
      {contracts.length > 0 ? (
        <div className="space-y-4">
          {contracts.map(c => (
            <Card key={c.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><div><CardTitle className="text-base font-semibold">{c.unit}</CardTitle><p className="text-sm text-gray-500">{c.buyer}</p></div><Badge className="bg-green-100 text-green-800">{c.status}</Badge></CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div><Label className="text-xs uppercase text-gray-500">Contract Price</Label><p className="font-semibold">{formatCurrency(c.contractPrice)}</p></div>
                  <div><Label className="text-xs uppercase text-gray-500">Earnest Money</Label><p className="font-semibold">{formatCurrency(c.earnestMoney)}</p></div>
                  <div><Label className="text-xs uppercase text-gray-500">Signed Date</Label><p className="font-medium">{formatDate(c.signedDate)}</p></div>
                  <div><Label className="text-xs uppercase text-gray-500">Closing Date</Label><p className="font-medium">{formatDate(c.closingDate)}</p></div>
                </div>
                <div><Label className="text-xs uppercase text-gray-500">Contingencies</Label><div className="flex gap-2 mt-1">{c.contingencies.map(ct => <Badge key={ct} variant="outline">{ct}</Badge>)}</div></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card><CardContent className="py-12 text-center"><FileSignature className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No active sales contracts</p></CardContent></Card>
      )}
    </div>
  );
};

const ClosingSection = ({ project }) => {
  const closings = [
    { id: 1, unit: 'Unit 201', buyer: 'Sarah Johnson', scheduledDate: '2024-06-30', status: 'scheduled', titleCompany: 'Secure Title Co', lender: 'First Mortgage Bank', tasks: [
      { name: 'Title Search Complete', status: 'complete' },
      { name: 'Survey Ordered', status: 'complete' },
      { name: 'Appraisal Complete', status: 'complete' },
      { name: 'Loan Approved', status: 'in_progress' },
      { name: 'Final Walkthrough', status: 'pending' },
      { name: 'Closing Documents Prepared', status: 'pending' },
    ]},
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Closings</h3></div>
      {closings.map(c => (
        <Card key={c.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div><CardTitle className="text-base font-semibold">{c.unit} - {c.buyer}</CardTitle><p className="text-sm text-gray-500">Scheduled: {formatDate(c.scheduledDate)}</p></div>
            <Badge className="bg-blue-100 text-blue-800">{c.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><Label className="text-xs uppercase text-gray-500">Title Company</Label><p className="font-medium">{c.titleCompany}</p></div>
              <div><Label className="text-xs uppercase text-gray-500">Lender</Label><p className="font-medium">{c.lender}</p></div>
            </div>
            <div><Label className="text-xs uppercase text-gray-500 mb-2 block">Closing Tasks</Label>
              <div className="space-y-2">
                {c.tasks.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    {t.status === 'complete' ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : t.status === 'in_progress' ? <Clock className="w-5 h-5 text-blue-600" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                    <span className={cn(t.status === 'complete' && 'text-gray-400')}>{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ============================================================================
// FINANCE SECTIONS
// ============================================================================
const LoansSection = ({ project }) => {
  const loans = project.loans || [];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Loans</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Loan</Button></div>
      {loans.map(loan => (
        <Card key={loan.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Landmark className="w-5 h-5 text-blue-600" /></div><div><CardTitle className="text-base font-semibold">{loan.name}</CardTitle><p className="text-sm text-gray-500">{loan.lender}</p></div></div><Badge className={loan.status === 'active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{loan.status}</Badge></CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div><Label className="text-xs uppercase text-gray-500">Loan Amount</Label><p className="font-semibold text-lg">{formatCurrency(loan.amount)}</p></div>
              <div><Label className="text-xs uppercase text-gray-500">Drawn</Label><p className="font-semibold text-lg text-blue-600">{formatCurrency(loan.drawn)}</p></div>
              <div><Label className="text-xs uppercase text-gray-500">Available</Label><p className="font-semibold text-lg text-green-600">{formatCurrency(loan.amount - loan.drawn)}</p></div>
              <div><Label className="text-xs uppercase text-gray-500">Interest Rate</Label><p className="font-semibold text-lg">{loan.rate}%</p></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label className="text-xs uppercase text-gray-500">Term</Label><p className="font-medium">{loan.term} months</p></div>
              <div><Label className="text-xs uppercase text-gray-500">Maturity Date</Label><p className="font-medium">{formatDate(loan.maturityDate)}</p></div>
              <div><Label className="text-xs uppercase text-gray-500">LTV</Label><p className="font-medium">{((loan.amount / project.budget) * 100).toFixed(1)}%</p></div>
            </div>
            <div className="mt-4"><Label className="text-xs uppercase text-gray-500 mb-1 block">Draw Progress</Label><Progress value={(loan.drawn / loan.amount) * 100} className="h-3" /></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ProFormaSection = ({ project }) => {
  const proforma = {
    revenue: { rentalIncome: 2400000, otherIncome: 120000, vacancyLoss: -180000, effectiveGrossIncome: 2340000 },
    expenses: { propertyManagement: 117000, insurance: 48000, taxes: 180000, utilities: 72000, maintenance: 96000, reserves: 48000, totalExpenses: 561000 },
    noi: 1779000,
    debtService: 980000,
    cashFlow: 799000,
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Pro Forma Analysis</h3><Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit Assumptions</Button></div>
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200"><CardContent className="pt-4"><p className="text-xs text-gray-600 uppercase">EGI</p><p className="text-2xl font-bold text-blue-700">{formatCurrency(proforma.revenue.effectiveGrossIncome)}</p></CardContent></Card>
        <Card className="bg-red-50 border-red-200"><CardContent className="pt-4"><p className="text-xs text-gray-600 uppercase">Expenses</p><p className="text-2xl font-bold text-red-700">{formatCurrency(proforma.expenses.totalExpenses)}</p></CardContent></Card>
        <Card className="bg-emerald-50 border-emerald-200"><CardContent className="pt-4"><p className="text-xs text-gray-600 uppercase">NOI</p><p className="text-2xl font-bold text-emerald-700">{formatCurrency(proforma.noi)}</p></CardContent></Card>
        <Card className="bg-purple-50 border-purple-200"><CardContent className="pt-4"><p className="text-xs text-gray-600 uppercase">Cash Flow</p><p className="text-2xl font-bold text-purple-700">{formatCurrency(proforma.cashFlow)}</p></CardContent></Card>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base font-semibold">Revenue</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b"><span>Rental Income</span><span className="font-medium">{formatCurrency(proforma.revenue.rentalIncome)}</span></div>
              <div className="flex justify-between py-2 border-b"><span>Other Income</span><span className="font-medium">{formatCurrency(proforma.revenue.otherIncome)}</span></div>
              <div className="flex justify-between py-2 border-b text-red-600"><span>Vacancy Loss (7.5%)</span><span className="font-medium">{formatCurrency(proforma.revenue.vacancyLoss)}</span></div>
              <div className="flex justify-between py-2 font-bold bg-gray-50 px-2 -mx-2"><span>Effective Gross Income</span><span>{formatCurrency(proforma.revenue.effectiveGrossIncome)}</span></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base font-semibold">Operating Expenses</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b"><span>Property Management (5%)</span><span className="font-medium">{formatCurrency(proforma.expenses.propertyManagement)}</span></div>
              <div className="flex justify-between py-2 border-b"><span>Insurance</span><span className="font-medium">{formatCurrency(proforma.expenses.insurance)}</span></div>
              <div className="flex justify-between py-2 border-b"><span>Property Taxes</span><span className="font-medium">{formatCurrency(proforma.expenses.taxes)}</span></div>
              <div className="flex justify-between py-2 border-b"><span>Utilities</span><span className="font-medium">{formatCurrency(proforma.expenses.utilities)}</span></div>
              <div className="flex justify-between py-2 border-b"><span>Maintenance & Repairs</span><span className="font-medium">{formatCurrency(proforma.expenses.maintenance)}</span></div>
              <div className="flex justify-between py-2 border-b"><span>Reserves</span><span className="font-medium">{formatCurrency(proforma.expenses.reserves)}</span></div>
              <div className="flex justify-between py-2 font-bold bg-gray-50 px-2 -mx-2"><span>Total Expenses</span><span>{formatCurrency(proforma.expenses.totalExpenses)}</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ActualsSection = ({ project }) => {
  const budgetCategories = [
    { code: '100', name: 'Land Acquisition', budget: 4200000, actual: 4200000 },
    { code: '200', name: 'Hard Costs - Site Work', budget: 1200000, actual: 1050000 },
    { code: '300', name: 'Hard Costs - Vertical', budget: 9500000, actual: 7700000 },
    { code: '400', name: 'Soft Costs - Design', budget: 800000, actual: 770000 },
    { code: '500', name: 'Soft Costs - Legal', budget: 250000, actual: 210000 },
    { code: '600', name: 'Financing Costs', budget: 1100000, actual: 1050000 },
    { code: '700', name: 'Contingency', budget: 950000, actual: 0 },
  ];
  const totals = budgetCategories.reduce((a, c) => ({ budget: a.budget + c.budget, actual: a.actual + c.actual }), { budget: 0, actual: 0 });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Actuals vs Budget</h3><Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export Report</Button></div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Budget</p><p className="text-xl font-bold">{formatCurrency(totals.budget)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Actual Spent</p><p className="text-xl font-bold text-blue-600">{formatCurrency(totals.actual)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Variance</p><p className={cn("text-xl font-bold", totals.budget - totals.actual >= 0 ? "text-green-600" : "text-red-600")}>{formatCurrency(totals.budget - totals.actual)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">% of Budget</p><p className="text-xl font-bold">{((totals.actual / totals.budget) * 100).toFixed(1)}%</p></CardContent></Card>
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Code</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Budget</TableHead><TableHead className="text-right">Actual</TableHead><TableHead className="text-right">Variance</TableHead><TableHead className="text-right">% Used</TableHead><TableHead className="w-32">Progress</TableHead></TableRow></TableHeader>
          <TableBody>
            {budgetCategories.map(c => {
              const variance = c.budget - c.actual;
              const pct = c.budget > 0 ? (c.actual / c.budget) * 100 : 0;
              return (<TableRow key={c.code}><TableCell className="font-mono text-sm">{c.code}</TableCell><TableCell className="font-medium">{c.name}</TableCell><TableCell className="text-right">{formatCurrency(c.budget)}</TableCell><TableCell className="text-right text-blue-600">{formatCurrency(c.actual)}</TableCell><TableCell className={cn("text-right font-medium", variance >= 0 ? "text-green-600" : "text-red-600")}>{formatCurrency(variance)}</TableCell><TableCell className="text-right">{pct.toFixed(1)}%</TableCell><TableCell><div className="w-full bg-gray-200 rounded-full h-2"><div className={cn("h-2 rounded-full", pct > 100 ? "bg-red-500" : pct > 90 ? "bg-yellow-500" : "bg-blue-500")} style={{ width: `${Math.min(pct, 100)}%` }} /></div></TableCell></TableRow>);
            })}
            <TableRow className="bg-gray-100 font-bold"><TableCell></TableCell><TableCell>TOTAL</TableCell><TableCell className="text-right">{formatCurrency(totals.budget)}</TableCell><TableCell className="text-right text-blue-600">{formatCurrency(totals.actual)}</TableCell><TableCell className={cn("text-right", totals.budget - totals.actual >= 0 ? "text-green-600" : "text-red-600")}>{formatCurrency(totals.budget - totals.actual)}</TableCell><TableCell className="text-right">{((totals.actual / totals.budget) * 100).toFixed(1)}%</TableCell><TableCell></TableCell></TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const ExpensesSection = ({ project }) => {
  const expenses = [
    { id: 1, date: '2024-06-15', vendor: 'BuildRight Construction', description: 'Progress payment - June', category: 'Hard Costs', amount: 450000, status: 'paid', method: 'ACH' },
    { id: 2, date: '2024-06-12', vendor: 'ABC Lumber Supply', description: 'Framing materials delivery', category: 'Hard Costs', amount: 45000, status: 'paid', method: 'Check' },
    { id: 3, date: '2024-06-10', vendor: 'City Electric', description: 'Electrical rough-in payment', category: 'Hard Costs', amount: 28000, status: 'paid', method: 'ACH' },
    { id: 4, date: '2024-06-08', vendor: 'Modern Design Studio', description: 'Design revisions', category: 'Soft Costs', amount: 12500, status: 'pending', method: null },
    { id: 5, date: '2024-06-05', vendor: 'First National Bank', description: 'Loan interest - June', category: 'Financing', amount: 85000, status: 'paid', method: 'Auto-debit' },
  ];
  const totalPaid = expenses.filter(e => e.status === 'paid').reduce((a, e) => a + e.amount, 0);
  const totalPending = expenses.filter(e => e.status === 'pending').reduce((a, e) => a + e.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Project Expenses</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Record Expense</Button></div>
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Expenses</p><p className="text-xl font-bold">{formatCurrency(totalPaid + totalPending)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Paid</p><p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Pending</p><p className="text-xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p></CardContent></Card>
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Date</TableHead><TableHead>Vendor</TableHead><TableHead>Description</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead className="w-20"></TableHead></TableRow></TableHeader>
          <TableBody>
            {expenses.map(e => (<TableRow key={e.id}><TableCell>{formatDate(e.date)}</TableCell><TableCell className="font-medium">{e.vendor}</TableCell><TableCell className="text-gray-600">{e.description}</TableCell><TableCell><Badge variant="outline">{e.category}</Badge></TableCell><TableCell className="text-right font-medium">{formatCurrency(e.amount)}</TableCell><TableCell><Badge className={e.status === 'paid' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{e.status}</Badge></TableCell><TableCell>{e.status === 'pending' && <Button size="sm" variant="outline">Pay</Button>}</TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const RevenueSection = ({ project }) => {
  const revenue = [
    { id: 1, date: '2024-06-30', source: 'Unit 201 Sale', buyer: 'Sarah Johnson', type: 'Sale', amount: 475000, status: 'pending' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Project Revenue</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Record Revenue</Button></div>
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Revenue</p><p className="text-xl font-bold">{formatCurrency(revenue.reduce((a, r) => a + r.amount, 0))}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Received</p><p className="text-xl font-bold text-green-600">{formatCurrency(revenue.filter(r => r.status === 'received').reduce((a, r) => a + r.amount, 0))}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Pending</p><p className="text-xl font-bold text-yellow-600">{formatCurrency(revenue.filter(r => r.status === 'pending').reduce((a, r) => a + r.amount, 0))}</p></CardContent></Card>
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Date</TableHead><TableHead>Source</TableHead><TableHead>Buyer/Tenant</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {revenue.map(r => (<TableRow key={r.id}><TableCell>{formatDate(r.date)}</TableCell><TableCell className="font-medium">{r.source}</TableCell><TableCell>{r.buyer}</TableCell><TableCell><Badge variant="outline">{r.type}</Badge></TableCell><TableCell className="text-right font-medium text-green-600">{formatCurrency(r.amount)}</TableCell><TableCell><Badge className={r.status === 'received' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{r.status}</Badge></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

// ============================================================================
// INVESTORS SECTIONS
// ============================================================================
const InvestorsListSection = ({ project }) => {
  const investors = [
    { id: 1, name: 'VanRock Holdings LLC', type: 'Managing Member', commitment: 2000000, contributed: 2000000, ownership: 50, distributions: 150000 },
    { id: 2, name: 'Olive Brynn LLC', type: 'Limited Partner', commitment: 1000000, contributed: 1000000, ownership: 25, distributions: 75000 },
    { id: 3, name: 'Smith Family Trust', type: 'Limited Partner', commitment: 600000, contributed: 600000, ownership: 15, distributions: 45000 },
    { id: 4, name: 'Johnson Investments', type: 'Limited Partner', commitment: 400000, contributed: 400000, ownership: 10, distributions: 30000 },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Project Investors</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Investor</Button></div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Investor</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Commitment</TableHead><TableHead className="text-right">Contributed</TableHead><TableHead className="text-right">Ownership %</TableHead><TableHead className="text-right">Distributions</TableHead></TableRow></TableHeader>
          <TableBody>
            {investors.map(i => (<TableRow key={i.id}><TableCell className="font-medium">{i.name}</TableCell><TableCell><Badge variant="outline">{i.type}</Badge></TableCell><TableCell className="text-right">{formatCurrency(i.commitment)}</TableCell><TableCell className="text-right">{formatCurrency(i.contributed)}</TableCell><TableCell className="text-right font-medium">{i.ownership}%</TableCell><TableCell className="text-right text-green-600">{formatCurrency(i.distributions)}</TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const InvestmentsSection = ({ project }) => {
  const capitalCalls = [
    { id: 1, date: '2024-01-10', description: 'Initial Capital Call', amount: 4000000, status: 'funded' },
    { id: 2, date: '2024-03-15', description: 'Second Capital Call', amount: 1000000, status: 'funded' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Capital Contributions</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Capital Call</Button></div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {capitalCalls.map(c => (<TableRow key={c.id}><TableCell>{formatDate(c.date)}</TableCell><TableCell className="font-medium">{c.description}</TableCell><TableCell className="text-right font-medium">{formatCurrency(c.amount)}</TableCell><TableCell><Badge className="bg-green-100 text-green-800">{c.status}</Badge></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const DistributionsSection = ({ project }) => {
  const distributions = [
    { id: 1, date: '2024-06-01', description: 'Q2 2024 Distribution', totalAmount: 300000, status: 'paid' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Distributions</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Distribution</Button></div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Total Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {distributions.map(d => (<TableRow key={d.id}><TableCell>{formatDate(d.date)}</TableCell><TableCell className="font-medium">{d.description}</TableCell><TableCell className="text-right font-medium text-green-600">{formatCurrency(d.totalAmount)}</TableCell><TableCell><Badge className="bg-green-100 text-green-800">{d.status}</Badge></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

// ============================================================================
// DOCUMENTS & COMMUNICATIONS SECTIONS
// ============================================================================
const DocumentsSection = ({ project }) => {
  const docs = [
    { name: 'Purchase Agreement.pdf', category: 'Legal', size: '2.4 MB', uploadedBy: 'John Smith', date: '2024-01-05' },
    { name: 'Title Commitment.pdf', category: 'Title', size: '1.8 MB', uploadedBy: 'Lisa Brown', date: '2024-01-10' },
    { name: 'Phase I ESA Report.pdf', category: 'Environmental', size: '15.2 MB', uploadedBy: 'John Smith', date: '2024-01-15' },
    { name: 'Architectural Plans v3.pdf', category: 'Design', size: '45.0 MB', uploadedBy: 'Mike Williams', date: '2024-02-01' },
    { name: 'Construction Budget.xlsx', category: 'Financial', size: '156 KB', uploadedBy: 'Sarah Johnson', date: '2024-01-20' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Documents</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Upload className="w-4 h-4 mr-2" /> Upload</Button></div>
      <Card>
        <Table>
          <TableHeader><TableRow className="bg-gray-50"><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Size</TableHead><TableHead>Uploaded By</TableHead><TableHead>Date</TableHead><TableHead className="w-20"></TableHead></TableRow></TableHeader>
          <TableBody>
            {docs.map((d, idx) => (<TableRow key={idx} className="cursor-pointer hover:bg-gray-50"><TableCell><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /><span className="font-medium">{d.name}</span></div></TableCell><TableCell><Badge variant="outline">{d.category}</Badge></TableCell><TableCell className="text-gray-500">{d.size}</TableCell><TableCell>{d.uploadedBy}</TableCell><TableCell>{formatDate(d.date)}</TableCell><TableCell><Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const CommunicationsSection = ({ project }) => {
  const [activeTab, setActiveTab] = useState('all');
  const communications = [
    { id: 1, type: 'call', subject: 'GC Progress Update', participants: ['John Smith', 'Sarah Johnson'], date: '2024-06-15T14:30:00', duration: '25 min', notes: 'Discussed framing progress. On track for next milestone.', followUp: 'Schedule inspection' },
    { id: 2, type: 'meeting', subject: 'Weekly Project Meeting', participants: ['John Smith', 'Sarah Johnson', 'Mike Williams', 'Lisa Brown'], date: '2024-06-14T10:00:00', duration: '1 hr', platform: 'Teams', notes: 'Reviewed budget status, discussed permit delays.', followUp: 'Mike to provide updated plans' },
    { id: 3, type: 'call', subject: 'Lender Draw Discussion', participants: ['John Smith', 'Lisa Brown'], date: '2024-06-12T11:00:00', duration: '15 min', notes: 'Confirmed draw 4 approval. Funds expected by EOD.', followUp: null },
    { id: 4, type: 'meeting', subject: 'Site Walk with Inspector', participants: ['John Smith', 'City Inspector'], date: '2024-06-10T09:00:00', duration: '45 min', platform: 'In-Person', notes: 'Foundation inspection passed. Minor corrections needed on east wall.', followUp: 'Complete corrections by Friday' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Communications</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><PhoneCall className="w-4 h-4 mr-2" /> Log Call</Button>
          <Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Video className="w-4 h-4 mr-2" /> Schedule Meeting</Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="calls">Calls</TabsTrigger><TabsTrigger value="meetings">Meetings</TabsTrigger></TabsList>
        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {communications.filter(c => activeTab === 'all' || c.type === activeTab.slice(0, -1)).map(c => (
            <Card key={c.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", c.type === 'call' ? "bg-blue-100" : "bg-purple-100")}>
                      {c.type === 'call' ? <PhoneCall className="w-5 h-5 text-blue-600" /> : <Video className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-semibold">{c.subject}</p>
                      <p className="text-sm text-gray-500">{formatDateTime(c.date)} • {c.duration}{c.platform && ` • ${c.platform}`}</p>
                      <p className="text-sm text-gray-600 mt-1">Participants: {c.participants.join(', ')}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{c.type}</Badge>
                </div>
                {c.notes && <div className="mt-3 p-3 bg-gray-50 rounded text-sm"><p className="text-gray-700">{c.notes}</p></div>}
                {c.followUp && <div className="mt-2 flex items-center gap-2 text-sm text-yellow-700"><AlertCircle className="w-4 h-4" /><span>Follow-up: {c.followUp}</span></div>}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmailSection = ({ project }) => {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const emails = [
    { id: 1, folder: 'inbox', from: 'Sarah Johnson <sarah@buildright.com>', subject: 'RE: Draw 4 Documentation', preview: 'Attached are the lien waivers and invoices for Draw 4. Please review and let me know if you need anything else.', date: '2024-06-15T16:45:00', unread: true, attachments: 3 },
    { id: 2, folder: 'inbox', from: 'Lisa Brown <lisa@fnb.com>', subject: 'Draw 4 Approved - Wire Instructions', preview: 'Good news! Draw 4 has been approved. Please find the wire instructions attached.', date: '2024-06-15T11:20:00', unread: false, attachments: 1 },
    { id: 3, folder: 'inbox', from: 'Mike Williams <mike@moderndesign.com>', subject: 'Updated Plans v4.2', preview: 'Please find attached the updated architectural plans incorporating the changes discussed.', date: '2024-06-14T09:15:00', unread: false, attachments: 2 },
    { id: 4, folder: 'sent', from: 'You', to: 'sarah@buildright.com', subject: 'Draw 4 Request', preview: 'Hi Sarah, Please prepare the documentation for Draw 4. We need lien waivers from all subs.', date: '2024-06-14T08:00:00', attachments: 0 },
  ];
  const filteredEmails = emails.filter(e => e.folder === activeFolder);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Email</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1"><ExternalLink className="w-3 h-3" /> Connected: Outlook</Badge>
          <Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><SendHorizontal className="w-4 h-4 mr-2" /> Compose</Button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-48 space-y-1">
          <Button variant={activeFolder === 'inbox' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setActiveFolder('inbox')}><Inbox className="w-4 h-4 mr-2" /> Inbox<Badge className="ml-auto bg-blue-100 text-blue-800">3</Badge></Button>
          <Button variant={activeFolder === 'sent' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setActiveFolder('sent')}><Send className="w-4 h-4 mr-2" /> Sent</Button>
          <Button variant={activeFolder === 'starred' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setActiveFolder('starred')}><Star className="w-4 h-4 mr-2" /> Starred</Button>
          <Button variant={activeFolder === 'archive' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setActiveFolder('archive')}><Archive className="w-4 h-4 mr-2" /> Archive</Button>
        </div>
        <div className="flex-1">
          <Card>
            <div className="divide-y">
              {filteredEmails.map(e => (
                <div key={e.id} className={cn("p-4 hover:bg-gray-50 cursor-pointer", e.unread && "bg-blue-50/50")}>
                  <div className="flex items-start justify-between mb-1">
                    <p className={cn("font-medium", e.unread && "font-semibold")}>{activeFolder === 'sent' ? `To: ${e.to}` : e.from}</p>
                    <span className="text-xs text-gray-500">{formatDateTime(e.date)}</span>
                  </div>
                  <p className={cn("text-sm", e.unread ? "text-gray-900 font-medium" : "text-gray-700")}>{e.subject}</p>
                  <p className="text-sm text-gray-500 truncate mt-1">{e.preview}</p>
                  {e.attachments > 0 && <div className="flex items-center gap-1 mt-2 text-xs text-gray-500"><Paperclip className="w-3 h-3" />{e.attachments} attachment{e.attachments > 1 ? 's' : ''}</div>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ProjectDetailPage = () => {
  const { projectId, section = 'overview', subsection = 'basic-info' } = useParams();
  const project = mockProjectsData[projectId] || mockProjectsData[1];

  const renderContent = () => {
    const key = `${section}/${subsection}`;
    switch (key) {
      // Overview
      case 'overview/basic-info': return <BasicInfoSection project={project} />;
      case 'overview/property-profile': return <PropertyProfileSection project={project} />;
      case 'overview/contacts': return <ContactsSection project={project} />;
      case 'overview/tasks': return <TasksSection project={project} />;
      // Acquisition
      case 'acquisition/deal-analysis': return <DealAnalysisSection project={project} />;
      case 'acquisition/pipeline-tracker': return <PipelineTrackerSection project={project} />;
      case 'acquisition/due-diligence': return <DueDiligenceSection project={project} />;
      case 'acquisition/legal': return <LegalSection project={project} />;
      // Construction
      case 'construction/plans-permits': return <PlansPermitsSection project={project} />;
      case 'construction/schedule': return <ScheduleSection project={project} />;
      case 'construction/budget': return <BudgetSection project={project} />;
      case 'construction/draws': return <DrawsSection project={project} />;
      case 'construction/purchase-orders': return <PurchaseOrdersSection project={project} />;
      case 'construction/inspections': return <InspectionsSection project={project} />;
      case 'construction/warranty': return <WarrantySection project={project} />;
      // Disposition
      case 'disposition/sales': return <SalesOffersSection project={project} />;
      case 'disposition/sales-contracts': return <SalesContractsSection project={project} />;
      case 'disposition/closing': return <ClosingSection project={project} />;
      // Finance
      case 'finance/loans': return <LoansSection project={project} />;
      case 'finance/proforma': return <ProFormaSection project={project} />;
      case 'finance/actuals': return <ActualsSection project={project} />;
      case 'finance/expenses': return <ExpensesSection project={project} />;
      case 'finance/revenue': return <RevenueSection project={project} />;
      // Investors
      case 'investors/investors-list': return <InvestorsListSection project={project} />;
      case 'investors/investments': return <InvestmentsSection project={project} />;
      case 'investors/distributions': return <DistributionsSection project={project} />;
      // Documents & Communications
      case 'documents/all-documents': return <DocumentsSection project={project} />;
      case 'documents/communications': return <CommunicationsSection project={project} />;
      case 'documents/email': return <EmailSection project={project} />;
      default: return <BasicInfoSection project={project} />;
    }
  };

  const titles = {
    'basic-info': 'Basic Info', 'property-profile': 'Property Profile', 'contacts': 'Contacts', 'tasks': 'Tasks',
    'deal-analysis': 'Deal Analysis', 'pipeline-tracker': 'Pipeline Tracker', 'due-diligence': 'Due Diligence', 'legal': 'Legal',
    'plans-permits': 'Plans & Permits', 'schedule': 'Schedule', 'budget': 'Budget', 'draws': 'Draws',
    'purchase-orders': 'Purchase Orders', 'inspections': 'Inspections', 'warranty': 'Warranty',
    'sales': 'Sales & Offers', 'sales-contracts': 'Sales Contracts', 'closing': 'Closing',
    'loans': 'Loans', 'proforma': 'Pro Forma', 'actuals': 'Actuals vs Budget', 'expenses': 'Expenses', 'revenue': 'Revenue',
    'investors-list': 'Investors', 'investments': 'Investments', 'distributions': 'Distributions',
    'all-documents': 'Documents', 'communications': 'Communications', 'email': 'Email'
  };

  return (
    <>
      <Helmet><title>{project.name} - {titles[subsection] || 'Overview'} | AtlasDev</title></Helmet>
      <div className="flex flex-col h-full bg-[#F7FAFC]"><div className="flex-1 overflow-y-auto p-6">{renderContent()}</div></div>
    </>
  );
};

export default ProjectDetailPage;
