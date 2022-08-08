import { Game } from './game.dto';

export interface GamesPage {
  count: number;
  next: string;
  previous: string;
  results: Game[];
}
