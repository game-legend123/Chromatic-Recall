import type { MazeCell, ParsedMaze } from '@/types';

export function parseMazeData(data: string): ParsedMaze {
  const [layoutStr, colorsStr] = data.split('Colors:');
  const lines = layoutStr.trim().split('\n').filter(line => line.trim() !== '');

  let startPos = { x: -1, y: -1 };
  let endPos = { x: -1, y: -1 };
  const pathNodes: { x: number; y: number; num: number }[] = [];

  const grid = lines.map((line, y) => {
    return line.trim().split('').map((char, x) => {
      const cell: MazeCell = {
        char,
        x,
        y,
        isWall: char === '#',
        isStart: char === 'S',
        isEnd: char === 'E',
        isPath: !'# '.includes(char),
        pathNumber: null,
      };

      if (cell.isStart) startPos = { x, y };
      if (cell.isEnd) endPos = { x, y };
      if (!isNaN(parseInt(char))) {
        cell.pathNumber = parseInt(char);
        pathNodes.push({ x, y, num: cell.pathNumber });
      }
      return cell;
    });
  });

  const colors: Record<number, string> = {};
  if (colorsStr) {
    colorsStr.trim().split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length === 2) {
        const num = parseInt(parts[0].trim());
        if (!isNaN(num)) {
          colors[num] = parts[1].trim();
        }
      }
    });
  }
  
  // Create the ordered path sequence
  pathNodes.sort((a, b) => a.num - b.num);
  const pathSequence = pathNodes.map(node => node.num);

  return { grid, pathSequence, colors, startPos, endPos };
}
