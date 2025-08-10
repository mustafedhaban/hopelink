"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpDown,
  ChevronDown,
  FolderOpen,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  status: string;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectsDataTableProps {
  data: Project[];
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'draft':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'completed':
      return <Target className="h-4 w-4 text-blue-500" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function ProjectsDataTable({ data }: ProjectsDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Project>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isHoveredRow, setIsHoveredRow] = useState<string | null>(null);

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue != null && bValue != null && aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue != null && bValue != null && aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, searchTerm, statusFilter, sortField, sortDirection]);
  
  const handleRowMouseEnter = (projectId: string) => {
    setIsHoveredRow(projectId);
  };
  
  const handleRowMouseLeave = () => {
    setIsHoveredRow(null);
  };

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Project deleted successfully');
        // Refresh the page or update the data
        window.location.reload();
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the project');
    }
  };

  return (
    <Card className="w-full overflow-hidden border-0 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 shadow-xl shadow-blue-900/5 backdrop-blur-sm transition-all duration-200 hover:shadow-2xl hover:shadow-blue-900/10">
      <CardHeader className="pb-6 pt-8 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-indigo-50/30 rounded-3xl blur-3xl -z-10" />
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent animate-gradient">
          Projects Overview
        </CardTitle>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 h-12 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm hover:border-blue-400 transition-all duration-200">
              <Filter className="mr-2 h-4 w-4 text-blue-500" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 bg-white/95 backdrop-blur-md">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0 px-8 pb-8">
        <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-slate-50 via-blue-50/30 to-indigo-50/20 border-b border-slate-100/50 transition-colors duration-200 group/header">
                <TableHead className="w-[300px] py-5">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('title')}
                    className="h-auto p-0 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Project
                    <ArrowUpDown className="ml-2 h-4 w-4 text-blue-500 opacity-70" />
                  </Button>
                </TableHead>
                <TableHead className="text-center py-5">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('status')}
                    className="h-auto p-0 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4 text-blue-500 opacity-70" />
                  </Button>
                </TableHead>
                <TableHead className="text-right py-5">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('goal')}
                    className="h-auto p-0 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Goal
                    <ArrowUpDown className="ml-2 h-4 w-4 text-blue-500 opacity-70" />
                  </Button>
                </TableHead>
                <TableHead className="text-right py-5">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('raised')}
                    className="h-auto p-0 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Raised
                    <ArrowUpDown className="ml-2 h-4 w-4 text-blue-500 opacity-70" />
                  </Button>
                </TableHead>
                <TableHead className="w-[200px] py-5 text-slate-700 font-semibold">Progress</TableHead>
                <TableHead className="text-center py-5">
                  <Button variant="ghost"
                    onClick={() => handleSort('createdAt')}
                    className="h-auto p-0 font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4 text-blue-500 opacity-70" />
                  </Button>
                </TableHead>
                <TableHead className="text-center w-[100px] py-5 text-slate-700 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((project) => {
                const progressPercentage = project.goal > 0 ? (project.raised / project.goal) * 100 : 0;
                const isHovered = isHoveredRow === project.id;
                
                return (
                  <TableRow 
                    key={project.id} 
                    className={`group transition-all duration-300 ${isHovered ? 'bg-gradient-to-r from-blue-50/80 via-blue-50/50 to-indigo-50/30 scale-[0.99]' : 'hover:bg-slate-50/80'}`}
                    onMouseEnter={() => handleRowMouseEnter(project.id)}
                    onMouseLeave={handleRowMouseLeave}
                  >
                    <TableCell className="py-5">
                      <div className="space-y-2">
                        <Link 
                          href={`/projects/${project.id}`}
                          className="font-semibold text-slate-800 hover:text-blue-600 transition-colors text-lg"
                        >
                          {project.title}
                        </Link>
                        <p className="text-sm text-slate-500 line-clamp-1 leading-relaxed">
                          {project.description.length > 100 
                            ? `${project.description.substring(0, 50)}...` 
                            : project.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-5">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(project.status)} 'font-medium py-1.5 px-3 rounded-full shadow-sm transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`}
                      >
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(project.status)}
                          {project.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium py-5">
                      <div className="flex items-center justify-end gap-1.5 text-slate-700">
                        <DollarSign className={`h-4 w-4 ${isHovered ? 'text-blue-500' : 'text-slate-400'} transition-colors duration-200`} />
                        {project.goal.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium py-5">
                      <div className="flex items-center justify-end gap-1.5 text-slate-700">
                        <TrendingUp className={`h-4 w-4 ${isHovered ? 'text-green-500' : 'text-green-400'} transition-colors duration-200`} />
                        {project.raised.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className={`font-medium ${progressPercentage > 50 ? 'text-green-600' : 'text-blue-600'}`}>
                            {progressPercentage.toFixed(1)}%
                          </span>
                          <span className="text-slate-500 text-xs">
                            ${project.raised.toLocaleString()} / ${project.goal.toLocaleString()}
                          </span>
                        </div>
                        <Progress 
                          value={progressPercentage} 
                          className={`h-2.5 rounded-full ${isHovered ? 'scale-y-125' : ''} transition-transform duration-200`}
                          style={{
                            background: 'linear-gradient(to right, #f0f4f8, #e1effe)',
                            backgroundSize: '100% 100%',
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-500 py-5">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar className={`h-4 w-4 ${isHovered ? 'text-blue-500' : 'text-slate-400'} transition-colors duration-200`} />
                        {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-5">
                      <div className={`transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-80'}`}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`h-9 w-9 rounded-full p-0 transition-all duration-200 ${isHovered ? 'bg-white shadow-md hover:shadow-lg border border-blue-100 hover:border-blue-200 hover:scale-110' : 'hover:bg-blue-50/50'}`}
                            >
                              <MoreHorizontal className={`h-4 w-4 ${isHovered ? 'text-blue-500' : 'text-slate-400'}`} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-xl border-slate-100 shadow-xl bg-white/95 backdrop-blur-sm p-1.5 animate-in zoom-in-95 duration-100">
                            <DropdownMenuLabel className="text-slate-500 font-normal text-xs px-3 py-2">Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild className="rounded-lg focus:bg-blue-50 focus:text-blue-600 px-3 py-2.5 text-slate-700 cursor-pointer">
                              <Link href={`/projects/${project.id}`} className="flex items-center">
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-lg focus:bg-blue-50 focus:text-blue-600 px-3 py-2.5 text-slate-700 cursor-pointer">
                              <Link href={`/projects/${project.id}/edit`} className="flex items-center">
                                <Edit className="mr-2 h-4 w-4 text-blue-500" />
                                Edit Project
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-slate-100" />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(project.id)}
                              className="rounded-lg focus:bg-red-50 text-red-500 focus:text-red-600 px-3 py-2.5 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-20 animate-pulse" />
              <FolderOpen className="relative mx-auto h-16 w-16 text-blue-500 animate-float" />
            </div>
            <h3 className="mt-6 text-xl font-semibold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              No projects found
            </h3>
            <p className="mt-3 text-slate-600 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria to find what you are looking for.'
                : 'Start your fundraising journey by creating your first project.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button 
                asChild 
                className="mt-6 h-11 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Link href="/projects/create" className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Project
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
