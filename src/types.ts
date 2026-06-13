export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  weight: number; // in kg
  height: number; // in cm
  goal: string; // e.g. muscle_gain, weight_loss, fat_loss, weight_gain, recomp
  targetWeight?: number;
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'extremely_active';
  dietType: 'veg' | 'non_veg' | 'vegan' | 'keto' | 'egg_only';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface Exercise {
  id: string;
  name: string;
  exerciseName?: string; // Part 5 Rule 1
  sets: number;
  reps: string;
  target: string;
  notes: string;
  tempo?: string;
  restTimeSecons?: number; // fallback
  restTime?: string; // Rule 15: e.g. "45 sec rest"
  rest?: string; // Part 5 Rule 1
  difficulty?: string; // Part 5 Rule 1 & Rule 2 ("Beginner" | "Moderate" | "Active")
  equipment?: string; // Part 5 Rule 3 ("Bodyweight" | "Dumbbell" | "Gym Machine" | "Resistance Band")
  muscleGroup?: string; // Part 5 Rule 1
}

export interface DayWorkout {
  day: string; // e.g., "Monday"
  focus: string; // e.g., "Chest & Shoulders (Push A)"
  isRest: boolean;
  exercises: Exercise[];
}

export interface Meal {
  id: string;
  type: 'Breakfast' | 'Lunch' | 'Snack' | 'Pre-Workout' | 'Dinner';
  title: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  ingredients: string[];
  recipe: string;
}

export interface DayMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlan {
  dailyMacros: DayMacros;
  meals: Meal[];
}

export interface WorkoutPlan {
  title: string;
  days: DayWorkout[];
}

export interface SavedPlan {
  profile: UserProfile;
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  timestamp: string;
}
