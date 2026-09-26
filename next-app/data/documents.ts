import type { DocumentItem } from "@/types/content";

export const documentItems: DocumentItem[] = [
  {
    id: "request-information-form",
    title: "แบบฟอร์มขอรับบริการข้อมูล",
    category: "แบบฟอร์ม",
    date: "2026-09-24",
    fileUrl: "/downloads/sample-request-information-form.pdf",
    fileSize: "124 KB"
  },
  {
    id: "contact-guide",
    title: "คู่มือการติดต่อประสานงาน",
    category: "คู่มือ",
    date: "2026-09-20",
    fileUrl: "",
    fileSize: "286 KB"
  },
  {
    id: "service-calendar",
    title: "ปฏิทินการให้บริการประจำเดือน",
    category: "ปฏิทิน",
    date: "2026-09-18",
    fileUrl: "/downloads/sample-service-calendar.docx",
    fileSize: "198 KB"
  },
  {
    id: "publication-submission-guide",
    title: "แนวทางการส่งข้อมูลเพื่อเผยแพร่",
    category: "แนวทางปฏิบัติ",
    date: "2026-09-15",
    fileUrl: "javascript:alert('unsafe-link')",
    fileSize: "342 KB"
  }
];
