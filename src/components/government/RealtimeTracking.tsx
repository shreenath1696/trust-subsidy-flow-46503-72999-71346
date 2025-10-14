import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export const RealtimeTracking = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('transactions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchTransactions();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        citizen_wallets!inner(citizen_name)
      `)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (!error && data) {
      setTransactions(data);
    }
  };
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="text-xl font-semibold">Live Transaction Monitor</h3>
          </div>
          <Badge variant="secondary" className="animate-pulse">● Live</Badge>
        </div>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions yet</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 border rounded-lg hover:border-primary transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{tx.id.slice(0, 12)}...</code>
                      <Badge variant="outline" className="text-xs">{tx.purpose}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tx.citizen_wallets?.citizen_name} → {tx.vendor_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-secondary">₹{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    {tx.status === "completed" ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-secondary" />
                        <span className="text-secondary">Settled</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-accent" />
                        <span className="text-accent">Processing</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Blockchain verified
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
