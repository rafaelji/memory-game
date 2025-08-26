import { fetchGameImages } from "@/services/images";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** Detect if VITE_PEXELS_KEY is present in the test environment */
function hasPexelsKey(): boolean {
  const env =
    (import.meta as unknown as { env?: Record<string, unknown> }).env ?? {};
  const v = env.VITE_PEXELS_KEY;
  return typeof v === "string" && v.length > 0;
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

/* ---------------------- Scenario: NO KEY ---------------------- */
/* Only run this block if the key is NOT present at build/test time */
(!hasPexelsKey() ? describe : describe.skip)(
  "fetchGameImages (without key)",
  () => {
    it("returns null and does not call fetch", async () => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockImplementation(() =>
          Promise.reject(new Error("fetch should not be called")),
        );

      const out = await fetchGameImages({ count: 4, query: "animals" });
      expect(out).toBeNull();
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  },
);

/* ---------------------- Scenario: WITH KEY ---------------------- */
/* Only run this block if the key IS present at build/test time */
(hasPexelsKey() ? describe : describe.skip)(
  "fetchGameImages (with key)",
  () => {
    it("normalizes response and uses session cache on subsequent calls", async () => {
      // Provide a deterministic mock response
      const mockJson = {
        photos: [
          { id: 1, alt: "A", src: { medium: "m1.jpg" } },
          { id: 2, alt: "B", src: { small: "s2.jpg" } },
          { id: 3, alt: "C", src: { original: "o3.jpg" } },
          { id: 4, alt: "D", src: { medium: "m4.jpg" } },
        ],
      };

      // Use a real Response to keep the code path close to production
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify(mockJson), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

      const first = await fetchGameImages({ count: 4, query: "animals" });
      expect(first).toHaveLength(4);
      expect(first?.[0]).toEqual({ id: "1", url: "m1.jpg", alt: "A" });

      // Same inputs → should use sessionStorage cache (no extra fetch)
      const second = await fetchGameImages({ count: 4, query: "animals" });
      expect(second).toEqual(first);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  },
);
