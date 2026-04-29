import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Zap, Trophy, Timer, MousePointerClick, AlertCircle, RotateCcw } from 'lucide-react';

export function LuminaTrigger({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'early' | 'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('nxa_best_lumina');
    return saved ? parseInt(saved, 10) : null;
  });
  
  useEffect(() => {
    if (bestTime !== null) {
      localStorage.setItem('nxa_best_lumina', bestTime.toString());
    }
  }, [bestTime]);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);
    
    // Random delay between 2 to 6 seconds
    const delay = Math.random() * 4000 + 2000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent default to disable double-tap zoom / selections
    e.preventDefault();
    
    // Ignore if clicking a button
    if ((e.target as HTMLElement).closest('button')) return;

    if (gameState === 'idle' || gameState === 'result' || gameState === 'early') {
      startGame();
    } else if (gameState === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
    } else if (gameState === 'ready') {
      // Success! Calculate reaction time
      const endTime = performance.now();
      const finalTime = Math.round(endTime - startTimeRef.current);
      setReactionTime(finalTime);
      setGameState('result');
      
      if (!bestTime || finalTime < bestTime) {
        setBestTime(finalTime);
      }
    }
  };

  const getRankMessage = (time: number | null) => {
    if (!time) return '';
    if (time < 150) return 'Superhuman';
    if (time < 200) return 'Elite Pro';
    if (time < 250) return 'Excellent';
    if (time < 300) return 'Average';
    return 'Room for Improvement';
  };

  const getRankColor = (time: number | null) => {
    if (!time) return 'text-white';
    if (time < 200) return 'text-cyan-400';
    if (time < 250) return 'text-emerald-400';
    if (time < 300) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <motion.div
      key="lumina"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`min-h-screen relative overflow-hidden font-sans select-none touch-none transition-colors duration-100 ${
        gameState === 'idle' || gameState === 'result' ? 'bg-[#0A0A0F]' :
        gameState === 'waiting' ? 'bg-[#E11D48]' : // rose-600
        gameState === 'ready' ? 'bg-[#22D3EE]' : // cyan-400
        'bg-[#F59E0B]' // amber-500
      }`}
      onPointerDown={handlePointerDown}
    >
      {/* Background patterns */}
      {(gameState === 'idle' || gameState === 'result') && (
        <>
          <div className="absolute top-0 left-0 w-full h-[50vh] bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        </>
      )}

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto w-12 h-12 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-3">
          <AnimatePresence>
            {bestTime !== null && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-xl"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Personal Best</div>
                  <div className="text-white font-black text-sm">{bestTime} <span className="text-white/40 text-xs">ms</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Interactive Area */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center pointer-events-none"
            >
              <div className="w-24 h-24 rounded-[2rem] bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                <Zap className="w-10 h-10 text-cyan-400" />
              </div>
              <h1 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-md">Lumina Trigger</h1>
              <p className="text-white/60 mb-12 max-w-sm text-sm leading-relaxed px-4">
                When the screen turns <span className="text-cyan-400 font-bold">cyan</span>, tap anywhere as fast as you can. Do not tap before it flips.
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <div className="animate-bounce">
                  <MousePointerClick className="w-8 h-8 text-white/30" />
                </div>
                <h2 className="text-2xl font-bold text-white/90">Tap anywhere to start</h2>
              </div>
            </motion.div>
          )}

          {gameState === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              className="pointer-events-none flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin mb-6"></div>
              <h2 className="text-5xl font-black text-white tracking-widest uppercase drop-shadow-lg">Wait</h2>
            </motion.div>
          )}

          {gameState === 'ready' && (
            <motion.div
              key="ready"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="pointer-events-none"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>
              <h2 className="text-7xl font-black text-[#0A0A0F] tracking-tighter uppercase relative z-10">TAP NOW</h2>
            </motion.div>
          )}

          {gameState === 'early' && (
            <motion.div
              key="early"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="pointer-events-none flex flex-col items-center"
            >
              <AlertCircle className="w-20 h-20 text-white flex-shrink-0 animate-pulse mb-6 drop-shadow-lg" strokeWidth={1.5} />
              <h2 className="text-5xl font-black text-white mb-2 tracking-tight drop-shadow-lg">Too Soon!</h2>
              <p className="text-white/80 font-medium text-lg mb-8">You tapped before the shift.</p>
              <div className="bg-white/20 px-6 py-3 rounded-full backdrop-blur-md">
                <span className="text-white font-bold tracking-widest text-sm uppercase">Tap to try again</span>
              </div>
            </motion.div>
          )}

          {gameState === 'result' && reactionTime !== null && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="pointer-events-none flex flex-col items-center w-full max-w-md px-6"
            >
              <div className="w-full bg-[#1A1A24] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden shadow-2xl mb-8">
                {/* Winner glow if it's a good score */}
                {reactionTime < 250 && (
                   <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[50px] mix-blend-screen"></div>
                )}
                
                <h3 className="text-white/50 uppercase tracking-widest font-black text-xs mb-2">Reaction Latency</h3>
                <div className="flex items-end justify-center gap-2 mb-4">
                  <h2 className={`text-6xl font-black tracking-tighter ${getRankColor(reactionTime)}`}>{reactionTime}</h2>
                  <span className="text-white/40 font-bold text-xl mb-1 pb-1">ms</span>
                </div>
                
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-6"></div>
                
                <div className="text-center">
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-1">Diagnosis</div>
                  <div className={`text-xl font-bold ${getRankColor(reactionTime)}`}>
                    {getRankMessage(reactionTime)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/50 animate-pulse">
                <RotateCcw className="w-4 h-4" />
                <span className="text-sm font-bold tracking-widest uppercase">Tap anywhere to restart</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
