class MealModel {
  final String id;
  final String mealName; // Rule 9
  final String title; // dual compatibility
  final List<String> foods; // Rule 9
  final List<String> ingredients; // dual compatibility
  final int protein; // Rule 9
  final int calories; // Rule 9
  final String mealType; // Rule 9 ("Breakfast", "Lunch", "Snack", "Dinner")
  final String type; // dual compatibility
  final int carbs;
  final int fat;
  final String recipe;

  MealModel({
    required this.id,
    required this.mealName,
    required this.title,
    required this.foods,
    required this.ingredients,
    required this.protein,
    required this.calories,
    required this.mealType,
    required this.type,
    required this.carbs,
    required this.fat,
    required this.recipe,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'mealName': mealName,
      'title': title,
      'foods': foods,
      'ingredients': ingredients,
      'protein': protein,
      'calories': calories,
      'mealType': mealType,
      'type': type,
      'carbs': carbs,
      'fat': fat,
      'recipe': recipe,
    };
  }

  factory MealModel.fromJson(Map<String, dynamic> json) {
    var rawFoods = json['foods'] as List? ?? json['ingredients'] as List? ?? [];
    List<String> foodsList = rawFoods.map((f) => f.toString()).toList();
    return MealModel(
      id: json['id'] ?? '',
      mealName: json['mealName'] ?? json['title'] ?? '',
      title: json['title'] ?? json['mealName'] ?? '',
      foods: foodsList,
      ingredients: foodsList,
      protein: json['protein'] ?? 20,
      calories: json['calories'] ?? 400,
      mealType: json['mealType'] ?? json['type'] ?? 'Breakfast',
      type: json['type'] ?? json['mealType'] ?? 'Breakfast',
      carbs: json['carbs'] ?? 30,
      fat: json['fat'] ?? 10,
      recipe: json['recipe'] ?? 'Consume as suggested.',
    );
  }
}

class DietPlanModel {
  final int totalCalories;
  final int totalProtein;
  final int totalCarbs;
  final int totalFat;
  final List<MealModel> meals;
  final List<String> avoidList;
  final String motivation;

  DietPlanModel({
    required this.totalCalories,
    required this.totalProtein,
    required this.totalCarbs,
    required this.totalFat,
    required this.meals,
    required this.avoidList,
    required this.motivation,
  });

  Map<String, dynamic> toJson() {
    return {
      'totalCalories': totalCalories,
      'totalProtein': totalProtein,
      'totalCarbs': totalCarbs,
      'totalFat': totalFat,
      'meals': meals.map((m) => m.toJson()).toList(),
      'avoidList': avoidList,
      'motivation': motivation,
    };
  }

  factory DietPlanModel.fromJson(Map<String, dynamic> json) {
    var list = json['meals'] as List? ?? [];
    List<MealModel> mealsList = list.map((m) => MealModel.fromJson(m)).toList();
    var avoids = json['avoidList'] as List? ?? [];
    List<String> avoidList = avoids.map((a) => a.toString()).toList();
    return DietPlanModel(
      totalCalories: json['totalCalories'] ?? 2000,
      totalProtein: json['totalProtein'] ?? 120,
      totalCarbs: json['totalCarbs'] ?? 200,
      totalFat: json['totalFat'] ?? 60,
      meals: mealsList,
      avoidList: avoidList,
      motivation: json['motivation'] ?? "Stay consistent.",
    );
  }
}
