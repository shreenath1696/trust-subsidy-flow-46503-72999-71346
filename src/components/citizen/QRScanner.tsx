import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, QrCode, CheckCircle2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onClose: () => void;
}

export const QRScanner = ({ onClose }: QRScannerProps) => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [amount, setAmount] = useState("");
  const [scannedVendorId, setScannedVendorId] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.log("Scanner already stopped");
      }
      scannerRef.current = null;
    }
  };

  const startScanner = async () => {
    setShowCamera(true);
    setScanning(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
          setScanning(false);
          await stopScanner();
          setScannedVendorId(decodedText);
          setShowCamera(false);
        },
        (errorMessage) => {
          // Ignore scan errors
        }
      );
    } catch (err: any) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
      setShowCamera(false);
      setScanning(false);
    }
  };

  const processPayment = async () => {
    if (!scannedVendorId || !amount) {
      toast({
        title: "Missing Information",
        description: "Please enter an amount",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    
    try {
      // Get vendor by QR code
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors' as any)
        .select('*')
        .eq('qr_code', scannedVendorId)
        .eq('is_active', true)
        .single();

      if (vendorError || !vendor) {
        toast({
          title: "Invalid QR Code",
          description: "Vendor not found or inactive",
          variant: "destructive"
        });
        onClose();
        return;
      }

      // Get citizen wallet
      const { data: wallet, error: walletError } = await supabase
        .from('citizen_wallets' as any)
        .select('id, total_balance')
        .eq('citizen_id', 'C001')
        .single();

      if (walletError || !wallet) {
        toast({
          title: "Error",
          description: "Wallet not found",
          variant: "destructive"
        });
        onClose();
        return;
      }

      const paymentAmount = parseFloat(amount);
      const walletBalance = (wallet as any).total_balance || 0;
      
      if (paymentAmount > walletBalance) {
        toast({
          title: "Insufficient Balance",
          description: `You only have ₹${walletBalance} available`,
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }

      // Get active voucher with enough balance
      const { data: voucher, error: voucherError } = await supabase
        .from('citizen_vouchers' as any)
        .select('*')
        .eq('wallet_id', (wallet as any).id)
        .eq('status', 'active')
        .gte('amount', paymentAmount)
        .limit(1)
        .single();

      if (voucherError || !voucher) {
        toast({
          title: "No Funds Available",
          description: "You don't have any active vouchers with sufficient balance",
          variant: "destructive"
        });
        onClose();
        return;
      }

      // Create transaction
      const { error: txError } = await supabase
        .from('transactions' as any)
        .insert({
          wallet_id: (wallet as any).id,
          voucher_id: (voucher as any).id,
          vendor_id: (vendor as any).vendor_id,
          vendor_name: (vendor as any).vendor_name,
          amount: paymentAmount,
          purpose: (voucher as any).purpose,
          status: 'completed'
        });

      if (txError) throw txError;

      // Update voucher - either mark as used or reduce amount
      if (paymentAmount >= (voucher as any).amount) {
        await supabase
          .from('citizen_vouchers' as any)
          .update({ status: 'used' })
          .eq('id', (voucher as any).id);
      }

      toast({
        title: "Payment Successful!",
        description: `₹${paymentAmount} paid to ${(vendor as any).vendor_name}`,
      });
      
      setTimeout(onClose, 2000);
      
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="fixed inset-4 z-50 overflow-hidden flex flex-col shadow-2xl border-2 animate-scale-in">
      <div className="p-5 border-b flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm">
        <h3 className="text-xl font-bold flex items-center gap-2">
          {scannedVendorId ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-secondary" />
              Enter Amount
            </>
          ) : (
            <>
              <QrCode className="h-5 w-5 text-primary" />
              Scan QR Code
            </>
          )}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-destructive/10 hover:text-destructive">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.1)_0%,_transparent_70%)]"></div>
        
        {showCamera && scanning ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 relative z-10">
            <div id="qr-reader" ref={readerRef} className="w-full max-w-md rounded-xl overflow-hidden shadow-xl border-2 border-primary/20"></div>
            <p className="text-center mt-6 text-muted-foreground flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <Camera className="h-4 w-4 animate-pulse" />
              Point camera at QR code to scan
            </p>
          </div>
        ) : scannedVendorId ? (
          <div className="w-full max-w-md p-8 space-y-6 relative z-10 animate-scale-in">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 bg-secondary/10 rounded-full mb-2 animate-glow-pulse">
                <CheckCircle2 className="h-20 w-20 text-secondary" />
              </div>
              <h4 className="text-2xl font-bold">QR Code Scanned!</h4>
              <p className="text-muted-foreground">Enter the payment amount below</p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-base font-semibold">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl h-16 text-center font-bold border-2 focus:border-secondary"
                autoFocus
              />
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              onClick={processPayment}
              disabled={processing || !amount}
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </span>
              ) : (
                `Pay ₹${amount || "0"}`
              )}
            </Button>
          </div>
        ) : processing ? (
          <div className="text-center space-y-6 relative z-10">
            <div className="inline-flex p-6 bg-primary/10 rounded-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-semibold">Processing Payment</p>
              <p className="text-muted-foreground">Please wait...</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md p-8 space-y-6 relative z-10 animate-fade-in">
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex p-6 bg-primary/10 rounded-full mb-2">
                <QrCode className="h-24 w-24 text-primary" />
              </div>
              <h4 className="text-2xl font-bold">Ready to Scan</h4>
              <p className="text-muted-foreground leading-relaxed">
                Click the button below to activate your camera and scan the vendor's QR code
              </p>
            </div>
            
            <Button 
              variant="default" 
              size="lg" 
              className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              onClick={startScanner}
            >
              <Camera className="mr-2 h-6 w-6" />
              Start Camera Scan
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
