import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, ChevronDown, FileText, Building2, Users, DollarSign, FolderOpen, ClipboardList, MapPin, Calendar, MoreHorizontal, Calculator, TrendingUp, Target, Phone, Mail, Globe, Landmark, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import Deal Analyzer
import PipelineDealAnalyzer from '@/features/budgets/components/PipelineDealAnalyzer';

const OpportunityDetailPage = () => {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedGroups, setExpandedGroups] = useState(['pipeline', 'property', 'analysis', 'documents']);

  const stages = [
    { id: 'prospect', label: 'Prospect', color: '#6B7280' },
    { id: 'initial-review', label: 'Initial Review', color: '#3B82F6' },
    { id: 'due-diligence', label: 'Due Diligence', color: '#F59E0B' },
    { id: 'negotiation', label: 'Negotiation', color: '#8B5CF6' },
    { id: 'under-contract', label: 'Under Contract', color: '#10B981' },
    { id: 'closed-won', label: 'Closed Won', color: '#047857' },
    { id: 'closed-lost', label: 'Closed Lost', color: '#EF4444' },
  ];

  const opportunity = {
    id: opportunityId,
    name: 'Riverside Development Site',
    type: 'Land Acquisition',
    stage: 'due-diligence',
    acres: '12.5',
    askingPrice: 1250000,
    address: '450 River Road',
    city: 'Greenville',
    state: 'SC',
    zip: '29601',
    county: 'Greenville',
    parcelId: '0456-78-90-1234',
    zoning: 'R-3 Residential',
    potentialUnits: 45,
    source: 'Broker Referral',
    broker: 'Mike Thompson',
    brokerCompany: 'Thompson Realty',
    brokerPhone: '(864) 555-0199',
    brokerEmail: 'mike@thompsonrealty.com',
    seller: 'Estate of James Wilson',
    sellerAttorney: 'Smith & Associates',
    notes: 'Prime riverfront location. Seller motivated due to estate settlement. Adjacent to new retail development.',
    ddDeadline: '2025-01-15',
    closeDate: '2025-02-28',
  };

  const sidebarGroups = [
    {
      id: 'pipeline',
      label: 'Pipeline',
      items: [
        { id: 'overview', label: 'Overview', icon: FileText },
        { id: 'stage-tracker', label: 'Stage Tracker', icon: Target },
        { id: 'deal-analyzer', label: 'Deal Analyzer', icon: Calculator },
        { id: 'tasks', label: 'Tasks & Checklist', icon: ClipboardList },
        { id: 'timeline', label: 'Timeline', icon: Calendar },
      ]
    },
    {
      id: 'property',
      label: 'Property',
      items: [
        { id: 'property-details', label: 'Property Details', icon: MapPin },
        { id: 'contacts', label: 'Contacts', icon: Users },
        { id: 'comps', label: 'Comparables', icon: TrendingUp },
      ]
    },
    {
      id: 'analysis',
      label: 'Analysis',
      items: [
        { id: 'financials', label: 'Financial Summary', icon: DollarSign },
        { id: 'feasibility', label: 'Feasibility Study', icon: ClipboardList },
      ]
    },
    {
      id: 'documents',
      label: 'Documents',
      items: [
        { id: 'files', label: 'Files', icon: FolderOpen },
        { id: 'contracts', label: 'Contracts', icon: FileText },
      ]
    },
  ];

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Key Metrics */}
              <div className="col-span-3 grid grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Asking Price</p>
                  <p className="text-2xl font-semibold">${(opportunity.askingPrice / 1000000).toFixed(2)}M</p>
                  <p className="text-xs text-gray-500">${(opportunity.askingPrice / opportunity.acres).toLocaleString()}/acre</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Potential Units</p>
                  <p className="text-2xl font-semibold">{opportunity.potentialUnits}</p>
                  <p className="text-xs text-gray-500">{(opportunity.acres / opportunity.potentialUnits * 43560).toFixed(0)} SF/lot</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">DD Deadline</p>
                  <p className="text-2xl font-semibold">Jan 15</p>
                  <p className="text-xs text-amber-600">18 days remaining</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-sm text-gray-500">Target Close</p>
                  <p className="text-2xl font-semibold">Feb 28</p>
                  <p className="text-xs text-gray-500">2025</p>
                </div>
              </div>

              {/* Property Info */}
              <div className="col-span-2 bg-white border rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Property Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Address</p><p className="font-medium">{opportunity.address}</p></div>
                  <div><p className="text-xs text-gray-500">City, State</p><p className="font-medium">{opportunity.city}, {opportunity.state} {opportunity.zip}</p></div>
                  <div><p className="text-xs text-gray-500">County</p><p className="font-medium">{opportunity.county}</p></div>
                  <div><p className="text-xs text-gray-500">Parcel ID</p><p className="font-medium">{opportunity.parcelId}</p></div>
                  <div><p className="text-xs text-gray-500">Acreage</p><p className="font-medium">{opportunity.acres} acres</p></div>
                  <div><p className="text-xs text-gray-500">Zoning</p><p className="font-medium">{opportunity.zoning}</p></div>
                </div>
                <div className="mt-4 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400"><MapPin className="w-8 h-8 mx-auto mb-2" /><span className="text-sm">Map View</span></div>
                </div>
              </div>

              {/* Broker/Seller */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Key Contacts</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Listing Broker</p>
                    <p className="font-medium">{opportunity.broker}</p>
                    <p className="text-sm text-gray-500">{opportunity.brokerCompany}</p>
                    <div className="flex gap-2 mt-2">
                      <a href={`tel:${opportunity.brokerPhone}`} className="text-xs text-[#047857] flex items-center gap-1"><Phone className="w-3 h-3" />{opportunity.brokerPhone}</a>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Seller</p>
                    <p className="font-medium">{opportunity.seller}</p>
                    <p className="text-sm text-gray-500">Attorney: {opportunity.sellerAttorney}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="col-span-3 bg-white border rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{opportunity.notes}</p>
              </div>
            </div>
          </div>
        );

      case 'deal-analyzer':
        return (
          <div className="h-full">
            <PipelineDealAnalyzer />
          </div>
        );

      case 'stage-tracker':
        return (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Stage Tracker</h2>
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-8">
                {stages.slice(0, -1).map((stage, index) => {
                  const isActive = stage.id === opportunity.stage;
                  const isPast = stages.findIndex(s => s.id === opportunity.stage) > index;
                  return (
                    <React.Fragment key={stage.id}>
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                          isPast ? "bg-[#047857]" : isActive ? "bg-amber-500" : "bg-gray-300"
                        )}>
                          {isPast ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                        </div>
                        <p className={cn("text-xs mt-2 text-center", isActive ? "font-semibold text-gray-900" : "text-gray-500")}>{stage.label}</p>
                      </div>
                      {index < stages.length - 2 && (
                        <div className={cn("flex-1 h-1 mx-2", isPast ? "bg-[#047857]" : "bg-gray-200")} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Current Stage: Due Diligence</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-700 mb-2"><Clock className="w-4 h-4" /><span className="font-medium">DD Deadline</span></div>
                    <p className="text-lg font-semibold">January 15, 2025</p>
                    <p className="text-sm text-amber-600">18 days remaining</p>
                  </div>
                  <div className="p-4 bg-gray-50 border rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 mb-2"><Target className="w-4 h-4" /><span className="font-medium">Next Milestone</span></div>
                    <p className="text-lg font-semibold">Environmental Report</p>
                    <p className="text-sm text-gray-500">Due: Jan 10, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'financials':
        return (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-500">Land Cost</p>
                <p className="text-2xl font-semibold">$1,250,000</p>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-500">Est. Development Cost</p>
                <p className="text-2xl font-semibold">$8,500,000</p>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <p className="text-sm text-gray-500">Est. Total Project</p>
                <p className="text-2xl font-semibold">$9,750,000</p>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-medium mb-4">Preliminary Pro Forma</h3>
              <p className="text-gray-500 text-sm">Use the Deal Analyzer for detailed proforma analysis.</p>
              <Button className="mt-4 bg-[#047857] hover:bg-[#065f46]" onClick={() => setActiveSection('deal-analyzer')}>
                <Calculator className="w-4 h-4 mr-2" />Open Deal Analyzer
              </Button>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contacts</h2>
              <Button className="bg-[#047857] hover:bg-[#065f46]">Add Contact</Button>
            </div>
            <div className="bg-white border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Role</th>
                    <th className="text-left px-4 py-3 font-medium">Company</th>
                    <th className="text-left px-4 py-3 font-medium">Phone</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-[#047857] font-medium">{opportunity.broker}</td>
                    <td className="px-4 py-3">Listing Broker</td>
                    <td className="px-4 py-3">{opportunity.brokerCompany}</td>
                    <td className="px-4 py-3">{opportunity.brokerPhone}</td>
                    <td className="px-4 py-3">{opportunity.brokerEmail}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-[#047857] font-medium">James Wilson Estate</td>
                    <td className="px-4 py-3">Seller</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-[#047857] font-medium">Robert Smith</td>
                    <td className="px-4 py-3">Seller Attorney</td>
                    <td className="px-4 py-3">Smith & Associates</td>
                    <td className="px-4 py-3">(864) 555-0200</td>
                    <td className="px-4 py-3">rsmith@smithlaw.com</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tasks & Checklist</h2>
              <Button className="bg-[#047857] hover:bg-[#065f46]">Add Task</Button>
            </div>
            <div className="space-y-3">
              {[
                { task: 'Order Phase I Environmental', status: 'complete', due: 'Dec 20' },
                { task: 'Review title commitment', status: 'complete', due: 'Dec 22' },
                { task: 'Survey ordered', status: 'in-progress', due: 'Jan 5' },
                { task: 'Geotechnical study', status: 'in-progress', due: 'Jan 8' },
                { task: 'Traffic impact analysis', status: 'pending', due: 'Jan 10' },
                { task: 'Utility availability letters', status: 'pending', due: 'Jan 12' },
                { task: 'Preliminary site plan', status: 'pending', due: 'Jan 14' },
              ].map((item, i) => (
                <div key={i} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      item.status === 'complete' ? "bg-green-100" : item.status === 'in-progress' ? "bg-blue-100" : "bg-gray-100"
                    )}>
                      {item.status === 'complete' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : 
                       item.status === 'in-progress' ? <Clock className="w-4 h-4 text-blue-600" /> :
                       <AlertCircle className="w-4 h-4 text-gray-400" />}
                    </div>
                    <span className={item.status === 'complete' ? 'line-through text-gray-400' : ''}>{item.task}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.due}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="bg-white border rounded-lg p-12 text-center">
              <p className="text-gray-500 capitalize">{activeSection.replace('-', ' ')} - Coming Soon</p>
            </div>
          </div>
        );
    }
  };

  const currentStage = stages.find(s => s.id === opportunity.stage);

  return (
    <div className="flex h-[calc(100vh-40px)] bg-gray-50">
      {/* Dark Sidebar */}
      <div className="w-52 bg-[#1e2a3a] flex-shrink-0 flex flex-col">
        <div className="p-3 border-b border-gray-700">
          <button onClick={() => navigate('/opportunities')} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-2">
            <ArrowLeft className="w-3 h-3" /> Back to Pipeline
          </button>
          <h2 className="text-white font-semibold truncate">{opportunity.name}</h2>
          <p className="text-gray-500 text-xs">{opportunity.type} • {opportunity.acres} acres</p>
        </div>
        
        <nav className="flex-1 p-2 overflow-y-auto">
          {sidebarGroups.map((group) => (
            <div key={group.id} className="mb-2">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-400 hover:text-white"
              >
                {group.label}
                <ChevronDown className={cn("w-4 h-4 transition-transform", expandedGroups.includes(group.id) ? "" : "-rotate-90")} />
              </button>
              {expandedGroups.includes(group.id) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 text-xs rounded transition-colors",
                          activeSection === item.id 
                            ? "bg-white/10 text-white" 
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <IconComponent className="w-4 h-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#047857]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{opportunity.name}</h1>
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: currentStage.color + '20', color: currentStage.color }}>
                  {currentStage.label}
                </span>
              </div>
              <p className="text-sm text-gray-500">{opportunity.address}, {opportunity.city}, {opportunity.state}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline"><Edit2 className="w-4 h-4 mr-1" />Edit</Button>
            <Button className="bg-[#047857] hover:bg-[#065f46]">Advance Stage</Button>
            <Button variant="outline"><MoreHorizontal className="w-4 h-4" /></Button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
