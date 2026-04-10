import { notFound } from "next/navigation";
import { Cardo } from "next/font/google";
import { getDictionary, hasLocale } from "./dictionaries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const cardo = Cardo({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-cardo",
  display: "swap",
});

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "de" }, { lang: "es" }];
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className={cardo.variable}>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-blue-600 focus:font-medium"
        >
          Skip to content
        </a>
        <Header lang={lang} dict={{ nav: dict.nav }} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer lang={lang} dict={{ footer: dict.footer, nav: dict.nav, contact: { info: dict.contact.info } }} />
        <CookieConsent dict={{ cookie: dict.cookie }} />
      </body>
    </html>
  );
}
