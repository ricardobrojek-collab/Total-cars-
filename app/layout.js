import "./globals.css";

export const metadata = {
  title: "Total Cars Switzerland",
  description: "Encontre carros, peças, pneus, oficinas e eventos automotivos na Suíça."
};

export default function RootLayout({ children }) {
  return <html lang="de"><body>{children}</body></html>;
}