import type { HeroContent } from "@/types/content";

type HeroProps = {
  content: HeroContent;
};

export function Hero({ content }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="page-title">
      <div className="container hero-content">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1 id="page-title">{content.title.split("\n").map((line, index) => (
          <span key={line}>{index > 0 && <br />}{line}</span>
        ))}</h1>
        <p className="hero-description">
          {content.description}<br />
          <strong>{content.notice}</strong>
        </p>
        <a className="button button-primary" href={content.callToAction.href}>{content.callToAction.label}</a>
      </div>
    </section>
  );
}
