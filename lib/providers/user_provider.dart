import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../models/workout_model.dart';
import '../models/diet_model.dart';
import '../services/local_storage_service.dart';
import '../services/plan_generator_service.dart';

class UserProvider with ChangeNotifier {
  UserModel? _user;
  WorkoutPlanModel? _workoutPlan;
  DietPlanModel? _dietPlan;
  bool _isLoading = false;

  UserModel? get user => _user;
  WorkoutPlanModel? get workoutPlan => _workoutPlan;
  DietPlanModel? get dietPlan => _dietPlan;
  bool get isLoading => _isLoading;
  bool get hasPlan => _user != null && _workoutPlan != null && _dietPlan != null;

  UserProvider() {
    loadCachedPlan();
  }

  Future<void> loadCachedPlan() async {
    _isLoading = true;
    notifyListeners();

    try {
      final String? userJson = LocalStorageService.getString('user_profile');
      final String? workoutJson = LocalStorageService.getString('workout_plan');
      final String? dietJson = LocalStorageService.getString('diet_plan');

      if (userJson != null && workoutJson != null && dietJson != null) {
        _user = UserModel.fromJson(jsonDecode(userJson));
        _workoutPlan = WorkoutPlanModel.fromJson(jsonDecode(workoutJson));
        _dietPlan = DietPlanModel.fromJson(jsonDecode(dietJson));
      }
    } catch (e) {
      debugPrint("Error loading cached configuration: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> createAndSavePlan({
    required int age,
    required String gender,
    required double height,
    required double weight,
    required String foodPreference,
    required String activityLevel,
    required String goal,
    required String focus,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final generated = await PlanGeneratorService.generatePlan(
        age: age,
        gender: gender,
        height: height,
        weight: weight,
        foodPreference: foodPreference,
        activityLevel: activityLevel,
        goal: goal,
        focus: focus,
      );

      _user = generated['user'] as UserModel;
      _workoutPlan = generated['workout'] as WorkoutPlanModel;
      _dietPlan = generated['diet'] as DietPlanModel;

      // Persist to SharedPreferences
      await LocalStorageService.setString('user_profile', jsonEncode(_user!.toJson()));
      await LocalStorageService.setString('workout_plan', jsonEncode(_workoutPlan!.toJson()));
      await LocalStorageService.setString('diet_plan', jsonEncode(_dietPlan!.toJson()));
    } catch (e) {
      debugPrint("Generation failing: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> resetPlan() async {
    _user = null;
    _workoutPlan = null;
    _dietPlan = null;
    await LocalStorageService.remove('user_profile');
    await LocalStorageService.remove('workout_plan');
    await LocalStorageService.remove('diet_plan');
    notifyListeners();
  }
}
