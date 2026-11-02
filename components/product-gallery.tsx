"use client";

import { useState, type MouseEvent } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const imageCount = images.length;

  const resetZoom = () => {
    setIsZoomed(false);
    setZoomPosition({ x: 50, y: 50 });
  };

  const goToPrevious = () => {
    setSelectedImage((current) =>
      current === 0 ? imageCount - 1 : current - 1
    );
    resetZoom();
  };

  const goToNext = () => {
    setSelectedImage((current) =>
      current === imageCount - 1 ? 0 : current + 1
    );
    resetZoom();
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });

    setIsZoomed(true);
  };

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-[#d6b878]/20 bg-[#30231b] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex min-h-[420px] items-center justify-center bg-gradient-to-br from-[#4b3621]/50 to-[#211812] text-[#b8a99a] sm:min-h-[620px]">
          Slika sata
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="group relative overflow-hidden rounded-[2rem] border border-[#d6b878]/25 bg-[#30231b] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div
          className="flex min-h-[420px] cursor-crosshair items-center justify-center overflow-hidden bg-gradient-to-br from-[#4b3621]/40 via-[#30231b] to-[#211812] sm:min-h-[620px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={resetZoom}
        >
          <img
            src={images[selectedImage]}
            alt={`${productName} - slika ${selectedImage + 1}`}
            className="h-full max-h-[620px] w-full object-contain transition-transform duration-100 ease-out"
            style={{
              transform: isZoomed ? "scale(2.2)" : "scale(1)",
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
            draggable={false}
          />
        </div>

        {imageCount > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Prethodna slika"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6b878]/30 bg-gradient-to-b from-[#d6b878]/25 to-[#211812]/75 text-lg text-[#f4ebdd]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm transition hover:border-[#ead4a0]/70 hover:from-[#d6b878]/40 hover:text-white active:scale-95"
            >
              ←
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Sledeća slika"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6b878]/30 bg-gradient-to-b from-[#d6b878]/25 to-[#211812]/75 text-lg text-[#f4ebdd]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm transition hover:border-[#ead4a0]/70 hover:from-[#d6b878]/40 hover:text-white active:scale-95"
            >
              →
            </button>

            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[#d6b878]/30 bg-[#211812]/75 px-3 py-1.5 text-xs text-[#f4ebdd]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur">
              {selectedImage + 1} / {imageCount}
            </div>
          </>
        )}
      </div>

      {imageCount > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => {
            const isSelected = selectedImage === index;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => {
                  setSelectedImage(index);
                  resetZoom();
                }}
                aria-label={`Prikaži sliku ${index + 1}`}
                aria-pressed={isSelected}
                className={`group overflow-hidden rounded-2xl border bg-[#30231b] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? "border-[#d6b878] shadow-[0_0_0_1px_rgba(214,184,120,0.15)]"
                    : "border-[#d6b878]/15 hover:border-[#d6b878]/50"
                }`}
              >
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#4b3621]/35 to-[#211812]">
                  <img
                    src={image}
                    alt={`${productName} ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {imageCount > 1 && (
        <p className="mt-3 text-center text-xs text-[#8f8071]">
          Izaberi sliku ili koristi strelice
        </p>
      )}
    </div>
  );
}