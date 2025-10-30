-- Create experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create slots table
CREATE TABLE public.slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  available_spots INTEGER NOT NULL,
  total_spots INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID NOT NULL REFERENCES public.experiences(id),
  slot_id UUID NOT NULL REFERENCES public.slots(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  promo_code TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create promo codes table
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10, 2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public access (no auth required for viewing)
CREATE POLICY "Anyone can view experiences"
  ON public.experiences FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view slots"
  ON public.slots FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their bookings"
  ON public.bookings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can validate promo codes"
  ON public.promo_codes FOR SELECT
  USING (active = true);

-- Insert sample experiences
INSERT INTO public.experiences (title, description, price, location, image_url, category, duration, rating) VALUES
('Sunset Beach Kayaking', 'Paddle through crystal-clear waters as the sun sets over the horizon. Perfect for beginners and experienced kayakers alike.', 89.99, 'Miami Beach, FL', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', 'Water Sports', '2 hours', 4.8),
('Mountain Hiking Adventure', 'Explore breathtaking mountain trails with experienced guides. Includes lunch and all equipment.', 129.99, 'Rocky Mountains, CO', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', 'Hiking', '6 hours', 4.9),
('Wine Tasting Tour', 'Visit three premium wineries and taste award-winning wines while learning about the winemaking process.', 149.99, 'Napa Valley, CA', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', 'Food & Drink', '4 hours', 4.7),
('Scuba Diving Experience', 'Dive into an underwater paradise with certified instructors. All equipment provided, no experience needed.', 199.99, 'Key West, FL', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', 'Water Sports', '3 hours', 4.9),
('Hot Air Balloon Ride', 'Soar above stunning landscapes at sunrise. Includes champagne toast and breakfast after landing.', 249.99, 'Sedona, AZ', 'https://images.unsplash.com/photo-1498550744921-75f79806b163?w=800', 'Adventure', '3 hours', 5.0),
('City Food Tour', 'Taste the best local cuisine with a knowledgeable guide. Visit 5+ restaurants and food markets.', 79.99, 'New York, NY', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 'Food & Drink', '3 hours', 4.6);

-- Insert sample slots for each experience (next 7 days)
INSERT INTO public.slots (experience_id, date, time, available_spots, total_spots)
SELECT 
  e.id,
  CURRENT_DATE + (d || ' days')::interval,
  t.time,
  CASE WHEN random() < 0.3 THEN 0 ELSE floor(random() * 8 + 2)::int END, -- Some sold out
  10
FROM public.experiences e
CROSS JOIN generate_series(0, 6) d
CROSS JOIN (VALUES ('09:00 AM'), ('02:00 PM'), ('05:00 PM')) AS t(time);

-- Insert sample promo codes
INSERT INTO public.promo_codes (code, discount_type, discount_value, active) VALUES
('SAVE10', 'percentage', 10, true),
('FLAT100', 'fixed', 100, true),
('WELCOME20', 'percentage', 20, true);