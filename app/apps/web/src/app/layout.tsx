import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "29 WITH",
  description: "29 Platform external collaboration management"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
