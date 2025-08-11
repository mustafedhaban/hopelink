import React from 'react';
import { PrismaClient } from '@prisma/client';
import { ProjectsDataTable } from '@/components/projects/projects-data-table';
import { ProjectsHeader } from '@/components/projects/projects-header';
import { Shell } from '@/components/shells/shell';

const prisma = new PrismaClient();

const ProjectsPage = async () => {
  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      donations: {
        include: {
          user: true
        }
      },
      updates: true,
      managers: true
    }
  });

  return (
    <Shell>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 -z-10" />
        <div className="flex flex-col space-y-8 pb-8">
          <ProjectsHeader />
          <ProjectsDataTable data={projects} />
        </div>
      </div>
    </Shell>
  );
};

export default ProjectsPage;
