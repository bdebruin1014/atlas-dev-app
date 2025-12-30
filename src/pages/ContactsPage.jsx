import React, { useState } from 'react';
import { Search, Plus, Building2, User, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const ContactsPage = () => {
  const [activeCategory, setActiveCategory] = useState('employees');
  const [expandedCategories, setExpandedCategories] = useState(['employees']);

  const categories = [
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'employees', label: 'Employees', icon: User, subcategories: [
      { id: 'closing', label: 'Closing' },
      { id: 'payoffs', label: 'Payoffs' },
      { id: 'services', label: 'Services' },
      { id: 'government', label: 'Government' },
    ]},
    { id: 'customers', label: 'Customers', icon: User, subcategories: [
      { id: 'buyers', label: 'Buyers' },
      { id: 'sellers', label: 'Sellers' },
      { id: 'agents', label: 'Agents' },
    ]},
  ];

  const contacts = [
    { id: 1, name: 'John Smith', company: 'ABC Title Co', email: 'john@abctitle.com', phone: '(864) 555-0101', role: 'Closing Agent' },
    { id: 2, name: 'Sarah Johnson', company: 'First National Bank', email: 'sarah@fnb.com', phone: '(864) 555-0102', role: 'Loan Officer' },
    { id: 3, name: 'Mike Williams', company: 'Williams Construction', email: 'mike@williams.com', phone: '(864) 555-0103', role: 'Contractor' },
    { id: 4, name: 'Emily Davis', company: 'Davis Law Firm', email: 'emily@davislaw.com', phone: '(864) 555-0104', role: 'Attorney' },
    { id: 5, name: 'Robert Brown', company: 'Brown Surveying', email: 'robert@brownsurvey.com', phone: '(864) 555-0105', role: 'Surveyor' },
    { id: 6, name: 'Lisa Anderson', company: 'Anderson Appraisals', email: 'lisa@andersonapp.com', phone: '(864) 555-0106', role: 'Appraiser' },
    { id: 7, name: 'David Martinez', company: 'City Planning Dept', email: 'david@city.gov', phone: '(864) 555-0107', role: 'Planner' },
    { id: 8, name: 'Jennifer Taylor', company: 'Taylor Insurance', email: 'jen@taylorins.com', phone: '(864) 555-0108', role: 'Insurance Agent' },
  ];

  const toggleCategory = (id) => {
    setExpandedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  return (
    <div className="flex h-[calc(100vh-40px)] bg-gray-50">
      <div className="w-52 bg-[#1e2a3a] flex-shrink-0 overflow-y-auto">
        <div className="p-3 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-white">Contact Types</h2>
        </div>
        <nav className="p-2">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div key={cat.id}>
                <button
                  onClick={() => { setActiveCategory(cat.id); if (cat.subcategories) toggleCategory(cat.id); }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs rounded transition-colors",
                    activeCategory === cat.id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {cat.label}
                  </div>
                  {cat.subcategories && (
                    <ChevronDown className={cn("w-4 h-4 transition-transform", expandedCategories.includes(cat.id) ? "" : "-rotate-90")} />
                  )}
                </button>
                {cat.subcategories && expandedCategories.includes(cat.id) && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-gray-600 pl-2">
                    {cat.subcategories.map((sub) => (
                      <button key={sub.id} className="block w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded">
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search contacts..." className="pl-9 w-72 h-9 text-sm" />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="w-4 h-4 mr-1" />Filter
            </Button>
          </div>
          <Button className="bg-[#047857] hover:bg-[#065f46] h-9">
            <Plus className="w-4 h-4 mr-1" />Add Contact
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Company</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 font-medium text-[#047857]">{contact.name}</td>
                    <td className="px-4 py-3 text-gray-600">{contact.company}</td>
                    <td className="px-4 py-3 text-gray-600">{contact.role}</td>
                    <td className="px-4 py-3 text-gray-600">{contact.email}</td>
                    <td className="px-4 py-3 text-gray-600">{contact.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="w-48 bg-white border-l border-gray-200 flex-shrink-0 p-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Filters</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">Company</label>
            <Input placeholder="Any" className="h-7 text-xs" />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">Role</label>
            <Input placeholder="Any" className="h-7 text-xs" />
          </div>
          <div>
            <label className="text-xs text-gray-600 block mb-1">City</label>
            <Input placeholder="Any" className="h-7 text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
