import type { NewsItem } from "@/types/content";

export type NewsFilters = {
  query?: string;
  category?: string;
};

const normalizeText = (value: string) => value.trim().toLocaleLowerCase("th-TH");

export const getNewsCategories = (items: NewsItem[]) => (
  [...new Set(items.map((item) => item.category))]
);

export const filterNewsItems = (items: NewsItem[], { query = "", category = "" }: NewsFilters) => {
  const normalizedQuery = normalizeText(query);

  return items.filter((item) => {
    const searchableContent = normalizeText(`${item.title} ${item.summary} ${item.content}`);
    return (!normalizedQuery || searchableContent.includes(normalizedQuery))
      && (!category || item.category === category);
  });
};
