"use client";

import { useEffect, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const imageCount = images.length;

  const goToPrevious = () => {
    setSelectedImage((current) =>
      current === 0 ? imageCount - 1 : current - 1
    );
  };

  const goToNext = () => {
    setSelectedImage((current) =>
      current === imageCount - 1 ? 0 : current + 1
    );
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });

    setZoom(2.2);
  };

  const handleMouseLeave = () => {
    setZoom(1);
    setZoomPosition({ x: 50, y: 50 });
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setZoom(1);
    setZoomPosition({ x: 50, y: 50 });
  };

  useEffect(() => {
    if (!isFullscreen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullscreen();
      }

      if (event.key === "ArrowLeft" && imageCount > 1) {
        goToPrevious();
      }

      if (event.key === "ArrowRight" && imageCount > 1) {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, imageCount]);

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900">
        <div className="flex min-h-[420px] items-center justify-center bg-neutral-800 text-neutral-500 sm:min-h-[620px]">
          Slika sata
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900">
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="block w-full cursor-zoom-in"
            aria-label="Otvori sliku preko celog ekrana"
          >
            <div className="flex min-h-[420px] items-center justify-center overflow-hidden bg-neutral-800 sm:min-h-[620px]">
              <img
                src={images[selectedImage]}
                alt={`${productName} - slika ${selectedImage + 1}`}
                className="h-full max-h-[620px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </button>

          {imageCount > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Prethodna slika"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-lg text-white/80 backdrop-blur-sm transition hover:bg-black/55 hover:text-white active:scale-95"
              >
                ←
              </button>

              <button
                type="button"
                onClick={goToNext}
                aria-label="Sledeća slika"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-lg text-white/80 backdrop-blur-sm transition hover:bg-black/55 hover:text-white active:scale-95"
              >
                →
              </button>

              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/90 backdrop-blur">
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
                  onClick={() => setSelectedImage(index)}
                  aria-label={`Prikaži sliku ${index + 1}`}
                  aria-pressed={isSelected}
                  className={`group overflow-hidden rounded-2xl border bg-neutral-900 transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? "border-white"
                      : "border-white/10 hover:border-white/40"
                  }`}
                >
                  <div className="aspect-square overflow-hidden bg-neutral-800">
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
          <p className="mt-3 text-center text-xs text-neutral-600">
            Izaberi sliku ili koristi strelice
          </p>
        )}
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} - uvećana slika`}
          onClick={closeFullscreen}
        >
          <button
            type="button"
            onClick={closeFullscreen}
            aria-label="Zatvori uvećanu sliku"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/45 text-xl text-white/80 backdrop-blur transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            ×
          </button>

          {imageCount > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToPrevious();
              }}
              aria-label="Prethodna slika"
              className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-lg text-white/75 backdrop-blur-sm transition hover:bg-black/55 hover:text-white active:scale-95 sm:left-6"
            >
              ←
            </button>
          )}

          <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
            onClick={(event) => event.stopPropagation()}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={images[selectedImage]}
              alt={`${productName} - slika ${selectedImage + 1}`}
              className="max-h-full max-w-full object-contain transition-transform duration-150 ease-out"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          </div>

          {imageCount > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goToNext();
              }}
              aria-label="Sledeća slika"
              className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-lg text-white/75 backdrop-blur-sm transition hover:bg-black/55 hover:text-white active:scale-95 sm:right-6"
            >
              →
            </button>
          )}

          {imageCount > 1 && (
            <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-white/90 backdrop-blur">
              {selectedImage + 1} / {imageCount}
            </div>
          )}
        </div>
      )}
    </>
  );
}