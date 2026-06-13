class WeightLogModel {
  final String date;
  final double weight;

  WeightLogModel({
    required this.date,
    required this.weight,
  });

  Map<String, dynamic> toJson() {
    return {
      'date': date,
      'weight': weight,
    };
  }

  factory WeightLogModel.fromJson(Map<String, dynamic> json) {
    return WeightLogModel(
      date: json['date'] ?? '',
      weight: (json['weight'] ?? 70.0).toDouble(),
    );
  }
}

class DailyHabitModel {
  final String date;
  final bool workoutCompleted;
  final int waterCupsDrank;
  final bool mealsFollowed;

  DailyHabitModel({
    required this.date,
    required this.workoutCompleted,
    required this.waterCupsDrank,
    required this.mealsFollowed,
  });

  Map<String, dynamic> toJson() {
    return {
      'date': date,
      'workoutCompleted': workoutCompleted,
      'waterCupsDrank': waterCupsDrank,
      'mealsFollowed': mealsFollowed,
    };
  }

  factory DailyHabitModel.fromJson(Map<String, dynamic> json) {
    return DailyHabitModel(
      date: json['date'] ?? '',
      workoutCompleted: json['workoutCompleted'] ?? false,
      waterCupsDrank: json['waterCupsDrank'] ?? 0,
      mealsFollowed: json['mealsFollowed'] ?? false,
    );
  }
}
