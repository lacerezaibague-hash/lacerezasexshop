import React, { useState, useEffect, useRef, useCallback } from 'react';

interface MiniGameProps {
  onClose: () => void;
}

const GAME_WIDTH = 500;
const GAME_HEIGHT = 700;
const BASKET_WIDTH = 80;
const ITEM_SIZE = 40;
const GAME_DURATION = 30; // in seconds

const FALLING_EMOJIS = ['💋', '🎀', '💍', '💧', '✨', '❤️', '🍓', '🍑'];

interface FallingItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  speed: number;
}

const MiniGame: React.FC<MiniGameProps> = ({ onClose }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [basketX, setBasketX] = useState(GAME_WIDTH / 2);
  const basketXRef = useRef(GAME_WIDTH / 2);
  const [items, setItems] = useState<FallingItem[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  // FIX: Initialize useRef with an initial value of `undefined` and update the type accordingly.
  // The `useRef<T>()` call was missing the required `initialValue` argument.
  const gameLoopRef = useRef<number | undefined>(undefined);
  const timerRef = useRef<number | undefined>(undefined);
  const itemCounterRef = useRef(0);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    setGameState('playing');
  };

  const moveBasket = useCallback((e: MouseEvent | TouchEvent) => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      let newX = clientX - rect.left;
      
      if (newX < BASKET_WIDTH / 2) newX = BASKET_WIDTH / 2;
      if (newX > GAME_WIDTH - BASKET_WIDTH / 2) newX = GAME_WIDTH - BASKET_WIDTH / 2;
      
      setBasketX(newX);
      basketXRef.current = newX;
    }
  }, []);

  useEffect(() => {
    // FIX: Define explicit handlers for mouse and touch events to avoid type ambiguity with `addEventListener`.
    // The `moveBasket` function accepts a union type, which can cause issues with TypeScript's overload resolution.
    // These wrappers ensure the correct event type is passed.
    const handleMouseMove = (e: MouseEvent) => moveBasket(e);
    const handleTouchMove = (e: TouchEvent) => moveBasket(e);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [moveBasket]);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState('gameOver');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      gameLoopRef.current = window.setInterval(() => {
        setItems(prevItems => {
          const updatedItems = prevItems.map(item => ({
            ...item,
            y: item.y + item.speed,
          })).filter(item => item.y < GAME_HEIGHT);

          const basketY = GAME_HEIGHT - 50;
          const caughtItems = new Set<number>();
          const currentBasketX = basketXRef.current;
          
          updatedItems.forEach(item => {
            if (
              item.y > basketY &&
              item.y < basketY + ITEM_SIZE &&
              item.x > currentBasketX - BASKET_WIDTH / 2 &&
              item.x < currentBasketX + BASKET_WIDTH / 2
            ) {
              caughtItems.add(item.id);
            }
          });

          if (caughtItems.size > 0) {
              setScore(prevScore => prevScore + caughtItems.size * 10);
              return updatedItems.filter(item => !caughtItems.has(item.id));
          }
          
          return updatedItems;
        });

        if (Math.random() < 0.1) {
          setItems(prev => [...prev, {
            id: itemCounterRef.current++,
            x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
            y: -ITEM_SIZE,
            emoji: FALLING_EMOJIS[Math.floor(Math.random() * FALLING_EMOJIS.length)],
            speed: 2 + Math.random() * 3,
          }]);
        }
      }, 1000 / 60);
    }

    return () => {
      clearInterval(timerRef.current);
      clearInterval(gameLoopRef.current);
    };
  }, [gameState]);

  const renderContent = () => {
    switch(gameState) {
      case 'idle':
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Catch The Fun!</h2>
            <p className="text-gray-300 mb-8">Move your mouse or finger to catch the falling items.</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 rounded-lg font-bold text-xl hover:scale-110 transition shadow-lg"
            >
              Start Game
            </button>
          </div>
        );
      case 'gameOver':
        return (
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-4 text-white">Game Over</h2>
            <p className="text-2xl mb-8 text-amber-400">Your Score: {score}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:scale-110 transition"
              >
                Play Again
              </button>
              <button
                onClick={onClose}
                className="bg-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        );
      case 'playing':
        return (
          <>
            {items.map(item => (
              <div
                key={item.id}
                className="absolute text-4xl"
                style={{
                  left: item.x,
                  top: item.y,
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                }}
              >
                {item.emoji}
              </div>
            ))}
            <div
              className="absolute text-6xl"
              style={{
                left: basketX,
                bottom: 20,
                width: BASKET_WIDTH,
                transform: 'translateX(-50%)',
                textAlign: 'center',
              }}
            >
              🛍️
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-gray-900 via-black to-purple-900/50 rounded-2xl shadow-2xl border-2 border-amber-500/50 p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center text-xl font-bold mb-2 px-4 py-2 bg-black/30 rounded-t-lg">
          <div className="text-amber-400">Score: {score}</div>
          <div className="text-white">Time: {timeLeft}</div>
        </div>
        <div
          ref={gameAreaRef}
          className="relative rounded-b-lg overflow-hidden bg-black/20"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame;