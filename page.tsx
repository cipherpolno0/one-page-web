import { ContactSection } from "@/components/ContactSection";
import { DownloadsSection } from "@/components/DownloadsSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { NewsSection } from "@/components/NewsSection";
import { heroContent, primaryNavigation, siteBrand } from "@/data/site";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">ข้ามไปยังเนื้อหาหลัก</a>
      <Header brand={siteBrand} navigationItems={primaryNavigation} />
      <main id="main-content">
        <Hero content={heroContent} />
        <NewsSection />
        <DownloadsSection />
        <ContactSection />
      </main>
      <Footer organizationName={siteBrand.name} year={new Date().getFullYear() + 543} />
    </>
  );
}
