"use client";

import { useEffect, useRef, useState } from "react";

type ScratchCardProps = {
  code: string;
  discountPercent: number;
};

export default function ScratchCard({
  code,
  discountPercent,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 700;
    canvas.height = 250;

    const gradient = ctx.createLinearGradient(0, 0, 700, 250);
    gradient.addColorStop(0, "#ead4a0");
    gradient.addColorStop(0.5, "#b99a60");
    gradient.addColorStop(1, "#d6b878");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 1800; i++) {
      ctx.fillStyle =
        Math.random() > 0.5
          ? "rgba(255,255,255,0.12)"
          : "rgba(70,45,20,0.08)";

      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }

    ctx.fillStyle = "#30231b";
    ctx.textAlign = "center";
    ctx.font = "bold 32px Arial";
    ctx.fillText("WATCH SHOP", 350, 100);

    ctx.font = "bold 22px Arial";
    ctx.fillText("PREĐI PRSTOM ILI MIŠEM", 350, 145);

    ctx.font = "16px Arial";
    ctx.fillText("OTKRIJ SVOJ POKLON", 350, 180);
  }, []);

  function scratch(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || !drawingRef.current || revealed) return;

    const rect = canvas.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 27, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkScratch() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || revealed) return;

    const pixels = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    let transparent = 0;
    let checked = 0;

    for (let i = 3; i < pixels.length; i += 32) {
      checked++;

      if (pixels[i] < 80) {
        transparent++;
      }
    }

    if (transparent / checked > 0.4) {
      setRevealed(true);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Greška pri kopiranju kupona:", error);
    }
  }

  return (
    <div className="mt-8 rounded-3xl border border-[#d6b878]/30 bg-[#17110d]/70 p-5 text-center sm:p-7">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#d6b878]">
        Tvoj poklon za sledeću kupovinu
      </p>

      <h2 className="mt-3 text-2xl font-semibold text-[#f4ebdd]">
        Osvojio si {discountPercent}% popusta!
      </h2>

      <div className="relative mx-auto mt-6 max-w-xl overflow-hidden rounded-2xl border border-[#d6b878]/30 bg-gradient-to-br from-[#30231b] to-[#211812] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#b8a99a]">
          Tvoj kupon
        </p>

        <p className="mt-3 font-mono text-3xl font-bold tracking-widest text-[#ead4a0]">
          {code}
        </p>

        <p className="mt-3 text-sm text-[#b8a99a]">
          Sačuvaj ovaj kod i iskoristi ga pri sledećoj kupovini.
        </p>

        <canvas
          ref={canvasRef}
          onPointerDown={(event) => {
            drawingRef.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            scratch(event);
          }}
          onPointerMove={scratch}
          onPointerUp={() => {
            drawingRef.current = false;
            checkScratch();
          }}
          onPointerCancel={() => {
            drawingRef.current = false;
            checkScratch();
          }}
          className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${
            revealed
              ? "pointer-events-none opacity-0"
              : "cursor-crosshair opacity-100"
          }`}
          aria-label="Prevuci prstom ili mišem da otkriješ kupon"
        />

        {revealed && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#d6b878]/10">
            <span className="rounded-full border border-[#d6b878]/40 bg-[#211812]/90 px-5 py-2 text-sm font-semibold text-[#ead4a0]">
              Kupon je otkriven!
            </span>
          </div>
        )}
      </div>

      {!revealed ? (
        <p className="mt-4 text-xs text-[#b8a99a]">
          Grebi površinu iznad koda da otkriješ svoj kupon.
        </p>
      ) : (
        <button
          type="button"
          onClick={copyCode}
          className="mt-5 rounded-xl border border-[#ead4a0]/50 bg-gradient-to-b from-[#ead4a0] to-[#d6b878] px-6 py-3 font-semibold text-[#211812] transition hover:brightness-110 active:scale-95"
        >
          {copied ? "Kod je kopiran!" : "Kopiraj kupon"}
        </button>
      )}
    </div>
  );
}