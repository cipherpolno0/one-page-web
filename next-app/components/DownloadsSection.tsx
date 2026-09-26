import Link from "next/link";
import { isContentDataAccessError, listPublishedDocuments } from "@/lib/content-repository";
import { ContentUnavailable } from "./ContentUnavailable";
import { DocumentCard } from "./DocumentCard";
import { SectionHeading } from "./SectionHeading";

export async function DownloadsSection() {
  let documentItems;

  try {
    documentItems = await listPublishedDocuments();
  } catch (error) {
    if (isContentDataAccessError(error)) {
      return <ContentUnavailable headingLevel="h2" retryHref="/" sectionId="downloads" title="ไม่สามารถโหลดเอกสารได้" />;
    }

    throw error;
  }
  return (
    <section className="content-section content-section--tinted" id="downloads" aria-labelledby="downloads-title">
      <div className="container">
        <SectionHeading eyebrow="เอกสารพร้อมใช้" id="downloads-title" title="ดาวน์โหลดเอกสาร">
          <div className="section-heading__supplement">
            <p className="section-note">รายการเอกสารเป็นข้อมูลตัวอย่าง โดยจะแสดงปุ่มเฉพาะ URL ที่ปลอดภัยและเป็นไฟล์ PDF</p>
            <Link className="section-heading__link" href="/documents">ดูเอกสารทั้งหมด →</Link>
          </div>
        </SectionHeading>

        <div className="download-list">
          {documentItems.length === 0 ? (
            <p className="news-empty-state">ยังไม่มีเอกสารที่เผยแพร่</p>
          ) : documentItems.map((item) => <DocumentCard key={item.id} item={item} />)}
        </div>
      </div>
    </section>
  );
}
