import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Users, IndianRupee, TrendingUp, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const disbursementData = [
  { month: "Jan", amount: 320 },
  { month: "Feb", amount: 380 },
  { month: "Mar", amount: 420 },
  { month: "Apr", amount: 390 },
  { month: "May", amount: 450 },
  { month: "Jun", amount: 480 },
];

const categoryData = [
  { name: "Fertilizer", value: 35, color: "hsl(158 64% 52%)" },
  { name: "Education", value: 25, color: "hsl(231 48% 48%)" },
  { name: "Food", value: 20, color: "hsl(25 95% 53%)" },
  { name: "Healthcare", value: 15, color: "hsl(280 70% 60%)" },
  { name: "Others", value: 5, color: "hsl(220 13% 46%)" },
];

export const DashboardOverview = () => {
  const [metrics, setMetrics] = useState([
    { label: "Total Disbursed", value: "₹0", change: "+0%", icon: IndianRupee, color: "text-secondary" },
    { label: "Beneficiaries", value: "0", change: "+0%", icon: Users, color: "text-primary" },
    { label: "Transactions", value: "0", change: "+0%", icon: TrendingUp, color: "text-accent" },
    { label: "Active Programs", value: "0", change: "+0", icon: MapPin, color: "text-secondary" },
  ]);

  useEffect(() => {
    fetchMetrics();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subsidies' }, () => {
        fetchMetrics();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchMetrics();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMetrics = async () => {
    // Get total disbursed and beneficiaries
    const { data: subsidies } = await supabase
      .from('subsidies')
      .select('total_disbursed, total_beneficiaries');
    
    const totalDisbursed = subsidies?.reduce((sum, s) => sum + (s.total_disbursed || 0), 0) || 0;
    const totalBeneficiaries = subsidies?.reduce((sum, s) => sum + (s.total_beneficiaries || 0), 0) || 0;
    
    // Get transaction count
    const { count: txCount } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });
    
    // Get active programs
    const { count: programCount } = await supabase
      .from('subsidies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    setMetrics([
      { label: "Total Disbursed", value: `₹${totalDisbursed.toLocaleString()}`, change: "+12.5%", icon: IndianRupee, color: "text-secondary" },
      { label: "Beneficiaries", value: totalBeneficiaries.toString(), change: "+8.3%", icon: Users, color: "text-primary" },
      { label: "Transactions", value: (txCount || 0).toString(), change: "+15.7%", icon: TrendingUp, color: "text-accent" },
      { label: "Active Programs", value: (programCount || 0).toString(), change: "+0", icon: MapPin, color: "text-secondary" },
    ]);
  };
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                <h3 className="text-3xl font-bold mt-2">{metric.value}</h3>
                <p className="text-sm text-secondary mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  {metric.change}
                </p>
              </div>
              <metric.icon className={`h-12 w-12 ${metric.color} opacity-80`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Disbursement (₹ Lakhs)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={disbursementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)"
                }} 
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Subsidy Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
