export type GameState = 'idle' | 'generating' | 'observation' | 'movement' | 'failed' | 'completed';

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface MazeCell {
  char: string;
  x: number;
  y: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPath: boolean;
  pathNumber: number | null;
}

export type MazeGrid = MazeCell[][];

export interface ParsedMaze {
  grid: MazeGrid;
  pathSequence: number[];
  colors: Record<number, string>;
  startPos: PlayerPosition;
  endPos: PlayerPosition;
}
