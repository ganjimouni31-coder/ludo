import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    // Prevent default scrolling for arrow keys and space
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
        break;
      case ' ':
        setIsPaused(p => !p);
        break;
    }
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, food, score]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900/80 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-sm">
      <div className="flex justify-between w-full max-w-md mb-6 px-4">
        <div className="flex flex-col">
          <span className="text-cyan-400 text-xs uppercase tracking-widest font-bold">Score</span>
          <span className="text-3xl font-mono text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-pink-400 text-xs uppercase tracking-widest font-bold">High Score</span>
          <span className="text-3xl font-mono text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{highScore}</span>
        </div>
      </div>

      <div 
        className="relative bg-black/50 border-2 border-cyan-500/50 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        style={{
          width: GRID_SIZE * 20,
          height: GRID_SIZE * 20,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute rounded-sm ${index === 0 ? 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)] z-10' : 'bg-cyan-500/80 shadow-[0_0_5px_rgba(6,182,212,0.5)]'}`}
            style={{
              width: 18,
              height: 18,
              left: segment.x * 20 + 1,
              top: segment.y * 20 + 1,
            }}
          />
        ))}
        <div
          className="absolute bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.9)] animate-pulse"
          style={{
            width: 16,
            height: 16,
            left: food.x * 20 + 2,
            top: food.y * 20 + 2,
          }}
        />

        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-black text-pink-500 mb-2 tracking-wider drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">GAME OVER</h2>
                <p className="text-cyan-300 mb-6 font-mono">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400 text-cyan-300 rounded-full transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:scale-105"
                >
                  <RotateCcw size={20} />
                  <span className="font-bold tracking-wider">RESTART</span>
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black text-cyan-400 mb-6 tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">READY?</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-2 px-8 py-4 bg-pink-500/20 hover:bg-pink-500/40 border border-pink-400 text-pink-300 rounded-full transition-all hover:shadow-[0_0_20px_rgba(244,114,182,0.5)] hover:scale-105"
                >
                  <Play size={24} fill="currentColor" />
                  <span className="font-bold tracking-wider text-lg">PLAY</span>
                </button>
                <p className="text-gray-400 mt-6 text-sm font-mono">Use Arrow Keys or WASD to move</p>
                <p className="text-gray-500 mt-2 text-xs font-mono">Space to pause</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
