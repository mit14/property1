/*
# PropLedger Schema — Properties, Payments, Payouts, Expenses, Profiles

## Overview
Creates the full multi-user schema for PropLedger, a Canadian rental property tracker.
Each user owns their properties and all associated financial records.

## New Tables

1. `profiles`
   - `id` (uuid, PK, references auth.users)
   - `full_name` (text)
   - `tax_province` (text, Canadian province code)
   - `created_at` (timestamp)

2. `properties`
   - `id` (uuid, PK)
   - `user_id` (uuid, owner, defaults to auth.uid())
   - `name` (text)
   - `address` (text)
   - `city` (text)
   - `postal_code` (text)
   - `province` (text)
   - `type` (text: 'LTR' or 'STR')
   - LTR fields: `tenant_name`, `tenant_email`, `tenant_phone`, `monthly_rent`, `lease_start`, `lease_end`, `lmr_deposit`
   - STR fields: `nightly_rate`, `cleaning_fee`, `str_license`
   - `created_at` (timestamp)

3. `rent_payments`
   - `id` (uuid, PK)
   - `property_id` (uuid, FK to properties)
   - `user_id` (uuid, owner, defaults to auth.uid())
   - `month` (text)
   - `amount` (numeric)
   - `method` (text: 'e-Transfer' or 'Cheque')
   - `status` (text: 'Paid', 'Pending', 'Overdue')
   - `date` (date)
   - `created_at` (timestamp)

4. `str_payouts`
   - `id` (uuid, PK)
   - `property_id` (uuid, FK to properties)
   - `user_id` (uuid, owner, defaults to auth.uid())
   - `date` (date)
   - `gross_booking` (numeric)
   - `platform_fee` (numeric)
   - `cleaning_fee` (numeric)
   - `net_payout` (numeric)
   - `created_at` (timestamp)

5. `expenses`
   - `id` (uuid, PK)
   - `property_id` (uuid, FK to properties)
   - `user_id` (uuid, owner, defaults to auth.uid())
   - `amount` (numeric)
   - `date` (date)
   - `category` (text)
   - `category_code` (text, CRA T776 line number)
   - `description` (text)
   - `has_receipt` (boolean)
   - `created_at` (timestamp)

## Security
- RLS enabled on all tables.
- Owner-scoped CRUD policies (4 per table) using auth.uid() = user_id.
- profiles table scoped to auth.uid() = id.
- Child tables verify ownership via user_id column.
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  tax_province text NOT NULL DEFAULT 'ON',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  province text NOT NULL DEFAULT 'ON',
  type text NOT NULL DEFAULT 'LTR',
  tenant_name text,
  tenant_email text,
  tenant_phone text,
  monthly_rent numeric DEFAULT 0,
  lease_start date,
  lease_end date,
  lmr_deposit numeric DEFAULT 0,
  nightly_rate numeric DEFAULT 0,
  cleaning_fee numeric DEFAULT 0,
  str_license text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_properties" ON properties;
CREATE POLICY "select_own_properties" ON properties FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_properties" ON properties;
CREATE POLICY "insert_own_properties" ON properties FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_properties" ON properties;
CREATE POLICY "update_own_properties" ON properties FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_properties" ON properties;
CREATE POLICY "delete_own_properties" ON properties FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Rent payments table
CREATE TABLE IF NOT EXISTS rent_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  month text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  method text NOT NULL DEFAULT 'e-Transfer',
  status text NOT NULL DEFAULT 'Pending',
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_rent_payments" ON rent_payments;
CREATE POLICY "select_own_rent_payments" ON rent_payments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_rent_payments" ON rent_payments;
CREATE POLICY "insert_own_rent_payments" ON rent_payments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_rent_payments" ON rent_payments;
CREATE POLICY "update_own_rent_payments" ON rent_payments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_rent_payments" ON rent_payments;
CREATE POLICY "delete_own_rent_payments" ON rent_payments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- STR payouts table
CREATE TABLE IF NOT EXISTS str_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  gross_booking numeric NOT NULL DEFAULT 0,
  platform_fee numeric NOT NULL DEFAULT 0,
  cleaning_fee numeric NOT NULL DEFAULT 0,
  net_payout numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE str_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_str_payouts" ON str_payouts;
CREATE POLICY "select_own_str_payouts" ON str_payouts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_str_payouts" ON str_payouts;
CREATE POLICY "insert_own_str_payouts" ON str_payouts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_str_payouts" ON str_payouts;
CREATE POLICY "update_own_str_payouts" ON str_payouts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_str_payouts" ON str_payouts;
CREATE POLICY "delete_own_str_payouts" ON str_payouts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  date date NOT NULL,
  category text NOT NULL,
  category_code text NOT NULL,
  description text NOT NULL DEFAULT '',
  has_receipt boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_expenses" ON expenses;
CREATE POLICY "select_own_expenses" ON expenses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_expenses" ON expenses;
CREATE POLICY "insert_own_expenses" ON expenses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_expenses" ON expenses;
CREATE POLICY "update_own_expenses" ON expenses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_expenses" ON expenses;
CREATE POLICY "delete_own_expenses" ON expenses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_user_id ON rent_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_rent_payments_property_id ON rent_payments(property_id);
CREATE INDEX IF NOT EXISTS idx_str_payouts_user_id ON str_payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_str_payouts_property_id ON str_payouts(property_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_property_id ON expenses(property_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, tax_province)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', COALESCE(NEW.raw_user_meta_data->>'tax_province', 'ON'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
