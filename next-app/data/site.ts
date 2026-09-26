import type { HeroContent, NavigationItem, SiteBrand } from "@/types/content";

export const siteBrand: SiteBrand = {
  name: "ศูนย์ประชาสัมพันธ์",
  tagline: "ข่าวสารและบริการข้อมูล",
  mark: "ป"
};

export const primaryNavigation: NavigationItem[] = [
  { href: "/#news", label: "ข่าวประชาสัมพันธ์" },
  { href: "/#downloads", label: "ดาวน์โหลดเอกสาร" },
  { href: "/#contact", label: "ติดต่อเรา" }
];

export const heroContent: HeroContent = {
  eyebrow: "ข้อมูลที่ชัดเจน เข้าถึงได้ง่าย",
  title: "ติดตามข่าวสารสำคัญ\nได้ในที่เดียว",
  description: "รวบรวมข่าวประชาสัมพันธ์ เอกสารที่เกี่ยวข้อง และช่องทางติดต่อสำหรับผู้รับบริการ",
  notice: "เนื้อหาทั้งหมดในหน้านี้เป็นข้อมูลตัวอย่างสำหรับการออกแบบเว็บไซต์",
  callToAction: { href: "/#news", label: "ดูข่าวล่าสุด" }
};
