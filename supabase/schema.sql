-- CampusCart Complete Production Database Schema
-- Compatible with Supabase PostgreSQL & RLS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. UNIVERSITIES & CAMPUSES
CREATE TABLE IF NOT EXISTS public.universities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campuses (
    id TEXT PRIMARY KEY,
    university_id TEXT NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.delivery_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id TEXT NOT NULL REFERENCES public.campuses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    building_name TEXT,
    description TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES & SELLER STORES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone_number TEXT,
    university_id TEXT REFERENCES public.universities(id),
    campus_id TEXT REFERENCES public.campuses(id),
    role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
    is_seller BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seller_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    store_slug TEXT NOT NULL UNIQUE,
    bio TEXT,
    logo_url TEXT,
    banner_url TEXT,
    campus_id TEXT NOT NULL REFERENCES public.campuses(id),
    is_open BOOLEAN DEFAULT TRUE,
    rating_avg NUMERIC(3, 2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    contact_number TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCT CATEGORIES & PRODUCTS
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES public.categories(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    price_cents INT NOT NULL CHECK (price_cents >= 0),
    image_url TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    tag TEXT,
    eta TEXT DEFAULT '8-12 min',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_campus_availability (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    campus_id TEXT NOT NULL REFERENCES public.campuses(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, campus_id)
);

-- 4. ORDERS & FINANCIAL ENGINE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id),
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    seller_id UUID NOT NULL REFERENCES public.seller_profiles(id),
    seller_name TEXT NOT NULL,
    campus_id TEXT NOT NULL REFERENCES public.campuses(id),
    delivery_location_id UUID REFERENCES public.delivery_locations(id),
    delivery_location_name TEXT NOT NULL,
    custom_location_instructions TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled')),

    -- Financial fields (all in South African Cents)
    subtotal_cents INT NOT NULL,
    delivery_fee_cents INT NOT NULL DEFAULT 200, -- R2.00 paid by buyer
    total_cents INT NOT NULL, -- subtotal_cents + delivery_fee_cents
    platform_fee_cents INT NOT NULL DEFAULT 50, -- R0.50 platform developer fee per completed order
    seller_net_earnings_cents INT NOT NULL, -- total_cents - platform_fee_cents

    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT DEFAULT 'Instant EFT',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit_price_cents INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price_cents INT NOT NULL
);

-- 5. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id),
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('buyer', 'seller')),
    receiver_id UUID NOT NULL REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id),
    buyer_name TEXT NOT NULL,
    seller_id UUID NOT NULL REFERENCES public.seller_profiles(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REPORTS
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id),
    reporter_name TEXT NOT NULL,
    reported_user_id UUID REFERENCES public.profiles(id),
    product_id UUID REFERENCES public.products(id),
    order_id UUID REFERENCES public.orders(id),
    reason TEXT NOT NULL,
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('order_status', 'chat_message', 'seller_alert', 'system')),
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Public read access for marketplace browsing
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Seller profiles are viewable by everyone" ON public.seller_profiles FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);

-- Authenticated user restrictions
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Sellers can manage own seller profile" ON public.seller_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Sellers can manage own products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.seller_profiles WHERE id = products.seller_id AND user_id = auth.uid())
);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (
    auth.uid() = buyer_id OR EXISTS (SELECT 1 FROM public.seller_profiles WHERE id = orders.seller_id AND user_id = auth.uid())
);
CREATE POLICY "Buyers can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
