import { Liveblocks } from "@liveblocks/node";
import { cache } from "react";

export const getLiveblocks = cache(
  () => new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! })
);

const CURSOR_COLORS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#7986CB",
  "#64B5F6",
  "#4FC3F7",
  "#4DB6AC",
  "#81C784",
  "#FFD54F",
  "#FF8A65",
];

export function getCursorColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}
