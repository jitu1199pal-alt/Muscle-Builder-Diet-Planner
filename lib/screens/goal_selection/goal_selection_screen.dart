import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';
import '../../widgets/custom_card.dart';
import '../../widgets/custom_button.dart';
import '../focus_selection/focus_selection_screen.dart';

class GoalSelectionScreen extends StatefulWidget {
  final int age;
  final String gender;
  final double height;
  final double weight;
  final String foodPreference;
  final String activityLevel;

  const GoalSelectionScreen({
    super.key,
    required this.age,
    required this.gender,
    required this.height,
    required this.weight,
    required this.foodPreference,
    required this.activityLevel,
  });

  @override
  State<GoalSelectionScreen> createState() => _GoalSelectionScreenState();
}

class _GoalSelectionScreenState extends State<GoalSelectionScreen> {
  String _selectedGoal = "Muscle Gain";

  final List<Map<String, String>> _goals = [
    {
      "name": "Muscle Gain",
      "desc": "Build optimal lean mass density, enhance total skeletal structure.",
      "icon": "💪"
    },
    {
      "name": "Weight Loss",
      "desc": "Reduce body weight safely through robust systemic fat oxidation.",
      "icon": "📉"
    },
    {
      "name": "Fat Loss",
      "desc": "Shred fat layers, preserving muscle integrity and boosting stamina.",
      "icon": "🔥"
    },
    {
      "name": "Weight Gain",
      "desc": "Sustain a clean intake surplus to pack on protective weight bulk.",
      "icon": "⚖️"
    },
    {
      "name": "Maintain Body",
      "desc": "Prioritize current biometrics level with regular active stability.",
      "icon": "⚡"
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Your Goals"),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Select Fitness Goal",
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryText),
              ),
              const SizedBox(height: 8.0),
              const Text(
                "Choose your main direction to customize your workout structures and nutritional meal plans.",
                style: TextStyle(fontSize: 12, color: AppColors.secondaryText),
              ),
              const SizedBox(height: 24.0),

              Expanded(
                child: ListView.builder(
                  itemCount: _goals.length,
                  itemBuilder: (context, index) {
                    final goal = _goals[index];
                    final isSel = _selectedGoal == goal['name'];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12.0),
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _selectedGoal = goal['name']!;
                          });
                        },
                        child: CustomCard(
                          backgroundColor: isSel ? AppColors.primary.withValues(alpha: 0.08) : AppColors.cardBg,
                          border: Border.all(
                            color: isSel ? AppColors.primary : AppColors.borderSubtle,
                            width: 1.5,
                          ),
                          child: Row(
                            children: [
                              Text(goal['icon']!, style: const TextStyle(fontSize: 32)),
                              const SizedBox(width: 16.0),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      goal['name']!,
                                      style: TextStyle(
                                        fontSize: 15.0,
                                        fontWeight: FontWeight.bold,
                                        color: isSel ? AppColors.primary : AppColors.primaryText,
                                      ),
                                    ),
                                    const SizedBox(height: 4.0),
                                    Text(
                                      goal['desc']!,
                                      style: const TextStyle(
                                        fontSize: 11.5,
                                        color: AppColors.secondaryText,
                                        height: 1.3,
                                      ),
                                    )
                                  ],
                                ),
                              )
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),

              CustomButton(
                text: "Select Target Focus",
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => FocusSelectionScreen(
                        age: widget.age,
                        gender: widget.gender,
                        height: widget.height,
                        weight: widget.weight,
                        foodPreference: widget.foodPreference,
                        activityLevel: widget.activityLevel,
                        goal: _selectedGoal,
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
