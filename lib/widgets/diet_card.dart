import 'package:flutter/material.dart';
import '../models/diet_model.dart';
import '../core/theme/colors.dart';
import 'custom_card.dart';

class DietCard extends StatelessWidget {
  final MealModel meal;
  final bool isFollowed;
  final VoidCallback onToggle;

  const DietCard({
    super.key,
    required this.meal,
    required this.isFollowed,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return CustomCard(
      padding: const EdgeInsets.all(16.0),
      backgroundColor: isFollowed ? const Color(0xFF13221C) : AppColors.cardBg,
      border: Border.all(
        color: isFollowed ? AppColors.success.withValues(alpha: 0.3) : AppColors.borderSubtle,
        width: 1.0,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  meal.mealType.toUpperCase(),
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
              Row(
                children: [
                  Text(
                    "${meal.calories} kcal",
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.warning,
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: onToggle,
                    child: Icon(
                      isFollowed ? Icons.check_circle : Icons.radio_button_off,
                      color: isFollowed ? AppColors.success : AppColors.secondaryText,
                      size: 24,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 10.0),
          Text(
            meal.mealName,
            style: TextStyle(
              fontSize: 16.0,
              fontWeight: FontWeight.bold,
              decoration: isFollowed ? TextDecoration.lineThrough : null,
              color: isFollowed ? AppColors.secondaryText : AppColors.primaryText,
            ),
          ),
          const SizedBox(height: 8.0),
          
          const Text(
            "Ingredients:",
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: AppColors.primaryText,
            ),
          ),
          const SizedBox(height: 4.0),
          Wrap(
            spacing: 6.0,
            runSpacing: 4.0,
            children: meal.foods.map((food) => Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.black26,
                borderRadius: BorderRadius.circular(6.0),
              ),
              child: Text(
                "• $food",
                style: const TextStyle(
                  fontSize: 11,
                  color: AppColors.secondaryText,
                ),
              ),
            )).toList(),
          ),
          
          const SizedBox(height: 12.0),
          const Text(
            "Directions:",
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: AppColors.primaryText,
            ),
          ),
          const SizedBox(height: 4.0),
          Text(
            meal.recipe,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.secondaryText,
              height: 1.4,
            ),
          ),
          
          const SizedBox(height: 10.0),
          Divider(color: Colors.grey[800], thickness: 0.8),
          
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMacroLabel("Protein", "${meal.protein}g"),
              _buildMacroLabel("Carbs", "${meal.carbs}g"),
              _buildMacroLabel("Fat", "${meal.fat}g"),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMacroLabel(String title, String value) {
    return Row(
      children: [
        Text(
          "$title: ",
          style: const TextStyle(color: AppColors.secondaryText, fontSize: 11),
        ),
        Text(
          value,
          style: const TextStyle(color: AppColors.primaryText, fontSize: 11, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
