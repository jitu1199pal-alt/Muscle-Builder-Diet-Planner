import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';
import '../../core/constants/app_strings.dart';
import '../../data/goal_data.dart';
import '../../widgets/custom_card.dart';
import '../../widgets/custom_button.dart';
import '../generate_plan/generate_plan_screen.dart';

class FocusSelectionScreen extends StatefulWidget {
  final int age;
  final String gender;
  final double height;
  final double weight;
  final String foodPreference;
  final String activityLevel;
  final String goal;

  const FocusSelectionScreen({
    Key? key,
    required this.age,
    required this.gender,
    required this.height,
    required this.weight,
    required this.foodPreference,
    required this.activityLevel,
    required this.goal,
  }) : super(key: key);

  @override
  State<FocusSelectionScreen> createState() => _FocusSelectionScreenState();
}

class _FocusSelectionScreenState extends State<FocusSelectionScreen> {
  late List<String> _focusOptions;
  late String _selectedFocus;

  @override
  void initState() {
    super.initState();
    _focusOptions = GoalData.getFocusOptions(widget.goal);
    _selectedFocus = _focusOptions.first;
  }

  @override
  Widget build(BuildContext context) {
    final bool isFaceFat = _selectedFocus.toLowerCase() == "face fat";

    return Scaffold(
      appBar: AppBar(
        title: const Text("Select Focus"),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Focus Area: ${widget.goal}",
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryText),
              ),
              const SizedBox(height: 8.0),
              const Text(
                "Customize specifically where you want the highest concentration of specialized split exercises.",
                style: TextStyle(fontSize: 12, color: AppColors.secondaryText),
              ),
              const SizedBox(height: 24.0),

              Expanded(
                child: Column(
                  children: [
                    Expanded(
                      child: GridView.builder(
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 2.2,
                        ),
                        itemCount: _focusOptions.length,
                        itemBuilder: (context, idx) {
                          final opt = _focusOptions[idx];
                          final isSel = _selectedFocus == opt;
                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedFocus = opt;
                              });
                            },
                            child: CustomCard(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              backgroundColor: isSel ? AppColors.primary.withOpacity(0.08) : AppColors.cardBg,
                              border: Border.all(
                                color: isSel ? AppColors.primary : AppColors.borderSubtle,
                                width: 1.5,
                              ),
                              child: Center(
                                child: Text(
                                  opt,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: isSel ? AppColors.primaryText : AppColors.secondaryText,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    
                    // Spot Reduction Science Warning Alert (Rule 15 Advisory)
                    if (isFaceFat) ...[
                      const SizedBox(height: 16.0),
                      CustomCard(
                        backgroundColor: AppColors.warning.withOpacity(0.08),
                        border: Border.all(color: AppColors.warning.withOpacity(0.4), width: 1.0),
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Row(
                              children: [
                                Icon(Icons.info_outline, color: AppColors.warning, size: 18),
                                SizedBox(width: 8),
                                Text(
                                  "Biochemistry Alert",
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.warning,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 6.0),
                            Text(
                              AppStrings.physicalScienceAdvisory,
                              style: TextStyle(
                                fontSize: 11,
                                color: AppColors.secondaryText,
                                height: 1.4,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16.0),
                    ]
                  ],
                ),
              ),

              CustomButton(
                text: "Generate Personalized Plan",
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => GeneratePlanScreen(
                        age: widget.age,
                        gender: widget.gender,
                        height: widget.height,
                        weight: widget.weight,
                        foodPreference: widget.foodPreference,
                        activityLevel: widget.activityLevel,
                        goal: widget.goal,
                        focus: _selectedFocus,
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
