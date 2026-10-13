"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";

type Review = {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

type ProductReviewsProps = {
  productId: string;
};

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = useMemo(() => createClient(), []);

  async function loadReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("product_reviews")
      .select(
        "id, product_id, reviewer_name, rating, comment, created_at"
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage("Recenzije trenutno nisu dostupne.");
    } else {
      setReviews((data ?? []) as Review[]);
      setErrorMessage("");
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : 0;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    const cleanName = reviewerName.trim();
    const cleanComment = comment.trim();

    if (cleanName.length < 2 || cleanName.length > 60) {
      setErrorMessage(
        "Ime mora imati između 2 i 60 karaktera."
      );
      return;
    }

    if (cleanComment.length < 3 || cleanComment.length > 2000) {
      setErrorMessage(
        "Komentar mora imati između 3 i 2000 karaktera."
      );
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: productId,
        reviewer_name: cleanName,
        rating,
        comment: cleanComment,
      });

    if (error) {
      setErrorMessage(
        "Recenzija nije poslata. Pokušaj ponovo za trenutak."
      );
      setSubmitting(false);
      return;
    }

    setReviewerName("");
    setRating(5);
    setComment("");
    setMessage(
      "Hvala! Tvoja recenzija je uspešno objavljena."
    );

    await loadReviews();
    setSubmitting(false);
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
                  {reviews.length}{" "}
                  {reviews.length === 1
                    ? "recenzija"
                    : reviews.length >= 2 && reviews.length <= 4
                      ? "recenzije"
                      : "recenzija"}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm leading-7 text-neutral-500">
                Ovaj proizvod još nema recenzija. Budi prvi
                koji će podeliti svoje mišljenje!
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
              Ostavi svoju recenziju
            </h3>

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
              onChange={(event) =>
                setReviewerName(event.target.value)
              }
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
                    aria-label={`${value} ${
                      value === 1
                        ? "zvezdica"
                        : "zvezdice"
                    }`}
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
              onChange={(event) =>
                setComment(event.target.value)
              }
              minLength={3}
              maxLength={2000}
              required
              rows={5}
              className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-neutral-950 px-4 py-3 text-base leading-7 text-white outline-none transition placeholder:text-neutral-600 focus:border-white/30"
              placeholder="Podeli svoje iskustvo sa ovim proizvodom..."
            />

            {errorMessage && (
              <p
                role="alert"
                className="mt-4 text-sm text-red-400"
              >
                {errorMessage}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="mt-4 text-sm text-emerald-400"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 min-h-12 w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Slanje..."
                : "Objavi recenziju"}
            </button>

            <p className="mt-3 text-xs leading-5 text-neutral-600">
              Recenzije su javne. Ne unosi lične ili poverljive
              podatke.
            </p>
          </form>

          <div className="mt-8">
            <h3 className="text-xl font-semibold">
              Mišljenja kupaca
            </h3>

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
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-white/10 bg-neutral-900/50 p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-white">
                          {review.reviewer_name}
                        </h4>

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
                        {new Date(
                          review.created_at
                        ).toLocaleDateString("sr-RS", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </div>

                    <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-neutral-300">
                      {review.comment}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}