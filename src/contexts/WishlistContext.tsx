import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";

interface WishlistContextType {
  wishlistIds: string[];
  loading: boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlistIds();
    } else {
      setWishlistIds([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlistIds = async () => {
    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("product_id")
        .eq("user_id", user?.id);

      if (error) throw error;
      if (data) {
        setWishlistIds(data.map((item) => item.product_id));
      }
    } catch (error) {
      console.error("Erreur chargement favoris:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) return;

    const exists = wishlistIds.includes(productId);
    const updatedIds = exists
      ? wishlistIds.filter((id) => id !== productId)
      : [...wishlistIds, productId];

    setWishlistIds(updatedIds);

    try {
      if (exists) {
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("wishlist_items")
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;
      }
    } catch (error) {
      console.error("Erreur mise à jour favoris:", error);
      setWishlistIds(wishlistIds);
    }
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, loading, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};


