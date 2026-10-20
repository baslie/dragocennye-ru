// Оболочка сайта: шапка, подвал и модалка поиска. Остров, потому что поиск открывается по клику.
import { useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { withBase } from "../../lib/format";
import { SearchModal, type SearchItem } from "../search/SearchModal";
import { HAIRLINE } from "../ui";

interface SiteShellProps {
  currentPath: string;
  searchItems: SearchItem[];
  telegramHref: string;
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  isActive: boolean;
}

function buildNav(path: string): NavItem[] {
  return [
    { label: "Каталог", href: withBase("/"), isActive: path === "/" || path.startsWith("/catalog") || path.startsWith("/stones") },
    { label: "Энциклопедия", href: withBase("/encyclopedia"), isActive: path.startsWith("/encyclopedia") },
    { label: "Журнал", href: withBase("/blog"), isActive: path.startsWith("/blog") },
    { label: "О гемологе", href: withBase("/about"), isActive: path.startsWith("/about") },
  ];
}

export function SiteShell({ currentPath, searchItems, telegramHref, children }: SiteShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const nav = buildNav(currentPath);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className={`border-b ${HAIRLINE}`}>
        <div className="grid h-[60px] grid-cols-[1fr_auto_1fr] items-center px-[var(--gutter)] min-[1920px]:h-16">
          <nav aria-label="Разделы" className="hidden gap-7 whitespace-nowrap text-[clamp(13px,0.7vw,15px)] leading-[150%] text-black/60 lg:flex">
            {nav.map((it) => (
              <a
                key={it.href}
                href={it.href}
                aria-current={it.isActive ? "page" : undefined}
                className={it.isActive ? "text-black" : "transition-colors hover:text-black"}
              >
                {it.label}
              </a>
            ))}
          </nav>
          <a
            href={withBase("/")}
            className="col-start-1 justify-self-start font-serif text-[clamp(17px,1.05vw,21px)] uppercase leading-[120%] tracking-[0.32em] lg:col-start-2 lg:justify-self-center"
          >
            Драгоценные
          </a>
          <div className="col-start-3 flex items-center justify-end gap-6 text-[clamp(13px,0.7vw,15px)] leading-[150%]">
            <button
              type="button"
              aria-label="Поиск"
              onClick={() => setSearchOpen(true)}
              className="text-black/60 transition-colors hover:text-black"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>
            <a href={telegramHref} className="hidden border-b border-ink pb-0.5 sm:inline">
              Написать гемологу
            </a>
          </div>
        </div>
        <nav
          aria-label="Разделы"
          className="flex gap-6 overflow-x-auto whitespace-nowrap border-t border-black/[0.05] px-[var(--gutter)] py-2.5 text-[13px] leading-[150%] text-black/60 [scrollbar-width:none] lg:hidden"
        >
          {nav.map((it) => (
            <a key={it.href} href={it.href} aria-current={it.isActive ? "page" : undefined} className={it.isActive ? "text-black" : undefined}>
              {it.label}
            </a>
          ))}
          {/* С 640px эта ссылка уже есть справа в шапке. */}
          <a href={telegramHref} className="text-black sm:hidden">
            Написать гемологу
          </a>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className={`border-t ${HAIRLINE}`}>
        <div className="flex flex-col gap-6 px-[var(--gutter)] py-12 text-[clamp(13px,0.72vw,18px)] leading-[150%] text-black/48 md:flex-row md:items-center md:justify-between">
          <a href={withBase("/")} className="font-serif text-[18px] uppercase leading-[120%] tracking-[0.32em] text-black">
            Драгоценные
          </a>
          <nav aria-label="Разделы в подвале" className="flex flex-wrap gap-x-8 gap-y-2">
            {nav.map((it) => (
              <a key={it.href} href={it.href} className="transition-colors hover:text-black">
                {it.label}
              </a>
            ))}
            <a href={telegramHref} className="transition-colors hover:text-black">
              Telegram
            </a>
          </nav>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} items={searchItems} />
    </div>
  );
}
