import type { Author } from './types'
import { hideBrokenImage, monoFont, portraitStyle, sansFont } from './format'

interface AuthorBylineProps {
  author: Author
  onViewAbout?: () => void
}

/** Подпись автора в конце поста: мини-портрет + имя + роль + ссылка «О гемологе →». */
export function AuthorByline({ author, onViewAbout }: AuthorBylineProps) {
  return (
    <div className="mt-16 flex items-center gap-5 border-t border-stone-200 pt-10">
      <div
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-stone-200"
        style={portraitStyle}
      >
        <img
          src={author.portraitUrl}
          alt={author.name}
          onError={hideBrokenImage}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div>
        <p
          className="text-base font-medium text-stone-900"
          style={sansFont}
        >
          {author.name}
        </p>
        <p className="mt-0.5 text-sm text-stone-600" style={sansFont}>
          {author.role}
        </p>
        <button
          type="button"
          onClick={onViewAbout}
          className="mt-2 inline-block text-xs uppercase tracking-wider text-[#576A8F] transition-colors hover:text-[#FF7444] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#576A8F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          style={monoFont}
        >
          О гемологе →
        </button>
      </div>
    </div>
  )
}
