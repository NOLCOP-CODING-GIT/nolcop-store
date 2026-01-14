import React, { createContext, useReducer } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType {
  state: CartState;
  addToCart: (
    product: Product,
    quantity?: number,
    color?: string,
    size?: string
  ) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    color?: string,
    size?: string
  ) => void;
  clearCart: () => void;
}

type CartAction =
  | {
      type: "ADD_TO_CART";
      payload: {
        product: Product;
        quantity: number;
        color?: string;
        size?: string;
      };
    }
  | {
      type: "REMOVE_FROM_CART";
      payload: { productId: string; color?: string; size?: string };
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        productId: string;
        quantity: number;
        color?: string;
        size?: string;
      };
    }
  | { type: "CLEAR_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, quantity, color, size } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        newItems = [
          ...state.items,
          { product, quantity, selectedColor: color, selectedSize: size },
        ];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case "REMOVE_FROM_CART": {
      const { productId, color, size } = action.payload;
      const newItems = state.items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      );

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: newItems, total, itemCount };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity, color, size } = action.payload;
      const newItems = state.items.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          return { ...item, quantity };
        }
        return item;
      });

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
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
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  const addToCart = (
    product: Product,
    quantity = 1,
    color?: string,
    size?: string
  ) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { product, quantity, color, size },
    });
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId, color, size } });
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    color?: string,
    size?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { productId, quantity, color, size },
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
