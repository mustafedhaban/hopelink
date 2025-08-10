import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Target, FileText, Type, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';



interface Project {
  title: string;
  description: string;
  targetAmount: number;
}

const ProjectCreateForm = () => {
  const router = useRouter();
  const [project, setProject] = useState<Project>({
    title: '',
    description: '',
    targetAmount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: name === 'targetAmount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          goal: project.targetAmount,
          startDate: new Date().toISOString()
        }),
      });

      if (response.ok) {
        console.log('Project created successfully!');
        await response.json(); // Ensure response body is consumed
        router.push('/projects');
      } else {
        console.error('Failed to create project:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 via-indigo-50/30 to-purple-50/30 opacity-70"></div>
        <CardHeader className="relative z-10 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle className="text-2xl font-semibold text-slate-800">
              Create New Project
            </CardTitle>
          </div>
          <CardDescription className="text-slate-500 text-base">
            Fill in the details below to create your new fundraising project
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pb-8 pt-4 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Type className="h-4 w-4 text-blue-500" />
                  <label htmlFor="title" className="text-sm font-medium text-slate-700">Project Title</label>
                </div>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={project.title}
                  onChange={handleChange}
                  className="h-12 px-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                  placeholder="Enter a compelling title for your project"
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <label htmlFor="description" className="text-sm font-medium text-slate-700">Project Description</label>
                </div>
                <Textarea
                  id="description"
                  name="description"
                  value={project.description}
                  onChange={handleChange}
                  rows={6}
                  className="px-4 py-3 rounded-xl border-slate-200 bg-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                  placeholder="Describe your project in detail. What are your goals? How will the funds be used?"
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-500" />
                  <label htmlFor="targetAmount" className="text-sm font-medium text-slate-700">Funding Goal</label>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <Input
                    type="number"
                    id="targetAmount"
                    name="targetAmount"
                    value={project.targetAmount}
                    onChange={handleChange}
                    className="h-12 pl-8 pr-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-slate-500 pl-2">Set a realistic funding goal that covers your project needs</p>
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-base font-medium flex items-center justify-center gap-2"
              >
                Create Project
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCreateForm;