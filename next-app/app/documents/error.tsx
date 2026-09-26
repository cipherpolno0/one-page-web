"use client";

import { DataLoadError } from "@/components/DataLoadError";

export default function DocumentsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <DataLoadError reset={reset} title="ไม่สามารถโหลดเอกสารได้" />;
}
