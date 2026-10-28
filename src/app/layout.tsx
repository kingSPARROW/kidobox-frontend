import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import "./kidobox.css";
import { Providers } from "@/lib/providers";
import { CartDrawer } from "@/components/cart-drawer";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
    icon: "/logo.png",
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
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}>
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
      <body className="min-h-full flex flex-col bg-white text-[#122e50]">
        <Providers>
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
