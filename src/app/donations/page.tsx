"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Prisma } from '@prisma/client';

type Project = Prisma.ProjectGetPayload<{}>;

export default function DonationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    amount: "",
    projectId: "",
    donorName: "",
    donorEmail: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects);
        }
      } catch (err) {
        setError("Failed to load projects.");
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        donorName: session.user.name || "",
        donorEmail: session.user.email || "",
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, projectId: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to process donation.");
      } else {
        setSuccess("Donation successful! Thank you for your contribution.");
        setFormData({
          amount: "",
          projectId: "",
          donorName: session?.user?.name || "",
          donorEmail: session?.user?.email || "",
        });
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Shell>
      <PageHeader
        heading="Make a Donation"
        text="Support a project that matters to you."
      />
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Donation Form</CardTitle>
            <CardDescription>Your contribution makes a difference.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="project">Select a Project</Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={formData.projectId}
                  required
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Choose a project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donorName">Your Name</Label>
                <Input
                  id="donorName"
                  name="donorName"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.donorName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donorEmail">Your Email</Label>
                <Input
                  id="donorEmail"
                  name="donorEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.donorEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Donate Now"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
