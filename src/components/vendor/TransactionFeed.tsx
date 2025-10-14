import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

export const TransactionFeed = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('vendor-transactions')
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
      .eq('vendor_id', 'V001')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (!error && data) {
      setTransactions(data);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">Recent Payments</h3>
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
              className="p-4 border rounded-lg hover:border-accent transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <h4 className="font-semibold">{tx.citizen_wallets?.citizen_name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{tx.purpose}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-secondary">₹{tx.amount}</p>
                  <p className="text-xs text-secondary">Settled</p>
                </div>
              </div>
              <div className="pt-2 border-t">
                <code className="text-xs text-muted-foreground">{tx.id.slice(0, 12)}...</code>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
