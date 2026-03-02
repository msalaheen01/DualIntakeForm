import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "District Office – Constituent Intake & Case Tracking",
  description: "Bilingual constituent intake and case management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
