import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/colors.dart';
import 'core/theme/app_theme.dart';
import 'providers/user_provider.dart';
import 'providers/workout_provider.dart';
import 'providers/progress_provider.dart';
import 'services/local_storage_service.dart';
import 'ads/admob_service.dart';
import 'screens/splash/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Initialize persistent storage offline
  await LocalStorageService.init();

  // 2. Initialize AdMob configuration
  await AdmobService.initialize();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => WorkoutProvider()),
        ChangeNotifierProvider(create: (_) => ProgressProvider()),
      ],
      child: const MuscleBuilderApp(),
    ),
  );
}

class MuscleBuilderApp extends StatelessWidget {
  const MuscleBuilderApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Muscle Builder & Diet Planner",
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const SplashScreen(),
    );
  }
}
