"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

const STORAGE_KEY = "watch-shop-wishlist";

type WishlistContextType = {
  productIds: string[];
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

function getGuestWishlist(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveGuestWishlist(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const loadUserWishlist = useCallback(async (currentUserId: string) => {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("user_id", currentUserId);

    if (error) {
      console.error("Greška pri učitavanju liste želja:", error);
      return;
    }

    const databaseIds = (data || []).map((item) => item.product_id);

    setProductIds(databaseIds);
  }, [supabase]);

  const syncGuestWishlist = useCallback(
    async (currentUserId: string) => {
      const guestIds = getGuestWishlist();

      if (guestIds.length > 0) {
        const rows = guestIds.map((productId) => ({
          user_id: currentUserId,
          product_id: productId,
        }));

        const { error } = await supabase
          .from("wishlist_items")
          .upsert(rows, {
            onConflict: "user_id,product_id",
            ignoreDuplicates: true,
          });

        if (error) {
          console.error("Greška pri prenosu liste želja:", error);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      await loadUserWishlist(currentUserId);
    },
    [supabase, loadUserWishlist]
  );

  useEffect(() => {
    let active = true;

    async function initialize() {
      const guestIds = getGuestWishlist();

      if (active) {
        setProductIds(guestIds);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (user) {
        setUserId(user.id);
        await syncGuestWishlist(user.id);
      } else {
        setUserId(null);
      }

      if (active) {
        setLoading(false);
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(async () => {
        if (!active) return;

        if (session?.user) {
          setUserId(session.user.id);
          await syncGuestWishlist(session.user.id);
        } else {
          setUserId(null);
          setProductIds(getGuestWishlist());
        }

        if (active) {
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, syncGuestWishlist]);

  const isWishlisted = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const alreadySaved = productIds.includes(productId);

      if (!userId) {
        const updated = alreadySaved
          ? productIds.filter((id) => id !== productId)
          : [...productIds, productId];

        setProductIds(updated);
        saveGuestWishlist(updated);
        return;
      }

      if (alreadySaved) {
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", productId);

        if (error) {
          console.error("Greška pri uklanjanju proizvoda:", error);
          return;
        }

        setProductIds((current) =>
          current.filter((id) => id !== productId)
        );
      } else {
        const { error } = await supabase
          .from("wishlist_items")
          .upsert(
            {
              user_id: userId,
              product_id: productId,
            },
            {
              onConflict: "user_id,product_id",
              ignoreDuplicates: true,
            }
          );

        if (error) {
          console.error("Greška pri dodavanju proizvoda:", error);
          return;
        }

        setProductIds((current) =>
          current.includes(productId)
            ? current
            : [...current, productId]
        );
      }
    },
    [productIds, userId, supabase]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (!userId) {
        const updated = productIds.filter((id) => id !== productId);

        setProductIds(updated);
        saveGuestWishlist(updated);
        return;
      }

      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) {
        console.error("Greška pri uklanjanju proizvoda:", error);
        return;
      }

      setProductIds((current) =>
        current.filter((id) => id !== productId)
      );
    },
    [productIds, userId, supabase]
  );

  return (
    <WishlistContext.Provider
      value={{
        productIds,
        loading,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist mora biti unutar WishlistProvider.");
  }

  return context;
}

export function WishlistButton({
  productId,
  className = "",
}: {
  productId: string;
  className?: string;
}) {
  const { isWishlisted, toggleWishlist, loading } = useWishlist();

  const saved = isWishlisted(productId);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggleWishlist(productId);
      }}
      aria-label={
        saved ? "Ukloni iz liste želja" : "Dodaj u listu želja"
      }
      title={saved ? "Ukloni iz liste želja" : "Dodaj u listu želja"}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a46a]/40 bg-[#211811]/90 text-xl transition hover:scale-110 hover:border-[#c9a46a] ${
        saved ? "text-red-500" : "text-[#d8c5a5]"
      } ${className}`}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}

export function WishlistCountButton() {
  const { productIds, loading } = useWishlist();

  return (
    <Link
      href="/wishlist"
      aria-label="Moja lista želja"
      title="Moja lista želja"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a46a]/40 text-xl text-[#d8c5a5] transition hover:border-[#c9a46a]"
    >
      ♥
      {!loading && productIds.length > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c9a46a] px-1 text-[10px] font-bold text-[#211811]">
          {productIds.length}
        </span>
      )}
    </Link>
  );
}