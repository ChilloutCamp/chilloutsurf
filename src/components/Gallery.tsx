"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

type GalleryImage = { src: string; alt: string };

type GalleryProps = {
  dict: { title: string; tabs: Record<string, string> };
  images: Record<string, GalleryImage[]>;
};

export default function Gallery({ dict, images }: GalleryProps) {
  const tabKeys = Object.keys(dict.tabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0] ?? "");
  const [lightbox, setLightbox] = useState<{
    open: boolean;
    tabKey: string;
    index: number;
  }>({ open: false, tabKey: "", index: 0 });

  const lightboxImages =
    lightbox.open ? (images[lightbox.tabKey] ?? []) : [];
  const lightboxImage = lightboxImages[lightbox.index];

  const openLightbox = useCallback(
    (tabKey: string, index: number) => {
      setLightbox({ open: true, tabKey, index });
    },
    []
  );

  const closeLightbox = useCallback(() => {
    setLightbox((prev) => ({ ...prev, open: false }));
  }, []);

  const prevImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index:
        prev.index === 0
          ? (images[prev.tabKey]?.length ?? 1) - 1
          : prev.index - 1,
    }));
  }, [images]);

  const nextImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % (images[prev.tabKey]?.length ?? 1),
    }));
  }, [images]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightbox.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox.open, closeLightbox, prevImage, nextImage]);

  return (
    <section aria-labelledby="gallery-title" className="w-full">
      <h2
        id="gallery-title"
        className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8"
        style={{ fontFamily: "Cardo, Georgia, serif" }}
      >
        {dict.title}
      </h2>

      {/* Tabs */}
      <div className="relative mb-8">
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
          role="tablist"
          aria-label="Gallery categories"
        >
          {tabKeys.map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              aria-controls={`gallery-panel-${key}`}
              id={`gallery-tab-${key}`}
              onClick={() => setActiveTab(key)}
              className={`flex-shrink-0 min-h-[44px] px-5 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap ${
                activeTab === key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {dict.tabs[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Image grid */}
      {tabKeys.map((key) => (
        <div
          key={key}
          id={`gallery-panel-${key}`}
          role="tabpanel"
          aria-labelledby={`gallery-tab-${key}`}
          hidden={activeTab !== key}
        >
          {activeTab === key && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(images[key] ?? []).map((img, idx) => (
                <button
                  key={img.src}
                  onClick={() => openLightbox(key, idx)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  aria-label={`View ${img.alt} — photo ${idx + 1} of ${images[key]?.length ?? 0}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    quality={95}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm-6-3v6m-3-3h6"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Lightbox */}
      {lightbox.open && lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.alt}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white z-10"
            aria-label="Close lightbox"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous image"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-4xl mx-16 aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              fill
              quality={95}
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next image"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {lightbox.index + 1} / {lightboxImages.length}
          </div>
        </div>
      )}
    </section>
  );
}
