export interface Game {
  id: number;
  slug: string;
  name: string;
  description?: string;
  metacritic: number;
  metacritic_url?: string;
  released: Date;
  background_image: string;
}
