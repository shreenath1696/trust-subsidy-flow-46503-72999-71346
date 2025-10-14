import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Wallet, Store, ArrowRight, Sparkles, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex justify-end mb-4 animate-fade-in">
          <Link to="/auth">
            <Button variant="outline" className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 animate-pulse" />
            Zero-Leakage Subsidy Management
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Digital Subsidy
            <br />
            <span className="text-foreground">Platform</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Purpose-bound digital vouchers with <span className="font-semibold text-secondary">100% transparency</span>. Track every rupee from government to citizen to vendor.
          </p>
          <div className="flex gap-4 justify-center items-center pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse"></div>
              <span>Live Tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse"></div>
              <span>Instant Settlement</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary group relative overflow-hidden backdrop-blur-sm bg-card/50 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Government Portal</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Issue, manage, and track subsidies in real-time. Complete transparency with zero leakage.
              </p>
              <Link to="/government">
                <Button className="w-full group-hover:shadow-lg shadow-[0_0_20px_hsl(var(--primary)/0.2)] group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all" size="lg">
                  Access Dashboard
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary group relative overflow-hidden backdrop-blur-sm bg-card/50 animate-fade-in [animation-delay:100ms]">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-secondary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_30px_hsl(var(--secondary)/0.3)]">
                  <Wallet className="h-12 w-12 text-secondary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">Citizen Wallet</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Receive digital vouchers and spend them easily using QR codes. Simple and secure.
              </p>
              <Link to="/citizen">
                <Button variant="secondary" className="w-full group-hover:shadow-lg shadow-[0_0_20px_hsl(var(--secondary)/0.2)] group-hover:shadow-[0_0_30px_hsl(var(--secondary)/0.4)] transition-all" size="lg">
                  Open Wallet
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-accent group relative overflow-hidden backdrop-blur-sm bg-card/50 animate-fade-in [animation-delay:200ms]">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-flex p-4 bg-accent/10 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)]">
                  <Store className="h-12 w-12 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">Vendor Portal</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Accept digital payments and receive instant settlement. Guaranteed funds transfer.
              </p>
              <Link to="/vendor">
                <Button variant="outline" className="w-full group-hover:shadow-lg border-accent hover:bg-accent hover:text-accent-foreground transition-all shadow-[0_0_20px_hsl(var(--accent)/0.2)] hover:shadow-[0_0_30px_hsl(var(--accent)/0.4)]" size="lg">
                  Vendor Login
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="mt-20 max-w-4xl mx-auto animate-fade-in-up [animation-delay:300ms]">
          <Card className="p-10 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-8 text-center">How It Works</h3>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center space-y-3 group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-2xl font-bold mb-2 group-hover:scale-110 transition-transform shadow-lg">
                    1
                  </div>
                  <h4 className="font-bold text-lg">Government Issues</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Digital vouchers sent directly to citizen wallets with instant notification</p>
                </div>
                <div className="text-center space-y-3 group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary-glow text-secondary-foreground text-2xl font-bold mb-2 group-hover:scale-110 transition-transform shadow-lg">
                    2
                  </div>
                  <h4 className="font-bold text-lg">Citizen Spends</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Scan vendor QR code to make secure purpose-bound payments instantly</p>
                </div>
                <div className="text-center space-y-3 group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-glow text-accent-foreground text-2xl font-bold mb-2 group-hover:scale-110 transition-transform shadow-lg">
                    3
                  </div>
                  <h4 className="font-bold text-lg">Vendor Receives</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Instant settlement with complete transaction verification and tracking</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
