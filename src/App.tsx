/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Home, LayoutGrid, BarChart2, User, ChevronDown, Activity, Brain, Scale, Calendar, Clock, Flower2, BookOpen, BicepsFlexed, Dumbbell, Target, Flag, Trophy, Book, FileText, GraduationCap, UserCircle, Pencil, TrendingUp, CalendarDays, AlertCircle, ArrowUpFromLine, Quote, BookOpenText, Paperclip, Plus, Compass, Smile, Meh, Frown, PenLine, Accessibility, Zap, Timer, StretchHorizontal, MousePointerClick, Flame, Eye, Utensils, Swords, Music, Radio, Youtube, Instagram, ArrowLeft, Play, RotateCcw, Settings2, CheckCircle2 } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCycleExpanded, setIsCycleExpanded] = useState(false);
  const [isNotebookExpanded, setIsNotebookExpanded] = useState(false);

  // Pushup Counter States
  const [pushupMode, setPushupMode] = useState<'free' | 'continuous' | 'step'>('continuous');
  const [targetPushups, setTargetPushups] = useState(15);
  const [pushupsPerSet, setPushupsPerSet] = useState(10);
  const [restTime, setRestTime] = useState(30);
  const [currentPushups, setCurrentPushups] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // PWA Install States
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Capture the install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  // Update date every second for real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Rest Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimeRemaining > 0) {
      interval = setInterval(() => {
        setRestTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (restTimeRemaining === 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeRemaining]);

  const handlePushupClick = () => {
    if (!isTraining || isResting) return;

    if (pushupMode === 'free') {
      setCurrentPushups(prev => prev + 1);
    } else {
      if (currentPushups > 0) {
        const nextCount = currentPushups - 1;
        setCurrentPushups(nextCount);

        // Step mode logic
        if (pushupMode === 'step') {
          const totalDone = targetPushups - nextCount;
          if (totalDone % pushupsPerSet === 0 && nextCount > 0) {
            setIsResting(true);
            setRestTimeRemaining(restTime);
          }
        }

        if (nextCount === 0) {
          setIsTraining(false);
        }
      }
    }
  };

  const startTraining = () => {
    setCurrentPushups(pushupMode === 'free' ? 0 : targetPushups);
    setIsTraining(true);
    setIsResting(false);
    setSetsCompleted(0);
  };

  const resetTraining = () => {
    setIsTraining(false);
    setIsResting(false);
    setCurrentPushups(0);
  };

  const formattedDate = `Today ${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'short' })}.`;

  // Generate a rolling 7-day window centered around today
  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() - 3 + i);
    return {
      day: d.toLocaleString('default', { weekday: 'short' }),
      date: d.getDate().toString(),
      active: i === 3, // Today is the active item
    };
  });

  return (
    <div className="min-h-screen bg-[#F3F2FA] font-sans text-gray-900 relative pb-32 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Top Bar */}
            <header className="flex items-center justify-between px-6 pt-12 pb-4 max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
          <img 
            src="https://picsum.photos/seed/sandra/100/100" 
            alt="Profile" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="text-center px-4">
          <h1 className="text-lg font-semibold tracking-tight truncate">Hello, Sandra</h1>
          <p className="text-xs text-gray-500 font-medium">{formattedDate}</p>
        </div>
        <button 
          onClick={handleInstallClick}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors shrink-0 relative group"
        >
          <Search className="w-5 h-5 text-gray-600" />
          {/* Tooltip for clarity */}
          <div className="absolute -bottom-8 right-0 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Install App
          </div>
        </button>
      </header>

      {/* Main Content */}
      <div className="px-6 max-w-2xl mx-auto">
        
        {activeTab === 'home' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full"
          >
            {/* Daily Challenge Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#A890FE] rounded-3xl p-6 text-white relative overflow-hidden mb-8 shadow-lg shadow-purple-200"
        >
          <div className="relative z-10 w-2/3">
            <h2 className="text-3xl font-bold leading-tight mb-2">Daily<br/>challenge</h2>
            <p className="text-sm text-white/80 mb-4">Do your plan before 09:00 AM</p>
            
            {/* Avatars */}
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/user${i}/100/100`} 
                  alt="User" 
                  className="w-8 h-8 rounded-full border-2 border-[#A890FE]"
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#A890FE] bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-medium">
                +4
              </div>
            </div>
          </div>
          
          {/* Abstract Shapes */}
          <div className="absolute right-[-20px] top-[-20px] w-40 h-40 opacity-90">
            <div className="absolute top-10 right-4 w-16 h-16 rounded-full border-[12px] border-[#FF9800] transform rotate-12"></div>
            <div className="absolute top-20 right-16 w-14 h-14 bg-gray-700 rounded-2xl transform -rotate-12 shadow-xl"></div>
            <div className="absolute top-8 right-20 w-12 h-12 bg-[#D1C4E9] rounded-full shadow-lg"></div>
          </div>

          {/* Real-time Digital Clock */}
          <div className="absolute bottom-4 right-4 bg-white/25 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 z-20 flex items-center justify-center">
            <span className="font-sans font-black tracking-tighter text-xl text-white drop-shadow-md">
              {currentDate.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
        </motion.div>

        {/* Date Selector */}
        <div className="flex justify-between mb-8 overflow-x-auto no-scrollbar gap-2 pb-2">
          {weekDates.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-12 h-16 rounded-full text-xs font-medium transition-all ${
                item.active 
                  ? 'bg-[#1A1A24] text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-100 shadow-sm'
              }`}
            >
              <span className="mb-1">{item.day}</span>
              <span className={`text-sm ${item.active ? 'font-bold' : 'font-semibold text-gray-800'}`}>
                {item.date}
              </span>
              {item.active && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
            </motion.div>
          ))}
        </div>

        {/* Your Plan Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Your plan</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              {/* Meditation - Tall */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-[#FDBA53] rounded-3xl p-5 flex flex-col justify-between h-[240px] shadow-md shadow-orange-100 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 bg-white/30 rounded-full text-[10px] font-bold text-orange-900 uppercase tracking-wider">
                      Mindful
                    </span>
                    <Flower2 className="w-6 h-6 text-orange-900/50" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Meditation</h4>
                  <p className="text-xs text-gray-800 font-medium leading-relaxed">
                    {currentDate.getDate()} {currentDate.toLocaleString('default', { month: 'short' })}.<br/>
                    07:00-08:00
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 relative z-10">
                  <img 
                    src="https://picsum.photos/seed/guide/100/100" 
                    alt="Guide" 
                    className="w-8 h-8 rounded-full border-2 border-white/50"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-[10px] text-orange-900 font-medium">Guide</p>
                    <p className="text-xs font-bold text-gray-900">Tiffany Way</p>
                  </div>
                </div>
                
                {/* Decorative background icon */}
                <Flower2 className="absolute -bottom-4 -right-4 w-32 h-32 text-white/20 transform -rotate-12" />
              </motion.div>

              {/* Calisthenics - Short */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-[#FF99FF] rounded-3xl p-5 flex flex-col justify-between h-[160px] shadow-md shadow-pink-100 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block px-3 py-1 bg-white/30 rounded-full text-[10px] font-bold text-pink-900 uppercase tracking-wider">
                      Strength
                    </span>
                    <BicepsFlexed className="w-5 h-5 text-pink-900/50" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Calisthenics</h4>
                  <p className="text-[10px] text-gray-800 font-medium leading-relaxed">
                    16:00-17:00<br/>
                    Park
                  </p>
                </div>
                {/* Decorative background icon */}
                <BicepsFlexed className="absolute -bottom-2 -right-2 w-24 h-24 text-white/30 transform -rotate-12" />
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              {/* Academics - Short */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-[#9BB9FF] rounded-3xl p-5 flex flex-col justify-between h-[160px] relative overflow-hidden shadow-md shadow-blue-100"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block px-3 py-1 bg-white/30 rounded-full text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                      Focus
                    </span>
                    <BookOpen className="w-5 h-5 text-blue-900/50" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Academics</h4>
                  <p className="text-[10px] text-gray-800 font-medium leading-relaxed">
                    10:00-12:30<br/>
                    Library
                  </p>
                </div>
                
                {/* Abstract Shapes (Book-like or geometric) */}
                <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20">
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-[#E6D5C3] rounded-sm transform rotate-12 shadow-lg"></div>
                  <div className="absolute bottom-2 right-10 w-8 h-8 bg-blue-600 rounded-full shadow-md"></div>
                </div>
              </motion.div>

              {/* Work Out - Tall */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-[#C1F0D0] rounded-3xl p-5 flex flex-col justify-between h-[240px] shadow-md shadow-green-100 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 bg-white/30 rounded-full text-[10px] font-bold text-green-900 uppercase tracking-wider">
                      Cardio
                    </span>
                    <Dumbbell className="w-6 h-6 text-green-900/50" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Work Out</h4>
                  <p className="text-xs text-gray-800 font-medium leading-relaxed">
                    18:00-19:30<br/>
                    Gym
                  </p>
                </div>

                <div className="flex items-center space-x-2 mt-4 relative z-10">
                  <img 
                    src="https://picsum.photos/seed/gym/100/100" 
                    alt="Partner" 
                    className="w-8 h-8 rounded-full border-2 border-white/50"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-[10px] text-green-900 font-medium">Partner</p>
                    <p className="text-xs font-bold text-gray-900">Alex Chen</p>
                  </div>
                </div>

                {/* Decorative background icon */}
                <Dumbbell className="absolute -bottom-4 -right-2 w-32 h-32 text-white/40 transform -rotate-45" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Your Goals Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Your goals</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Daily Goals */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white rounded-3xl p-4 shadow-lg shadow-purple-200 flex flex-col items-center justify-center gap-2 text-center cursor-pointer relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-300/20 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-300/20 rounded-full blur-xl transform -translate-x-1/3 translate-y-1/3"></div>
              <div className="relative w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 z-10 shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-shadow">
                <Target className="w-7 h-7 text-yellow-300 drop-shadow-md" />
              </div>
              <span className="font-bold text-sm z-10 tracking-wide">Daily Goals</span>
            </motion.div>
            
            {/* Monthly Goals */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 text-center cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <Flag className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Monthly Goal</span>
            </motion.div>

            {/* Annual Goals */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 text-center cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Annual Goal</span>
            </motion.div>

            {/* Note book (Expandable) */}
            <motion.div 
              onClick={() => setIsNotebookExpanded(!isNotebookExpanded)}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="bg-[#1A1A24] text-white rounded-3xl p-4 shadow-md flex flex-col items-center justify-center gap-2 text-center cursor-pointer relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                <Book className="w-6 h-6" />
              </div>
              <span className="font-semibold text-sm">Note book</span>
              <motion.div animate={{ rotate: isNotebookExpanded ? 180 : 0 }} className="absolute top-4 right-4">
                <ChevronDown className="w-4 h-4 text-white/50" />
              </motion.div>
            </motion.div>
          </div>

          {/* Expanded Notebook Options */}
          <AnimatePresence>
            {isNotebookExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Notebook</h4>
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-sm"><FileText className="w-4 h-4"/></div>
                      <span className="text-sm font-semibold">Regular</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors border border-blue-100">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 shadow-sm"><GraduationCap className="w-4 h-4"/></div>
                      <span className="text-sm font-semibold">Academic</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 cursor-pointer transition-colors border border-rose-100">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-700 shadow-sm"><UserCircle className="w-4 h-4"/></div>
                      <span className="text-sm font-semibold">Personal</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-green-50 hover:bg-green-100 cursor-pointer transition-colors border border-green-100">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-700 shadow-sm"><Dumbbell className="w-4 h-4"/></div>
                      <span className="text-sm font-semibold">Workout</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cycles Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Cycles</h3>
            <span className="text-xs text-gray-500 font-medium">Time Management</span>
          </div>
          
          <motion.div 
            className="bg-white rounded-3xl p-1 shadow-sm border border-gray-100 cursor-pointer overflow-hidden"
            onClick={() => setIsCycleExpanded(!isCycleExpanded)}
          >
            <div className="bg-[#1A1A24] rounded-[1.5rem] p-5 text-white flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Training Cycles</h4>
                  <p className="text-xs text-gray-400">Manage your periods</p>
                </div>
              </div>
              
              <motion.div 
                animate={{ rotate: isCycleExpanded ? 180 : 0 }}
                className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </motion.div>

              {/* Decorative rings */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-32 h-32 rounded-full border-[8px] border-white/5"></div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-1/3 w-24 h-24 rounded-full border-[4px] border-white/5"></div>
            </div>

            <AnimatePresence>
              {isCycleExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-2 pb-2 pt-4"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Macrocycle', desc: 'Months/Years', color: 'bg-blue-50 text-blue-700' },
                      { name: 'Mesocycle', desc: 'Weeks/Months', color: 'bg-purple-50 text-purple-700' },
                      { name: 'Microcycle', desc: 'Days/Weeks', color: 'bg-emerald-50 text-emerald-700' }
                    ].map((cycle, i) => (
                      <div key={i} className={`${cycle.color} rounded-2xl p-3 text-center border border-black/5`}>
                        <h5 className="font-bold text-sm mb-1">{cycle.name}</h5>
                        <p className="text-[10px] opacity-80">{cycle.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Feature Options Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Feature Options</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Day Planner */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#FFD6E0] rounded-3xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-rose-600" />
              </div>
              <span className="font-bold text-gray-900 leading-tight">Day Planner</span>
            </motion.div>

            {/* Neurology */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#E0D6FF] rounded-3xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-bold text-gray-900 leading-tight">Neurology</span>
            </motion.div>

            {/* Calendar */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#D6E4FF] rounded-3xl p-4 shadow-sm flex flex-col justify-between gap-3 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-right">
                  <span className="block text-xl font-black text-blue-600 leading-none">{currentDate.getDate()}</span>
                  <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-wider">{currentDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </div>
              </div>
              <span className="font-bold text-gray-900 leading-tight">Calendar</span>
            </motion.div>

            {/* Reminder */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#FFE5B4] rounded-3xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-bold text-gray-900 leading-tight">Reminder</span>
            </motion.div>

            {/* Push Up Counter */}
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={() => setCurrentView('pushups')}
              className="bg-[#C1F0D0] rounded-3xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">
                <BicepsFlexed className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="font-bold text-gray-900 leading-tight">Push Up Counter</span>
            </motion.div>

            {/* Quote */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#FDE68A] rounded-3xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">
                <Quote className="w-5 h-5 text-yellow-700" />
              </div>
              <span className="font-bold text-gray-900 leading-tight">Quote</span>
            </motion.div>

            {/* Suggestion Book */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="col-span-2 bg-[#1A1A24] rounded-3xl p-5 shadow-md flex items-center justify-between cursor-pointer relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <BookOpenText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Suggestion Book</h4>
                  <p className="text-xs text-gray-400">Ideas & Feedback</p>
                </div>
              </div>
              <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>

        {/* Personal Data Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Personal Data</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="font-semibold text-sm leading-tight">Body Info</span>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-semibold text-sm leading-tight">Weight Info</span>
            </motion.div>
          </div>
        </div>
        </motion.div>
        )}

        {activeTab === 'grid' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {/* Daily Mode Greeting */}
            <div className="mb-10 mt-4">
              <span className="text-sm font-medium text-gray-500 mb-2 block">Daily reflection</span>
              <h2 className="text-4xl font-light tracking-tight leading-tight text-gray-900">
                Hello, Sandra <br/>
                How do you feel about your <span className="font-bold">current emotions?</span>
              </h2>
              
              {/* Mood Log */}
              <div className="mt-6 flex items-center justify-between bg-white rounded-full p-2 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Smile className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ring-4 ring-green-50">
                  <Smile className="w-6 h-6 text-green-600" />
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Frown className="w-6 h-6 text-red-600" />
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Meh className="w-6 h-6 text-blue-600" />
                </div>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Frown className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Sticky Notes Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Sticky Notes</h3>
                <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <PenLine className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Note 1 */}
                <motion.div whileHover={{ scale: 1.02, rotate: 0 }} className="bg-[#FEF3C7] rounded-2xl p-4 shadow-sm relative transform -rotate-2 cursor-pointer h-32 flex flex-col justify-center">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-gray-300/80 rounded-full shadow-sm border border-gray-400/30 backdrop-blur-sm"></div>
                  <p className="font-medium text-yellow-900 text-center">Buy groceries for the week 🛒</p>
                </motion.div>

                {/* Note 2 */}
                <motion.div whileHover={{ scale: 1.02, rotate: 0 }} className="bg-[#FCE7F3] rounded-2xl p-4 shadow-sm relative transform rotate-2 cursor-pointer h-32 flex flex-col justify-center">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-gray-300/80 rounded-full shadow-sm border border-gray-400/30 backdrop-blur-sm"></div>
                  <p className="font-medium text-pink-900 text-center">Read 10 pages of Atomic Habits 📚</p>
                </motion.div>

                {/* Note 3 */}
                <motion.div whileHover={{ scale: 1.02, rotate: 0 }} className="bg-[#E0E7FF] rounded-2xl p-4 shadow-sm relative transform -rotate-1 cursor-pointer h-32 flex flex-col justify-center">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-gray-300/80 rounded-full shadow-sm border border-gray-400/30 backdrop-blur-sm"></div>
                  <p className="font-medium text-indigo-900 text-center">Call mom at 6 PM 📞</p>
                </motion.div>

                {/* Create Note Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer h-32 group hover:border-gray-300 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-gray-200 transition-colors">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Note</span>
                </motion.div>
              </div>
            </div>

            {/* Learning Hub Section */}
            <div className="mb-10">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-gradient-to-br from-[#1E1B4B] to-[#312E81] rounded-3xl p-6 shadow-xl shadow-indigo-200/50 relative overflow-hidden cursor-pointer group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl transform -translate-x-1/3 translate-y-1/3"></div>
                
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-4 shadow-inner">
                      <BookOpen className="w-6 h-6 text-indigo-200" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">Learning Hub</h3>
                    <p className="text-indigo-200 text-sm font-medium">Study and knowledge</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 group-hover:bg-white/20 transition-colors">
                    <Compass className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-bold uppercase tracking-wider">Discover</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Training Guidance Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Training guidance</h3>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Expert Tips</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Body Posture', icon: Accessibility, color: 'bg-emerald-50', iconColor: 'text-emerald-600', desc: 'Alignment' },
                  { title: 'Eye Care', icon: Eye, color: 'bg-cyan-50', iconColor: 'text-cyan-600', desc: 'Vision' },
                  { title: 'Weight Gain', icon: TrendingUp, color: 'bg-indigo-50', iconColor: 'text-indigo-600', desc: 'Mass' },
                  { title: 'Food Diet', icon: Utensils, color: 'bg-lime-50', iconColor: 'text-lime-600', desc: 'Nutrition' },
                  { title: 'Speed', icon: Zap, color: 'bg-yellow-50', iconColor: 'text-yellow-600', desc: 'Velocity' },
                  { title: 'Endurance', icon: Timer, color: 'bg-blue-50', iconColor: 'text-blue-600', desc: 'Stamina' },
                  { title: 'Flexibility', icon: StretchHorizontal, color: 'bg-rose-50', iconColor: 'text-rose-600', desc: 'Mobility' },
                  { title: 'Reaction Reflex', icon: MousePointerClick, color: 'bg-purple-50', iconColor: 'text-purple-600', desc: 'Agility' },
                  { title: 'Calisthenics', icon: BicepsFlexed, color: 'bg-orange-50', iconColor: 'text-orange-600', desc: 'Bodyweight' },
                  { title: 'Muscle Strength', icon: Flame, color: 'bg-red-50', iconColor: 'text-red-600', desc: 'Power' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-5 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex flex-col gap-4 cursor-pointer group transition-all hover:shadow-md hover:border-gray-200"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
                
                {/* Martial Techniques Header */}
                <div className="col-span-2 mt-4 mb-2 px-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Martial techniques</h4>
                </div>

                {/* Martial Book Special Card */}
                <motion.div 
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="col-span-2 p-5 rounded-[2rem] bg-[#1A1A24] text-white shadow-sm flex flex-row items-center gap-4 cursor-pointer group transition-all hover:shadow-md border-none"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Swords className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-bold text-sm text-white">Martial Book</h4>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Combat Arts</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Social Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Social</h3>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Connect</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Discover - Large Card */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-6 text-white relative overflow-hidden cursor-pointer shadow-lg shadow-blue-100">
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold mb-1">Discover</h4>
                      <p className="text-blue-100 text-xs">Explore new trends</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Compass className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                </motion.div>

                {/* Music */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col gap-4 cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Music className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Music</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Playlists</p>
                  </div>
                </motion.div>

                {/* Radio */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col gap-4 cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Radio className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Radio</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live FM</p>
                  </div>
                </motion.div>

                {/* YouTube */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col gap-4 cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Youtube className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">YouTube</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Videos</p>
                  </div>
                </motion.div>

                {/* Instagram */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 flex flex-col gap-4 cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Instagram</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Feed</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md z-50">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
          className="bg-[#1A1A24] rounded-[2rem] p-2 flex items-center justify-between shadow-2xl shadow-black/20"
        >
          <button 
            onClick={() => {
              setActiveTab('home');
              setCurrentView('dashboard');
            }}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${activeTab === 'home' && currentView === 'dashboard' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <Home className={`w-6 h-6 ${activeTab === 'home' && currentView === 'dashboard' ? 'text-[#1A1A24]' : ''}`} />
          </button>
          <button 
            onClick={() => {
              setActiveTab('grid');
              setCurrentView('dashboard');
            }}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${activeTab === 'grid' && currentView === 'dashboard' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutGrid className={`w-6 h-6 ${activeTab === 'grid' && currentView === 'dashboard' ? 'text-[#1A1A24]' : ''}`} />
          </button>
          <button className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <BarChart2 className="w-6 h-6" />
          </button>
          <button className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <User className="w-6 h-6" />
          </button>
        </motion.div>
      </div>

      {/* Install Modal Fallback */}
      <AnimatePresence>
        {showInstallModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInstallModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <ArrowUpFromLine className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-center mb-2">Install App</h3>
              <p className="text-gray-500 text-center text-sm mb-8 leading-relaxed">
                To install this app natively on your device:
                <br/><br/>
                <span className="font-bold text-gray-900">iOS (Safari):</span> Tap the <span className="font-bold">Share</span> icon at the bottom, then select <span className="font-bold">"Add to Home Screen"</span>.
                <br/><br/>
                <span className="font-bold text-gray-900">Android (Chrome):</span> Tap the <span className="font-bold">Menu</span> (⋮) and select <span className="font-bold">"Add to Home screen"</span>.
              </p>
              <button 
                onClick={() => setShowInstallModal(false)}
                className="w-full py-4 bg-[#1A1A24] text-white rounded-2xl font-bold hover:bg-black transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  ) : (
    <motion.div
      key="pushups"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`min-h-screen transition-colors duration-700 ${isTraining ? 'bg-[#0A0A0F]' : 'bg-[#F3F2FA]'} p-6 max-w-2xl mx-auto relative overflow-hidden`}
    >
      {/* Decorative Background Elements for Dark Mode */}
      <AnimatePresence>
        {isTraining && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"
            />
          </>
        )}
      </AnimatePresence>

      {/* Pushups Page Header */}
      <div className="flex items-center justify-between mb-8 pt-6 relative z-10">
        <button 
          onClick={() => {
            if (isTraining) {
              resetTraining();
            } else {
              setCurrentView('dashboard');
            }
          }}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isTraining ? 'bg-white/5 text-white border border-white/10 backdrop-blur-md' : 'bg-white shadow-sm text-gray-600 border border-gray-100'}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className={`text-xl font-black tracking-tight transition-colors duration-500 ${isTraining ? 'text-white' : 'text-gray-900'}`}>
          {isTraining ? 'Training Session' : 'Push Up Counter'}
        </h2>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isTraining ? 'bg-white/5 text-white border border-white/10 backdrop-blur-md opacity-50' : 'bg-white shadow-sm text-gray-600 border border-gray-100'}`}
          disabled={isTraining}
        >
          <Settings2 className="w-6 h-6" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isTraining ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 relative z-10"
          >
            {/* Pushup Man Logo Area */}
            <div className="flex flex-col items-center justify-center mb-4">
              <motion.div 
                layoutId="logo-container"
                className="w-24 h-24 rounded-[2.5rem] bg-emerald-100 flex items-center justify-center shadow-inner mb-4"
              >
                <BicepsFlexed className="w-12 h-12 text-emerald-600" />
              </motion.div>
              <p className="text-gray-500 font-bold text-center px-8 text-sm uppercase tracking-widest">
                Set your goal
              </p>
            </div>

            {/* Mode Selection */}
            <div className="bg-white rounded-[2.5rem] p-1.5 flex relative shadow-sm border border-gray-100 overflow-hidden">
              <motion.div
                layoutId="mode-bg"
                className="absolute top-1.5 bottom-1.5 bg-[#1A1A24] rounded-2xl shadow-lg"
                initial={false}
                animate={{
                  left: pushupMode === 'continuous' ? '6px' : pushupMode === 'step' ? 'calc(33.33% + 2px)' : 'calc(66.66% + 2px)',
                  width: 'calc(33.33% - 8px)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              {(['continuous', 'step', 'free'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPushupMode(m)}
                  className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors relative z-10 ${pushupMode === m ? 'text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            <motion.div layout className="space-y-6">
              <AnimatePresence mode="popLayout">
                {pushupMode !== 'free' && (
                  <motion.div
                    key="presets-and-inputs"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    {/* Presets */}
                    <div className="grid grid-cols-4 gap-3">
                      {[10, 15, 20, 30].map((num) => (
                        <button
                          key={num}
                          onClick={() => setTargetPushups(num)}
                          className={`py-4 rounded-3xl font-black transition-all ${targetPushups === num ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200' : 'bg-white text-gray-600 border border-gray-100'}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    {/* Manual Input & Step Settings */}
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Target Goal</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setTargetPushups(Math.max(1, targetPushups - 1))} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">-</button>
                          <input 
                            type="number"
                            value={targetPushups}
                            onChange={(e) => setTargetPushups(parseInt(e.target.value) || 0)}
                            className="text-2xl font-black w-14 text-center tabular-nums bg-transparent border-none focus:ring-0 p-0"
                          />
                          <button onClick={() => setTargetPushups(targetPushups + 1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">+</button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {pushupMode === 'step' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6 pt-6 border-t border-gray-50 overflow-hidden"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Pushups per Set</span>
                              <div className="flex items-center gap-3">
                                <button onClick={() => setPushupsPerSet(Math.max(1, pushupsPerSet - 1))} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600">-</button>
                                <input 
                                  type="number"
                                  value={pushupsPerSet}
                                  onChange={(e) => setPushupsPerSet(parseInt(e.target.value) || 0)}
                                  className="text-2xl font-black w-14 text-center tabular-nums bg-transparent border-none focus:ring-0 p-0"
                                />
                                <button onClick={() => setPushupsPerSet(pushupsPerSet + 1)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600">+</button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Rest Duration</span>
                              <div className="flex items-center gap-3">
                                <button onClick={() => setRestTime(Math.max(5, restTime - 5))} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600">-</button>
                                <div className="flex items-center justify-center w-14">
                                  <input 
                                    type="number"
                                    value={restTime}
                                    onChange={(e) => setRestTime(parseInt(e.target.value) || 0)}
                                    className="text-2xl font-black w-10 text-center tabular-nums bg-transparent border-none focus:ring-0 p-0"
                                  />
                                  <span className="text-sm font-black text-gray-300 ml-0.5">s</span>
                                </div>
                                <button onClick={() => setRestTime(restTime + 5)} className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600">+</button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button 
              layout
              onClick={startTraining}
              className="w-full py-6 bg-emerald-500 rounded-[2.5rem] text-white font-black text-xl shadow-2xl shadow-emerald-200/50 flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-6 h-6 fill-current" />
              START SESSION
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="training"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -30 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex flex-col items-center justify-center gap-12 relative z-10"
          >
            {/* Session Info */}
            <div className="text-center">
              <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">
                {pushupMode} mode
              </p>
              {pushupMode === 'step' && (
                <p className="text-white/40 font-bold text-xs uppercase tracking-widest">
                  Set {setsCompleted + 1} of {Math.ceil(targetPushups / pushupsPerSet)}
                </p>
              )}
            </div>

            {/* Big Circular Counter - Premium Dark Mode */}
            <div className="relative w-80 h-80">
              {/* Outer Glow Ring */}
              <div className={`absolute inset-0 rounded-full blur-3xl transition-colors duration-1000 ${isResting ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`} />
              
              {/* Background Ring */}
              <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <circle
                  cx="160"
                  cy="160"
                  r="145"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="16"
                />
                <motion.circle
                  cx="160"
                  cy="160"
                  r="145"
                  fill="none"
                  stroke={isResting ? "#F59E0B" : "#10B981"}
                  strokeWidth="16"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: isResting 
                      ? restTimeRemaining / restTime 
                      : pushupMode === 'free' ? 1 : currentPushups / targetPushups 
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>

              {/* Counter Content - Glassmorphism */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handlePushupClick}
                disabled={isResting}
                className={`absolute inset-6 rounded-full flex flex-col items-center justify-center transition-all duration-500 border border-white/10 backdrop-blur-2xl shadow-2xl ${isResting ? 'bg-amber-500/5' : 'bg-white/5 hover:bg-white/10'}`}
              >
                <AnimatePresence mode="wait">
                  {isResting ? (
                    <motion.div
                      key="rest"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      className="flex flex-col items-center"
                    >
                      <Timer className="w-12 h-12 text-amber-500 mb-4 animate-pulse" />
                      <span className="text-6xl font-black text-white tabular-nums tracking-tighter">{restTimeRemaining}s</span>
                      <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] mt-4">Resting</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="count"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-9xl font-black text-white leading-none tracking-tighter tabular-nums drop-shadow-2xl">
                        {currentPushups}
                      </span>
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-6">
                        {pushupMode === 'free' ? 'Pushups Done' : 'Remaining'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Controls */}
            <div className="flex gap-4 w-full px-10">
              <button 
                onClick={resetTraining}
                className="flex-1 py-4 bg-white/5 rounded-2xl text-white/60 font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 backdrop-blur-md flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Stop
              </button>
              {currentPushups === 0 && pushupMode !== 'free' && (
                <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} className="flex-1">
                  <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="w-full py-4 bg-emerald-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Finish
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )}
</AnimatePresence>

    <SpeedInsights />
    </div>
  );
}
