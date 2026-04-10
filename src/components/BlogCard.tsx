import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  lang: string;
  readMore: string;
};

export default function BlogCard({
  slug,
  title,
  date,
  excerpt,
  image,
  lang,
  readMore,
}: BlogCardProps) {
  const href = `/${lang}/blog/${slug}`;

  // Format date nicely
  const formattedDate = new Date(date).toLocaleDateString(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Image — optional */}
      {image && (
        <Link
          href={href}
          className="block relative aspect-[16/9] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={image}
            alt={title}
            fill
            quality={95}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Date */}
        <time
          dateTime={date}
          className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2"
        >
          {formattedDate}
        </time>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
          <Link
            href={href}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
          >
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1 mb-4">
          {excerpt}
        </p>

        {/* Read more */}
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
          aria-label={`${readMore}: ${title}`}
        >
          {readMore}
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
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
    </article>
  );
}
