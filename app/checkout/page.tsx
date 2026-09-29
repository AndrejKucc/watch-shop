"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useCart } from "@/components/cart";

type OrderResult = {
  order_id: string;
  total: number;
};

const SERBIAN_CITIES: { name: string; postalCode: string }[] = [
  { name: "Beograd", postalCode: "11000" },
  { name: "Novi Sad", postalCode: "21000" },
  { name: "Niš", postalCode: "18000" },
  { name: "Kragujevac", postalCode: "34000" },
  { name: "Subotica", postalCode: "24000" },
  { name: "Zrenjanin", postalCode: "23000" },
  { name: "Pančevo", postalCode: "26000" },
  { name: "Čačak", postalCode: "32000" },
  { name: "Kruševac", postalCode: "37000" },
  { name: "Kraljevo", postalCode: "36000" },
  { name: "Novi Pazar", postalCode: "36300" },
  { name: "Užice", postalCode: "31000" },
  { name: "Vranje", postalCode: "17500" },
  { name: "Šabac", postalCode: "15000" },
  { name: "Smederevo", postalCode: "11300" },
  { name: "Leskovac", postalCode: "16000" },
  { name: "Valjevo", postalCode: "14000" },
  { name: "Sombor", postalCode: "25000" },
  { name: "Sremska Mitrovica", postalCode: "22000" },
  { name: "Požarevac", postalCode: "12000" },
  { name: "Zaječar", postalCode: "19000" },
  { name: "Pirot", postalCode: "18300" },
  { name: "Prokuplje", postalCode: "18400" },
  { name: "Loznica", postalCode: "15300" },
  { name: "Jagodina", postalCode: "35000" },
  { name: "Vršac", postalCode: "26300" },
  { name: "Bor", postalCode: "19210" },
  { name: "Kikinda", postalCode: "23300" },
  { name: "Paraćin", postalCode: "35250" },
  { name: "Bačka Palanka", postalCode: "21400" },
  { name: "Ruma", postalCode: "22400" },
  { name: "Inđija", postalCode: "22320" },
  { name: "Vrbas", postalCode: "21460" },
  { name: "Aranđelovac", postalCode: "34300" },
  { name: "Gornji Milanovac", postalCode: "32300" },
  { name: "Trstenik", postalCode: "37240" },
  { name: "Vrnjačka Banja", postalCode: "36210" },
  { name: "Sjenica", postalCode: "36310" },
  { name: "Priboj", postalCode: "31330" },
  { name: "Prijepolje", postalCode: "31300" },
  { name: "Lazarevac", postalCode: "11550" },
  { name: "Obrenovac", postalCode: "11500" },
  { name: "Mladenovac", postalCode: "11400" },
  { name: "Ćuprija", postalCode: "35230" },
  { name: "Negotin", postalCode: "19300" },
  { name: "Knjaževac", postalCode: "19350" },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [settlement, setSettlement] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [placedOrder, setPlacedOrder] = useState<OrderResult | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const citySuggestions = useMemo(() => {
    const query = city.trim().toLowerCase();

    if (query.length === 0) {
      return [];
    }

    return SERBIAN_CITIES.filter((entry) =>
      entry.name.toLowerCase().startsWith(query)
    ).slice(0, 8);
  }, [city]);

  function selectCitySuggestion(entry: {
    name: string;
    postalCode: string;
  }) {
    setCity(entry.name);
    setPostalCode(entry.postalCode);
    setShowCitySuggestions(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      setMessage("Greška: korpa je prazna.");
      return;
    }

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const rpcItems = items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const { data, error } = await supabase.rpc("create_order", {
      p_customer_name: fullName,
      p_phone: phone,
      p_email: email,
      p_address: address,
      p_settlement: settlement,
      p_city: city,
      p_postal_code: postalCode,
      p_items: rpcItems,
    });

    if (error) {
      console.error("GREŠKA PRI KREIRANJU PORUDŽBINE:", error);

      setMessage(
        "Greška pri kreiranju porudžbine: " +
          error.message +
          " Pokušaj ponovo."
      );

      setLoading(false);
      return;
    }

    const result = Array.isArray(data) ? data[0] : data;

    if (!result || !result.order_id) {
      console.error("NEOČEKIVAN ODGOVOR OD create_order:", data);

      setMessage(
        "Porudžbina nije mogla da se potvrdi zbog neočekivane greške. Pokušaj ponovo."
      );

      setLoading(false);
      return;
    }

    const orderResult = {
      order_id: result.order_id,
      total: Number(result.total),
    };

    setPlacedOrder(orderResult);

    try {
      const emailResponse = await fetch("/api/send-order-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderResult.order_id,
          email,
        }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error("GREŠKA PRI SLANJU EMAILA:", emailData);
        setEmailSent(false);
      } else {
        setEmailSent(true);
      }
    } catch (emailError) {
      console.error("GREŠKA PRI POZIVU EMAIL API-JA:", emailError);
      setEmailSent(false);
    }

    clearCart();
    setLoading(false);
  }

  if (placedOrder) {
    return (
      <main className="min-h-screen bg-neutral-950 px-5 py-10 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[2rem] border border-white/10 bg-neutral-900 p-7 text-center sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-9 w-9"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <p className="mt-7 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
              WATCH SHOP
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Porudžbina je uspešno poslata
            </h1>

            <p className="mx-auto mt-4 max-w-lg leading-7 text-neutral-400">
              Hvala na kupovini. Kontaktiraćemo te uskoro radi potvrde
              porudžbine i dogovora oko dostave.
            </p>

            {emailSent ? (
              <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
                Potvrda porudžbine je poslata na tvoj email.
              </div>
            ) : (
              <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-400">
                Porudžbina je uspešno napravljena, ali potvrda emailom trenutno
                nije poslata.
              </div>
            )}

            <div className="mt-9 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 text-left">
              <div className="flex flex-col gap-2 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-neutral-500">
                  Broj porudžbine
                </span>

                <span className="break-all font-mono text-sm text-neutral-200 sm:text-right">
                  {placedOrder.order_id}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
                <span className="text-sm text-neutral-500">
                  Ukupan iznos
                </span>

                <span className="text-xl font-bold">
                  {placedOrder.total.toFixed(2)} RSD
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-5">
                <span className="text-sm text-neutral-500">
                  Način plaćanja
                </span>

                <span className="font-semibold">Pouzećem</span>
              </div>
            </div>

            <Link
              href="/"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-neutral-200 active:scale-[0.98] sm:w-auto"
            >
              Nazad na početnu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-neutral-950 px-5 py-10 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[2rem] border border-white/10 bg-neutral-900 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-neutral-800 text-2xl">
              🛒
            </div>

            <h1 className="mt-6 text-2xl font-semibold">Korpa je prazna</h1>

            <p className="mt-2 text-neutral-500">
              Dodaj neki sat pre nego što nastaviš na porudžbinu.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-2xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-neutral-200 active:scale-95"
            >
              Nazad u prodavnicu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-white sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-white/10 pb-8">
          <Link
            href="/cart"
            className="inline-flex rounded-xl border border-white/10 px-4 py-2.5 text-sm text-neutral-400 transition hover:bg-white hover:text-black active:scale-95"
          >
            ← Nazad na korpu
          </Link>

          <div className="mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
              WATCH SHOP
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Potvrda porudžbine
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-500">
              Unesi podatke za dostavu. Plaćanje se vrši pouzećem prilikom
              preuzimanja.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-neutral-900 p-6 sm:p-8"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                01
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Podaci za dostavu
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Unesi tačne podatke kako bismo mogli da te kontaktiramo.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-neutral-300"
                >
                  Ime i prezime
                </label>

                <input
                  id="fullName"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  autoComplete="name"
                  className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3.5 text-white outline-none transition placeholder:text-neutral-700 focus:border-white/30"
                  placeholder="Petar Petrović"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-neutral-300"
                >
                  Telefon
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  autoComplete="tel"
                  className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3.5 text-white outline-none transition placeholder:text-neutral-700 focus:border-white/30"
                  placeholder="+381 6X XXX XXXX"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-neutral-300"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3.5 text-white outline-none transition placeholder:text-neutral-700 focus:border-white/30"
                  placeholder="petar@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-neutral-300"
                >
                  Adresa
                </label>

                <input
                  id="address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                  autoComplete="street-address"
                  className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3.5 text-white outline-none transition placeholder:text-neutral-700 focus:border-white/30"
                  placeholder="Ulica i broj"
                />
              </div>

              <div>
                <label
                  htmlFor="settlement"
                  className="mb-2 block text-sm font-medium text-neutral-300"
                >
                  Mesto / naselje
                </label>

                <input
                  id="settlement"
                  value={settlement}
                  onChange={(event) => setSettlement(event.target.value)}
                  required
                  autoComplete="address-line2"
                  className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3.5 text-white outline-none transition placeholder:text-neutral-700 focus:border-white/30"
                  placeholder="npr. Mladenovac"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="relative">
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-neutral-300"
                  >
                    Grad
                  </label>

                  <input
                    id="city"
                    value={city}
                    onChange={(event) => {
                      setCity(event.target.value);
                      setShowCitySuggestions(true);
                    }}
                    onFocus={() => setShowCitySuggestions(true)}
                    onBlur={() => {
                      setTimeout(
                        () => setShowCitySuggestions(false),
                        100
                      );
                    }}
                    required
                    autoComplete="address-level2"
                    className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3.5 text-white outline-none transition placeholder:text-neutral-700 focus:border-white/30"
                    placeholder="npr. Beograd"
                  />

                  {showCitySuggestions &&
                    citySuggestions.length > 0 && (
                      <ul className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-white/10 bg-neutral-800 shadow-xl">
                        {citySuggestions.map((entry) => (
                          <li key={entry.name}>
                            <button
                              type="button"
                              onMouseDown={() =>
                                selectCitySuggestion(entry)
                              }
                              className="flex min-h-12 w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition hover:bg-neutral-700"
                            >
                              <span>{entry.name}</span>

                              <span className="text-neutral-500">
                                {entry.postalCode}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="mb-2 block text-sm font-medium text-neutral-300"
                  >
                    Poštanski broj
                  </label>

                  <input
                    id="postalCode"
                    value={postalCode}
                    onChange={(event) => setPostalCode(event.target.value)}
                    required
                    inputMode="numeric"
                    autoComplete="postal-code"
                    className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3.5 text-white outline-none transition placeholder:text-neutral-700 focus:border-white/30"
                    placeholder="37000"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-7">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
                02
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Način plaćanja
              </h2>

              <div className="mt-5 flex items-start gap-4 rounded-2xl border border-white/15 bg-neutral-950 p-5">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-white bg-white">
                  <div className="h-2 w-2 rounded-full bg-black" />
                </div>

                <div>
                  <p className="font-semibold">Plaćanje pouzećem</p>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Plaćaš prilikom preuzimanja pošiljke.
                  </p>
                </div>
              </div>
            </div>

            {message && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm leading-6 text-red-400">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-neutral-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Šaljem porudžbinu..." : "Potvrdi porudžbinu"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-neutral-600">
              Klikom na dugme potvrđuješ da su uneseni podaci tačni.
            </p>
          </form>

          <aside className="rounded-[2rem] border border-white/10 bg-neutral-900 p-6 lg:sticky lg:top-24">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-500">
              Pregled
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Tvoja porudžbina
            </h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-800">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-neutral-500">
                        Slika sata
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {item.quantity} × {item.price.toFixed(2)} RSD
                    </p>
                  </div>

                  <p className="flex-shrink-0 text-sm font-semibold">
                    {(item.price * item.quantity).toFixed(2)} RSD
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Proizvodi</span>

                <span>
                  {totalQuantity}{" "}
                  {totalQuantity === 1 ? "komad" : "komada"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">Plaćanje</span>

                <span>Pouzećem</span>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                Ukupno
              </p>

              <p className="mt-2 text-4xl font-bold tracking-tight">
                {totalPrice.toFixed(2)} RSD
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}