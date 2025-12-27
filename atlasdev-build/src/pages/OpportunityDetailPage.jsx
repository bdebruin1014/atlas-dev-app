import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Edit, Plus, User, Phone, Mail, FileText, CheckCircle2, Clock, 
  Upload, Download, Calculator, Search, Building2, MapPin, Calendar, 
  DollarSign, Eye, Scale, FolderOpen, Handshake, Video, PhoneCall,
  AlertCircle, Paperclip, Inbox, Send, Star, Archive, SendHorizontal,
  ExternalLink, Check, X
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
import { cn } from '@/lib/utils';

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

const mockOpportunityData = {
  1: {
    id: 1, name: 'Highland Park Mixed-Use', address: '5800 N Figueroa St', city: 'Los Angeles', state: 'CA', zip: '90042',
    county: 'Los Angeles', status: 'qualified', stage: 'Due Diligence', propertyType: 'Mixed-Use',
    askingPrice: 4200000, targetOffer: 3850000, estRehab: 450000, estARV: 5100000,
    createdDate: '2023-10-24', ddExpiration: '2024-02-15', closingDate: '2024-03-01', source: 'Broker Referral',
    sqft: 12500, lotSize: 0.45, yearBuilt: 1965, units: 8, zoning: 'C2-1VL',
    seller: { name: 'John Smith', company: 'Smith Properties LLC', phone: '(555) 123-4567', email: 'john@smithproperties.com' },
    broker: { name: 'Maria Garcia', company: 'Premier Commercial RE', phone: '(555) 234-5678', email: 'maria@premiercommercial.com' },
    notes: 'Motivated seller, property has been on market for 6 months. Good value-add opportunity with below-market rents.',
  },
  2: {
    id: 2, name: 'Riverside Industrial', address: '2100 Commerce Way', city: 'Riverside', state: 'CA', zip: '92507',
    county: 'Riverside', status: 'new', stage: 'Initial Review', propertyType: 'Industrial',
    askingPrice: 2800000, targetOffer: 2500000, estRehab: 200000, estARV: 3200000,
    createdDate: '2024-01-10', source: 'Direct Mail', sqft: 25000, lotSize: 1.2, yearBuilt: 1985, units: 1, zoning: 'M-1',
    seller: { name: 'Robert Chen', company: 'Chen Holdings', phone: '(555) 987-6543', email: 'robert@chenholdings.com' },
    notes: 'Response from direct mail campaign. Owner interested in quick close.',
  },
};

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-800' },
  qualified: { label: 'Qualified', color: 'bg-emerald-100 text-emerald-800' },
  offer_submitted: { label: 'Offer Submitted', color: 'bg-yellow-100 text-yellow-800' },
  under_contract: { label: 'Under Contract', color: 'bg-purple-100 text-purple-800' },
};

// ============================================================================
// OVERVIEW SECTIONS
// ============================================================================
const BasicInfoSection = ({ opportunity }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Opportunity Information</CardTitle>
        <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div><Label className="text-xs uppercase text-gray-500">Opportunity Name</Label><p className="font-medium">{opportunity.name}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Property Type</Label><p className="font-medium">{opportunity.propertyType}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Source</Label><p className="font-medium">{opportunity.source}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Stage</Label><p className="font-medium">{opportunity.stage}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Status</Label><Badge className={statusConfig[opportunity.status]?.color}>{statusConfig[opportunity.status]?.label}</Badge></div>
          <div><Label className="text-xs uppercase text-gray-500">Created Date</Label><p className="font-medium">{formatDate(opportunity.createdDate)}</p></div>
          <div className="col-span-2"><Label className="text-xs uppercase text-gray-500">Notes</Label><p className="text-gray-700">{opportunity.notes}</p></div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><DollarSign className="w-5 h-5" /> Financial Targets</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500 uppercase mb-1">Asking Price</p><p className="text-lg font-bold">{formatCurrency(opportunity.askingPrice)}</p></div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200"><p className="text-xs text-gray-500 uppercase mb-1">Target Offer</p><p className="text-lg font-bold text-emerald-600">{formatCurrency(opportunity.targetOffer)}</p></div>
          <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500 uppercase mb-1">Est. Rehab</p><p className="text-lg font-bold">{formatCurrency(opportunity.estRehab)}</p></div>
          <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500 uppercase mb-1">Est. ARV</p><p className="text-lg font-bold">{formatCurrency(opportunity.estARV)}</p></div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><Calendar className="w-5 h-5" /> Key Dates</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500 uppercase mb-1">Created</p><p className="font-medium">{formatDate(opportunity.createdDate)}</p></div>
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"><p className="text-xs text-gray-500 uppercase mb-1">DD Expiration</p><p className="font-medium">{formatDate(opportunity.ddExpiration)}</p></div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200"><p className="text-xs text-gray-500 uppercase mb-1">Target Close</p><p className="font-medium">{formatDate(opportunity.closingDate)}</p></div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const PropertyProfileSection = ({ opportunity }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Property Details</CardTitle>
        <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2" /> Edit</Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-x-8 gap-y-4">
          <div><Label className="text-xs uppercase text-gray-500">Address</Label><p className="font-medium">{opportunity.address}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">City</Label><p className="font-medium">{opportunity.city}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">State / ZIP</Label><p className="font-medium">{opportunity.state} {opportunity.zip}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">County</Label><p className="font-medium">{opportunity.county}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Zoning</Label><p className="font-medium">{opportunity.zoning}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Property Type</Label><p className="font-medium">{opportunity.propertyType}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Square Footage</Label><p className="font-medium">{opportunity.sqft?.toLocaleString()} SF</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Lot Size</Label><p className="font-medium">{opportunity.lotSize} acres</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Year Built</Label><p className="font-medium">{opportunity.yearBuilt}</p></div>
          <div><Label className="text-xs uppercase text-gray-500">Units</Label><p className="font-medium">{opportunity.units}</p></div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle className="text-base font-semibold">Location</CardTitle></CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500"><MapPin className="w-8 h-8 mx-auto mb-2" /><p>Map Integration</p><p className="text-sm">{opportunity.address}, {opportunity.city}, {opportunity.state}</p></div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const SellerInfoSection = ({ opportunity }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader><CardTitle className="text-base font-semibold">Seller Information</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-gray-500" /></div>
          <div className="flex-1 space-y-3">
            <div><p className="font-semibold text-gray-900">{opportunity.seller?.name}</p><p className="text-sm text-gray-500">{opportunity.seller?.company}</p></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400" /><span>{opportunity.seller?.phone}</span></div>
              <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-400" /><span>{opportunity.seller?.email}</span></div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline"><Phone className="w-4 h-4 mr-2" /> Call</Button>
              <Button size="sm" variant="outline"><Mail className="w-4 h-4 mr-2" /> Email</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    {opportunity.broker && (
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold">Broker / Agent</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-blue-500" /></div>
            <div className="flex-1 space-y-3">
              <div><p className="font-semibold text-gray-900">{opportunity.broker?.name}</p><p className="text-sm text-gray-500">{opportunity.broker?.company}</p></div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400" /><span>{opportunity.broker?.phone}</span></div>
                <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-400" /><span>{opportunity.broker?.email}</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

const TasksSection = ({ opportunity }) => {
  const tasks = [
    { id: 1, title: 'Schedule property tour', status: 'complete', priority: 'high', dueDate: '2024-01-15', assignee: 'John Smith' },
    { id: 2, title: 'Request financials from seller', status: 'complete', priority: 'high', dueDate: '2024-01-18', assignee: 'John Smith' },
    { id: 3, title: 'Run comparable analysis', status: 'in_progress', priority: 'medium', dueDate: '2024-01-25', assignee: 'Sarah Johnson' },
    { id: 4, title: 'Prepare initial offer', status: 'pending', priority: 'high', dueDate: '2024-02-01', assignee: 'John Smith' },
  ];
  const statusColors = { complete: 'bg-green-100 text-green-800', in_progress: 'bg-blue-100 text-blue-800', pending: 'bg-gray-100 text-gray-800' };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Tasks</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Task</Button></div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead className="w-8"></TableHead><TableHead>Task</TableHead><TableHead>Assignee</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {tasks.map(t => (<TableRow key={t.id}><TableCell><Checkbox checked={t.status === 'complete'} /></TableCell><TableCell className={cn(t.status === 'complete' && 'line-through text-gray-400')}>{t.title}</TableCell><TableCell>{t.assignee}</TableCell><TableCell>{formatDate(t.dueDate)}</TableCell><TableCell><Badge className={statusColors[t.status]}>{t.status.replace('_', ' ')}</Badge></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

// ============================================================================
// ANALYSIS SECTION
// ============================================================================
const DealAnalysisSection = ({ opportunity }) => {
  const purchasePrice = opportunity.targetOffer;
  const closingCosts = purchasePrice * 0.02;
  const rehabCost = opportunity.estRehab;
  const holdingCosts = 25000;
  const sellingCosts = opportunity.estARV * 0.06;
  const totalInvestment = purchasePrice + closingCosts + rehabCost + holdingCosts;
  const totalCosts = totalInvestment + sellingCosts;
  const profit = opportunity.estARV - totalCosts;
  const roi = ((profit / totalInvestment) * 100).toFixed(1);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><Calculator className="w-5 h-5" /> Investment Analysis</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Purchase Price</span><span className="font-medium">{formatCurrency(purchasePrice)}</span></div>
            <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Closing Costs (2%)</span><span className="font-medium">{formatCurrency(closingCosts)}</span></div>
            <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Rehab / Renovation</span><span className="font-medium">{formatCurrency(rehabCost)}</span></div>
            <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Holding Costs</span><span className="font-medium">{formatCurrency(holdingCosts)}</span></div>
            <div className="flex justify-between items-center py-2 border-b bg-gray-50 px-2 -mx-2 font-semibold"><span>Total Investment</span><span>{formatCurrency(totalInvestment)}</span></div>
            <div className="flex justify-between items-center py-2 border-b"><span className="text-gray-600">Selling Costs (6%)</span><span className="font-medium">{formatCurrency(sellingCosts)}</span></div>
            <div className="flex justify-between items-center py-2 bg-gray-50 px-2 -mx-2 font-semibold"><span>Total All-In Costs</span><span>{formatCurrency(totalCosts)}</span></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center"><p className="text-xs text-gray-500 uppercase mb-1">ARV</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(opportunity.estARV)}</p></div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center"><p className="text-xs text-gray-500 uppercase mb-1">Est. Profit</p><p className="text-2xl font-bold text-emerald-600">{formatCurrency(profit)}</p></div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center"><p className="text-xs text-gray-500 uppercase mb-1">ROI</p><p className="text-2xl font-bold text-purple-600">{roi}%</p></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold">Key Metrics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center"><p className="text-2xl font-bold">{((purchasePrice / opportunity.estARV) * 100).toFixed(0)}%</p><p className="text-xs text-gray-500 uppercase">LTV</p></div>
            <div className="text-center"><p className="text-2xl font-bold">{formatCurrency(purchasePrice / opportunity.sqft)}</p><p className="text-xs text-gray-500 uppercase">Price/SF</p></div>
            <div className="text-center"><p className="text-2xl font-bold">{formatCurrency(opportunity.estARV / opportunity.sqft)}</p><p className="text-xs text-gray-500 uppercase">ARV/SF</p></div>
            <div className="text-center"><p className="text-2xl font-bold">{((opportunity.estARV - purchasePrice) / purchasePrice * 100).toFixed(0)}%</p><p className="text-xs text-gray-500 uppercase">Spread</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// OFFER SECTION
// ============================================================================
const OfferTrackingSection = ({ opportunity }) => {
  const offers = [
    { id: 1, date: '2024-01-25', amount: 3700000, terms: '30 day close, all cash', status: 'rejected', response: 'Seller countered at $4.0M' },
    { id: 2, date: '2024-01-28', amount: 3850000, terms: '45 day close, financing contingency', status: 'countered', response: 'Seller accepted with 30 day close' },
    { id: 3, date: '2024-02-01', amount: 3850000, terms: '30 day close, financing contingency', status: 'accepted', response: null },
  ];
  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', rejected: 'bg-red-100 text-red-800', countered: 'bg-blue-100 text-blue-800', accepted: 'bg-green-100 text-green-800' };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Offer Tracking</h3>
        <Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Submit Offer</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Asking Price</p><p className="text-xl font-bold">{formatCurrency(opportunity.askingPrice)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Current Offer</p><p className="text-xl font-bold text-emerald-600">{formatCurrency(offers[offers.length - 1]?.amount)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Discount</p><p className="text-xl font-bold text-blue-600">{(((opportunity.askingPrice - offers[offers.length - 1]?.amount) / opportunity.askingPrice) * 100).toFixed(1)}%</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base font-semibold">Offer History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offers.map((offer, idx) => (
              <div key={offer.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={cn("w-4 h-4 rounded-full border-2", offer.status === 'accepted' ? "bg-green-500 border-green-500" : offer.status === 'rejected' ? "bg-red-500 border-red-500" : "bg-blue-500 border-blue-500")} />
                  {idx < offers.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" style={{ minHeight: '60px' }} />}
                </div>
                <Card className="flex-1">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-lg">{formatCurrency(offer.amount)}</p>
                        <p className="text-sm text-gray-500">{formatDate(offer.date)}</p>
                      </div>
                      <Badge className={statusColors[offer.status]}>{offer.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600"><span className="font-medium">Terms:</span> {offer.terms}</p>
                    {offer.response && <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Response:</span> {offer.response}</p>}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// DUE DILIGENCE SECTIONS
// ============================================================================
const DDChecklistSection = ({ opportunity }) => {
  const items = [
    { category: 'Title', item: 'Title Search', status: 'complete', date: '2024-01-10' },
    { category: 'Title', item: 'Survey Review', status: 'in_progress', date: null },
    { category: 'Environmental', item: 'Phase I ESA', status: 'pending', date: null },
    { category: 'Physical', item: 'Property Inspection', status: 'complete', date: '2024-01-08' },
    { category: 'Financial', item: 'Rent Roll Review', status: 'complete', date: '2024-01-05' },
  ];
  const statusColors = { complete: 'bg-green-100 text-green-800', in_progress: 'bg-blue-100 text-blue-800', pending: 'bg-gray-100 text-gray-800' };
  const completeCount = items.filter(i => i.status === 'complete').length;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Due Diligence Checklist</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Item</Button></div>
      <Card><CardContent className="pt-4"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Overall Progress</span><span className="text-sm text-gray-500">{completeCount} of {items.length} complete</span></div><Progress value={(completeCount / items.length) * 100} className="h-2" /></CardContent></Card>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Item</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((i, idx) => (<TableRow key={idx}><TableCell className="text-gray-500">{i.category}</TableCell><TableCell className="font-medium">{i.item}</TableCell><TableCell>{formatDate(i.date)}</TableCell><TableCell><Badge className={statusColors[i.status]}>{i.status.replace('_', ' ')}</Badge></TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

const InspectionsSection = ({ opportunity }) => {
  const inspections = [
    { type: 'General Inspection', inspector: 'ABC Inspections', date: '2024-01-08', status: 'complete', findings: 'Minor roof repairs needed, HVAC functional' },
    { type: 'Structural', inspector: 'Strong Engineering', date: '2024-01-12', status: 'complete', findings: 'Foundation in good condition' },
    { type: 'Environmental', inspector: 'EnviroCheck LLC', date: null, status: 'scheduled', findings: null },
  ];
  const statusColors = { complete: 'bg-green-100 text-green-800', scheduled: 'bg-blue-100 text-blue-800', pending: 'bg-gray-100 text-gray-800' };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Inspections</h3><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Schedule Inspection</Button></div>
      <div className="space-y-4">
        {inspections.map((insp, idx) => (
          <Card key={idx}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{insp.type}</p>
                  <p className="text-sm text-gray-500">{insp.inspector} • {insp.date ? formatDate(insp.date) : 'Not scheduled'}</p>
                </div>
                <Badge className={statusColors[insp.status]}>{insp.status}</Badge>
              </div>
              {insp.findings && <div className="mt-3 p-3 bg-gray-50 rounded text-sm"><p className="text-gray-700"><span className="font-medium">Findings:</span> {insp.findings}</p></div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// DOCUMENTS & COMMUNICATIONS SECTIONS
// ============================================================================
const DocumentsSection = ({ opportunity }) => {
  const docs = [
    { name: 'Property Listing.pdf', category: 'Marketing', size: '3.2 MB', uploadedBy: 'Maria Garcia', date: '2023-10-24' },
    { name: 'Rent Roll.xlsx', category: 'Financial', size: '156 KB', uploadedBy: 'John Smith', date: '2023-11-05' },
    { name: 'Inspection Report.pdf', category: 'Due Diligence', size: '8.5 MB', uploadedBy: 'ABC Inspections', date: '2024-01-08' },
    { name: 'Offer Letter v3.pdf', category: 'Legal', size: '245 KB', uploadedBy: 'John Smith', date: '2024-02-01' },
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

const CommunicationsSection = ({ opportunity }) => {
  const [activeTab, setActiveTab] = useState('all');
  const communications = [
    { id: 1, type: 'call', subject: 'Initial call with seller', participants: ['John Smith', 'John Smith (Seller)'], date: '2023-10-28T10:00:00', duration: '30 min', notes: 'Seller motivated, had property listed for 6 months. Willing to negotiate.', followUp: 'Send LOI' },
    { id: 2, type: 'meeting', subject: 'Property Tour', participants: ['John Smith', 'Maria Garcia'], date: '2023-11-05T14:00:00', duration: '1 hr', platform: 'In-Person', notes: 'Property in good condition. Some deferred maintenance on roof.', followUp: 'Order inspection' },
    { id: 3, type: 'call', subject: 'Offer negotiation', participants: ['John Smith', 'Maria Garcia'], date: '2024-01-28T11:00:00', duration: '20 min', notes: 'Discussed counter offer. Seller will accept $3.85M with 30 day close.', followUp: 'Revise offer' },
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
                      <p className="text-sm text-gray-600 mt-1">With: {c.participants.join(', ')}</p>
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

const EmailSection = ({ opportunity }) => {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const emails = [
    { id: 1, folder: 'inbox', from: 'Maria Garcia <maria@premiercommercial.com>', subject: 'RE: Highland Park - Counter Offer', preview: 'Hi John, the seller has reviewed your offer and is willing to accept at $3.85M with a 30-day close.', date: '2024-01-28T15:30:00', unread: false, attachments: 1 },
    { id: 2, folder: 'inbox', from: 'ABC Inspections <reports@abcinspections.com>', subject: 'Inspection Report - 5800 N Figueroa St', preview: 'Please find attached the completed inspection report for the subject property.', date: '2024-01-08T17:00:00', unread: false, attachments: 1 },
    { id: 3, folder: 'sent', from: 'You', to: 'maria@premiercommercial.com', subject: 'Highland Park - Revised Offer', preview: 'Hi Maria, please find attached our revised offer at $3.85M with a 30-day close and financing contingency.', date: '2024-02-01T09:00:00', attachments: 1 },
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
          <Button variant={activeFolder === 'inbox' ? 'secondary' : 'ghost'} className="w-full justify-start" onClick={() => setActiveFolder('inbox')}><Inbox className="w-4 h-4 mr-2" /> Inbox</Button>
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
const OpportunityDetailPage = () => {
  const { opportunityId, section = 'overview', subsection = 'basic-info' } = useParams();
  const opportunity = mockOpportunityData[opportunityId] || mockOpportunityData[1];

  const renderContent = () => {
    const key = `${section}/${subsection}`;
    switch (key) {
      // Overview
      case 'overview/basic-info': return <BasicInfoSection opportunity={opportunity} />;
      case 'overview/property-profile': return <PropertyProfileSection opportunity={opportunity} />;
      case 'overview/seller-info': return <SellerInfoSection opportunity={opportunity} />;
      case 'overview/tasks': return <TasksSection opportunity={opportunity} />;
      // Analysis
      case 'analysis/deal-analysis': return <DealAnalysisSection opportunity={opportunity} />;
      // Offer
      case 'offer/offer-tracking': return <OfferTrackingSection opportunity={opportunity} />;
      // Due Diligence
      case 'due-diligence/checklist': return <DDChecklistSection opportunity={opportunity} />;
      case 'due-diligence/inspections': return <InspectionsSection opportunity={opportunity} />;
      // Documents
      case 'documents/all-documents': return <DocumentsSection opportunity={opportunity} />;
      case 'documents/communications': return <CommunicationsSection opportunity={opportunity} />;
      case 'documents/email': return <EmailSection opportunity={opportunity} />;
      default: return <BasicInfoSection opportunity={opportunity} />;
    }
  };

  const titles = {
    'basic-info': 'Basic Info', 'property-profile': 'Property Profile', 'seller-info': 'Seller Info', 'tasks': 'Tasks',
    'deal-analysis': 'Deal Analysis', 'offer-tracking': 'Offer Tracking',
    'checklist': 'DD Checklist', 'inspections': 'Inspections',
    'all-documents': 'Documents', 'communications': 'Communications', 'email': 'Email'
  };

  return (
    <>
      <Helmet><title>{opportunity.name} - {titles[subsection] || 'Overview'} | AtlasDev</title></Helmet>
      <div className="flex flex-col h-full bg-[#F7FAFC]"><div className="flex-1 overflow-y-auto p-6">{renderContent()}</div></div>
    </>
  );
};

export default OpportunityDetailPage;
