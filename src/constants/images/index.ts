const IMAGES_CACHE_KEY = (count: number, query: string) =>
  `imgcache:v1:${count}:${query.toLowerCase()}`;

const PEXELS_API_URL = "https://api.pexels.com/v1/search";

export { IMAGES_CACHE_KEY, PEXELS_API_URL };
