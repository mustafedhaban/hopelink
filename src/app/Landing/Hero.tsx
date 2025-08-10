import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Users,
  BarChart3,
  Play,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const Hero = () => {
  const stats = {
    ngos_served: 500,
    transparency_score: 95,
    tracked_funding: 2000000
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M+`;
    } else if (num >= 1000) {
      return `${Math.floor(num / 1000)}+`;
    }
    return num.toString();
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-20">
      <div className="container max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Transparency First</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Empowering NGOs with{" "}
          <span className="text-primary relative">
            Transparent
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full"></div>
          </span>{" "}
          Project Management
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          HopeLink revolutionizes how NGOs manage projects, track impact,
          and build trust with donors through complete transparency and
          accountability.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="/signup">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
            <Link href="/projects">
              <Play className="mr-2 w-5 h-5" />
              View Projects
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 p-6 bg-card/50 backdrop-blur-sm border rounded-2xl">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">{formatNumber(stats.ngos_served)}</div>
              <div className="text-sm text-muted-foreground">NGOs Served</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 p-6 bg-card/50 backdrop-blur-sm border rounded-2xl">
            <div className="p-3 bg-primary/10 rounded-full">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">{stats.transparency_score}%</div>
              <div className="text-sm text-muted-foreground">Transparency Score</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 p-6 bg-card/50 backdrop-blur-sm border rounded-2xl">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">{formatNumber(stats.tracked_funding)}</div>
              <div className="text-sm text-muted-foreground">Tracked Funding</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
