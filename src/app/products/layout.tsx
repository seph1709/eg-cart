import Header from "@/components/header";
import { metadata } from "@/app/layout";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  metadata.title = "Products - EG Cart";
  return (
    <div>
      <Header />
      <div className="pt-24 px-10">{children}</div>
    </div>
  );
}

export default layout;
