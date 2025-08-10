import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Target, FileText, Type, ArrowRight, DollarSign, Calendar as CalendarIcon, BarChart } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  status: string;
  startDate: string;
  endDate?: string;
}

interface ProjectUpdateFormProps {
  projectId: string;
}

const ProjectUpdateForm: React.FC<ProjectUpdateFormProps> = ({ projectId }) => {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (response.ok) {
          const data = await response.json();
          setProject({
            ...data,
            startDate: new Date(data.startDate).toISOString().split('T')[0],
            endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          });
        } else {
          setError('Failed to fetch project data.');
        }
      } catch (err) {
        setError('An error occurred while fetching project data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProject((prevProject) => {
      if (!prevProject) return null;
      return {
        ...prevProject,
        [name]: name === 'goal' || name === 'raised' ? parseFloat(value) : value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...project,
          goal: project.goal,
          raised: project.raised,
          startDate: project.startDate,
          endDate: project.endDate || null,
        }),
      });

      if (response.ok) {
        console.log('Project updated successfully!');
        router.push(`/projects/${projectId}`);
      } else {
        console.error('Failed to update project:', response.statusText);
      }
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-blue-400 animate-spin"></div>
        </div>
        <div className="text-slate-500 font-medium">Loading project data...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-64">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg max-w-md">
        <div className="flex items-center gap-3">
          <div className="text-red-500 text-xl">⚠️</div>
          <div className="text-red-700 font-medium">Error</div>
        </div>
        <div className="mt-2 text-red-600">{error}</div>
      </div>
    </div>
  );
  
  if (!project) return (
    <div className="flex justify-center items-center h-64">
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg max-w-md">
        <div className="flex items-center gap-3">
          <div className="text-amber-500 text-xl">🔍</div>
          <div className="text-amber-700 font-medium">Not Found</div>
        </div>
        <div className="mt-2 text-amber-600">Project could not be found. Please check the project ID and try again.</div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-50 via-purple-50/30 to-blue-50/30 opacity-70"></div>
        <CardHeader className="relative z-10 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-indigo-500" />
            </div>
            <CardTitle className="text-2xl font-semibold text-slate-800">
              Update Project
            </CardTitle>
          </div>
          <CardDescription className="text-slate-500 text-base">
            Update the details of your fundraising project
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pb-8 pt-4 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {/* Project Title */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Type className="h-4 w-4 text-indigo-500" />
                  <label htmlFor="title" className="text-sm font-medium text-slate-700">Project Title</label>
                </div>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={project.title}
                  onChange={handleChange}
                  className="h-12 px-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-slate-800"
                  placeholder="Enter a compelling title for your project"
                  required
                />
              </div>
              
              {/* Project Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <label htmlFor="description" className="text-sm font-medium text-slate-700">Project Description</label>
                </div>
                <Textarea
                  id="description"
                  name="description"
                  value={project.description}
                  onChange={handleChange}
                  rows={6}
                  className="px-4 py-3 rounded-xl border-slate-200 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-slate-800"
                  placeholder="Describe your project in detail. What are your goals? How will the funds be used?"
                  required
                />
              </div>
              
              {/* Funding Goal */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-indigo-500" />
                  <label htmlFor="goal" className="text-sm font-medium text-slate-700">Funding Goal</label>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <Input
                    type="number"
                    id="goal"
                    name="goal"
                    value={project.goal}
                    onChange={handleChange}
                    className="h-12 pl-8 pr-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-slate-800"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 pl-2">Set a realistic funding goal that covers your project needs</p>
              </div>
              
              {/* Raised Amount */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-indigo-500" />
                  <label htmlFor="raised" className="text-sm font-medium text-slate-700">Amount Raised</label>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <Input
                    type="number"
                    id="raised"
                    name="raised"
                    value={project.raised}
                    onChange={handleChange}
                    className="h-12 pl-8 pr-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-slate-800"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              {/* Dates Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-indigo-500" />
                    <label htmlFor="startDate" className="text-sm font-medium text-slate-700">Start Date</label>
                  </div>
                  <Input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={project.startDate}
                    onChange={handleChange}
                    className="h-12 px-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-slate-800"
                    required
                  />
                </div>
                
                {/* End Date */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-indigo-500" />
                    <label htmlFor="endDate" className="text-sm font-medium text-slate-700">End Date</label>
                  </div>
                  <Input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={project.endDate}
                    onChange={handleChange}
                    className="h-12 px-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-slate-800"
                  />
                </div>
              </div>
              
              {/* Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart className="h-4 w-4 text-indigo-500" />
                  <label htmlFor="status" className="text-sm font-medium text-slate-700">Project Status</label>
                </div>
                <Select
                  name="status"
                  value={project.status}
                  onValueChange={(value) => {
                    setProject(prev => {
                      if (!prev) return null;
                      return { ...prev, status: value };
                    });
                  }}
                >
                  <SelectTrigger className="h-12 px-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-slate-800">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                        <span>Draft</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ACTIVE" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                        <span>Active</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="COMPLETED" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        <span>Completed</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="CANCELLED" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        <span>Cancelled</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-base font-medium flex items-center justify-center gap-2"
              >
                Update Project
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectUpdateForm;