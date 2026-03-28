import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodConnect — Rescue Food, Feed Communities",
  description:
    "FoodConnect connects food donors with shelters to eliminate waste and feed communities. Real-time dispatching, smart logistics, and verified handoffs.",
  keywords: ["food donation", "food rescue", "shelter", "logistics", "Ethiopia"],
  openGraph: {
    title: "FoodConnect",
    description: "Rescue Food, Feed Communities",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
