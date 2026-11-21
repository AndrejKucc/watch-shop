"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type AccountUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

type CustomerOrder = {
  id: string;
  order_number: string | null;
  status: string;
  total: number;
  created_at: string;
};

type CustomerCoupon = {
  code: string;
  discount_percent: number;
  redeemed_at: string | null;
  created_at: string;
  source_order_number: string | null;
};

type VipStatus = {
  lifetime_spend: number;
  points_balance: number;
  points_value: number;
  vip_tier: string;
  next_tier_spend: number | null;
  progress_percent: number;
};

type VipLedgerEntry = {
  id: string;
  order_id: string | null;
  order_number: string | null;
  transaction_type: string;
  points_change: number;
  amount_rsd: number;
  description: string | null;
  created_at: string;
};

const STATUS_STEPS = [
  { value: "new", label: "Poručena" },
  { value: "confirmed", label: "Potvrđena" },
  { value: "shipped", label: "Poslata" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleString("sr-RS");
}

function formatRsd(value: number) {
  return Number(value || 0).toLocaleString("sr-RS", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function OrderStatus({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <span className="rounded-full border border-[#c46a2d]/40 bg-[#c46a2d]/10 px-3 py-1.5 text-xs font-semibold text-[#B4501F]">
        Otkazana
      </span>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex(
    (step) => step.value === status
  );

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-2">
        {STATUS_STEPS.map((step, index) => {
          const completed = index <= currentIndex;

          return (
            <div key={step.value} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                  completed
                    ? "border-[#B8955A]/100 bg-[#1F2A3C] text-[#F8F4E7]"
                    : "border-[#B8955A]/40 bg-[#FFFFFF]/100 text-[#1F2A3C]/60"
                }`}
              >
                {completed ? "✓" : index + 1}
              </div>

              <span
                className={`mt-2 text-center text-[11px] sm:text-xs ${
                  completed ? "text-[#8A6A33]" : "text-[#1F2A3C]/60"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#FFFFFF]/100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#B8955A] to-[#B8955A] transition-all duration-500"
          style={{
            width:
              currentIndex < 0
                ? "0%"
                : `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

function VipTierLabel({ tier }: { tier: string }) {
  const normalized = tier.toLowerCase();

  if (normalized === "gold") return "GOLD";
  if (normalized === "silver") return "SILVER";
  if (normalized === "bronze") return "BRONZE";

  return tier.toUpperCase();
}

function VipTierDescription({ tier }: { tier: string }) {
  const normalized = tier.toLowerCase();

  if (normalized === "gold") {
    return "Dostigao si najviši VIP nivo. Uživaj u pogodnostima!";
  }

  if (normalized === "silver") {
    return "Odlično napreduješ! Nastavi da kupuješ i približi se Gold nivou.";
  }

  return "Svaka kupovina te približava Silver nivou. Sakupljaj VIP poene!";
}

function VipHistoryLabel({ entry }: { entry: VipLedgerEntry }) {
  if (entry.transaction_type === "purchase_completed") {
    return "Poeni osvojeni kupovinom";
  }

  if (entry.transaction_type === "redeemed") {
    return "Iskorišćeni VIP poeni";
  }

  return entry.description || "VIP transakcija";
}

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const [coupons, setCoupons] = useState<CustomerCoupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [couponsError, setCouponsError] = useState("");

  const [copiedCode, setCopiedCode] = useState("");

  const [vipStatus, setVipStatus] = useState<VipStatus | null>(null);
  const [vipLoading, setVipLoading] = useState(true);
  const [vipError, setVipError] = useState("");

  const [vipLedger, setVipLedger] = useState<VipLedgerEntry[]>([]);
  const [vipLedgerLoading, setVipLedgerLoading] = useState(true);
  const [vipLedgerError, setVipLedgerError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function loadOrders(userId: string) {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total, created_at")
        .eq("user_id", userId)
        .neq("status", "completed")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Greška pri učitavanju porudžbina:", error);
        setOrdersError("Porudžbine trenutno nisu mogle da se učitaju.");
        setOrdersLoading(false);
        return;
      }

      setOrders(data || []);
      setOrdersError("");
      setOrdersLoading(false);
    }

    async function loadCoupons() {
      const { data, error } = await supabase.rpc("get_my_coupons");

      if (!active) return;

      if (error) {
        console.error("Greška pri učitavanju kupona:", error);
        setCouponsError("Kuponi trenutno nisu mogli da se učitaju.");
        setCouponsLoading(false);
        return;
      }

      setCoupons(data || []);
      setCouponsError("");
      setCouponsLoading(false);
    }

    async function loadVipStatus() {
      const { data, error } = await supabase.rpc("get_my_vip_status");

      if (!active) return;

      if (error) {
        console.error("Greška pri učitavanju VIP statusa:", error);
        setVipError("VIP status trenutno nije moguće učitati.");
        setVipLoading(false);
        return;
      }

      const result = Array.isArray(data) ? data[0] : data;

      if (!result) {
        setVipStatus(null);
        setVipLoading(false);
        return;
      }

      setVipStatus({
        lifetime_spend: Number(result.lifetime_spend || 0),
        points_balance: Number(result.points_balance || 0),
        points_value: Number(result.points_value || 0),
        vip_tier: result.vip_tier || result.tier || "Bronze",
        next_tier_spend:
          result.next_tier_spend === null ||
          result.next_tier_spend === undefined
            ? null
            : Number(result.next_tier_spend),
        progress_percent: Math.min(
          100,
          Math.max(0, Number(result.progress_percent || 0))
        ),
      });

      setVipError("");
      setVipLoading(false);
    }

    async function loadVipLedger() {
      const { data, error } = await supabase.rpc("get_my_vip_ledger");

      if (!active) return;

      if (error) {
        console.error("Greška pri učitavanju VIP istorije:", error);
        setVipLedgerError("Istorija VIP poena trenutno nije dostupna.");
        setVipLedgerLoading(false);
        return;
      }

      setVipLedger(data || []);
      setVipLedgerError("");
      setVipLedgerLoading(false);
    }

    async function loadAccount() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (error || !user) {
        router.replace("/nalog/prijava");
        return;
      }

      setUser(user);
      setLoading(false);

      await Promise.all([
        loadOrders(user.id),
        loadCoupons(),
        loadVipStatus(),
        loadVipLedger(),
      ]);

      if (!active) return;

      channel = supabase
        .channel(`customer-orders-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            void loadOrders(user.id);
            void loadCoupons();
            void loadVipStatus();
            void loadVipLedger();
          }
        )
        .subscribe((status) => {
          if (status === "CHANNEL_ERROR") {
            console.error(
              "Realtime kanal za korisničke porudžbine nije povezan."
            );
          }
        });
    }

    void loadAccount();

    return () => {
      active = false;

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [router]);

  async function logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError("Odjava nije uspela. Pokušaj ponovo.");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  async function copyCoupon(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      window.setTimeout(() => {
        setCopiedCode((current) => (current === code ? "" : current));
      }, 2000);
    } catch {
      setCopiedCode("");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F8F4E7] via-[#FFFFFF] to-[#FFFFFF]/100 text-[#8A6A33]">
        Učitavanje naloga...
      </main>
    );
  }

  if (!user) return null;

  const normalizedTier = vipStatus?.vip_tier.toLowerCase() || "bronze";

  const tierColor =
    normalizedTier === "gold"
      ? "border-[#B8955A]/75 bg-[#B8955A]/15 text-[#8A6A33]"
      : normalizedTier === "silver"
        ? "border-[#1F2A3C]/25 bg-[#1F2A3C]/5 text-[#1F2A3C]/70"
        : "border-[#B8955A]/60 bg-[#B8955A]/10 text-[#8A6A33]";

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8F4E7] via-[#FFFFFF] to-[#FFFFFF]/100 px-5 py-16 text-[#1F2A3C]">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-[#1F2A3C]/72 transition hover:text-[#8A6A33]"
        >
          ← Nazad u prodavnicu
        </Link>

        <section className="mt-8 rounded-3xl border border-[#B8955A]/40 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F8F4E7] p-6 shadow-[inset_0_1px_0_rgba(184,149,90,0.08),0_12px_40px_rgba(31,42,60,0.12)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A6A33]">
            WATCH STORE
          </p>

          <h1 className="mt-4 text-3xl font-bold text-[#1F2A3C] sm:text-4xl">
            Moj nalog
          </h1>

          <p className="mt-3 text-[#1F2A3C]/72">
            Dobro došao u svoj korisnički nalog.
          </p>

          <div className="mt-8 space-y-5 border-t border-[#B8955A]/30 pt-6">
            <div>
              <p className="text-sm text-[#1F2A3C]/72">Ime i prezime</p>
              <p className="mt-1 text-lg text-[#1F2A3C]">
                {user.user_metadata?.full_name || "Nije uneto"}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#1F2A3C]/72">Email adresa</p>
              <p className="mt-1 break-all text-lg text-[#1F2A3C]">
                {user.email || "Nije dostupna"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl border border-[#B8955A]/75 bg-gradient-to-b from-[#1F2A3C] via-[#1F2A3C] to-[#1F2A3C] px-5 py-3 text-sm font-semibold text-[#F8F4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:brightness-110 active:scale-95"
            >
              Nastavi kupovinu
            </Link>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-[#B8955A]/45 bg-[#F8F4E7]/60 px-5 py-3 text-sm font-semibold text-[#8A6A33] transition hover:border-[#B8955A]/90 hover:bg-[#B8955A]/15 active:scale-95"
            >
              Odjavi se
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[#c46a2d]/40 bg-[#c46a2d]/10 px-4 py-3 text-sm text-[#B4501F]"
            >
              {error}
            </p>
          )}
        </section>

        {/* VIP PROGRAM */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-[#B8955A]/45 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F8F4E7] shadow-[inset_0_1px_0_rgba(184,149,90,0.08),0_12px_40px_rgba(31,42,60,0.12)]">
          <div className="border-b border-[#B8955A]/30 bg-gradient-to-r from-[#B8955A]/10 to-transparent p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A6A33]">
              WATCH STORE REWARDS
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#1F2A3C]">
                Moj VIP status
              </h2>

              {!vipLoading && vipStatus && (
                <span
                  className={`rounded-full border px-4 py-2 text-xs font-bold tracking-[0.15em] ${tierColor}`}
                >
                  {VipTierLabel({ tier: vipStatus.vip_tier })}
                </span>
              )}
            </div>

            <p className="mt-2 text-sm leading-6 text-[#1F2A3C]/72">
              Sakupljaj poene kupovinom i napreduj kroz VIP nivoe.
            </p>
          </div>

          {vipLoading ? (
            <div className="p-6 sm:p-8">
              <p className="text-sm text-[#1F2A3C]/72">
                Učitavanje VIP statusa...
              </p>
            </div>
          ) : vipError ? (
            <div className="p-6 sm:p-8">
              <p className="rounded-xl border border-[#c46a2d]/30 bg-[#c46a2d]/10 p-4 text-sm text-[#B4501F]">
                {vipError}
              </p>
            </div>
          ) : vipStatus ? (
            <div className="p-6 sm:p-8">
              <p className="text-sm leading-6 text-[#1F2A3C]/72">
                {VipTierDescription({ tier: vipStatus.vip_tier })}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#B8955A]/30 bg-[#FFFFFF]/60 p-5">
                  <p className="text-xs uppercase tracking-wider text-[#1F2A3C]/60">
                    Dostupni VIP poeni
                  </p>

                  <p className="mt-3 text-3xl font-bold text-[#8A6A33]">
                    {vipStatus.points_balance.toLocaleString("sr-RS")}
                  </p>

                  <p className="mt-2 text-xs text-[#1F2A3C]/72">
                    50 poena = 100 RSD popusta
                  </p>
                </div>

                <div className="rounded-2xl border border-[#B8955A]/30 bg-[#FFFFFF]/60 p-5">
                  <p className="text-xs uppercase tracking-wider text-[#1F2A3C]/60">
                    Vrednost tvojih poena
                  </p>

                  <p className="mt-3 text-3xl font-bold text-[#8A6A33]">
                    {formatRsd(vipStatus.points_value)}
                  </p>

                  <p className="mt-2 text-xs text-[#1F2A3C]/72">
                    RSD popusta za narednu kupovinu
                  </p>
                </div>

                <div className="rounded-2xl border border-[#B8955A]/30 bg-[#FFFFFF]/60 p-5 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-[#1F2A3C]/60">
                    Ukupna vrednost završenih kupovina
                  </p>

                  <p className="mt-3 text-3xl font-bold text-[#8A6A33]">
                    {formatRsd(vipStatus.lifetime_spend)} RSD
                  </p>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-[#B8955A]/30 bg-[#FFFFFF]/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#1F2A3C]/60">
                      Tvoj VIP napredak
                    </p>

                    <p className="mt-2 font-semibold text-[#8A6A33]">
                      {normalizedTier === "gold"
                        ? "Gold nivo dostignut!"
                        : normalizedTier === "silver"
                          ? "Napredak ka Gold nivou"
                          : "Napredak ka Silver nivou"}
                    </p>
                  </div>

                  <span className="text-lg font-bold text-[#8A6A33]">
                    {Math.round(vipStatus.progress_percent)}%
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#FFFFFF]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#B8955A] via-[#B8955A] to-[#B8955A] transition-all duration-700"
                    style={{
                      width: `${vipStatus.progress_percent}%`,
                    }}
                  />
                </div>

                {vipStatus.next_tier_spend !== null ? (
                  <p className="mt-3 text-xs leading-5 text-[#1F2A3C]/72">
                    Do sledećeg nivoa potrebno je još{" "}
                    <span className="font-semibold text-[#8A6A33]">
                      {formatRsd(
                        Math.max(
                          0,
                          vipStatus.next_tier_spend -
                            vipStatus.lifetime_spend
                        )
                      )}{" "}
                      RSD
                    </span>{" "}
                    potrošnje na završenim porudžbinama.
                  </p>
                ) : (
                  <p className="mt-3 text-xs leading-5 text-[#1F2A3C]/72">
                    Čestitamo! Dostigao si najviši VIP nivo.
                  </p>
                )}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                <div
                  className={`rounded-xl border p-3 text-center ${
                    normalizedTier === "bronze"
                      ? "border-[#B8955A]/90 bg-[#B8955A]/10"
                      : "border-[#B8955A]/15 bg-[#FFFFFF]/60"
                  }`}
                >
                  <p className="text-xs font-bold text-[#8A6A33]">
                    BRONZE
                  </p>
                  <p className="mt-1 text-[10px] text-[#1F2A3C]/60">
                    0–14.999 RSD
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3 text-center ${
                    normalizedTier === "silver"
                      ? "border-[#1F2A3C]/30 bg-[#1F2A3C]/5"
                      : "border-[#B8955A]/15 bg-[#FFFFFF]/60"
                  }`}
                >
                  <p className="text-xs font-bold text-[#1F2A3C]/70">
                    SILVER
                  </p>
                  <p className="mt-1 text-[10px] text-[#1F2A3C]/60">
                    15.000–39.999 RSD
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3 text-center ${
                    normalizedTier === "gold"
                      ? "border-[#B8955A]/90 bg-[#B8955A]/10"
                      : "border-[#B8955A]/15 bg-[#FFFFFF]/60"
                  }`}
                >
                  <p className="text-xs font-bold text-[#8A6A33]">
                    GOLD
                  </p>
                  <p className="mt-1 text-[10px] text-[#1F2A3C]/60">
                    40.000+ RSD
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-[#1F2A3C]/60">
                VIP poeni se dodaju nakon što porudžbina bude označena kao
                završena. Za svakih potrošenih 100 RSD dobijaš 1 poen.
              </p>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              <p className="text-sm text-[#1F2A3C]/72">
                VIP status trenutno nije dostupan.
              </p>
            </div>
          )}
        </section>

        {/* VIP HISTORY */}
        <section className="mt-8 rounded-3xl border border-[#B8955A]/40 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F8F4E7] p-6 shadow-[inset_0_1px_0_rgba(184,149,90,0.08),0_12px_40px_rgba(31,42,60,0.12)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A6A33]">
            WATCH STORE REWARDS
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#1F2A3C]">
            Istorija VIP poena
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#1F2A3C]/72">
            Pregled svih osvojenih i iskorišćenih VIP poena.
          </p>

          {vipLedgerLoading && (
            <p className="mt-6 text-sm text-[#1F2A3C]/72">
              Učitavanje istorije...
            </p>
          )}

          {vipLedgerError && (
            <p className="mt-6 rounded-xl border border-[#c46a2d]/30 bg-[#c46a2d]/10 p-4 text-sm text-[#B4501F]">
              {vipLedgerError}
            </p>
          )}

          {!vipLedgerLoading &&
            !vipLedgerError &&
            vipLedger.length === 0 && (
              <div className="mt-6 rounded-2xl border border-[#B8955A]/20 bg-[#FFFFFF]/60 p-6 text-center">
                <p className="text-2xl">⭐</p>
                <p className="mt-3 font-semibold text-[#8A6A33]">
                  Još nema VIP transakcija
                </p>
                <p className="mt-2 text-sm text-[#1F2A3C]/72">
                  Kada završiš prvu kupovinu, ovde će se pojaviti tvoji
                  osvojeni poeni.
                </p>
              </div>
            )}

          {!vipLedgerLoading &&
            !vipLedgerError &&
            vipLedger.length > 0 && (
              <div className="mt-6 space-y-3">
                {vipLedger.map((entry) => {
                  const earned = Number(entry.points_change) > 0;

                  return (
                    <article
                      key={entry.id}
                      className="flex flex-col gap-3 rounded-2xl border border-[#B8955A]/20 bg-[#FFFFFF]/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#8A6A33]">
                          <VipHistoryLabel entry={entry} />
                        </p>

                        {entry.order_number && (
                          <p className="mt-1 text-xs text-[#1F2A3C]/60">
                            Porudžbina: {entry.order_number}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-[#1F2A3C]/60">
                          {formatDate(entry.created_at)}
                        </p>

                        {Number(entry.amount_rsd) > 0 && (
                          <p className="mt-1 text-xs text-[#1F2A3C]/72">
                            Iznos: {formatRsd(entry.amount_rsd)} RSD
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        <span
                          className={`text-lg font-bold ${
                            earned ? "text-green-400" : "text-[#B4501F]"
                          }`}
                        >
                          {earned ? "+" : ""}
                          {Number(entry.points_change).toLocaleString(
                            "sr-RS"
                          )}{" "}
                          poena
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </section>

        <section className="mt-8 rounded-3xl border border-[#B8955A]/40 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F8F4E7] p-6 shadow-[inset_0_1px_0_rgba(184,149,90,0.08),0_12px_40px_rgba(31,42,60,0.12)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A6A33]">
            WATCH STORE
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#1F2A3C]">
            Moje porudžbine
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#1F2A3C]/72">
            Ovde možeš da pratiš status svojih porudžbina.
          </p>

          {ordersLoading && (
            <p className="mt-7 text-sm text-[#1F2A3C]/72">
              Učitavanje porudžbina...
            </p>
          )}

          {ordersError && (
            <p className="mt-7 rounded-xl border border-[#c46a2d]/30 bg-[#c46a2d]/10 p-4 text-sm text-[#B4501F]">
              {ordersError}
            </p>
          )}

          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div className="mt-7 rounded-2xl border border-[#B8955A]/20 bg-[#FFFFFF]/60 p-6 text-center">
              <p className="text-[#1F2A3C]/72">
                Još uvek nemaš nijednu aktivnu porudžbinu.
              </p>

              <Link
                href="/"
                className="mt-4 inline-flex rounded-xl border border-[#B8955A]/60 bg-[#B8955A]/10 px-5 py-2.5 text-sm font-semibold text-[#8A6A33] transition hover:bg-[#B8955A]/20"
              >
                Pogledaj proizvode
              </Link>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-[#B8955A]/30 bg-[#FFFFFF]/60 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#1F2A3C]/60">
                      Broj porudžbine
                    </p>

                    <p className="mt-1 font-mono text-lg font-semibold text-[#8A6A33]">
                      {order.order_number || order.id}
                    </p>

                    <p className="mt-2 text-xs text-[#1F2A3C]/60">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <p className="text-xl font-bold text-[#8A6A33]">
                    {Number(order.total).toFixed(2)} RSD
                  </p>
                </div>

                <OrderStatus status={order.status} />
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#B8955A]/45 bg-gradient-to-br from-[#FFFFFF] via-[#FFFFFF] to-[#F8F4E7] p-6 shadow-[inset_0_1px_0_rgba(184,149,90,0.08),0_12px_40px_rgba(31,42,60,0.12)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A6A33]">
            WATCH STORE REWARDS
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#1F2A3C]">
            Moji kuponi
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#1F2A3C]/72">
            Kao znak zahvalnosti za kupovinu, dobijaš popust za svoju
            narednu porudžbinu. Sačuvaj kod i iskoristi ga kada ponovo
            kupuješ.
          </p>

          {couponsLoading && (
            <p className="mt-6 text-sm text-[#1F2A3C]/72">
              Učitavanje kupona...
            </p>
          )}

          {couponsError && (
            <p className="mt-6 rounded-xl border border-[#c46a2d]/30 bg-[#c46a2d]/10 p-4 text-sm text-[#B4501F]">
              {couponsError}
            </p>
          )}

          {!couponsLoading &&
            !couponsError &&
            coupons.length === 0 && (
              <div className="mt-6 rounded-2xl border border-[#B8955A]/20 bg-[#FFFFFF]/60 p-6 text-center">
                <div className="text-3xl">🎁</div>
                <p className="mt-3 font-semibold text-[#8A6A33]">
                  Još nemaš osvojenih kupona
                </p>
                <p className="mt-2 text-sm text-[#1F2A3C]/72">
                  Nakon prve kupovine dobićeš kupon za sledeću porudžbinu.
                </p>
              </div>
            )}

          <div className="mt-6 space-y-4">
            {coupons.map((coupon) => {
              const isUsed = Boolean(coupon.redeemed_at);

              return (
                <article
                  key={coupon.code}
                  className={`relative overflow-hidden rounded-2xl border p-5 ${
                    isUsed
                      ? "border-[#1F2A3C]/15 bg-[#FFFFFF]/60"
                      : "border-[#B8955A]/70 bg-gradient-to-br from-[#B8955A]/20 via-[#FFFFFF] to-[#F8F4E7]"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-3xl font-bold text-[#8A6A33]">
                          {coupon.discount_percent}%
                        </span>

                        <span className="text-sm text-[#1F2A3C]/72">
                          popusta na sledeću kupovinu
                        </span>
                      </div>

                      <p className="mt-3 text-xs uppercase tracking-wider text-[#1F2A3C]/60">
                        Tvoj kupon kod
                      </p>

                      <p className="mt-1 break-all font-mono text-lg font-bold tracking-wider text-[#1F2A3C]">
                        {coupon.code}
                      </p>

                      <p className="mt-2 text-xs text-[#1F2A3C]/60">
                        Osvojen: {formatDate(coupon.created_at)}
                      </p>

                      {coupon.source_order_number && (
                        <p className="mt-1 text-xs text-[#1F2A3C]/60">
                          Porudžbina: {coupon.source_order_number}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          isUsed
                            ? "border-[#1F2A3C]/15 bg-[#1F2A3C]/5 text-[#1F2A3C]/72"
                            : "border-[#B8955A]/60 bg-[#B8955A]/10 text-[#8A6A33]"
                        }`}
                      >
                        {isUsed ? "Iskorišćen" : "Dostupan"}
                      </span>

                      {!isUsed && (
                        <button
                          type="button"
                          onClick={() => copyCoupon(coupon.code)}
                          className="rounded-xl border border-[#B8955A]/75 bg-gradient-to-b from-[#1F2A3C] via-[#1F2A3C] to-[#1F2A3C] px-4 py-2.5 text-sm font-semibold text-[#F8F4E7] transition hover:brightness-110 active:scale-95"
                        >
                          {copiedCode === coupon.code
                            ? "✓ Kopirano"
                            : "Kopiraj kod"}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isUsed && (
                    <div className="mt-5 border-t border-[#B8955A]/20 pt-4">
                      <p className="text-xs leading-5 text-[#1F2A3C]/72">
                        Unesi ovaj kod u korpi prilikom sledeće kupovine.
                        Kupon može da se iskoristi samo jednom.
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}