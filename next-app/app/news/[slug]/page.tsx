import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentUnavailable } from "@/components/ContentUnavailable";
import { getPublishedNewsBySlug, isContentDataAccessError } from "@/lib/content-repository";
import { formatThaiDate } from "@/lib/format";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  let item;

  try {
    item = await getPublishedNewsBySlug(slug);
  } catch {
    return { title: "ไม่สามารถโหลดข่าว | ศูนย์ประชาสัมพันธ์" };
  }

  if (!item) {
    return { title: "ไม่พบข่าว | ศูนย์ประชาสัมพันธ์" };
  }

  return {
    title: `${item.title} | ศูนย์ประชาสัมพันธ์`,
    description: item.summary
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  let item;

  try {
    item = await getPublishedNewsBySlug(slug);
  } catch (error) {
    if (isContentDataAccessError(error)) {
      return <ContentUnavailable retryHref={`/news/${slug}`} sectionId="news-detail" title="ไม่สามารถโหลดข่าวได้" />;
    }

    throw error;
  }

  if (!item) {
    notFound();
  }

  return (
    <article className="content-section" aria-labelledby="news-detail-title">
      <div className="container news-detail">
        <p className="eyebrow">{item.category}</p>
        <time className="news-detail__date" dateTime={item.date}>{formatThaiDate(item.date)}</time>
        <h1 id="news-detail-title">{item.title}</h1>
        <p className="news-detail__summary">{item.summary}</p>
        <div className="news-detail__content"><p>{item.content}</p></div>
        <Link className="section-heading__link" href="/news">← กลับไปยังรายการข่าว</Link>
      </div>
    </article>
  );
}
