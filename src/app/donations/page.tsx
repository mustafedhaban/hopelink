"use client";

import { useState, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Prisma } from '@prisma/client';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Heart, History } from "lucide-react";

type Project = Prisma.ProjectGetPayload<object>

export default function DonationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [cancelledPayment, setCancelledPayment] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        setError("Failed to load projects.");
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    // Check if payment was cancelled
    if (searchParams.get('canceled') === 'true') {
      setCancelledPayment(true);
    }
  }, [searchParams]);

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

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setError("Please enter a valid donation amount.");
        return;
    }
    if (!formData.projectId) {
        setError("Please select a project to donate to.");
        return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");
  
    try {
        const stripe = await stripePromise;
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
            const { sessionId } = data;
            if (!stripe) throw new Error('Stripe failed to load');
            const result = await stripe.redirectToCheckout({ sessionId });
  
            if (result.error) {
                setError(result.error.message || "Payment processing failed");
            } else {
                setSuccess("Redirecting to payment...");
            }
        }
    } catch (err) {
        setError("An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
};

  return (
    <Shell>
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          heading="Make a Donation"
          text="Support a project that matters to you."
        />
        {session && (
          <Button
            variant="outline"
            onClick={() => router.push("/donations/history")}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            My Donations
          </Button>
        )}
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Donation Form</CardTitle>
            <CardDescription>Your contribution makes a difference.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {cancelledPayment && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Payment was cancelled. No charges were made to your account.
                  </AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <Heart className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
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
                    {projects && projects.length > 0 ? (
                      projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-projects">No projects available</SelectItem>
                    )}
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
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Donate Now
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
