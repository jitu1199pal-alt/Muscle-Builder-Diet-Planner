import 'dart:math' as math;
import '../models/user_model.dart';
import '../models/workout_model.dart';
import '../models/diet_model.dart';
import '../core/utils/bmi_calculator.dart';
import '../core/utils/calorie_calculator.dart';
import '../core/utils/water_calculator.dart';
import '../data/workout_data.dart';
import '../data/diet_data.dart';
import '../core/constants/app_strings.dart';

class PlanGeneratorService {
  PlanGeneratorService._();

  static List<ExerciseModel> _fetchExercises({
    required List<String> muscleGroups,
    required String difficulty,
    required int limit,
  }) {
    List<ExerciseModel> matchedList = WorkoutData.masterExercises.where((ex) {
      bool groupMatch = muscleGroups.contains(ex.muscleGroup);
      bool diffMatch = ex.difficulty.toLowerCase() == difficulty.toLowerCase();
      return groupMatch && diffMatch;
    }).toList();

    // Fallback if no exact difficulty match
    if (matchedList.isEmpty) {
      matchedList = WorkoutData.masterExercises.where((ex) => muscleGroups.contains(ex.muscleGroup)).toList();
    }

    matchedList.shuffle();
    if (matchedList.length > limit) {
      return matchedList.sublist(0, limit);
    }
    return matchedList;
  }

  static Future<Map<String, dynamic>> generatePlan({
    required int age,
    required String gender,
    required double height,
    required double weight,
    required String foodPreference,
    required String activityLevel,
    required String goal,
    required String focus,
  }) async {
    // 1. Core metric logic
    final double bmi = BmiCalculator.calculate(weight, height);
    final int calories = CalorieCalculator.calculateTargetCalories(
      weightKg: weight,
      heightCm: height,
      age: age,
      gender: gender,
      activityLevel: activityLevel,
      goal: goal,
    );

    final double waterLiters = WaterCalculator.calculateLiters(weight);
    final int waterCups = WaterCalculator.calculateCups(weight);
    // Protein Rule (2.2g per kg)
    final int proteinGrams = (weight * 2.2).round();

    // 2. User info model
    final user = UserModel(
      age: age,
      gender: gender,
      height: height,
      weight: weight,
      foodPreference: foodPreference,
      activityLevel: activityLevel,
      goal: goal,
      focus: focus,
      bmi: bmi,
      targetCalories: calories,
      targetWaterLiters: waterLiters,
      targetWaterCups: waterCups,
      targetProteinGrams: proteinGrams,
    );

    // 3. Muscle mapping splits based on Rule 8 Split Rules
    // Split Rule: Day 1 Main target, Day 2 Support muscle, Day 3 Recovery, Day 4 Intensity, Day 5 Main target, Day 6 Cardio, Day 7 Rest
    List<String> mainTargetGroup = [];
    List<String> supportTargetGroup = [];

    final String focusLower = focus.toLowerCase();
    if (focusLower.contains("chest")) {
      mainTargetGroup = ["Chest"];
      supportTargetGroup = ["Biceps", "Shoulders"];
    } else if (focusLower.contains("bicep")) {
      mainTargetGroup = ["Biceps"];
      supportTargetGroup = ["Back"];
    } else if (focusLower.contains("shoulder")) {
      mainTargetGroup = ["Shoulders"];
      supportTargetGroup = ["Chest"];
    } else if (focusLower.contains("back")) {
      mainTargetGroup = ["Back"];
      supportTargetGroup = ["Biceps"];
    } else if (focusLower.contains("leg")) {
      mainTargetGroup = ["Legs"];
      supportTargetGroup = ["Abs"];
    } else if (focusLower.contains("abs")) {
      mainTargetGroup = ["Abs"];
      supportTargetGroup = ["Chest"];
    } else {
      // Default / Full Body
      mainTargetGroup = ["Chest", "Back"];
      supportTargetGroup = ["Legs", "Shoulders"];
    }

    // Determine exercise difficulty based on age and activity
    String diff = "Moderate";
    if (age > 50 || activityLevel.toLowerCase() == "sedentary") {
      diff = "Beginner";
    } else if (activityLevel.toLowerCase().contains("active")) {
      diff = "Active";
    }

    // Create 7 Days Workout plan representing Rule 8 Split exactly
    final List<DayWorkoutModel> days = [
      // Day 1: Main target
      DayWorkoutModel(
        day: "Monday",
        focus: "Main Focus: $focus",
        isRest: false,
        exercises: _fetchExercises(muscleGroups: mainTargetGroup, difficulty: diff, limit: 4),
      ),
      // Day 2: Support muscle
      DayWorkoutModel(
        day: "Tuesday",
        focus: "Support Action: ${supportTargetGroup.join(" & ")}",
        isRest: false,
        exercises: _fetchExercises(muscleGroups: supportTargetGroup, difficulty: diff, limit: 3),
      ),
      // Day 3: Recovery
      DayWorkoutModel(
        day: "Wednesday",
        focus: "Active Recovery",
        isRest: true,
        exercises: [],
      ),
      // Day 4: Intensity
      DayWorkoutModel(
        day: "Thursday",
        focus: "High-Intensity Stack",
        isRest: false,
        exercises: _fetchExercises(muscleGroups: [...mainTargetGroup, ...supportTargetGroup], difficulty: "Active", limit: 4),
      ),
      // Day 5: Main target
      DayWorkoutModel(
        day: "Friday",
        focus: "$focus Hypertrophy",
        isRest: false,
        exercises: _fetchExercises(muscleGroups: mainTargetGroup, difficulty: diff, limit: 3),
      ),
      // Day 6: Cardio
      DayWorkoutModel(
        day: "Saturday",
        focus: "Cardio & Stamina Flush",
        isRest: false,
        exercises: _fetchExercises(muscleGroups: ["Cardio", "Abs"], difficulty: "Beginner", limit: 3),
      ),
      // Day 7: Rest
      DayWorkoutModel(
        day: "Sunday",
        focus: "Rest & Revitalize",
        isRest: true,
        exercises: [],
      ),
    ];

    final workoutPlan = WorkoutPlanModel(
      title: "7-Day Premium Routine ($focus Split)",
      days: days,
    );

    // 4. Diet Planner configuration
    // Fetch recipes matching the preference
    final List<MealModel> targetRecipeSet = DietData.masterMeals.where((ml) {
      return ml.id.startsWith(foodPreference.toLowerCase());
    }).toList();

    // Reconstruct list cleanly
    List<MealModel> mealModelList = [];
    if (targetRecipeSet.isNotEmpty) {
      mealModelList = List.from(targetRecipeSet);
    } else {
      // Fallback
      mealModelList = DietData.masterMeals.where((ml) => ml.id.startsWith('veg')).toList();
    }

    // Determine high relevance avoid lists based on Goal (Rule 16)
    List<String> avoidList = (goal.toLowerCase().contains("loss") || goal.toLowerCase().contains("lean"))
        ? AppStrings.weightLossAvoids
        : AppStrings.muscleGainAvoids;

    // Retrieve randomized motivation quote (Rule 18)
    final randomMotIdx = math.Random().nextInt(AppStrings.motivations.length);
    final String motivation = AppStrings.motivations[randomMotIdx];

    final dietPlan = DietPlanModel(
      totalCalories: calories,
      totalProtein: proteinGrams,
      totalCarbs: (calories * 0.45 / 4).round(),
      totalFat: (calories * 0.25 / 9).round(),
      meals: mealModelList,
      avoidList: avoidList,
      motivation: motivation,
    );

    return {
      'user': user,
      'workout': workoutPlan,
      'diet': dietPlan,
    };
  }
}
