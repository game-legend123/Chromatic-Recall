"use client";

import React, { useEffect, useRef } from 'react';
import Cube from './cube';
import type { GameState, MazeCell, PlayerPosition } from '@/types';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  grid: (MazeCell & { color: string })[][];
  onMove: (newPos: PlayerPosition) => void;
  gameState: GameState;
  isWrongMove: boolean;
  playerPath: PlayerPosition[];
}

const GameBoard: React.FC<GameBoardProps> = ({ grid, onMove, gameState, isWrongMove, playerPath }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameState === 'movement' && containerRef.current) {
      containerRef.current.focus();
    }
  }, [gameState]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (gameState !== 'movement') return;

    const lastPos = playerPath[playerPath.length - 1];
    if (!lastPos) return;

    let newPos: PlayerPosition | null = null;
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        newPos = { ...lastPos, y: lastPos.y - 1 };
        break;
      case 's':
      case 'ArrowDown':
        newPos = { ...lastPos, y: lastPos.y + 1 };
        break;
      case 'a':
      case 'ArrowLeft':
        newPos = { ...lastPos, x: lastPos.x - 1 };
        break;
      case 'd':
      case 'ArrowRight':
        newPos = { ...lastPos, x: lastPos.x + 1 };
        break;
    }

    if (newPos && newPos.y >= 0 && newPos.y < grid.length && newPos.x >= 0 && newPos.x < grid[0].length) {
       e.preventDefault();
       onMove(newPos);
    }
  };
  
  const handleCubeClick = (x: number, y: number) => {
    if (gameState !== 'movement') return;
    const lastPos = playerPath[playerPath.length - 1];
    if (!lastPos) return;

    // Allow clicking only adjacent cells
    if(Math.abs(x - lastPos.x) + Math.abs(y - lastPos.y) === 1) {
        onMove({ x, y });
    }
  }

  const isPlayerOnPath = (x: number, y: number) => {
      return playerPath.some(p => p.x === x && p.y === y);
  }

  const lastPos = playerPath[playerPath.length - 1];

  return (
    <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center outline-none [transform-style:preserve-3d]"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{ perspective: '1000px' }}
    >
      <div 
        className={cn(
            "grid gap-1 transition-transform duration-500 [transform-style:preserve-3d]",
            isWrongMove && "animate-shake"
        )}
        style={{ 
            gridTemplateColumns: `repeat(${grid[0]?.length || 10}, 1fr)`,
            transform: 'rotateX(60deg) rotateZ(0deg) '
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <Cube
              key={`${x}-${y}`}
              cell={cell}
              onClick={() => handleCubeClick(x, y)}
              gameState={gameState}
              isPlayerOnPath={isPlayerOnPath(x, y)}
              isCurrentPlayerPos={lastPos?.x === x && lastPos?.y === y}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
