import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Wheat, GraduationCap, ShoppingBasket, Heart, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WalletViewProps {
  onScanClick: () => void;
}

const iconMap: Record<string, any> = {
  "Fertilizer": Wheat,
  "Education": GraduationCap,
  "Food": ShoppingBasket,
  "Healthcare": Heart,
};

export const WalletView = ({ onScanClick }: WalletViewProps) => {
  const [wallet, setWallet] = useState<any>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchWalletData();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('wallet-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'citizen_wallets' }, () => {
        fetchWalletData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'citizen_vouchers' }, () => {
        fetchWalletData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchWalletData = async () => {
    // Get first citizen wallet (demo - in real app would be user-specific)
    const { data: walletData } = await supabase
      .from('citizen_wallets')
      .select('*')
      .eq('citizen_id', 'C001')
      .single();
    
    if (walletData) {
      setWallet(walletData);
      setTotalBalance(walletData.total_balance || 0);
      
      // Get vouchers
      const { data: vouchersData } = await supabase
        .from('citizen_vouchers')
        .select('*')
        .eq('wallet_id', walletData.id)
        .eq('status', 'active');
      
      if (vouchersData) {
        setVouchers(vouchersData);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80 text-white relative overflow-hidden shadow-xl animate-fade-in">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <p className="text-sm opacity-90 mb-2 font-medium">Total Available Balance</p>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">₹{totalBalance.toLocaleString()}</h2>
          <Button 
            size="lg" 
            className="w-full bg-white text-secondary hover:bg-white/90 text-lg h-14 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] font-semibold"
            onClick={onScanClick}
          >
            <QrCode className="h-6 w-6 mr-2" />
            Scan & Pay
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold px-1 flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          My Vouchers
        </h3>
        {vouchers.length === 0 ? (
          <Card className="p-10 text-center border-2 border-dashed animate-fade-in">
            <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground font-medium">No vouchers available yet</p>
            <p className="text-sm text-muted-foreground mt-2">Vouchers will appear here when government issues subsidies</p>
          </Card>
        ) : (
          vouchers.map((voucher, index) => {
            const Icon = iconMap[voucher.purpose.split(' ')[0]] || Coins;
            return (
              <Card key={voucher.id} className="p-6 hover:shadow-lg transition-all duration-300 hover:border-secondary group border-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-secondary/10 to-secondary/5 text-secondary group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{voucher.purpose}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        Purpose-bound voucher
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-secondary">₹{voucher.amount}</p>
                    <p className="text-xs text-muted-foreground font-medium">Available</p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
