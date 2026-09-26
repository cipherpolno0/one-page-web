import type { DocumentItem } from "@/types/content";

export type DocumentFilters = {
  query?: string;
  category?: string;
};

export type DocumentLinkState =
  | { status: "available"; href: string; fileName: string }
  | { status: "unavailable"; reason: string };

const validationBaseUrl = "https://document-validation.invalid";

const normalizeText = (value: string) => value.trim().toLocaleLowerCase("th-TH");

export const getDocumentCategories = (items: DocumentItem[]) => (
  [...new Set(items.map((item) => item.category))]
);

export const filterDocumentItems = (items: DocumentItem[], { query = "", category = "" }: DocumentFilters) => {
  const normalizedQuery = normalizeText(query);

  return items.filter((item) => {
    const searchableContent = normalizeText(`${item.title} ${item.category}`);
    return (!normalizedQuery || searchableContent.includes(normalizedQuery))
      && (!category || item.category === category);
  });
};

export const getDocumentLinkState = (fileUrl: string): DocumentLinkState => {
  if (!fileUrl.trim()) {
    return { status: "unavailable", reason: "ไม่มี URL สำหรับเอกสารนี้" };
  }

  try {
    const parsedUrl = new URL(fileUrl, validationBaseUrl);
    const isAllowedProtocol = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";

    if (!isAllowedProtocol) {
      return { status: "unavailable", reason: "URL เอกสารไม่ปลอดภัย" };
    }

    if (!parsedUrl.pathname.toLowerCase().endsWith(".pdf")) {
      return { status: "unavailable", reason: "รองรับเฉพาะไฟล์ PDF" };
    }

    const fileName = parsedUrl.pathname.split("/").at(-1) || "document.pdf";
    return { status: "available", href: fileUrl, fileName };
  } catch {
    return { status: "unavailable", reason: "URL เอกสารไม่ถูกต้อง" };
  }
};
