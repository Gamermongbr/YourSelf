import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Target, Trophy, Crosshair, AlertCircle, RotateCcw } from 'lucide-react';

const TOTAL_TARGETS = 20;

export function SpatialMatrix({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'playing' | 'result'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [bestAvg, setBestAvg] = useState<number | null>(() => {
    const saved = localStorage.getItem('nxa_best_spatial');
    return saved ? parseInt(saved, 10) : null;
  });

  useEffect(() => {
    if (bestAvg !== null) {
      localStorage.setItem('nxa_best_spatial', bestAvg.toString());
    }
  }, [bestAvg]);

  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    setGameState('countdown');
    setCountdown(3);
    setScore(0);
    setMisses(0);
    setLatencies([]);
    setActiveTile(null);
  };

  // Countdown logic
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 800);
        return () => clearTimeout(timer);
      } else {
        setGameState('playing');
        spawnTarget(-1);
      }
    }
  }, [gameState, countdown]);

  // When game ends, calculate result against best
  useEffect(() => {
    if (gameState === 'result') {
      const avg = getAverageLatency();
      if (bestAvg === null || avg < bestAvg) {
        setBestAvg(avg);
      }
    }
  }, [gameState]);

  const spawnTarget = (prevTile: number) => {
    let nextTile = Math.floor(Math.random() * 9);
    while (nextTile === prevTile) {
      nextTile = Math.floor(Math.random() * 9);
    }
    setActiveTile(nextTile);
    startTimeRef.current = performance.now();
  };

  const handleTileDown = (e: React.PointerEvent, index: number) => {
    e.preventDefault(); // Prevent scroll/zoom

    if (gameState !== 'playing') return;

    if (index === activeTile) {
      // Hit
      const latency = performance.now() - startTimeRef.current;
      setLatencies(prev => [...prev, latency]);
      
      const newScore = score + 1;
      if (newScore >= TOTAL_TARGETS) {
        setGameState('result');
        setActiveTile(null);
      } else {
        setScore(newScore);
        spawnTarget(activeTile);
      }
    } else {
      // Miss
      setMisses(m => m + 1);
    }
  };

  const getAverageLatency = () => {
    if (latencies.length === 0) return 0;
    const total = latencies.reduce((a, b) => a + b, 0);
    return Math.round(total / latencies.length);
  };

  const getRankData = (avg: number) => {
    if (avg < 280) return { title: 'Predator', color: 'text-violet-400', desc: 'Apex peripheral response' };
    if (avg < 350) return { title: 'Elite', color: 'text-indigo-400', desc: 'Highly tuned spatial mapping' };
    if (avg < 450) return { title: 'Competitor', color: 'text-emerald-400', desc: 'Above average tracking' };
    if (avg < 600) return { title: 'Average', color: 'text-amber-400', desc: 'Typical baseline latencies' };
    return { title: 'Novice', color: 'text-rose-400', desc: 'Requires neural adaptation' };
  };

  return (
    <motion.div
      key="matrix"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden font-sans relative select-none touch-none flex flex-col"
    >
      {/* Background glow specific to Matrix */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 flex justify-between items-start relative z-50">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <AnimatePresence>
          {bestAvg !== null && gameState === 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-xl"
            >
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Best Avg</div>
                <div className="text-white font-black text-sm">{bestAvg} <span className="text-white/40 text-[10px]">ms</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-lg mx-auto relative z-10">
        
        <AnimatePresence mode="wait">
          {/* IDLE STATE */}
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full"
            >
              <div className="w-24 h-24 rounded-[2.5rem] bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative group cursor-pointer" onClick={startGame}>
                <div className="absolute inset-0 bg-violet-400/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Target className="w-10 h-10 text-violet-400" />
              </div>
              <h1 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-md text-center">Spatial Matrix</h1>
              
              <div className="bg-[#1A1A24] rounded-3xl p-6 border border-white/5 mb-10 text-center w-full shadow-xl">
                <div className="flex justify-center mb-4 text-violet-400/50">
                  <Crosshair className="w-8 h-8" strokeWidth={1} />
                </div>
                <h4 className="font-bold text-white mb-2">Instructions</h4>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Keep your eyes locked on the center crosshair. Use your peripheral vision to detect and tap the violet targets as fast as possible.
                </p>
                <div className="inline-block bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                  <span className="text-[10px] font-black uppercase text-violet-300 tracking-widest text-center">Targets: {TOTAL_TARGETS}</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white font-black tracking-widest uppercase rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-colors"
              >
                Initiate Protocol
              </motion.button>
            </motion.div>
          )}

          {/* COUNTDOWN STATE */}
          {gameState === 'countdown' && (
            <motion.div
              key="countdown"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="flex items-center justify-center absolute inset-0"
            >
              <h2 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter drop-shadow-2xl">
                {countdown}
              </h2>
            </motion.div>
          )}

          {/* PLAYING STATE */}
          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex justify-center items-center h-full relative"
            >
              {/* Center crosshair for soft focus focus-point */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none z-0">
                <div className="w-[2px] h-6 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="w-6 h-[2px] bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              {/* Top HUD */}
              <div className="absolute top-[-40px] left-0 w-full flex justify-between items-end px-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">Progress</span>
                  <span className="text-xl font-bold text-white tabular-nums">{score} <span className="text-white/40 text-sm">/ {TOTAL_TARGETS}</span></span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">Errors</span>
                  <span className="text-xl font-bold text-rose-400 tabular-nums">{misses}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full max-w-[350px] aspect-square relative z-10">
                {Array.from({ length: 9 }).map((_, index) => {
                  const isActive = activeTile === index;
                  return (
                    <motion.div
                      key={index}
                      onPointerDown={(e) => handleTileDown(e, index)}
                      className="relative rounded-2xl overflow-hidden cursor-pointer touch-none select-none transition-all duration-75"
                    >
                      {/* Base layer */}
                      <div className={`absolute inset-0 border transition-all duration-200 ${
                        isActive 
                          ? 'bg-violet-600 border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.6)] z-10' 
                          : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] z-0'
                      }`}></div>
                      
                      {/* Active Flash Animation */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* RESULT STATE */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center w-full"
            >
              <div className="bg-[#1A1A24] rounded-[2.5rem] p-8 border border-white/5 w-full relative overflow-hidden shadow-2xl mb-6">
                
                {/* Decorative background dependent on rank */}
                <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-[80px] opacity-30 ${
                  getAverageLatency() < 350 ? 'bg-violet-500' : 'bg-red-500'
                }`}></div>

                <div className="text-center relative z-10 mb-8">
                  <h2 className="text-white/40 uppercase tracking-widest font-black text-xs mb-1">Average Latency</h2>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-6xl font-black tracking-tighter text-white tabular-nums">
                      {getAverageLatency()}
                    </span>
                    <span className="text-white/40 font-bold mb-1">ms</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <div className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Targets</div>
                    <div className="text-xl font-bold text-white">{TOTAL_TARGETS}</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <div className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Misses</div>
                    <div className="text-xl font-bold text-rose-400">{misses}</div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-5 border border-white/5 text-center">
                  <div className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] mb-2">Performance Tier</div>
                  <h3 className={`text-2xl font-black tracking-tight mb-1 ${getRankData(getAverageLatency()).color}`}>
                    {getRankData(getAverageLatency()).title}
                  </h3>
                  <p className="text-xs text-white/50">{getRankData(getAverageLatency()).desc}</p>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="flex items-center justify-center gap-2 w-full py-4 bg-white/10 hover:bg-white/15 text-white font-black tracking-widest uppercase rounded-2xl backdrop-blur-md transition-colors border border-white/5"
              >
                <RotateCcw className="w-5 h-5" />
                Retry Protocol
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}