'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatRoleName, getAvailableRoles } from '@/lib/auth-utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldAlert, ShieldCheck, Users } from 'lucide-react';

interface RoleInfo {
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export default function AdminRolesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [roleStats, setRoleStats] = useState<Record<string, number>>({});
  
  // Redirect if not admin
  useEffect(() => {
    if (session && session.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Fetch role statistics
  useEffect(() => {
    const fetchRoleStats = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        
        // Count users by role
        const stats: Record<string, number> = {};
        data.forEach((user: any) => {
          const role = user.role || 'GUEST';
          stats[role] = (stats[role] || 0) + 1;
        });
        
        setRoleStats(stats);
      } catch (error) {
        console.error('Error fetching role statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleStats();
  }, []);

  // Role definitions with descriptions and permissions
  const roleDefinitions: RoleInfo[] = [
    {
      name: 'ADMIN',
      description: 'Full system access with user management capabilities',
      permissions: [
        'Manage users and roles',
        'Create, edit, and delete projects',
        'Approve donations',
        'Access all system features',
        'View system analytics'
      ],
      userCount: roleStats['ADMIN'] || 0
    },
    {
      name: 'MANAGER',
      description: 'Project management capabilities',
      permissions: [
        'Create, edit, and delete projects',
        'Approve donations',
        'View donor information',
        'Post project updates'
      ],
      userCount: roleStats['MANAGER'] || 0
    },
    {
      name: 'DONOR',
      description: 'Standard user with donation capabilities',
      permissions: [
        'Make donations to projects',
        'View project details',
        'Track donation history',
        'Receive project updates'
      ],
      userCount: roleStats['DONOR'] || 0
    },
    {
      name: 'GUEST',
      description: 'Limited access for unregistered or basic users',
      permissions: [
        'View public project information',
        'Create an account',
        'Browse available projects'
      ],
      userCount: roleStats['GUEST'] || 0
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading role information...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Role Management</CardTitle>
          <CardDescription>
            Overview of system roles and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {roleDefinitions.map((role) => (
              <Card key={role.name} className={`border-l-4 ${
                role.name === 'ADMIN' ? 'border-l-purple-500' :
                role.name === 'MANAGER' ? 'border-l-blue-500' :
                role.name === 'DONOR' ? 'border-l-green-500' :
                'border-l-gray-500'
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">
                      {formatRoleName(role.name)}
                    </CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{role.userCount}</span>
                    </Badge>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-medium mb-2">Permissions:</h4>
                  <ul className="text-sm space-y-1">
                    {role.permissions.map((permission, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Role Assignment Statistics</h3>
            <Table>
              <TableCaption>Current distribution of user roles in the system</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">User Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleDefinitions.map((role) => (
                  <TableRow key={role.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          role.name === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          role.name === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                          role.name === 'DONOR' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {formatRoleName(role.name)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell className="text-right">{role.userCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}