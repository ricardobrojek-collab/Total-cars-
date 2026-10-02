import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Total Cars Switzerland",
  description: "Encontre carros, peças, pneus, oficinas e eventos automotivos na Suíça."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1147823191721234"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}