"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const getSafeCallbackUrl = (value: string | null) => (
  value?.startsWith("/") && !value.startsWith("//") ? value : "/admin"
);

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: getSafeCallbackUrl(searchParams.get("callbackUrl"))
    });

    setIsPending(false);

    if (response?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    router.replace(getSafeCallbackUrl(searchParams.get("callbackUrl")));
    router.refresh();
  };

  return (
    <form className="news-controls" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">อีเมล</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <label htmlFor="password">รหัสผ่าน</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {error && <p className="news-empty-state" role="alert">{error}</p>}
      <div className="news-controls__actions">
        <button className="button button-secondary" type="submit" disabled={isPending}>{isPending ? "กำลังเข้าสู่ระบบ" : "เข้าสู่ระบบ"}</button>
      </div>
    </form>
  );
}
