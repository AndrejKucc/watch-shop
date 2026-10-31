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

const STATUS_STEPS = [
  { value: "new", label: "Poručena" },
  { value: "confirmed", label: "Potvrđena" },
  { value: "shipped", label: "Poslata" },
];

function formatDate(value: string) {
  return new Date(value).toLocaleString("sr-RS");
}

function OrderStatus({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <span className="rounded-full border border-[#c46a2d]/40 bg-[#c46a2d]/10 px-3 py-1.5 text-xs font-semibold text-[#e8a078]">
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
                    ? "border-[#d6b878] bg-[#d6b878] text-[#211812]"
                    : "border-[#d6b878]/25 bg-[#17110d] text-[#8f8071]"
                }`}
              >
                {completed ? "✓" : index + 1}
              </div>

              <span
                className={`mt-2 text-center text-[11px] sm:text-xs ${
                  completed ? "text-[#ead4a0]" : "text-[#8f8071]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#17110d]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#bd9650] to-[#ead4a0] transition-all duration-500"
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

      await Promise.all([loadOrders(user.id), loadCoupons()]);

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
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#211812] via-[#2b2018] to-[#17110d] text-[#d6b878]">
        Učitavanje naloga...
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#211812] via-[#2b2018] to-[#17110d] px-5 py-16 text-[#f4ebdd]">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-[#b8a99a] transition hover:text-[#ead4a0]"
        >
          ← Nazad u prodavnicu
        </Link>

        <section className="mt-8 rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] via-[#2b2018] to-[#211812] p-6 shadow-[inset_0_1px_0_rgba(234,212,160,0.08),0_12px_40px_rgba(0,0,0,0.2)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b878]">
            WATCH SHOP
          </p>

          <h1 className="mt-4 text-3xl font-bold text-[#f4ebdd] sm:text-4xl">
            Moj nalog
          </h1>

          <p className="mt-3 text-[#c2b5a8]">
            Dobro došao u svoj korisnički nalog.
          </p>

          <div className="mt-8 space-y-5 border-t border-[#d6b878]/20 pt-6">
            <div>
              <p className="text-sm text-[#b8a99a]">Ime i prezime</p>
              <p className="mt-1 text-lg text-[#f4ebdd]">
                {user.user_metadata?.full_name || "Nije uneto"}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#b8a99a]">Email adresa</p>
              <p className="mt-1 break-all text-lg text-[#f4ebdd]">
                {user.email || "Nije dostupna"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-5 py-3 text-sm font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:brightness-110 active:scale-95"
            >
              Nastavi kupovinu
            </Link>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-[#d6b878]/30 bg-[#211812]/60 px-5 py-3 text-sm font-semibold text-[#ead4a0] transition hover:border-[#d6b878]/60 hover:bg-[#4b3621]/50 active:scale-95"
            >
              Odjavi se
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-[#c46a2d]/40 bg-[#c46a2d]/10 px-4 py-3 text-sm text-[#f0a477]"
            >
              {error}
            </p>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b] via-[#2b2018] to-[#211812] p-6 shadow-[inset_0_1px_0_rgba(234,212,160,0.08),0_12px_40px_rgba(0,0,0,0.2)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b878]">
            WATCH SHOP
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#f4ebdd]">
            Moje porudžbine
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#b8a99a]">
            Ovde možeš da pratiš status svojih porudžbina.
          </p>

          {ordersLoading && (
            <p className="mt-7 text-sm text-[#b8a99a]">
              Učitavanje porudžbina...
            </p>
          )}

          {ordersError && (
            <p className="mt-7 rounded-xl border border-[#c46a2d]/30 bg-[#c46a2d]/10 p-4 text-sm text-[#e8a078]">
              {ordersError}
            </p>
          )}

          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div className="mt-7 rounded-2xl border border-[#d6b878]/15 bg-[#17110d]/50 p-6 text-center">
              <p className="text-[#c2b5a8]">
                Još uvek nemaš nijednu aktivnu porudžbinu.
              </p>

              <Link
                href="/"
                className="mt-4 inline-flex rounded-xl border border-[#ead4a0]/40 bg-[#d6b878]/10 px-5 py-2.5 text-sm font-semibold text-[#ead4a0] transition hover:bg-[#d6b878]/20"
              >
                Pogledaj proizvode
              </Link>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-[#d6b878]/20 bg-[#17110d]/50 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#8f8071]">
                      Broj porudžbine
                    </p>

                    <p className="mt-1 font-mono text-lg font-semibold text-[#ead4a0]">
                      {order.order_number || order.id}
                    </p>

                    <p className="mt-2 text-xs text-[#8f8071]">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <p className="text-xl font-bold text-[#ead4a0]">
                    {Number(order.total).toFixed(2)} RSD
                  </p>
                </div>

                <OrderStatus status={order.status} />
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d6b878]/30 bg-gradient-to-br from-[#30231b] via-[#2b2018] to-[#211812] p-6 shadow-[inset_0_1px_0_rgba(234,212,160,0.08),0_12px_40px_rgba(0,0,0,0.2)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d6b878]">
            WATCH SHOP REWARDS
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#f4ebdd]">
            Moji kuponi
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#b8a99a]">
            Kao znak zahvalnosti za kupovinu, dobijaš popust za svoju
            narednu porudžbinu. Sačuvaj kod i iskoristi ga kada ponovo
            kupuješ.
          </p>

          {couponsLoading && (
            <p className="mt-6 text-sm text-[#b8a99a]">
              Učitavanje kupona...
            </p>
          )}

          {couponsError && (
            <p className="mt-6 rounded-xl border border-[#c46a2d]/30 bg-[#c46a2d]/10 p-4 text-sm text-[#e8a078]">
              {couponsError}
            </p>
          )}

          {!couponsLoading &&
            !couponsError &&
            coupons.length === 0 && (
              <div className="mt-6 rounded-2xl border border-[#d6b878]/15 bg-[#17110d]/50 p-6 text-center">
                <div className="text-3xl">🎁</div>
                <p className="mt-3 font-semibold text-[#ead4a0]">
                  Još nemaš osvojenih kupona
                </p>
                <p className="mt-2 text-sm text-[#b8a99a]">
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
                      ? "border-[#8f8071]/20 bg-[#17110d]/40"
                      : "border-[#d6b878]/45 bg-gradient-to-br from-[#4b3621]/70 via-[#30231b] to-[#211812]"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-3xl font-bold text-[#ead4a0]">
                          {coupon.discount_percent}%
                        </span>

                        <span className="text-sm text-[#c2b5a8]">
                          popusta na sledeću kupovinu
                        </span>
                      </div>

                      <p className="mt-3 text-xs uppercase tracking-wider text-[#8f8071]">
                        Tvoj kupon kod
                      </p>

                      <p className="mt-1 break-all font-mono text-lg font-bold tracking-wider text-[#f4ebdd]">
                        {coupon.code}
                      </p>

                      <p className="mt-2 text-xs text-[#8f8071]">
                        Osvojen: {formatDate(coupon.created_at)}
                      </p>

                      {coupon.source_order_number && (
                        <p className="mt-1 text-xs text-[#8f8071]">
                          Porudžbina: {coupon.source_order_number}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          isUsed
                            ? "border-[#8f8071]/30 bg-[#8f8071]/10 text-[#b8a99a]"
                            : "border-[#d6b878]/40 bg-[#d6b878]/10 text-[#ead4a0]"
                        }`}
                      >
                        {isUsed ? "Iskorišćen" : "Dostupan"}
                      </span>

                      {!isUsed && (
                        <button
                          type="button"
                          onClick={() => copyCoupon(coupon.code)}
                          className="rounded-xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-4 py-2.5 text-sm font-semibold text-[#211812] transition hover:brightness-110 active:scale-95"
                        >
                          {copiedCode === coupon.code
                            ? "✓ Kopirano"
                            : "Kopiraj kod"}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isUsed && (
                    <div className="mt-5 border-t border-[#d6b878]/15 pt-4">
                      <p className="text-xs leading-5 text-[#b8a99a]">
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