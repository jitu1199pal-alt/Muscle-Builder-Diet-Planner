class ExerciseModel {
  final String id;
  final String name;
  final String exerciseName;
  final int sets;
  final String reps;
  final String rest;
  final String difficulty;
  final String equipment;
  final String muscleGroup;
  final String target;
  final String notes;

  ExerciseModel({
    required this.id,
    required this.name,
    required this.exerciseName,
    required this.sets,
    required this.reps,
    required this.rest,
    required this.difficulty,
    required this.equipment,
    required this.muscleGroup,
    required this.target,
    required this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'exerciseName': exerciseName,
      'sets': sets,
      'reps': reps,
      'rest': rest,
      'difficulty': difficulty,
      'equipment': equipment,
      'muscleGroup': muscleGroup,
      'target': target,
      'notes': notes,
    };
  }

  factory ExerciseModel.fromJson(Map<String, dynamic> json) {
    return ExerciseModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      exerciseName: json['exerciseName'] ?? '',
      sets: json['sets'] ?? 3,
      reps: json['reps'] ?? '10-12',
      rest: json['rest'] ?? '45 sec',
      difficulty: json['difficulty'] ?? 'Beginner',
      equipment: json['equipment'] ?? 'Bodyweight',
      muscleGroup: json['muscleGroup'] ?? 'Chest',
      target: json['target'] ?? '',
      notes: json['notes'] ?? '',
    );
  }
}

class DayWorkoutModel {
  final String day;
  final String focus;
  final bool isRest;
  final List<ExerciseModel> exercises;

  DayWorkoutModel({
    required this.day,
    required this.focus,
    required this.isRest,
    required this.exercises,
  });

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'focus': focus,
      'isRest': isRest,
      'exercises': exercises.map((e) => e.toJson()).toList(),
    };
  }

  factory DayWorkoutModel.fromJson(Map<String, dynamic> json) {
    var list = json['exercises'] as List? ?? [];
    List<ExerciseModel> exercisesList = list.map((e) => ExerciseModel.fromJson(e)).toList();
    return DayWorkoutModel(
      day: json['day'] ?? 'Monday',
      focus: json['focus'] ?? 'Rest Day',
      isRest: json['isRest'] ?? true,
      exercises: exercisesList,
    );
  }
}

class WorkoutPlanModel {
  final String title;
  final List<DayWorkoutModel> days;

  WorkoutPlanModel({
    required this.title,
    required this.days,
  });

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'days': days.map((d) => d.toJson()).toList(),
    };
  }

  factory WorkoutPlanModel.fromJson(Map<String, dynamic> json) {
    var list = json['days'] as List? ?? [];
    List<DayWorkoutModel> daysList = list.map((d) => DayWorkoutModel.fromJson(d)).toList();
    return WorkoutPlanModel(
      title: json['title'] ?? 'Custom Routine',
      days: daysList,
    );
  }
}
