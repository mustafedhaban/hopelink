import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navigation from "@/components/layout/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If user is signed in, use dashboard layout without navigation
  if (session) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // If user is not signed in, show navigation
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
