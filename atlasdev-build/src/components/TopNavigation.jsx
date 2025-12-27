import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, ChevronDown, Search, Bell, User, Settings, LogOut,
  LayoutDashboard, FolderKanban, Target, Calculator, Users, 
  Calendar, CheckSquare, FileText, Landmark, CreditCard, BarChart3,
  PieChart, Receipt, BookOpen, Wallet, UserCircle, Building, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const TopNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="h-14 bg-[#1a202c] border-b border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">AtlasDev</span>
        </Link>

        {/* Main Navigation */}
        <nav className="flex items-center gap-1">
          {/* Dashboard */}
          <Link to="/">
            <Button 
              variant="ghost" 
              className={cn(
                "text-gray-300 hover:text-white hover:bg-gray-700",
                isActive('/dashboard') && "bg-gray-700 text-white"
              )}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>

          {/* Projects */}
          <Link to="/projects">
            <Button 
              variant="ghost" 
              className={cn(
                "text-gray-300 hover:text-white hover:bg-gray-700",
                isActive('/project') && "bg-gray-700 text-white"
              )}
            >
              <FolderKanban className="w-4 h-4 mr-2" />
              Projects
            </Button>
          </Link>

          {/* Pipeline */}
          <Link to="/pipeline">
            <Button 
              variant="ghost" 
              className={cn(
                "text-gray-300 hover:text-white hover:bg-gray-700",
                isActive('/pipeline') && "bg-gray-700 text-white"
              )}
            >
              <Target className="w-4 h-4 mr-2" />
              Pipeline
            </Button>
          </Link>

          {/* Accounting Dropdown - Goes to List Views First */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "text-gray-300 hover:text-white hover:bg-gray-700",
                  isActive('/accounting') && "bg-gray-700 text-white"
                )}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Accounting
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Accounting</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/accounting/entities')}>
                <Building className="w-4 h-4 mr-2" />
                Entities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/accounting/bank-accounts')}>
                <CreditCard className="w-4 h-4 mr-2" />
                Bank Accounts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/accounting/chart-of-accounts')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Chart of Accounts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/accounting/bills')}>
                <Receipt className="w-4 h-4 mr-2" />
                Bills
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/accounting/payments')}>
                <DollarSign className="w-4 h-4 mr-2" />
                Payments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/accounting/invoices')}>
                <FileText className="w-4 h-4 mr-2" />
                Invoices
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/accounting/journal-entries')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Journal Entries
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/accounting/vendors')}>
                <Users className="w-4 h-4 mr-2" />
                Vendors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/accounting/reports')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Financial Reports
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/accounting/consolidated')}>
                <PieChart className="w-4 h-4 mr-2" />
                Consolidated View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Investors Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "text-gray-300 hover:text-white hover:bg-gray-700",
                  isActive('/investors') && "bg-gray-700 text-white"
                )}
              >
                <Users className="w-4 h-4 mr-2" />
                Investors
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Investor Management</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/investors')}>
                <Users className="w-4 h-4 mr-2" />
                All Investors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/investors/capital-accounts')}>
                <Wallet className="w-4 h-4 mr-2" />
                Capital Accounts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/investors/capital-calls')}>
                <DollarSign className="w-4 h-4 mr-2" />
                Capital Calls
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/investors/distributions')}>
                <Receipt className="w-4 h-4 mr-2" />
                Distributions
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/investors/ownership')}>
                <PieChart className="w-4 h-4 mr-2" />
                Ownership Structure
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Operations Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "text-gray-300 hover:text-white hover:bg-gray-700",
                  isActive('/operations') && "bg-gray-700 text-white"
                )}
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Operations
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/operations/tasks')}>
                <CheckSquare className="w-4 h-4 mr-2" />
                Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/calendar')}>
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/contacts')}>
                <UserCircle className="w-4 h-4 mr-2" />
                Contacts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/operations/templates')}>
                <FileText className="w-4 h-4 mr-2" />
                Project Templates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/operations/teams')}>
                <Users className="w-4 h-4 mr-2" />
                Teams
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search..." 
            className="pl-9 w-64 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-emerald-500"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-700 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center mr-2">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm">Bryan</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavigation;
