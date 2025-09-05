import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "E-G Cart Admin",
  description:
    "Thesis project for E-G Cart a Product Management Sytem created by Joseph Maynite",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
