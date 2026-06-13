import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/colors.dart';
import '../../providers/user_provider.dart';
import '../../widgets/custom_card.dart';
import '../../widgets/custom_button.dart';
import '../onboarding/onboarding_screen.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  void _resetApp(BuildContext context, UserProvider userProv) async {
    showDialog(
      context: context,
      builder: (BuildContext ctx) {
        return AlertDialog(
          backgroundColor: AppColors.cardBg,
          title: const Text("Reset Settings?"),
          content: const Text(
            "This will clear all physical biometrics, workout schedules, water counts, and weight logs. Are you sure?",
            style: TextStyle(color: AppColors.secondaryText, fontSize: 13),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text("Cancel", style: TextStyle(color: AppColors.secondaryText)),
            ),
            TextButton(
              onPressed: () async {
                Navigator.pop(ctx);
                await userProv.resetPlan();
                
                if (context.mounted) {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const OnboardingScreen()),
                    (route) => false,
                  );
                }
              },
              child: const Text("Reset All", style: TextStyle(color: Colors.red)),
            )
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final userProv = Provider.of<UserProvider>(context);
    final user = userProv.user;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          "Personal Configurations",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Specs metadata block
            Text(
              "System Specifications",
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryText.withOpacity(0.9)),
            ),
            const SizedBox(height: 10.0),
            CustomCard(
              child: Column(
                children: [
                  _buildSpecRow("App Engine", "Flutter SDK 3.22+"),
                  _buildSpecRow("Dart Variant", "Nullable 3.4+"),
                  _buildSpecRow("Local Vault", "SharedPreferences Only"),
                  _buildSpecRow("State Management", "Provider Lite"),
                  _buildSpecRow("Advertisements", "AdMob Active"),
                ],
              ),
            ),
            const SizedBox(height: 24.0),

            // Profile info
            if (user != null) ...[
              Text(
                "Biometrics Summary",
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryText.withOpacity(0.9)),
              ),
              const SizedBox(height: 10.0),
              CustomCard(
                child: Column(
                  children: [
                    _buildSpecRow("Active Age", "${user.age} yrs"),
                    _buildSpecRow("Gender", user.gender),
                    _buildSpecRow("Diet preference", user.foodPreference),
                    _buildSpecRow("Active goal", user.goal),
                    _buildSpecRow("Target focus", user.focus),
                  ],
                ),
              ),
              const SizedBox(height: 30.0),
            ],

            // Reset mechanism (Strict Height Button 56px Rule)
            CustomButton(
              text: "Clear & Purge Local Data",
              backgroundColor: Colors.red[900]!.withOpacity(0.15),
              textColor: Colors.redAccent,
              onPressed: () => _resetApp(context, userProv),
            ),
            const SizedBox(height: 12.0),
            const Center(
              child: Text(
                "Version 1.0.0 Stable build",
                style: TextStyle(color: AppColors.secondaryText, fontSize: 10.5),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildSpecRow(String name, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(name, style: const TextStyle(color: AppColors.secondaryText, fontSize: 12)),
          Text(value, style: const TextStyle(color: AppColors.primaryText, fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
