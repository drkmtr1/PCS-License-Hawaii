import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PCS License Hawaiʻi",
  description: "A privacy-minimal prototype shell for a future official-resource navigator.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
