"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ContentSearchControlsProps = {
  categories: string[];
  idPrefix: string;
  initialCategory: string;
  initialQuery: string;
  searchHint: string;
  searchLabel: string;
  searchPlaceholder: string;
};

export function ContentSearchControls({
  categories,
  idPrefix,
  initialCategory,
  initialQuery,
  searchHint,
  searchLabel,
  searchPlaceholder
}: ContentSearchControlsProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const pathname = usePathname();
  const router = useRouter();
  const searchId = `${idPrefix}-search`;
  const categoryId = `${idPrefix}-category`;
  const searchHelpId = `${idPrefix}-search-help`;

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
        <label htmlFor={searchId}>{searchLabel}</label>
        <input
          id={searchId}
          type="search"
          placeholder={searchPlaceholder}
          autoComplete="off"
          aria-describedby={searchHelpId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <small className="news-controls__hint" id={searchHelpId}>{searchHint}</small>
      </div>
      <div>
        <label htmlFor={categoryId}>หมวดหมู่</label>
        <select
          id={categoryId}
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
