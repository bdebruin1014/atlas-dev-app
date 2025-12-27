import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  DollarSign, Plus, Filter, Search, Download, 
  ChevronDown, ChevronRight, AlertCircle, CheckCircle2,
  Mail, FileText, Calendar, ArrowUpRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import EditableField from '@/components/EditableField';

const CapitalCallsPage = () => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Mock Data
  const calls = [
    { 
      id: 'CC-101', 
      project: 'Highland Park Lofts', 
      dueDate: '2025-11-15', 
      totalAmount: 2500000, 
      collected: 2500000, 
      status: 'Completed',
      investors: [
        { name: 'Blackstone Capital', amount: 1500000, status: 'Paid', date: 'Nov 10' },
        { name: 'Summit Equity', amount: 1000000, status: 'Paid', date: 'Nov 12' }
      ]
    },
    { 
      id: 'CC-102', 
      project: 'Riverside Commercial', 
      dueDate: '2025-12-20', 
      totalAmount: 5000000, 
      collected: 3200000, 
      status: 'In Progress',
      investors: [
        { name: 'Blackstone Capital', amount: 3000000, status: 'Paid', date: 'Dec 01' },
        { name: 'Oak Ventures', amount: 2000000, status: 'Pending', date: '-' }
      ]
    },
  ];

  const toggleRow = (id) => {
    if (expandedRows.includes(id)) setExpandedRows(expandedRows.filter(r => r !== id));
    else setExpandedRows([...expandedRows, id]);
  };

  return (
    <>
      <Helmet>
        <title>Capital Calls | AtlasDev</title>
      </Helmet>

      <div className="flex flex-col h-full bg-[#EDF2F7] overflow-hidden">
         {/* Header */}
         <div className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center shrink-0">
            <div>
               <h1 className="text-2xl font-bold text-gray-900">Capital Calls</h1>
               <p className="text-sm text-gray-500 mt-1">Manage funding requests and track investor contributions.</p>
            </div>
            <Button onClick={() => setIsWizardOpen(true)} className="bg-[#2F855A] hover:bg-[#276749] text-white shadow-sm">
               <Plus className="w-4 h-4 mr-2" /> New Capital Call
            </Button>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto p-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               {[
                  { label: 'Total Called YTD', val: '$14.2M', color: 'emerald' },
                  { label: 'Outstanding', val: '$1.8M', color: 'orange' },
                  { label: 'Active Calls', val: '2', color: 'blue' },
                  { label: 'Avg Collection Time', val: '12 Days', color: 'purple' },
               ].map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                     <p className="text-xs font-bold text-gray-400 uppercase">{stat.label}</p>
                     <p className={cn("text-2xl font-bold mt-1", `text-${stat.color}-600`)}>{stat.val}</p>
                  </div>
               ))}
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md" placeholder="Search calls..." />
                     </div>
                     <Button variant="outline" size="sm"><Filter className="w-3 h-3 mr-2" /> Filter</Button>
                  </div>
                  <Button variant="ghost" size="sm"><Download className="w-4 h-4 mr-2" /> Reports</Button>
               </div>

               <table className="w-full text-sm text-left">
                  <thead className="bg-white border-b border-gray-200">
                     <tr>
                        <th className="w-10"></th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Call ID</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Project</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Due Date</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs text-right">Total Amount</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs text-right">Collected</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs text-center">Status</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {calls.map(call => (
                        <React.Fragment key={call.id}>
                           <tr className={cn("hover:bg-gray-50 transition-colors cursor-pointer", expandedRows.includes(call.id) && "bg-gray-50")} onClick={() => toggleRow(call.id)}>
                              <td className="pl-4 text-gray-400">
                                 {expandedRows.includes(call.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </td>
                              <td className="px-6 py-4 font-medium text-gray-900">{call.id}</td>
                              <td className="px-6 py-4">{call.project}</td>
                              <td className="px-6 py-4 text-gray-500">{call.dueDate}</td>
                              <td className="px-6 py-4 text-right font-medium">${(call.totalAmount).toLocaleString()}</td>
                              <td className="px-6 py-4 text-right text-emerald-600 font-bold">${(call.collected).toLocaleString()}</td>
                              <td className="px-6 py-4 text-center">
                                 <Badge variant="outline" className={cn(
                                    "bg-gray-50 border-gray-200",
                                    call.status === 'Completed' ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-blue-700 bg-blue-50 border-blue-200"
                                 )}>{call.status}</Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <Button variant="ghost" size="sm">View</Button>
                              </td>
                           </tr>
                           {expandedRows.includes(call.id) && (
                              <tr className="bg-gray-50/50">
                                 <td colSpan="8" className="p-0">
                                    <div className="px-10 py-4 border-y border-gray-100">
                                       <table className="w-full text-xs">
                                          <thead>
                                             <tr className="text-gray-400 border-b border-gray-200">
                                                <th className="py-2 text-left">Investor</th>
                                                <th className="py-2 text-right">Amount</th>
                                                <th className="py-2 text-right">Date Paid</th>
                                                <th className="py-2 text-center">Status</th>
                                                <th className="py-2 text-right">Actions</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {call.investors.map((inv, idx) => (
                                                <tr key={idx} className="border-b border-gray-100 last:border-0">
                                                   <td className="py-3 font-medium text-gray-700">{inv.name}</td>
                                                   <td className="py-3 text-right">${inv.amount.toLocaleString()}</td>
                                                   <td className="py-3 text-right text-gray-500">{inv.date}</td>
                                                   <td className="py-3 text-center">
                                                      <Badge variant="secondary" className={cn("text-[10px] font-normal", inv.status === 'Paid' ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700")}>
                                                         {inv.status}
                                                      </Badge>
                                                   </td>
                                                   <td className="py-3 text-right">
                                                      {inv.status === 'Pending' && (
                                                         <Button size="sm" variant="ghost" className="h-6 text-emerald-600 hover:text-emerald-700">Record Payment</Button>
                                                      )}
                                                   </td>
                                                </tr>
                                             ))}
                                          </tbody>
                                       </table>
                                    </div>
                                 </td>
                              </tr>
                           )}
                        </React.Fragment>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* Wizard Modal */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
         <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
               <DialogTitle>New Capital Call - Step {wizardStep} of 4</DialogTitle>
            </DialogHeader>
            
            {/* Steps Progress */}
            <div className="flex justify-between mb-6 px-2">
               {['Setup', 'Allocation', 'Documents', 'Review'].map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-2">
                     <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors", 
                        wizardStep > i + 1 ? "bg-emerald-600 border-emerald-600 text-white" : 
                        wizardStep === i + 1 ? "border-emerald-600 text-emerald-600 bg-white" : "border-gray-200 text-gray-400 bg-gray-50"
                     )}>
                        {i + 1}
                     </div>
                     <span className="text-xs text-gray-500">{step}</span>
                  </div>
               ))}
            </div>

            <div className="min-h-[300px] py-4">
               {wizardStep === 1 && (
                  <div className="space-y-4">
                     <EditableField label="Project" type="select" options={['Highland Park Lofts', 'Riverside Commercial']} />
                     <div className="grid grid-cols-2 gap-4">
                        <EditableField label="Total Call Amount" placeholder="$0.00" />
                        <EditableField label="Due Date" type="date" />
                     </div>
                     <EditableField label="Reason for Call" type="textarea" placeholder="e.g. Acquisition funding..." />
                  </div>
               )}
               {wizardStep === 2 && (
                  <div className="space-y-4">
                     <div className="flex justify-between items-center bg-gray-50 p-3 rounded text-sm">
                        <span className="font-bold text-gray-700">Total to Allocate: $2,500,000</span>
                        <span className="text-emerald-600">Remaining: $0.00</span>
                     </div>
                     <div className="border border-gray-200 rounded overflow-hidden">
                        <table className="w-full text-sm">
                           <thead className="bg-gray-50 text-left">
                              <tr>
                                 <th className="p-3 text-xs font-bold text-gray-500">Investor</th>
                                 <th className="p-3 text-xs font-bold text-gray-500 text-right">Ownership</th>
                                 <th className="p-3 text-xs font-bold text-gray-500 text-right">Allocation</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                              <tr>
                                 <td className="p-3">Blackstone Capital</td>
                                 <td className="p-3 text-right text-gray-500">60%</td>
                                 <td className="p-3 text-right font-medium">$1,500,000</td>
                              </tr>
                              <tr>
                                 <td className="p-3">Summit Equity</td>
                                 <td className="p-3 text-right text-gray-500">40%</td>
                                 <td className="p-3 text-right font-medium">$1,000,000</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}
               {wizardStep === 3 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded bg-gray-50">
                     <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                     <p className="text-gray-600 font-medium">Drag and drop Capital Call Notice PDF</p>
                     <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                     <Button variant="outline" size="sm" className="mt-4">Upload Notice</Button>
                  </div>
               )}
               {wizardStep === 4 && (
                  <div className="space-y-4">
                     <div className="bg-emerald-50 p-4 rounded border border-emerald-100 text-emerald-800 text-sm flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <div>
                           <p className="font-bold">Ready to Send</p>
                           <p className="mt-1">This will generate 2 unique notices and email them to investors immediately.</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 border border-gray-200 rounded">
                           <span className="block text-gray-400 text-xs uppercase">Project</span>
                           <span className="font-bold">Highland Park Lofts</span>
                        </div>
                        <div className="p-3 border border-gray-200 rounded">
                           <span className="block text-gray-400 text-xs uppercase">Amount</span>
                           <span className="font-bold">$2,500,000</span>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            <DialogFooter className="flex justify-between">
               <Button variant="ghost" onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setIsWizardOpen(false)}>
                  {wizardStep === 1 ? 'Cancel' : 'Back'}
               </Button>
               <Button 
                  onClick={() => wizardStep < 4 ? setWizardStep(wizardStep + 1) : setIsWizardOpen(false)}
                  className="bg-[#2F855A] hover:bg-[#276749] text-white"
               >
                  {wizardStep === 4 ? 'Confirm & Send' : 'Next Step'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </>
  );
};

export default CapitalCallsPage;