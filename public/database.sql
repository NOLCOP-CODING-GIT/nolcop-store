-- Active l'extension pour générer des UUID si ce n'est pas déjà fait
create extension if not exists "uuid-ossp";

-- 1. ENUMS (Types personnalisés)
create type user_role as enum ('user', 'admin');
create type order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- 2. TABLE USERS
-- Remarque : Supabase gère déjà l'authentification dans la table "auth.users".
-- Nous créons une table "public.profiles" pour stocker les informations publiques et rôles.
create table public.profiles (
  id_profile uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  role user_role default 'user'::user_role not null,
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Active le Row Level Security (RLS) sur les profils
alter table public.profiles enable row level security;

-- 3. TABLE ADDRESSES
create table public.addresses (
  id_addresses uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id_profile) on delete cascade not null,
  street text not null,
  city text not null,
  state text not null,
  zip_code text not null,
  country text not null,
  is_default boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABLE CATEGORIES
create table public.categories (
  id_category uuid default uuid_generate_v4() primary key,
  name text unique not null,
  slug text unique not null,
  image text not null,
  description text,
  product_count integer default 0 not null
);

-- 5. TABLE PRODUCTS
create table public.products (
  id_product uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  price numeric(12, 2) not null, -- Idéal pour gérer les prix (ex: FCFA ou Décimaux)
  category_id uuid references public.categories(id_category) on delete restrict not null,
  image text not null,
  images text[] default '{}'::text[] not null, -- Tableau de liens d'images
  stock integer default 0 not null,
  rating numeric(3, 2) default 0.00 not null,
  reviews_count integer default 0 not null,
  featured boolean default false not null,
  discount numeric(5, 2), -- Pourcentage ou montant de réduction
  colors text[] default '{}'::text[],
  sizes text[] default '{}'::text[],
  specifications jsonb default '{}'::jsonb, -- Type JSON optimal pour Record<string, string>
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. TABLE ORDERS
create table public.orders (
  id_order uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id_profile) on delete set null, -- On garde l'historique si l'user supprime son compte
  total numeric(12, 2) not null,
  status order_status default 'pending'::order_status not null,
  
  -- Adresse de livraison figée pour historique
  shipping_street text not null,
  shipping_city text not null,
  shipping_state text not null,
  shipping_zip_code text not null,
  shipping_country text not null,
  
  payment_method text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. TABLE ORDER_ITEMS (La table de liaison pour les éléments du panier d'une commande)
create table public.order_items (
  id_order_item uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id_order) on delete cascade not null,
  product_id uuid references public.products(id_product) on delete restrict not null,
  quantity integer not null check (quantity > 0),
  selected_color text,
  selected_size text,
  price_at_buy numeric(12, 2) not null -- Sauvegarde du prix au moment de l'achat
);

-- 8. TABLE REVIEWS
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id_product) on delete cascade not null,
  user_id uuid references public.profiles(id_profile) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. TABLE WISHLIST
create table public.wishlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id_profile) on delete cascade not null,
  product_id uuid references public.products(id_product) on delete cascade not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Un utilisateur ne peut ajouter un même produit qu'une seule fois dans ses favoris
  unique(user_id, product_id)
);
-- 1. Crée une fonction qui va copier l'utilisateur d'auth.users vers public.profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id_profile, email, name, role, avatar)
  values (
    new.id_profile,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'Nouvel Utilisateur'),
    'user'::user_role,
    new.raw_user_meta_data->>'avatar'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Crée le déclencheur (trigger) rattaché à la table d'authentification de Supabase
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();