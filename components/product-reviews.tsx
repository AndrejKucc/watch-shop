"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Review = {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string | null;
  is_featured: boolean;
};

type AccountUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

type ProductReviewsProps = {
  productId: string;
};

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const supabase = useMemo(() => createClient(), []);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("product_reviews")
      .select(
        "id, product_id, reviewer_name, rating, comment, created_at, user_id, is_featured"
      )
      .eq("product_id", productId)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage("Recenzije trenutno nisu dostupne.");
    } else {
      setReviews((data ?? []) as Review[]);
      setErrorMessage("");
    }

    setLoading(false);
  }, [productId, supabase]);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();

      if (!active) return;

      const currentUser = data.user as AccountUser | null;
      setUser(currentUser);

      if (currentUser) {
        setReviewerName(currentUser.user_metadata?.full_name || "");
      }
    }

    void loadUser();
    void loadReviews();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user as AccountUser | undefined;

      setUser(currentUser ?? null);

      if (currentUser) {
        setReviewerName((previous) =>
          previous || currentUser.user_metadata?.full_name || ""
        );
      } else {
        setReviewerName("");
        setEditingId(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadReviews, supabase]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : 0;

  function startEditing(review: Review) {
    setEditingId(review.id);
    setReviewerName(review.reviewer_name);
    setRating(review.rating);
    setComment(review.comment);
    setMessage("");
    setErrorMessage("");
  }

  function cancelEditing() {
    setEditingId(null);
    setReviewerName(user?.user_metadata?.full_name || "");
    setRating(5);
    setComment("");
    setMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!user) {
      setErrorMessage("Prijavi se da bi ostavio recenziju.");
      return;
    }

    const cleanName = reviewerName.trim();
    const cleanComment = comment.trim();

    if (cleanName.length < 2 || cleanName.length > 60) {
      setErrorMessage("Ime mora imati između 2 i 60 karaktera.");
      return;
    }

    if (cleanComment.length < 3 || cleanComment.length > 2000) {
      setErrorMessage("Komentar mora imati između 3 i 2000 karaktera.");
      return;
    }

    setSubmitting(true);

    const payload = {
      reviewer_name: cleanName,
      rating,
      comment: cleanComment,
    };

    const result = editingId
      ? await supabase
          .from("product_reviews")
          .update(payload)
          .eq("id", editingId)
          .eq("user_id", user.id)
          .select("id")
      : await supabase
          .from("product_reviews")
          .insert({
            ...payload,
            product_id: productId,
            user_id: user.id,
          })
          .select("id");

    if (result.error || !result.data?.length) {
      setErrorMessage(
        "Čuvanje recenzije nije uspelo. Proveri prijavu i dozvole u bazi."
      );
      setSubmitting(false);
      return;
    }

    setMessage(
      editingId
        ? "Recenzija je uspešno izmenjena."
        : "Hvala! Tvoja recenzija je uspešno objavljena."
    );

    setEditingId(null);
    setReviewerName(user.user_metadata?.full_name || "");
    setRating(5);
    setComment("");

    await loadReviews();
    setSubmitting(false);
  }

  async function deleteReview(review: Review) {
    if (!user || review.user_id !== user.id) return;

    const confirmed = window.confirm(
      "Da li sigurno želiš da obrišeš svoju recenziju? Ova radnja se ne može poništiti."
    );

    if (!confirmed) return;

    setBusyId(review.id);
    setMessage("");
    setErrorMessage("");

    const { data, error } = await supabase
      .from("product_reviews")
      .delete()
      .eq("id", review.id)
      .eq("user_id", user.id)
      .select("id");

    if (error || !data?.length) {
      setErrorMessage("Brisanje nije uspelo. Pokušaj ponovo.");
    } else {
      setReviews((current) =>
        current.filter((item) => item.id !== review.id)
      );
      setMessage("Tvoja recenzija je obrisana.");

      if (editingId === review.id) {
        cancelEditing();
      }
    }

    setBusyId(null);
  }

  return (
    <section
      id="recenzije"
      className="mt-16 border-t border-white/10 pt-12 sm:mt-24 sm:pt-16"
    >
      <div className="grid gap-10 lg:grid-cols-[0.35fr_0.65fr] lg:gap-16">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-500">
            Iskustva kupaca
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ocene i recenzije
          </h2>

          <div className="mt-6">
            {reviews.length > 0 ? (
              <>
                <p className="text-4xl font-semibold text-white">
                  {averageRating.toLocaleString("sr-RS", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  <span className="ml-2 text-lg text-neutral-500">
                    / 5
                  </span>
                </p>

                <div
                  className="mt-2 text-xl tracking-[0.15em] text-amber-400"
                  aria-label={`Prosečna ocena: ${averageRating.toFixed(1)} od 5`}
                >
                  {"★".repeat(Math.round(averageRating))}
                  {"☆".repeat(5 - Math.round(averageRating))}
                </div>

                <p className="mt-2 text-sm text-neutral-500">
                  Ukupno recenzija: {reviews.length}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm leading-7 text-neutral-500">
                Ovaj proizvod još nema recenzija. Budi prvi koji će podeliti svoje mišljenje!
              </p>
            )}
          </div>
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-neutral-900/60 p-6 sm:p-8"
          >
            <h3 className="text-xl font-semibold">
              {editingId ? "Izmeni svoju recenziju" : "Ostavi svoju recenziju"}
            </h3>

            {!user ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-neutral-950 p-5">
                <p className="text-sm leading-6 text-neutral-300">
                  Da bi ostavio recenziju, prvo se prijavi na svoj nalog.
                </p>

                <Link
                  href="/nalog/prijava"
                  className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  Prijavi se
                </Link>
              </div>
            ) : (
              <>
                <label
                  htmlFor="reviewer-name"
                  className="mt-6 block text-sm text-neutral-400"
                >
                  Ime
                </label>

                <input
                  id="reviewer-name"
                  type="text"
                  value={reviewerName}
                  onChange={(event) => setReviewerName(event.target.value)}
                  minLength={2}
                  maxLength={60}
                  required
                  autoComplete="name"
                  className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
                  placeholder="Unesi svoje ime"
                />

                <fieldset className="mt-6">
                  <legend className="text-sm text-neutral-400">
                    Tvoja ocena
                  </legend>

                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        aria-label={`${value} zvezdica`}
                        aria-pressed={rating === value}
                        className={`min-h-11 min-w-11 rounded-lg text-3xl transition ${
                          value <= rating
                            ? "text-amber-400"
                            : "text-neutral-700 hover:text-amber-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label
                  htmlFor="review-comment"
                  className="mt-6 block text-sm text-neutral-400"
                >
                  Komentar
                </label>

                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  minLength={3}
                  maxLength={2000}
                  required
                  rows={5}
                  className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-base leading-7 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
                  placeholder="Podeli svoje iskustvo sa ovim proizvodom..."
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 min-h-12 w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Čuvanje..."
                    : editingId
                      ? "Sačuvaj izmene"
                      : "Objavi recenziju"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="mt-3 min-h-11 w-full rounded-xl border border-white/10 px-5 py-3 text-sm text-neutral-300 hover:bg-white/5"
                  >
                    Otkaži izmenu
                  </button>
                )}
              </>
            )}

            {errorMessage && (
              <p role="alert" className="mt-4 text-sm text-red-400">
                {errorMessage}
              </p>
            )}

            {message && (
              <p role="status" className="mt-4 text-sm text-emerald-400">
                {message}
              </p>
            )}

            <p className="mt-4 text-xs leading-5 text-neutral-600">
              Recenzije su javne. Ne unosi lične ili poverljive podatke.
            </p>
          </form>

          <div className="mt-8">
            <h3 className="text-xl font-semibold">Mišljenja kupaca</h3>

            {loading ? (
              <p className="mt-5 text-sm text-neutral-500">
                Učitavanje recenzija...
              </p>
            ) : reviews.length === 0 ? (
              <p className="mt-5 text-sm text-neutral-500">
                Još nema objavljenih recenzija.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {reviews.map((review) => {
                  const isOwner =
                    !!user && review.user_id === user.id;

                  return (
                    <article
                      key={review.id}
                      className={`rounded-2xl border bg-neutral-900/50 p-5 sm:p-6 ${
                        review.is_featured
                          ? "border-amber-400/40"
                          : "border-white/10"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-white">
                              {review.reviewer_name}
                            </h4>

                            {review.is_featured && (
                              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                                ⭐ Istaknuta recenzija
                              </span>
                            )}
                          </div>

                          <div
                            className="mt-1 tracking-widest text-amber-400"
                            aria-label={`Ocena: ${review.rating} od 5`}
                          >
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                        </div>

                        <time
                          dateTime={review.created_at}
                          className="text-xs text-neutral-500"
                        >
                          {new Date(review.created_at).toLocaleDateString(
                            "sr-RS",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </time>
                      </div>

                      <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-neutral-300">
                        {review.comment}
                      </p>

                      {isOwner && (
                        <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-4">
                          <button
                            type="button"
                            onClick={() => startEditing(review)}
                            className="min-h-10 rounded-xl border border-white/15 px-4 py-2 text-sm text-neutral-200 transition hover:bg-white/5"
                          >
                            Izmeni
                          </button>

                          <button
                            type="button"
                            disabled={busyId === review.id}
                            onClick={() => void deleteReview(review)}
                            className="min-h-10 rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                          >
                            {busyId === review.id ? "Brisanje..." : "Obriši"}
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}