import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { packages } from "@/lib/packages";
import { galleryCategories } from "@/lib/gallery";
import PackageCard from "@/components/PackageCard";
import Gallery from "@/components/Gallery";
import { makeMetadata } from "@/lib/metadata";
import { organizationSchema, localBusinessSchema } from "@/lib/jsonld";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return makeMetadata({
    title: "Chillout Surf Camp Taghazout | All-Inclusive from €499",
    description: "Surf camp in Taghazout Bay, Morocco. All-inclusive packages from €499 with surf lessons, accommodation, and meals. 15+ years of experience.",
    path: "",
    lang,
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  // Build images map for Gallery
  const galleryImages = Object.fromEntries(
    galleryCategories.map((cat) => [cat.id, cat.images])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />
      {/* ——— Hero ——— */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        aria-label="Hero"
      >
        <Image
          src="/images/hero/group-surf-lesson.webp"
          alt="Group surf lesson at Chillout Surf Camp Taghazout"
          fill
          quality={95}
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1.5 bg-yellow-400 text-gray-900 text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
            {dict.hero.badge}
          </span>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-400 mb-5 leading-tight"
            style={{ fontFamily: "Cardo, Georgia, serif" }}
          >
            {dict.hero.heading}
          </h1>

          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {dict.hero.subheading}
          </p>

          <Link
            href={`/${lang}/packages`}
            className="inline-flex items-center justify-center min-h-[52px] px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
          >
            {dict.hero.cta}
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* ——— About ——— */}
      <section
        className="py-16 md:py-24 bg-white"
        aria-labelledby="about-title"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <h2
                id="about-title"
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: "Cardo, Georgia, serif" }}
              >
                {dict.about.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {dict.about.description}
              </p>
              <p className="text-blue-600 font-medium text-base">
                {dict.about.customizable}
              </p>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/hero/group-photo.webp"
                alt="Chillout Surf Camp group photo"
                fill
                quality={95}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ——— Packages Grid ——— */}
      <section
        className="py-16 md:py-24 bg-gray-50"
        aria-labelledby="packages-title"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="packages-title"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4 leading-tight"
            style={{ fontFamily: "Cardo, Georgia, serif" }}
          >
            {dict.packages.title}
          </h2>
          <p className="text-center text-gray-500 mb-12 text-lg">
            {dict.packages.readyText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => {
              const item =
                dict.packages.items[
                  pkg.slug as keyof typeof dict.packages.items
                ];
              const priceLabel =
                pkg.priceUnit === "family"
                  ? dict.packages.perFamily
                  : dict.packages.perPerson;
              return (
                <PackageCard
                  key={pkg.slug}
                  slug={pkg.slug}
                  name={item?.name ?? pkg.slug}
                  tagline={item?.tagline ?? ""}
                  description={item?.description}
                  price={pkg.price}
                  priceUnit={priceLabel}
                  image={pkg.image}
                  lang={lang}
                  bookNow={dict.packages.bookNow}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ——— Custom Package ——— */}
      <section
        className="py-16 md:py-24 bg-blue-600"
        aria-labelledby="custom-title"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="custom-title"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "Cardo, Georgia, serif" }}
          >
            {dict.customPackage.title}
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            {dict.customPackage.description}
          </p>
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center justify-center min-h-[52px] px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-gray-900 text-base font-bold rounded-xl shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
          >
            {dict.customPackage.cta}
          </Link>
        </div>
      </section>

      {/* ——— Reviews ——— */}
      <section
        className="py-16 md:py-20 bg-white"
        aria-labelledby="reviews-title"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="reviews-title"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: "Cardo, Georgia, serif" }}
          >
            {dict.reviews.title}
          </h2>

          {/* Star rating display */}
          <div className="flex justify-center gap-1 mb-6" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-8 h-8 text-yellow-400 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          <p className="text-gray-600 text-lg mb-6">
            {dict.reviews.subtitle}{" "}
            <a
              href="https://www.google.com/maps/search/chillout+surf+camp+taghazout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              {dict.reviews.google}
            </a>{" "}
            and{" "}
            <a
              href="https://www.tripadvisor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
            >
              {dict.reviews.tripAdvisor}
            </a>
          </p>
        </div>
      </section>

      {/* ——— Gallery ——— */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Gallery dict={dict.gallery} images={galleryImages} />
        </div>
      </section>
    </>
  );
}
