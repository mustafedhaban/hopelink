import React from "react";
import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-col gap-8 p-4 md:p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}