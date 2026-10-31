"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase";

const CART_STORAGE_KEY = "watch-shop-cart";
const COUPON_STORAGE_KEY = "watch-shop-coupon";

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

type AppliedCoupon = {
  code: string;
  discountPercent: number;
};

type CouponValidationResult = {
  valid: boolean;
  discount_percent: number;
  discount_amount: number;
  final_total: number;
  message: string;
};

export type VipStatus = {
  lifetime_spend: number;
  points_balance: number;
  points_value: number;
  vip_tier: string;
  next_tier_spend: number | null;
  progress_percent: number;
};

type VipStatusResult = {
  lifetime_spend: number | string;
  points_balance: number | string;
  points_value: number | string;
  vip_tier: string;
  next_tier_spend: number | string | null;
  progress_percent: number | string;
};

type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;

  appliedCoupon: AppliedCoupon | null;
  couponDiscount: number;

  finalTotal: number;

  couponLoading: boolean;
  couponMessage: string;

  vipStatus: VipStatus | null;
  vipLoading: boolean;
  vipPointsToRedeem: number;
  vipPointsDiscount: number;
  vipMessage: string;

  addToCart: (product: CartProduct) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  setVipPointsToRedeem: (points: number) => void;
  refreshVipStatus: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [appliedCoupon, setAppliedCoupon] =
    useState<AppliedCoupon | null>(null);

  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  const [vipStatus, setVipStatus] = useState<VipStatus | null>(null);
  const [vipLoading, setVipLoading] = useState(true);
  const [vipPointsToRedeem, setVipPointsToRedeemState] = useState(0);
  const [vipMessage, setVipMessage] = useState("");

  async function refreshVipStatus() {
    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setVipStatus(null);
        setVipPointsToRedeemState(0);
        return;
      }

      const { data, error } = await supabase.rpc("get_my_vip_status");

      if (error) {
        console.error("Greška pri učitavanju VIP statusa:", error);
        setVipStatus(null);
        return;
      }

      const result = (
        Array.isArray(data) ? data[0] : data
      ) as VipStatusResult | null;

      if (!result) {
        setVipStatus(null);
        return;
      }

      setVipStatus({
        lifetime_spend: Number(result.lifetime_spend) || 0,
        points_balance: Number(result.points_balance) || 0,
        points_value: Number(result.points_value) || 0,
        vip_tier: result.vip_tier,
        next_tier_spend:
          result.next_tier_spend === null
            ? null
            : Number(result.next_tier_spend),
        progress_percent: Number(result.progress_percent) || 0,
      });
    } catch (error) {
      console.error("Greška pri učitavanju VIP statusa:", error);
      setVipStatus(null);
    } finally {
      setVipLoading(false);
    }
  }

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

      const storedCoupon = window.localStorage.getItem(
        COUPON_STORAGE_KEY
      );

      if (storedCoupon) {
        const parsedCoupon = JSON.parse(storedCoupon);

        if (
          parsedCoupon &&
          typeof parsedCoupon.code === "string" &&
          Number(parsedCoupon.discountPercent) > 0
        ) {
          setAppliedCoupon({
            code: parsedCoupon.code,
            discountPercent: Number(parsedCoupon.discountPercent),
          });
        }
      }
    } catch (error) {
      console.error(
        "Greška pri čitanju korpe ili kupona iz localStorage-a:",
        error
      );
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Greška pri čuvanju korpe u localStorage:",
        error
      );
    }
  }, [items, isLoaded]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      if (appliedCoupon) {
        window.localStorage.setItem(
          COUPON_STORAGE_KEY,
          JSON.stringify(appliedCoupon)
        );
      } else {
        window.localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Greška pri čuvanju kupona:", error);
    }
  }, [appliedCoupon, isLoaded]);

  useEffect(() => {
    const supabase = createClient();

    refreshVipStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      setVipPointsToRedeemState(0);
      setVipMessage("");

      setTimeout(() => {
        refreshVipStatus();
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    setAppliedCoupon(null);
    setCouponMessage("");
    setVipPointsToRedeemState(0);
    setVipMessage("");
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponMessage("Kupon je uklonjen.");
  }

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const couponDiscount = appliedCoupon
    ? Number(
        ((totalPrice * appliedCoupon.discountPercent) / 100).toFixed(2)
      )
    : 0;

  const vipPointsDiscount = vipPointsToRedeem * 2;

  const finalTotal = Math.max(
    0,
    totalPrice - couponDiscount - vipPointsDiscount
  );

  function setVipPointsToRedeem(points: number) {
    if (points <= 0) {
      setVipPointsToRedeemState(0);
      setVipMessage("VIP poeni nisu iskorišćeni.");
      return;
    }

    if (appliedCoupon) {
      setVipMessage(
        "Prvo ukloni kupon da bi koristio VIP poene."
      );
      return;
    }

    if (!vipStatus) {
      setVipMessage(
        "Moraš biti prijavljen da bi koristio VIP poene."
      );
      return;
    }

    const maximumPoints = Math.min(
      vipStatus.points_balance,
      Math.floor(totalPrice / 100) * 50
    );

    const roundedPoints =
      Math.floor(points / 50) * 50;

    if (roundedPoints < 50) {
      setVipPointsToRedeemState(0);
      setVipMessage(
        "VIP poeni se koriste u koracima od 50 poena."
      );
      return;
    }

    if (roundedPoints > maximumPoints) {
      setVipPointsToRedeemState(
        Math.floor(maximumPoints / 50) * 50
      );

      setVipMessage(
        `Možeš iskoristiti najviše ${Math.floor(
          maximumPoints / 50
        ) * 50} poena za ovu porudžbinu.`
      );

      return;
    }

    setVipPointsToRedeemState(roundedPoints);
    setVipMessage(
      `Uspešno si izabrao ${roundedPoints} VIP poena.`
    );
  }

  useEffect(() => {
    if (vipPointsToRedeem <= 0 || !vipStatus) {
      return;
    }

    const maximumPoints = Math.min(
      vipStatus.points_balance,
      Math.floor(totalPrice / 100) * 50
    );

    const allowedPoints =
      Math.floor(maximumPoints / 50) * 50;

    if (vipPointsToRedeem > allowedPoints) {
      setVipPointsToRedeemState(allowedPoints);
    }
  }, [totalPrice, vipStatus, vipPointsToRedeem]);

  async function applyCoupon(code: string): Promise<boolean> {
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponMessage("Unesi kod kupona.");
      return false;
    }

    if (vipPointsToRedeem > 0) {
      setCouponMessage(
        "Prvo ukloni izabrane VIP poene da bi koristio kupon."
      );
      return false;
    }

    if (items.length === 0 || totalPrice <= 0) {
      setCouponMessage("Korpa je prazna.");
      return false;
    }

    setCouponLoading(true);
    setCouponMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase.rpc("validate_coupon", {
        p_code: normalizedCode,
        p_subtotal: totalPrice,
      });

      if (error) {
        console.error("Greška pri proveri kupona:", error);
        setCouponMessage(
          "Provera kupona trenutno nije uspela. Pokušaj ponovo."
        );
        return false;
      }

      const result = (
        Array.isArray(data) ? data[0] : data
      ) as CouponValidationResult | null;

      if (!result || !result.valid) {
        setAppliedCoupon(null);
        setCouponMessage(
          result?.message ||
            "Kupon nije validan ili je već iskorišćen."
        );
        return false;
      }

      setAppliedCoupon({
        code: normalizedCode,
        discountPercent: Number(result.discount_percent),
      });

      setCouponMessage(
        `Kupon je uspešno primenjen! Ostvaruješ ${result.discount_percent}% popusta.`
      );

      return true;
    } catch (error) {
      console.error("Greška pri primeni kupona:", error);
      setCouponMessage("Došlo je do greške. Pokušaj ponovo.");
      return false;
    } finally {
      setCouponLoading(false);
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        totalPrice,
        appliedCoupon,
        couponDiscount,
        finalTotal,
        couponLoading,
        couponMessage,

        vipStatus,
        vipLoading,
        vipPointsToRedeem,
        vipPointsDiscount,
        vipMessage,

        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,

        applyCoupon,
        removeCoupon,

        setVipPointsToRedeem,
        refreshVipStatus,
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
      className="relative rounded-full border border-[#d6b878]/35 bg-gradient-to-b from-[#30231b] to-[#211812] px-5 py-2 text-sm text-[#f4ebdd] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-200 hover:border-[#ead4a0]/70 hover:text-[#ead4a0] active:scale-95"
    >
      Korpa

      {totalQuantity > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-[#ead4a0]/60 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] text-xs font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
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
      className={`mt-6 w-full rounded-2xl border px-5 py-3 font-semibold transition-all duration-200 active:scale-95 ${
        isOutOfStock
          ? "cursor-not-allowed border-[#8f8071]/15 bg-[#30231b] text-[#8f8071]"
          : "border-[#ead4a0]/60 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_5px_16px_rgba(214,184,120,0.12)] hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_7px_20px_rgba(214,184,120,0.2)]"
      }`}
    >
      {isOutOfStock ? "Nije na stanju" : "Dodaj u korpu"}
    </button>
  );
}