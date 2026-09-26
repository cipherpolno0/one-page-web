import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { primaryNavigation, siteBrand } from "@/data/site";

export default function NewsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>
      <Header brand={siteBrand} navigationItems={primaryNavigation} />
      <main id="main-content">{children}</main>
      <Footer organizationName={siteBrand.name} year={new Date().getFullYear() + 543} />
    </>
  );
}
