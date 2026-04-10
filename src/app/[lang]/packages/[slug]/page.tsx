import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getPackageBySlug } from "@/lib/packages";
import { galleryCategories } from "@/lib/gallery";
import Gallery from "@/components/Gallery";
import { makeMetadata } from "@/lib/metadata";
import { productSchema } from "@/lib/jsonld";

export async function generateMetadata({ params }: PageProps<"/[lang]/packages/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const pkg = getPackageBySlug(slug);
  if (!pkg) return {};
  const dict = await getDictionary(lang);
  const item = dict.packages.items[slug as keyof typeof dict.packages.items];
  if (!item) return {};
  return makeMetadata({
    title: `${item.name} – €${pkg.price} | Chillout Surf Camp Taghazout`,
    description: item.description ?? `${item.name} surf camp package in Taghazout, Morocco. ${pkg.duration.nights} nights, all-inclusive from €${pkg.price}.`,
    path: `/packages/${slug}`,
    lang,
    image: pkg.image.startsWith("/") ? `https://chilloutsurf.com${pkg.image}` : pkg.image,
  });
}

export async function generateStaticParams() {
  const slugs = [
    "3-days-all-inclusive",
    "5-days-all-inclusive",
    "7-days-all-inclusive",
    "surf-and-stay",
    "classic",
    "premium",
    "ultimate",
    "family",
  ];
  const langs = ["en", "de", "es"];
  return langs.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export default async function PackageDetailPage({
  params,
}: PageProps<"/[lang]/packages/[slug]">) {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) notFound();

  const pkg = getPackageBySlug(slug);
  if (!pkg) notFound();

  const dict = await getDictionary(lang);
  const item = dict.packages.items[slug as keyof typeof dict.packages.items];
  if (!item) notFound();

  const priceLabel =
    pkg.priceUnit === "family"
      ? dict.packages.perFamily
      : dict.packages.perPerson;

  // Build gallery images map
  const galleryImages = Object.fromEntries(
    galleryCategories.map((cat) => [cat.id, cat.images])
  );

  const whatsappHref = `https://wa.me/212715511910?text=Hi! I'm interested in the ${item.name} package.`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema(item.name, item.description ?? item.tagline, pkg.price)) }}
      />
      {/* ——— Package Hero ——— */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <Image
          src={pkg.image}
          alt={item.name}
          fill
          quality={95}
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 w-full pb-12 pt-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center gap-2 text-sm text-white/70">
                <li>
                  <Link
                    href={`/${lang}`}
                    className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  >
                    {dict.nav.home}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
                <li>
                  <Link
                    href={`/${lang}/packages`}
                    className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  >
                    {dict.nav.packages}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
                <li className="text-white font-medium" aria-current="page">
                  {item.name}
                </li>
              </ol>
            </nav>

            {/* Badge */}
            {pkg.badge && (
              <span className="inline-block mb-3 px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold uppercase tracking-wider rounded-full">
                {dict.packages.mostBooked}
              </span>
            )}

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 leading-tight max-w-3xl"
              style={{ fontFamily: "Cardo, Georgia, serif" }}
            >
              {item.name}
            </h1>

            <p className="text-blue-300 text-xl font-medium mb-5">
              {item.tagline}
            </p>

            {/* Price + Duration badges */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 font-bold text-lg px-5 py-2 rounded-full shadow-lg">
                €{pkg.price}
                <span className="text-sm font-medium">/ {priceLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {pkg.duration.nights} {dict.packages.nights} /{" "}
                {pkg.duration.days} {dict.packages.days}
              </span>
              {pkg.surfLessons && (
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full border border-white/20">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {pkg.surfLessons.days} × {pkg.surfLessons.hoursPerDay}h surf
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Main Content ——— */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: description + includes */}
            <div className="lg:col-span-2">
              {/* Description */}
              <p className="text-gray-700 text-lg leading-relaxed mb-10">
                {item.description}
              </p>

              {/* What's Included */}
              <h2
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "Cardo, Georgia, serif" }}
              >
                {dict.packages.whatsIncluded}
              </h2>

              <ul className="space-y-3" aria-label="Package inclusions">
                {item.includes.map((inclusion: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 mt-0.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-700 leading-relaxed">
                      {inclusion}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Sticky CTA sidebar */}
            <aside className="lg:sticky lg:top-8 self-start" aria-label="Book this package">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    €{pkg.price}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    / {priceLabel}
                  </span>
                  <p className="text-gray-500 text-sm mt-1">
                    {pkg.duration.nights} {dict.packages.nights} /{" "}
                    {pkg.duration.days} {dict.packages.days}
                  </p>
                </div>

                {/* Primary CTA */}
                <Link
                  href={`/${lang}/contact`}
                  className="flex items-center justify-center min-h-[52px] w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-base font-semibold rounded-xl transition-colors mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  {dict.packages.bookNow}
                </Link>

                {/* WhatsApp CTA */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center min-h-[52px] w-full px-6 py-3.5 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white text-base font-semibold rounded-xl transition-colors mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.853L.073 23.927a.5.5 0 00.611.61l6.073-1.458A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.366l-.36-.213-3.728.895.912-3.724-.234-.38A9.818 9.818 0 1112 21.818z" />
                  </svg>
                  {dict.contact.info.whatsapp}
                </a>

                {/* Contact info */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <a
                    href={`mailto:${dict.contact.info.email}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {dict.contact.info.email}
                  </a>
                  <a
                    href={`tel:${dict.contact.info.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {dict.contact.info.phone}
                  </a>
                  <p className="flex items-start gap-2 text-gray-500 text-sm">
                    <svg
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {dict.contact.info.address}
                  </p>
                </div>
              </div>

              {/* Other packages prompt */}
              <p className="text-center text-sm text-gray-500 mt-4">
                <Link
                  href={`/${lang}/packages`}
                  className="text-blue-600 font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                >
                  ← {dict.nav.packages}
                </Link>
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ——— Gallery ——— */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Gallery dict={dict.gallery} images={galleryImages} />
        </div>
      </section>

      {/* ——— Bottom CTA ——— */}
      <section className="py-16 md:py-20 bg-blue-600">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "Cardo, Georgia, serif" }}
          >
            {dict.packages.readyText}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${lang}/contact`}
              className="inline-flex items-center justify-center min-h-[52px] px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-gray-900 text-base font-bold rounded-xl shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
            >
              {dict.packages.bookNow}
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[52px] px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-base font-semibold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
            >
              {dict.contact.info.whatsapp}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
