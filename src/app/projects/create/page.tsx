"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { CalendarIcon, Loader2, DollarSign, FileText, Calendar, Type, Target, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function CreateProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Project title is required");
      setIsLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Project description is required");
      setIsLoading(false);
      return;
    }

    if (!formData.goal || parseFloat(formData.goal) <= 0) {
      setError("Please enter a valid goal amount");
      setIsLoading(false);
      return;
    }

    if (!startDate) {
      setError("Please select a start date");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          goal: parseFloat(formData.goal),
          startDate: startDate.toISOString(),
          endDate: endDate?.toISOString() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create project");
        return;
      }

      toast.success("Project created successfully!");
      router.push(`/projects/${data.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!session) {
    router.push("/signin");
    return null;
  }

  return (
    <Shell>
        <PageHeader
          heading="Create New Project"
          text="Create a new fundraising project to track donations and share updates with your community."
        />

        <div className="max-w-3xl mx-auto">
          <Card className="bg-white border-0 rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-50 via-indigo-50/30 to-purple-50/30 opacity-70"></div>
            <CardHeader className="relative z-10 pt-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <CardTitle className="text-2xl font-semibold text-slate-800">
                  Project Details
                </CardTitle>
              </div>
              <CardDescription className="text-slate-500 text-base">
                Fill in the information below to create your new project. You can edit these details later.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pb-8 pt-4 space-y-8">
              {error && (
                <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-800 rounded-xl">
                  <AlertDescription className="flex items-center gap-2">
                    <span className="text-red-500 text-xl">⚠️</span>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Title */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Type className="h-4 w-4 text-blue-500" />
                    <Label htmlFor="title" className="text-sm font-medium text-slate-700">Project Title *</Label>
                  </div>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter a compelling title for your project"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                    className="h-12 px-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                  />
                </div>

                {/* Project Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <Label htmlFor="description" className="text-sm font-medium text-slate-700">Project Description *</Label>
                  </div>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your project in detail. What are your goals? How will the funds be used?"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                    rows={6}
                    className="px-4 py-3 rounded-xl border-slate-200 bg-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                  />
                </div>

                {/* Funding Goal */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-blue-500" />
                    <Label htmlFor="goal" className="text-sm font-medium text-slate-700">Funding Goal *</Label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">$</span>
                    <Input
                      id="goal"
                      name="goal"
                      type="number"
                      placeholder="0.00"
                      value={formData.goal}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                      min="0"
                      step="0.01"
                      className="h-12 pl-8 pr-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-slate-800"
                    />
                  </div>
                  <p className="text-xs text-slate-500 pl-2">Set a realistic funding goal that covers your project needs</p>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <Label className="text-sm font-medium text-slate-700">Start Date *</Label>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 rounded-xl border-slate-200 bg-white shadow-sm hover:bg-slate-50 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50",
                            !startDate && "text-slate-500"
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                          {startDate ? format(startDate, "PPP") : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End Date */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <Label className="text-sm font-medium text-slate-700">End Date (Optional)</Label>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 rounded-xl border-slate-200 bg-white shadow-sm hover:bg-slate-50 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50",
                            !endDate && "text-slate-500"
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                          {endDate ? format(endDate, "PPP") : "Select end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) =>
                            startDate ? date < startDate : false
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-800 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Project</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
    </Shell>
  );
}
