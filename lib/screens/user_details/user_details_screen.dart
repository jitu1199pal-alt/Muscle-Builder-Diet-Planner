import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';
import '../../widgets/custom_button.dart';
import '../goal_selection/goal_selection_screen.dart';

class UserDetailsScreen extends StatefulWidget {
  const UserDetailsScreen({super.key});

  @override
  State<UserDetailsScreen> createState() => _UserDetailsScreenState();
}

class _UserDetailsScreenState extends State<UserDetailsScreen> {
  final _formKey = GlobalKey<FormState>();
  
  // Controllers
  final TextEditingController _ageController = TextEditingController(text: "25");
  final TextEditingController _heightController = TextEditingController(text: "175");
  final TextEditingController _weightController = TextEditingController(text: "70");

  String _selectedGender = "Male";
  String _selectedFoodPreference = "Veg";
  String _selectedActivityLevel = "Moderate";

  final List<String> _genders = ["Male", "Female"];
  final List<String> _prefs = ["Veg", "Eggetarian", "Non-Veg", "Keto"];
  final List<String> _activities = ["Sedentary", "Light", "Moderate", "Active", "Extremely Active"];

  void _submitData() {
    if (_formKey.currentState!.validate()) {
      final int age = int.parse(_ageController.text);
      final double height = double.parse(_heightController.text);
      final double weight = double.parse(_weightController.text);

      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => GoalSelectionScreen(
            age: age,
            gender: _selectedGender,
            height: height,
            weight: weight,
            foodPreference: _selectedFoodPreference,
            activityLevel: _selectedActivityLevel,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Your Biometrics"),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Physical Metrics",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryText),
                ),
                const SizedBox(height: 8.0),
                const Text(
                  "Enter authentic biometric details below to calculate precise baseline thresholds.",
                  style: TextStyle(fontSize: 12, color: AppColors.secondaryText),
                ),
                const SizedBox(height: 24.0),

                // Gender Toggle Selection Card
                const Text("Select Gender", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8.0),
                Row(
                  children: _genders.map((g) => Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedGender = g),
                      child: Container(
                        height: 50,
                        margin: const EdgeInsets.only(right: 8.0),
                        decoration: BoxDecoration(
                          color: _selectedGender == g ? AppColors.primary.withValues(alpha: 0.12) : AppColors.cardBg,
                          border: Border.all(
                            color: _selectedGender == g ? AppColors.primary : AppColors.borderSubtle,
                            width: 1.5,
                          ),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Center(
                          child: Text(
                            g,
                            style: TextStyle(
                              color: _selectedGender == g ? AppColors.primaryText : AppColors.secondaryText,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  )).toList(),
                ),
                const SizedBox(height: 20.0),

                // Age input (13 to 60)
                TextFormField(
                  controller: _ageController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: "Age (Years)",
                    hintText: "13 to 60",
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) return "Please enter age";
                    final int? val = int.tryParse(value);
                    if (val == null) return "Must be raw digit";
                    if (val < 13 || val > 60) return "Supported age limits: 13 to 60 (Rule 15)";
                    return null;
                  },
                ),
                const SizedBox(height: 16.0),

                // Height input (120 to 220)
                TextFormField(
                  controller: _heightController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: "Height (cm)",
                    hintText: "120 to 220",
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) return "Please enter height";
                    final double? val = double.tryParse(value);
                    if (val == null) return "Must be numeric";
                    if (val < 120 || val > 220) return "Supported height bounds: 120cm to 220cm";
                    return null;
                  },
                ),
                const SizedBox(height: 16.0),

                // Weight input (30 to 180)
                TextFormField(
                  controller: _weightController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: "Weight (kg)",
                    hintText: "30 to 180",
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) return "Please enter weight";
                    final double? val = double.tryParse(value);
                    if (val == null) return "Must be numeric";
                    if (val < 30 || val > 180) return "Supported weight bounds: 30kg to 180kg";
                    return null;
                  },
                ),
                const SizedBox(height: 20.0),

                // Food Preference Selection
                const Text("Dietary preference", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8.0),
                Wrap(
                  spacing: 8.0,
                  runSpacing: 8.0,
                  children: _prefs.map((p) => ChoiceChip(
                    label: Text(p),
                    selected: _selectedFoodPreference == p,
                    selectedColor: AppColors.primary,
                    backgroundColor: AppColors.cardBg,
                    labelStyle: TextStyle(
                      color: _selectedFoodPreference == p ? Colors.white : AppColors.secondaryText,
                    ),
                    onSelected: (bool selected) {
                      if (selected) setState(() => _selectedFoodPreference = p);
                    },
                  )).toList(),
                ),
                const SizedBox(height: 20.0),

                // Activity levels selector
                const Text("Activity Level", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8.0),
                DropdownButtonFormField<String>(
                  initialValue: _selectedActivityLevel,
                  dropdownColor: AppColors.cardBg,
                  decoration: const InputDecoration(),
                  items: _activities.map((lvl) => DropdownMenuItem(
                    value: lvl,
                    child: Text(lvl),
                  )).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedActivityLevel = val);
                  },
                ),
                const SizedBox(height: 40.0),

                CustomButton(
                  text: "Continue to Goals",
                  onPressed: _submitData,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
