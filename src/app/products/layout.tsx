import Header from "@/components/header";
import { metadata } from "../layout";

function layout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  metadata.title = "Products";
    return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Header/>
        <main className="pt-24">
            {children}</main>
      </body>
    </html>
  );
}

export default layout;
