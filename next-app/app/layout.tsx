import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ศูนย์ประชาสัมพันธ์",
  description: "เว็บไซต์ประชาสัมพันธ์สำหรับเผยแพร่ข่าวสาร เอกสาร และช่องทางติดต่อ"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
