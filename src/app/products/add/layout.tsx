import { metadata } from "@/app/layout";
import Header from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  metadata.title = "Add Product - EG Cart";
  return (
    <div>
      <Header />
      <div className="pt-24 px-10">{children}</div>
    </div>
  );
}
