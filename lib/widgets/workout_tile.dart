import 'package:flutter/material.dart';
import '../models/workout_model.dart';
import '../core/theme/colors.dart';
import 'custom_card.dart';

class WorkoutTile extends StatelessWidget {
  final ExerciseModel exercise;
  final bool isCompleted;
  final VoidCallback onToggle;

  const WorkoutTile({
    super.key,
    required this.exercise,
    required this.isCompleted,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return CustomCard(
      padding: const EdgeInsets.all(12.0),
      backgroundColor: isCompleted ? const Color(0xFF13221C) : AppColors.cardBg,
      border: Border.all(
        color: isCompleted ? AppColors.success.withValues(alpha: 0.3) : AppColors.borderSubtle,
        width: 1.0,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Check box
          InkWell(
            onTap: onToggle,
            child: Container(
              margin: const EdgeInsets.only(top: 2, right: 12),
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: isCompleted ? AppColors.success : Colors.transparent,
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: isCompleted ? AppColors.success : AppColors.secondaryText,
                  width: 2,
                ),
              ),
              child: isCompleted
                  ? const Icon(
                      Icons.check,
                      size: 16,
                      color: Colors.white,
                    )
                  : null,
            ),
          ),
          
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  exercise.name,
                  style: TextStyle(
                    fontSize: 15.0,
                    fontWeight: FontWeight.bold,
                    decoration: isCompleted ? TextDecoration.lineThrough : null,
                    color: isCompleted ? AppColors.secondaryText : AppColors.primaryText,
                  ),
                ),
                const SizedBox(height: 4.0),
                Text(
                  "Target: ${exercise.target} • ${exercise.sets} sets x ${exercise.reps}",
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.secondaryText,
                  ),
                ),
                const SizedBox(height: 6.0),
                
                // Badges
                Row(
                  children: [
                    _buildBadge(exercise.equipment, AppColors.primary, AppColors.accentBlueSubtle),
                    const SizedBox(width: 6.0),
                    _buildBadge(exercise.difficulty, AppColors.warning, AppColors.warningSubtle),
                    const SizedBox(width: 6.0),
                    _buildBadge(exercise.rest, Colors.teal, const Color(0x19008080)),
                  ],
                ),
                
                if (exercise.notes.isNotEmpty) ...[
                  const SizedBox(height: 8.0),
                  Container(
                    padding: const EdgeInsets.all(8.0),
                    decoration: BoxDecoration(
                      color: Colors.black12,
                      borderRadius: BorderRadius.circular(6.0),
                    ),
                    child: Text(
                      exercise.notes,
                      style: const TextStyle(
                        fontSize: 11.0,
                        fontStyle: FontStyle.italic,
                        color: AppColors.secondaryText,
                      ),
                    ),
                  ),
                ]
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadge(String label, Color color, Color bg) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
