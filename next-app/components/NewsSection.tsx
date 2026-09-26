import { isContentDataAccessError, listPublishedNews } from "@/lib/content-repository";
import { ContentUnavailable } from "./ContentUnavailable";
import { NewsSectionClient } from "./NewsSectionClient";

export async function NewsSection() {
  try {
    const items = await listPublishedNews();
    return <NewsSectionClient items={items} />;
  } catch (error) {
    if (isContentDataAccessError(error)) {
      return <ContentUnavailable headingLevel="h2" retryHref="/" sectionId="news" title="ไม่สามารถโหลดข่าวได้" />;
    }

    throw error;
  }
}
