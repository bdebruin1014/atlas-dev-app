import React from 'react';
import { Outlet } from 'react-router-dom';
import OpportunitySidebar from '@/components/OpportunitySidebar';

const OpportunityLayout = () => {
  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <OpportunitySidebar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default OpportunityLayout;
