"use client";

import { useEffect, useState } from "react";
import type { NavigationItem, SiteBrand } from "@/types/content";

type HeaderProps = {
  brand: SiteBrand;
  navigationItems: NavigationItem[];
};

export function Header({ brand, navigationItems }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia("(min-width: 48rem)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    desktopMediaQuery.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      desktopMediaQuery.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="site-header" id="page-top">
      <div className="container site-header__content">
        <a className="site-brand" href="/" aria-label={`${brand.name} หน้าแรก`}>
          <span className="site-brand__mark" aria-hidden="true">{brand.mark}</span>
          <span>
            <strong>{brand.name}</strong>
            <small>{brand.tagline}</small>
          </span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-menu"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span className="menu-icon" aria-hidden="true" />
          <span>เมนู</span>
        </button>

        <nav className={`primary-nav${isMenuOpen ? " is-open" : ""}`} id="primary-menu" aria-label="เมนูหลัก">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setIsMenuOpen(false)}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
