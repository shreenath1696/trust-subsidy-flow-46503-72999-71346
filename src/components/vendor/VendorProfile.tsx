import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";

export const VendorProfile = () => {
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    fetchVendor();
  }, []);

  const fetchVendor = async () => {
    const { data } = await supabase
      .from('vendors' as any)
      .select('*')
      .eq('vendor_id', 'V001')
      .single();
    
    if (data) {
      setVendor(data);
    }
  };

  if (!vendor) {
    return (
      <Card className="p-6 sticky top-24">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 sticky top-24 shadow-lg border-2 hover:shadow-xl transition-all animate-fade-in">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <div className="p-5 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl shadow-md">
            <Store className="h-14 w-14 text-accent" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold">{vendor.vendor_name}</h3>
          <Badge variant="secondary" className="mt-2">Authorized Vendor</Badge>
          <p className="text-xs text-muted-foreground mt-2 bg-muted/50 inline-block px-3 py-1 rounded-full">
            ID: {vendor.vendor_id}
          </p>
        </div>

        <div className="p-8 bg-white dark:bg-card rounded-xl border-2 border-dashed border-accent/30 hover:border-accent transition-colors shadow-inner">
          <QRCodeSVG 
            value={vendor.qr_code}
            size={200}
            level="H"
            className="mx-auto"
          />
          <p className="text-xs text-muted-foreground mt-5 flex items-center justify-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            Customers scan this to pay
          </p>
        </div>

        <div className="pt-5 border-t space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground font-medium">Business Type</span>
            <span className="font-bold text-foreground">{vendor.business_type}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground font-medium">Status</span>
            <span className={`font-bold flex items-center gap-1.5 ${vendor.is_active ? 'text-secondary' : 'text-muted-foreground'}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${vendor.is_active ? 'bg-secondary animate-pulse' : 'bg-muted-foreground'}`}></span>
              {vendor.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
