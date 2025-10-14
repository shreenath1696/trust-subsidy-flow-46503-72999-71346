-- Create subsidies table to store all subsidy programs
CREATE TABLE public.subsidies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  total_beneficiaries INTEGER DEFAULT 0,
  total_disbursed DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Create citizen_wallets table to store individual citizen balances
CREATE TABLE public.citizen_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  citizen_id TEXT NOT NULL UNIQUE,
  citizen_name TEXT NOT NULL,
  total_balance DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create citizen_vouchers table to store individual vouchers per citizen
CREATE TABLE public.citizen_vouchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.citizen_wallets(id) ON DELETE CASCADE,
  subsidy_id UUID NOT NULL REFERENCES public.subsidies(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table to track all payments
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.citizen_wallets(id) ON DELETE CASCADE,
  voucher_id UUID REFERENCES public.citizen_vouchers(id),
  vendor_id TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  purpose TEXT NOT NULL,
  transaction_type TEXT DEFAULT 'payment' CHECK (transaction_type IN ('payment', 'refund')),
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendors table to store authorized vendors
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id TEXT NOT NULL UNIQUE,
  vendor_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  qr_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security on all tables
ALTER TABLE public.subsidies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citizen_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for prototype)
CREATE POLICY "Allow public read access to subsidies" 
ON public.subsidies FOR SELECT USING (true);

CREATE POLICY "Allow public insert to subsidies" 
ON public.subsidies FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to subsidies" 
ON public.subsidies FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to citizen_wallets" 
ON public.citizen_wallets FOR SELECT USING (true);

CREATE POLICY "Allow public insert to citizen_wallets" 
ON public.citizen_wallets FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to citizen_wallets" 
ON public.citizen_wallets FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to citizen_vouchers" 
ON public.citizen_vouchers FOR SELECT USING (true);

CREATE POLICY "Allow public insert to citizen_vouchers" 
ON public.citizen_vouchers FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to citizen_vouchers" 
ON public.citizen_vouchers FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to transactions" 
ON public.transactions FOR SELECT USING (true);

CREATE POLICY "Allow public insert to transactions" 
ON public.transactions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to vendors" 
ON public.vendors FOR SELECT USING (true);

CREATE POLICY "Allow public insert to vendors" 
ON public.vendors FOR INSERT WITH CHECK (true);

-- Create function to update citizen wallet balance
CREATE OR REPLACE FUNCTION public.update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.citizen_wallets
  SET 
    total_balance = (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.citizen_vouchers
      WHERE wallet_id = NEW.wallet_id AND status = 'active'
    ),
    updated_at = now()
  WHERE id = NEW.wallet_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update wallet balance when vouchers change
CREATE TRIGGER update_wallet_balance_on_voucher_insert
AFTER INSERT ON public.citizen_vouchers
FOR EACH ROW
EXECUTE FUNCTION public.update_wallet_balance();

CREATE TRIGGER update_wallet_balance_on_voucher_update
AFTER UPDATE ON public.citizen_vouchers
FOR EACH ROW
EXECUTE FUNCTION public.update_wallet_balance();

-- Create function to update subsidy totals
CREATE OR REPLACE FUNCTION public.update_subsidy_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.subsidies
  SET 
    total_disbursed = (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.citizen_vouchers
      WHERE subsidy_id = NEW.subsidy_id
    ),
    total_beneficiaries = (
      SELECT COUNT(DISTINCT wallet_id)
      FROM public.citizen_vouchers
      WHERE subsidy_id = NEW.subsidy_id
    )
  WHERE id = NEW.subsidy_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update subsidy totals
CREATE TRIGGER update_subsidy_totals_on_voucher_insert
AFTER INSERT ON public.citizen_vouchers
FOR EACH ROW
EXECUTE FUNCTION public.update_subsidy_totals();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.subsidies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.citizen_wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.citizen_vouchers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendors;

-- Insert sample vendors for testing
INSERT INTO public.vendors (vendor_id, vendor_name, business_type, qr_code) VALUES
('V001', 'Sharma Fertilizers', 'Agricultural Supplies', 'QR-V001'),
('V002', 'Green Farm Store', 'Agricultural Supplies', 'QR-V002'),
('V003', 'City Groceries', 'Food & Groceries', 'QR-V003');

-- Insert sample citizen wallet for testing
INSERT INTO public.citizen_wallets (citizen_id, citizen_name) VALUES
('C001', 'Rajesh Kumar');