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
      className="mt-16 border-t border-[#d6b878]/20 pt-12 sm:mt-24 sm:pt-16"
    >
      <div className="grid gap-10 lg:grid-cols-[0.35fr_0.65fr] lg:gap-16">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#b8a99a]">
            Iskustva kupaca
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#f4ebdd] sm:text-4xl">
            Ocene i recenzije
          </h2>

          <div className="mt-6">
            {reviews.length > 0 ? (
              <>
                <p className="text-4xl font-semibold text-[#f4ebdd]">
                  {averageRating.toLocaleString("sr-RS", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  <span className="ml-2 text-lg text-[#b8a99a]">
                    / 5
                  </span>
                </p>

                <div
                  className="mt-2 text-xl tracking-[0.15em] text-[#d6b878]"
                  aria-label={`Prosečna ocena: ${averageRating.toFixed(1)} od 5`}
                >
                  {"★".repeat(Math.round(averageRating))}
                  {"☆".repeat(5 - Math.round(averageRating))}
                </div>

                <p className="mt-2 text-sm text-[#b8a99a]">
                  Ukupno recenzija: {reviews.length}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm leading-7 text-[#b8a99a]">
                Ovaj proizvod još nema recenzija. Budi prvi koji će podeliti svoje mišljenje!
              </p>
            )}
          </div>
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-[#d6b878]/25 bg-gradient-to-br from-[#30231b]/95 via-[#211812]/95 to-[#17110d]/95 p-6 shadow-[inset_0_1px_0_rgba(234,212,160,0.05)] sm:p-8"
          >
            <h3 className="text-xl font-semibold text-[#f4ebdd]">
              {editingId ? "Izmeni svoju recenziju" : "Ostavi svoju recenziju"}
            </h3>

            {!user ? (
              <div className="mt-6 rounded-2xl border border-[#d6b878]/20 bg-[#17110d] p-5">
                <p className="text-sm leading-6 text-[#c2b5a8]">
                  Da bi ostavio recenziju, prvo se prijavi na svoj nalog.
                </p>

                <Link
                  href="/nalog/prijava"
                  className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-[#ead4a0]/60 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-5 py-3 text-sm font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  Prijavi se
                </Link>
              </div>
            ) : (
              <>
                <label
                  htmlFor="reviewer-name"
                  className="mt-6 block text-sm text-[#c2b5a8]"
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
                  className="mt-2 min-h-12 w-full rounded-xl border border-[#d6b878]/25 bg-[#17110d] px-4 py-3 text-base text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                  placeholder="Unesi svoje ime"
                />

                <fieldset className="mt-6">
                  <legend className="text-sm text-[#c2b5a8]">
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
                            ? "text-[#d6b878]"
                            : "text-[#6f5c49] hover:text-[#ead4a0]"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label
                  htmlFor="review-comment"
                  className="mt-6 block text-sm text-[#c2b5a8]"
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
                  className="mt-2 w-full resize-y rounded-xl border border-[#d6b878]/25 bg-[#17110d] px-4 py-3 text-base leading-7 text-[#f4ebdd] outline-none transition placeholder:text-[#8f8071] focus:border-[#d6b878]/70 focus:ring-2 focus:ring-[#d6b878]/10"
                  placeholder="Podeli svoje iskustvo sa ovim proizvodom..."
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 min-h-12 w-full rounded-xl border border-[#ead4a0]/60 bg-gradient-to-b from-[#ead4a0] via-[#d6b878] to-[#bd9650] px-5 py-3 text-sm font-semibold text-[#211812] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="mt-3 min-h-11 w-full rounded-xl border border-[#d6b878]/25 px-5 py-3 text-sm text-[#c2b5a8] transition hover:border-[#d6b878]/50 hover:bg-[#4b3621]/40 hover:text-[#f4ebdd]"
                  >
                    Otkaži izmenu
                  </button>
                )}
              </>
            )}

            {errorMessage && (
              <p role="alert" className="mt-4 text-sm text-[#f0a08a]">
                {errorMessage}
              </p>
            )}

            {message && (
              <p role="status" className="mt-4 text-sm text-[#d6b878]">
                {message}
              </p>
            )}

            <p className="mt-4 text-xs leading-5 text-[#8f8071]">
              Recenzije su javne. Ne unosi lične ili poverljive podatke.
            </p>
          </form>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-[#f4ebdd]">
              Mišljenja kupaca
            </h3>

            {loading ? (
              <p className="mt-5 text-sm text-[#b8a99a]">
                Učitavanje recenzija...
              </p>
            ) : reviews.length === 0 ? (
              <p className="mt-5 text-sm text-[#b8a99a]">
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
                      className={`rounded-2xl border bg-gradient-to-br from-[#30231b]/90 to-[#211812]/90 p-5 shadow-[inset_0_1px_0_rgba(234,212,160,0.03)] sm:p-6 ${
                        review.is_featured
                          ? "border-[#d6b878]/55"
                          : "border-[#d6b878]/15"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold text-[#f4ebdd]">
                              {review.reviewer_name}
                            </h4>

                            {review.is_featured && (
                              <span className="rounded-full border border-[#d6b878]/40 bg-[#d6b878]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ead4a0]">
                                ⭐ Istaknuta recenzija
                              </span>
                            )}
                          </div>

                          <div
                            className="mt-1 tracking-widest text-[#d6b878]"
                            aria-label={`Ocena: ${review.rating} od 5`}
                          >
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                        </div>

                        <time
                          dateTime={review.created_at}
                          className="text-xs text-[#a99988]"
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

                      <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-[#d8cbbd]">
                        {review.comment}
                      </p>

                      {isOwner && (
                        <div className="mt-5 flex flex-wrap gap-3 border-t border-[#d6b878]/15 pt-4">
                          <button
                            type="button"
                            onClick={() => startEditing(review)}
                            className="min-h-10 rounded-xl border border-[#d6b878]/30 px-4 py-2 text-sm text-[#ead4a0] transition hover:border-[#d6b878]/60 hover:bg-[#4b3621]/50"
                          >
                            Izmeni
                          </button>

                          <button
                            type="button"
                            disabled={busyId === review.id}
                            onClick={() => void deleteReview(review)}
                            className="min-h-10 rounded-xl border border-[#c46a2d]/45 px-4 py-2 text-sm text-[#e7a17b] transition hover:border-[#c46a2d]/70 hover:bg-[#c46a2d]/10 disabled:opacity-50"
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