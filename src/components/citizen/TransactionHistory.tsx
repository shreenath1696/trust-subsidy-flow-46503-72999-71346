import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, ArrowDownLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('citizen-transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchTransactions();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTransactions = async () => {
    // Get wallet first
    const { data: wallet } = await supabase
      .from('citizen_wallets' as any)
      .select('id')
      .eq('citizen_id', 'C001')
      .single();
    
    if (!wallet) return;

    const { data, error } = await supabase
      .from('transactions' as any)
      .select('*')
      .eq('wallet_id', (wallet as any).id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (!error && data) {
      setTransactions(data);
    }
  };

  return (
    <Card className="p-6 shadow-lg border-2 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <History className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold">Recent Payments</h3>
          <p className="text-xs text-muted-foreground">Transaction history and details</p>
        </div>
        {transactions.length > 0 && (
          <Badge variant="secondary" className="animate-pulse">● Live</Badge>
        )}
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <History className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground font-medium">No transactions yet</p>
            <p className="text-sm text-muted-foreground">Your payment history will appear here</p>
          </div>
        ) : (
          transactions.map((tx, index) => (
            <div
              key={tx.id}
              className="p-5 border-2 rounded-xl hover:bg-muted/30 transition-all hover:shadow-md hover:border-secondary group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-secondary/10 rounded-lg group-hover:scale-110 transition-transform">
                      <ArrowDownLeft className="h-4 w-4 text-secondary" />
                    </div>
                    <h4 className="font-bold text-base">{tx.vendor_name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                    {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-secondary">₹{tx.amount}</p>
                  <Badge variant="outline" className="text-xs mt-1 border-secondary/50">{tx.purpose}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t text-xs">
                <code className="text-muted-foreground bg-muted/50 px-2 py-1 rounded">{tx.id.slice(0, 12)}...</code>
                <span className="text-secondary font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
