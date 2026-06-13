import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/colors.dart';
import '../../providers/user_provider.dart';
import '../../providers/workout_provider.dart';
import '../../widgets/workout_tile.dart';
import '../../widgets/custom_card.dart';
import 'package:intl/intl.dart';

class WorkoutScreen extends StatefulWidget {
  const WorkoutScreen({Key? key}) : super(key: key);

  @override
  State<WorkoutScreen> createState() => _DashboardWorkoutState();
}

class _DashboardWorkoutState extends State<WorkoutScreen> {
  int _selectedDayIdx = 0; // Monday standard
  final List<String> _dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  @override
  void initState() {
    super.initState();
    // Default to active weekday
    final int weekday = DateTime.now().weekday; // 1-7 (Mon-Sun)
    _selectedDayIdx = (weekday - 1).clamp(0, 6);
  }

  @override
  Widget build(BuildContext context) {
    final userProv = Provider.of<UserProvider>(context);
    final workProv = Provider.of<WorkoutProvider>(context);

    if (!userProv.hasPlan) {
      return const Scaffold(
        body: Center(
          child: Text("Please generate your fitness training plan first!"),
        ),
      );
    }

    final plan = userProv.workoutPlan!;
    final activeDayWorkout = plan.days[_selectedDayIdx];
    final todayKey = DateFormat('yyyy-MM-dd').format(DateTime.now());

    final List<String> currentExIds = activeDayWorkout.exercises.map((e) => e.id).toList();
    final int doneCount = workProv.getCompletedCountForDay(todayKey, currentExIds);
    final int totalCount = activeDayWorkout.exercises.length;
    final double completionRatio = totalCount > 0 ? (doneCount / totalCount) : 0.0;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          "Personal Training Splits",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Horizontal Day Selection Tags
          Container(
            height: 52,
            margin: const EdgeInsets.symmetric(vertical: 8.0),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              itemCount: _dayNames.length,
              itemBuilder: (context, idx) {
                final bool isSelected = _selectedDayIdx == idx;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedDayIdx = idx;
                    });
                  },
                  child: Container(
                    width: 52,
                    margin: const EdgeInsets.only(right: 8.0),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.primary : AppColors.cardBg,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? AppColors.primary : AppColors.borderSubtle,
                        width: 1.0,
                      ),
                    ),
                    child: Center(
                      child: Text(
                        _dayNames[idx],
                        style: TextStyle(
                          color: isSelected ? Colors.white : AppColors.secondaryText,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Day details panel
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      activeDayWorkout.day,
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primaryText),
                    ),
                    const SizedBox(height: 2.0),
                    Text(
                      activeDayWorkout.focus,
                      style: const TextStyle(fontSize: 12, color: AppColors.secondaryText),
                    ),
                  ],
                ),
                if (!activeDayWorkout.isRest && totalCount > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.success.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      "$doneCount / $totalCount Done",
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.success),
                    ),
                  )
              ],
            ),
          ),

          // Rest Day / Exercises View List
          Expanded(
            child: activeDayWorkout.isRest
                ? _buildRestDayPlaceholder()
                : _buildExerciseList(activeDayWorkout.exercises, workProv, todayKey),
          ),
        ],
      ),
    );
  }

  Widget _buildRestDayPlaceholder() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.success.withOpacity(0.08),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.spa,
                size: 40,
                color: AppColors.success,
              ),
            ),
            const SizedBox(height: 24.0),
            const Text(
              "Active Recovery Day",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primaryText),
            ),
            const SizedBox(height: 8.0),
            const Text(
              "Soreness is normal. Focus on active deep stretching, complete hydration targets, sleep, and metabolic muscle synthesis.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12.5, color: AppColors.secondaryText, height: 1.5),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExerciseList(List<dynamic> exercises, WorkoutProvider workProv, String todayKey) {
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
      itemCount: exercises.length,
      itemBuilder: (context, idx) {
        final exercise = exercises[idx];
        final bool done = workProv.isCompleted(todayKey, exercise.id);

        return Container(
          margin: const EdgeInsets.only(bottom: 12.0),
          child: WorkoutTile(
            exercise: exercise,
            isCompleted: done,
            onToggle: () {
              workProv.toggleCompletion(todayKey, exercise.id);
            },
          ),
        );
      },
    );
  }
}
