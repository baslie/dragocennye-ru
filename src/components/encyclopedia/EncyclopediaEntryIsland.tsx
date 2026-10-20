// Остров статьи: интерактив нужен только оглавлению со scroll-spy.
import { EncyclopediaEntry } from "./EncyclopediaEntry";
import type { EncyclopediaEntryProps } from "./types";

export function EncyclopediaEntryIsland(props: EncyclopediaEntryProps) {
  return <EncyclopediaEntry {...props} />;
}
