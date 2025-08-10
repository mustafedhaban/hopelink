"use client";

import React from 'react';
import Link from 'next/link';
import { formatCurrency, cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Target, TrendingUp, Edit, BarChart3, Users, Clock } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  status: string;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectDetailViewProps {
  project: Project;
}

export const ProjectDetailView = ({ project }: ProjectDetailViewProps) => {
  const progress = (project.raised / project.goal) * 100;
  const remainingAmount = project.goal - project.raised;
  const daysLeft = project.endDate ? Math.max(0, Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'completed': return 'bg-blue-500 hover:bg-blue-600';
      case 'paused': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'cancelled': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] border border-white/40 backdrop-blur-xl">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Badge className={cn("px-4 py-1.5 text-white rounded-full font-medium text-sm shadow-sm transition-all duration-300 hover:scale-105", getStatusColor(project.status))}>
                  {project.status}
                </Badge>
                {daysLeft !== null && (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-105">
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent tracking-tight">
                {project.title}
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-3xl font-light">
                {project.description}
              </p>
            </div>
            <div className="flex gap-4 mt-6 lg:mt-0">
              <Button asChild variant="outline" className="flex items-center gap-2 rounded-xl px-5 py-6 h-auto text-slate-700 border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all duration-300">
                <Link href={`/projects/${project.id}/analytics`}>
                  <BarChart3 className="h-5 w-5 mr-1" />
                  Analytics
                </Link>
              </Button>
              <Button asChild className="flex items-center gap-2 rounded-xl px-5 py-6 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <Link href={`/projects/${project.id}/edit`}>
                  <Edit className="h-5 w-5 mr-1" />
                  Edit Project
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:translate-y-[-5px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
            <CardTitle className="text-sm font-medium text-slate-600">Amount Raised</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(project.raised)}</div>
            <div className="flex items-center mt-2">
              <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500" 
                  style={{ width: `${Math.min(100, (project.raised / project.goal) * 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-green-600 ml-2 font-medium">
                {((project.raised / project.goal) * 100).toFixed(1)}% of goal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:translate-y-[-5px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
            <CardTitle className="text-sm font-medium text-slate-600">Funding Goal</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{formatCurrency(project.goal)}</div>
            <div className="flex items-center mt-2">
              <div className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                {formatCurrency(remainingAmount)} remaining
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:translate-y-[-5px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-violet-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
            <CardTitle className="text-sm font-medium text-slate-600">Contributors</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">247</div>
            <div className="flex items-center mt-2">
              <div className="px-2 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12 this week
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:translate-y-[-5px]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
            <CardTitle className="text-sm font-medium text-slate-600">Days Active</CardTitle>
            <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {Math.ceil((new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="flex items-center mt-2">
              <div className="px-2 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-medium">
                Since {new Date(project.startDate).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 via-indigo-50/30 to-purple-50/30 opacity-70"></div>
        <CardHeader className="relative z-10 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">
              Funding Progress
            </CardTitle>
          </div>
          <CardDescription className="text-slate-500">
            Track the journey towards your funding goal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 relative z-10 pb-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Progress</span>
              <span className="text-lg font-semibold text-blue-600">{progress.toFixed(1)}%</span>
            </div>
            <div className="relative pt-2">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-in-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="absolute -top-1 left-0 right-0">
                <div className="flex justify-between text-xs text-slate-400 px-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 p-6 rounded-xl border border-green-100/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-green-100/80 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-800">Current Funding</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{formatCurrency(project.raised)}</div>
              <div className="text-sm text-green-600 mt-2 font-medium">Raised so far</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 rounded-xl border border-blue-100/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-100/80 flex items-center justify-center">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-blue-800">Target Amount</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{formatCurrency(project.goal)}</div>
              <div className="text-sm text-blue-600 mt-2 font-medium">Total goal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <Card className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-slate-50 via-slate-50/30 to-slate-50/10 opacity-70"></div>
        <CardHeader className="relative z-10 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-slate-500" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">
              Project Timeline
            </CardTitle>
          </div>
          <CardDescription className="text-slate-500">
            Important dates and project information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-green-100/80 flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-green-600" />
                  </div>
                  <label className="text-sm font-medium text-slate-700">Start Date</label>
                </div>
                <p className="text-xl font-semibold text-slate-800">{new Date(project.startDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              {project.endDate && (
                <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100/80 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <label className="text-sm font-medium text-slate-700">End Date</label>
                  </div>
                  <p className="text-xl font-semibold text-slate-800">{new Date(project.endDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100/80 flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-indigo-600" />
                  </div>
                  <label className="text-sm font-medium text-slate-700">Created</label>
                </div>
                <p className="text-xl font-semibold text-slate-800">{new Date(project.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100/80 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <label className="text-sm font-medium text-slate-700">Last Updated</label>
                </div>
                <p className="text-xl font-semibold text-slate-800">{new Date(project.updatedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Preview */}
      <Card className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-50 via-blue-50/30 to-purple-50/30 opacity-70"></div>
        <CardHeader className="relative z-10 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800">
              Analytics Overview
            </CardTitle>
          </div>
          <CardDescription className="text-slate-500">
            Quick insights into your project performance
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pb-8">
          <div className="h-72 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl flex items-center justify-center border border-dashed border-indigo-200 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100/20 rounded-full blur-2xl"></div>
            <div className="text-center space-y-4 relative z-10 px-6">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full inline-flex items-center justify-center shadow-sm border border-indigo-100/50 mb-2">
                <BarChart3 className="h-12 w-12 text-indigo-500" />
              </div>
              <p className="text-slate-600 text-lg">Analytics charts will be displayed here</p>
              <Button asChild variant="outline" className="rounded-xl px-6 py-6 h-auto text-indigo-700 border-indigo-200 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 mt-2">
                <Link href={`/projects/${project.id}/analytics`} className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  View Detailed Analytics
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
