import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { packages } from "@/lib/packages";
import PackageCard from "@/components/PackageCard";
import { makeMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/packages">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return makeMetadata({
    title: "Surf Packages | Chillout Surf Camp Taghazout",
    description: "Browse all-inclusive surf camp packages in Taghazout, Morocco. From 3-day getaways to 7-day immersions. Surf lessons, accommodation, and meals included.",
    path: "/packages",
    lang,
  });
}

export default async function PackagesPage({
  params,
}: PageProps<"/[lang]/packages">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      {/* ——— Page Header ——— */}
      <section className="bg-blue-600 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "Cardo, Georgia, serif" }}
          >
            {dict.packages.title}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            {dict.packages.readyText}
          </p>
        </div>
      </section>

      {/* ——— All Packages Grid ——— */}
      <section
        className="py-16 md:py-24 bg-gray-50"
        aria-label="All surf packages"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      {/* ——— Custom Package CTA ——— */}
      <section
        className="py-16 md:py-24 bg-white border-t border-gray-100"
        aria-labelledby="custom-packages-title"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="custom-packages-title"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight"
            style={{ fontFamily: "Cardo, Georgia, serif" }}
          >
            {dict.customPackage.title}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {dict.customPackage.description}
          </p>
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center justify-center min-h-[52px] px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {dict.customPackage.cta}
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
    </>
  );
}
