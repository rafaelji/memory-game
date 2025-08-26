import logger from "@/services/logger";
import type { GameImage, Args, PhotosResponse } from "./types";
import { IMAGES_CACHE_KEY, PEXELS_API_URL } from "@/constants/images";

// Fetch images for the memory game. Uses Pexels only if VITE_PEXELS_KEY is present.
// If no key (or request fails), return `null` to signal "use emojis".

async function fetchGameImages({
  count,
  query = "animals",
}: Args): Promise<GameImage[] | null> {
  const key = import.meta.env.VITE_PEXELS_KEY as string | undefined;
  if (!key) return null; // no API key → use emojis

  // soft cache in sessionStorage to avoid repeated fetches on refresh
  const ck = IMAGES_CACHE_KEY(count, query);
  const cached = sessionStorage.getItem(ck);
  if (cached) {
    try {
      return JSON.parse(cached) as GameImage[];
    } catch {
      logger.error("[images/fetchGameImages]", "invalid cache");
    }
  }

  const url = new URL(PEXELS_API_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(count));

  try {
    const res = await fetch(url, { headers: { Authorization: key } });

    if (!res.ok) {
      throw new Error(`Pexels ${res.status}`);
    }

    const data = (await res.json()) as PhotosResponse;

    const images: GameImage[] = data.photos
      .slice(0, count)
      .map((p) => ({
        id: String(p.id),
        url: p.src.medium || p.src.small || p.src.original || "",
        alt: p.alt || "Photo",
      }))
      .filter((i) => !!i.url);

    sessionStorage.setItem(ck, JSON.stringify(images));
    return images;
  } catch {
    // network/API failure → fall back to emojis
    logger.error("[images/fetchGameImages]", "failed to fetch images");
    return null;
  }
}

export { fetchGameImages };
