// Портрет гемолога. Пока снимка нет — инициалы Spectral на тёплом листе.
interface Props {
  url: string | null;
  name: string;
  className?: string;
  /** Кегль инициалов: крупно на странице гемолога, мелко в подписи. */
  initialsClass?: string;
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

export function Portrait({ url, name, className = "", initialsClass = "text-[20px] leading-[100%]" }: Props) {
  return (
    <div className={`overflow-hidden bg-paper ${className}`}>
      {url ? (
        <img src={url} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div role="img" aria-label={name} className="flex h-full w-full items-center justify-center">
          <span className={`font-serif font-light tracking-[0.04em] text-black/40 ${initialsClass}`}>{initials(name)}</span>
        </div>
      )}
    </div>
  );
}
