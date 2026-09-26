import type { Metadata } from "next";
import { ContentSearchControls } from "@/components/ContentSearchControls";
import { ContentUnavailable } from "@/components/ContentUnavailable";
import { DocumentCard } from "@/components/DocumentCard";
import { SectionHeading } from "@/components/SectionHeading";
import { isContentDataAccessError, listPublishedDocumentCategories, listPublishedDocuments } from "@/lib/content-repository";

export const metadata: Metadata = {
  title: "เอกสารดาวน์โหลด | ศูนย์ประชาสัมพันธ์",
  description: "รายการเอกสารที่เผยแพร่พร้อมข้อมูลไฟล์และสถานะการเปิดหรือดาวน์โหลด"
};

type DocumentsPageProps = {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
};

const getSingleSearchParam = (value: string | string[] | undefined) => (
  typeof value === "string" ? value : ""
);

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  const parameters = await searchParams;
  const query = getSingleSearchParam(parameters.q);
  const category = getSingleSearchParam(parameters.category);
  let categories;
  let matchingItems;

  try {
    [categories, matchingItems] = await Promise.all([
      listPublishedDocumentCategories(),
      listPublishedDocuments({ query, category })
    ]);
  } catch (error) {
    if (isContentDataAccessError(error)) {
      return <ContentUnavailable retryHref="/documents" sectionId="documents" title="ไม่สามารถโหลดเอกสารได้" />;
    }

    throw error;
  }

  return (
    <section className="content-section" id="documents" aria-labelledby="documents-title">
      <div className="container">
        <SectionHeading
          eyebrow="คลังเอกสาร"
          headingLevel="h1"
          id="documents-title"
          title="เอกสารดาวน์โหลด"
        >
          <p className="section-note">ข้อมูลทั้งหมดเป็นตัวอย่าง ระบบจะแสดงปุ่มเฉพาะ URL ที่ปลอดภัยและเป็นไฟล์ PDF</p>
        </SectionHeading>
        <ContentSearchControls
          categories={categories}
          idPrefix="document"
          initialCategory={category}
          initialQuery={query}
          searchHint="ค้นหาได้จากชื่อเอกสารหรือหมวดหมู่"
          searchLabel="ค้นหาเอกสาร"
          searchPlaceholder="ค้นหาจากชื่อเอกสาร"
        />
        <p className="news-results-count" aria-live="polite">แสดงเอกสาร {matchingItems.length} รายการ</p>
        {matchingItems.length === 0 ? (
          <p className="news-empty-state">ไม่พบเอกสารที่ตรงกับคำค้นหาหรือหมวดที่เลือก</p>
        ) : (
          <div className="download-list">
            {matchingItems.map((item) => <DocumentCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </section>
  );
}
