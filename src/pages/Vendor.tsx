import { Card } from "@/components/ui/card";
import { VendorProfile } from "@/components/vendor/VendorProfile";
import { TransactionFeed } from "@/components/vendor/TransactionFeed";
import { SettlementHistory } from "@/components/vendor/SettlementHistory";
import { Home, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Vendor = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--accent)/0.1)_0%,_transparent_50%)]"></div>
      
      <header className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-xl">
                <Store className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Vendor Portal</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  Payment & Settlement Dashboard
                </p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <VendorProfile />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <TransactionFeed />
            <SettlementHistory />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Vendor;
