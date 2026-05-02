import { metadata } from "@/app/layout";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  metadata.title = "Edit Product - EG Cart";
  return <>{children}</>;
}

export default layout;
