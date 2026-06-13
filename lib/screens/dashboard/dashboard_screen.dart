import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';
import '../../ads/admob_service.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../workout/workout_screen.dart';
import '../diet/diet_screen.dart';
import '../progress/progress_screen.dart';
import '../settings/settings_screen.dart';
import 'home_tab.dart'; // we will write this next

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;
  BannerAd? _bannerAd;
  bool _isBannerLoaded = false;

  final List<Widget> _tabs = [
    const HomeTab(),
    const WorkoutScreen(),
    const DietScreen(),
    const ProgressScreen(),
    const SettingsScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _loadBottomBanner();
  }

  void _loadBottomBanner() {
    try {
      _bannerAd = BannerAd(
        adUnitId: AdmobService.bannerAdUnitId,
        size: AdSize.banner,
        request: const AdRequest(),
        listener: BannerAdListener(
          onAdLoaded: (_) {
            setState(() {
              _isBannerLoaded = true;
            });
          },
          onAdFailedToLoad: (ad, error) {
            debugPrint("Banner load failed: ${error.message}");
            ad.dispose();
          },
        ),
      );
      _bannerAd!.load();
    } catch (e) {
      debugPrint("Exception loading AdMob banner: $e");
    }
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: _tabs[_currentIndex],
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // BOTTOM ADMOB BANNER (Dashboard bottom spec)
          if (_isBannerLoaded && _bannerAd != null)
            Container(
              alignment: Alignment.center,
              width: _bannerAd!.size.width.toDouble(),
              height: _bannerAd!.size.height.toDouble(),
              color: Colors.black,
              child: AdWidget(ad: _bannerAd!),
            )
          else
            const SizedBox(), // Clean space

          BottomNavigationBar(
            currentIndex: _currentIndex,
            type: BottomNavigationBarType.fixed,
            backgroundColor: AppColors.cardBg,
            selectedItemColor: AppColors.primary,
            unselectedItemColor: AppColors.secondaryText,
            selectedFontSize: 11,
            unselectedFontSize: 11,
            iconSize: 22,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.home_outlined),
                activeIcon: Icon(Icons.home),
                label: "Home",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.fitness_center_outlined),
                activeIcon: Icon(Icons.fitness_center),
                label: "Workout",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.restaurant_outlined),
                activeIcon: Icon(Icons.restaurant),
                label: "Diet",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.show_chart_outlined),
                activeIcon: Icon(Icons.show_chart),
                label: "Progress",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.settings_outlined),
                activeIcon: Icon(Icons.settings),
                label: "Settings",
              ),
            ],
            onTap: (index) {
              setState(() {
                _currentIndex = index;
              });
            },
          ),
        ],
      ),
    );
  }
}
