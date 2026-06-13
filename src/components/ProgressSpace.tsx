import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { Award, Flame, Scale, Activity, Droplet, Sparkles, TrendingUp, HelpCircle, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export default function ProgressSpace() {
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(180);
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activityFactor, setActivityFactor] = useState<string>("moderate");
  const [goal, setGoal] = useState<string>("muscle_gain");
  
  // Custom states matching simple progress system requirements
  const [targetWeight, setTargetWeight] = useState<number>(80);
  const [streakCount, setStreakCount] = useState<number>(4);
  const [completedWorkoutsCount, setCompletedWorkoutsCount] = useState<number>(12);

  // Sync profile & states on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("fit_profile_v1");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.weight) setWeight(parsed.weight);
        if (parsed.height) setHeight(parsed.height);
        if (parsed.age) setAge(parsed.age);
        if (parsed.gender) setGender(parsed.gender as any);
        if (parsed.activityLevel) {
          if (parsed.activityLevel === "sedentary") setActivityFactor("sedentary");
          else if (parsed.activityLevel === "moderate") setActivityFactor("moderate");
          else if (parsed.activityLevel === "active") setActivityFactor("active");
        }
        if (parsed.goal) setGoal(parsed.goal);
        if (parsed.targetWeight) setTargetWeight(parsed.targetWeight);
      }
      
      const savedWater = localStorage.getItem("fit_water_drank");
      const savedStreak = localStorage.getItem("fit_streak_v1");
      if (savedStreak) {
        setStreakCount(Number(savedStreak));
      }
      
      const savedWorkouts = localStorage.getItem("fit_completed_workouts_total");
      if (savedWorkouts) {
        setCompletedWorkoutsCount(Number(savedWorkouts));
      }
    } catch (e) {
      console.warn("Storage sync read parsed error:", e);
    }
  }, []);

  const handleIncrementWorkout = () => {
    const nextVal = completedWorkoutsCount + 1;
    setCompletedWorkoutsCount(nextVal);
    localStorage.setItem("fit_completed_workouts_total", String(nextVal));
  };

  const handleResetWorkout = () => {
    setCompletedWorkoutsCount(0);
    localStorage.removeItem("fit_completed_workouts_total");
  };

  // Weights Log Mock
  const [weightLogs, setWeightLogs] = useState<Array<{ week: number; estWeight: number }>>([
    { week: 0, estWeight: 75 },
    { week: 2, estWeight: 75.4 },
    { week: 4, estWeight: 75.9 },
    { week: 6, estWeight: 76.5 },
    { week: 8, estWeight: 77.1 },
    { week: 10, estWeight: 77.6 },
    { week: 12, estWeight: 78.2 }
  ]);

  // Harris Benedict & Mifflin offline physical calculations (Part 4 specification logic)
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === "male") {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    moderate: 1.45,
    active: 1.65,
    extremely_active: 1.85
  };
  const currentMultiplier = multipliers[activityFactor] || 1.45;
  const tdee = Math.round(bmr * currentMultiplier);

  let targetCal = tdee;
  if (goal === "weight_loss") targetCal = tdee - 500;
  else if (goal === "muscle_gain") targetCal = tdee + 400;
  else if (goal === "lean_bulk") targetCal = tdee + 250;

  targetCal = Math.max(targetCal, 1200);

  // Protein g = 2.2g per kg
  const recommendedProtein = Math.round(weight * 2.2);
  const proteinCals = recommendedProtein * 4;

  // Fats calorie ratio 25% of target
  const recommendedFats = Math.round((targetCal * 0.25) / 9);
  const fatsCals = recommendedFats * 9;

  // Carbs = Rest
  const recommendedCarbs = Math.round(Math.max((targetCal - proteinCals - fatsCals) / 4, 30));

  // BMI = weight kg / height m^2
  const bmi = Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;
  const getBmiStatus = (v: number) => {
    if (v < 18.5) return { label: "Underweight", color: "text-blue-400" };
    if (v < 25) return { label: "Normal Range", color: "text-brand-primary" };
    if (v < 30) return { label: "Overweight", color: "text-amber-500" };
    return { label: "Obese (Heavy load)", color: "text-rose-500" };
  };

  const bmiMeta = getBmiStatus(bmi);

  return (
    <div className="space-y-6" id="progress-space-container">
      {/* SECTION HEADER */}
      <div className="bg-brand-card border border-gray-800 rounded-xl p-5">
        <h3 className="text-base font-bold text-gray-100 font-display flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-primary animate-pulse" /> Part 4: Algorithmic Sports Science Engine
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Perform baseline physical analysis offline. Contrast calculations instantly against Mifflin-St Jeor formulations to check absolute correctness.
        </p>
      </div>

      {/* 📈 COMPREHENSIVE SIMPLE PROGRESS SYSTEM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* CARD 1: Weight Progress */}
        <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-mono uppercase font-bold">Weight Progress</span>
            <Scale className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="my-3">
            <div className="text-xl font-bold font-mono text-gray-100">
              {weight} kg <span className="text-xs font-normal text-gray-400">→ target</span> {targetWeight} kg
            </div>
            {/* simple progression bar */}
            <div className="w-full h-1.5 bg-[#121212] rounded-full overflow-hidden mt-2.5 border border-gray-800">
              <div 
                className="h-full bg-brand-primary rounded-full transition-all duration-300" 
                style={{ width: `${Math.max(5, Math.min(100, (weight / targetWeight) * 100))}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] text-gray-450">
            {weight === targetWeight 
              ? "Goal achieved!" 
              : `${Math.abs(weight - targetWeight).toFixed(1)} kg delta remaining`
            }
          </span>
        </div>

        {/* CARD 2: Daily Streak */}
        <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-mono uppercase font-bold">Daily Streak</span>
            <Flame className="w-4 h-4 text-brand-primary fill-brand-primary/10" />
          </div>
          <div className="my-3">
            <div className="text-xl font-bold font-mono text-gray-100">
              {streakCount} Active Days
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              Consistency scores calibrated offline
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-ping" />
            <span className="text-[10px] font-medium text-brand-primary uppercase">Active Workout Period</span>
          </div>
        </div>

        {/* CARD 3: Completed Workouts */}
        <div className="bg-brand-card border border-gray-800 rounded-[18px] p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-mono uppercase font-bold">Completed Splits</span>
            <Award className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="my-2.5 space-y-2">
            <div className="text-xl font-bold font-mono text-gray-100 flex items-center justify-between">
              <span>{completedWorkoutsCount} Routines</span>
            </div>
            <div className="flex gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={handleIncrementWorkout}
                className="flex-1 py-1 px-2.5 bg-brand-primary/10 hover:bg-brand-primary/25 text-brand-primary text-[10px] font-bold rounded-md border border-brand-primary/20 transition-all text-center leading-none"
              >
                + Drill Done
              </button>
              <button
                type="button"
                onClick={handleResetWorkout}
                className="py-1 px-2 text-gray-600 hover:text-rose-450 hover:bg-rose-950/20 text-[10px] rounded transition-all font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
          <span className="text-[9px] text-gray-450 font-mono leading-none">
            Click drill done to log completed sessions as you finish
          </span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUT VARIABLES SLIDER CONTROLLER (COLSPAN-5) */}
        <div className="lg:col-span-5 bg-brand-card border border-gray-800 rounded-xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-gray-850 pb-2 flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-primary" /> Core Profile Biometrics
          </h4>

          {/* Gender */}
          <div className="space-y-1.5 text-xs">
            <span className="text-gray-450 font-medium">Biological Coefficient</span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`py-1.5 rounded-lg border text-center transition-colors font-semibold ${
                  gender === "male"
                    ? "bg-brand-primary/10 border-brand-primary text-white"
                    : "bg-[#07090e] border-gray-850 text-gray-400 hover:border-gray-700"
                }`}
              >
                Male (+5 constant)
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`py-1.5 rounded-lg border text-center transition-colors font-semibold ${
                  gender === "female"
                    ? "bg-brand-primary/10 border-brand-primary text-white"
                    : "bg-[#07090e] border-gray-850 text-gray-400 hover:border-gray-700"
                }`}
              >
                Female (-161 constant)
              </button>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-450">Current Weight Target</span>
              <span className="font-mono text-brand-secondary font-bold">{weight} kg</span>
            </div>
            <input
              type="range"
              min="40"
              max="150"
              value={weight}
              onChange={(e) => {
                const w = Number(e.target.value);
                setWeight(w);
                // regenerate mock weekly curve
                setWeightLogs([
                  { week: 0, estWeight: w },
                  { week: 2, estWeight: Math.round((w + (goal === "weight_loss" ? -0.5 : 0.4)) * 10) / 10 },
                  { week: 4, estWeight: Math.round((w + (goal === "weight_loss" ? -1.1 : 0.8)) * 10) / 10 },
                  { week: 6, estWeight: Math.round((w + (goal === "weight_loss" ? -1.8 : 1.3)) * 10) / 10 },
                  { week: 8, estWeight: Math.round((w + (goal === "weight_loss" ? -2.4 : 1.7)) * 10) / 10 },
                  { week: 10, estWeight: Math.round((w + (goal === "weight_loss" ? -3.0 : 2.2)) * 10) / 10 },
                  { week: 12, estWeight: Math.round((w + (goal === "weight_loss" ? -3.5 : 2.5)) * 10) / 10 }
                ]);
              }}
              className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
            />
          </div>

          {/* Height */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-450">Stature Heights Limit</span>
              <span className="font-mono text-brand-primary font-bold">{height} cm</span>
            </div>
            <input
              type="range"
              min="120"
              max="220"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
          </div>

          {/* Age */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-450">Active Age Range</span>
              <span className="font-mono text-gray-300 font-bold">{age} yrs</span>
            </div>
            <input
              type="range"
              min="15"
              max="80"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-gray-500"
            />
          </div>

          {/* Activity Rate */}
          <div className="space-y-1 text-xs">
            <span className="text-gray-450">Energy Modifier Coefficient</span>
            <select
              value={activityFactor}
              onChange={(e) => setActivityFactor(e.target.value)}
              className="w-full bg-[#07090e] border border-gray-850 rounded-lg py-1.5 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            >
              <option value="sedentary">Sedentary (BMR x 1.2)</option>
              <option value="moderate">Moderate Training (BMR x 1.45)</option>
              <option value="active">High Output Drills (BMR x 1.65)</option>
              <option value="extremely_active">Professional Athletics (BMR x 1.85)</option>
            </select>
          </div>

          {/* Goals Selection */}
          <div className="space-y-1 text-xs">
            <span className="text-gray-450">Muscular Priority Target</span>
            <select
              value={goal}
              onChange={(e) => {
                const g = e.target.value;
                setGoal(g);
                setWeightLogs(prev => prev.map(p => ({
                  ...p,
                  estWeight: Math.round((weight + (g === "weight_loss" ? -0.3 * p.week : 0.22 * p.week)) * 10) / 10
                })));
              }}
              className="w-full bg-[#07090e] border border-gray-850 rounded-lg py-1.5 px-3 text-xs text-gray-300 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            >
              <option value="muscle_gain">Muscle gain (Bulking + 400 kcal)</option>
              <option value="lean_bulk">Lean bulk (High lean mass + 250 kcal)</option>
              <option value="weight_loss">Deficit cut (-500 kcal)</option>
              <option value="recomp">Body recombination (BMR baseline)</option>
            </select>
          </div>
        </div>

        {/* MATH CALCULATION DISPLAY CABINET (COLSPAN-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-brand-card border border-gray-800 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-gray-850 pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-secondary" /> Offline Energy Calculations Output
            </h4>

            {/* Main stats highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#07090e] border border-gray-850 p-3 rounded-xl text-center">
                <div className="text-[10px] text-gray-500 font-mono">BASAL METABOLIC RATE (BMR)</div>
                <div className="text-lg font-bold font-mono text-gray-200 mt-1">{bmr} kcal</div>
                <div className="text-[9px] text-gray-400 mt-0.5">Absolute cell respiration energy</div>
              </div>
              <div className="bg-[#07090e] border border-gray-850 p-3 rounded-xl text-center">
                <div className="text-[10px] text-gray-500 font-mono">TOTAL INDUCED DAILY ENERGY (TDEE)</div>
                <div className="text-lg font-bold font-mono text-brand-primary mt-1">{tdee} kcal</div>
                <div className="text-[9px] text-gray-400 mt-0.5">Includes selected active drills load</div>
              </div>
            </div>

            <div className="bg-[#07090e] border border-gray-850 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-mono text-gray-500">BODY MASS INDEX (BMI)</div>
                  <div className="text-lg font-bold text-gray-100 mt-0.5 font-mono">{bmi} kg/m²</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 uppercase">Weight Range Focus</div>
                  <span className={`text-xs font-bold ${bmiMeta.color} block mt-0.5`}>
                    {bmiMeta.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Offline target calorie goals and recommended macro split */}
            <div className="space-y-3">
              <h5 className="text-[11px] font-bold text-gray-300 uppercase">Target Macro Threshold Splits</h5>
              
              <div className="space-y-2">
                {/* Calories block */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Total Adjusted Calories Target:</span>
                    <span className="font-mono text-brand-secondary font-bold">{targetCal} kcal</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-secondary rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                {/* Protein */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-450">Optimal Protein threshold (2.2g per Wkg):</span>
                    <span className="font-mono text-brand-primary font-semibold">{recommendedProtein}g <span className="text-[10px] text-gray-500">({proteinCals} kcal)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full animate-pulse" style={{ width: `${Math.min((proteinCals / targetCal) * 100, 100)}%` }}></div>
                  </div>
                </div>

                {/* Carbs */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-450">Glycogen Carbohydrate target:</span>
                    <span className="font-mono text-amber-500 font-semibold">{recommendedCarbs}g <span className="text-[10px] text-gray-500">({recommendedCarbs * 4} kcal)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(((recommendedCarbs * 4) / targetCal) * 100, 100)}%` }}></div>
                  </div>
                </div>

                {/* Fats */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-450">Essential Lipid Fats target (25% of energy):</span>
                    <span className="font-mono text-indigo-400 font-semibold">{recommendedFats}g <span className="text-[10px] text-gray-500">({fatsCals} kcal)</span></span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 12-WEEK WEIGHT ESTIMATOR PREDICTION TABLE */}
            <div className="border border-gray-850 bg-[#07090e]/40 p-3.5 rounded-xl">
              <h5 className="text-[11px] font-bold text-gray-300 uppercase mb-2 flex items-center justify-between">
                <span>12-Week Biometric Progress Curve</span>
                <span className="text-[10px] text-brand-primary normal-case font-medium">Goal: {goal === "weight_loss" ? "Deficit" : "Surplus"}</span>
              </h5>
              
              <div className="flex items-center justify-between text-center gap-1.5 overflow-x-auto pb-1">
                {weightLogs.map((log) => (
                  <div key={log.week} className="flex-1 min-w-[50px] bg-brand-card border border-gray-850 p-1.5 rounded-lg text-xs">
                    <div className="text-[9px] text-gray-500 font-mono uppercase font-bold">W{log.week}</div>
                    <div className="font-mono font-bold text-gray-200 mt-1">{log.estWeight}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
