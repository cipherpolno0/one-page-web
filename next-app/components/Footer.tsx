type FooterProps = {
  organizationName: string;
  year: number;
};

export function Footer({ organizationName, year }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {year} {organizationName}</p>
        <a href="#page-top">กลับสู่ด้านบน <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
