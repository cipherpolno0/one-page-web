"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button className="button button-secondary" type="button" onClick={() => signOut({ callbackUrl: "/" })}>
      ออกจากระบบ
    </button>
  );
}
