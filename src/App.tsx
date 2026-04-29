/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LuminaTrigger } from './components/LuminaTrigger';
import { SpatialMatrix } from './components/SpatialMatrix';
import { CognitivePrism } from './components/CognitivePrism';
import { Onboarding } from './components/Onboarding';
import { Search, Home, LayoutGrid, BarChart2, User, ChevronDown, Activity, Brain, Scale, Calendar, Clock, Flower2, BookOpen, BicepsFlexed, Dumbbell, Target, Flag, Trophy, Book, FileText, GraduationCap, UserCircle, Pencil, TrendingUp, CalendarDays, AlertCircle, ArrowUpFromLine, Quote, BookOpenText, Paperclip, Plus, Compass, Smile, Meh, Frown, PenLine, Accessibility, Zap, Timer, StretchHorizontal, MousePointerClick, Flame, Eye, Utensils, Swords, Music, Radio, Youtube, Instagram, ArrowLeft, ArrowRight, Play, RotateCcw, Settings2, CheckCircle2, Camera, CameraOff, Sparkles, MoreVertical, GripVertical, Trash2, ChevronUp, ChevronDown as ChevronDownIcon, Hexagon } from 'lucide-react';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera as MediaPipeCamera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentView, setCurrentView] = useState('dashboard');
  const [notebookView, setNotebookView] = useState<'grid' | 'edit'>('grid');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCycleExpanded, setIsCycleExpanded] = useState(false);
  const [isNotebookExpanded, setIsNotebookExpanded] = useState(false);

  // Profile State
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nxa_profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    } else {
      setCurrentView('onboarding');
    }
  }, []);

  // Pushup Counter States
  const [pushupMode, setPushupMode] = useState<'free' | 'continuous' | 'step'>(() => {
    const saved = localStorage.getItem('nxa_pushup_mode');
    return (saved as any) || 'continuous';
  });
  const [targetPushups, setTargetPushups] = useState(() => {
    const saved = localStorage.getItem('nxa_target_pushups');
    return saved ? parseInt(saved, 10) : 15;
  });
  const [pushupsPerSet, setPushupsPerSet] = useState(() => {
    const saved = localStorage.getItem('nxa_pushups_per_set');
    return saved ? parseInt(saved, 10) : 10;
  });
  const [restTime, setRestTime] = useState(() => {
    const saved = localStorage.getItem('nxa_rest_time');
    return saved ? parseInt(saved, 10) : 30;
  });

  useEffect(() => {
    localStorage.setItem('nxa_pushup_mode', pushupMode);
    localStorage.setItem('nxa_target_pushups', targetPushups.toString());
    localStorage.setItem('nxa_pushups_per_set', pushupsPerSet.toString());
    localStorage.setItem('nxa_rest_time', restTime.toString());
  }, [pushupMode, targetPushups, pushupsPerSet, restTime]);
  const [currentPushups, setCurrentPushups] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [aiCameraEnabled, setAiCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // AI Tracking Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const isDownRef = useRef(false);
  const angleHistoryRef = useRef<number[]>([]);
  const lastCountTimeRef = useRef(0);

  // Use refs to store latest state for AI tracking loop to avoid stale closures
  const stateRef = useRef({
    isTraining,
    isResting,
    pushupMode,
    targetPushups,
    pushupsPerSet,
    restTime,
    currentPushups
  });

  useEffect(() => {
    stateRef.current = {
      isTraining,
      isResting,
      pushupMode,
      targetPushups,
      pushupsPerSet,
      restTime,
      currentPushups
    };
  }, [isTraining, isResting, pushupMode, targetPushups, pushupsPerSet, restTime, currentPushups]);

  // PWA Install States
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Goals State
  const [goals, setGoals] = useState<{ id: string; text: string; completed: boolean; priority: 'high' | 'medium' | 'low'; category: string; time?: string; date: string }[]>(() => {
    const saved = localStorage.getItem('nxa_goals');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nxa_goals', JSON.stringify(goals));
  }, [goals]);
  const [goalFilter, setGoalFilter] = useState<'all' | 'active' | 'done'>('active');
  const [goalSort, setGoalSort] = useState('priority');
  const [selectedGoalDate, setSelectedGoalDate] = useState<Date>(new Date());
  const [viewedDate, setViewedDate] = useState<Date>(new Date());
  const [showHomeCalendar, setShowHomeCalendar] = useState(false);
  const [showGoalCalendar, setShowGoalCalendar] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalTime, setNewGoalTime] = useState('');
  const [newGoalHour, setNewGoalHour] = useState('12');
  const [newGoalMinute, setNewGoalMinute] = useState('00');
  const [newGoalPeriod, setNewGoalPeriod] = useState<'AM' | 'PM'>('PM');
  const [newGoalPriority, setNewGoalPriority] = useState('medium');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [managementMode, setManagementMode] = useState<'none' | 'delete' | 'reorder'>('none');
  const [showManagementMenu, setShowManagementMenu] = useState(false);
  const [isNoteEditMode, setIsNoteEditMode] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  // Sticky Notes State
  const [stickyNotes, setStickyNotes] = useState<{ id: string; text: string; color: string; rotation: number }[]>(() => {
    const saved = localStorage.getItem('nxa_notes');
    try {
      if (saved) return JSON.parse(saved);
      return [
        { id: '1', text: 'Buy groceries for the week 🛒', color: '#FEF3C7', rotation: -2 },
        { id: '2', text: 'Read 10 pages of Atomic Habits 📚', color: '#FCE7F3', rotation: 2 },
        { id: '3', text: 'Refine visual design for Lumina 💎', color: '#E0E7FF', rotation: -1 }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nxa_notes', JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  const addNote = (color: string) => {
    const newNote = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'New Note',
      color: color,
      rotation: (Math.random() * 4) - 2
    };
    setStickyNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, text: string) => {
    setStickyNotes(prev => prev.map(n => n.id === id ? { ...n, text } : n));
  };

  const deleteNote = (id: string) => {
    setStickyNotes(prev => prev.filter(n => n.id !== id));
  };

  // Capture the install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Sync body background color to prevent white overscroll bleed
  useEffect(() => {
    if ((currentView === 'pushups' && isTraining) || currentView === 'reflex') {
      document.body.style.backgroundColor = '#0A0A0F';
    } else {
      document.body.style.backgroundColor = '#F3F2FA';
    }
  }, [currentView, isTraining]);

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

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handlePushupClick = () => {
    const { isTraining: training, isResting: resting, pushupMode: mode, targetPushups: target, pushupsPerSet: setSize, restTime: rest } = stateRef.current;
    if (!training || resting) return;

    if (mode === 'free') {
      setCurrentPushups(prev => prev + 1);
    } else {
      setCurrentPushups(prev => {
        if (prev <= 0) return 0;
        const nextCount = prev - 1;

        // Step mode logic
        if (mode === 'step') {
          const totalDone = target - nextCount;
          if (totalDone % setSize === 0 && nextCount > 0) {
            setIsResting(true);
            setRestTimeRemaining(rest);
          }
        }

        if (nextCount === 0) {
          setIsTraining(false);
        }
        return nextCount;
      });
    }
  };

  const startTraining = () => {
    setCurrentPushups(pushupMode === 'free' ? 0 : targetPushups);
    setIsTraining(true);
    setIsResting(false);
    setSetsCompleted(0);
    isDownRef.current = false; // Reset AI state
    setCameraError(null); // Reset camera error
  };

  const calculateAngle = (a: any, b: any, c: any) => {
    if (!a || !b || !c) return 180;
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  // AI Camera Logic
  const cameraInitializedRef = useRef(false);

  useEffect(() => {
    if (!isTraining || !aiCameraEnabled) {
      cameraInitializedRef.current = false;
      return;
    }
    
    // Prevent multiple initializations in the same session
    if (cameraInitializedRef.current) return;
    cameraInitializedRef.current = true;

    let camera: MediaPipeCamera | null = null;
    let pose: Pose | null = null;
    let isActive = true;

    const setupPose = async () => {
      // Wait for DOM to stabilize
      await new Promise(resolve => setTimeout(resolve, 800));
      if (!isActive || !videoRef.current || !canvasRef.current) {
        cameraInitializedRef.current = false;
        return;
      }

      try {
        pose = new Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        pose.onResults((results: Results) => {
          if (!isActive || !canvasRef.current || !canvasRef.current.getContext('2d')) return;
          const canvasCtx = canvasRef.current.getContext('2d')!;

          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          // Mirror for natural movements (Selfie mode)
          canvasCtx.translate(canvasRef.current.width, 0);
          canvasCtx.scale(-1, 1);

          // Draw image
          canvasCtx.globalAlpha = 0.7;
          canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
          canvasCtx.globalAlpha = 1.0;

          if (results.poseLandmarks) {
            // High-def glowing geometry
            // Connectors
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { 
              color: isDownRef.current ? '#F59E0B' : '#10B981', 
              lineWidth: 5 
            });
            
            // Glowing Points
            drawLandmarks(canvasCtx, results.poseLandmarks, { 
              color: '#FFFFFF', 
              fillColor: isDownRef.current ? '#F59E0B' : '#10B981',
              lineWidth: 2, 
              radius: (data) => {
                // Highlight elbows and shoulders
                if ([11, 12, 13, 14, 15, 16].includes(data.index!)) return 6;
                return 2;
              }
            });

            // Calculate TORSO angle to ensure user is horizontal (Pushup Position)
            const leftShoulder = results.poseLandmarks[11];
            const leftHip = results.poseLandmarks[23];
            const torsoAngle = Math.abs(Math.atan2(leftHip.y - leftShoulder.y, leftHip.x - leftShoulder.x) * 180 / Math.PI);
            
            // In a horizontal pushup, the torso angle relative to horizontal should be small (e.g., < 45 degrees)
            // Or more simply, dx should be significantly larger than dy if the camera is side-on.
            // If the camera is front-on, it's harder, but usually Shoulders are above Hips in the image if standing.
            // Let's use a simpler heuristic: in a pushup, Shoulders and Hips are relatively close in Y-coordinate 
            // compared to standing where Hips are way below Shoulders.
            const isHorizontal = Math.abs(leftShoulder.y - leftHip.y) < 0.3; // Heuristic for horizontal-ish
            const isVisible = leftShoulder.visibility! > 0.5 && leftHip.visibility! > 0.5;
            const inPosition = isHorizontal && isVisible;

            // Calculate elbow angles
            const leftElbow = calculateAngle(results.poseLandmarks[11], results.poseLandmarks[13], results.poseLandmarks[15]);
            const rightElbow = calculateAngle(results.poseLandmarks[12], results.poseLandmarks[14], results.poseLandmarks[16]);
            const currentAngle = (leftElbow + rightElbow) / 2;

            // Simple smoothing (avg of last 5 frames for better stability)
            angleHistoryRef.current.push(currentAngle);
            if (angleHistoryRef.current.length > 5) angleHistoryRef.current.shift();
            const smoothedAngle = angleHistoryRef.current.reduce((a, b) => a + b, 0) / angleHistoryRef.current.length;

            // UI Feedback on canvas
            canvasCtx.save();
            canvasCtx.scale(-1, 1); // Un-mirror for text
            canvasCtx.translate(-canvasRef.current.width, 0);
            
            if (!inPosition) {
              canvasCtx.fillStyle = "rgba(239, 68, 68, 0.8)"; // Red for out of position
              canvasCtx.font = "bold 20px Inter";
              canvasCtx.fillText("GET IN POSITION", 30, 60);
              canvasCtx.font = "12px Inter";
              canvasCtx.fillText("Align body horizontally", 30, 85);
            } else {
              canvasCtx.font = "bold 24px Inter";
              canvasCtx.fillStyle = isDownRef.current ? "#F59E0B" : "#10B981";
              canvasCtx.fillText(isDownRef.current ? "GO UP!" : "GO DOWN!", 30, 60);
              
              // Logic for counting: only if in position
              if (smoothedAngle < 115 && !isDownRef.current && !stateRef.current.isResting) {
                isDownRef.current = true;
              } else if (smoothedAngle > 145 && isDownRef.current && !stateRef.current.isResting) {
                const now = Date.now();
                if (now - lastCountTimeRef.current > 800) {
                  isDownRef.current = false;
                  lastCountTimeRef.current = now;
                  if (window.navigator.vibrate) window.navigator.vibrate(50);
                  handlePushupClick();
                }
              }
            }
            
            // Tiny angle debug
            canvasCtx.font = "12px JetBrains Mono";
            canvasCtx.fillStyle = "rgba(255,255,255,0.5)";
            canvasCtx.fillText(`Angle: ${Math.round(smoothedAngle)}° | Torso: ${Math.round(torsoAngle)}°`, 30, canvasRef.current.height - 30);
            canvasCtx.restore();
          }
          canvasCtx.restore();
        });

        if (videoRef.current) {
          camera = new MediaPipeCamera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current && pose && isActive) {
                await pose.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });
          await camera.start().catch((err) => {
            console.error("Camera start failed:", err);
            setCameraError("permission_denied");
            cameraInitializedRef.current = false;
          });
        }
      } catch (err) {
        console.error("Camera setup failed:", err);
        setCameraError("setup_failed");
        cameraInitializedRef.current = false;
      }
    };

    setupPose();

    return () => {
      isActive = false;
      if (camera) camera.stop();
      if (pose) pose.close();
      angleHistoryRef.current = [];
    };
  }, [isTraining, aiCameraEnabled]);

  const resetTraining = () => {
    setIsTraining(false);
    setIsResting(false);
    setCurrentPushups(0);
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const addGoal = () => {
    if (!newGoalText.trim()) return;
    const finalTime = `${newGoalHour}:${newGoalMinute} ${newGoalPeriod}`;
    const newGoal = {
      id: Math.random().toString(36).substr(2, 9),
      text: newGoalText,
      time: finalTime,
      date: getLocalDateString(selectedGoalDate),
      completed: false,
      priority: newGoalPriority as any,
      category: 'Personal'
    };
    setGoals(prev => [newGoal, ...prev]);
    setNewGoalText('');
    setNewGoalHour('12');
    setNewGoalMinute('00');
    setNewGoalPeriod('PM');
    setShowAddGoal(false);
  };

  const moveGoal = (id: string, direction: 'up' | 'down') => {
    setGoals(prev => {
      const idx = prev.findIndex(g => g.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const newGoals = [...prev];
      [newGoals[idx], newGoals[newIdx]] = [newGoals[newIdx], newGoals[idx]];
      return newGoals;
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const activeDateStr = getLocalDateString(selectedGoalDate);
  const goalsForDate = goals.filter(g => g.date === activeDateStr);

  const sortedGoals = [...goalsForDate].sort((a, b) => {
    if (goalSort === 'priority') {
      const priorityOrder: any = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (goalSort === 'completed') {
      return Number(a.completed) - Number(b.completed);
    }
    return 0;
  });

  const filteredGoals = sortedGoals.filter(g => {
    if (goalFilter === 'active') return !g.completed;
    if (goalFilter === 'done') return g.completed;
    return true;
  });

  const goalProgress = goalsForDate.length > 0 
    ? Math.round((goalsForDate.filter(g => g.completed).length / goalsForDate.length) * 100) 
    : 0;

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
    <div className={`min-h-screen font-sans text-gray-900 relative pb-32 overflow-x-clip transition-colors duration-300 ${currentView === 'pushups' && isTraining || currentView === 'reflex' ? 'bg-[#0A0A0F]' : 'bg-[#F3F2FA]'}`}>
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ willChange: "opacity" }}
          >
            {/* Top Bar */}
            <header className="flex items-center justify-between px-6 pt-12 pb-4 max-w-2xl mx-auto">
        <button 
          onClick={() => {
            if (confirm('Reset your profile and data? This will clear all your goals, scores, and settings.')) {
              localStorage.removeItem('nxa_profile');
              localStorage.removeItem('nxa_goals');
              localStorage.removeItem('nxa_pushup_mode');
              localStorage.removeItem('nxa_target_pushups');
              localStorage.removeItem('nxa_pushups_per_set');
              localStorage.removeItem('nxa_rest_time');
              localStorage.removeItem('nxa_best_lumina');
              localStorage.removeItem('nxa_best_spatial');
              localStorage.removeItem('nxa_best_cognitive');
              localStorage.removeItem('nxa_notes');
              
              // Reset local state
              setUserProfile(null);
              setGoals([]);
              setStickyNotes([
                { id: '1', text: 'Buy groceries for the week 🛒', color: '#FEF3C7', rotation: -2 },
                { id: '2', text: 'Read 10 pages of Atomic Habits 📚', color: '#FCE7F3', rotation: 2 },
                { id: '3', text: 'Refine visual design for Lumina 💎', color: '#E0E7FF', rotation: -1 }
              ]);
              setPushupMode('continuous');
              setTargetPushups(15);
              setPushupsPerSet(10);
              setRestTime(30);
              setCurrentView('onboarding');
            }
          }}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 active:scale-95 transition-transform"
        >
          <img 
            src={userProfile?.avatarUrl || "https://picsum.photos/seed/nature-default/100/100"}
            alt="Profile" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
        <div className="text-center px-4">
          <h1 className="text-lg font-semibold tracking-tight truncate">Hello, {userProfile?.name || 'Sandra'}</h1>
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
            {/* Daily Goals - Dynamic Styling based on progress */}
            <motion.div 
              onClick={() => setCurrentView('daily-goals')}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="bg-[#1A1A24] text-white rounded-3xl p-4 shadow-md flex flex-col items-center justify-center gap-2 text-center cursor-pointer relative overflow-hidden group min-h-[96px]"
            >
              {/* Cyan Finish Fade Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none" />
              
              <div className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md transition-colors duration-500 ${
                goalProgress === 100 ? 'text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]' :
                goalProgress >= 50 ? 'text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' :
                'text-yellow-400'
              }`}>
                <Target className="w-5 h-5 transition-colors" />
              </div>
              
              <span className="font-semibold text-sm relative z-10 transition-colors">Daily Goals</span>
              
              {/* Pie Chart Progress Indicator */}
              <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="2"
                    fill="transparent"
                    strokeOpacity="0.1"
                  />
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke={goalProgress === 100 ? "#10B981" : goalProgress >= 50 ? "#22D3EE" : "#FBBF24"}
                    strokeWidth="2"
                    fill="transparent"
                    strokeDasharray="62.83"
                    initial={{ strokeDashoffset: 62.83 }}
                    animate={{ strokeDashoffset: 62.83 - (62.83 * goalProgress) / 100 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                {goalProgress === 100 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  </motion.div>
                )}
              </div>
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
              <span className="font-semibold text-sm">Sticky Notes</span>
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
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select Theme</h4>
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
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="bg-[#E0D6FF] rounded-3xl p-4 shadow-sm flex flex-col gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-bold text-gray-900 leading-tight">Neurology</span>
            </motion.div>

            {/* Calendar */}
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={(e) => {
                e.stopPropagation();
                setViewedDate(new Date());
                setShowHomeCalendar(true);
              }}
              className="bg-[#D6E4FF] rounded-3xl p-4 shadow-sm flex flex-col justify-between gap-3 cursor-pointer"
            >
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Personal Data</h3>
            <span className="text-[10px] font-black py-1 px-2 bg-white rounded-lg border border-gray-100 text-gray-400 uppercase tracking-widest">{userProfile?.isGuest ? 'Guest' : 'Verified'}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-1 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="font-bold text-sm text-gray-900">{userProfile?.height || '---'}</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Height</span>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-1 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <Scale className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-bold text-sm text-gray-900">{userProfile?.weight || '---'}</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Weight</span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-1 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <UserCircle className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-bold text-sm text-gray-900">{userProfile?.age || '---'}</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Age</span>
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
                Hello, {userProfile?.name || 'Sandra'} <br/>
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
                <button 
                  onClick={() => setCurrentView('notebook')}
                  className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all active:scale-90 shadow-lg"
                >
                  <PenLine className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {(isNotesExpanded ? stickyNotes : stickyNotes.slice(0, 4)).map((note) => (
                    <motion.div 
                      key={note.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, rotate: note.rotation }}
                      animate={{ opacity: 1, scale: 1, rotate: note.rotation }}
                      whileHover={{ scale: 1.02, rotate: 0 }}
                      onClick={() => setCurrentView('notebook')}
                      className="rounded-2xl p-4 shadow-sm relative flex flex-col justify-center h-32 cursor-pointer"
                      style={{ backgroundColor: note.color }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-gray-300/80 rounded-full shadow-sm border border-gray-400/30 backdrop-blur-sm"></div>
                      <p className={`font-medium text-center leading-tight line-clamp-3 ${
                        note.color === '#FEF3C7' ? 'text-yellow-900' :
                        note.color === '#FCE7F3' ? 'text-pink-900' :
                        note.color === '#E0E7FF' ? 'text-indigo-900' :
                        note.color === '#D1FAE5' ? 'text-emerald-900' :
                        'text-gray-900'
                      }`}>
                        {note.text}
                      </p>
                    </motion.div>
                  ))}
                  {stickyNotes.length === 0 && (
                    <motion.div 
                      onClick={() => setCurrentView('notebook')}
                      className="col-span-2 h-32 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1 group-hover:bg-gray-200 transition-colors">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Note</span>
                    </motion.div>
                  )}
                  {stickyNotes.length > 4 && (
                    <motion.button
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNotesExpanded(!isNotesExpanded);
                      }}
                      className="col-span-2 py-3 bg-white/50 rounded-2xl border border-gray-100 text-[#007AFF] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-2 group"
                    >
                      {isNotesExpanded ? (
                        <>Show Less <ChevronUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" /></>
                      ) : (
                        <>View All Notes (+{stickyNotes.length - 4}) <ChevronDownIcon className="w-3 h-3 group-hover:translate-y-1 transition-transform" /></>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
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
                    onClick={() => {
                      if (item.title === 'Reaction Reflex') {
                        setCurrentView('reflex');
                      }
                    }}
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
      {currentView === 'dashboard' && (
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
      )}

    </motion.div>
  ) : currentView === 'notebook' ? (
    <motion.div
      key="notebook-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="min-h-screen bg-[#F2F2F7] p-6 max-w-2xl mx-auto pb-32"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#007AFF] shadow-sm border border-gray-100 hover:scale-105 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight leading-tight">Sticky Notes</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Management & Reorder</p>
          </div>
        </div>
        <button 
          onClick={() => setIsNoteEditMode(!isNoteEditMode)}
          className={`px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all ${isNoteEditMode ? 'bg-rose-500 text-white' : 'bg-[#1A1A24] text-white'}`}
        >
          {isNoteEditMode ? 'Done' : 'Arrange'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Color Palette / Actions */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Create New Note</p>
           <div className="flex items-center justify-center gap-4">
              {[
                { name: 'Lemon', hex: '#FEF3C7' },
                { name: 'Rose', hex: '#FCE7F3' },
                { name: 'Lavender', hex: '#E0E7FF' },
                { name: 'Mint', hex: '#D1FAE5' }
              ].map(color => (
                <motion.button 
                  key={color.name}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => addNote(color.hex)}
                  className="w-12 h-12 rounded-2xl shadow-md border-4 border-white active:scale-95 transition-transform"
                  style={{ backgroundColor: color.hex }}
                  title={`Add ${color.name} note`}
                />
              ))}
              <div className="w-[1px] h-8 bg-gray-100 mx-1" />
              <motion.button 
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addNote('#FFFFFF')}
                className="w-12 h-12 rounded-2xl bg-[#1C1C1E] flex items-center justify-center text-white shadow-xl shadow-gray-300"
              >
                <Plus className="w-6 h-6" />
              </motion.button>
           </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {stickyNotes.map((note, idx) => (
              <motion.div 
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, rotate: isNoteEditMode ? 0 : note.rotation }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: isNoteEditMode ? 1 : 1.05, zIndex: 10 }}
                className={`rounded-[2rem] p-6 shadow-xl relative min-h-[220px] flex flex-col justify-between transition-shadow border-4 border-white ${isNoteEditMode ? 'ring-2 ring-[#007AFF] ring-offset-4' : ''}`}
                style={{ backgroundColor: note.color }}
              >
                {/* Tape Effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-gray-300/40 rounded-full shadow-sm border border-white/50 backdrop-blur-sm"></div>

                {isNoteEditMode && (
                  <>
                    <div className="absolute -top-3 -right-3 flex flex-col gap-2 z-20">
                      <button 
                        onClick={() => deleteNote(note.id)}
                        className="w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-rose-200 active:scale-90 transition-transform"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Position adjustment */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                      <button 
                        onClick={() => {
                          const newNotes = [...stickyNotes];
                          if (idx > 0) {
                            [newNotes[idx], newNotes[idx-1]] = [newNotes[idx-1], newNotes[idx]];
                            setStickyNotes(newNotes);
                          }
                        }}
                        className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md active:scale-90 disabled:opacity-30"
                        disabled={idx === 0}
                      >
                        <ChevronUp className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => {
                          const newNotes = [...stickyNotes];
                          if (idx < stickyNotes.length - 1) {
                            [newNotes[idx], newNotes[idx+1]] = [newNotes[idx+1], newNotes[idx]];
                            setStickyNotes(newNotes);
                          }
                        }}
                        className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md active:scale-90 disabled:opacity-30"
                        disabled={idx === stickyNotes.length - 1}
                      >
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Quick Color Change */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-2xl p-1.5 shadow-lg border border-gray-100 flex gap-2 z-20">
                      {['#FEF3C7', '#FCE7F3', '#E0E7FF', '#D1FAE5', '#FFFFFF'].map(c => (
                        <button 
                          key={c}
                          onClick={() => setStickyNotes(prev => prev.map(n => n.id === note.id ? { ...n, color: c } : n))}
                          className={`w-5 h-5 rounded-lg border border-gray-200 ${note.color === c ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </>
                )}

                <textarea
                  value={note.text}
                  onChange={(e) => updateNote(note.id, e.target.value)}
                  className={`w-full h-full bg-transparent border-none focus:ring-0 resize-none font-bold text-center leading-relaxed text-sm pt-2 ${
                    note.color === '#FEF3C7' ? 'text-yellow-900 placeholder-yellow-900/30' :
                    note.color === '#FCE7F3' ? 'text-pink-900 placeholder-pink-900/30' :
                    note.color === '#E0E7FF' ? 'text-indigo-900 placeholder-indigo-900/30' :
                    note.color === '#D1FAE5' ? 'text-emerald-900 placeholder-emerald-900/30' :
                    'text-gray-900'
                  }`}
                  placeholder="Note content..."
                />

                <div className="flex items-center justify-center pt-2 pb-1">
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-20">nexa.note</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {stickyNotes.length === 0 && (
          <div className="text-center py-20">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                <Quote className="w-8 h-8 text-gray-200" />
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Your Sticky Notes are empty.</p>
          </div>
        )}
      </div>
    </motion.div>
  ) : currentView === 'daily-goals' ? (
    <motion.div
      key="daily-goals"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[#F3F2FA] p-6 max-w-2xl mx-auto pb-32"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Focus Daily</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            {selectedGoalDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setViewedDate(selectedGoalDate);
            setShowGoalCalendar(true);
          }}
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <LayoutGrid className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Progress Card */}
      <motion.div 
        layout
        className="bg-[#1A1A24] rounded-[2.5rem] p-8 text-white mb-8 relative overflow-hidden shadow-2xl"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="w-2/3">
            <h3 className="text-3xl font-black leading-none mb-4">Consistency<br/>is key.</h3>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{goalsForDate.filter(g => g.completed).length} of {goalsForDate.length} completed</p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden w-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress}%` }}
                className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              />
            </div>
          </div>
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
              <motion.circle 
                cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="8" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: goalProgress / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute font-black text-lg">{goalProgress}%</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px]"></div>
      </motion.div>

      {/* Filters & Sorting & Management */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex-1">
          {(['all', 'active', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setGoalFilter(f)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${goalFilter === f ? 'bg-[#1A1A24] text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setGoalSort(goalSort === 'priority' ? 'completed' : 'priority')}
            className="flex items-center gap-2 px-3 h-10 bg-white rounded-2xl shadow-sm text-gray-400 border border-gray-100 hover:text-gray-900 transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">{goalSort === 'priority' ? 'Priority' : 'Status'}</span>
          </button>

          <button 
            onClick={() => setShowManagementMenu(!showManagementMenu)}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${showManagementMenu ? 'bg-[#1A1A24] text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 shadow-sm'}`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {showManagementMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-12 right-0 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-[60]"
              >
                {[
                  { id: 'none', label: 'View Mode', icon: Target },
                  { id: 'delete', label: 'Delete Mode', icon: Trash2 },
                  { id: 'reorder', label: 'Reorder Mode', icon: GripVertical },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setManagementMode(mode.id as any);
                      setShowManagementMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${managementMode === mode.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <mode.icon className="w-4 h-4" />
                    {mode.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Goal List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredGoals.length > 0 ? filteredGoals.map((goal) => (
            <motion.div
              key={goal.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileHover={managementMode === 'none' ? { y: -2 } : {}}
              className={`group relative rounded-[2rem] p-5 shadow-sm border transition-all overflow-hidden ${
                goal.completed 
                  ? 'bg-emerald-50/30 border-emerald-100' 
                  : 'bg-white border-gray-100 hover:shadow-md'
              }`}
            >
              {/* Background completion wash */}
              <motion.div 
                initial={false}
                animate={{ width: goal.completed ? '100%' : '0%' }}
                className="absolute inset-0 bg-emerald-50 z-0 pointer-events-none"
              />

              <div className="relative z-10 flex items-center gap-4">
                {managementMode === 'reorder' ? (
                  <div className="text-gray-300 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                  </div>
                ) : (
                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleGoal(goal.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      goal.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                        : 'border-gray-200 hover:border-emerald-500'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {goal.completed ? (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <CheckCircle2 className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      goal.priority === 'high' ? 'bg-rose-500' : 
                      goal.priority === 'medium' ? 'bg-amber-500' : 
                      'bg-blue-400'
                    }`}></span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {goal.category} {goal.time && (
                        <span className="ml-1 flex items-center gap-1 inline-flex">
                          <span className="text-gray-300">• {goal.time}</span>
                          {(() => {
                            try {
                              const [timeStr, period] = goal.time.split(' ');
                              const [hours, minutes] = timeStr.split(':').map(Number);
                              const goalDate = new Date();
                              let h = hours;
                              if (period === 'PM' && h < 12) h += 12;
                              if (period === 'AM' && h === 12) h = 0;
                              goalDate.setHours(h, minutes, 0, 0);
                              
                              if (!goal.completed && goalDate < new Date()) {
                                return (
                                  <motion.span 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="px-1 bg-rose-100 text-rose-600 rounded-[4px] text-[8px] font-black uppercase tracking-tighter"
                                  >
                                    DUE
                                  </motion.span>
                                );
                              }
                            } catch (e) {}
                            return null;
                          })()}
                        </span>
                      )}
                    </p>
                    {goal.completed && (
                      <motion.span 
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                        className="text-[9px] font-black uppercase text-emerald-600 tracking-tighter bg-emerald-100 px-1.5 py-0.5 rounded"
                      >
                        Completed
                      </motion.span>
                    )}
                  </div>
                  <h4 className={`text-base font-bold leading-tight transition-all ${goal.completed ? 'text-gray-400' : 'text-gray-900'}`}>
                    {goal.text}
                  </h4>
                </div>

                {managementMode === 'delete' && (
                  <motion.button 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteGoal(goal.id)}
                    className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 shadow-sm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                )}

                {managementMode === 'reorder' && (
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveGoal(goal.id, 'up')} 
                      className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all border border-gray-100"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveGoal(goal.id, 'down')} 
                      className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-all border border-gray-100"
                    >
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                <Smile className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">No goals found</p>
              <p className="text-gray-300 text-xs mt-1">Ready to start your day?</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Goal FAB & Modal */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        <AnimatePresence>
          {showAddGoal ? (
            <motion.div 
              initial={{ width: 48, opacity: 0, y: 20 }}
              animate={{ width: 340, opacity: 1, y: 0 }}
              exit={{ width: 48, opacity: 0, y: 20 }}
              className="bg-[#1A1A24] rounded-[2.5rem] p-6 shadow-2xl border border-white/10 flex flex-col gap-5 overflow-hidden"
            >
              <div className="flex flex-col gap-2">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Task description..."
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  className="bg-transparent text-lg text-white font-bold placeholder-white/20 border-none focus:ring-0 p-0"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Priority</span>
                  <div className="flex gap-3">
                    {(['high', 'medium', 'low'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setNewGoalPriority(p)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                          p === 'high' ? (newGoalPriority === 'high' ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' : 'bg-transparent text-rose-500 border-rose-900/50') :
                          p === 'medium' ? (newGoalPriority === 'medium' ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-transparent text-amber-500 border-amber-900/50') :
                          (newGoalPriority === 'low' ? 'bg-blue-400 text-white border-blue-400 shadow-lg shadow-blue-400/20' : 'bg-transparent text-blue-400 border-blue-900/50')
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Deadline</span>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      <select 
                        value={newGoalHour}
                        onChange={(e) => setNewGoalHour(e.target.value)}
                        className="bg-transparent text-white text-xs font-bold border-none focus:ring-0 px-2 py-1 appearance-none cursor-pointer"
                      >
                        {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                          <option key={h} value={h} className="bg-[#1A1A24]">{h}</option>
                        ))}
                      </select>
                      <span className="text-white/40 py-1">:</span>
                      <select 
                        value={newGoalMinute}
                        onChange={(e) => setNewGoalMinute(e.target.value)}
                        className="bg-transparent text-white text-xs font-bold border-none focus:ring-0 px-2 py-1 appearance-none cursor-pointer"
                      >
                        {['00', '15', '30', '45'].map(m => (
                          <option key={m} value={m} className="bg-[#1A1A24]">{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                      {['AM', 'PM'].map(p => (
                        <button
                          key={p}
                          onClick={() => setNewGoalPeriod(p as any)}
                          className={`px-2 py-1 text-[10px] font-black transition-all ${newGoalPeriod === p ? 'bg-white text-[#1A1A24]' : 'text-white hover:bg-white/10'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 py-3 bg-white/5 text-white/60 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={addGoal}
                  className="flex-[2] py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-400 transition-all"
                >
                  Confirm Goal
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAddGoal(true)}
              className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30"
            >
              <Plus className="w-8 h-8" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  ) : currentView === 'reflex' ? (
    <motion.div
      key="reflex"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ willChange: "opacity, transform" }}
      className="min-h-screen bg-[#0A0A0F] text-white p-6 max-w-2xl mx-auto pb-32 font-sans relative"
    >
      <div className="fixed inset-0 bg-[#0A0A0F] z-[-1]"></div>
      {/* Background glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-black tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">Reflex & Agility</h2>
          <p className="text-[10px] font-bold text-violet-400 uppercase tracking-[0.2em]">Neurology Academy</p>
        </div>
        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center shadow-sm border border-cyan-500/20">
          <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Guidance Book (Replaces Hero) */}
      <div className="mb-10 relative z-10">
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }} 
          whileTap={{ scale: 0.98 }}
          className="relative bg-white/[0.04] backdrop-blur-2xl border border-cyan-500/30 hover:border-cyan-400/60 rounded-[2.5rem] p-8 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] cursor-pointer group transition-all"
        >
          {/* Subtle iOS glass gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-black/50 pointer-events-none"></div>

          {/* Mouse Click decorative icons replacing the rings */}
          <div className="absolute -top-4 -right-2 w-32 h-32 flex items-center justify-center opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
            <MousePointerClick className="w-full h-full text-cyan-400 transform -rotate-12" />
          </div>
          <div className="absolute bottom-4 right-16 w-16 h-16 flex items-center justify-center opacity-[0.03] group-hover:opacity-10 group-hover:-translate-y-4 transition-all duration-700">
            <MousePointerClick className="w-full h-full text-cyan-400 transform rotate-45" />
          </div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/50 border border-white/20">
              <BookOpenText className="w-7 h-7 text-white" />
            </div>
            <span className="bg-black/20 border border-white/10 text-white/80 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md">
              Read File
            </span>
          </div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold leading-tight mb-3 text-white tracking-tight">The Guidance<br/>Book.</h3>
            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-[240px]">
              Comprehensive literature on reducing latency, spatial tracking, and building fast-twitch visual muscles.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="space-y-10 relative z-10">
        {/* Reflex Games (Coming Soon Placeholders) */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-black text-white/90">Stimulus Lab</h3>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-1 rounded-full border border-cyan-500/20 flex items-center gap-1">
               <Flame className="w-3 h-3" /> Games
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Lumina Trigger Game */}
            <motion.div 
              onClick={() => setCurrentView('lumina')}
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A0F] rounded-[2rem] p-6 border border-cyan-500/30 shadow-2xl cursor-pointer group hover:border-cyan-400/60 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Visual Cortex</span>
                  </div>
                  <h4 className="text-2xl font-black text-white mb-1">Lumina Trigger</h4>
                  <p className="text-xs text-white/50 max-w-[200px] leading-relaxed">Classic color-shift reaction latency test. Tap the instant it turns cyan.</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10 transition-colors">
                  <Play className="w-6 h-6 text-white/60 group-hover:text-cyan-400 transition-colors ml-1" />
                </div>
              </div>
            </motion.div>

            {/* Spatial Matrix Game */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                onClick={() => setCurrentView('matrix')}
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                className="bg-[#1A1A24] rounded-[2rem] p-5 border border-white/5 cursor-pointer group hover:border-violet-500/40 transition-colors relative overflow-hidden shadow-lg"
              >
                 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-violet-500/10 rounded-full blur-xl group-hover:bg-violet-500/20 transition-colors"></div>
                 <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4 border border-violet-500/20">
                   <Target className="w-5 h-5 text-violet-400" />
                 </div>
                 <h4 className="text-sm font-bold text-white mb-1">Spatial Matrix</h4>
                 <p className="text-[10px] text-white/50 leading-relaxed pr-2">Identify targets across a 3x3 grid using peripheral vision.</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#1A1A24] rounded-[2rem] p-5 border border-white/5 cursor-pointer group hover:border-emerald-500/40 transition-colors relative overflow-hidden shadow-lg">
                 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors"></div>
                 <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20">
                   <Radio className="w-5 h-5 text-emerald-400" />
                 </div>
                 <h4 className="text-sm font-bold text-white mb-1">Echolocation</h4>
                 <p className="text-[10px] text-white/50 leading-relaxed pr-2">Auditory reaction processing. Tap when the frequency alters.</p>
              </motion.div>

              {/* Cognitive Prism (Shapes) */}
              <motion.div 
                onClick={() => setCurrentView('prism')}
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                className="bg-[#1A1A24] rounded-[2rem] p-5 border border-white/5 cursor-pointer group hover:border-amber-500/40 transition-colors relative overflow-hidden shadow-lg"
              >
                 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors"></div>
                 <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 border border-amber-500/20">
                   <Hexagon className="w-5 h-5 text-amber-400" />
                 </div>
                 <h4 className="text-sm font-bold text-white mb-1">Cognitive Prism</h4>
                 <p className="text-[10px] text-white/50 leading-relaxed pr-2">Identify and strike random multi-colored shapes quickly.</p>
              </motion.div>

              {/* Striker Reflex (Football) */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[#1A1A24] rounded-[2rem] p-5 border border-white/5 cursor-pointer group hover:border-blue-500/40 transition-colors relative overflow-hidden shadow-lg">
                 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
                 <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                   <Activity className="w-5 h-5 text-blue-400" />
                 </div>
                 <h4 className="text-sm font-bold text-white mb-1">Striker Reflex</h4>
                 <p className="text-[10px] text-white/50 leading-relaxed pr-2">Football tactical reaction. Scan and react to the pitch.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guidance */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-black text-white/90">Protocol Academy</h3>
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest bg-violet-400/10 px-2 py-1 rounded-full border border-violet-500/20">4 Steps</span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-[#1A1A24] rounded-3xl p-5 border border-white/5 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-cyan-500/10 transition-colors"></div>
              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-cyan-500/20">
                  <Eye className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">1. The Soft-Focus Technique</h4>
                  <p className="text-xs text-white/60 leading-relaxed">Don't stare directly at targets. Relax your gaze into a 'soft focus'. This allows your peripheral rods—which detect motion 15% faster than central cones—to trigger your reaction.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A24] rounded-3xl p-5 border border-white/5 relative overflow-hidden group hover:border-violet-500/30 transition-colors">
              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-violet-500/20">
                  <Zap className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">2. CNS Priming</h4>
                  <p className="text-xs text-white/60 leading-relaxed">Perform 10 seconds of explosive plyometrics (like rapid clapping or fast-feet) before a high-focus task. This "wakes up" your Central Nervous System and decreases latency.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A24] rounded-3xl p-5 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Activity className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">3. Electrolyte Optimization</h4>
                  <p className="text-xs text-white/60 leading-relaxed">Neurons fire using sodium and potassium. Even a 2% drop in hydration can add a 20-30ms delay to your cognitive reaction speed. Salt your water.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1A24] rounded-3xl p-5 border border-white/5 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
              <div className="flex gap-4 relative z-10">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-rose-500/20">
                  <Brain className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">4. Sleep Arbitration</h4>
                  <p className="text-xs text-white/60 leading-relaxed">Reaction time degrades exponentially with sleep loss. 6 hours of sleep yields a 50ms penalty compared to 8 hours. Deep sleep is when myelin sheaths (neural superhighways) repair.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  ) : currentView === 'onboarding' ? (
    <Onboarding onComplete={(profile) => {
      localStorage.setItem('nxa_profile', JSON.stringify(profile));
      setUserProfile(profile);
      setCurrentView('dashboard');
    }} />
  ) : currentView === 'lumina' ? (
    <LuminaTrigger onBack={() => setCurrentView('reflex')} />
  ) : currentView === 'matrix' ? (
    <SpatialMatrix onBack={() => setCurrentView('reflex')} />
  ) : currentView === 'prism' ? (
    <CognitivePrism onBack={() => setCurrentView('reflex')} />
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

            {/* AI Camera Toggle Card */}
            <motion.div 
              layout
              className={`rounded-[2.5rem] p-6 border transition-all duration-500 overflow-hidden ${aiCameraEnabled ? 'bg-emerald-500 border-emerald-400 shadow-xl shadow-emerald-200' : 'bg-white border-gray-100'}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${aiCameraEnabled ? 'bg-white/20' : 'bg-gray-50'}`}>
                    {aiCameraEnabled ? <Sparkles className="w-6 h-6 text-white" /> : <Camera className="w-6 h-6 text-gray-400" />}
                  </div>
                  <div>
                    <h4 className={`font-black text-sm uppercase tracking-widest ${aiCameraEnabled ? 'text-white' : 'text-gray-900'}`}>AI Camera Tracking</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-tight ${aiCameraEnabled ? 'text-white/70' : 'text-gray-400'}`}>
                      {aiCameraEnabled ? 'Motion detection active' : 'Count pushups automatically'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setAiCameraEnabled(!aiCameraEnabled)}
                  className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${aiCameraEnabled ? 'bg-white text-emerald-500 shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                >
                  {aiCameraEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              
              <AnimatePresence>
                {aiCameraEnabled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/20"
                  >
                    <p className="text-[10px] font-bold text-white/80 leading-relaxed uppercase tracking-widest">
                      Place your phone on the floor or lean it against a wall. Make sure your full body is visible in the frame.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>


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
                {aiCameraEnabled ? 'AI Vision' : pushupMode} mode
              </p>
              {pushupMode === 'step' && (
                <p className="text-white/40 font-bold text-xs uppercase tracking-widest">
                  Set {setsCompleted + 1} of {Math.ceil(targetPushups / pushupsPerSet)}
                </p>
              )}
            </div>

            {/* AI Camera Feed */}
            {aiCameraEnabled && (
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-[3rem] overflow-hidden bg-black/40 border border-white/10 shadow-2xl group flex items-center justify-center">
                <video ref={videoRef} className="hidden" playsInline muted />
                {!cameraError ? (
                  <canvas 
                    ref={canvasRef} 
                    width={640} 
                    height={853} 
                    className="w-full h-full object-cover rounded-[3rem] opacity-80"
                  />
                ) : (
                  <div className="px-8 text-center space-y-4">
                    <CameraOff className="w-12 h-12 text-white/20 mx-auto" />
                    <h5 className="text-white font-black text-sm uppercase tracking-widest">Camera Blocked</h5>
                    <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase tracking-widest">
                      Your browser is blocking the camera inside this window.
                    </p>
                    <button 
                      onClick={() => window.open(window.location.href, '_blank')}
                      className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                    >
                      Open in New Tab
                    </button>
                    <p className="text-[9px] text-emerald-400 font-black animate-pulse uppercase tracking-[0.2em]">
                      Required for AI Support
                    </p>
                  </div>
                )}
                
                {!cameraError && (
                  <>
                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Vision Active</span>
                    </div>
                    {/* Calibration Guide */}
                    <div className="absolute inset-x-8 bottom-8 text-center pointer-events-none">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors">
                        Position your full body in frame
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Big Circular Counter - Premium Dark Mode */}
            <div className={`relative transition-all duration-500 ${aiCameraEnabled ? 'w-56 h-56 -mt-16' : 'w-80 h-80'}`}>
              {/* Outer Glow Ring */}
              <div className={`absolute inset-0 rounded-full blur-3xl transition-colors duration-1000 ${isResting ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`} />
              
              {/* Background Ring */}
              <svg 
                viewBox="0 0 320 320"
                className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              >
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
                className={`absolute inset-4 rounded-full flex flex-col items-center justify-center transition-all duration-500 border border-white/10 backdrop-blur-2xl shadow-2xl ${isResting ? 'bg-amber-500/5' : 'bg-white/5 hover:bg-white/10'}`}
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
                      <Timer className={`${aiCameraEnabled ? 'w-6 h-6' : 'w-12 h-12'} text-amber-500 mb-2 animate-pulse`} />
                      <span className={`${aiCameraEnabled ? 'text-4xl' : 'text-6xl'} font-black text-white tabular-nums tracking-tighter`}>{restTimeRemaining}s</span>
                      <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] mt-2">Resting</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="count"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      className="flex flex-col items-center"
                    >
                      <span className={`${aiCameraEnabled ? 'text-6xl' : 'text-9xl'} font-black text-white leading-none tracking-tighter tabular-nums drop-shadow-2xl`}>
                        {currentPushups}
                      </span>
                      <span className={`font-black text-white/40 uppercase tracking-[0.4em] ${aiCameraEnabled ? 'text-[8px] mt-2' : 'text-[10px] mt-6'}`}>
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

      {/* Calendar Overlay */}
      <AnimatePresence>
        {(showHomeCalendar || showGoalCalendar) && (
          <motion.div 
            key="calendar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowHomeCalendar(false);
              setShowGoalCalendar(false);
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{viewedDate.toLocaleString('default', { month: 'long' })}</h3>
                  <p className="text-sm font-bold text-gray-400">{viewedDate.getFullYear()}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); const d = new Date(viewedDate); d.setMonth(d.getMonth() - 1); setViewedDate(d); }}
                    className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  ><ChevronUp className="w-5 h-5 -rotate-90 text-gray-400" /></button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); const d = new Date(viewedDate); d.setMonth(d.getMonth() + 1); setViewedDate(d); }}
                    className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  ><ChevronUp className="w-5 h-5 rotate-90 text-gray-400" /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <span key={day} className="text-[10px] font-black text-gray-400 uppercase">{day}</span>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: new Date(viewedDate.getFullYear(), viewedDate.getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`blank-${i}`} className="w-10 h-10 aspect-square" />
                ))}
                {Array.from({ length: new Date(viewedDate.getFullYear(), viewedDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = showGoalCalendar && 
                                     selectedGoalDate.getDate() === day && 
                                     selectedGoalDate.getMonth() === viewedDate.getMonth() && 
                                     selectedGoalDate.getFullYear() === viewedDate.getFullYear();
                  
                  const isToday = new Date().getDate() === day && 
                                  new Date().getMonth() === viewedDate.getMonth() && 
                                  new Date().getFullYear() === viewedDate.getFullYear();
                  
                  const dateStr = `${viewedDate.getFullYear()}-${String(viewedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const hasGoals = goals.some(g => g.date === dateStr);
                  
                  return (
                    <button 
                      key={day}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (showGoalCalendar) {
                          const newDate = new Date(viewedDate);
                          newDate.setDate(day);
                          setSelectedGoalDate(newDate);
                          setShowGoalCalendar(false);
                        }
                      }}
                      className={`relative w-full aspect-square rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 
                        isToday ? 'bg-blue-50 text-blue-600' : 
                        showGoalCalendar ? 'text-gray-700 hover:bg-gray-100 cursor-pointer' : 
                        'text-gray-700 cursor-default'
                      }`}
                    >
                      {day}
                      {hasGoals && !isSelected && (
                        <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-emerald-500"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-bold mb-4 inline-block">Preview Limitation</span>
                <br/>
                Because you are viewing this inside the AI Studio preview window, the automatic install prompt is blocked by your browser.
                <br/><br/>
                <span className="font-bold text-gray-900">Step 1:</span> Click the <span className="font-bold">"Open in new tab"</span> button (usually at the top right of the preview window).
                <br/><br/>
                <span className="font-bold text-gray-900">Step 2:</span> Once opened in a new tab, tap the <span className="font-bold">Share</span> icon (iOS) or <span className="font-bold">Menu</span> (Android) and select <span className="font-bold">"Add to Home Screen"</span>.
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

    </div>
  );
}
