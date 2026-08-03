import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types";
import { useAuth } from "../hooks/useAuth";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  promoCode: string | null;
  discountPercentage: number;
}

interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity?: number, image?: string) => void;
  removeFromCart: (productId: string, image?: string) => void;
  updateQuantity: (productId: string, quantity: number, image?: string) => void;
  clearCart: () => void;
  applyPromo: (code: string, discount: number) => void;
  removePromo: () => void;
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
  | { type: "CLEAR_CART" }
  | { type: "APPLY_PROMO"; payload: { code: string; discount: number } }
  | { type: "REMOVE_PROMO" };

const getEffectivePrice = (product: Product) => {
  return product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;
};

type ProductWithLegacyQuantity = Product & {
  stock?: number;
  qte_min?: number;
};

const getMinimumQuantity = (product: ProductWithLegacyQuantity) => {
  return Math.max(1, Number(product.qte_min ?? product.stock ?? 1) || 1);
};

const normalizeProduct = (product: ProductWithLegacyQuantity): Product => {
  return {
    ...product,
    qte_min: getMinimumQuantity(product),
  };
};

const normalizeCartItem = (item: CartItem): CartItem => {
  const legacyProduct = item.product as ProductWithLegacyQuantity;
  const minimumQuantity = getMinimumQuantity(legacyProduct);

  return {
    ...item,
    product: normalizeProduct(legacyProduct),
    quantity: Math.max(minimumQuantity, Number(item.quantity) || 0),
  };
};

const recalculateCartState = (
  items: CartItem[],
  state: CartState,
): CartState => {
  const total = items.reduce(
    (sum, item) => sum + getEffectivePrice(item.product) * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { ...state, items, total, itemCount };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, quantity, image } = action.payload;
      const normalizedProduct = normalizeProduct(
        product as ProductWithLegacyQuantity,
      );
      const targetImage = image || normalizedProduct.images[0];
      const quantityToAdd = Math.max(
        quantity,
        getMinimumQuantity(normalizedProduct),
      );
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === normalizedProduct.id &&
          (item.selectedImage || item.product.images[0]) === targetImage,
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantityToAdd;
      } else {
        newItems = [
          ...state.items,
          {
            product: normalizedProduct,
            quantity: quantityToAdd,
            selectedImage: targetImage,
          },
        ];
      }

      return recalculateCartState(newItems, state);
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

      return recalculateCartState(newItems, state);
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity, image } = action.payload;
      const newItems = state.items.map((item) => {
        if (
          item.product.id === productId &&
          (!image || item.selectedImage === image)
        ) {
          return {
            ...item,
            quantity: Math.max(
              getMinimumQuantity(item.product as ProductWithLegacyQuantity),
              quantity,
            ),
          };
        }
        return item;
      });

      return recalculateCartState(newItems, state);
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0, promoCode: null, discountPercentage: 0 };

    case "APPLY_PROMO":
      return { ...state, promoCode: action.payload.code, discountPercentage: action.payload.discount };

    case "REMOVE_PROMO":
      return { ...state, promoCode: null, discountPercentage: 0 };

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
    { items: [], total: 0, itemCount: 0, promoCode: null, discountPercentage: 0 },
    (initialState) => {
      const savedCart = localStorage.getItem("nolcop_cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart) as Partial<CartState>;
          if (!parsedCart || !Array.isArray(parsedCart.items)) {
            return initialState;
          }

          return recalculateCartState(
            parsedCart.items.map((item) => normalizeCartItem(item)),
            {
              ...initialState,
              promoCode: parsedCart.promoCode ?? null,
              discountPercentage: parsedCart.discountPercentage ?? 0,
            },
          );
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

  const addToCart = (
    product: Product,
    quantity = getMinimumQuantity(product as ProductWithLegacyQuantity),
    image?: string,
  ) => {
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

  const applyPromo = (code: string, discount: number) => {
    dispatch({ type: "APPLY_PROMO", payload: { code, discount } });
  };

  const removePromo = () => {
    dispatch({ type: "REMOVE_PROMO" });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromo,
        removePromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
