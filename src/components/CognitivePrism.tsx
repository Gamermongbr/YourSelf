import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Hexagon, Trophy, Shapes, RotateCcw } from 'lucide-react';

const TOTAL_TARGETS = 15;
const MAX_TARGET_LIFETIME_MS = 2000; // Shapes vanish if not clicked in 2s

type TargetShape = 'circle' | 'square' | 'triangle' | 'star';

interface ColorTheme {
  name: string;
  fill: string;
  drop: string;
  text: string;
}

const SHAPES: TargetShape[] = ['circle', 'square', 'triangle', 'star'];

const COLORS: ColorTheme[] = [
  { name: 'cyan', fill: 'fill-cyan-400', drop: 'drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]', text: 'text-cyan-400' },
  { name: 'rose', fill: 'fill-rose-400', drop: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]', text: 'text-rose-400' },
  { name: 'amber', fill: 'fill-amber-400', drop: 'drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]', text: 'text-amber-400' },
  { name: 'emerald', fill: 'fill-emerald-400', drop: 'drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]', text: 'text-emerald-400' },
  { name: 'violet', fill: 'fill-violet-400', drop: 'drop-shadow-[0_0_12px_rgba(167,139,250,0.8)]', text: 'text-violet-400' },
  { name: 'blue', fill: 'fill-blue-500', drop: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]', text: 'text-blue-400' },
];

interface ActiveTarget {
  id: string;
  shape: TargetShape;
  color: ColorTheme;
  left: number; // percentage
  top: number; // percentage
  size: number; // px width/height
}

interface FloatingLabel {
  id: string;
  x: number;
  y: number;
  ms: number;
  colorClass: string;
}

export function CognitivePrism({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'playing' | 'result'>('idle');
  const [countdown, setCountdown] = useState(3);
  
  const [activeTarget, setActiveTarget] = useState<ActiveTarget | null>(null);
  const [activeTargetCount, setActiveTargetCount] = useState(0); // Targets spawned so far
  
  const [score, setScore] = useState(0); // Hits
  const [misses, setMisses] = useState(0); // Timeouts
  const [latencies, setLatencies] = useState<number[]>([]);
  const [floatingLabels, setFloatingLabels] = useState<FloatingLabel[]>([]);
  
  const [bestAvg, setBestAvg] = useState<number | null>(() => {
    const saved = localStorage.getItem('nxa_best_cognitive');
    return saved ? parseInt(saved, 10) : null;
  });

  useEffect(() => {
    if (bestAvg !== null) {
      localStorage.setItem('nxa_best_cognitive', bestAvg.toString());
    }
  }, [bestAvg]);

  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const spawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const missTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeouts safely on unmount
  useEffect(() => {
    return () => {
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
      if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);
    };
  }, []);

  const startGame = () => {
    setGameState('countdown');
    setCountdown(3);
    setScore(0);
    setMisses(0);
    setLatencies([]);
    setActiveTargetCount(0);
    setFloatingLabels([]);
    setActiveTarget(null);
  };

  // Countdown logic
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 800);
        return () => clearTimeout(timer);
      } else {
        setGameState('playing');
        scheduleNextSpawn(0); // Start immediately
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, countdown]);

  // When game ends
  useEffect(() => {
    if (gameState === 'result') {
      const avg = getAverageLatency();
      if (avg > 0 && (bestAvg === null || avg < bestAvg)) {
        setBestAvg(avg);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const scheduleNextSpawn = (delay: number) => {
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    
    spawnTimeoutRef.current = setTimeout(() => {
      spawnTarget();
    }, delay);
  };

  const spawnTarget = () => {
    setActiveTargetCount(prev => {
      const nextCount = prev + 1;
      if (nextCount > TOTAL_TARGETS) {
        setGameState('result');
        return prev;
      }
      
      const nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      // Keep inside a safe 15% - 85% bounds to prevent clipping out of view
      const left = Math.random() * 70 + 15;
      const top = Math.random() * 70 + 15;
      
      // Sizes from small to medium-small (36px to 64px)
      const size = Math.random() * 28 + 36;
      
      setActiveTarget({
        id: Date.now().toString(),
        shape: nextShape,
        color: nextColor,
        left,
        top,
        size
      });
      
      startTimeRef.current = performance.now();
      
      // Setup miss timeout
      if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);
      missTimeoutRef.current = setTimeout(() => {
        handleMiss();
      }, MAX_TARGET_LIFETIME_MS);

      return nextCount;
    });
  };

  const handleMiss = () => {
    setMisses(m => m + 1);
    setActiveTarget(null);
    // Short punishment delay for missing
    scheduleNextSpawn(400); 
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (gameState !== 'playing' || !activeTarget) return;

    const endTime = performance.now();
    const hitLatency = Math.round(endTime - startTimeRef.current);

    // Clear miss timer
    if (missTimeoutRef.current) clearTimeout(missTimeoutRef.current);

    // Record Metrics
    setLatencies(prev => [...prev, hitLatency]);
    setScore(s => s + 1);

    // Calculate click coordinates relative to the container for the floating popup
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setFloatingLabels(prev => [
        ...prev, 
        { id: Date.now().toString(), x, y, ms: hitLatency, colorClass: activeTarget.color.text }
      ]);
    }

    setActiveTarget(null);
    // Random gap between targets (150ms to 500ms) to prevent rhythmic clicking
    scheduleNextSpawn(Math.random() * 350 + 150);
  };

  const getAverageLatency = () => {
    if (latencies.length === 0) return 0;
    const total = latencies.reduce((a, b) => a + b, 0);
    return Math.round(total / latencies.length);
  };

  const getRankData = (avg: number) => {
    if (avg === 0) return { title: 'No Data', color: 'text-gray-400', desc: 'No targets hit.' };
    if (avg < 280) return { title: 'Grandmaster', color: 'text-amber-400', desc: 'Flawless pattern recognition and click speed.' };
    if (avg < 350) return { title: 'Diamond', color: 'text-cyan-400', desc: 'Elite spatial targeting.' };
    if (avg < 450) return { title: 'Gold', color: 'text-emerald-400', desc: 'Solid consistency and reaction times.' };
    if (avg < 600) return { title: 'Silver', color: 'text-blue-400', desc: 'Average processing speed.' };
    return { title: 'Bronze', color: 'text-rose-400', desc: 'Slightly slow cognitive shifts. Keep training.' };
  };

  const renderSVGShape = (type: TargetShape, size: number, colorFill: string, dropClass: string) => {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        className={`${colorFill} ${dropClass} overflow-visible transition-colors`} 
        xmlns="http://www.w3.org/2000/svg"
      >
        {type === 'circle' && <circle cx="12" cy="12" r="10" />}
        {type === 'square' && <rect x="3" y="3" width="18" height="18" rx="4" />}
        {type === 'triangle' && <polygon points="12,2 22,20 2,20" strokeLinejoin="round" strokeWidth="1" stroke="currentColor" />}
        {type === 'star' && <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" strokeLinejoin="round" strokeWidth="1" stroke="currentColor"/>}
      </svg>
    );
  };

  return (
    <motion.div
      key="prism"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden font-sans relative select-none touch-none flex flex-col"
    >
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-amber-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[100px] pointer-events-none"></div>

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
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Best Avg</div>
                <div className="text-white font-black text-sm">{bestAvg} <span className="text-white/40 text-[10px]">ms</span></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col p-6 w-full max-w-2xl mx-auto relative z-10 h-full">
        
        <AnimatePresence mode="wait">
          {/* IDLE STATE */}
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center w-full h-full my-auto"
            >
              <div 
                className="w-24 h-24 rounded-[2.5rem] bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(251,191,36,0.15)] relative group cursor-pointer" 
                onClick={startGame}
              >
                <div className="absolute inset-0 bg-amber-400/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Hexagon className="w-10 h-10 text-amber-400" />
              </div>
              <h1 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-md text-center">Cognitive Prism</h1>
              
              <div className="bg-[#1A1A24] rounded-3xl p-6 border border-white/5 mb-10 text-center w-full max-w-md shadow-xl">
                <div className="flex justify-center gap-4 mb-4 text-amber-400/50">
                   <Shapes className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-white mb-2">Instructions</h4>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  Multi-colored geometric shapes will appear at random coordinates. Rapidly scan the field and strike them out before they dematerialize.
                </p>
                <div className="inline-block bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                  <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest text-center">Protocol: {TOTAL_TARGETS} Targets</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="w-full max-w-sm py-4 bg-amber-600 hover:bg-amber-500 text-white font-black tracking-widest uppercase rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-colors"
              >
                Initiate Prism
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
              <h2 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 tracking-tighter drop-shadow-2xl">
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
              className="w-full flex-1 flex flex-col relative"
            >
              {/* Top HUD */}
              <div className="flex justify-between items-end mb-4 px-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">Progress</span>
                  <span className="text-xl font-bold text-white tabular-nums">{score} <span className="text-white/40 text-sm">/ {TOTAL_TARGETS}</span></span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">Latent Ms</span>
                  <span className="text-xl font-bold text-amber-400 tabular-nums">{latencies.length > 0 ? latencies[latencies.length - 1] : '---'}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-black text-white/30 tracking-widest">Misses</span>
                  <span className="text-xl font-bold text-rose-400 tabular-nums">{misses}</span>
                </div>
              </div>

              {/* Game Area Boundary */}
              <div ref={containerRef} className="flex-1 relative w-full bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-inner">
                {/* Crosshair watermark context */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                   <div className="w-16 h-16 border-2 border-dashed border-white rounded-full"></div>
                   <div className="w-[1px] h-20 bg-white absolute"></div>
                   <div className="w-20 h-[1px] bg-white absolute"></div>
                </div>

                {/* Floating MS Labels */}
                <AnimatePresence>
                  {floatingLabels.map(label => (
                    <motion.div
                      key={label.id}
                      initial={{ opacity: 1, y: label.y, x: label.x, scale: 0.5 }}
                      animate={{ opacity: 0, y: label.y - 60, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      onAnimationComplete={() => setFloatingLabels(prev => prev.filter(l => l.id !== label.id))}
                      className={`absolute font-black text-2xl pointer-events-none z-50 ${label.colorClass} drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]`}
                      style={{ transform: 'translate(-50%, -50%)', left: 0, top: 0 }}
                    >
                      +{label.ms}ms
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Dynamic Target Span */}
                <AnimatePresence>
                  {activeTarget && (
                    <div 
                      key={activeTarget.id}
                      className="absolute z-20"
                      style={{ top: `${activeTarget.top}%`, left: `${activeTarget.left}%`, width: 0, height: 0 }}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -45, x: '-50%', y: '-50%' }}
                        animate={{ scale: 1, rotate: 0, x: '-50%', y: '-50%' }}
                        exit={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
                        transition={{ type: "spring", damping: 14, stiffness: 350 }}
                        onPointerDown={handlePointerDown}
                        className="absolute cursor-pointer touch-none select-none hover:brightness-125"
                        style={{ width: activeTarget.size, height: activeTarget.size }}
                      >
                         {renderSVGShape(activeTarget.shape, activeTarget.size, activeTarget.color.fill, activeTarget.color.drop)}
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* RESULT STATE */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center w-full justify-center h-full"
            >
              <div className="bg-[#1A1A24] rounded-[2.5rem] p-8 border border-white/5 w-full relative overflow-hidden shadow-2xl mb-6">
                
                {/* Decorative background dependent on rank */}
                <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-[80px] opacity-30 ${
                  getAverageLatency() < 350 && getAverageLatency() > 0 ? 'bg-amber-500' : 'bg-rose-500'
                }`}></div>

                <div className="text-center relative z-10 mb-8">
                  <h2 className="text-white/40 uppercase tracking-widest font-black text-xs mb-1">Average Target Latency</h2>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-6xl font-black tracking-tighter text-white tabular-nums">
                      {getAverageLatency()}
                    </span>
                    <span className="text-white/40 font-bold mb-1">ms</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <div className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Accuracy</div>
                    <div className="text-xl font-bold text-emerald-400">
                      {Math.round((score / TOTAL_TARGETS) * 100)}%
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                    <div className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Misses</div>
                    <div className="text-xl font-bold text-rose-400">{misses}</div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-5 border border-white/5 text-center relative z-10">
                  <div className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] mb-2">Cognitive Tier</div>
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
                className="flex items-center justify-center gap-2 w-full max-w-sm py-4 bg-white/10 hover:bg-white/15 text-white font-black tracking-widest uppercase rounded-2xl backdrop-blur-md transition-colors border border-white/5"
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