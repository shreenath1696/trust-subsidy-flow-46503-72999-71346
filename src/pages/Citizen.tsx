import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletView } from "@/components/citizen/WalletView";
import { QRScanner } from "@/components/citizen/QRScanner";
import { TransactionHistory } from "@/components/citizen/TransactionHistory";
import { Home, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const Citizen = () => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/5 via-background to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(var(--secondary)/0.1)_0%,_transparent_50%)]"></div>
      
      <header className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <Wallet className="h-7 w-7 text-secondary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  Digital Subsidy Portal
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

      <main className="container mx-auto px-4 py-8 max-w-2xl relative z-10">
        <div className="space-y-6">
          <WalletView onScanClick={() => setShowScanner(true)} />
          
          {showScanner && (
            <QRScanner onClose={() => setShowScanner(false)} />
          )}
          
          <TransactionHistory />
        </div>
      </main>
    </div>
  );
};

export default Citizen;
