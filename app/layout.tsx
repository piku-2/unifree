import type { Metadata } from "next";
import "@/src/index.css"; // ★ これが本命

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
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
