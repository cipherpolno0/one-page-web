import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getCurrentSession } from "@/lib/auth/authorization";

export default async function LoginPage() {
  const session = await getCurrentSession();
  if (session?.user) redirect("/admin");

  return (
    <main className="content-section" id="main-content">
      <div className="container news-not-found">
        <p className="eyebrow">สำหรับผู้ดูแลระบบ</p>
        <h1>เข้าสู่ระบบ</h1>
        <LoginForm />
      </div>
    </main>
  );
}
