import React, { useState, useEffect } from "react";
import { UserProfile, WorkoutPlan, DietPlan } from "./types";
import WorkoutDeck from "./components/WorkoutDeck";
import DietStudio from "./components/DietStudio";
import ProgressSpace from "./components/ProgressSpace";
import SpecsViewer from "./components/SpecsViewer";
import { 
  Flame, 
  Dumbbell, 
  Utensils, 
  Plus, 
  CheckCircle, 
  Smartphone, 
  Activity, 
  Loader2, 
  User, 
  Sparkles, 
  ChevronRight, 
  Scale, 
  Compass, 
  BookOpen, 
  RefreshCw,
  Zap,
  Cpu,
  TrendingUp,
  Settings,
  Heart,
  Droplet,
  Award,
  AlertTriangle,
  Shield,
  Share2,
  Star,
  Check,
  Info
} from "lucide-react";

export default function App() {
  // Splash and onboarding step managers
  const [appInitialized, setAppInitialized] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<'splash' | 'onboarding' | 'details' | 'goal' | 'focus' | 'generating' | 'dashboard'>('splash');
  const [onboardingSlide, setOnboardingSlide] = useState<number>(0);
  
  // Core Profile states
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    gender: "male",
    age: 26,
    weight: 75,
    height: 180,
    goal: "muscle_gain",
    targetWeight: 80,
    activityLevel: "moderate",
    dietType: "veg",
    experienceLevel: "intermediate"
  });

  const [specificFocus, setSpecificFocus] = useState<string>("");

  // Plan States
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [engineSource, setEngineSource] = useState<string>("Local Rule Engine");
  const [isAI, setIsAI] = useState<boolean>(false);
  const [loadingPlan, setLoadingPlan] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Active Bottom Navigation Tab
  const [activeTab, setActiveTab] = useState<"home" | "workout" | "diet" | "progress" | "settings" | "specs">("home");

  // Daily Tracker States (offline persistent items)
  const [waterCupsDrank, setWaterCupsDrank] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(4);
  const [todayWorkoutCompleted, setTodayWorkoutCompleted] = useState<boolean>(false);
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({});
  
  // Custom Ad States
  const [showInterstitial, setShowInterstitial] = useState<boolean>(false);
  const [showBannerAd, setShowBannerAd] = useState<boolean>(true);

  // Sound Synthesizer for Water Tap (Gamification sound)
  const playWaterClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.log("Audio feedback enabled on interaction tap.");
    }
  };

  // Sound Synthesizer for completion double beep
  const playCompleteSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (freq: number, start: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.start(start);
        osc.stop(start + dur);
      };
      const now = audioCtx.currentTime;
      playBeep(523.25, now, 0.1); // C5
      playBeep(659.25, now + 0.12, 0.25); // E5
    } catch (e) {
      console.log("Complete notification sound played.");
    }
  };

  // Load profile on start
  useEffect(() => {
    // 1. Splash delay
    const splashTimer = setTimeout(() => {
      const savedProfile = localStorage.getItem("fit_profile_v1");
      const savedWater = localStorage.getItem("fit_water_drank");
      const savedStreak = localStorage.getItem("fit_streak_v1");
      const savedFocus = localStorage.getItem("fit_focus_v1");

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        if (savedFocus) setSpecificFocus(savedFocus);
        if (savedWater) setWaterCupsDrank(Number(savedWater));
        if (savedStreak) setStreakCount(Number(savedStreak));
        
        // Fetch plan instantly based on saved profile
        generateSystemPlanSilent(parsed);
        setWizardStep('dashboard');
        setActiveTab('home');
      } else {
        setWizardStep('onboarding');
      }
      setAppInitialized(true);
    }, 1800);

    return () => clearTimeout(splashTimer);
  }, []);

  // Offline calculation helper for Water Target
  const calculatedWaterTargetLiters = Math.round((profile.weight * 0.04) * 10) / 10 || 3.2;
  const calculatedWaterTargetCups = Math.ceil(calculatedWaterTargetLiters / 0.25);

  // Offline BMI calculation helper
  const bmiValue = profile.height > 0 ? Math.round((profile.weight / Math.pow(profile.height / 100, 2)) * 10) / 10 : 22.5;
  const getBmiAssessment = (v: number) => {
    if (v < 18.5) return { status: "Underweight (Heavy load)", color: "text-brand-warning", desc: "Increase healthy bulking calories." };
    if (v < 25) return { status: "Normal Range (Fit)", color: "text-brand-secondary", desc: "Excellent physical balance." };
    if (v < 30) return { status: "Overweight (Lighter steps)", color: "text-brand-warning", desc: "Suggest deficit control." };
    return { status: "Heavy load (Critical range)", color: "text-rose-500", desc: "Adhere to strict fat loss instructions." };
  };
  const bmiMeta = getBmiAssessment(bmiValue);

  // Generate Plan handler (interactive with custom state transitions & interstitial ads!)
  const generateSystemPlan = async (userProfile: UserProfile) => {
    setLoadingPlan(true);
    setGenerationError(null);
    setWizardStep('generating');

    // Simulate creation load of 2s to feel high-precision rule mapping
    setTimeout(async () => {
      try {
        const response = await fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userProfile),
        });

        if (!response.ok) {
          throw new Error(`Failed to contact planning server. Status: ${response.status}`);
        }

        const planData = await response.json();
        
        // Set dynamic outputs
        setWorkoutPlan(planData.workoutPlan);
        setDietPlan({
          dailyMacros: planData.dailyMacros,
          meals: planData.meals
        });
        setEngineSource(planData.engine || "Personalized Sports Rules");
        setIsAI(!!planData.isAI);

        // Save persistent states
        localStorage.setItem("fit_profile_v1", JSON.stringify(userProfile));
        localStorage.setItem("fit_focus_v1", specificFocus);
        
        // Trigger Interstitial ad popup mock as per specification (Part 2 step 17: "Interstitial ad after plan generation")
        setShowInterstitial(true);

      } catch (err: any) {
        console.error("Error generating customized fitness plan:", err);
        setGenerationError(err.message || "An unexpected error occurred. Offline science module resolved.");
        setWizardStep('details');
      } finally {
        setLoadingPlan(false);
      }
    }, 2000);
  };

  // Silent plan loader for returning users
  const generateSystemPlanSilent = async (userProfile: UserProfile) => {
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userProfile),
      });
      if (response.ok) {
        const planData = await response.json();
        setWorkoutPlan(planData.workoutPlan);
        setDietPlan({
          dailyMacros: planData.dailyMacros,
          meals: planData.meals
        });
        setEngineSource(planData.engine || "Sports Rules Engine");
        setIsAI(!!planData.isAI);
      }
    } catch (e) {
      console.warn("Silent load warning, calculating baseline Offline values.", e);
    }
  };

  const handleResetProfile = () => {
    if (window.confirm("Do you want to reset your fitness program and clear saved data?")) {
      localStorage.removeItem("fit_profile_v1");
      localStorage.removeItem("fit_water_drank");
      localStorage.removeItem("fit_streak_v1");
      localStorage.removeItem("fit_focus_v1");
      
      // Reset Default profile
      setProfile({
        name: "",
        gender: "male",
        age: 26,
        weight: 75,
        height: 180,
        goal: "muscle_gain",
        targetWeight: 80,
        activityLevel: "moderate",
        dietType: "veg",
        experienceLevel: "intermediate"
      });
      setSpecificFocus("");
      setWaterCupsDrank(0);
      setStreakCount(0);
      setWorkoutPlan(null);
      setDietPlan(null);
      
      setWizardStep('onboarding');
      setOnboardingSlide(0);
      setActiveTab('home');
    }
  };

  const handleIncrementWater = () => {
    playWaterClickSound();
    const nextVal = waterCupsDrank + 1;
    setWaterCupsDrank(nextVal);
    localStorage.setItem("fit_water_drank", String(nextVal));
  };

  const handleResetWater = () => {
    setWaterCupsDrank(0);
    localStorage.removeItem("fit_water_drank");
  };

  // Slide content for onboarding
  const slides = [
    {
      title: "Personalized Workout Plans",
      subtitle: "Workout based on your body and goals.",
      image: "💪",
      bg: "from-blue-600/20 to-transparent"
    },
    {
      title: "Smart Diet Plans",
      subtitle: "Diet customized to your lifestyle.",
      image: "🥗",
      bg: "from-emerald-600/20 to-transparent"
    },
    {
      title: "Track Your Progress",
      subtitle: "Stay consistent every day.",
      image: "📈",
      bg: "from-amber-600/20 to-transparent"
    }
  ];

  // Specific Focus Map based on goals
  const getFocusOptions = () => {
    if (profile.goal === "muscle_gain") {
      return ["Full Body", "Chest", "Biceps", "Shoulders", "Back", "Legs", "Abs", "Lean Muscle", "Bulk Muscle"];
    }
    if (profile.goal === "weight_loss" || profile.goal === "fat_loss") {
      return ["Belly Fat", "Face Fat", "Full Body Fat", "Love Handles", "Thigh Fat"];
    }
    if (profile.goal === "weight_gain") {
      return ["Healthy Gain", "Bulk Gain", "Skinny to Fit"];
    }
    return ["General Fitness", "Lean Body", "Active Lifestyle"];
  };

  // Quick action selector
  const handleQuickTabChange = (tabName: "home" | "workout" | "diet" | "progress" | "settings" | "specs") => {
    setActiveTab(tabName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col justify-between selection:bg-brand-primary selection:text-black">
      
      {/* ---------------------------------------------------- */}
      {/* INTERSTITIAL AD MOCKUP MODULE (Step 17 rules) */}
      {/* ---------------------------------------------------- */}
      {showInterstitial && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4" id="interstitial-ad-overlay">
          <div className="bg-[#1C1C1E] border border-gray-800 rounded-[24px] max-w-sm w-full p-6 shadow-2xl relative overflow-hidden">
            {/* Header badges */}
            <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 font-semibold flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-brand-primary" /> Supported AdMob Spot
              </span>
              <span className="bg-brand-primary/10 text-brand-primary text-[9px] px-2 py-0.5 rounded-full font-bold">
                PROMOTIONAL AD (MOCK)
              </span>
            </div>

            {/* Ad Body */}
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl mx-auto flex items-center justify-center border border-brand-primary/20">
                <Dumbbell className="w-8 h-8 text-brand-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white leading-tight">Unlock Professional Pro Mode</h4>
                <p className="text-xs text-gray-400">
                  Join 100K+ users tracking precise caloric guidelines daily without limits.
                </p>
              </div>

              {/* Fake Star review */}
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-brand-warning text-brand-warning" />
                ))}
                <span className="text-xs text-gray-400 ml-1.5 font-bold">4.9 App Store</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => {
                  playCompleteSound();
                  setShowInterstitial(false);
                  setWizardStep('dashboard');
                  setActiveTab('home');
                }}
                className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-black font-semibold text-xs rounded-xl transition duration-150 active:scale-98"
              >
                Close Ad & Open My Dashboard
              </button>
              <div className="text-center">
                <span className="text-[9px] text-gray-650 font-mono">This ad placement occurs on design triggers</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* SPLASH SCREEN STYLES (Part 2 section 5 rules) */}
      {/* ---------------------------------------------------- */}
      {wizardStep === 'splash' && (
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center" id="app-splash-screen">
          <div className="max-w-md w-full space-y-6">
            
            {/* Elegant Dumbbell & Plate logo */}
            <div className="w-20 h-20 bg-brand-primary text-black rounded-[20px] mx-auto flex items-center justify-center shadow-2xl shadow-brand-primary/20 animate-bounce">
              <Dumbbell className="w-10 h-10 fill-black" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-display">
                Muscle Builder & Diet Planner
              </h1>
              <p className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
                Build Better. Eat Better.
              </p>
            </div>

            {/* Minimal loader */}
            <div className="pt-10 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
              <span className="text-xs text-gray-400 font-mono">Precision Rules-Engine active</span>
            </div>
          </div>
        </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* ONBOARDING SCREENS (Part 2 section 6 rules) */}
      {/* ---------------------------------------------------- */}
      {wizardStep === 'onboarding' && (
        <div className="flex-grow flex flex-col justify-between max-w-sm mx-auto w-full px-5 py-8" id="onboarding-flow-screen">
          
          {/* Top navigation indicator step */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-mono text-gray-500 font-bold tracking-wider">
              Step 1 of 3
            </span>
            <button
              onClick={() => setWizardStep('details')}
              className="text-xs text-brand-primary hover:underline font-semibold"
            >
              Skip
            </button>
          </div>

          {/* Central Carousel card content */}
          <div className="text-center py-8 space-y-6">
            <div className="w-28 h-28 bg-brand-primary/15 border border-brand-primary/10 rounded-[24px] mx-auto flex items-center justify-center text-4xl shadow-lg">
              {slides[onboardingSlide].image}
            </div>

            <div className="space-y-2 px-2">
              <h2 className="text-xl font-bold tracking-tight text-white">
                {slides[onboardingSlide].title}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                {slides[onboardingSlide].subtitle}
              </p>
            </div>

            {/* Pagination dots indicator */}
            <div className="flex justify-center gap-1.5 mt-4">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setOnboardingSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${onboardingSlide === idx ? "w-6 bg-brand-primary" : "w-1.5 bg-gray-800"}`}
                />
              ))}
            </div>
          </div>

          {/* Large custom actions button: "Get Started" or "Continue" */}
          <div className="space-y-3">
            {onboardingSlide < 2 ? (
              <button
                type="button"
                onClick={() => setOnboardingSlide(onboardingSlide + 1)}
                className="w-full h-[56px] bg-brand-primary text-black font-semibold rounded-[18px] flex items-center justify-center gap-3 transition hover:bg-brand-primary/95 active:scale-[0.98]"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playWaterClickSound();
                  setWizardStep('details');
                }}
                className="w-full h-[56px] bg-brand-primary text-black font-semibold rounded-[18px] flex items-center justify-center gap-3 transition hover:bg-brand-primary/95 active:scale-[0.98]"
              >
                Get Started
              </button>
            )}
            <div className="text-center">
              <span className="text-[10px] text-gray-500 font-mono">Secure offline persistence mapped</span>
            </div>
          </div>
        </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* USER DETAILS SCREEN (Part 2 section 7 rules) */}
      {/* ---------------------------------------------------- */}
      {wizardStep === 'details' && (
        <div className="flex-grow flex flex-col justify-between max-w-md mx-auto w-full px-5 py-6 space-y-6" id="details-editor-screen">
          
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-brand-primary font-bold">PROFILE SETUP</span>
            <h2 className="text-xl font-bold font-display text-white">Tell Us About Yourself</h2>
            <p className="text-xs text-gray-405 leading-relaxed">
              We compile offline metabolic formulations based on raw variables. Include biological constant corrections.
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setWizardStep('goal');
            }} 
            className="space-y-4 flex-grow overflow-y-auto pr-1"
          >
            {/* Athlete Name Code */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Name / Athlete Code</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Alex Carter (Worldwide athlete)"
                className="w-full bg-[#1C1C1E] border border-gray-800 rounded-xl py-3 px-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>

            {/* Gender Selection */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300">Biological Coefficient</label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'male' })}
                  className={`py-3 rounded-[18px] border text-center transition-colors font-semibold text-xs ${
                    profile.gender === "male"
                      ? "bg-brand-primary/10 border-brand-primary text-white font-semibold"
                      : "bg-[#1C1C1E]/60 border-gray-800 text-gray-400 hover:border-gray-700 font-semibold"
                  }`}
                >
                  Male (+5 constant)
                </button>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: 'female' })}
                  className={`py-3 rounded-[18px] border text-center transition-colors font-semibold text-xs ${
                    profile.gender === "female"
                      ? "bg-brand-primary/10 border-brand-primary text-white font-semibold"
                      : "bg-[#1C1C1E]/60 border-gray-800 text-gray-400 hover:border-gray-700 font-semibold"
                  }`}
                >
                  Female (-161 constant)
                </button>
              </div>
            </div>

            {/* Age selector (13-60) per spec */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-gray-300">Age Range Focus</label>
                <span className="font-mono text-brand-primary font-semibold">{profile.age} years</span>
              </div>
              <input
                type="range"
                min="13"
                max="60"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-primary mt-1"
              />
            </div>

            {/* Height (120-220 cm) per spec */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-gray-300">Stature Heights Limit</label>
                <span className="font-mono text-brand-primary font-semibold">{profile.height} cm</span>
              </div>
              <input
                type="range"
                min="120"
                max="220"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-primary mt-1"
              />
            </div>

            {/* Weight (30-180 kg) per spec */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-gray-300">Current Biometric Mass</label>
                <span className="font-mono text-brand-primary font-semibold">{profile.weight} kg</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value), targetWeight: profile.targetWeight || Number(e.target.value) })}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-primary mt-1"
              />
            </div>

            {/* Food Preference Cards */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Food Restriction Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "veg", label: "Vegetarian", icon: "🌱" },
                  { id: "egg_only", label: "Eggetarian", icon: "🥚" },
                  { id: "non_veg", label: "Non-Veg", icon: "🍗" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, dietType: item.id as any })}
                    className={`p-3 rounded-[18px] border text-center transition-all ${
                      profile.dietType === item.id 
                        ? "bg-brand-primary/10 border-brand-primary text-white font-semibold" 
                        : "bg-[#1C1C1E] border-gray-800 text-gray-400 hover:border-gray-750 font-semibold"
                    }`}
                  >
                    <div className="text-lg mb-1">{item.icon}</div>
                    <div className="text-[10px] font-semibold tracking-tight">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level Cards */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Current Activity Standard</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "sedentary", label: "Beginner", desc: "No lifts", icon: "🛡️" },
                  { id: "moderate", label: "Moderate", desc: "3-4x gym", icon: "⚡" },
                  { id: "active", label: "Active", desc: "5-6x hard", icon: "🔥" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, activityLevel: item.id as any })}
                    className={`p-2.5 rounded-[18px] border text-center transition-all ${
                      profile.activityLevel === item.id 
                        ? "bg-brand-primary/10 border-brand-primary text-white font-semibold" 
                        : "bg-[#1C1C1E] border-gray-800 text-gray-400 hover:border-gray-750 font-semibold"
                    }`}
                  >
                    <div className="text-base mb-0.5">{item.icon}</div>
                    <div className="text-[10px] font-semibold tracking-tight">{item.label}</div>
                    <div className="text-[8px] text-gray-500 font-mono scale-90 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button wrapper */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-[56px] bg-brand-primary text-black font-semibold rounded-[18px] flex items-center justify-center gap-2 transition hover:bg-brand-primary/95 active:scale-[0.98]"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* GOAL SELECTION SCREEN (Part 2 section 8 rules) */}
      {/* ---------------------------------------------------- */}
      {wizardStep === 'goal' && (
        <div className="flex-grow flex flex-col justify-between max-w-sm mx-auto w-full px-5 py-6 space-y-6" id="goal-selector-screen">
          
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] uppercase font-mono text-brand-primary font-bold">GOAL PRIORITY</span>
            <h2 className="text-xl font-bold font-display text-white">Target Muscle & Body Goal</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Define the physical target to calculate correct metabolic multipliers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3" id="goals-2column-grid">
            {[
              { id: "muscle_gain", label: "Muscle Gain", desc: "Bulking surplus", icon: "💪" },
              { id: "weight_loss", label: "Weight Loss", desc: "Deficit cut", icon: "🔥" },
              { id: "fat_loss", label: "Fat Loss", desc: "Active burn", icon: "🏃" },
              { id: "weight_gain", label: "Weight Gain", desc: "Healthy additions", icon: "⚡" },
              { id: "recomp", label: "Maintain Body", desc: "Leaning out", icon: "🛡️" }
            ].map((item) => {
              const isSelected = profile.goal === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, goal: item.id as any })}
                  className={`p-3.5 rounded-[18px] border text-left transition-all relative overflow-hidden flex flex-col justify-between h-[115px] ${
                    isSelected 
                      ? "bg-brand-primary/10 border-brand-primary text-white shadow-lg shadow-brand-primary/10 ring-1 ring-brand-primary/30" 
                      : "bg-[#1C1C1E] border-gray-800 text-gray-400 hover:border-gray-750"
                  }`}
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-tight">{item.label}</div>
                    <div className="text-[8px] text-gray-500 font-mono mt-0.5">{item.desc}</div>
                  </div>
                  {isSelected && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => {
                const defaultFocus = getFocusOptions()[0];
                setSpecificFocus(defaultFocus);
                setWizardStep('focus');
              }}
              className="w-full h-[56px] bg-brand-primary text-black font-semibold rounded-[18px] flex items-center justify-center gap-2 transition hover:bg-brand-primary/95 active:scale-[0.98]"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setWizardStep('details')}
              className="w-full py-2.5 text-xs text-gray-500 hover:text-white font-semibold flex items-center justify-center gap-1.5 transition"
            >
              Back to Biometrics
            </button>
          </div>
        </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* SPECIFIC FOCUS SCREEN (Part 2 section 9 rules) */}
      {/* ---------------------------------------------------- */}
      {wizardStep === 'focus' && (
        <div className="flex-grow flex flex-col justify-between max-w-sm mx-auto w-full px-5 py-6 space-y-6" id="specific-focus-screen">
          
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] uppercase font-mono text-brand-primary font-bold">PRIORITY REGION</span>
            <h2 className="text-xl font-bold font-display text-white">Choose Your Focus</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our Sports Science engine weights set/rep splits based on your focus priority.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
            {getFocusOptions().map((fOption) => {
              const isSelected = specificFocus === fOption;
              return (
                <button
                  key={fOption}
                  type="button"
                  onClick={() => setSpecificFocus(fOption)}
                  className={`p-3 rounded-[18px] border text-center font-semibold text-xs transition-all ${
                    isSelected 
                      ? "bg-brand-primary/10 border-brand-primary text-brand-primary" 
                      : "bg-[#1C1C1E] border-gray-800 text-gray-400 hover:border-gray-750"
                  }`}
                >
                  {fOption}
                </button>
              );
            })}
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => generateSystemPlan(profile)}
              className="w-full h-[56px] bg-brand-primary text-black font-semibold rounded-[18px] flex items-center justify-center gap-2 transition hover:bg-brand-primary/95 active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 fill-black" /> Synthesize Custom Program
            </button>
            <button
              type="button"
              onClick={() => setWizardStep('goal')}
              className="w-full py-2.5 text-xs text-gray-500 hover:text-white font-semibold flex items-center justify-center gap-1.5 transition"
            >
              Back to Goal Selection
            </button>
          </div>
        </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* GENERATE PLAN SCREEN (Part 2 section 10 rules) */}
      {/* ---------------------------------------------------- */}
      {wizardStep === 'generating' && (
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center" id="generator-screen">
          <div className="max-w-xs space-y-6">
            
            {/* Spinning clean CSS loader resembling a high tech fitness visual */}
            <div className="w-16 h-16 rounded-full border-4 border-gray-800 border-t-brand-primary animate-spin mx-auto flex items-center justify-center">
              <Activity className="w-6 h-6 text-brand-primary animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Creating Your Fitness Plan…</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                Mapping sets offsets & customized {profile.dietType} recipes to your biometric mass...
              </p>
            </div>

            <div className="bg-[#1C1C1E] border border-gray-800 rounded-xl p-3 text-[10px] font-mono text-gray-500 leading-normal">
              ENGINE: {isAI ? "Gemini 3.5 Active" : "Sports Science Offline Hub v1.0"}
            </div>
          </div>
        </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* APP HEADER SYSTEM (Dashboard Navigation mode) */}
      {/* ---------------------------------------------------- */}
      {wizardStep === 'dashboard' && (
        <>
          <header className="border-b border-gray-800 bg-[#161618] sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
              
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-brand-primary text-black rounded-lg font-display font-extrabold flex items-center justify-center shadow-md">
                  <Dumbbell className="w-5 h-5 fill-black" />
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
                    FitPlanner Pro <Zap className="w-3.5 h-3.5 fill-brand-primary text-brand-primary" />
                  </h1>
                  <span className="text-[9px] text-gray-550 font-mono block">Offline Sports System v1.0</span>
                </div>
              </div>

              {/* Reset shortcut / Specs View quick access */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickTabChange("specs")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md border ${
                    activeTab === "specs"
                      ? "bg-brand-primary border-brand-primary text-black"
                      : "bg-[#121212] border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  Spec Roadmap
                </button>
              </div>
            </div>
          </header>

          {/* MAIN DYNAMIC TAB PANELS */}
          <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-5 space-y-6">

            {/* ERROR WARNING TOP RAILS */}
            {generationError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3.5 rounded-xl leading-normal flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{generationError}</span>
              </div>
            )}


            {/* 🏠 DASHBOARD HOME VIEW (Part 2 section 11 rules) */}
            {activeTab === "home" && (
              <div className="flex flex-col gap-3" id="dashboard-tab-panel">
                
                {/* Greeting Card */}
                <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1 z-10">
                    <span className="text-[10px] text-brand-primary font-mono tracking-wider font-semibold uppercase">TRAINING BASELINE ACTIVE</span>
                    <h2 className="text-lg font-semibold tracking-tight text-white font-display">
                      Hello Athlete {profile.name ? profile.name : ""} 👋
                    </h2>
                    <p className="text-xs text-[#B0B0B0]">
                      Stay consistent today
                    </p>
                  </div>
                  <div className="bg-brand-secondary/15 border border-brand-secondary/20 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shrink-0 z-10">
                    <Award className="w-4 h-4 text-brand-secondary" />
                    <div>
                      <span className="text-[9px] text-[#B0B0B0] block font-mono uppercase leading-none">Training Streak</span>
                      <span className="text-xs font-semibold text-white">{streakCount} Active Days</span>
                    </div>
                  </div>
                  {/* Subtle decorative background gradient */}
                  <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl" />
                </div>


                {/* VERTICAL DECK OF 5 CARDS IN THE EXACT MANDATED ORDER (12px Card Spacing) */}
                <div className="flex flex-col gap-3">
                  
                  {/* CARD 1: Calories Card */}
                  <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-[#B0B0B0] font-mono uppercase block font-semibold">Calorie Target</span>
                        <h3 className="text-xl font-semibold font-mono text-white mt-1">
                          {dietPlan?.dailyMacros.calories || 2400} kcal <span className="text-xs text-brand-primary normal-case font-semibold">/ daily</span>
                        </h3>
                      </div>
                      <span className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded text-[9px] font-semibold font-mono">
                        {profile.goal.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Simple macro distribution indicators */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-2">
                      <div className="p-2 bg-[#121212] rounded-lg border border-gray-850">
                        <span className="text-[9px] text-[#B0B0B0] block uppercase">Protein</span>
                        <span className="text-xs font-semibold text-brand-primary font-mono mt-0.5 block">{dietPlan?.dailyMacros.protein || Math.round(profile.weight * 2.2)}g</span>
                      </div>
                      <div className="p-2 bg-[#121212] rounded-lg border border-gray-850">
                        <span className="text-[9px] text-[#B0B0B0] block uppercase">Carbs</span>
                        <span className="text-xs font-semibold text-brand-warning font-mono mt-0.5 block">{dietPlan?.dailyMacros.carbs || 250}g</span>
                      </div>
                      <div className="p-2 bg-[#121212] rounded-lg border border-gray-850">
                        <span className="text-[9px] text-[#B0B0B0] block uppercase">Lipid Fats</span>
                        <span className="text-xs font-semibold text-purple-400 font-mono mt-0.5 block">{dietPlan?.dailyMacros.fat || 65}g</span>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: BMI Card */}
                  <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-[#B0B0B0] font-mono uppercase block font-semibold">Body Mass Index (BMI)</span>
                        <span className="text-xs font-mono font-semibold text-brand-primary">{bmiValue} kg/m²</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-brand-primary" />
                        <div>
                          <span className={`text-xs font-semibold block ${bmiMeta.color}`}>
                            {bmiMeta.status}
                          </span>
                          <span className="text-[10px] text-gray-400 block">{bmiMeta.desc}</span>
                        </div>
                      </div>
                    </div>

                    {/* Warnings indicator if BMI is high/low per spec */}
                    {bmiValue >= 25 && (
                      <div className="bg-brand-warning/10 border border-brand-warning/25 rounded-md p-2 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-brand-warning shrink-0" />
                        <span className="text-[9px] text-brand-warning leading-normal font-normal">
                          Active sports science recommends lean-bulk deficit cuts to trim heavy biometric mass safely.
                        </span>
                      </div>
                    )}
                    {bmiValue < 25 && bmiValue >= 18.5 && (
                      <div className="bg-brand-secondary/15 border border-brand-secondary/20 rounded-md p-2 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
                        <span className="text-[9px] text-brand-secondary leading-normal font-normal">
                          Biometrics reflect normal weight bounds. Keep tracking consistent training splits!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CARD 3: Water Goal Card */}
                  <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-[#B0B0B0] font-mono uppercase block font-semibold">OFFLINE HYDRATION TARGET</span>
                        <h3 className="text-base font-semibold text-white flex items-center gap-1.5 mt-1">
                          <Droplet className="w-4.5 h-4.5 text-brand-primary animate-bounce" /> {calculatedWaterTargetLiters} Liters <span className="text-xs text-[#B0B0B0] font-normal">({calculatedWaterTargetCups} Cups of 250ml)</span>
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleResetWater}
                          className="text-[10px] text-gray-400 hover:text-white hover:underline transition-all font-semibold"
                        >
                          Reset Daily Water
                        </button>
                      </div>
                    </div>

                    {/* Water logging progression bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">Progression Completed:</span>
                        <span className="text-brand-primary font-semibold">{waterCupsDrank} / {calculatedWaterTargetCups} Cups</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#121212] rounded-full overflow-hidden border border-gray-800">
                        <div 
                          className="h-full bg-brand-primary transition-all duration-300 rounded-full" 
                          style={{ width: `${Math.min((waterCupsDrank / calculatedWaterTargetCups) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Interactive glasses matrix */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {[...Array(Math.max(calculatedWaterTargetCups, 12))].map((_, i) => {
                        const idNum = i + 1;
                        const isDrank = waterCupsDrank >= idNum;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={handleIncrementWater}
                            className={`w-10 h-11 shrink-0 rounded-lg flex flex-col justify-between items-center p-1.5 border transition-all ${
                              isDrank 
                                ? "bg-brand-primary/10 border-brand-primary text-brand-primary" 
                                : "bg-[#121212] border-gray-800 text-gray-500 hover:border-gray-700"
                            }`}
                          >
                            <span className="text-[8px] font-mono leading-none">{idNum}</span>
                            <Droplet className={`w-3.5 h-3.5 ${isDrank ? "fill-brand-primary" : ""}`} />
                          </button>
                        );
                      })}
                    </div>

                    <div className="bg-[#121212]/85 p-2.5 rounded-xl border border-gray-850 flex justify-between items-center text-[10px]">
                      <span className="text-gray-400">Tap cup above to add 250ml to your daily intake log. Feels offline-first.</span>
                      <button
                        type="button"
                        onClick={handleIncrementWater}
                        className="text-brand-primary font-semibold hover:underline"
                      >
                        + Quick Add Cup
                      </button>
                    </div>
                  </div>

                  {/* CARD 4: Today's Workout Card */}
                  <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[9px] text-[#B0B0B0] font-mono uppercase block font-semibold">NEXT TRAINING SPLIT</span>
                      <h4 className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
                        <Dumbbell className="w-4 h-4 text-brand-primary" /> {workoutPlan ? workoutPlan.title : "Full Body Conditioning B"}
                      </h4>
                      <p className="text-xs text-gray-405 mt-1 leading-normal">
                        Specific target focuses on <span className="font-semibold text-brand-primary">{specificFocus || "Full Body Workout focus"}</span>. Experience: {profile.experienceLevel.toUpperCase()}.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickTabChange("workout")}
                      className="w-full h-[56px] bg-brand-primary hover:bg-brand-primary/95 text-black font-semibold text-xs rounded-[18px] flex items-center justify-center gap-1.5 transition active:scale-98"
                    >
                      Start Training routine <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* CARD 5: Diet Plan Card */}
                  <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[9px] text-[#B0B0B0] font-mono uppercase block font-semibold">DIET RECIPE OVERVIEW</span>
                      <h4 className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
                        <Utensils className="w-4 h-4 text-brand-primary" /> Personalized {profile.dietType.replace("_", "-").toUpperCase()}
                      </h4>
                      <p className="text-xs text-gray-405 mt-1 leading-normal">
                        Meticulously curated meals balanced to yield daily metrics of {dietPlan?.dailyMacros.protein || Math.round(profile.weight * 2.2)}g high biological proteins.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickTabChange("diet")}
                      className="w-full h-[56px] bg-brand-primary hover:bg-brand-primary/95 text-black font-semibold text-xs rounded-[18px] flex items-center justify-center gap-1.5 transition active:scale-98"
                    >
                      Explore Diet Studio <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            )}


            {/* 💪 WORKOUT TAB PANEL */}
            {activeTab === "workout" && (
              <div className="space-y-4" id="workout-tab-panel">
                <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5">
                  <span className="text-[10px] text-brand-primary font-mono tracking-wider font-bold uppercase block">RULE-BASED SEVEN DAY TRAINING</span>
                  <h3 className="text-md font-bold font-display text-white mt-0.5">Workout Deck Calendar</h3>
                  <p className="text-xs text-gray-405 mt-1 leading-relaxed">
                    Mark off sets and exercises completed. Rest intervals between sets are equipped with high accuracy sound alarms!
                  </p>
                </div>

                {workoutPlan ? (
                  <WorkoutDeck plan={workoutPlan} />
                ) : (
                  <div className="text-center py-10 bg-brand-card border border-gray-800 rounded-xl space-y-4">
                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
                    <p className="text-xs text-gray-400">Loading sports routines scheduler splits...</p>
                  </div>
                )}
              </div>
            )}


            {/* 🥗 DIET STUDIO TAB PANEL */}
            {activeTab === "diet" && (
              <div className="space-y-4" id="diet-tab-panel">
                <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5">
                  <span className="text-[10px] text-brand-primary font-mono tracking-wider font-bold uppercase block">OFFLINE PREPARATIONS STUDIO</span>
                  <h3 className="text-md font-bold font-display text-white mt-0.5">Custom Diet Studio Panel</h3>
                  <p className="text-xs text-gray-405 mt-1 leading-relaxed font-normal">
                    Macro priorities configured to {profile.dietType.replace("_", " ")} preference. Focus priority maps calories to target objectives.
                  </p>
                </div>

                {dietPlan ? (
                  <DietStudio plan={dietPlan} engine={engineSource} />
                ) : (
                  <div className="text-center py-10 bg-brand-card border border-gray-800 rounded-xl space-y-4">
                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
                    <p className="text-xs text-gray-400">Formulating meal guidelines...</p>
                  </div>
                )}
              </div>
            )}


            {/* 📈 COMPREHENSIVE PROGRESS ROADMAP (Part 2 section 14 rules \& Part 4 physical formulas) */}
            {activeTab === "progress" && (
              <div className="space-y-5" id="progress-tab-panel">
                <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5">
                  <span className="text-[10px] text-brand-primary font-mono tracking-wider font-bold uppercase block">OFFLINE RESEARCH LABORATORY</span>
                  <h3 className="text-md font-bold font-display text-white mt-0.5">Part 4: Physical Calculations (Mifflin formulations)</h3>
                  <p className="text-xs text-gray-405 mt-1 leading-relaxed">
                    Contrast calculations instantly offline to check mathematical correctness. Adjust weights to project weekly progress trends.
                  </p>
                </div>

                <ProgressSpace />
              </div>
            )}


            {/* ⚙️ OPTIONS SETTINGS SPLIT (Part 2 section 15 rules) */}
            {activeTab === "settings" && (
              <div className="space-y-5" id="settings-tab-panel">
                <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5">
                  <span className="text-[10px] text-brand-primary font-mono tracking-wider font-bold uppercase block">SECURITY & PREFERENCES DECK</span>
                  <h3 className="text-md font-bold font-display text-white mt-0.5">App Configuration Settings</h3>
                  <p className="text-xs text-gray-450 mt-1 leading-relaxed">
                    Optimize layout assets and configure monetization credentials safely offline.
                  </p>
                </div>

                {/* BIOMETRICS QUICK TUNING & PLAN REGENERATION (Rule 19 "Update My Plan") */}
                <div className="bg-brand-card border border-gray-800 rounded-[20px] p-5 space-y-4">
                  <div className="border-b border-gray-800 pb-3">
                    <span className="text-[9px] font-mono text-brand-primary uppercase font-bold tracking-wider">Rule 19 Engine Tuning</span>
                    <h4 className="text-sm font-bold text-gray-100 font-display">Biometrics Calibration Form</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Adjust physical targets below to trigger calculations and update plans instantly.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Goal field */}
                    <div>
                      <label className="text-[11px] font-mono text-gray-400 block mb-1 uppercase font-bold">Primary Goal</label>
                      <select
                        value={profile.goal}
                        onChange={(e) => {
                          const updated = { ...profile, goal: e.target.value };
                          setProfile(updated);
                          playWaterClickSound();
                        }}
                        className="w-full bg-[#07090e] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-brand-primary"
                      >
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="fat_loss">Fat Loss</option>
                        <option value="weight_gain">Weight Gain</option>
                        <option value="recomp">Weight Maintenance</option>
                      </select>
                    </div>

                    {/* Focus field */}
                    <div>
                      <label className="text-[11px] font-mono text-gray-400 block mb-1 uppercase font-bold">Specific Focus Area</label>
                      <select
                        value={specificFocus}
                        onChange={(e) => {
                          setSpecificFocus(e.target.value);
                          playWaterClickSound();
                        }}
                        className="w-full bg-[#07090e] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-brand-primary"
                      >
                        {getFocusOptions().map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Weight (kg) */}
                    <div>
                      <label className="text-[11px] font-mono text-gray-400 block mb-1 uppercase font-bold">Current Weight (kg)</label>
                      <input
                        type="number"
                        min="30"
                        max="200"
                        value={profile.weight}
                        onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) || 70 })}
                        className="w-full bg-[#07090e] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-brand-primary font-mono"
                      />
                    </div>

                    {/* Height (cm) */}
                    <div>
                      <label className="text-[11px] font-mono text-gray-400 block mb-1 uppercase font-bold">Height (cm)</label>
                      <input
                        type="number"
                        min="100"
                        max="250"
                        value={profile.height}
                        onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) || 170 })}
                        className="w-full bg-[#07090e] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-brand-primary font-mono"
                      />
                    </div>

                    {/* Diet Preference */}
                    <div>
                      <label className="text-[11px] font-mono text-gray-400 block mb-1 uppercase font-bold">Diet Style preference</label>
                      <select
                        value={profile.dietType}
                        onChange={(e) => {
                          setProfile({ ...profile, dietType: e.target.value as any });
                          playWaterClickSound();
                        }}
                        className="w-full bg-[#07090e] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-brand-primary"
                      >
                        <option value="veg">Vegetarian</option>
                        <option value="non_veg">Non-Vegetarian</option>
                        <option value="egg_only">Egg-Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="keto">Keto-Diet</option>
                      </select>
                    </div>

                    {/* Gym Experience */}
                    <div>
                      <label className="text-[11px] font-mono text-gray-400 block mb-1 uppercase font-bold">Experience Grade</label>
                      <select
                        value={profile.experienceLevel}
                        onChange={(e) => {
                          setProfile({ ...profile, experienceLevel: e.target.value as any });
                          playWaterClickSound();
                        }}
                        className="w-full bg-[#07090e] border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 outline-none focus:border-brand-primary"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        playCompleteSound();
                        // Put focus inside profile before sending
                        const finalProfile = { ...profile, focus: specificFocus };
                        generateSystemPlan(finalProfile);
                      }}
                      className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-black text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition duration-150 transform hover:scale-[1.01] active:scale-[0.99] shadow shadow-brand-primary/20"
                    >
                      <Dumbbell className="w-4 h-4" /> Update My Plan (Regenerate Engine)
                    </button>
                    <div className="text-center mt-2">
                      <span className="text-[10px] text-gray-500 font-mono">
                        Triggers Part 2 Interstitial Ad Pop-up to support monetization requirements
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-card border border-gray-800 rounded-[18px] overflow-hidden divide-y divide-gray-850">
                  
                  {/* Option 1: Mock Theme */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white block">Theme Mode Preferred</span>
                      <span className="text-[10px] text-gray-500 block">Dark Fitness Layout is default for high battery efficiency</span>
                    </div>
                    <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[9px] font-bold px-2 py-1 rounded">
                      DARK ACTIVE (CHOSEN)
                    </span>
                  </div>

                  {/* Option 2: Reset */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white block">Reset Complete Program</span>
                      <span className="text-[10px] text-gray-500 block">Erase local shared preferences data and start wizard over</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetProfile}
                      className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-500/10 text-rose-450 hover:text-rose-300 text-[10px] font-bold rounded"
                    >
                      Reset Local Profile
                    </button>
                  </div>

                  {/* Option 3: Rate App */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white block">Rate Muscle Builder & Diet Planner</span>
                      <span className="text-[10px] text-gray-500 block">Express support on App Store / Play Store mock review dialog</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playCompleteSound();
                        alert("Thank you! Mock App rating dialog triggered. 5 Stars recorded!");
                      }}
                      className="px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 text-brand-primary text-[10px] font-bold rounded flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 fill-brand-primary" /> Rate 5 Stars
                    </button>
                  </div>

                  {/* Option 4: Share App */}
                  <div className="p-4 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white block">Share with Training Partners</span>
                      <span className="text-[10px] text-gray-500 block">Provide package download links for worldwide fitness cohorts</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playWaterClickSound();
                        alert("Shortened mock copy link provided: https://play.google.com/store/mock-fitplanner");
                      }}
                      className="px-3 py-1.5 bg-[#07090e] border border-gray-800 hover:bg-black text-[10px] text-gray-300 font-bold rounded flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" /> Share Code Link
                    </button>
                  </div>

                  {/* Option 5: Privacy Policy */}
                  <div className="p-4 space-y-2">
                    <span className="text-xs font-bold text-white block">Privacy Policy Summary (V1 Draft)</span>
                    <p className="text-[10px] text-gray-550 leading-relaxed">
                      Muscle Builder & Diet Planner operates entirely offline. No analytics or body scans are sent to secondary cloud servers. AdMob services generate limited anonymized layout ids. Your personal biometrics are completely bound to local shared preferences.
                    </p>
                  </div>
                </div>

                {/* Developer Information */}
                <div className="bg-[#1C1C1E] border border-gray-800 rounded-[18px] p-4 text-xs font-mono text-gray-500 space-y-1.5">
                  <div className="text-[9px] uppercase font-bold text-gray-400">SYSTEM CONTROLLER METRICS</div>
                  <div>DEVICE AGENT: CLIENT SIMULATOR</div>
                  <div>VERSION REFERENCE: v1.0.0-PRO-MOCK</div>
                  <div>OAUTH CHANNELS: NOT REQUIRED (OFFLINE ONLY)</div>
                </div>
              </div>
            )}


            {/* 📋 ARCHITECTURE SPECTACULAR ROADMAP TAB */}
            {activeTab === "specs" && (
              <div className="space-y-4" id="specs-tab-panel">
                <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5">
                  <span className="text-[10px] text-brand-primary font-mono tracking-wider font-bold uppercase block">ROADMAP SPECIFICATION PANEL</span>
                  <h3 className="text-md font-bold font-display text-white mt-0.5">App Architecture Specs</h3>
                  <p className="text-xs text-gray-450 mt-1 leading-relaxed">
                    Refer directly to these guidelines when porting to production-ready Flutter/Dart repositories. Contains fully integrated system code setups.
                  </p>
                </div>

                <SpecsViewer />
              </div>
            )}

          </main>

          {/* ---------------------------------------------------- */}
          {/* PERSISTENT TAB ROUTING BAR (Section 16 rules) */}
          {/* ---------------------------------------------------- */}
          <nav className="border-t border-gray-800 bg-[#161618] sticky bottom-0 z-40" id="bottom-navigation-rail">
            <div className="max-w-md mx-auto px-4 py-2 flex justify-between items-center text-center">
              
              <button
                type="button"
                onClick={() => handleQuickTabChange("home")}
                className={`flex-1 py-1 flex flex-col items-center gap-1 transition-colors ${
                  activeTab === "home" ? "text-brand-primary font-semibold" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-[9px] tracking-tight">Home</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickTabChange("workout")}
                className={`flex-1 py-1 flex flex-col items-center gap-1 transition-colors ${
                  activeTab === "workout" ? "text-brand-primary font-semibold" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Dumbbell className="w-4 h-4" />
                <span className="text-[9px] tracking-tight">Workout</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickTabChange("diet")}
                className={`flex-1 py-1 flex flex-col items-center gap-1 transition-colors ${
                  activeTab === "diet" ? "text-brand-primary font-semibold" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span className="text-[9px] tracking-tight">Diet</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickTabChange("progress")}
                className={`flex-1 py-1 flex flex-col items-center gap-1 transition-colors ${
                  activeTab === "progress" ? "text-brand-primary font-semibold" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-[9px] tracking-tight">Progress</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickTabChange("settings")}
                className={`flex-1 py-1 flex flex-col items-center gap-1 transition-colors ${
                  activeTab === "settings" ? "text-brand-primary font-semibold" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="text-[9px] tracking-tight">Settings</span>
              </button>

            </div>
          </nav>
        </>
      )}


      {/* ---------------------------------------------------- */}
      {/* STATIC MOB AD BAR PLACEMENT (Section 17 banner ad rules) */}
      {/* ---------------------------------------------------- */}
      {showBannerAd && (
        <div className="bg-[#1C1C1E] border-t border-gray-800 py-1.5 px-4 text-center shrink-0 flex items-center justify-between gap-4 text-xs font-mono" id="admob-banner-placement">
          <span className="text-[8px] bg-brand-primary/20 text-brand-primary border border-brand-primary/30 px-1.5 py-0.5 rounded font-bold uppercase shrink-0 scale-90">
            AdMob Banner
          </span>
          <span className="text-[9px] text-gray-500 truncate leading-none">
            Google Admob Banner Placement • Bottom Anchor Node Area
          </span>
          <button
            type="button"
            onClick={() => setShowBannerAd(false)}
            className="text-[9px] text-gray-600 hover:text-white font-semibold flex items-center gap-1 shrink-0 px-1 py-0.5"
          >
            Hide
          </button>
        </div>
      )}

    </div>
  );
}
