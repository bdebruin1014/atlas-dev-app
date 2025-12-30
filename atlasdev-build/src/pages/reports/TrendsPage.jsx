import React, { useState } from 'react';
import { 
  TrendingUp, Calendar, X
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const TrendsPage = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [dateRange, setDateRange] = useState({ from: '2025-01-01', to: '2025-12-28' });
  const [chartView, setChartView] = useState('auto');

  const tabs = [
    { id: 'revenue', label: 'Revenue' },
    { id: 'volume', label: 'Project Volume' },
    { id: 'source', label: 'Source of Business' },
  ];

  const summaryData = {
    revenue: {
      totalRevenue: 542371.23,
      revPerPurchase: 1355.49,
      revPerRefinance: 777.39,
      revPerAssignment: 1292.11,
      revPerConstruction: 1340.80,
      revPerCommercial: 4803.85,
      revPerCommRefin: 4086.09,
      revPerSale: 905.88,
    }
  };

  const chartData = [
    { month: 'Jan', heloc: 5000, purchase: 45000, assignment: 12000, refinance: 8000, commercialRefinance: 3000, commercialPurchase: 25000, sale: 5000 },
    { month: 'Feb', heloc: 6000, purchase: 55000, assignment: 15000, refinance: 10000, commercialRefinance: 4000, commercialPurchase: 8000, sale: 6000 },
    { month: 'Mar', heloc: 4000, purchase: 48000, assignment: 18000, refinance: 12000, commercialRefinance: 2000, commercialPurchase: 5000, sale: 4000 },
    { month: 'Apr', heloc: 3000, purchase: 35000, assignment: 8000, refinance: 5000, commercialRefinance: 1000, commercialPurchase: 3000, sale: 2000 },
    { month: 'May', heloc: 5500, purchase: 52000, assignment: 14000, refinance: 9000, commercialRefinance: 3500, commercialPurchase: 15000, sale: 5500 },
    { month: 'Jun', heloc: 7000, purchase: 60000, assignment: 16000, refinance: 11000, commercialRefinance: 5000, commercialPurchase: 20000, sale: 7000 },
    { month: 'Jul', heloc: 8000, purchase: 70000, assignment: 20000, refinance: 14000, commercialRefinance: 6000, commercialPurchase: 30000, sale: 8000 },
  ];

  const legendItems = [
    { label: 'HELOC', color: 'bg-green-300' },
    { label: 'Purchase', color: 'bg-blue-300' },
    { label: 'Assignment', color: 'bg-red-300' },
    { label: 'Refinance', color: 'bg-purple-300' },
    { label: 'Commercial Refinance', color: 'bg-blue-400' },
    { label: 'Commercial Purchase', color: 'bg-orange-300' },
    { label: 'Sale', color: 'bg-green-400' },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const maxValue = 100000;
  const yAxisLabels = [100000, 90000, 80000, 70000, 60000, 50000, 40000];

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-gray-500" />
        <h1 className="text-lg font-semibold text-gray-900">Trends</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs rounded ${
              activeTab === tab.id
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Range Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-[#047857] font-medium">Project Revenue</span>
            <span className="text-sm text-gray-600">from</span>
            <span className="text-sm font-medium">Custom Date Range</span>
            <button className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <Input 
            type="date" 
            value={dateRange.from}
            onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
            className="h-8 text-sm w-36"
          />
          <Input 
            type="date" 
            value={dateRange.to}
            onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
            className="h-8 text-sm w-36"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bg-[#f8f9fa] rounded-lg p-6 mb-6">
        <div className="grid grid-cols-3 gap-6 text-center mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryData.revenue.totalRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Rev. Per Purchase</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryData.revenue.revPerPurchase)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Rev. Per Refinance</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryData.revenue.revPerRefinance)}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Rev. Per Assignment</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(summaryData.revenue.revPerAssignment)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Rev. Per Construction</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(summaryData.revenue.revPerConstruction)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Rev. Per Commercial Purchase</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(summaryData.revenue.revPerCommercial)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Rev. Per Sale</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(summaryData.revenue.revPerSale)}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Revenue By Transaction Type</span>
          </div>
          <div className="flex gap-1 border border-gray-200 rounded overflow-hidden">
            {['Auto', 'Month', 'Week', 'Day'].map((view) => (
              <button
                key={view}
                onClick={() => setChartView(view.toLowerCase())}
                className={`px-3 py-1 text-xs ${
                  chartView === view.toLowerCase()
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <span className={`w-3 h-3 ${item.color}`}></span>
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Simple Bar Chart Visualization */}
        <div className="h-64 flex items-end justify-between gap-2 border-l border-b border-gray-200 pl-12 pb-6 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-500">
            {yAxisLabels.map((label) => (
              <span key={label}>${(label / 1000).toFixed(0)},000</span>
            ))}
          </div>
          
          {/* Bars */}
          {chartData.map((data, index) => {
            const total = data.heloc + data.purchase + data.assignment + data.refinance + 
                         data.commercialRefinance + data.commercialPurchase + data.sale;
            const heightPercent = (total / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full max-w-12 flex flex-col-reverse"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="bg-green-300" style={{ height: `${(data.heloc / total) * 100}%` }}></div>
                  <div className="bg-blue-300" style={{ height: `${(data.purchase / total) * 100}%` }}></div>
                  <div className="bg-red-300" style={{ height: `${(data.assignment / total) * 100}%` }}></div>
                  <div className="bg-purple-300" style={{ height: `${(data.refinance / total) * 100}%` }}></div>
                  <div className="bg-blue-400" style={{ height: `${(data.commercialRefinance / total) * 100}%` }}></div>
                  <div className="bg-orange-300" style={{ height: `${(data.commercialPurchase / total) * 100}%` }}></div>
                  <div className="bg-green-400" style={{ height: `${(data.sale / total) * 100}%` }}></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;
