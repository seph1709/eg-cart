

function layout({children}: Readonly<{
  children: React.ReactNode;
}>) {

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
