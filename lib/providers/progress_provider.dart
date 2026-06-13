import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/progress_model.dart';
import '../services/local_storage_service.dart';

class ProgressProvider with ChangeNotifier {
  List<WeightLogModel> _weightLogs = [];
  final Map<String, int> _waterLogs = {}; // Key: "yyyy-MM-dd" -> cups
  final Map<String, bool> _mealCompletions = {}; // Key: "yyyy-MM-dd_mealId" -> true/false
  int _consistencyStreak = 3; // Mock default starting point for UX richness

  List<WeightLogModel> get weightLogs => _weightLogs;
  int get consistencyStreak => _consistencyStreak;

  ProgressProvider() {
    _loadProgressData();
  }

  void _loadProgressData() {
    try {
      final String? weightString = LocalStorageService.getString('weight_logs_list');
      if (weightString != null) {
        final List<dynamic> decoded = jsonDecode(weightString);
        _weightLogs = decoded.map((e) => WeightLogModel.fromJson(e)).toList();
      } else {
        // Hydrate with smart mock default values for charts
        _weightLogs = [
          WeightLogModel(date: "Mon", weight: 78.5),
          WeightLogModel(date: "Tue", weight: 78.2),
          WeightLogModel(date: "Wed", weight: 78.0),
          WeightLogModel(date: "Thu", weight: 77.6),
          WeightLogModel(date: "Fri", weight: 77.1),
        ];
        _saveWeightLogs();
      }

      final int? streak = LocalStorageService.prefs.getInt('consistency_streak');
      if (streak != null) {
        _consistencyStreak = streak;
      }
    } catch (e) {
      debugPrint("Error loading progress logs: $e");
    }
  }

  Future<void> _saveWeightLogs() async {
    final String encoded = jsonEncode(_weightLogs.map((e) => e.toJson()).toList());
    await LocalStorageService.setString('weight_logs_list', encoded);
  }

  Future<void> addWeight(String dayStr, double weight) async {
    // Overwrite if exits, or append
    _weightLogs.removeWhere((element) => element.date == dayStr);
    _weightLogs.add(WeightLogModel(date: dayStr, weight: weight));
    // Sort logic to keep simple
    if (_weightLogs.length > 7) {
      _weightLogs.removeAt(0);
    }
    await _saveWeightLogs();
    notifyListeners();
  }

  int getWaterCups(String dateKey) {
    if (!_waterLogs.containsKey(dateKey)) {
      _waterLogs[dateKey] = LocalStorageService.prefs.getInt('water_$dateKey') ?? 0;
    }
    return _waterLogs[dateKey]!;
  }

  Future<void> adjustWater(String dateKey, int amount, int limit) async {
    final int current = getWaterCups(dateKey);
    int updated = current + amount;
    if (updated < 0) updated = 0;
    if (updated > limit + 4) updated = limit + 4; // limit overflow safeguard

    _waterLogs[dateKey] = updated;
    await LocalStorageService.prefs.setInt('water_$dateKey', updated);

    // Update streak if hitting water goals
    if (updated >= limit && current < limit) {
      _consistencyStreak++;
      await LocalStorageService.prefs.setInt('consistency_streak', _consistencyStreak);
    }

    notifyListeners();
  }

  bool isMealChecked(String dateKey, String mealId) {
    final String key = "meal_${dateKey}_$mealId";
    if (!_mealCompletions.containsKey(key)) {
      _mealCompletions[key] = LocalStorageService.getBool(key) ?? false;
    }
    return _mealCompletions[key]!;
  }

  Future<void> toggleMealSelection(String dateKey, String mealId) async {
    final String key = "meal_${dateKey}_$mealId";
    final bool current = isMealChecked(dateKey, mealId);
    final bool updated = !current;

    _mealCompletions[key] = updated;
    await LocalStorageService.setBool(key, updated);
    notifyListeners();
  }
}
