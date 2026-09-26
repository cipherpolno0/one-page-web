import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { DocumentItem, NewsItem } from "@/types/content";

export type ContentFilters = {
  query?: string;
  category?: string;
};

export class ContentDataAccessError extends Error {
  constructor() {
    super("Content data is temporarily unavailable.");
    this.name = "ContentDataAccessError";
  }
}

export const isContentDataAccessError = (error: unknown) => (
  error instanceof ContentDataAccessError
);

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const publishedWhere = { status: "PUBLISHED", publishedAt: { not: null } } as const;

const asDateOnly = (date: Date) => date.toISOString().slice(0, 10);

const formatFileSize = (bytes: number | null) => {
  if (bytes === null) return "ไม่ระบุขนาด";
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const asNewsItem = (item: {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  publishedAt: Date | null;
}): NewsItem => ({
  id: item.id,
  slug: item.slug,
  title: item.title,
  category: item.category,
  summary: item.summary,
  content: item.content,
  date: asDateOnly(item.publishedAt ?? new Date(0))
});

const asDocumentItem = (item: {
  id: string;
  title: string;
  category: string;
  fileUrl: string | null;
  fileSizeBytes: number | null;
  publishedAt: Date | null;
}): DocumentItem => ({
  id: item.id,
  title: item.title,
  category: item.category,
  fileUrl: item.fileUrl ?? "",
  fileSize: formatFileSize(item.fileSizeBytes),
  date: asDateOnly(item.publishedAt ?? new Date(0))
});

const createNewsWhere = ({ query = "", category = "" }: ContentFilters): Prisma.NewsWhereInput => ({
  ...publishedWhere,
  ...(category ? { category } : {}),
  ...(query.trim() ? {
    OR: [
      { title: { contains: query.trim() } },
      { summary: { contains: query.trim() } },
      { content: { contains: query.trim() } }
    ]
  } : {})
});

const createDocumentWhere = ({ query = "", category = "" }: ContentFilters): Prisma.DocumentWhereInput => ({
  ...publishedWhere,
  ...(category ? { category } : {}),
  ...(query.trim() ? {
    OR: [
      { title: { contains: query.trim() } },
      { category: { contains: query.trim() } }
    ]
  } : {})
});

const withDataAccessHandling = async <T>(operation: () => Promise<T>) => {
  try {
    return await operation();
  } catch {
    throw new ContentDataAccessError();
  }
};

export const listPublishedNews = (filters: ContentFilters = {}) => withDataAccessHandling(async () => {
  const items = await prisma.news.findMany({
    where: createNewsWhere(filters),
    orderBy: { publishedAt: "desc" }
  });

  return items.map(asNewsItem);
});

export const listPublishedNewsCategories = () => withDataAccessHandling(async () => {
  const items = await prisma.news.findMany({
    where: publishedWhere,
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" }
  });

  return items.map((item) => item.category);
});

export const getPublishedNewsBySlug = (slug: string) => withDataAccessHandling(async () => {
  if (!slugPattern.test(slug)) return null;

  const item = await prisma.news.findFirst({
    where: { ...publishedWhere, slug }
  });

  return item ? asNewsItem(item) : null;
});

export const listPublishedDocuments = (filters: ContentFilters = {}) => withDataAccessHandling(async () => {
  const items = await prisma.document.findMany({
    where: createDocumentWhere(filters),
    orderBy: { publishedAt: "desc" }
  });

  return items.map(asDocumentItem);
});

export const listPublishedDocumentCategories = () => withDataAccessHandling(async () => {
  const items = await prisma.document.findMany({
    where: publishedWhere,
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" }
  });

  return items.map((item) => item.category);
});

export const getPublishedDocumentByFileName = (fileName: string) => withDataAccessHandling(async () => {
  const item = await prisma.document.findFirst({
    where: { ...publishedWhere, fileUrl: `/downloads/${fileName}` }
  });

  return item ? asDocumentItem(item) : null;
});
