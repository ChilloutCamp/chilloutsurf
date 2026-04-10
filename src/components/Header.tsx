"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderProps = {
  lang: string;
  dict: {
    nav: { home: string; packages: string; blog: string; contact: string };
  };
};

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "es", flag: "🇪🇸", label: "Español" },
];

export default function Header({ lang, dict }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setLangOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const navLinks = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/packages`, label: dict.nav.packages },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  // Swap the lang segment in the current path
  const switchLangHref = (newLang: string) => {
    const segments = pathname.split("/");
    segments[1] = newLang;
    return segments.join("/") || "/";
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href={`/${lang}`}
              className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
              aria-label="ChilloutSurf — Home"
            >
              <Image
                src="/images/logo.png"
                alt="ChilloutSurf logo"
                width={160}
                height={48}
                quality={95}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== `/${lang}` &&
                    pathname.startsWith(link.href + "/"));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm px-1 ${
                      isActive
                        ? "text-blue-600 border-b-2 border-blue-600 pb-0.5"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Language switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={langOpen}
                  aria-label="Select language"
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md px-2 py-1"
                >
                  <span aria-hidden="true">{currentLang.flag}</span>
                  <span className="uppercase">{currentLang.code}</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {langOpen && (
                  <ul
                    role="listbox"
                    aria-label="Language options"
                    className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50"
                  >
                    {LANGUAGES.map((l) => (
                      <li key={l.code} role="option" aria-selected={l.code === lang}>
                        <Link
                          href={switchLangHref(l.code)}
                          onClick={() => setLangOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:bg-blue-50 ${
                            l.code === lang
                              ? "text-blue-600 font-semibold"
                              : "text-gray-700"
                          }`}
                        >
                          <span aria-hidden="true">{l.flag}</span>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </nav>

            {/* Mobile: lang + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setLangOpen((v) => !v)}
                aria-label="Select language"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                className="text-lg p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {currentLang.flag}
              </button>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
              >
                {menuOpen ? (
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
                ) : (
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile lang dropdown */}
        {langOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <ul role="listbox" aria-label="Language options" className="px-4 py-2">
              {LANGUAGES.map((l) => (
                <li key={l.code} role="option" aria-selected={l.code === lang}>
                  <Link
                    href={switchLangHref(l.code)}
                    onClick={() => setLangOpen(false)}
                    className={`flex items-center gap-2.5 py-2.5 text-sm ${
                      l.code === lang
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    <span aria-hidden="true">{l.flag}</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          aria-modal="true"
          role="dialog"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <nav
            id="mobile-menu"
            className="absolute top-16 left-0 right-0 bg-white shadow-xl border-t border-gray-100"
            aria-label="Mobile navigation"
          >
            <ul className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== `/${lang}` &&
                    pathname.startsWith(link.href + "/"));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center min-h-[44px] px-4 py-2 rounded-xl text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
