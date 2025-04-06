
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { StatusItem } from './StatusItem';
import { SystemStatusItemProps } from '@/types/system';

// Example quick action items
const quickActionItems = [
  {
    name: "News Articles",
    count: 3,
    color: "bg-blue-500",
    icon: require('lucide-react').FileText,
    viewAllLink: "/admin/news",
    status: "active"
  },
  {
    name: "Fixtures",
    count: 2,
    color: "bg-amber-500",
    icon: require('lucide-react').Calendar,
    viewAllLink: "/admin/fixtures",
    status: "warning"
  },
  {
    name: "Team Members",
    count: 5,
    color: "bg-green-500",
    icon: require('lucide-react').Users,
    viewAllLink: "/admin/team",
    status: "active"
  },
  {
    name: "Sponsors",
    count: 1,
    color: "bg-purple-500",
    icon: require('lucide-react').Briefcase,
    viewAllLink: "/admin/sponsors",
    status: "active"
  }
] as SystemStatusItemProps[];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className = "" }: QuickActionsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 ${className}`}>
      {quickActionItems.map((item, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="p-4">
            <CardTitle className="text-base font-medium">{item.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <StatusItem
              name={item.name}
              count={item.count}
              color={item.color}
              icon={item.icon}
              viewAllLink={item.viewAllLink}
              status={item.status}
            />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
              <a href={item.viewAllLink}>
                <span>View All</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
