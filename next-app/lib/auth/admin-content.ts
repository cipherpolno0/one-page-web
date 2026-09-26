import "server-only";
import { prisma } from "@/lib/prisma";
import { getDocumentLinkState } from "@/lib/documents";
import { requireAdmin } from "./authorization";

type NewsCreateInput = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
};

type NewsUpdateInput = Partial<Omit<NewsCreateInput, "slug">> & { slug?: string };

type DocumentCreateInput = {
  title: string;
  category: string;
  fileUrl?: string;
  fileType: string;
  fileSizeBytes?: number;
};

type DocumentUpdateInput = Partial<DocumentCreateInput>;

export class ContentValidationError extends Error {
  constructor() {
    super("Content input is invalid.");
    this.name = "ContentValidationError";
  }
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const requireText = (value: string) => {
  const normalizedValue = value.trim();
  if (!normalizedValue) throw new ContentValidationError();
  return normalizedValue;
};

const validateSlug = (value: string) => {
  const slug = requireText(value);
  if (!slugPattern.test(slug)) throw new ContentValidationError();
  return slug;
};

const validateFileUrl = (value: string | undefined) => {
  if (value === undefined || !value.trim()) return null;
  if (getDocumentLinkState(value).status !== "available") throw new ContentValidationError();
  return value.trim();
};

const validateFileType = (value: string) => {
  if (value !== "application/pdf") throw new ContentValidationError();
  return value;
};

const validateFileSize = (value: number | undefined) => {
  if (value === undefined) return undefined;
  if (!Number.isInteger(value) || value < 0) throw new ContentValidationError();
  return value;
};

const validateNewsCreate = (input: NewsCreateInput) => ({
  slug: validateSlug(input.slug),
  title: requireText(input.title),
  category: requireText(input.category),
  summary: requireText(input.summary),
  content: requireText(input.content)
});

const validateNewsUpdate = (input: NewsUpdateInput) => {
  const data = {
    ...(input.slug === undefined ? {} : { slug: validateSlug(input.slug) }),
    ...(input.title === undefined ? {} : { title: requireText(input.title) }),
    ...(input.category === undefined ? {} : { category: requireText(input.category) }),
    ...(input.summary === undefined ? {} : { summary: requireText(input.summary) }),
    ...(input.content === undefined ? {} : { content: requireText(input.content) })
  };

  if (Object.keys(data).length === 0) throw new ContentValidationError();
  return data;
};

const validateDocumentCreate = (input: DocumentCreateInput) => ({
  title: requireText(input.title),
  category: requireText(input.category),
  fileUrl: validateFileUrl(input.fileUrl),
  fileType: validateFileType(input.fileType),
  ...(validateFileSize(input.fileSizeBytes) === undefined ? {} : { fileSizeBytes: input.fileSizeBytes })
});

const validateDocumentUpdate = (input: DocumentUpdateInput) => {
  const data = {
    ...(input.title === undefined ? {} : { title: requireText(input.title) }),
    ...(input.category === undefined ? {} : { category: requireText(input.category) }),
    ...(input.fileUrl === undefined ? {} : { fileUrl: validateFileUrl(input.fileUrl) }),
    ...(input.fileType === undefined ? {} : { fileType: validateFileType(input.fileType) }),
    ...(input.fileSizeBytes === undefined ? {} : { fileSizeBytes: validateFileSize(input.fileSizeBytes) })
  };

  if (Object.keys(data).length === 0) throw new ContentValidationError();
  return data;
};

export async function createNews(input: NewsCreateInput) {
  const actor = await requireAdmin();
  const data = validateNewsCreate(input);
  return prisma.news.create({
    data: { ...data, createdById: actor.id, updatedById: actor.id }
  });
}

export async function updateNews(id: string, input: NewsUpdateInput) {
  const actor = await requireAdmin();
  const data = validateNewsUpdate(input);
  return prisma.news.update({ where: { id }, data: { ...data, updatedById: actor.id } });
}

export async function publishNews(id: string) {
  const actor = await requireAdmin();
  return prisma.news.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date(), updatedById: actor.id }
  });
}

export async function deleteNews(id: string) {
  await requireAdmin();
  return prisma.news.delete({ where: { id } });
}

export async function createDocument(input: DocumentCreateInput) {
  const actor = await requireAdmin();
  const data = validateDocumentCreate(input);
  return prisma.document.create({
    data: { ...data, createdById: actor.id, updatedById: actor.id }
  });
}

export async function updateDocument(id: string, input: DocumentUpdateInput) {
  const actor = await requireAdmin();
  const data = validateDocumentUpdate(input);
  return prisma.document.update({ where: { id }, data: { ...data, updatedById: actor.id } });
}

export async function publishDocument(id: string) {
  const actor = await requireAdmin();
  return prisma.document.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date(), updatedById: actor.id }
  });
}

export async function deleteDocument(id: string) {
  await requireAdmin();
  return prisma.document.delete({ where: { id } });
}
