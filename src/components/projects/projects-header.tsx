"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { 
  Plus, 
  FolderOpen, 
  TrendingUp, 
  Users,
  Target,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ProjectsHeader() {
  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-indigo-50/30 rounded-3xl blur-3xl -z-10" />
        <PageHeader
          heading="Projects"
          text="Manage and track your fundraising projects. Create new campaigns, monitor progress, and engage with your community."
        />
        <div className="flex items-center gap-3">
          <Button 
            asChild 
            size="sm" 
            variant="outline"
            className="h-10 px-4 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200"
          >
            <Link href="/projects/analytics">
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
          <Button 
            asChild 
            size="sm"
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Link href="/projects/create">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group bg-gradient-to-br from-blue-50/90 to-blue-100/50 border-blue-200/50 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600/90 group-hover:text-blue-700">Active Projects</p>
                <p className="text-2xl font-bold text-blue-900 group-hover:text-blue-950">12</p>
                <p className="text-xs text-blue-600/70 mt-1 group-hover:text-blue-700/90">+2 this month</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-200">
                <FolderOpen className="h-6 w-6 text-blue-600 group-hover:text-blue-700 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-green-50/90 to-green-100/50 border-green-200/50 backdrop-blur-sm hover:shadow-lg hover:shadow-green-100/50 hover:-translate-y-0.5 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600/90 group-hover:text-green-700">Total Raised</p>
                <p className="text-2xl font-bold text-green-900 group-hover:text-green-950">$45,230</p>
                <p className="text-xs text-green-600/70 mt-1 group-hover:text-green-700/90">+15% this month</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors duration-200">
                <TrendingUp className="h-6 w-6 text-green-600 group-hover:text-green-700 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-purple-50/90 to-purple-100/50 border-purple-200/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-100/50 hover:-translate-y-0.5 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600/90 group-hover:text-purple-700">Contributors</p>
                <p className="text-2xl font-bold text-purple-900 group-hover:text-purple-950">1,247</p>
                <p className="text-xs text-purple-600/70 mt-1 group-hover:text-purple-700/90">+89 this week</p>
              </div>
              <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors duration-200">
                <Users className="h-6 w-6 text-purple-600 group-hover:text-purple-700 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group bg-gradient-to-br from-orange-50/90 to-orange-100/50 border-orange-200/50 backdrop-blur-sm hover:shadow-lg hover:shadow-orange-100/50 hover:-translate-y-0.5 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600/90 group-hover:text-orange-700">Goal Achievement</p>
                <p className="text-2xl font-bold text-orange-900 group-hover:text-orange-950">78%</p>
                <p className="text-xs text-orange-600/70 mt-1 group-hover:text-orange-700/90">Average rate</p>
              </div>
              <div className="h-12 w-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors duration-200">
                <Target className="h-6 w-6 text-orange-600 group-hover:text-orange-700 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
