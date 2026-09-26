import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const testEmail = "crud-smoke-test@example.test";
const testSlug = "crud-smoke-test-news";
const testDocumentId = "crud-smoke-test-document";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

async function cleanup() {
  await prisma.news.deleteMany({ where: { slug: testSlug } });
  await prisma.document.deleteMany({ where: { id: testDocumentId } });
  const user = await prisma.user.findUnique({ where: { email: testEmail } });

  if (user) {
    await prisma.session.deleteMany({ where: { userId: user.id } });
    await prisma.account.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
}

async function main() {
  await cleanup();

  const user = await prisma.user.create({
    data: {
      email: testEmail,
      displayName: "ผู้ใช้ทดสอบ CRUD",
      passwordHash: "$2b$12$4YUYWtXYYMCa00qWiMkbuOiyvLhoqIev3lvNqfPyk0YhmzkP9s7cS"
    }
  });
  const storedUser = await prisma.user.findUnique({ where: { email: testEmail } });
  assert(storedUser?.passwordHash.startsWith("$2b$"), "User password must be stored as a hash.");

  const account = await prisma.account.create({
    data: { userId: user.id, provider: "local", providerAccountId: user.id }
  });
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      sessionTokenHash: "sha256:crud-smoke-test-session-token",
      expiresAt: new Date("2026-12-31T00:00:00.000Z")
    }
  });
  assert(account.userId === user.id && session.userId === user.id, "Account and session must belong to the user.");

  const news = await prisma.news.create({
    data: {
      slug: testSlug,
      title: "ข่าวทดสอบ CRUD",
      category: "ทดสอบ",
      summary: "สรุปข่าวสำหรับตรวจ create/read/update",
      content: "เนื้อหาข่าวสำหรับตรวจ create/read/update",
      createdById: user.id,
      updatedById: user.id
    }
  });
  const storedNews = await prisma.news.findUnique({ where: { slug: testSlug } });
  assert(storedNews?.id === news.id, "News read must return the created record.");
  const publishedNews = await prisma.news.update({
    where: { id: news.id },
    data: { status: "PUBLISHED", publishedAt: new Date("2026-09-26T00:00:00.000Z"), updatedById: user.id }
  });
  assert(publishedNews.status === "PUBLISHED", "News update must persist the status.");

  const document = await prisma.document.create({
    data: {
      id: testDocumentId,
      title: "เอกสารทดสอบ CRUD",
      category: "ทดสอบ",
      fileUrl: "/downloads/crud-smoke-test.pdf",
      fileType: "application/pdf",
      fileSizeBytes: 2048,
      createdById: user.id,
      updatedById: user.id
    }
  });
  const storedDocument = await prisma.document.findUnique({ where: { id: testDocumentId } });
  assert(storedDocument?.id === document.id, "Document read must return the created record.");
  const publishedDocument = await prisma.document.update({
    where: { id: document.id },
    data: { status: "PUBLISHED", publishedAt: new Date("2026-09-26T00:00:00.000Z"), updatedById: user.id }
  });
  assert(publishedDocument.status === "PUBLISHED", "Document update must persist the status.");

  console.log("Database CRUD smoke test passed.");
}

main()
  .finally(async () => {
    await cleanup();
    await prisma.$disconnect();
  });
