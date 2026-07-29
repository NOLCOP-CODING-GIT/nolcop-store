import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types";
import { useAuth } from "../hooks/useAuth";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity?: number, image?: string) => void;
  removeFromCart: (productId: string, image?: string) => void;
  updateQuantity: (productId: string, quantity: number, image?: string) => void;
  clearCart: () => void;
}

type CartAction =
  | {
      type: "ADD_TO_CART";
      payload: {
        product: Product;
        quantity: number;
        image?: string;
      };
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: { productId: string; image?: string };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        productId: string;
        quantity: number;
        image?: string;
      };
    }
  | { type: "CLEAR_CART" };

const getEffectivePrice = (product: Product) => {
  return product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, quantity, image } = action.payload;
      const targetImage = image || product.images[0];
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          (item.selectedImage || item.product.images[0]) === targetImage,
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems = [
          ...state.items,
          {
            product,
            quantity,
            selectedImage: targetImage,
          },
        ];
      }

      const total = newItems.reduce(
        (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
        0,
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case "REMOVE_FROM_CART": {
      const { productId, image } = action.payload;
      const newItems = state.items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (!image || item.selectedImage === image)
          ),
      );

      const total = newItems.reduce(
        (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
        0,
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity, image } = action.payload;
      const newItems = state.items.map((item) => {
        if (
          item.product.id === productId &&
          (!image || item.selectedImage === image)
        ) {
          return { ...item, quantity };
        }
        return item;
      });

      const total = newItems.reduce(
        (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
        0,
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 };

    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(
    cartReducer,
    { items: [], total: 0, itemCount: 0 },
    (initialState) => {
      const savedCart = localStorage.getItem("nolcop_cart");
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error(
            "Erreur de récupération du panier depuis localStorage",
            e,
          );
        }
      }
      return initialState;
    },
  );

  useEffect(() => {
    if (!user) {
      dispatch({ type: "CLEAR_CART" });
      localStorage.removeItem("nolcop_cart");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("nolcop_cart", JSON.stringify(state));
  }, [state]);

  const addToCart = (product: Product, quantity = 1, image?: string) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { product, quantity, image },
    });
  };

  const removeFromCart = (productId: string, image?: string) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { productId, image },
    });
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    image?: string,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, image);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, quantity, image },
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
