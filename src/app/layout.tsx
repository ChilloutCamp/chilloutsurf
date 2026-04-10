import type { Metadata } from "next";
import "./globals.css";

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
  return children;
}
