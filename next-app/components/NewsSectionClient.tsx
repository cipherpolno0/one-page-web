"use client";

import { useMemo, useState } from "react";
import { filterNewsItems, getNewsCategories } from "@/lib/news";
import type { NewsItem } from "@/types/content";
import { NewsCard } from "./NewsCard";
import { SectionHeading } from "./SectionHeading";

type NewsSectionClientProps = {
  items: NewsItem[];
};

export function NewsSectionClient({ items }: NewsSectionClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const categories = useMemo(() => getNewsCategories(items), [items]);
  const matchingItems = useMemo(() => (
    filterNewsItems(items, { query: searchTerm, category })
  ), [category, items, searchTerm]);

  return (
    <section className="content-section" id="news" aria-labelledby="news-title">
      <div className="container">
        <SectionHeading eyebrow="อัปเดตล่าสุด" id="news-title" title="ข่าวประชาสัมพันธ์">
          <a className="section-heading__link" href="/#contact">สอบถามข้อมูล <span aria-hidden="true">→</span></a>
        </SectionHeading>

        <form className="news-controls" role="search" onSubmit={(event) => event.preventDefault()}>
          <div>
            <label htmlFor="news-search">ค้นหาข่าว</label>
            <input id="news-search" type="search" placeholder="ค้นหาจากหัวข้อหรือสรุปข่าว" autoComplete="off" aria-describedby="news-search-help" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <small className="news-controls__hint" id="news-search-help">ค้นหาได้จากคำในหัวข้อหรือสรุปข่าว</small>
          </div>
          <div>
            <label htmlFor="news-category">หมวดข่าว</label>
            <select id="news-category" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">ทุกหมวด</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </form>

        <p className="news-results-count" aria-live="polite">แสดงข่าว {matchingItems.length} รายการ</p>
        {matchingItems.length === 0 ? <p className="news-empty-state">ยังไม่มีข่าวประชาสัมพันธ์ที่เผยแพร่</p> : (
          <div className="news-grid">{matchingItems.map((item) => <NewsCard key={item.id} item={item} />)}</div>
        )}
      </div>
    </section>
  );
}
