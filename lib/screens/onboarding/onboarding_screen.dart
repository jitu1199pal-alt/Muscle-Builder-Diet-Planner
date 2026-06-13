import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';
import '../../widgets/custom_button.dart';
import '../user_details/user_details_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  final List<Map<String, String>> _slides = [
    {
      "title": "Precision Training",
      "subtitle": "Get a customized 7-day workout routine calculated exactly for your muscle goals.",
      "image": "🏋️‍♂️",
    },
    {
      "title": "Science-Based Nutrition",
      "subtitle": "No generic suggestions. High-protein recipes mapped perfectly to your daily calorie target.",
      "image": "🥦",
    },
    {
      "title": "100% Offline Access",
      "subtitle": "Train anywhere, track anywhere. Your data remains fully local in your device.",
      "image": "🔒",
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            children: [
              // Skip option
              Align(
                alignment: Alignment.topRight,
                child: TextButton(
                  onPressed: () {
                    _pageController.jumpToPage(_slides.length - 1);
                  },
                  child: const Text(
                    "Skip",
                    style: TextStyle(color: AppColors.secondaryText),
                  ),
                ),
              ),
              
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (index) {
                    setState(() {
                      _currentIndex = index;
                    });
                  },
                  itemCount: _slides.length,
                  itemBuilder: (context, idx) {
                    final slide = _slides[idx];
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          slide['image']!,
                          style: const TextStyle(fontSize: 80),
                        ),
                        const SizedBox(height: 32.0),
                        Text(
                          slide['title']!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryText,
                          ),
                        ),
                        const SizedBox(height: 16.0),
                        Text(
                          slide['subtitle']!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppColors.secondaryText,
                            height: 1.5,
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
              
              // Slide indicator dots
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(_slides.length, (index) => Container(
                  width: _currentIndex == index ? 24 : 8,
                  height: 8,
                  margin: const EdgeInsets.symmetric(horizontal: 4.0),
                  decoration: BoxDecoration(
                    color: _currentIndex == index ? AppColors.primary : Colors.grey[800],
                    borderRadius: BorderRadius.circular(4),
                  ),
                )),
              ),
              const SizedBox(height: 40.0),
              
              // Primary Action (Strict Button Rule 56px)
              CustomButton(
                text: _currentIndex == _slides.length - 1 ? "Get Started" : "Next",
                onPressed: () {
                  if (_currentIndex < _slides.length - 1) {
                    _pageController.nextPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    );
                  } else {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const UserDetailsScreen()),
                    );
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
