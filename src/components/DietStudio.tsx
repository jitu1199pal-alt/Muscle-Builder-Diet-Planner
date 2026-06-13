import React, { useState } from "react";
import { DietPlan, Meal } from "../types";
import { Utensils, Droplets, Info, Sparkles, CheckCircle, Flame, Apple, ArrowRight } from "lucide-react";

interface DietStudioProps {
  plan: DietPlan;
  engine: string;
}

export default function DietStudio({ plan, engine }: DietStudioProps) {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(plan.meals[0]?.id || null);
  const [waterGlasses, setWaterGlasses] = useState<number>(3); // base tracked value
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const targetWaterGlasses = 12; // 12 glasses x 250ml = 3 Liters
  const waterPercentage = Math.min((waterGlasses / targetWaterGlasses) * 100, 100);

  const selectedMeal = plan.meals.find((m) => m.id === selectedMealId) || plan.meals[0];

  const handleWaterClick = (num: number) => {
    setWaterGlasses(num);
  };

  const toggleIngredient = (mealId: string, ingredient: string) => {
    const key = `${mealId}-${ingredient}`;
    setCheckedIngredients((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Safe percentages calculation
  const totalCalories = plan.dailyMacros.calories;
  const targetProtein = plan.dailyMacros.protein;
  const targetCarbs = plan.dailyMacros.carbs;
  const targetFat = plan.dailyMacros.fat;

  return (
    <div className="space-y-6" id="diet-studio-container">
      {/* MACROS GAUGE LEVEL */}
      <div className="bg-brand-card border border-gray-800 rounded-xl p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-gray-100 font-display flex items-center gap-2">
              <Utensils className="w-4 h-4 text-brand-primary" /> Daily Nutrition Macro Targets
            </h3>
            <p className="text-xs text-gray-400 mt-1">Calculated and balanced to saturate muscle recovery and boost metabolic goals.</p>
          </div>
          <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs px-2.5 py-1 rounded-full font-mono flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5" /> Engine: {engine}
          </div>
        </div>

        {/* Dynamic Metric Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* CALORIES */}
          <div className="bg-[#07090e]/75 border border-gray-800/80 rounded-xl p-4 text-center relative overflow-hidden group">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Energy Budget</div>
            <div className="text-2xl font-mono font-bold text-gray-100">{totalCalories}</div>
            <div className="text-[10px] text-brand-secondary font-semibold font-mono mt-0.5">kcal / daily</div>
            <div className="w-full h-1 bg-brand-secondary/20 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-brand-secondary rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>

          {/* PROTEIN (Build muscle) */}
          <div className="bg-[#07090e]/75 border border-brand-primary/10 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider text-brand-primary font-bold mb-1">Protein (4kcal/g)</div>
            <div className="text-2xl font-mono font-bold text-gray-100">{targetProtein}g</div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{targetProtein * 4} kcal target</div>
            <div className="w-full h-1 bg-brand-primary/20 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>

          {/* CARBS (Glycogen fuel) */}
          <div className="bg-[#07090e]/75 border border-gray-800/80 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider text-amber-500 font-bold mb-1">Carbs (4kcal/g)</div>
            <div className="text-2xl font-mono font-bold text-gray-100">{targetCarbs}g</div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{targetCarbs * 4} kcal target</div>
            <div className="w-full h-1 bg-amber-500/20 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>

          {/* FATS (Hormone optimizer) */}
          <div className="bg-[#07090e]/75 border border-gray-800/80 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold mb-1">Fats (9kcal/g)</div>
            <div className="text-2xl font-mono font-bold text-gray-100">{targetFat}g</div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{targetFat * 9} kcal target</div>
            <div className="w-full h-1 bg-indigo-500/20 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INTERACTIVE MEAL TIMELINE (COL-SPAN-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-brand-card border border-gray-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider border-b border-gray-850 pb-2">
              System Meals Partition
            </h4>

            <div className="space-y-2">
              {plan.meals.map((meal, index) => {
                const isActive = meal.id === selectedMealId;

                return (
                  <button
                    key={meal.id}
                    onClick={() => setSelectedMealId(meal.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center justify-between ${
                      isActive
                        ? "bg-brand-primary/10 border-brand-primary/30 text-white"
                        : "bg-[#07090e]/50 border-gray-850 text-gray-400 hover:bg-[#07090e]/95 hover:border-gray-850"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono font-semibold uppercase text-brand-secondary">
                        {meal.type}
                      </div>
                      <div className={`text-xs font-bold leading-tight ${isActive ? "text-gray-100" : "text-gray-300"}`}>
                        {meal.title}
                      </div>
                      <div className="flex gap-2 text-[10px] text-gray-500 font-mono">
                        <span>P: {meal.protein}g</span>
                        <span>•</span>
                        <span>C: {meal.carbs}g</span>
                        <span>•</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-gray-200">{meal.calories}</div>
                      <div className="text-[9px] text-gray-500 font-mono">kcal</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* WATER TRACKER LEDGER */}
          <div className="bg-brand-card border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-400" /> Hydration Tracker (3.0L)
              </h4>
              <span className="text-xs font-mono font-semibold text-blue-400">
                {waterGlasses * 250}ml / 3000ml
              </span>
            </div>

            {/* Quick tracker glasses visual Row */}
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: targetWaterGlasses }).map((_, i) => {
                const isSelected = i < waterGlasses;

                return (
                  <button
                    key={i}
                    onClick={() => handleWaterClick(isSelected ? i : i + 1)}
                    className={`h-9 rounded-lg flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? "bg-blue-500/20 border border-blue-400/40 text-blue-400"
                        : "bg-[#07090e] border border-gray-850 text-gray-650 hover:border-gray-700"
                    }`}
                  >
                    <Droplets className={`w-4 h-4 ${isSelected ? "fill-blue-500 text-blue-400" : "text-gray-600"}`} />
                    <span className="text-[9px] font-mono mt-0.5">{i + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#07090e]/60 rounded-lg p-2.5 text-[10px] text-gray-500 leading-relaxed">
              Consuming water guarantees optimal hydration state, promoting synthesis and strength metrics inside workouts. Aim for 250-500ml during recovery window.
            </div>
          </div>
        </div>

        {/* ACTIVE RECIPE DETAILS (COL-SPAN-7) */}
        <div className="lg:col-span-7">
          {selectedRawMeal(selectedMeal) && (
            <div className="bg-brand-card border border-gray-800 rounded-xl p-5 md:p-6 space-y-5">
              {/* Header Info */}
              <div className="border-b border-gray-800 pb-4">
                <div className="text-[10px] font-mono font-bold tracking-widest text-[#10B981] uppercase mb-1">
                  Active {selectedMeal.type} Formula
                </div>
                <h3 className="text-lg font-bold font-display text-gray-100">{selectedMeal.title}</h3>
                
                {/* Specific meal macros bar */}
                <div className="grid grid-cols-4 gap-2 text-center mt-3 bg-[#07090e] border border-gray-850 p-2 rounded-lg">
                  <div>
                    <div className="text-[9px] uppercase font-mono text-gray-500">Calories</div>
                    <div className="text-xs font-mono font-bold text-gray-300">{selectedMeal.calories} kcal</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-mono text-gray-500">Protein</div>
                    <div className="text-xs font-mono font-bold text-brand-primary">{selectedMeal.protein}g</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-mono text-gray-500">Carbs</div>
                    <div className="text-xs font-mono font-bold text-amber-500">{selectedMeal.carbs}g</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-mono text-gray-500">Fat</div>
                    <div className="text-xs font-mono font-bold text-indigo-400">{selectedMeal.fat}g</div>
                  </div>
                </div>
              </div>

              {/* Ingredients section */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1">
                  <Apple className="w-3.5 h-3.5 text-orange-400" /> Weigh Ingredients Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedMeal.ingredients.map((ing) => {
                    const isChecked = checkedIngredients[`${selectedMeal.id}-${ing}`] || false;

                    return (
                      <button
                        key={ing}
                        onClick={() => toggleIngredient(selectedMeal.id, ing)}
                        className={`text-left text-xs p-2.5 rounded-lg border flex items-center gap-3 transition-colors ${
                          isChecked
                            ? "bg-[#07090e] border-brand-primary/20 text-gray-500 line-through"
                            : "bg-[#07090e]/60 border-gray-850 text-gray-300 hover:border-gray-700"
                        }`}
                      >
                        <CheckCircle className={`w-4 h-4 shrink-0 ${isChecked ? "text-brand-primary fill-brand-primary/10" : "text-gray-700"}`} />
                        <span className="truncate">{ing}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preparation Strategy */}
              <div className="space-y-2.5 bg-[#07090e]/90 border border-gray-850 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-brand-primary" /> Cooking & Assembly Strategy
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line bg-transparent border-0 p-0">
                  {selectedMeal.recipe}
                </p>
              </div>

              {/* AdMob compliant notice */}
              <div className="text-[10px] text-gray-500 bg-[#07090e]/40 border border-border-crisp/20 p-3 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-primary shrink-0 animate-pulse" />
                <p className="text-[9px]">
                  <strong>System Diet Logic:</strong> Low glycemic carbohydrates mapped to muscle insulin triggers. Recipes satisfy specified fiber parameters.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function selectedRawMeal(m: Meal | undefined): m is Meal {
  return m !== undefined;
}
