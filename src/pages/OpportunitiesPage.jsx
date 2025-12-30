import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const OpportunitiesPage = () => {
  const navigate = useNavigate();
  const [activeStage, setActiveStage] = useState('all');

  const stages = [
    { id: 'all', label: 'All Opportunities', count: 8 },
    { id: 'prospecting', label: 'Prospecting', count: 3, color: '#6b7280' },
    { id: 'underwriting', label: 'Underwriting', count: 2, color: '#3b82f6' },
    { id: 'loi', label: 'LOI', count: 2, color: '#f59e0b' },
    { id: 'due-diligence', label: 'Due Diligence', count: 1, color: '#047857' },
    { id: 'closed', label: 'Closed', count: 0, color: '#10b981' },
    { id: 'dead', label: 'Dead', count: 0, color: '#ef4444' },
  ];

  const opportunities = [
    { id: 1, name: 'Pine Valley Acres', address: '450 Pine Valley Rd, Greenville, SC', type: 'Land', acres: 12.5, price: 850000, stage: 'prospecting', daysInStage: 5, source: 'Broker' },
    { id: 2, name: 'Riverside Commons', address: '200 River St, Spartanburg, SC', type: 'Multifamily', units: 24, price: 3200000, stage: 'prospecting', daysInStage: 12, source: 'Off-Market' },
    { id: 3, name: 'Oak Street Portfolio', address: '100-120 Oak St, Anderson, SC', type: 'Mixed Use', sqft: 45000, price: 5500000, stage: 'prospecting', daysInStage: 3, source: 'Auction' },
    { id: 4, name: 'Magnolia Heights', address: '800 Magnolia Ave, Greenville, SC', type: 'Land', acres: 8.2, price: 1200000, stage: 'underwriting', daysInStage: 8, source: 'Broker' },
    { id: 5, name: 'Downtown Lofts', address: '50 Main St, Greenville, SC', type: 'Multifamily', units: 36, price: 6800000, stage: 'underwriting', daysInStage: 14, source: 'Direct' },
    { id: 6, name: 'Westgate Industrial', address: '1200 Industrial Blvd, Greer, SC', type: 'Industrial', sqft: 125000, price: 8900000, stage: 'loi', daysInStage: 6, source: 'Broker' },
    { id: 7, name: 'Creekside Retail', address: '300 Creek Rd, Simpsonville, SC', type: 'Retail', sqft: 32000, price: 4200000, stage: 'loi', daysInStage: 10, source: 'Off-Market' },
    { id: 8, name: 'Heritage Park', address: '600 Heritage Way, Mauldin, SC', type: 'Land', acres: 25, price: 2100000, stage: 'due-diligence', daysInStage: 21, source: 'Direct' },
  ];

  const filteredOpps = activeStage === 'all' ? opportunities : opportunities.filter(o => o.stage === activeStage);

  const formatPrice = (price) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    return `$${(price / 1000).toFixed(0)}K`;
  };

  return (
    <div className="flex h-[calc(100vh-40px)] bg-gray-50">
      <div className="w-52 bg-[#1e2a3a] flex-shrink-0 overflow-y-auto">
        <div className="p-3 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-white">Pipeline Stages</h2>
        </div>
        <nav className="p-2">
          {stages.map((stage) => (
            <button key={stage.id} onClick={() => setActiveStage(stage.id)} className={cn("w-full flex items-center justify-between px-3 py-2 text-xs rounded transition-colors mb-1", activeStage === stage.id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5")}>
              <div className="flex items-center gap-2">
                {stage.color && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />}
                {stage.label}
              </div>
              <span className="text-gray-500">{stage.count}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-700 mt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Pipeline Value</h3>
          <p className="text-xl font-semibold text-white">$32.75M</p>
          <p className="text-xs text-gray-500">8 opportunities</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search opportunities..." className="pl-9 w-72 h-9 text-sm" />
            </div>
            <Button variant="outline" size="sm" className="h-9"><Filter className="w-4 h-4 mr-1" />Filter</Button>
          </div>
          <Button className="bg-[#047857] hover:bg-[#065f46] h-9"><Plus className="w-4 h-4 mr-1" />New Opportunity</Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-3">
            {filteredOpps.map((opp) => {
              const stage = stages.find(s => s.id === opp.stage);
              return (
                <div 
                  key={opp.id} 
                  onClick={() => navigate(`/opportunity/${opp.id}`)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-[#047857]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{opp.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: stage.color + '20', color: stage.color }}>{stage.label}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />{opp.address}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded">{opp.type}</span>
                          {opp.acres && <span>{opp.acres} acres</span>}
                          {opp.units && <span>{opp.units} units</span>}
                          {opp.sqft && <span>{opp.sqft.toLocaleString()} SF</span>}
                          <span>Source: {opp.source}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{formatPrice(opp.price)}</p>
                      <p className="text-xs text-gray-500">{opp.daysInStage} days in stage</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-56 bg-white border-l border-gray-200 flex-shrink-0 p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">Stage Summary</h3>
        <div className="space-y-3">
          {stages.filter(s => s.id !== 'all').map((stage) => (
            <div key={stage.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-sm text-gray-600">{stage.label}</span>
              </div>
              <span className="text-sm font-medium">{stage.count}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Avg Deal Size</span><span className="font-medium">$4.1M</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Avg Days to Close</span><span className="font-medium">45</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Win Rate</span><span className="font-medium">32%</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPage;
