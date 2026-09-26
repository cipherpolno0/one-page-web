import { SectionHeading } from "./SectionHeading";

type ContentUnavailableProps = {
  headingLevel?: "h1" | "h2";
  retryHref: string;
  sectionId: string;
  title: string;
};

export function ContentUnavailable({
  headingLevel = "h1",
  retryHref,
  sectionId,
  title
}: ContentUnavailableProps) {
  return (
    <section className="content-section" id={sectionId} aria-labelledby={`${sectionId}-unavailable-title`}>
      <div className="container">
        <SectionHeading eyebrow="เกิดข้อผิดพลาดชั่วคราว" headingLevel={headingLevel} id={`${sectionId}-unavailable-title`} title={title}>
          <a className="section-heading__link" href={retryHref}>ลองใหม่</a>
        </SectionHeading>
        <p className="news-empty-state">กรุณาลองใหม่อีกครั้งภายหลัง</p>
      </div>
    </section>
  );
}
