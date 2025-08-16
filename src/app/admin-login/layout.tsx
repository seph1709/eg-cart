import { metadata } from "../layout";

function layout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  metadata.title = "Admin Login";
    return (
    <html lang="en">
      <body>

        <main>
            {children}</main>
      </body>
    </html>
  );
}

export default layout;
