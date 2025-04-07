
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { EnhancedSystemStatus } from "@/components/admin/dashboard/EnhancedSystemStatus";
import SystemStatusPanel from "@/components/admin/dashboard/SystemStatusPanel";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { useDashboardRefresh } from "@/hooks/useDashboardRefresh";

export default function Dashboard() {
  const { status, isLoading, error, refresh } = useSystemStatus();
  const { status: dashboardStatus } = useDashboardRefresh();
  
  const handleRefresh = () => {
    refresh();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <LayoutDashboard className="mr-2 h-6 w-6" /> Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            {status && !isLoading ? (
              <SystemStatusPanel status={status} isLoading={isLoading} error={error} onRefresh={handleRefresh} />
            ) : (
              <div className="py-6 text-center">Loading system status...</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system-status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">System Overview</h2>
              <p>Welcome to the Banks o' Dee admin dashboard.</p>
              <div className="mt-4">
                <Button onClick={handleRefresh}>Refresh Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Analytics</h2>
              <p>Analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-status" className="mt-4">
          <EnhancedSystemStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
}
