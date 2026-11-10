import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./kidobox.css";
import { Providers } from "@/lib/providers";
import { CartDrawer } from "@/components/cart-drawer";

const jakarta = localFont({
  src: "./fonts/PlusJakartaSans.ttf",
  variable: "--font-jakarta",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Little Needs. Big Smiles. | KIDOBOX",
    template: "%s | KIDOBOX",
  },
  description: "Thoughtfully chosen baby essentials for life’s sweetest little moments. Diapers, toys, feeding, soft clothing & nursery favorites.",
  keywords: ["KIDOBOX", "baby care", "baby essentials", "baby clothing", "diapers", "feeding", "toys", "nursery"],
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: "Little Needs. Big Smiles. | KIDOBOX",
    description: "Thoughtfully chosen baby essentials for life’s sweetest little moments.",
    type: "website",
    locale: "en_IN",
    siteName: "KIDOBOX",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Little Needs. Big Smiles. | KIDOBOX",
    description: "Thoughtfully chosen baby essentials for life’s sweetest little moments.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="girl"
      className={`${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('kidobox_gender_theme');
                if (t === 'boy' || t === 'girl') {
                  document.documentElement.setAttribute('data-theme', t);
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#122e50]" suppressHydrationWarning>
        <Providers>
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
