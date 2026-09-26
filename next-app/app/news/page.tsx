import type { Metadata } from "next";
import { ContentSearchControls } from "@/components/ContentSearchControls";
import { ContentUnavailable } from "@/components/ContentUnavailable";
import { NewsCard } from "@/components/NewsCard";
import { SectionHeading } from "@/components/SectionHeading";
import { isContentDataAccessError, listPublishedNews, listPublishedNewsCategories } from "@/lib/content-repository";

export const metadata: Metadata = {
  title: "ข่าวประชาสัมพันธ์ | ศูนย์ประชาสัมพันธ์",
  description: "รายการข่าวประชาสัมพันธ์ที่เผยแพร่จากศูนย์ประชาสัมพันธ์"
};

type NewsIndexPageProps = {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
};

const getSingleSearchParam = (value: string | string[] | undefined) => (
  typeof value === "string" ? value : ""
);

export default async function NewsIndexPage({ searchParams }: NewsIndexPageProps) {
  const parameters = await searchParams;
  const query = getSingleSearchParam(parameters.q);
  const category = getSingleSearchParam(parameters.category);
  let categories;
  let matchingItems;

  try {
    [categories, matchingItems] = await Promise.all([
      listPublishedNewsCategories(),
      listPublishedNews({ query, category })
    ]);
  } catch (error) {
    if (isContentDataAccessError(error)) {
      return <ContentUnavailable retryHref="/news" sectionId="news" title="ไม่สามารถโหลดข่าวได้" />;
    }

    throw error;
  }

  return (
    <section className="content-section" id="news" aria-labelledby="news-title">
      <div className="container">
        <SectionHeading eyebrow="รายการข่าวทั้งหมด" id="news-title" title="ข่าวประชาสัมพันธ์" />
        <ContentSearchControls
          categories={categories}
          idPrefix="news"
          initialCategory={category}
          initialQuery={query}
          searchHint="ค้นหาได้จากหัวข้อ สรุป หรือเนื้อหาข่าว"
          searchLabel="ค้นหาข่าว"
          searchPlaceholder="ค้นหาจากหัวข้อหรือเนื้อหาข่าว"
        />
        <p className="news-results-count" aria-live="polite">แสดงข่าว {matchingItems.length} รายการ</p>
        {matchingItems.length === 0 ? (
          <p className="news-empty-state">ไม่พบข่าวที่ตรงกับคำค้นหาหรือหมวดที่เลือก</p>
        ) : (
          <div className="news-grid">
            {matchingItems.map((item) => <NewsCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </section>
  );
}
