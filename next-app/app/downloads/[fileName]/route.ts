import { getPublishedDocumentByFileName } from "@/lib/content-repository";
import { getDocumentLinkState } from "@/lib/documents";

type DownloadRouteProps = {
  params: Promise<{ fileName: string }>;
};

function buildSamplePdf() {
  const encoder = new TextEncoder();
  const streamContent = "BT /F1 18 Tf 72 720 Td (Sample document) Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = encoder.encode(pdf).length;
  const xrefRows = offsets.map((offset, index) => (
    index === 0 ? "0000000000 65535 f " : `${String(offset).padStart(10, "0")} 00000 n `
  )).join("\n");
  pdf += `xref\n0 ${objects.length + 1}\n${xrefRows}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return encoder.encode(pdf);
}

export async function GET(_request: Request, { params }: DownloadRouteProps) {
  const { fileName } = await params;
  let item;

  try {
    item = await getPublishedDocumentByFileName(fileName);
  } catch {
    return new Response("Service unavailable", { status: 503 });
  }

  const linkState = item ? getDocumentLinkState(item.fileUrl) : undefined;

  if (!linkState || linkState.status !== "available") {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buildSamplePdf(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition": `inline; filename="${linkState.fileName}"`,
      "Content-Type": "application/pdf"
    }
  });
}
