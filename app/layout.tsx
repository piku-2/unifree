import type { Metadata } from "next";
import "@/src/index.css";

export const metadata: Metadata = {
  title: "Unifree",
  description: "Campus marketplace app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-background text-foreground min-h-screen">
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
