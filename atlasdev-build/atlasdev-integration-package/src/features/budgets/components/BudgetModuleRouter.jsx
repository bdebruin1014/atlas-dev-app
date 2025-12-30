// AtlasDev - Budget Module Router
import React, { useState } from 'react';
import IndividualSpecHomeBudget from './IndividualSpecHomeBudget';
import PipelineDealAnalyzer from './PipelineDealAnalyzer';

const budgetTools = [
  { id: 'pipeline_analyzer', name: 'Deal Analyzer', description: 'Analyze potential deals with full proforma, ROI, and profit projections', module: 'Pipeline', icon: '📊', color: 'bg-slate-600' },
  { id: 'spec_home', name: 'Individual Spec Home', description: 'Single home construction budget with line-item costs and profit analysis', module: 'Construction', icon: '🏠', color: 'bg-emerald-600' },
];

export const BudgetModuleRouter = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  const renderTool = () => {
    switch (selectedTool) {
      case 'pipeline_analyzer': return <PipelineDealAnalyzer />;
      case 'spec_home': return <IndividualSpecHomeBudget />;
      default: return null;
    }
  };

  if (!selectedTool) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">AtlasDev Budget Tools</h1>
            <p className="text-slate-600">Select a budget tool to get started</p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-slate-500 rounded-full"></span>
              Pipeline Module
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgetTools.filter(tool => tool.module === 'Pipeline').map(tool => (
                <button key={tool.id} onClick={() => setSelectedTool(tool.id)}
                  className="bg-white rounded-xl border border-slate-200 p-6 text-left hover:border-slate-400 hover:shadow-lg transition-all group">
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>{tool.icon}</div>
                  <h3 className="font-semibold text-slate-800 mb-2">{tool.name}</h3>
                  <p className="text-sm text-slate-500">{tool.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              Construction Module
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgetTools.filter(tool => tool.module === 'Construction').map(tool => (
                <button key={tool.id} onClick={() => setSelectedTool(tool.id)}
                  className="bg-white rounded-xl border border-slate-200 p-6 text-left hover:border-slate-400 hover:shadow-lg transition-all group">
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>{tool.icon}</div>
                  <h3 className="font-semibold text-slate-800 mb-2">{tool.name}</h3>
                  <p className="text-sm text-slate-500">{tool.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-16 left-4 z-40">
        <button onClick={() => setSelectedTool(null)}
          className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Budget Tools
        </button>
      </div>
      {renderTool()}
    </div>
  );
};

export default BudgetModuleRouter;
