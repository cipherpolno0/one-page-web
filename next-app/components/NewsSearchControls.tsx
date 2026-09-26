"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NewsSearchControlsProps = {
  categories: string[];
  initialQuery: string;
  initialCategory: string;
};

export function NewsSearchControls({ categories, initialQuery, initialCategory }: NewsSearchControlsProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setQuery(initialQuery);
    setCategory(initialCategory);
  }, [initialCategory, initialQuery]);

  const navigateToResults = (nextQuery: string, nextCategory: string) => {
    const parameters = new URLSearchParams();
    const normalizedQuery = nextQuery.trim();

    if (normalizedQuery) parameters.set("q", normalizedQuery);
    if (nextCategory) parameters.set("category", nextCategory);

    const queryString = parameters.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const hasActiveFilters = Boolean(initialQuery || initialCategory);

  return (
    <form
      className="news-controls news-search-controls"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        navigateToResults(query, category);
      }}
    >
      <div>
        <label htmlFor="news-search">ค้นหาข่าว</label>
        <input
          id="news-search"
          type="search"
          placeholder="ค้นหาจากหัวข้อหรือเนื้อหาข่าว"
          autoComplete="off"
          aria-describedby="news-search-help"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <small className="news-controls__hint" id="news-search-help">ค้นหาได้จากหัวข้อ สรุป หรือเนื้อหาข่าว</small>
      </div>
      <div>
        <label htmlFor="news-category">หมวดข่าว</label>
        <select
          id="news-category"
          value={category}
          onChange={(event) => {
            const nextCategory = event.target.value;
            setCategory(nextCategory);
            navigateToResults(query, nextCategory);
          }}
        >
          <option value="">ทุกหมวด</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div className="news-controls__actions">
        <button className="button button-secondary" type="submit">ค้นหา</button>
        {hasActiveFilters && <Link className="news-controls__reset" href={pathname}>ล้างตัวกรอง</Link>}
      </div>
    </form>
  );
}
