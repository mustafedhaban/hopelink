"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface RecentDonation {
  id: string;
  amount: number;
  donorName: string;
  anonymous: boolean;
  createdAt: string;
  project: {
    id: string;
    title: string;
  };
}

interface RecentDonationsProps {
  projectId?: string;
  limit?: number;
  showProjectName?: boolean;
}

export function RecentDonations({ projectId, limit = 10, showProjectName = false }: RecentDonationsProps) {
  const [donations, setDonations] = useState<RecentDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecentDonations();
  }, [projectId]);

  const fetchRecentDonations = async () => {
    try {
      const url = projectId 
        ? `/api/donations/recent?projectId=${projectId}&limit=${limit}`
        : `/api/donations/recent?limit=${limit}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setDonations(data.donations || []);
      } else {
        setError(data.error || "Failed to fetch recent donations");
      }
    } catch (err) {
      setError("An error occurred while fetching donations");
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Recent Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center min-h-[100px]">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Recent Donations
        </CardTitle>
        <CardDescription>
          {projectId 
            ? "Latest donations to this project" 
            : "Recent donations across all projects"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-sm text-red-600 mb-4">{error}</div>
        )}
        
        {donations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No donations yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {donation.anonymous ? "?" : getInitials(donation.donorName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">
                        {donation.anonymous ? "Anonymous Donor" : donation.donorName}
                      </p>
                      {donation.anonymous && (
                        <Badge variant="secondary" className="text-xs">
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(donation.createdAt), "MMM d, yyyy")}
                      </span>
                      {showProjectName && (
                        <span className="truncate">
                          to {donation.project.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-green-600 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {donation.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
