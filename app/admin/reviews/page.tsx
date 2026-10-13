"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Review = {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  is_featured: boolean;
};

type ReviewWithProduct = Review & {
  product_name: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      window.location.href = "/admin";
      return;
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc(
      "is_shop_admin"
    );

    if (adminError || !isAdmin) {
      setAuthorized(false);
      setError("Nemaš dozvolu za pristup ovoj stranici.");
      setLoading(false);
      return;
    }

    setAuthorized(true);

    const { data, error: reviewsError } = await supabase
      .from("product_reviews")
      .select(
        "id, product_id, reviewer_name, rating, comment, created_at, is_featured"
      )
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (reviewsError) {
      setError("Greška pri učitavanju recenzija: " + reviewsError.message);
      setLoading(false);
      return;
    }

    const reviewsData = data || [];
    const productIds = [
      ...new Set(reviewsData.map((review) => review.product_id)),
    ];

    let productNames: Record<string, string> = {};

    if (productIds.length > 0) {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name")
        .in("id", productIds);

      if (productsError) {
        console.error("Greška pri učitavanju proizvoda:", productsError);
      } else {
        productNames = Object.fromEntries(
          (products || []).map((product) => [product.id, product.name])
        );
      }
    }

    setReviews(
      reviewsData.map((review) => ({
        ...review,
        is_featured: review.is_featured ?? false,
        product_name: productNames[review.product_id] || "Nepoznat proizvod",
      }))
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function toggleFeatured(review: ReviewWithProduct) {
    setBusyId(review.id);
    setMessage("");
    setError("");

    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Sesija je istekla. Prijavi se ponovo.");
      setBusyId(null);
      return;
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc(
      "is_shop_admin"
    );

    if (adminError || !isAdmin) {
      setError("Nemaš administratorsku dozvolu za ovu radnju.");
      setBusyId(null);
      return;
    }

    const newValue = !review.is_featured;

    const { data, error: updateError } = await supabase
      .from("product_reviews")
      .update({ is_featured: newValue })
      .eq("id", review.id)
      .select("id, is_featured");

    if (updateError || !data?.length) {
      setError(
        "Izmena nije uspela. Proveri administratorska RLS pravila u Supabase-u."
      );
      setBusyId(null);
      return;
    }

    setReviews((current) =>
      current
        .map((item) =>
          item.id === review.id
            ? { ...item, is_featured: newValue }
            : item
        )
        .sort(
          (a, b) =>
            Number(b.is_featured) - Number(a.is_featured) ||
            new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
        )
    );

    setMessage(
      newValue
        ? "Recenzija je istaknuta i prikazivaće se prva."
        : "Isticanje recenzije je uklonjeno."
    );

    setBusyId(null);
  }

  async function deleteReview(review: ReviewWithProduct) {
    const confirmed = window.confirm(
      `Da li sigurno želiš da obrišeš recenziju korisnika ${review.reviewer_name}?\n\nOva radnja se ne može poništiti.`
    );

    if (!confirmed) return;

    setBusyId(review.id);
    setMessage("");
    setError("");

    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Sesija je istekla. Prijavi se ponovo.");
      setBusyId(null);
      return;
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc(
      "is_shop_admin"
    );

    if (adminError || !isAdmin) {
      setError("Nemaš administratorsku dozvolu za brisanje.");
      setBusyId(null);
      return;
    }

    const { data, error: deleteError } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", review.id)
      .select("id");

    if (deleteError || !data?.length) {
      setError(
        "Brisanje nije uspelo. Proveri administratorska prava i RLS pravila."
      );
      setBusyId(null);
      return;
    }

    setReviews((current) =>
      current.filter((item) => item.id !== review.id)
    );
    setMessage("Recenzija je uspešno obrisana.");
    setBusyId(null);
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="inline-block rounded-xl border border-white/10 px-5 py-3 text-sm transition hover:bg-white hover:text-black"
        >
          ← Nazad na admin
        </Link>

        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Administracija
          </p>

          <h1 className="mt-3 text-4xl font-bold">Recenzije</h1>

          <p className="mt-3 text-neutral-400">
            Pregledaj recenzije, istakni najbolje i ukloni neželjene komentare.
          </p>
        </div>

        {message && (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-300"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-8 break-words rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-300"
          >
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900 p-8 text-neutral-400">
            Učitavanje recenzija...
          </div>
        )}

        {!loading && authorized && reviews.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900 p-10 text-center">
            <p className="text-xl font-semibold">Nema recenzija</p>
            <p className="mt-2 text-neutral-400">
              Kada kupci ostave recenzije, pojaviće se ovde.
            </p>
          </div>
        )}

        {!loading && authorized && reviews.length > 0 && (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-950 to-neutral-900 p-5">
              <p className="text-sm text-neutral-400">Ukupno recenzija</p>
              <p className="mt-1 text-3xl font-bold">{reviews.length}</p>
              <p className="mt-2 text-sm text-amber-300">
                Istaknuto: {reviews.filter((review) => review.is_featured).length}
              </p>
            </div>

            {reviews.map((review) => (
              <article
                key={review.id}
                className={`rounded-3xl border bg-neutral-900 p-6 transition sm:p-8 ${
                  review.is_featured
                    ? "border-amber-400/40"
                    : "border-white/10 hover:border-indigo-400/30"
                }`}
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">
                      {review.product_name}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold">
                        {review.reviewer_name}
                      </h2>

                      {review.is_featured && (
                        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                          ⭐ ISTAKNUTA
                        </span>
                      )}
                    </div>

                    <p
                      aria-label={`Ocena: ${review.rating} od 5`}
                      className="mt-2 text-xl tracking-widest text-yellow-400"
                    >
                      {"★".repeat(review.rating)}
                      <span className="text-neutral-700">
                        {"★".repeat(5 - review.rating)}
                      </span>
                    </p>

                    <p className="mt-4 whitespace-pre-wrap break-words leading-7 text-neutral-300">
                      {review.comment}
                    </p>

                    <p className="mt-4 text-xs text-neutral-500">
                      {new Date(review.created_at).toLocaleString("sr-RS")}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 sm:min-w-48">
                    <button
                      type="button"
                      disabled={busyId === review.id}
                      onClick={() => void toggleFeatured(review)}
                      className={`rounded-xl border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        review.is_featured
                          ? "border-amber-400/30 text-amber-300 hover:bg-amber-400/10"
                          : "border-amber-400/30 text-amber-200 hover:bg-amber-400/10"
                      }`}
                    >
                      {busyId === review.id
                        ? "Obrada..."
                        : review.is_featured
                          ? "☆ Ukloni isticanje"
                          : "⭐ Istakni recenziju"}
                    </button>

                    <button
                      type="button"
                      disabled={busyId === review.id}
                      onClick={() => void deleteReview(review)}
                      className="rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {busyId === review.id
                        ? "Obrada..."
                        : "Obriši recenziju"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}