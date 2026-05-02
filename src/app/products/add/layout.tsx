import { metadata } from "@/app/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  metadata.title = "Add Product - EG Cart";
  return <>{children}</>;
}
