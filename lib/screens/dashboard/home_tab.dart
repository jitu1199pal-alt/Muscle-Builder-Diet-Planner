import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/colors.dart';
import '../../providers/user_provider.dart';
import '../../providers/progress_provider.dart';
import '../../widgets/custom_card.dart';
import 'package:intl/intl.dart';

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    final userProv = Provider.of<UserProvider>(context);
    final progProv = Provider.of<ProgressProvider>(context);
    
    if (!userProv.hasPlan) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
      );
    }

    final user = userProv.user!;
    final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final cupsDrank = progProv.getWaterCups(todayStr);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.flash_on, color: AppColors.primary, size: 20),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Welcome Back",
                  style: TextStyle(fontSize: 12, color: AppColors.secondaryText),
                ),
                Text(
                  user.gender.toUpperCase() == "MALE" ? "Fit Brother" : "Fit Sister",
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primaryText),
                ),
              ],
            ),
          ],
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16, top: 12, bottom: 12),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.amber.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.amber.withValues(alpha: 0.3), width: 1.0),
            ),
            child: Row(
              children: [
                const Icon(Icons.star, color: Colors.amber, size: 16),
                const SizedBox(width: 4),
                Text(
                  "${progProv.consistencyStreak} Day Streak",
                  style: const TextStyle(color: Colors.amber, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Target highlights bento style
            Text(
              "Your Goals Overview",
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryText.withValues(alpha: 0.9)),
            ),
            const SizedBox(height: 12.0),
            
            Row(
              children: [
                // Calories
                Expanded(
                  child: CustomCard(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.local_fire_department, color: AppColors.warning, size: 28),
                        const SizedBox(height: 12.0),
                        const Text("Budget Calories", style: TextStyle(color: AppColors.secondaryText, fontSize: 11)),
                        const SizedBox(height: 4.0),
                        Text(
                          "${user.targetCalories} kcal",
                          style: const TextStyle(color: AppColors.primaryText, fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12.0),
                // Protein
                Expanded(
                  child: CustomCard(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.fitness_center, color: AppColors.success, size: 28),
                        const SizedBox(height: 12.0),
                        const Text("Protein Target", style: TextStyle(color: AppColors.secondaryText, fontSize: 11)),
                        const SizedBox(height: 4.0),
                        Text(
                          "${user.targetProteinGrams}g",
                          style: const TextStyle(color: AppColors.primaryText, fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16.0),

            // Dynamic BMI block
            CustomCard(
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.scale, color: AppColors.primary),
                  ),
                  const SizedBox(width: 16.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text("Body Mass Index (BMI)", style: TextStyle(fontSize: 12, color: AppColors.secondaryText)),
                            Text(
                              "BMI: ${user.bmi.toStringAsFixed(1)}",
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primaryText),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6.0),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: (user.bmi / 40.0).clamp(0.0, 1.0),
                            backgroundColor: Colors.grey[850],
                            color: user.bmi < 18.5
                                ? Colors.blue
                                : user.bmi < 25.0
                                    ? AppColors.success
                                    : AppColors.warning,
                            minHeight: 6,
                          ),
                        ),
                        const SizedBox(height: 4.0),
                        Text(
                          "Physique Classification: ${user.bmi < 18.5 ? 'Underweight' : user.bmi < 25.0 ? 'Lean Normal' : 'Overweight'}",
                          style: const TextStyle(fontSize: 10, color: AppColors.secondaryText),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 16.0),

            // Active hydration log
            CustomCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.local_drink, color: Colors.blueAccent, size: 20),
                          SizedBox(width: 8),
                          Text("Hydration Tracker", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        ],
                      ),
                      Text(
                        "$cupsDrank / ${user.targetWaterCups} Cups",
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.blueAccent),
                      )
                    ],
                  ),
                  const SizedBox(height: 12.0),
                  Text(
                    "Your daily target is calculated as weight * 0.04 liters (${user.targetWaterLiters.toStringAsFixed(1)}L total value).",
                    style: const TextStyle(fontSize: 11, color: AppColors.secondaryText),
                  ),
                  const SizedBox(height: 16.0),
                  Row(
                    children: [
                      IconButton(
                        onPressed: () => progProv.adjustWater(todayStr, -1, user.targetWaterCups),
                        icon: const Icon(Icons.remove_circle_outline, color: AppColors.secondaryText),
                      ),
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: LinearProgressIndicator(
                            value: (cupsDrank / user.targetWaterCups).clamp(0.0, 1.0),
                            backgroundColor: Colors.grey[850],
                            color: Colors.blueAccent,
                            minHeight: 10,
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: () => progProv.adjustWater(todayStr, 1, user.targetWaterCups),
                        icon: const Icon(Icons.add_circle, color: Colors.blueAccent),
                      ),
                    ],
                  )
                ],
              ),
            ),
            const SizedBox(height: 24.0),

            // Motivational Banner Quote (Rule 18)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppColors.primary.withValues(alpha: 0.08), Colors.transparent],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.primary.withValues(alpha: 0.12), width: 1.0),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("STREET WORKOUT SPIRIT", style: TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6.0),
                  Text(
                    "\"${userProv.dietPlan?.motivation ?? 'Commit to the code.'}\"",
                    style: const TextStyle(fontSize: 13, height: 1.4, fontStyle: FontStyle.italic, color: AppColors.primaryText),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
