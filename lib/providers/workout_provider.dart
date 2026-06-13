import 'package:flutter/material.dart';
import '../services/local_storage_service.dart';

class WorkoutProvider with ChangeNotifier {
  // Key: "m_d_y_exerciseId" -> Completed
  final Map<String, bool> _completedExercises = {};

  bool isCompleted(String dateStr, String exerciseId) {
    final String key = "comp_${dateStr}_$exerciseId";
    if (!_completedExercises.containsKey(key)) {
      _completedExercises[key] = LocalStorageService.getBool(key) ?? false;
    }
    return _completedExercises[key]!;
  }

  Future<void> toggleCompletion(String dateStr, String exerciseId) async {
    final String key = "comp_${dateStr}_$exerciseId";
    final bool current = isCompleted(dateStr, exerciseId);
    final bool updated = !current;

    _completedExercises[key] = updated;
    await LocalStorageService.setBool(key, updated);
    notifyListeners();
  }

  int getCompletedCountForDay(String dateStr, List<String> exerciseIds) {
    int count = 0;
    for (var id in exerciseIds) {
      if (isCompleted(dateStr, id)) {
        count++;
      }
    }
    return count;
  }
}
