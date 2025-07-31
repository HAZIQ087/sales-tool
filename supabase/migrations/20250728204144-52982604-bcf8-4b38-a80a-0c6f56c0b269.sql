
-- Add tables for daily operations and cash management
CREATE TABLE daily_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  date DATE NOT NULL,
  opening_cash_mxn DECIMAL(10,2) NOT NULL DEFAULT 0,
  opening_cash_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  closing_cash_mxn DECIMAL(10,2),
  closing_cash_usd DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  opened_by TEXT,
  closed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add price scales table
CREATE TABLE price_scales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add customer price scale assignments
ALTER TABLE customers ADD COLUMN price_scale_id UUID REFERENCES price_scales(id);

-- Add product images table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add pending sales table
CREATE TABLE pending_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_number TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id),
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_by TEXT,
  paused_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  branch_id UUID REFERENCES branches(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resumed', 'cancelled'))
);

-- Add quotations table
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id),
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  valid_until DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'converted')),
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add returns table
CREATE TABLE returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_number TEXT NOT NULL,
  original_sale_id UUID REFERENCES sales(id),
  customer_id UUID REFERENCES customers(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  reason TEXT,
  authorized_by TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add payment methods table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash', 'card', 'transfer', 'check', 'voucher')),
  currency TEXT NOT NULL DEFAULT 'MXN' CHECK (currency IN ('MXN', 'USD')),
  requires_authorization BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add cash movements table
CREATE TABLE cash_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  movement_type TEXT NOT NULL CHECK (movement_type IN ('sale', 'return', 'withdrawal', 'deposit', 'opening', 'closing')),
  amount_mxn DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  reference_id UUID,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add exchange rates table
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate DECIMAL(10,4) NOT NULL,
  date DATE NOT NULL,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add vouchers table
CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MXN' CHECK (currency IN ('MXN', 'USD')),
  customer_id UUID REFERENCES customers(id),
  used_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  expires_at DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add customer interactions table for AI assistant
CREATE TABLE customer_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('purchase', 'quote', 'inquiry', 'complaint')),
  products JSONB,
  notes TEXT,
  emotion_detected TEXT,
  suggestions_made JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default price scales
INSERT INTO price_scales (name, discount_percentage) VALUES
('Retail', 0),
('Wholesale', 15),
('Distributor', 25),
('VIP', 10);

-- Insert default payment methods
INSERT INTO payment_methods (name, type, currency) VALUES
('Cash MXN', 'cash', 'MXN'),
('Cash USD', 'cash', 'USD'),
('Debit Card', 'card', 'MXN'),
('Credit Card', 'card', 'MXN'),
('Bank Transfer', 'transfer', 'MXN'),
('Check', 'check', 'MXN'),
('Voucher', 'voucher', 'MXN');

-- Insert default exchange rate
INSERT INTO exchange_rates (rate, date) VALUES (17.50, CURRENT_DATE);

-- Add RLS policies for all new tables
ALTER TABLE daily_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for all new tables
CREATE POLICY "Allow all operations on daily_operations" ON daily_operations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on price_scales" ON price_scales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on product_images" ON product_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on pending_sales" ON pending_sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on quotations" ON quotations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on returns" ON returns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on payment_methods" ON payment_methods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on cash_movements" ON cash_movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on exchange_rates" ON exchange_rates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on vouchers" ON vouchers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on customer_interactions" ON customer_interactions FOR ALL USING (true) WITH CHECK (true);

-- Update existing sales table to support more payment information
ALTER TABLE sales ADD COLUMN payment_details JSONB;
ALTER TABLE sales ADD COLUMN exchange_rate DECIMAL(10,4);
ALTER TABLE sales ADD COLUMN voucher_used DECIMAL(10,2) DEFAULT 0;
ALTER TABLE sales ADD COLUMN credit_applied DECIMAL(10,2) DEFAULT 0;
