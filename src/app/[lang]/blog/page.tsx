import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { blogPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import { makeMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "de" }, { lang: "es" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return makeMetadata({
    title: "Blog | Chillout Surf Camp Taghazout",
    description: "Surf tips, travel guides, and stories from Taghazout Bay, Morocco. Discover the best surf spots, local culture, and everything about the Chillout Surf Camp experience.",
    path: "/blog",
    lang,
  });
}

export default async function BlogPage({ params }: Props) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <section className="bg-white border-b border-gray-100 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            {dict.blog.title}
          </h1>
        </div>
      </section>

      {/* Blog grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogPosts.map((post) => {
            const postDict = (dict.blog as Record<string, unknown>).posts as
              | Record<string, { title: string; excerpt: string }>
              | undefined;
            const title = postDict?.[post.slug]?.title ?? post.slug;
            const excerpt = postDict?.[post.slug]?.excerpt ?? "";

            return (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={title}
                date={post.date}
                excerpt={excerpt}
                image={post.image}
                lang={lang}
                readMore={dict.blog.readMore}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
