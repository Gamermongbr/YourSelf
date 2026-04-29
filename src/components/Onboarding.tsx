import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Camera, ArrowRight, ArrowLeft, ChevronRight, Check } from 'lucide-react';

export interface UserProfile {
  name: string;
  age: string;
  weight: string;
  height: string;
  avatarUrl: string;
  isGuest: boolean;
}

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    avatarUrl: `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=256&h=256&auto=format&fit=crop`,
    isGuest: true
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    // Simulate a brief delay for OAuth
    setTimeout(() => {
      setProfile({ ...profile, isGuest: false, name: 'Google User' });
      setIsGoogleLoading(false);
      handleNext();
    }, 1500);
  };

  const handleComplete = () => {
    onComplete(profile as UserProfile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(p => ({ ...p, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const setRandomNaturePic = () => {
    const seeds = ['nature', 'forest', 'mountain', 'water', 'sun', 'tree'];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)] + '-' + Math.floor(Math.random() * 1000);
    setProfile(p => ({ ...p, avatarUrl: `https://picsum.photos/seed/${randomSeed}/200/200` }));
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      {/* Background accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-sm relative z-10 space-y-12 text-center"
          >
            <div className="space-y-6">
              <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto flex items-center justify-center shadow-xl shadow-gray-200/50 border border-white">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.75rem] flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-[#1C1C1E]">nexa.lab</h1>
                <p className="text-[#8E8E93] text-lg font-medium px-4">Ready to reach your human peak performance?</p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isGoogleLoading}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 p-4 bg-white text-black rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all font-bold disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-black/10 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                {isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setProfile({ ...profile, isGuest: true }); handleNext(); }}
                className="w-full flex items-center justify-center gap-3 p-4 bg-transparent text-[#007AFF] rounded-2xl hover:bg-blue-50 transition-colors font-bold"
              >
                Continue as Guest
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-sm relative z-10 space-y-8"
          >
            <div className="flex items-center gap-4">
              <button onClick={handleBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#007AFF] shadow-sm hover:scale-105 active:scale-95 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold tracking-tight">Set Profile</h2>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-40 h-40 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white ring-1 ring-gray-200"
                  >
                    {profile.avatarUrl ? (
                       <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#F2F2F7] flex items-center justify-center">
                        <Camera className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-14 h-14 bg-[#007AFF] rounded-2xl flex items-center justify-center text-white shadow-xl z-10 border-4 border-[#F2F2F7]"
                  >
                    <Camera className="w-6 h-6" />
                  </motion.button>
                </div>
                
                <button 
                  onClick={setRandomNaturePic}
                  className="px-4 py-2 bg-white rounded-full text-xs font-bold text-[#8E8E93] shadow-sm border border-gray-100 flex items-center gap-2 hover:text-[#007AFF] transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                  Random Nature Image
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#8E8E93] ml-4">Full Name</label>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Enter your name"
                    value={profile.name || ''}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-transparent p-4 text-[#1C1C1E] font-semibold placeholder:text-gray-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!profile.name || profile.name.trim() === ''}
              onClick={handleNext}
              className="w-full py-4 bg-[#1C1C1E] text-white font-bold rounded-2xl shadow-xl shadow-gray-300 disabled:opacity-20 transition-all flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-sm relative z-10 space-y-8"
          >
            <div className="flex items-center gap-4">
              <button onClick={handleBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#007AFF] shadow-sm hover:scale-105 active:scale-95 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold tracking-tight">Your Metrics</h2>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#8E8E93]">Age</label>
                  <input 
                    type="number" 
                    placeholder="25"
                    value={profile.age || ''}
                    onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                    className="w-full bg-[#F2F2F7] rounded-xl p-3 text-[#1C1C1E] font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#8E8E93]">Weight (kg)</label>
                  <input 
                    type="number" 
                    placeholder="70"
                    value={profile.weight || ''}
                    onChange={e => setProfile(p => ({ ...p, weight: e.target.value }))}
                    className="w-full bg-[#F2F2F7] rounded-xl p-3 text-[#1C1C1E] font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#8E8E93]">Height (cm)</label>
                <input 
                  type="text" 
                  placeholder="180"
                  value={profile.height || ''}
                  onChange={e => setProfile(p => ({ ...p, height: e.target.value }))}
                  className="w-full bg-[#F2F2F7] rounded-xl p-3 text-[#1C1C1E] font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 transition-all"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!profile.age || !profile.weight || !profile.height}
              onClick={handleComplete}
              className="w-full py-5 bg-[#007AFF] text-white font-bold rounded-2xl shadow-xl shadow-blue-200 disabled:opacity-20 transition-all flex items-center justify-center gap-2"
            >
              Get Started <Check className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
