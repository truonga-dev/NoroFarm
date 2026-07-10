import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "NoroFarm",
  description: "Cổng thông tin Nông nghiệp số 1 Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
