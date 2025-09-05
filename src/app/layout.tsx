import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-G Cart Admin",
  description:
    "Thesis project for E-G Cart a Product Management Sytem created by Joseph Maynite",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>{children}</main>
      </body>
    </html>
  );
}
