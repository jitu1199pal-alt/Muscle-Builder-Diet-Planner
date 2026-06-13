class UserModel {
  final int age;
  final String gender;
  final double height;
  final double weight;
  final String foodPreference;
  final String activityLevel;
  final String goal;
  final String focus;
  final double bmi;
  final int targetCalories;
  final double targetWaterLiters;
  final int targetWaterCups;
  final int targetProteinGrams;

  UserModel({
    required this.age,
    required this.gender,
    required this.height,
    required this.weight,
    required this.foodPreference,
    required this.activityLevel,
    required this.goal,
    required this.focus,
    required this.bmi,
    required this.targetCalories,
    required this.targetWaterLiters,
    required this.targetWaterCups,
    required this.targetProteinGrams,
  });

  Map<String, dynamic> toJson() {
    return {
      'age': age,
      'gender': gender,
      'height': height,
      'weight': weight,
      'foodPreference': foodPreference,
      'activityLevel': activityLevel,
      'goal': goal,
      'focus': focus,
      'bmi': bmi,
      'targetCalories': targetCalories,
      'targetWaterLiters': targetWaterLiters,
      'targetWaterCups': targetWaterCups,
      'targetProteinGrams': targetProteinGrams,
    };
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      age: json['age'] ?? 25,
      gender: json['gender'] ?? 'male',
      height: (json['height'] ?? 175.0).toDouble(),
      weight: (json['weight'] ?? 70.0).toDouble(),
      foodPreference: json['foodPreference'] ?? 'veg',
      activityLevel: json['activityLevel'] ?? 'moderate',
      goal: json['goal'] ?? 'Muscle Gain',
      focus: json['focus'] ?? 'Full Body',
      bmi: (json['bmi'] ?? 22.8).toDouble(),
      targetCalories: json['targetCalories'] ?? 2200,
      targetWaterLiters: (json['targetWaterLiters'] ?? 2.8).toDouble(),
      targetWaterCups: json['targetWaterCups'] ?? 11,
      targetProteinGrams: json['targetProteinGrams'] ?? 120,
    );
  }
}
