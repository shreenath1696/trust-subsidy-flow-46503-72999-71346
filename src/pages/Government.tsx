import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/government/DashboardOverview";
import { SubsidyManagement } from "@/components/government/SubsidyManagement";
import { RealtimeTracking } from "@/components/government/RealtimeTracking";
import { AuditTrail } from "@/components/government/AuditTrail";
import { Home, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Government = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Government Dashboard</h1>
                <p className="text-sm text-muted-foreground">Subsidy Management & Monitoring</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subsidies">Subsidies</TabsTrigger>
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="subsidies" className="space-y-6">
            <SubsidyManagement />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <RealtimeTracking />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditTrail />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Government;
