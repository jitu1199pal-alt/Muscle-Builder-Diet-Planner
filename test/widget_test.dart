import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:muscle_builder_diet_planner/main.dart';
import 'package:muscle_builder_diet_planner/providers/user_provider.dart';
import 'package:muscle_builder_diet_planner/providers/workout_provider.dart';
import 'package:muscle_builder_diet_planner/providers/progress_provider.dart';
import 'package:muscle_builder_diet_planner/services/local_storage_service.dart';

void main() {
  testWidgets('App splash screen smoke test', (WidgetTester tester) async {
    // Initialize mock values for SharedPreferences
    SharedPreferences.setMockInitialValues({});
    await LocalStorageService.init();

    // Pump the app
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => UserProvider()),
          ChangeNotifierProvider(create: (_) => WorkoutProvider()),
          ChangeNotifierProvider(create: (_) => ProgressProvider()),
        ],
        child: const MyApp(),
      ),
    );

    // Verify that the splash screen shows the fitness_center icon
    expect(find.byIcon(Icons.fitness_center), findsOneWidget);
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}
