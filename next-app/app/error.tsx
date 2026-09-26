"use client";

import { DataLoadError } from "@/components/DataLoadError";

export default function RootError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <DataLoadError reset={reset} title="ไม่สามารถโหลดข้อมูลได้" />;
}
