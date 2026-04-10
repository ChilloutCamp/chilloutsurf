import type { Metadata } from "next";
import { Cardo } from "next/font/google";
import "./globals.css";

const cardo = Cardo({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-cardo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chillout Surf Camp Taghazout | All-Inclusive from €499",
  description:
    "Experience the best surf in Morocco. 15+ years experience, all levels welcome. Accommodation, meals, lessons & yoga included.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cardo.variable}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
