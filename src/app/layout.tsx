import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/features/cart/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نوا استور | پرداخت امن",
  description:
    "فروشگاه دمو با ماژول پرداخت شبیه‌سازی‌شده در سطح Stripe Checkout — کارت، کیف پول، پرداخت در محل، رسید و تاریخچه.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="font-sans antialiased">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
          >
            پرش به محتوا
          </a>
          <Header />
          <main id="main" className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
