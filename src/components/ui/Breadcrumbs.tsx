// Хлебные крошки: мелкий uppercase, разделитель — тонкая косая. Последний пункт — текущая страница.
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Навигационная цепочка">
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[clamp(11px,0.6vw,14px)] uppercase leading-[150%] tracking-[0.14em] text-black/48">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2.5">
            {i > 0 && <span aria-hidden className="text-black/25">/</span>}
            {it.href ? (
              <a href={it.href} className="transition-colors hover:text-black">
                {it.label}
              </a>
            ) : (
              <span aria-current="page" className="text-black/75">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
