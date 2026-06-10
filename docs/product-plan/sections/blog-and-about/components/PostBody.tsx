import type { PostBlock } from '../types'
import { coverStyle, hideBrokenImage, monoFont, sansFont } from './format'

interface PostBodyProps {
  blocks: PostBlock[]
}

/** Рендер тела поста — последовательность типизированных блоков в reading column. */
export function PostBody({ blocks }: PostBodyProps) {
  return (
    <div style={sansFont}>
      {blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </div>
  )
}

function BlockRenderer({ block }: { block: PostBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="mt-6 text-lg leading-relaxed text-stone-800">
          {block.text}
        </p>
      )
    case 'heading':
      return (
        <h2
          className="mt-14 mb-2 text-2xl font-medium text-stone-900 md:text-3xl"
          style={sansFont}
        >
          {block.text}
        </h2>
      )
    case 'quote':
      return (
        <blockquote className="my-10 rounded-r-lg border-l-2 border-[#FF7444] bg-[#FFF8DE] px-6 py-5 text-xl italic leading-relaxed text-stone-800">
          {block.text}
        </blockquote>
      )
    case 'image':
      return (
        <figure className="my-10">
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-lg bg-stone-200"
            style={coverStyle}
          >
            <img
              src={block.url}
              alt={block.caption ?? ''}
              onError={hideBrokenImage}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {block.caption && (
            <figcaption
              className="mt-3 text-xs uppercase tracking-wider text-stone-500"
              style={monoFont}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    default:
      return null
  }
}
