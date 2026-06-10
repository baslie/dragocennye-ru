import { useState, type ReactNode } from "react";
import { AppShell } from "./AppShell";
import type { NavItem } from "./MainNav";
import { SearchModal, type SearchItem } from "../search/SearchModal";

interface SiteShellProps {
  currentPath: string;
  searchItems: SearchItem[];
  children: ReactNode;
}

function buildNav(path: string): NavItem[] {
  const inCatalog = path === "/" || path.startsWith("/catalog") || path.startsWith("/stones");
  const inJournal = path.startsWith("/encyclopedia") || path.startsWith("/blog");
  const inAbout = path.startsWith("/about");
  return [
    { label: "Каталог", href: "/", isActive: inCatalog },
    {
      label: "Журнал",
      href: "/journal",
      isActive: inJournal,
      children: [
        { label: "Энциклопедия", href: "/encyclopedia" },
        { label: "Блог", href: "/blog" },
      ],
    },
    { label: "О гемологе", href: "/about", isActive: inAbout },
  ];
}

export function SiteShell({ currentPath, searchItems, children }: SiteShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavigate = (href: string) => {
    if (href === "/journal") return; // только дропдаун, без перехода
    window.location.href = href;
  };

  return (
    <>
      <AppShell
        navigationItems={buildNav(currentPath)}
        onNavigate={handleNavigate}
        onSearch={() => setSearchOpen(true)}
      >
        {children}
      </AppShell>
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        items={searchItems}
      />
    </>
  );
}
