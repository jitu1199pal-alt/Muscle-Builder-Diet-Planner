class CalorieCalculator {
  CalorieCalculator._();

  static double calculateBmr(double weightKg, double heightCm, int age, String gender) {
    if (gender.toLowerCase() == 'male') {
      return (10.0 * weightKg) + (6.25 * heightCm) - (5.0 * age) + 5.0;
    } else {
      return (10.0 * weightKg) + (6.25 * heightCm) - (5.0 * age) - 161.0;
    }
  }

  static double getActivityMultiplier(String activityLevel) {
    switch (activityLevel.toLowerCase()) {
      case 'sedentary':
        return 1.2;
      case 'light':
        return 1.375;
      case 'moderate':
        return 1.55;
      case 'active':
        return 1.725;
      case 'extremely active':
        return 1.9;
      default:
        return 1.55; // moderate default
    }
  }

  static int calculateTargetCalories({
    required double weightKg,
    required double heightCm,
    required int age,
    required String gender,
    required String activityLevel,
    required String goal,
  }) {
    final double bmr = calculateBmr(weightKg, heightCm, age, gender);
    final double multiplier = getActivityMultiplier(activityLevel);
    final double tdee = bmr * multiplier;

    double target = tdee;
    switch (goal.toLowerCase()) {
      case 'muscle gain':
        target = tdee + 300;
        break;
      case 'weight gain':
        target = tdee + 500;
        break;
      case 'weight loss':
        target = tdee - 500;
        break;
      case 'fat loss':
        target = tdee - 400;
        break;
      case 'maintain body':
      default:
        target = tdee;
        break;
    }

    // Safety guard
    if (target < 1200) {
      target = 1200;
    }
    return target.round();
  }
}
