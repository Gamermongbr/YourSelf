/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Home, LayoutGrid, BarChart2, User, ChevronDown, Activity, Brain, Scale, Calendar, Clock, Flower2, BookOpen, BicepsFlexed, Dumbbell, Target, Flag, Trophy, Book, FileText, GraduationCap, UserCircle, Pencil, TrendingUp, CalendarDays, AlertCircle, ArrowUpFromLine, Quote, BookOpenText, Paperclip, Plus, Compass, Smile, Meh, Frown, PenLine } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCycleExpanded, setIsCycleExpanded] = useState(false);
  const [isNotebookExpanded, setIsNotebookExpanded] = useState(false);

  // Update date every second for real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors shrink-0">
          <Search className="w-5 h-5 text-gray-600" />
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
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#C1F0D0] rounded-3xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer">
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
            <div className="mb-8">
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
            onClick={() => setActiveTab('home')}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${activeTab === 'home' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <Home className={`w-6 h-6 ${activeTab === 'home' ? 'text-[#1A1A24]' : ''}`} />
          </button>
          <button 
            onClick={() => setActiveTab('grid')}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${activeTab === 'grid' ? 'bg-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutGrid className={`w-6 h-6 ${activeTab === 'grid' ? 'text-[#1A1A24]' : ''}`} />
          </button>
          <button className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <BarChart2 className="w-6 h-6" />
          </button>
          <button className="w-14 h-14 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <User className="w-6 h-6" />
          </button>
        </motion.div>
      </div>

    </div>
  );
}
