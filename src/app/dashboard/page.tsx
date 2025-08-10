import { getServerSession } from "next-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, FolderOpen, DollarSign, TrendingUp, Plus, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "User";
  const userRole = session?.user?.role || "DONOR";
  
  // Fetch real data from database
  const [projects, totalDonations] = await Promise.all([
    prisma.project.count(),
    prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
    }),
  ]);
  
  const activeProjects = await prisma.project.count({
    where: {
      status: "ACTIVE",
    },
  });
  
  const recentActivity = await prisma.project.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      status: true,
    },
  });

  return (
    <Shell>
      <PageHeader 
        heading={`Welcome back, ${userName}!`}
        text="Here's what's happening with your projects and donations."
      />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{projects}</div>
              <p className="text-xs text-muted-foreground">
                {projects === 0 ? "No projects yet" : `${projects} project${projects !== 1 ? 's' : ''} created`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalDonations._sum.amount?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalDonations._sum.amount ? "Total raised" : "No donations yet"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                {activeProjects === 0 ? "No active projects" : `${activeProjects} active project${activeProjects !== 1 ? 's' : ''}`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {userRole}
              </div>
              <p className="text-xs text-muted-foreground">
                Account type
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest project updates and donations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {
                recentActivity.length > 0 ? (
                  <ul className="space-y-4">
                    {recentActivity.map((activity) => (
                      <li key={activity.id} className="flex items-center justify-between">
                        <Link href={`/projects/${activity.id}`} className="flex-grow">
                          <div className="font-medium hover:underline">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Created on {new Date(activity.createdAt).toLocaleDateString()}
                          </div>
                        </Link>
                        <span className="text-sm font-semibold capitalize px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {activity.status.toLowerCase()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent activity</p>
                    <p className="text-sm">Start by creating a project or making a donation</p>
                  </div>
                )
              }
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/projects/create">
                <Button className="w-full justify-start" variant="outline">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </Link>
              <Link href="/projects">
                <Button className="w-full justify-start" variant="outline">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  View All Projects
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Make a Donation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </CardContent>
          </Card>
        </div>
    </Shell>
  );
}