import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/colors.dart';
import '../../providers/user_provider.dart';
import '../../ads/admob_service.dart';
import '../dashboard/dashboard_screen.dart';

class GeneratePlanScreen extends StatefulWidget {
  final int age;
  final String gender;
  final double height;
  final double weight;
  final String foodPreference;
  final String activityLevel;
  final String goal;
  final String focus;

  const GeneratePlanScreen({
    super.key,
    required this.age,
    required this.gender,
    required this.height,
    required this.weight,
    required this.foodPreference,
    required this.activityLevel,
    required this.goal,
    required this.focus,
  });

  @override
  State<GeneratePlanScreen> createState() => _GeneratePlanScreenState();
}

class _GeneratePlanScreenState extends State<GeneratePlanScreen> {
  int _currentStepIndex = 0;
  final List<String> _steps = [
    "Computing BMR using Mifflin-St Jeor...",
    "Aligning protein target (2.2g per kg bodyweight)...",
    "Mapping custom 7-day training cycles...",
    "Selecting localized English food recipes...",
    "Structuring AdMob security tokens offline...",
    "Caching plan to persistent Storage..."
  ];

  @override
  void initState() {
    super.initState();
    _startPlanGenerationFlow();
  }

  Future<void> _startPlanGenerationFlow() async {
    // 1. Loop through computational steps for immersive feel
    for (int i = 0; i < _steps.length; i++) {
      await Future.delayed(const Duration(milliseconds: 600));
      if (!mounted) return;
      setState(() {
        _currentStepIndex = i;
      });
    }

    // 2. Perform the actual calculation and save to local storage
    if (!mounted) return;
    final userProv = Provider.of<UserProvider>(context, listen: false);
    await userProv.createAndSavePlan(
      age: widget.age,
      gender: widget.gender,
      height: widget.height,
      weight: widget.weight,
      foodPreference: widget.foodPreference,
      activityLevel: widget.activityLevel,
      goal: widget.goal,
      focus: widget.focus,
    );

    // 3. Fire the AdMob Interstitial ad right after plan generation completes successfully
    AdmobService.showInterstitial(
      onDismissed: () {
        _navigateToDashboard();
      },
    );
  }

  void _navigateToDashboard() {
    if (!mounted) return;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => const DashboardScreen()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Loading icon
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.settings_suggest,
                  size: 40,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 32.0),
              
              const Text(
                "Personalizing Your Fitness Space",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryText,
                ),
              ),
              const SizedBox(height: 12.0),
              const Text(
                "Our offline planner compiles personalized sets and macros matching athletic biochemistry standards.",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12.5,
                  color: AppColors.secondaryText,
                ),
              ),
              const SizedBox(height: 48.0),

              // Active step card
              Card(
                color: AppColors.cardBg,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: const BorderSide(color: AppColors.borderSubtle, width: 1.0),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  child: Row(
                    children: [
                      const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.0,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(width: 16.0),
                      Expanded(
                        child: Text(
                          _steps[_currentStepIndex],
                          style: const TextStyle(
                            fontSize: 13.0,
                            color: AppColors.primaryText,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
