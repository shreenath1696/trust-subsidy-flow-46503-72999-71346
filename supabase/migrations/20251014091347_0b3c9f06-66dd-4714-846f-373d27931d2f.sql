-- Fix function search path security warnings by setting search_path

-- Drop and recreate update_wallet_balance function with secure search_path
DROP FUNCTION IF EXISTS public.update_wallet_balance() CASCADE;

CREATE OR REPLACE FUNCTION public.update_wallet_balance()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Drop and recreate update_subsidy_totals function with secure search_path
DROP FUNCTION IF EXISTS public.update_subsidy_totals() CASCADE;

CREATE OR REPLACE FUNCTION public.update_subsidy_totals()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Recreate triggers
CREATE TRIGGER update_wallet_balance_on_voucher_insert
AFTER INSERT ON public.citizen_vouchers
FOR EACH ROW
EXECUTE FUNCTION public.update_wallet_balance();

CREATE TRIGGER update_wallet_balance_on_voucher_update
AFTER UPDATE ON public.citizen_vouchers
FOR EACH ROW
EXECUTE FUNCTION public.update_wallet_balance();

CREATE TRIGGER update_subsidy_totals_on_voucher_insert
AFTER INSERT ON public.citizen_vouchers
FOR EACH ROW
EXECUTE FUNCTION public.update_subsidy_totals();