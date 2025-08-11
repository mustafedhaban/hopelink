"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, DollarSign, Heart, ArrowLeft, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";

interface Donation {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  donorName: string;
  donorEmail: string;
  project: {
    id: string;
    title: string;
    description: string;
    status: string;
  };
}

export default function DonationHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/signin?callbackUrl=/donations/history");
      return;
    }

    fetchDonationHistory();
  }, [session, status, router]);

  const fetchDonationHistory = async () => {
    try {
      const response = await fetch("/api/donations/history");
      const data = await response.json();

      if (response.ok) {
        setDonations(data.donations || []);
      } else {
        setError(data.error || "Failed to fetch donation history");
      }
    } catch (err) {
      setError("An error occurred while fetching your donations");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalDonated = donations
    .filter(d => d.status.toLowerCase() === 'completed')
    .reduce((sum, donation) => sum + donation.amount, 0);

  if (status === "loading" || isLoading) {
    return (
      <Shell>
        <PageHeader
          heading="Donation History"
          text="Loading your donation history..."
        />
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <PageHeader
        heading="Donation History"
        text="View all your past donations and their impact"
      />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donated</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalDonated.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold">{donations.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projects Supported</p>
                <p className="text-2xl font-bold">
                  {new Set(donations.map(d => d.project.id)).size}
                </p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donations List */}
      <div className="space-y-4">
        {donations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
              <p className="text-muted-foreground mb-4">
                You have not made any donations yet. Start supporting projects that matter to you.
              </p>
              <Button onClick={() => router.push("/donations")}>
                Make Your First Donation
              </Button>
            </CardContent>
          </Card>
        ) : (
          donations.map((donation) => (
            <Card key={donation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {donation.project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {donation.project.description}
                        </p>
                      </div>
                      <Badge className={getStatusColor(donation.status)}>
                        {donation.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {format(new Date(donation.createdAt), "MMM d, yyyy")}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={getProjectStatusColor(donation.project.status)}
                      >
                        Project: {donation.project.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ${donation.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Donation Amount
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/projects/${donation.project.id}`)}
                      className="flex items-center gap-2"
                    >
                      View Project
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {donations.length > 0 && (
        <div className="mt-8 text-center">
          <Button 
            onClick={() => router.push("/donations")}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Make Another Donation
          </Button>
        </div>
      )}
    </Shell>
  );
}
