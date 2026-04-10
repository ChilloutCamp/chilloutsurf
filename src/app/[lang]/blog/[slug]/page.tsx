import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDictionary, hasLocale } from "../../dictionaries";
import { getBlogPostBySlug } from "@/lib/blog";
import { makeMetadata } from "@/lib/metadata";
import { blogPostingSchema } from "@/lib/jsonld";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

const SLUGS = [
  "things-to-do-taghazout",
  "best-surf-spots-morocco",
  "surfing-dictionary",
  "tamraght-vs-taghazout",
];

const LANGS = ["en", "de", "es"];

export async function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    SLUGS.map((slug) => ({ lang, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  const dict = await getDictionary(lang);
  const postDict = (dict.blog as Record<string, unknown>).posts as
    | Record<string, { title: string; excerpt: string }>
    | undefined;
  const title = postDict?.[slug]?.title ?? slug.replace(/-/g, " ");
  const description = postDict?.[slug]?.excerpt ?? "";
  return makeMetadata({
    title: `${title} | Chillout Surf Camp Blog`,
    description,
    path: `/blog/${slug}`,
    lang,
    image: post.image ? (post.image.startsWith("/") ? `https://chilloutsurf.com${post.image}` : post.image) : undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params;

  if (!hasLocale(lang)) notFound();

  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const dict = await getDictionary(lang);

  // Try to get translated content from dictionary, fall back gracefully
  const postDict = (dict.blog as Record<string, unknown>).posts as
    | Record<string, { title: string; excerpt: string; content?: string }>
    | undefined;

  const title = postDict?.[slug]?.title ?? slug.replace(/-/g, " ");
  const content = postDict?.[slug]?.content ?? "";

  const formattedDate = new Date(post.date).toLocaleDateString(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const postUrl = `https://chilloutsurf.com/${lang}/blog/${slug}`;

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema(title, post.date, postUrl, post.image)) }}
      />
      {/* Back link */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
        >
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
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          {dict.blog.title}
        </Link>
      </div>

      {/* Hero image */}
      {post.image && (
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <Image
              src={post.image}
              alt={title}
              fill
              quality={95}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Article content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <time
            dateTime={post.date}
            className="text-xs font-medium text-gray-400 uppercase tracking-wider"
          >
            {formattedDate}
          </time>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
        </header>

        {content ? (
          <div
            className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Content for this article is coming soon. Check back later for the
              full article about {title}.
            </p>
          </div>
        )}
      </div>

      {/* Back link bottom */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
        >
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
              d="M11 17l-5-5m0 0l5-5m-5 5h12"
            />
          </svg>
          {dict.blog.title}
        </Link>
      </div>
    </article>
  );
}
