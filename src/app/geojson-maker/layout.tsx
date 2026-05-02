import Header from "@/components/header";
import { metadata } from "@/app/layout";
import { Toaster } from "react-hot-toast";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  metadata.title = "Editor - EG Cart";
  return (
    <div>
      <Header />
      <Toaster position="top-right" reverseOrder={true} />
      <div className="pt-24 px-10">{children}</div>
    </div>
  );
}

export default layout;
