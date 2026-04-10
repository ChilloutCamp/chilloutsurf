import Image from "next/image";
import Link from "next/link";

type PackageCardProps = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  priceUnit: string;
  image: string;
  lang: string;
  bookNow: string;
  description?: string;
};

export default function PackageCard({
  slug,
  name,
  tagline,
  price,
  priceUnit,
  image,
  lang,
  bookNow,
  description,
}: PackageCardProps) {
  const href = `/${lang}/packages/${slug}`;

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          quality={95}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Price badge */}
        <div
          className="absolute top-3 right-3 bg-yellow-400 text-gray-900 font-bold text-sm px-3 py-1.5 rounded-full shadow-md"
          aria-label={`Price: ${price} ${priceUnit}`}
        >
          {price} {priceUnit}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
          {name}
        </h3>

        <p className="text-blue-600 text-sm font-medium mb-3">{tagline}</p>

        {description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
            {description}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2">
          <Link
            href={href}
            className="inline-flex items-center justify-center w-full min-h-[44px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            aria-label={`${bookNow} — ${name}`}
          >
            {bookNow}
            <svg
              className="ml-2 w-4 h-4"
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
      </div>
    </article>
  );
}
