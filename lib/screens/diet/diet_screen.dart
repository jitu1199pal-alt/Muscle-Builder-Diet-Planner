import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../core/theme/colors.dart';
import '../../providers/user_provider.dart';
import '../../providers/progress_provider.dart';
import '../../widgets/diet_card.dart';
import '../../widgets/custom_card.dart';

class DietScreen extends StatelessWidget {
  const DietScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final userProv = Provider.of<UserProvider>(context);
    final progProv = Provider.of<ProgressProvider>(context);

    if (!userProv.hasPlan) {
      return const Scaffold(
        body: Center(
          child: Text("Please generate your personalized fitness diet first!"),
        ),
      );
    }

    final diet = userProv.dietPlan!;
    final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());

    // Calculate eaten vs remaining
    int intakeCalStr = 0;
    int intakeProtStr = 0;
    for (var meal in diet.meals) {
      if (progProv.isMealChecked(todayStr, meal.id)) {
        intakeCalStr += meal.calories;
        intakeProtStr += meal.protein;
      }
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          "Personal Nutrition Engine",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Calorie progress circle/bar
            CustomCard(
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Calorie Budget Track",
                            style: TextStyle(fontSize: 12, color: AppColors.secondaryText),
                          ),
                          const SizedBox(height: 4.0),
                          Text(
                            "$intakeCalStr / ${diet.totalCalories} kcal",
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryText),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.warning.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          "${diet.totalCalories - intakeCalStr} Left",
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.warning),
                        ),
                      )
                    ],
                  ),
                  const SizedBox(height: 12.0),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: (intakeCalStr / diet.totalCalories).clamp(0.0, 1.0),
                      backgroundColor: Colors.grey[850],
                      color: AppColors.primary,
                      minHeight: 8,
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  
                  // Macro split subrow
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildMacroProgress("Protein", "$intakeProtStr / ${diet.totalProtein}g", Colors.green),
                      _buildMacroProgress("Carbs", "Target: ${diet.totalCarbs}g", Colors.orange),
                      _buildMacroProgress("Fat", "Target: ${diet.totalFat}g", Colors.red),
                    ],
                  )
                ],
              ),
            ),
            const SizedBox(height: 20.0),

            // Avoid list cards (Rule 16)
            Text(
              "Foods to Avoid (Athletic Restriction)",
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryText.withOpacity(0.9)),
            ),
            const SizedBox(height: 8.0),
            CustomCard(
              backgroundColor: const Color(0xFF221515),
              border: Border.all(color: Colors.red.withOpacity(0.2), width: 1.0),
              padding: const EdgeInsets.all(12.0),
              child: Column(
                children: diet.avoidList.map((avoidItem) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4.0),
                    child: Row(
                      children: [
                        const Icon(Icons.cancel, color: Colors.red, size: 16),
                        const SizedBox(width: 10),
                        Text(
                          avoidItem,
                          style: const TextStyle(fontSize: 12, color: AppColors.secondaryText, fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 20.0),

            // Meals header
            Text(
              "Daily Target Meals",
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryText.withOpacity(0.9)),
            ),
            const SizedBox(height: 8.0),

            // Meals List
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: diet.meals.length,
              itemBuilder: (context, idx) {
                final meal = diet.meals[idx];
                final isChecked = progProv.isMealChecked(todayStr, meal.id);
                return Container(
                  margin: const EdgeInsets.only(bottom: 14.0),
                  child: DietCard(
                    meal: meal,
                    isFollowed: isChecked,
                    onToggle: () {
                      progProv.toggleMealSelection(todayStr, meal.id);
                    },
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMacroProgress(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 11, color: AppColors.secondaryText),
        ),
        const SizedBox(height: 4.0),
        Text(
          value,
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color),
        ),
      ],
    );
  }
}
