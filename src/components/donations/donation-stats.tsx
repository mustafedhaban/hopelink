"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, Target } from "lucide-react";

interface DonationStats {
  totalAmount: number;
  donationCount: number;
  averageDonation: number;
  uniqueDonors: number;
  goalProgress?: {
    current: number;
    target: number;
    percentage: number;
  };
}

interface DonationStatsProps {
  projectId?: string;
}

export function DonationStats({ projectId }: DonationStatsProps) {
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDonationStats();
  }, [projectId]);

  const fetchDonationStats = async () => {
    try {
      const url = projectId 
        ? `/api/donations/stats?projectId=${projectId}`
        : `/api/donations/stats`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
      } else {
        setError(data.error || "Failed to fetch donation statistics");
      }
    } catch (err) {
      setError("An error occurred while fetching statistics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            {error || "Unable to load statistics"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.totalAmount.toFixed(2)}
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
                <p className="text-2xl font-bold">{stats.donationCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Donation</p>
                <p className="text-2xl font-bold">
                  ${stats.averageDonation.toFixed(2)}
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Donors</p>
                <p className="text-2xl font-bold">{stats.uniqueDonors}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress (if available) */}
      {stats.goalProgress && (
        <Card>
          <CardHeader>
            <CardTitle>Funding Progress</CardTitle>
            <CardDescription>
              Progress towards the funding goal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  ${stats.goalProgress.current.toFixed(2)} raised of ${stats.goalProgress.target.toFixed(2)} goal
                </p>
              </div>
              <Badge 
                variant={stats.goalProgress.percentage >= 100 ? "default" : "secondary"}
              >
                {stats.goalProgress.percentage.toFixed(1)}%
              </Badge>
            </div>
            
            <Progress 
              value={Math.min(stats.goalProgress.percentage, 100)} 
              className="h-3"
            />
            
            {stats.goalProgress.percentage >= 100 && (
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800">
                  🎉 Goal Achieved!
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
