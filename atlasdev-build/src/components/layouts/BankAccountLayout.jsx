import React from 'react';
import { Outlet } from 'react-router-dom';
import BankAccountSidebar from '@/components/BankAccountSidebar';

const BankAccountLayout = () => {
  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-gray-50">
      <BankAccountSidebar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default BankAccountLayout;
