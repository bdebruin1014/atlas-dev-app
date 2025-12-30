import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Target, MapPin, Calendar, DollarSign, Users, FileText, Plus, 
  Edit, Trash2, Download, Upload, Eye, CheckCircle, Clock, AlertTriangle,
  Camera, Mail, MessageSquare, Phone, ExternalLink, MoreHorizontal,
  TrendingUp, TrendingDown, Percent, Calculator, Send, CheckSquare, X
} from 'lucide-react';

// Mock Data
const mockOpportunity = {
  id: 1,
  name: 'Riverside Commons',
  code: 'OPP-001',
  address: '5678 Riverside Drive',
  city: 'Aurora',
  state: 'CO',
  zip: '80012',
  status: 'analysis',
  type: 'Multifamily',
  subtype: '20+ Units',
  askingPrice: 2500000,
  offerPrice: 2200000,
  estimatedValue: 2800000,
  lotSize: 1.2,
  buildingSF: 0,
  units: 0,
  zoning: 'R-4',
  source: 'Broker - CBRE',
  broker: 'Mike Johnson',
  brokerPhone: '(303) 555-1234',
  brokerEmail: 'mike.johnson@cbre.com',
  dateAdded: '2024-10-15',
  description: 'Prime development site with approved plans for 28-unit multifamily project.',
};

const mockComparables = [
  { id: 1, address: '123 Oak Street', city: 'Aurora', salePrice: 2100000, pricePerSF: 185, saleDate: '2024-08-15', type: 'Multifamily' },
  { id: 2, address: '456 Pine Ave', city: 'Denver', salePrice: 2650000, pricePerSF: 195, saleDate: '2024-07-20', type: 'Multifamily' },
  { id: 3, address: '789 Elm Road', city: 'Aurora', salePrice: 1950000, pricePerSF: 172, saleDate: '2024-06-10', type: 'Multifamily' },
];

const mockOffers = [
  { id: 1, date: '2024-10-20', amount: 2000000, status: 'rejected', notes: 'Initial offer, seller countered at $2.4M' },
  { id: 2, date: '2024-10-25', amount: 2150000, status: 'rejected', notes: 'Second offer, seller countered at $2.35M' },
  { id: 3, date: '2024-10-30', amount: 2200000, status: 'pending', notes: 'Current offer, awaiting response' },
];

const mockChecklist = [
  { id: 1, item: 'Title Search', status: 'completed', dueDate: '2024-11-01', assignee: 'Title Co' },
  { id: 2, item: 'Phase I Environmental', status: 'in_progress', dueDate: '2024-11-15', assignee: 'EHS Inc' },
  { id: 3, item: 'Survey', status: 'completed', dueDate: '2024-11-05', assignee: 'ABC Surveying' },
  { id: 4, item: 'Zoning Verification', status: 'not_started', dueDate: '2024-11-20', assignee: 'Bryan V.' },
  { id: 5, item: 'Appraisal', status: 'not_started', dueDate: '2024-11-25', assignee: 'TBD' },
];

const mockDocuments = [
  { id: 1, name: 'Property Information Package.pdf', category: 'Marketing', size: '4.2 MB', date: '2024-10-15' },
  { id: 2, name: 'Site Survey.pdf', category: 'Due Diligence', size: '2.8 MB', date: '2024-10-28' },
  { id: 3, name: 'Title Report.pdf', category: 'Legal', size: '1.5 MB', date: '2024-11-01' },
];

// Section Components
const BasicInfoSection = ({ opportunity }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Basic Information</h1>
      <Button><Edit className="w-4 h-4 mr-2" />Edit</Button>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="text-lg">Opportunity Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-gray-500">Name</Label><p className="font-medium">{opportunity.name}</p></div>
            <div><Label className="text-gray-500">Code</Label><p className="font-medium">{opportunity.code}</p></div>
            <div><Label className="text-gray-500">Property Type</Label><p className="font-medium">{opportunity.type}</p></div>
            <div><Label className="text-gray-500">Subtype</Label><p className="font-medium">{opportunity.subtype}</p></div>
            <div><Label className="text-gray-500">Status</Label><Badge className="bg-blue-500">{opportunity.status}</Badge></div>
            <div><Label className="text-gray-500">Date Added</Label><p className="font-medium">{opportunity.dateAdded}</p></div>
          </div>
          <div><Label className="text-gray-500">Description</Label><p className="text-gray-700">{opportunity.description}</p></div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle className="text-lg">Source & Contact</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-gray-500">Source</Label><p className="font-medium">{opportunity.source}</p></div>
            <div><Label className="text-gray-500">Broker</Label><p className="font-medium">{opportunity.broker}</p></div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Phone className="w-4 h-4 mr-2" />{opportunity.brokerPhone}</Button>
            <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-2" />Email</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle className="text-lg">Financial Overview</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-gray-500">Asking Price</Label><p className="font-medium text-lg">${opportunity.askingPrice.toLocaleString()}</p></div>
            <div><Label className="text-gray-500">Our Offer</Label><p className="font-medium text-lg text-blue-600">${opportunity.offerPrice.toLocaleString()}</p></div>
            <div><Label className="text-gray-500">Estimated Value</Label><p className="font-medium text-lg text-emerald-600">${opportunity.estimatedValue.toLocaleString()}</p></div>
            <div><Label className="text-gray-500">Spread</Label><p className="font-medium text-lg">{((opportunity.estimatedValue - opportunity.offerPrice) / opportunity.offerPrice * 100).toFixed(1)}%</p></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle className="text-lg">Property Info</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-gray-500">Lot Size</Label><p className="font-medium">{opportunity.lotSize} acres</p></div>
            <div><Label className="text-gray-500">Zoning</Label><p className="font-medium">{opportunity.zoning}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const PropertyDetailsSection = ({ opportunity }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Property Details</h1>
      <Button><Edit className="w-4 h-4 mr-2" />Edit</Button>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Physical Characteristics</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between"><span className="text-gray-500">Lot Size</span><span className="font-medium">{opportunity.lotSize} acres</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Existing SF</span><span className="font-medium">{opportunity.buildingSF || 'Vacant Land'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Existing Units</span><span className="font-medium">{opportunity.units || 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Topography</span><span className="font-medium">Generally Flat</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Utilities</span><span className="font-medium">All Available</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Zoning & Entitlements</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between"><span className="text-gray-500">Current Zoning</span><span className="font-medium">{opportunity.zoning}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Density Allowed</span><span className="font-medium">28 units/acre</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Max Height</span><span className="font-medium">55 feet</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Plans Approved</span><Badge className="bg-green-500">Yes</Badge></div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const LocationSection = ({ opportunity }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Location & Maps</h1>
      <Button variant="outline"><ExternalLink className="w-4 h-4 mr-2" />Google Maps</Button>
    </div>
    <Card>
      <CardHeader><CardTitle>Address</CardTitle></CardHeader>
      <CardContent>
        <p className="font-medium">{opportunity.address}</p>
        <p className="text-gray-500">{opportunity.city}, {opportunity.state} {opportunity.zip}</p>
      </CardContent>
    </Card>
    <Card className="h-80">
      <CardContent className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Interactive map view</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const FinancialAnalysisSection = ({ opportunity }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Financial Analysis</h1>
      <Button><Calculator className="w-4 h-4 mr-2" />Run Analysis</Button>
    </div>
    
    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Acquisition Cost</p><p className="text-2xl font-bold">${opportunity.offerPrice.toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Development Cost</p><p className="text-2xl font-bold">$2,850,000</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Investment</p><p className="text-2xl font-bold">$5,050,000</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Est. Sale Value</p><p className="text-2xl font-bold text-emerald-600">$7,200,000</p></CardContent></Card>
    </div>
    
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Returns Analysis</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Gross Profit</span>
            <span className="font-bold text-emerald-600">$2,150,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Profit Margin</span>
            <span className="font-bold">42.6%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">ROI</span>
            <span className="font-bold">143%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">IRR (Est.)</span>
            <span className="font-bold">28.5%</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Sensitivity Analysis</CardTitle></CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Scenario modeling available</p>
          <Button className="mt-4" variant="outline">Run Scenarios</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ComparableSalesSection = ({ comparables }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Comparable Sales</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Add Comp</Button>
    </div>
    
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Sale Price</TableHead>
            <TableHead className="text-right">$/SF</TableHead>
            <TableHead>Sale Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparables.map((comp) => (
            <TableRow key={comp.id}>
              <TableCell className="font-medium">{comp.address}</TableCell>
              <TableCell>{comp.city}</TableCell>
              <TableCell>{comp.type}</TableCell>
              <TableCell className="text-right">${comp.salePrice.toLocaleString()}</TableCell>
              <TableCell className="text-right">${comp.pricePerSF}</TableCell>
              <TableCell>{comp.saleDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

const MarketResearchSection = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Market Research</h1>
      <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export Report</Button>
    </div>
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Market Overview</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between"><span className="text-gray-500">Submarket</span><span className="font-medium">Aurora Central</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Vacancy Rate</span><span className="font-medium">4.2%</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Avg. Rent Growth</span><span className="font-medium text-emerald-600">+5.8% YoY</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Cap Rate</span><span className="font-medium">5.25%</span></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Demographics</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between"><span className="text-gray-500">Population (3mi)</span><span className="font-medium">85,420</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Med. HH Income</span><span className="font-medium">$72,500</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Pop. Growth (5yr)</span><span className="font-medium text-emerald-600">+8.2%</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Avg. Age</span><span className="font-medium">34.5</span></div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const OfferHistorySection = ({ offers }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Offer History</h1>
      <Button><Plus className="w-4 h-4 mr-2" />New Offer</Button>
    </div>
    
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell>{offer.date}</TableCell>
              <TableCell className="text-right font-medium">${offer.amount.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={
                  offer.status === 'accepted' ? 'bg-green-500' :
                  offer.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }>{offer.status}</Badge>
              </TableCell>
              <TableCell className="text-gray-500">{offer.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

const CurrentOfferSection = ({ opportunity }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Current Offer</h1>
      <Button><Edit className="w-4 h-4 mr-2" />Edit Offer</Button>
    </div>
    
    <Card>
      <CardHeader><CardTitle>Offer Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-gray-500">Offer Amount</Label><p className="font-medium text-2xl">${opportunity.offerPrice.toLocaleString()}</p></div>
          <div><Label className="text-gray-500">Asking Price</Label><p className="font-medium text-2xl">${opportunity.askingPrice.toLocaleString()}</p></div>
          <div><Label className="text-gray-500">Discount to Ask</Label><p className="font-medium">{((1 - opportunity.offerPrice / opportunity.askingPrice) * 100).toFixed(1)}%</p></div>
          <div><Label className="text-gray-500">Status</Label><Badge className="bg-yellow-500">Pending</Badge></div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader><CardTitle>Terms & Contingencies</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between"><span className="text-gray-500">Earnest Money</span><span className="font-medium">$50,000</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Due Diligence Period</span><span className="font-medium">45 days</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Financing Contingency</span><span className="font-medium">30 days</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Closing Date</span><span className="font-medium">60 days from acceptance</span></div>
      </CardContent>
    </Card>
  </div>
);

const CounterOffersSection = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <h1 className="text-2xl font-bold text-gray-900">Counter Offers</h1>
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-gray-500">Track seller counter offers and negotiations</p>
        <Button className="mt-4"><Plus className="w-4 h-4 mr-2" />Add Counter Offer</Button>
      </CardContent>
    </Card>
  </div>
);

const DDChecklistSection = ({ checklist }) => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Due Diligence Checklist</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Add Item</Button>
    </div>
    
    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Completed</p><p className="text-2xl font-bold text-green-600">{checklist.filter(i => i.status === 'completed').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">In Progress</p><p className="text-2xl font-bold text-blue-600">{checklist.filter(i => i.status === 'in_progress').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Not Started</p><p className="text-2xl font-bold text-gray-500">{checklist.filter(i => i.status === 'not_started').length}</p></CardContent></Card>
    </div>
    
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checklist.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.item}</TableCell>
              <TableCell>{item.assignee}</TableCell>
              <TableCell>{item.dueDate}</TableCell>
              <TableCell>
                <Badge className={
                  item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                }>{item.status.replace('_', ' ')}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

const InspectionsSection = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Schedule Inspection</Button>
    </div>
    <Card><CardContent className="p-8 text-center text-gray-500">
      <p>No inspections scheduled yet</p>
    </CardContent></Card>
  </div>
);

const EnvironmentalSection = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Environmental</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Order Phase I</Button>
    </div>
    <Card>
      <CardHeader><CardTitle>Phase I Environmental Site Assessment</CardTitle></CardHeader>
      <CardContent>
        <Badge className="bg-blue-500">In Progress</Badge>
        <p className="mt-2 text-gray-500">Expected completion: November 15, 2024</p>
      </CardContent>
    </Card>
  </div>
);

const ZoningSection = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Zoning & Permits</h1>
      <Button variant="outline"><ExternalLink className="w-4 h-4 mr-2" />View Zoning Map</Button>
    </div>
    <Card>
      <CardHeader><CardTitle>Zoning Summary</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between"><span className="text-gray-500">Current Zoning</span><span className="font-medium">R-4</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Use Permitted</span><Badge className="bg-green-500">Yes</Badge></div>
        <div className="flex justify-between"><span className="text-gray-500">Variance Needed</span><Badge variant="outline">No</Badge></div>
      </CardContent>
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
              <TableCell><Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button></TableCell>
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
      {[1,2,3,4].map(i => (
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
        <Textarea placeholder="Add a note about this opportunity..." className="min-h-[100px]" />
        <Button className="mt-2">Save Note</Button>
      </CardContent>
    </Card>
  </div>
);

// Main Component
const OpportunityDetailPage = () => {
  const { opportunityId, module, section } = useParams();
  const currentModule = module || 'overview';
  const currentSection = section || 'basic-info';

  const sectionKey = `${currentModule}/${currentSection}`;
  
  const sectionComponents = {
    'overview/basic-info': <BasicInfoSection opportunity={mockOpportunity} />,
    'overview/property-details': <PropertyDetailsSection opportunity={mockOpportunity} />,
    'overview/location': <LocationSection opportunity={mockOpportunity} />,
    'analysis/financial-analysis': <FinancialAnalysisSection opportunity={mockOpportunity} />,
    'analysis/comparable-sales': <ComparableSalesSection comparables={mockComparables} />,
    'analysis/market-research': <MarketResearchSection />,
    'offers/offer-history': <OfferHistorySection offers={mockOffers} />,
    'offers/current-offer': <CurrentOfferSection opportunity={mockOpportunity} />,
    'offers/counter-offers': <CounterOffersSection />,
    'due-diligence/checklist': <DDChecklistSection checklist={mockChecklist} />,
    'due-diligence/inspections': <InspectionsSection />,
    'due-diligence/environmental': <EnvironmentalSection />,
    'due-diligence/zoning': <ZoningSection />,
    'documents/documents': <DocumentsSection documents={mockDocuments} />,
    'documents/photos': <PhotosSection />,
    'documents/emails': <EmailsSection />,
    'documents/notes': <NotesSection />,
  };

  return sectionComponents[sectionKey] || <BasicInfoSection opportunity={mockOpportunity} />;
};

export default OpportunityDetailPage;
