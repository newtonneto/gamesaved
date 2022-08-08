export interface Game {
  id: number;
  slug: string;
  name: string;
  description?: string;
  metacritic: number;
  metacritic_url?: string;
  released: string;
  background_image: string;
}
