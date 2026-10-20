// Тело публикации: абзацы, подзаголовки Spectral, цитата с изумрудной линией и кадры с подписью.
import { typo } from "../../lib/format";
import { T } from "../ui";
import type { PostBlock } from "./types";

export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className={`mt-5 ${T.body} text-black/80`}>
                {typo(block.text)}
              </p>
            );
          case "heading":
            return (
              <h2 key={i} className={`mt-12 ${T.h4}`}>
                {typo(block.text)}
              </h2>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-10 border-l-2 border-emerald pl-6 font-serif text-[24px] font-light italic leading-[135%] md:text-[clamp(26px,1.8vw,36px)] md:leading-[125%]"
              >
                {typo(block.text)}
              </blockquote>
            );
          case "image":
            return (
              <figure key={i} className="my-10">
                <div className="overflow-hidden bg-paper">
                  <img src={block.url} alt={block.caption ?? ""} loading="lazy" className="w-full object-cover" />
                </div>
                {block.caption && <figcaption className={`mt-3 ${T.label}`}>{typo(block.caption)}</figcaption>}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
