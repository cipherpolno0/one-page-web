import { notFound, redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { ForbiddenError, UnauthenticatedError, requireAdmin } from "@/lib/auth/authorization";

export default async function AdminPage() {
  try {
    const user = await requireAdmin();

    return (
      <main className="content-section" id="main-content">
        <div className="container news-not-found">
          <p className="eyebrow">พื้นที่ผู้ดูแลระบบ</p>
          <h1>จัดการเนื้อหา</h1>
          <p>เข้าสู่ระบบในบทบาทผู้ดูแล: {user.name ?? user.email}</p>
          <LogoutButton />
        </div>
      </main>
    );
  } catch (error) {
    if (error instanceof UnauthenticatedError) redirect("/login?callbackUrl=/admin");
    if (error instanceof ForbiddenError) notFound();
    throw error;
  }
}
