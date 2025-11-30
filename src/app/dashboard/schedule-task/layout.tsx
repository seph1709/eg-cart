import { metadata } from "@/app/layout";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  metadata.title = "Schedule Task - EG Cart";
  return <div>{children}</div>;
}

export default layout;
