import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dynamics Global | Engineering Global Infrastructure",
  description: "Dynamics Global is an international industrial solutions provider specializing in mining, construction, and logistics operations across multiple regions including India, UAE, China, and the United States.",
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Outfit:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Navbar />
        <div className="pt-24 lg:pt-32 min-h-screen">
           {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
