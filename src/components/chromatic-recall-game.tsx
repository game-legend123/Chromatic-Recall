"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { generateMazeLevel } from '@/ai/flows/generate-maze-level';
import { parseMazeData, type ParsedMaze } from '@/lib/maze-parser';
import { mapColorNameToHex, dimColor, getNoiseColor } from '@/lib/color-utils';
import GameBoard from '@/components/game-board';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, BrainCircuit, Play, Repeat, Award, Loader2 } from 'lucide-react';
import type { GameState, MazeCell, PlayerPosition } from '@/types';
import { useToast } from '@/hooks/use-toast';

const OBSERVATION_TIME = 3000; // 3 seconds
const FAIL_RESET_TIME = 1500; // 1.5 seconds

export default function ChromaticRecallGame() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [mazeData, setMazeData] = useState<ParsedMaze | null>(null);
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition | null>(null);
  const [playerPath, setPlayerPath] = useState<PlayerPosition[]>([]);
  const [isWrongMove, setIsWrongMove] = useState(false);
  const { toast } = useToast();

  const handleStartLevel = useCallback(async (newLevel: number) => {
    setGameState('generating');
    setMazeData(null);
    setPlayerPath([]);
    setIsWrongMove(false);

    try {
      const mazeComplexity = Math.min(1 + newLevel, 10);
      const colorPaletteSimilarity = Math.min(0.1 + newLevel * 0.05, 0.8);
      const pathLength = Math.min(5 + newLevel, 25);
      
      const result = await generateMazeLevel({ mazeComplexity, colorPaletteSimilarity, pathLength });
      const parsed = parseMazeData(result.mazeData);

      setMazeData(parsed);
      setPlayerPosition(parsed.startPos);
      setPlayerPath([parsed.startPos]);
      setGameState('observation');
    } catch (error) {
      console.error("Failed to generate maze:", error);
      toast({
        title: "Error",
        description: "Could not generate the next level. Please try again.",
        variant: "destructive",
      });
      setGameState('idle');
    }
  }, [toast]);

  useEffect(() => {
    if (gameState === 'observation') {
      const timer = setTimeout(() => {
        setGameState('movement');
      }, OBSERVATION_TIME);
      return () => clearTimeout(timer);
    }
  }, [gameState]);
  
  const handlePlayerMove = useCallback((newPos: PlayerPosition) => {
    if (gameState !== 'movement' || !mazeData || !playerPosition) return;

    const cell = mazeData.grid[newPos.y][newPos.x];
    if (cell.isWall) return;

    const nextPathIndex = playerPath.length;
    const expectedPathNumber = mazeData.pathSequence[nextPathIndex];

    if (cell.pathNumber === expectedPathNumber) {
      const newPlayerPath = [...playerPath, newPos];
      setPlayerPath(newPlayerPath);
      setPlayerPosition(newPos);

      if (cell.isEnd) {
        setGameState('completed');
        setScore(prev => prev + 10 * level);
      }
    } else {
      setIsWrongMove(true);
      setGameState('failed');
      toast({
        title: "Wrong Step!",
        description: "The memory fades... returning to the start.",
        variant: "destructive"
      });
      setTimeout(() => {
        setPlayerPosition(mazeData.startPos);
        setPlayerPath([mazeData.startPos]);
        setGameState('movement');
        setIsWrongMove(false);
      }, FAIL_RESET_TIME);
    }
  }, [gameState, mazeData, playerPath, playerPosition, level, toast]);

  const gridWithColors = useMemo(() => {
    if (!mazeData) return [];

    const highDifficulty = level > 6;

    return mazeData.grid.map(row => 
      row.map(cell => {
        let colorHex = '#4A5568'; // Default wall/floor color
        if (cell.isPath && cell.pathNumber) {
          const colorName = mazeData.colors[cell.pathNumber];
          colorHex = mapColorNameToHex(colorName, cell.pathNumber);
        }

        let displayColor = colorHex;
        if (gameState === 'movement' || gameState === 'failed') {
          if (cell.isPath) {
            displayColor = dimColor(colorHex);
          } else if(highDifficulty && !cell.isWall) {
             displayColor = getNoiseColor(dimColor(colorHex));
          } else {
            displayColor = '#3A435E'; // Dimmed floor
          }
        }
        
        return {
          ...cell,
          color: displayColor,
        };
      })
    );
  }, [mazeData, gameState, level]);

  const StatusDisplay = () => {
    switch (gameState) {
      case 'generating':
        return <p className="text-lg text-accent animate-pulse flex items-center gap-2"><Loader2 className="animate-spin" /> Generating Neurospace...</p>;
      case 'observation':
        return <p className="text-lg text-accent animate-pulse">Memorize the sequence...</p>;
      case 'movement':
        return <p className="text-lg text-primary">Your turn. Recreate the path.</p>;
      case 'failed':
        return <p className="text-lg text-destructive">Path incorrect. Resetting...</p>;
      case 'completed':
        return <p className="text-lg text-green-400">Memory restored! Well done.</p>;
      default:
        return <p className="text-lg text-muted-foreground">Press Start to enter the maze.</p>;
    }
  };

  const GameControls = () => {
     if (gameState === 'idle' || gameState === 'completed') {
        return (
             <Button size="lg" onClick={() => handleStartLevel(gameState === 'completed' ? level + 1 : level)} className="mt-6 font-bold text-xl py-8 px-10 shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
                {gameState === 'idle' && <><Play className="mr-2"/> Start Game</>}
                {gameState === 'completed' && <><Play className="mr-2"/> Next Level ({level + 1})</>}
            </Button>
        )
     }
     return (
        <Button size="lg" onClick={() => handleStartLevel(level)} className="mt-6" variant="outline">
            <Repeat className="mr-2"/> Restart Level
        </Button>
     )
  }

  return (
    <Card className="w-full max-w-4xl bg-card/50 backdrop-blur-sm border-primary/20 shadow-2xl shadow-primary/10">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          <BrainCircuit size={48} /> Chromatic Recall
        </CardTitle>
        <div className="flex justify-center gap-8 mt-4 text-lg">
          <span className="flex items-center gap-2"><Zap size={20} className="text-yellow-400"/> Level: {level}</span>
          <span className="flex items-center gap-2"><Award size={20} className="text-green-400"/> Score: {score}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-2 sm:p-6">
        <div className="h-12 flex items-center justify-center">
          <StatusDisplay />
        </div>
        
        <div className="w-full aspect-square max-w-lg p-4 my-4">
            {gridWithColors.length > 0 && playerPosition ? (
                 <GameBoard 
                    grid={gridWithColors} 
                    onMove={handlePlayerMove} 
                    gameState={gameState}
                    isWrongMove={isWrongMove}
                    playerPath={playerPath}
                 />
            ): (
                <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-lg">
                    {gameState !== 'generating' && <p className="text-muted-foreground">Awaiting maze generation...</p>}
                </div>
            )}
        </div>
        
        <GameControls />
      </CardContent>
    </Card>
  );
}
