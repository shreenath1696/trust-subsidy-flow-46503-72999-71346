import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const subsidyTypes = [
  "Fertilizer Subsidy",
  "Education Voucher",
  "Food Support",
  "Healthcare Aid",
  "Old Age Pension"
];

export const SubsidyManagement = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    beneficiaries: "",
    purpose: ""
  });
  const [subsidies, setSubsidies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubsidies();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('subsidies-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subsidies' }, () => {
        fetchSubsidies();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSubsidies = async () => {
    const { data, error } = await supabase
      .from('subsidies')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setSubsidies(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create subsidy
      const { data: subsidy, error: subsidyError } = await supabase
        .from('subsidies')
        .insert({
          name: formData.type,
          purpose: formData.purpose,
          amount: parseFloat(formData.amount),
        })
        .select()
        .single();

      if (subsidyError) throw subsidyError;

      // Get all citizen wallets and add vouchers
      const { data: wallets, error: walletsError } = await supabase
        .from('citizen_wallets')
        .select('id');

      if (walletsError) throw walletsError;

      // Create vouchers for each citizen
      const vouchersToInsert = wallets.map(wallet => ({
        wallet_id: wallet.id,
        subsidy_id: subsidy.id,
        amount: parseFloat(formData.amount),
        purpose: formData.type,
        status: 'active'
      }));

      const { error: vouchersError } = await supabase
        .from('citizen_vouchers')
        .insert(vouchersToInsert);

      if (vouchersError) throw vouchersError;

      toast({
        title: "Subsidy Issued Successfully",
        description: `₹${formData.amount} disbursed to all citizens`,
      });
      
      setFormData({ type: "", amount: "", beneficiaries: "", purpose: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Issue New Subsidy</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Subsidy Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select subsidy type" />
              </SelectTrigger>
              <SelectContent>
                {subsidyTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount per Beneficiary (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="1500"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="beneficiaries">Number of Beneficiaries</Label>
            <Input
              id="beneficiaries"
              type="number"
              placeholder="5000"
              value={formData.beneficiaries}
              onChange={(e) => setFormData({...formData, beneficiaries: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose Description</Label>
            <Input
              id="purpose"
              placeholder="E.g., Q2 Fertilizer Support Program"
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Disbursing..." : "Disburse Funds"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6">Active Subsidy Programs</h3>
        <div className="space-y-4">
          {subsidies.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No active subsidies yet</p>
          ) : (
            subsidies.map((program) => (
              <div key={program.id} className="p-4 border rounded-lg hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{program.name}</h4>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                    {program.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>Beneficiaries: <span className="text-foreground font-medium">{program.total_beneficiaries}</span></div>
                  <div>Disbursed: <span className="text-foreground font-medium">₹{program.total_disbursed?.toLocaleString()}</span></div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
