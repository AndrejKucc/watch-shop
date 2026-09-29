"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  settlement: string | null;
  city: string;
  postal_code: string;
  payment_method: string;
  status: string;
  total: number;
  created_at: string;
};

type OrderItemDetail = {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    brand: string | null;
    model: string | null;
  } | null;
};

const STATUS_OPTIONS = [
  { value: "new", label: "Nova" },
  { value: "confirmed", label: "Potvrđena" },
  { value: "shipped", label: "Poslata" },
  { value: "completed", label: "Završena" },
  { value: "cancelled", label: "Otkazana" },
];

function statusLabel(status: string) {
  return (
    STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("sr-RS");
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderItemsByOrderId, setOrderItemsByOrderId] = useState<
    Record<string, OrderItemDetail[]>
  >({});
  const [detailsLoading, setDetailsLoading] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<Record<string, string>>({});

  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(
    null
  );

  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, customer_name, phone, email, address, settlement, city, postal_code, payment_method, status, total, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Greška: " + error.message);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  async function toggleOrder(orderId: string) {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    if (orderItemsByOrderId[orderId]) {
      return;
    }

    setDetailsLoading(orderId);

    setDetailsError((current) => {
      const next = { ...current };
      delete next[orderId];
      return next;
    });

    const supabase = createClient();

    const { data, error } = await supabase
      .from("order_items")
      .select("id, product_id, quantity, price, products(name, brand, model)")
      .eq("order_id", orderId);

    if (error) {
      console.error(error);

      setDetailsError((current) => ({
        ...current,
        [orderId]: "Greška pri učitavanju stavki: " + error.message,
      }));

      setDetailsLoading(null);
      return;
    }

    setOrderItemsByOrderId((current) => ({
      ...current,
      [orderId]: (data || []) as unknown as OrderItemDetail[],
    }));

    setDetailsLoading(null);
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    const currentOrder = orders.find((order) => order.id === orderId);

    if (!currentOrder) {
      return;
    }

    const previousStatus = currentOrder.status;

    setStatusUpdatingId(orderId);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      setMessage("Greška pri promeni statusa: " + error.message);
      setStatusUpdatingId(null);
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    setStatusUpdatingId(null);

    if (newStatus === "shipped" && previousStatus !== "shipped") {
      try {
        const emailResponse = await fetch("/api/send-order-shipped", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
          }),
        });

        const emailData = await emailResponse.json();

        if (!emailResponse.ok) {
          console.error("GREŠKA PRI SLANJU EMAILA O SLANJU:", emailData);

          setMessage(
            "Status je promenjen u „Poslata“, ali email kupcu nije poslat."
          );

          return;
        }

        setMessage(
          "Status je promenjen u „Poslata“ i email kupcu je uspešno poslat."
        );
      } catch (emailError) {
        console.error(
          "GREŠKA PRI POZIVU API-JA ZA EMAIL O SLANJU:",
          emailError
        );

        setMessage(
          "Status je promenjen u „Poslata“, ali email kupcu nije poslat."
        );
      }
    } else {
      setMessage("Status porudžbine je uspešno promenjen.");
    }
  }

  async function handleDeleteOrder(order: Order) {
    if (
      order.status !== "cancelled" &&
      order.status !== "shipped" &&
      order.status !== "completed"
    ) {
      setMessage(
        "Porudžbina može biti obrisana samo kada je otkazana, poslata ili završena."
      );
      return;
    }

    const confirmed = window.confirm(
      order.status === "cancelled"
        ? "Da li sigurno želiš da obrišeš ovu otkazanu porudžbinu? Količina satova iz porudžbine biće vraćena na stanje."
        : "Da li sigurno želiš da obrišeš ovu porudžbinu? Podaci porudžbine će biti trajno obrisani."
    );

    if (!confirmed) {
      return;
    }

    setDeletingOrderId(order.id);
    setMessage("");

    const supabase = createClient();

    const { error } = await supabase.rpc("delete_order", {
      p_order_id: order.id,
    });

    if (error) {
      console.error(error);
      setMessage("Greška pri brisanju porudžbine: " + error.message);
      setDeletingOrderId(null);
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.filter((currentOrder) => currentOrder.id !== order.id)
    );

    setOrderItemsByOrderId((current) => {
      const next = { ...current };
      delete next[order.id];
      return next;
    });

    setDetailsError((current) => {
      const next = { ...current };
      delete next[order.id];
      return next;
    });

    if (expandedOrderId === order.id) {
      setExpandedOrderId(null);
    }

    setDeletingOrderId(null);
    setMessage("Porudžbina je obrisana.");
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/admin";
          }}
          className="mb-8 rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white hover:text-black"
        >
          Nazad na admin
        </button>

        <h1 className="text-4xl font-bold">Porudžbine</h1>

        <p className="mt-2 text-neutral-400">
          Pregled i upravljanje porudžbinama kupaca.
        </p>

        {loading && (
          <p className="mt-10 text-neutral-400">
            Učitavanje porudžbina...
          </p>
        )}

        {message && (
          <p className="mt-10 text-sm text-neutral-300">
            {message}
          </p>
        )}

        {!loading && orders.length === 0 && !message && (
          <p className="mt-10 text-neutral-400">
            Trenutno nema porudžbina.
          </p>
        )}

        <div className="mt-10 space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const items = orderItemsByOrderId[order.id];

            const canDelete =
              order.status === "cancelled" ||
              order.status === "shipped" ||
              order.status === "completed";

            const isDeleting = deletingOrderId === order.id;

            return (
              <div
                key={order.id}
                className="rounded-3xl border border-white/10 bg-neutral-900"
              >
                <button
                  type="button"
                  onClick={() => toggleOrder(order.id)}
                  className="flex w-full flex-col gap-2 p-6 text-left sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-500">
                      Porudžbina
                    </p>

                    <p className="mt-1 break-all font-mono text-sm text-neutral-300">
                      {order.id}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">
                      {order.customer_name}
                    </p>

                    <p className="text-sm text-neutral-500">
                      {order.phone}
                      {order.email ? ` · ${order.email}` : ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-400">
                      {order.address}
                    </p>

                    <p className="mt-1 text-sm text-neutral-500">
                      {order.settlement ? `${order.settlement}, ` : ""}
                      {order.city} {order.postal_code}
                    </p>
                  </div>

                  <div className="text-sm text-neutral-400">
                    {order.payment_method === "cash_on_delivery"
                      ? "Pouzećem"
                      : order.payment_method}
                  </div>

                  <div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                      {statusLabel(order.status)}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {Number(order.total).toFixed(2)} RSD
                    </p>

                    <p className="text-xs text-neutral-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-white/10 p-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-300">
                          Podaci kupca
                        </h3>

                        <dl className="mt-3 space-y-1 text-sm text-neutral-400">
                          <div>
                            <dt className="inline text-neutral-500">
                              Ime i prezime:{" "}
                            </dt>
                            <dd className="inline">
                              {order.customer_name}
                            </dd>
                          </div>

                          <div>
                            <dt className="inline text-neutral-500">
                              Telefon:{" "}
                            </dt>
                            <dd className="inline">{order.phone}</dd>
                          </div>

                          {order.email && (
                            <div>
                              <dt className="inline text-neutral-500">
                                Email:{" "}
                              </dt>
                              <dd className="inline">{order.email}</dd>
                            </div>
                          )}

                          <div>
                            <dt className="inline text-neutral-500">
                              Adresa:{" "}
                            </dt>
                            <dd className="inline">{order.address}</dd>
                          </div>

                          {order.settlement && (
                            <div>
                              <dt className="inline text-neutral-500">
                                Mesto / naselje:{" "}
                              </dt>
                              <dd className="inline">
                                {order.settlement}
                              </dd>
                            </div>
                          )}

                          <div>
                            <dt className="inline text-neutral-500">
                              Grad:{" "}
                            </dt>
                            <dd className="inline">{order.city}</dd>
                          </div>

                          <div>
                            <dt className="inline text-neutral-500">
                              Poštanski broj:{" "}
                            </dt>
                            <dd className="inline">
                              {order.postal_code}
                            </dd>
                          </div>

                          <div>
                            <dt className="inline text-neutral-500">
                              Način plaćanja:{" "}
                            </dt>
                            <dd className="inline">
                              {order.payment_method ===
                              "cash_on_delivery"
                                ? "Pouzećem"
                                : order.payment_method}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-neutral-300">
                          Status porudžbine
                        </h3>

                        <select
                          value={order.status}
                          onChange={(event) =>
                            handleStatusChange(
                              order.id,
                              event.target.value
                            )
                          }
                          disabled={statusUpdatingId === order.id}
                          className="mt-3 w-full rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 outline-none disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>

                        {statusUpdatingId === order.id && (
                          <p className="mt-2 text-xs text-neutral-500">
                            Čuvanje statusa...
                          </p>
                        )}

                        <div className="mt-5">
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order)}
                            disabled={!canDelete || isDeleting}
                            className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            {isDeleting
                              ? "Brisanje..."
                              : "Obriši porudžbinu"}
                          </button>

                          {!canDelete && (
                            <p className="mt-2 text-xs leading-5 text-neutral-600">
                              Brisanje je dostupno kada je porudžbina
                              otkazana, poslata ili završena.
                            </p>
                          )}

                          {order.status === "cancelled" && (
                            <p className="mt-2 text-xs leading-5 text-neutral-500">
                              Kod otkazane porudžbine zaliha će biti
                              automatski vraćena.
                            </p>
                          )}

                          {(order.status === "shipped" ||
                            order.status === "completed") && (
                            <p className="mt-2 text-xs leading-5 text-neutral-500">
                              Kod poslate ili završene porudžbine zaliha
                              se ne vraća.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <h3 className="mt-8 text-sm font-semibold text-neutral-300">
                      Stavke porudžbine
                    </h3>

                    {detailsLoading === order.id && (
                      <p className="mt-3 text-sm text-neutral-500">
                        Učitavanje stavki...
                      </p>
                    )}

                    {detailsError[order.id] && (
                      <p className="mt-3 text-sm text-red-400">
                        {detailsError[order.id]}
                      </p>
                    )}

                    {items && items.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 text-sm"
                          >
                            <div>
                              <p className="text-neutral-200">
                                {item.products?.name ??
                                  "Proizvod je obrisan"}
                              </p>

                              {item.products?.brand && (
                                <p className="text-neutral-500">
                                  {item.products.brand}
                                  {item.products.model
                                    ? ` · ${item.products.model}`
                                    : ""}
                                </p>
                              )}
                            </div>

                            <div className="text-neutral-400">
                              {item.quantity} x{" "}
                              {Number(item.price).toFixed(2)} RSD
                            </div>

                            <div className="font-semibold">
                              {(
                                item.quantity *
                                Number(item.price)
                              ).toFixed(2)}{" "}
                              RSD
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center justify-between border-t border-white/10 pt-3">
                          <p className="text-neutral-400">
                            Ukupno porudžbine
                          </p>

                          <p className="text-lg font-bold">
                            {Number(order.total).toFixed(2)} RSD
                          </p>
                        </div>
                      </div>
                    )}

                    {items && items.length === 0 && (
                      <p className="mt-3 text-sm text-neutral-500">
                        Ova porudžbina nema stavki.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}