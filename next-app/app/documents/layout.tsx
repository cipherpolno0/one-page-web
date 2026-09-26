import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { primaryNavigation, siteBrand } from "@/data/site";

export default function DocumentsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>
      <Header brand={siteBrand} navigationItems={primaryNavigation} />
      <main id="main-content">{children}</main>
      <Footer organizationName="ศูนย์ประชาสัมพันธ์" year={2026} />
    </>
  );
}
