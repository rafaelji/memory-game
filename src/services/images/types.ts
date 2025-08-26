type GameImage = { id: string; url: string; alt: string };
type PhotosResponse = {
  photos: Array<{
    id: number;
    alt: string;
    src: { medium?: string; small?: string; original?: string };
  }>;
};
type Args = { count: number; query?: string };

export type { GameImage, Args, PhotosResponse };
