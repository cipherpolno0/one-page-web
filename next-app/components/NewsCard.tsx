import type { NewsItem } from "@/types/content";
import { formatThaiDate } from "@/lib/format";
import Link from "next/link";

type NewsCardProps = {
  item: NewsItem;
};

export function NewsCard({ item }: NewsCardProps) {
  const titleId = `${item.id}-title`;

  return (
    <article className={`news-card${item.featured ? " news-card--featured" : ""}`}>
      <p className="news-card__meta">
        <span className="news-card__category">{item.category}</span>
        <time dateTime={item.date}>{formatThaiDate(item.date)}</time>
      </p>
      <h3 id={titleId}>{item.title}</h3>
      <p>{item.summary}</p>
      <Link className="news-card__link" href={`/news/${item.slug}`} aria-labelledby={titleId}>
        อ่านต่อ <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
