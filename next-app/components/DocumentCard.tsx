import { formatThaiDate } from "@/lib/format";
import { getDocumentLinkState, type DocumentLinkState } from "@/lib/documents";
import type { DocumentItem } from "@/types/content";

type DocumentCardProps = {
  item: DocumentItem;
};

type DocumentActionsProps = DocumentCardProps & {
  linkState: DocumentLinkState;
};

function DocumentActions({ item, linkState }: DocumentActionsProps) {
  if (linkState.status === "unavailable") {
    return (
      <span className="download-item__cta download-item__cta--unavailable" aria-disabled="true">
        ไม่พร้อมเปิด/ดาวน์โหลด: {linkState.reason}
      </span>
    );
  }

  return (
    <div className="download-item__actions">
      <a
        className="download-item__cta"
        href={linkState.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`ดูเอกสาร ${item.title}`}
      >
        ดูเอกสาร
      </a>
      <a
        className="download-item__cta"
        href={linkState.href}
        download={linkState.fileName}
        aria-label={`ดาวน์โหลดเอกสาร ${item.title}`}
      >
        ดาวน์โหลด
      </a>
    </div>
  );
}

export function DocumentCard({ item }: DocumentCardProps) {
  const linkState = getDocumentLinkState(item.fileUrl);

  return (
    <article className="download-item">
      <span className="download-item__type" aria-hidden="true">PDF</span>
      <div className="download-item__content">
        <strong>{item.title}</strong>
        <small>PDF · {item.category} · {formatThaiDate(item.date)} · {item.fileSize}</small>
        <small>ชื่อไฟล์: {linkState.status === "available" ? linkState.fileName : "ไม่มีไฟล์ที่ใช้ได้"}</small>
      </div>
      <DocumentActions item={item} linkState={linkState} />
    </article>
  );
}
