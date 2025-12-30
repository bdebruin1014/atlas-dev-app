import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, Search, Bell, User, Settings, LogOut,
  Shield, Mail, Building2
} from 'lucide-react';
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
  
  const isActive = (paths) => {
    const pathArray = Array.isArray(paths) ? paths : [paths];
    return pathArray.some(p => location.pathname.startsWith(p) || location.pathname === p);
  };

  // Nav link with green underline when active (like Qualia)
  const NavLink = ({ to, children, paths }) => {
    const active = isActive(paths || to);
    return (
      <Link 
        to={to} 
        className={cn(
          "px-3 py-2 text-[13px] relative",
          active ? "text-white" : "text-gray-400 hover:text-white"
        )}
      >
        {children}
        {active && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#047857]"></span>
        )}
      </Link>
    );
  };

  // Dropdown trigger with green underline when active
  const NavDropdown = ({ label, paths, children }) => {
    const active = isActive(paths);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger 
          className={cn(
            "px-3 py-2 text-[13px] flex items-center relative outline-none",
            active ? "text-white" : "text-gray-400 hover:text-white"
          )}
        >
          {label}
          <ChevronDown className="w-3 h-3 ml-0.5" />
          {active && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#047857]"></span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <header className="h-10 bg-[#1a1a1a] flex items-center justify-between px-3 flex-shrink-0">
      {/* Left - Logo and Nav */}
      <div className="flex items-center h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 mr-4">
          <div className="w-6 h-6 bg-[#047857] rounded flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-semibold text-sm">AtlasDev</span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center h-full">
          <NavLink to="/pipeline" paths="/pipeline">Opportunities</NavLink>
          <NavLink to="/projects" paths={['/projects', '/project']}>Projects</NavLink>
          <NavLink to="/contacts" paths="/contacts">Contacts</NavLink>
          <NavLink to="/calendar" paths="/calendar">Calendar</NavLink>
          
          <NavDropdown label="Operations" paths="/operations">
            <DropdownMenuItem onClick={() => navigate('/operations/tasks')} className="text-xs">Tasks</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/operations/task-templates')} className="text-xs">Task Templates</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/operations/milestone-templates')} className="text-xs">Milestone Templates</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/operations/reports')} className="text-xs">Reports</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/operations/product-library')} className="text-xs">Product Library</DropdownMenuItem>
          </NavDropdown>

          <NavLink to="/reports/preset" paths="/reports">Reports</NavLink>

          <NavDropdown label="Investors" paths="/investors">
            <DropdownMenuItem onClick={() => navigate('/investors/contacts')} className="text-xs">Investor Contacts</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/investors/investments')} className="text-xs">Investments</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/investors/capital-raising')} className="text-xs">Capital Raising</DropdownMenuItem>
          </NavDropdown>

          <NavLink to="/accounting/entities" paths="/accounting">Accounting</NavLink>
          <NavLink to="/admin" paths="/admin">Admin</NavLink>
        </nav>
      </div>

      {/* Right - Search and Icons */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input 
            placeholder="Search..." 
            className="pl-8 w-36 h-7 text-xs bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-gray-500 rounded"
          />
        </div>

        <button className="text-gray-400 hover:text-white relative p-1">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center text-gray-400 hover:text-white outline-none">
            <div className="w-7 h-7 bg-[#2a2a2a] rounded-full flex items-center justify-center border border-[#3a3a3a]">
              <User className="w-4 h-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#047857] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Bryan V.</p>
                  <p className="text-xs text-gray-500">bryan@vanrock.com</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings/profile')} className="text-xs">
              <User className="w-3.5 h-3.5 mr-2" />Your Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings/email')} className="text-xs">
              <Mail className="w-3.5 h-3.5 mr-2" />Email Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings/notifications')} className="text-xs">
              <Bell className="w-3.5 h-3.5 mr-2" />Notifications
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings/security')} className="text-xs">
              <Shield className="w-3.5 h-3.5 mr-2" />Security
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings/preferences/calendar')} className="text-xs">
              <Settings className="w-3.5 h-3.5 mr-2" />All Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 text-xs">
              <LogOut className="w-3.5 h-3.5 mr-2" />Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavigation;
