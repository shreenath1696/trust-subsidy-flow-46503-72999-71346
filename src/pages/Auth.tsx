import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome, Sparkles, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Session } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session) {
          navigate("/");
        }
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "You've successfully signed in.",
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Secure Access
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Welcome Back
            </h1>
            <p className="text-lg text-muted-foreground">
              Sign in to access your digital subsidy platform
            </p>
          </div>

          <Card className="p-8 backdrop-blur-sm bg-card/50 border-2 relative overflow-hidden animate-fade-in [animation-delay:100ms]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex p-4 bg-primary/10 rounded-2xl shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={signInWithGoogle}
                  disabled={loading}
                  size="lg"
                  className="w-full shadow-[0_0_20px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all group"
                >
                  <Chrome className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  {loading ? "Signing in..." : "Continue with Google"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Secure OAuth 2.0
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Sign in to manage your subsidies, vouchers, and transactions
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground animate-fade-in [animation-delay:200ms]">
            <p>
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
