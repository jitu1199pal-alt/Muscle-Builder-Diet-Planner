import React, { useState, useEffect, useRef } from "react";
import { WorkoutPlan, DayWorkout, Exercise } from "../types";
import { Dumbbell, Calendar, Flame, CheckCircle, Clock, Play, Pause, RotateCcw, AlertCircle, Info, ChevronRight } from "lucide-react";

interface WorkoutDeckProps {
  plan: WorkoutPlan;
}

export default function WorkoutDeck({ plan }: WorkoutDeckProps) {
  // Map days to ensure state is clean
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [activeDay, setActiveDay] = useState<string>("Monday");
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [exerciseSetsCompleted, setExerciseSetsCompleted] = useState<Record<string, number>>({});
  
  // Timer States
  const [timerDuration, setTimerDuration] = useState<number>(90);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound effect mockup: We can use Web Audio API to play a beautiful synthesized "double-beip" when the timer ends!
  // This is a premium touch. It's safe and doesn't load binary resources.
  const playTimerDoneSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playBeep = (time: number, freq: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur - 0.02);
        
        osc.start(time);
        osc.stop(time + dur);
      };

      const now = audioCtx.currentTime;
      playBeep(now, 587.33, 0.15); // D5
      playBeep(now + 0.2, 880, 0.3);   // A5
    } catch (e) {
      console.log("Audio Context synthesizer couldn't fire due to lack of tap gesture.", e);
    }
  };

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playTimerDoneSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  const startTimer = (seconds: number) => {
    setTimerDuration(seconds);
    setTimeLeft(seconds);
    setTimerActive(true);
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(0);
  };

  const activeDayWorkout = plan.days.find((d) => d.day.toLowerCase() === activeDay.toLowerCase()) || {
    day: activeDay,
    focus: "Rest & Active Recovery",
    isRest: true,
    exercises: []
  };

  const toggleExerciseSet = (exerciseId: string, setIdx: number, totalSets: number) => {
    const key = `${exerciseId}-set-${setIdx}`;
    const completedSets = exerciseSetsCompleted[exerciseId] || 0;
    const isCompletedNow = !completedExercises[key];

    // Toggle the checkbox
    setCompletedExercises((prev) => ({
      ...prev,
      [key]: isCompletedNow,
    }));

    // Update sets remaining / progress
    let newCompleted = completedSets;
    if (isCompletedNow) {
      newCompleted = Math.min(completedSets + 1, totalSets);
      // Trigger short rest timer when a set is finished
      if (timeLeft === 0) {
        startTimer(90); // starts 90s standard rest
      }
    } else {
      newCompleted = Math.max(completedSets - 1, 0);
    }

    setExerciseSetsCompleted((prev) => ({
      ...prev,
      [exerciseId]: newCompleted,
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Rest Timer progress bar helper
  const timerPercentage = timerDuration > 0 ? (timeLeft / timerDuration) * 100 : 0;

  return (
    <div className="space-y-6" id="workout-deck-container">
      {/* SEVENTY DAY CALENDAR LINE */}
      <div className="bg-brand-card border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          <Calendar className="w-4 h-4 text-brand-primary" /> Training Split Calendar Focus
        </div>

        {/* Calendar scroll row */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {daysOfWeek.map((day) => {
            const dPlan = plan.days.find((d) => d.day.toLowerCase() === day.toLowerCase());
            const isTodayActive = activeDay === day;
            const isRest = dPlan ? dPlan.isRest : true;

            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`py-2 px-3 rounded-lg border text-center shrink-0 min-w-[85px] transition-all duration-150 ${
                  isTodayActive
                    ? "bg-brand-primary border-brand-primary text-black font-semibold shadow-md shadow-brand-primary/20 scale-102"
                    : "bg-[#07090e]/60 border-gray-800 text-gray-300 hover:border-gray-700"
                }`}
              >
                <div className="text-[10px] uppercase font-semibold leading-tight tracking-wide">
                  {day.slice(0, 3)}
                </div>
                <div className={`text-xs mt-1 font-bold ${isTodayActive ? "text-brand-bg md:block" : isRest ? "text-gray-500" : "text-brand-primary"}`}>
                  {isRest ? "REST" : "WORK"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WORKOUT LIST (COLSPAN-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-brand-card border border-gray-800 rounded-xl p-5 space-y-4">
            {/* Header / Focus Area */}
            <div className="flex justify-between items-start border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-100 font-display flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-brand-primary" /> {activeDayWorkout.day} Workout
                </h3>
                <p className="text-xs text-brand-secondary mt-1 font-semibold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> {activeDayWorkout.focus}
                </p>
              </div>
              <div className="bg-[#07090e] border border-gray-800 px-3 py-1.5 rounded-lg text-xs font-mono text-gray-400">
                {activeDayWorkout.isRest ? "0 Exercises" : `${activeDayWorkout.exercises?.length || 0} Exercises`}
              </div>
            </div>

            {/* Scientific Advisory Notice (Spot Reduction Disclaimer) */}
            {activeDayWorkout.focus?.toLowerCase().includes("face") && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl text-xs text-amber-500 flex items-start gap-2.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <span className="font-bold text-amber-400 block mb-0.5">Physical Science Advisory:</span>
                  Spot reduction is biologically impossible. You cannot selectively mobilize fat from a target region of your body (such as your cheeks or cheeks/neck) with local exercises. Systemic fat oxidation via a sustained caloric deficit is the only scientifically validated mechanism for facial fat loss.
                </div>
              </div>
            )}

            {/* If rest day */}
            {activeDayWorkout.isRest ? (
              <div className="text-center py-12 px-6 bg-[#07090e]/40 rounded-xl border border-dashed border-gray-800">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-gray-200">System Recovery Day</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mt-2 leading-relaxed">
                  Excellent work during training. Take today to rest, foam roll, hydrate, and trigger muscular protein synthesis with structured nutrition meals.
                </p>
              </div>
            ) : (
              /* Exercise List */
              <div className="space-y-4">
                {activeDayWorkout.exercises.map((exercise, idx) => {
                  const completedSetsCount = exerciseSetsCompleted[exercise.id] || 0;
                  const percentComplete = Math.round((completedSetsCount / exercise.sets) * 100);

                  return (
                    <div
                      key={exercise.id}
                      className={`border rounded-xl transition-all duration-150 p-4 ${
                        completedSetsCount === exercise.sets
                          ? "bg-[#07090e]/70 border-brand-primary/30"
                          : "bg-[#07090e]/40 border-gray-800/80 hover:border-gray-700"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-500">0{idx + 1}.</span>
                            <h4 className="text-sm font-bold text-gray-100 font-display">{exercise.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-medium">
                              {exercise.target}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              {exercise.sets} sets x {exercise.reps} reps
                            </span>
                          </div>
                        </div>

                        {/* Progress Badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-gray-400">
                            {completedSetsCount}/{exercise.sets} Sets
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            percentComplete === 100 ? "bg-brand-primary/25 text-brand-primary" : "bg-gray-800 text-gray-400"
                          }`}>
                            {percentComplete}%
                          </span>
                        </div>
                      </div>

                      {/* Sets checklist tracker */}
                      <div className="flex items-center gap-1.5 flex-wrap bg-[#07090e]/90 border border-gray-800 p-2 rounded-lg mb-3">
                        <span className="text-[10px] text-gray-500 uppercase font-bold pr-2">Check Sets:</span>
                        {Array.from({ length: exercise.sets }).map((_, sIdx) => {
                          const setKey = `${exercise.id}-set-${sIdx}`;
                          const isSetChecked = completedExercises[setKey] || false;

                          return (
                            <button
                              key={sIdx}
                              onClick={() => toggleExerciseSet(exercise.id, sIdx, exercise.sets)}
                              className={`w-6.5 h-6.5 rounded-md text-xs font-bold transition flex items-center justify-center ${
                                isSetChecked
                                  ? "bg-brand-primary text-black font-semibold shadow shadow-brand-primary/20 scale-103"
                                  : "bg-brand-card text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-white"
                              }`}
                            >
                              S{sIdx + 1}
                            </button>
                          );
                        })}
                      </div>

                      {/* Exercise notes */}
                      <div className="flex gap-2 text-xs text-gray-400 bg-brand-card/70 border border-border-crisp/40 p-2.5 rounded-lg leading-relaxed">
                        <Info className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                        <div>
                          <p>{exercise.notes}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* REST TIMER CORE (COLSPAN-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-brand-card border border-gray-800 rounded-xl p-5 text-center space-y-4 sticky top-4">
            <h3 className="text-sm font-bold text-gray-200 font-display flex items-center justify-center gap-2 border-b border-gray-800 pb-3">
              <Clock className="w-4 h-4 text-brand-primary" /> Active Cardio-Rest Timer
            </h3>

            {/* Timer visual block */}
            <div className="py-6 relative">
              {/* Radial or heavy text clock */}
              <div className="text-4xl md:text-5xl font-mono font-bold text-gray-100 tracking-tight select-none">
                {timeLeft > 0 ? formatTime(timeLeft) : "0:00"}
              </div>
              <div className="text-[10px] text-gray-500 uppercase font-mono mt-2">
                {timerActive ? "Rest in Progress" : timeLeft > 0 ? "Paused" : "Timer Ready"}
              </div>

              {/* Progress pill indicator */}
              <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden mt-6">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-300"
                  style={{ width: `${timerPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Timer Speed dial selectors */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => startTimer(45)}
                className="bg-[#07090e] border border-gray-800 hover:border-gray-700 text-xs py-1.5 rounded-lg text-gray-300 font-mono"
              >
                45s
              </button>
              <button
                onClick={() => startTimer(90)}
                className="bg-[#07090e] border border-gray-800 hover:border-gray-700 text-xs py-1.5 rounded-lg text-gray-300 font-mono"
              >
                90s
              </button>
              <button
                onClick={() => startTimer(120)}
                className="bg-[#07090e] border border-gray-800 hover:border-gray-700 text-xs py-1.5 rounded-lg text-gray-300 font-mono"
              >
                2m
              </button>
            </div>

            {/* Control buttons */}
            <div className="flex gap-2">
              {timeLeft > 0 ? (
                <button
                  onClick={toggleTimer}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    timerActive
                      ? "bg-amber-500 text-black hover:bg-amber-400"
                      : "bg-brand-primary text-black hover:bg-brand-primary/90"
                  }`}
                >
                  {timerActive ? (
                    <>
                      <Pause className="w-4 h-4" /> Pause Rest
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Resume
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => startTimer(90)}
                  className="flex-1 bg-brand-primary text-black hover:bg-brand-primary/90 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Play className="w-4 h-4" /> Start Rest (90s)
                </button>
              )}

              <button
                onClick={resetTimer}
                disabled={timeLeft === 0}
                className="bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 p-2.5 rounded-lg transition disabled:opacity-20"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile App compliance warning */}
            <div className="bg-[#07090e]/60 border border-amber-500/10 p-3 rounded-lg text-[10px] text-gray-400 text-left space-y-1">
              <span className="text-brand-secondary font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> AdMob Monetization Rule:
              </span>
              <p className="leading-relaxed text-[9px]">
                In Part 5 of the production spec, this Rest Tracker contains an anchored Collapsible Banner ad to prevent layout shifts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
