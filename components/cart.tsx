"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const CART_STORAGE_KEY = "watch-shop-cart";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
};

type CartProduct = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addToCart: (product: CartProduct) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setItems(
            parsed.map((item) => ({
              ...item,
              stock: Number(item.stock) || 0,
            }))
          );
        }
      }
    } catch (error) {
      console.error("Greška pri čitanju korpe iz localStorage-a:", error);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Greška pri čuvanju korpe u localStorage:", error);
    }
  }, [items, isLoaded]);

  function addToCart(product: CartProduct) {
    if (product.stock <= 0) {
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return currentItems;
        }

        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                stock: product.stock,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
  }

  function increaseQuantity(id: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(item.stock, item.quantity + 1),
            }
          : item
      )
    );
  }

  function decreaseQuantity(id: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  }

  function removeFromCart(id: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        totalPrice,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart mora biti korišćen unutar CartProvider-a.");
  }

  return context;
}

export function CartButton() {
  const { totalQuantity } = useCart();

  return (
    <Link
      href="/cart"
      className="relative rounded-full border border-white/20 px-5 py-2 text-sm transition-all duration-150 hover:bg-white hover:text-black active:scale-95"
    >
      Korpa

      {totalQuantity > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-black">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}

export function AddToCartButton({
  product,
}: {
  product: CartProduct;
}) {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock <= 0;

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      disabled={isOutOfStock}
      className={`mt-6 w-full rounded-2xl px-5 py-3 font-semibold transition-all duration-150 active:scale-95 ${
        isOutOfStock
          ? "cursor-not-allowed bg-neutral-800 text-neutral-500"
          : "bg-white text-black hover:bg-neutral-200"
      }`}
    >
      {isOutOfStock ? "Nije na stanju" : "Dodaj u korpu"}
    </button>
  );
}