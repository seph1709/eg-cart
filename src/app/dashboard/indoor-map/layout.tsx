import { metadata } from "@/app/layout";
import { Toaster } from "react-hot-toast";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  metadata.title = "Indoor Map - EG Cart";
  return (
    <div>
      <Toaster position="top-right" reverseOrder={true} />
      {children}
    </div>
  );
}

export default layout;
