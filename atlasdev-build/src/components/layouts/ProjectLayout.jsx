import React from 'react';
import { Outlet } from 'react-router-dom';
import ProjectSidebar from '@/components/ProjectSidebar';

const ProjectLayout = () => {
  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      <ProjectSidebar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectLayout;
