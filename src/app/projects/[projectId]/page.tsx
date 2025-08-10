import React from 'react';
import { PrismaClient } from '@prisma/client';
import { ProjectDetailView } from '@/components/projects/project-detail-view';
import { Shell } from '@/components/shells/shell';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

const ProjectDetailsPage = async ({ params }: { params: { projectId: string } }) => {
  const { projectId } = await params;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    notFound();
  }

  return (
    <Shell>
      <ProjectDetailView project={{...project, endDate: project.endDate || undefined}} />
    </Shell>
  );
};

export default ProjectDetailsPage;
