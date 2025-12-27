import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import ProjectContent from '@/components/ProjectContent';

const ProjectDetailPage = () => {
  const { projectId, tab = 'overview', subtab = 'general' } = useParams();

  const projectData = {
    PRJ001: { code: 'PRJ001', name: 'Sunset Towers', entity: 'Sunset Development LLC' },
    PRJ002: { code: 'PRJ002', name: 'Marina Bay Complex', entity: 'Marina Holdings Inc' },
    // ... other projects would be fetched here
  };

  const project = projectData[projectId] || { code: projectId, name: 'Sunset Towers', entity: 'Sunset Development LLC' };

  return (
    <>
      <Helmet>
        <title>{project.name} | QualiaDev</title>
        <meta name="description" content={`Project details and management for ${project.name}`} />
      </Helmet>
      
      {/* Content Only - Sidebar is now handled by App.jsx Layout */}
      <div className="h-full w-full">
        <ProjectContent project={project} tab={tab} subtab={subtab} />
      </div>
    </>
  );
};

export default ProjectDetailPage;