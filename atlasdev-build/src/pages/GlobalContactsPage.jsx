import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Plus, Building2, Users, User, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const GlobalContactsPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('companies');
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(['companies']);

  const categories = [
    { 
      id: 'companies', 
      label: 'Companies', 
      icon: Building2,
      subcategories: [
        { id: 'closing', label: 'Closing' },
        { id: 'payoffs', label: 'Payoffs' },
        { id: 'services', label: 'Services' },
        { id: 'government', label: 'Government' },
        { id: 'other-contacts', label: 'Other Contacts' },
      ]
    },
    { 
      id: 'employees', 
      label: 'Employees', 
      icon: User,
      subcategories: [
        { id: 'closing-emp', label: 'Closing' },
        { id: 'payoffs-emp', label: 'Payoffs' },
        { id: 'services-emp', label: 'Services' },
        { id: 'government-emp', label: 'Government' },
        { id: 'other-contacts-emp', label: 'Other Contacts' },
      ]
    },
    { 
      id: 'customers', 
      label: 'Customers', 
      icon: Users,
      subcategories: [
        { id: 'individuals', label: 'Individuals' },
        { id: 'organizations', label: 'Organizations' },
      ]
    },
  ];

  const companyContacts = [
    { id: 1, name: 'New Company', type: 'Law Firm', address: '', phone: '' },
    { id: 2, name: '100 East Property owners association', type: 'HOA', address: '', phone: '' },
    { id: 3, name: '1017 Forida LLC', type: 'Lender', address: '', phone: '' },
    { id: 4, name: '1031 Exchange Services, LLC', type: 'Exchange Accommodator', address: '341 Micklers Rd, St Augustine, FL, 32080', phone: '(954) 684-6645' },
    { id: 5, name: '123 Lender Inc.', type: 'Lender', address: '', phone: '' },
    { id: 6, name: '1st Class Real Estate', type: 'Real Estate Agency', address: '', phone: '' },
    { id: 7, name: '1st Financial Bank', type: 'Payoff Lender', address: '5929 South Mogen Avenue, Sioux Falls, SD, 57108', phone: '(800) 752-0401' },
    { id: 8, name: '1st Financial Bank USA', type: 'Lender', address: '331 Dakota Dunes Boulevard, Dakota Dunes, SD, 57049', phone: '' },
    { id: 9, name: '1st Franklin Financial', type: 'Payoff Lender', address: '2537 North Pleasantburg Drive, Ste B, Greenville, SC, 29609', phone: '' },
    { id: 10, name: '21st Mortgage Corporation', type: 'Lender', address: 'PO Box 477, Knoxville, TN, 37901', phone: '' },
    { id: 11, name: '33 Realty Management', type: 'Real Estate Agency', address: '', phone: '' },
    { id: 12, name: '3D Inspection', type: 'Other Company', address: '5531 North Highway 81, Williamston, SC, 29697', phone: '(864) 795-2378' },
    { id: 13, name: '3D Land Surveying', type: 'Surveying Firm', address: 'PO Box 8494, Greenville, SC, 29607', phone: '' },
    { id: 14, name: '451 Haywood Rd, Greenville SC 29615', type: 'HOA Management Co.', address: '', phone: '' },
    { id: 15, name: '707 W Parker LLC', type: 'Payoff Lender', address: '', phone: '(717) 420-0834' },
  ];

  const employeeContacts = [
    { id: 1, name: '', jobTitle: 'Attorney', company: '', email: '', workPhone: '', cellPhone: '' },
    { id: 2, name: '', jobTitle: 'Attorney', company: 'De Bruin Law Firm', email: '', workPhone: '', cellPhone: '' },
    { id: 3, name: '', jobTitle: 'Notary', company: 'USA Notary (RON Only)', email: 'ryon@usanotary.net', workPhone: '(804) 767-7500', cellPhone: '' },
    { id: 4, name: 'Tonya (Paralegal)', jobTitle: 'Attorney', company: 'Finklea, Hendrick & Blake, LLC', email: 'thayes@finklealaw.com', workPhone: '', cellPhone: '' },
    { id: 5, name: 'Kenya (Processor)', jobTitle: 'Loan Processor', company: 'PennyMac Loan Services, LLC', email: '', workPhone: '(800) 900-4794', cellPhone: '' },
    { id: 6, name: 'ALAN *', jobTitle: '', company: 'BROOKFIELD GARDENS', email: 'brookfield.gardens30@gmail.com', workPhone: '(678) 296-6202', cellPhone: '' },
    { id: 7, name: 'N/A 1', jobTitle: '', company: 'USAA', email: 'doublejveytia@gmail.com', workPhone: '(800) 531-8722', cellPhone: '' },
    { id: 8, name: 'Colby Absmeier', jobTitle: '', company: 'State Farm', email: 'colbyabs103@outlook.com', workPhone: '(606) 359-3185', cellPhone: '' },
    { id: 9, name: 'Stephanie Accor', jobTitle: 'Loan Processor', company: 'Family Trust FCU', email: 'saccor@familytrust.org', workPhone: '(803) 326-2171', cellPhone: '' },
    { id: 10, name: 'Jason Acosta', jobTitle: '', company: 'First Choice Insurance Agency Inc', email: 'jason@fcisc.com', workPhone: '(864) 334-1200', cellPhone: '' },
  ];

  const toggleCategory = (categoryId) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(c => c !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
    setActiveCategory(categoryId);
    setActiveSubCategory(null);
  };

  const contacts = activeCategory === 'employees' ? employeeContacts : companyContacts;

  const getCategoryTitle = () => {
    if (activeCategory === 'companies') return 'All Companies';
    if (activeCategory === 'employees') return 'All Contacts';
    if (activeCategory === 'customers') return 'All Customers';
    return 'Contacts';
  };

  const getButtonLabel = () => {
    if (activeCategory === 'companies') return 'New Company';
    if (activeCategory === 'employees') return 'New Employee';
    if (activeCategory === 'customers') return 'New Customer';
    return 'New Contact';
  };

  return (
    <div className="flex h-[calc(100vh-40px)] bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-48 bg-white border-r border-gray-200 flex-shrink-0">
        <nav className="py-2">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm",
                  activeCategory === category.id && !activeSubCategory
                    ? "bg-[#047857] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
                {category.subcategories && (
                  <ChevronDown className={cn(
                    "w-3 h-3 ml-auto transition-transform",
                    expandedCategories.includes(category.id) ? "rotate-180" : ""
                  )} />
                )}
              </button>
              
              {/* Subcategories */}
              {category.subcategories && expandedCategories.includes(category.id) && (
                <div className="ml-4">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setActiveSubCategory(sub.id);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs",
                        activeSubCategory === sub.id
                          ? "text-[#047857] font-medium"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeCategory === 'companies' && <Building2 className="w-5 h-5 text-gray-500" />}
            {activeCategory === 'employees' && <User className="w-5 h-5 text-gray-500" />}
            {activeCategory === 'customers' && <Users className="w-5 h-5 text-gray-500" />}
            <h1 className="text-lg font-semibold text-gray-900">{getCategoryTitle()}</h1>
          </div>
          <Button className="bg-[#047857] hover:bg-[#065f46] text-white text-xs h-8">
            {getButtonLabel()}
          </Button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b border-gray-200">
                {activeCategory === 'companies' ? (
                  <>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Name</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Type</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Address</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Phone</th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Name</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Job Title</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Company</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Email</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Work Phone</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-gray-500">Cell Phone</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {activeCategory === 'companies' ? (
                companyContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-2.5 text-sm text-gray-900">{contact.name}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">{contact.type}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">
                      {contact.address || <span className="text-gray-400">Not set</span>}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">
                      {contact.phone || <span className="text-gray-400">Not set</span>}
                    </td>
                  </tr>
                ))
              ) : (
                employeeContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-2.5 text-sm text-gray-900">
                      {contact.name || <span className="text-gray-400">Not set</span>}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">
                      {contact.jobTitle || <span className="text-gray-400">Not set</span>}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">
                      {contact.company || <span className="text-gray-400">Not set</span>}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">
                      {contact.email || <span className="text-gray-400">Not set</span>}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">
                      {contact.workPhone || <span className="text-gray-400">Not set</span>}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">
                      {contact.cellPhone || <span className="text-gray-400">Not set</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-center gap-1">
            <button className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700">‹</button>
            <button className="px-2.5 py-1 text-xs bg-[#047857] text-white rounded">1</button>
            <button className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">2</button>
            <button className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">3</button>
            <button className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">4</button>
            <button className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">5</button>
            <button className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">6</button>
            <button className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">7</button>
            <span className="px-2 text-xs text-gray-400">...</span>
            <button className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded">116</button>
            <button className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700">›</button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Filters */}
      <div className="w-56 bg-white border-l border-gray-200 flex-shrink-0 p-3">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Filter {activeCategory === 'companies' ? 'Companies' : 'People'}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Search Term</label>
            <div className="relative">
              <Input
                placeholder={`Search ${activeCategory === 'companies' ? 'Companies' : 'People'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-xs pr-8"
              />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
              {activeCategory === 'companies' ? 'Company' : 'Profile'}
            </h4>
            
            <div className="space-y-2">
              {activeCategory === 'companies' ? (
                <>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase mb-1">Phone</label>
                    <Input placeholder="Any" className="h-7 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase mb-1">Tax ID Number</label>
                    <Input placeholder="Any" className="h-7 text-xs" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase mb-1">Company</label>
                    <Input placeholder="Any" className="h-7 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase mb-1">Job Title</label>
                    <Input placeholder="Any" className="h-7 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase mb-1">Phone</label>
                    <Input placeholder="Any" className="h-7 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 uppercase mb-1">Email</label>
                    <Input placeholder="Any" className="h-7 text-xs" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalContactsPage;
