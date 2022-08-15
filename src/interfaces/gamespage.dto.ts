import { Game } from '@interfaces/game.dto';

export interface GamesPage {
  count: number;
  next: string;
  previous: string;
  results: Game[];
}
