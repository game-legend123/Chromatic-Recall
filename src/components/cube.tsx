"use client";

import React from 'react';
import type { GameState, MazeCell } from '@/types';
import { cn } from '@/lib/utils';
import { Sparkles, Footprints } from 'lucide-react';

interface CubeProps {
  cell: MazeCell & { color: string };
  onClick: () => void;
  gameState: GameState;
  isPlayerOnPath: boolean;
  isCurrentPlayerPos: boolean;
}

const Cube: React.FC<CubeProps> = ({ cell, onClick, gameState, isPlayerOnPath, isCurrentPlayerPos }) => {
  const isObservationPhase = gameState === 'observation';
  const isMovementPhase = gameState === 'movement' || gameState === 'failed' || gameState === 'completed';

  const cubeStyles = {
    '--cube-color': cell.color,
    '--shadow-color': 'rgba(0,0,0,0.4)',
    '--cube-height': cell.isWall ? '2rem' : '0.5rem',
  } as React.CSSProperties;

  return (
    <button
      onClick={onClick}
      disabled={gameState !== 'movement'}
      className="relative aspect-square w-full h-full cursor-pointer [transform-style:preserve-3d] transition-transform duration-200 hover:translate-z-1 focus:translate-z-1 outline-none"
      style={cubeStyles}
      aria-label={`Maze cell at row ${cell.y} column ${cell.x}`}
    >
      <div
        className={cn(
          "absolute inset-0 [transform-style:preserve-3d] transition-all duration-500",
          "before:absolute before:inset-0 before:bg-[var(--cube-color)] before:[transform:translateZ(var(--cube-height))] before:shadow-[0_0_25px_5px_var(--shadow-color)]",
          "after:absolute after:inset-0 after:bg-black/40 after:[transform:rotateX(-90deg)_translateZ(calc(var(--cube-height)_/_2))] after:[transform-origin:top] after:content-['']",
          cell.isWall ? "translate-z-[calc(var(--cube-height)/2)]" : "translate-z-0"
        )}
        style={{
            '--shadow-color': isObservationPhase && cell.isPath ? cell.color : 'transparent',
        }}
      >
        {isMovementPhase && isPlayerOnPath && !cell.isWall && (
             <div className="absolute inset-0 flex items-center justify-center [transform:translateZ(calc(var(--cube-height)+1px))] text-white/70">
                {isCurrentPlayerPos ? <Footprints className="w-2/3 h-2/3 animate-pulse" /> : <div className="w-1/4 h-1/4 rounded-full bg-white/50" />}
            </div>
        )}
        {cell.isStart && (
             <div className="absolute inset-0 flex items-center justify-center [transform:translateZ(calc(var(--cube-height)+1px))] text-white">S</div>
        )}
        {cell.isEnd && (
            <div className="absolute inset-0 flex items-center justify-center [transform:translateZ(calc(var(--cube-height)+1px))]">
                <Sparkles className={cn("w-2/3 h-2/3 text-yellow-300", (gameState === 'completed' || isCurrentPlayerPos) && "animate-pulse" )}/>
            </div>
        )}
      </div>
    </button>
  );
};

export default React.memo(Cube);
