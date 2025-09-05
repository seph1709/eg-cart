import { metadata } from "@/app/layout";
import Header from "@/components/header";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  metadata.title = "Edit Product - EG Cart";
  return (
    <>
      <Header />
      <div className="pt-24 px-10">{children}</div>
    </>
  );
}

export default layout;
