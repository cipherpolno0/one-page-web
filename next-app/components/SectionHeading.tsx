import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  headingLevel?: "h1" | "h2";
  id: string;
  title: string;
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, headingLevel = "h2", id, title, children }: SectionHeadingProps) {
  const Heading = headingLevel;

  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <Heading id={id}>{title}</Heading>
      </div>
      {children}
    </div>
  );
}
