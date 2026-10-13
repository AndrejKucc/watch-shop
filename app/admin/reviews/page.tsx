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
};

type ReviewWithProduct = Review & {
  product_name: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

    // Provera administratorskih prava preko Supabase funkcije.
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
        "id, product_id, reviewer_name, rating, comment, created_at"
      )
      .order("created_at", { ascending: false });

    if (reviewsError) {
      setError(
        "Greška pri učitavanju recenzija: " + reviewsError.message
      );
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
          (products || []).map((product) => [
            product.id,
            product.name,
          ])
        );
      }
    }

    setReviews(
      reviewsData.map((review) => ({
        ...review,
        product_name:
          productNames[review.product_id] || "Nepoznat proizvod",
      }))
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  async function deleteReview(review: ReviewWithProduct) {
    const confirmed = window.confirm(
      `Da li sigurno želiš da obrišeš recenziju korisnika ${review.reviewer_name}?\n\nOva radnja se ne može poništiti.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(review.id);
    setMessage("");
    setError("");

    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Sesija je istekla. Prijavi se ponovo.");
      setDeletingId(null);
      return;
    }

    // Ponovna provera administratorskih prava pre brisanja.
    const { data: isAdmin, error: adminError } = await supabase.rpc(
      "is_shop_admin"
    );

    if (adminError || !isAdmin) {
      setError("Nemaš administratorsku dozvolu za brisanje.");
      setDeletingId(null);
      return;
    }

    const { data: deletedReviews, error: deleteError } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", review.id)
      .select("id");

    if (deleteError) {
      setError("Brisanje nije uspelo: " + deleteError.message);
      setDeletingId(null);
      return;
    }

    if (!deletedReviews || deletedReviews.length === 0) {
      setError(
        "Recenzija nije obrisana. Proveri administratorska prava i RLS pravila u Supabase-u."
      );
      setDeletingId(null);
      return;
    }

    setReviews((current) =>
      current.filter((item) => item.id !== review.id)
    );

    setMessage("Recenzija je uspešno obrisana.");
    setDeletingId(null);
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

          <h1 className="mt-3 text-4xl font-bold">
            Recenzije
          </h1>

          <p className="mt-3 text-neutral-400">
            Pregledaj ocene i komentare kupaca i ukloni neželjene recenzije.
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

        {!loading && authorized && !error && reviews.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900 p-10 text-center">
            <p className="text-xl font-semibold">
              Nema recenzija
            </p>

            <p className="mt-2 text-neutral-400">
              Kada kupci ostave recenzije, pojaviće se ovde.
            </p>
          </div>
        )}

        {!loading && authorized && reviews.length > 0 && (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-950 to-neutral-900 p-5">
              <p className="text-sm text-neutral-400">
                Ukupno recenzija
              </p>

              <p className="mt-1 text-3xl font-bold">
                {reviews.length}
              </p>
            </div>

            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-white/10 bg-neutral-900 p-6 transition hover:border-indigo-400/30 sm:p-8"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">
                      {review.product_name}
                    </p>

                    <h2 className="mt-3 text-xl font-semibold">
                      {review.reviewer_name}
                    </h2>

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

                  <div className="shrink-0">
                    <button
                      type="button"
                      disabled={deletingId === review.id}
                      onClick={() => void deleteReview(review)}
                      className="w-full rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      {deletingId === review.id
                        ? "Brisanje..."
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