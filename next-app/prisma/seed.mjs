import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();
const seedUserEmail = "content-admin@example.test";
const seedPassword = process.env.ADMIN_SEED_PASSWORD;

async function main() {
  if (!seedPassword) {
    throw new Error("ADMIN_SEED_PASSWORD must be set before seeding the admin account.");
  }

  const passwordHash = await hash(seedPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: seedUserEmail },
    update: { displayName: "ผู้ดูแลเนื้อหาตัวอย่าง", passwordHash, role: "ADMIN", status: "ACTIVE" },
    create: {
      email: seedUserEmail,
      displayName: "ผู้ดูแลเนื้อหาตัวอย่าง",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE"
    }
  });

  await prisma.news.upsert({
    where: { slug: "service-hours-announcement" },
    update: {
      title: "แจ้งกำหนดเวลาการให้บริการข้อมูลประจำสัปดาห์",
      category: "ประกาศ",
      summary: "ข้อมูลตัวอย่างสำหรับทดสอบรายการข่าวจากฐานข้อมูล",
      content: "ข้อมูลตัวอย่างสำหรับทดสอบรายการข่าวจากฐานข้อมูลและการแสดงผลหน้าเว็บไซต์",
      status: "PUBLISHED",
      publishedAt: new Date("2026-09-24T00:00:00.000Z"),
      updatedById: admin.id
    },
    create: {
      slug: "service-hours-announcement",
      title: "แจ้งกำหนดเวลาการให้บริการข้อมูลประจำสัปดาห์",
      category: "ประกาศ",
      summary: "ข้อมูลตัวอย่างสำหรับทดสอบรายการข่าวจากฐานข้อมูล",
      content: "ข้อมูลตัวอย่างสำหรับทดสอบรายการข่าวจากฐานข้อมูลและการแสดงผลหน้าเว็บไซต์",
      status: "PUBLISHED",
      publishedAt: new Date("2026-09-24T00:00:00.000Z"),
      createdById: admin.id,
      updatedById: admin.id
    }
  });

  await prisma.document.upsert({
    where: { id: "sample-request-information-form" },
    update: {
      title: "แบบฟอร์มขอรับบริการข้อมูล",
      category: "แบบฟอร์ม",
      fileUrl: "/downloads/sample-request-information-form.pdf",
      fileType: "application/pdf",
      fileSizeBytes: 124000,
      status: "PUBLISHED",
      publishedAt: new Date("2026-09-24T00:00:00.000Z"),
      updatedById: admin.id
    },
    create: {
      id: "sample-request-information-form",
      title: "แบบฟอร์มขอรับบริการข้อมูล",
      category: "แบบฟอร์ม",
      fileUrl: "/downloads/sample-request-information-form.pdf",
      fileType: "application/pdf",
      fileSizeBytes: 124000,
      status: "PUBLISHED",
      publishedAt: new Date("2026-09-24T00:00:00.000Z"),
      createdById: admin.id,
      updatedById: admin.id
    }
  });
}

main()
  .then(() => console.log("Database seed completed."))
  .finally(async () => prisma.$disconnect());
