export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[]; // Recommandé : toujours avoir au moins une image dans le tableau
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  discount?: number;
  specifications?: ProductSpecifications; // Typage plus précis que Record<string, string>
  createdAt: string;
  updatedAt: string;
}

// Un sous-type dédié pour tes specs, pour garder de l'autocomplétion sympa !
export interface ProductSpecifications {
  colors?: string[];
  sizes?: string[];
  [key: string]: any; // Permet d'ajouter d'autres specs (ex: poids, matière) à la volée
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  productCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
  addresses?: Address[];
  phone?: string;
  code_promo?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}
