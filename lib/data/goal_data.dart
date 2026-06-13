class GoalData {
  GoalData._();

  static const List<String> goals = [
    "Muscle Gain",
    "Weight Loss",
    "Fat Loss",
    "Weight Gain",
    "Maintain Body"
  ];

  static List<String> getFocusOptions(String goal) {
    switch (goal.toLowerCase()) {
      case 'muscle gain':
        return ["Full Body", "Chest", "Biceps", "Shoulders", "Back", "Legs", "Abs", "Lean Muscle", "Bulk Muscle"];
      case 'weight loss':
      case 'fat loss':
        return ["Belly Fat", "Face Fat", "Full Body Fat", "Love Handles", "Thigh Fat"];
      case 'weight gain':
        return ["Healthy Gain", "Bulk Gain", "Skinny to Fit"];
      case 'maintain body':
      default:
        return ["General Fitness", "Lean Body", "Active Lifestyle"];
    }
  }

  static const List<String> preferences = [
    "Veg",
    "Eggetarian",
    "Non-Veg",
    "Keto"
  ];

  static const List<String> activities = [
    "Sedentary",
    "Light",
    "Moderate",
    "Active",
    "Extremely Active"
  ];
}
