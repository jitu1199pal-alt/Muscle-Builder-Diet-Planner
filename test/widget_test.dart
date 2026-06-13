import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:muscle_builder_diet_planner/models/user_model.dart';
import 'package:muscle_builder_diet_planner/widgets/custom_button.dart';
import 'package:muscle_builder_diet_planner/widgets/custom_card.dart';

void main() {
  group('UserModel Tests', () {
    test('Correctly serializes and deserializes UserModel json', () {
      final user = UserModel(
        age: 28,
        gender: "male",
        height: 180.0,
        weight: 80.0,
        foodPreference: "non-veg",
        activityLevel: "Very Active",
        goal: "Muscle Gain",
        focus: "Full Body",
        bmi: 24.69,
        targetCalories: 2800,
        targetWaterLiters: 3.5,
        targetWaterCups: 14,
        targetProteinGrams: 160,
      );

      final jsonMap = user.toJson();
      expect(jsonMap['age'], 28);
      expect(jsonMap['gender'], "male");
      expect(jsonMap['height'], 180.0);
      expect(jsonMap['weight'], 80.0);
      expect(jsonMap['foodPreference'], "non-veg");

      final parsedUser = UserModel.fromJson(jsonMap);
      expect(parsedUser.age, 28);
      expect(parsedUser.gender, "male");
      expect(parsedUser.height, 180.0);
      expect(parsedUser.bmi, 24.69);
      expect(parsedUser.targetProteinGrams, 160);
    });
  });

  group('Custom Widgets Widget Tests', () {
    testWidgets('CustomButton renders text and triggers callback on press', (WidgetTester tester) async {
      bool isClicked = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomButton(
              text: 'Start Journey',
              onPressed: () {
                isClicked = true;
              },
            ),
          ),
        ),
      );

      // Verify button text is displayed
      expect(find.text('Start Journey'), findsOneWidget);

      // Trigger click
      await tester.tap(find.byType(CustomButton));
      await tester.pump();

      // Verify callback trigger
      expect(isClicked, true);
    });

    testWidgets('CustomCard places children widgets perfectly inside layout', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: CustomCard(
              child: Text('Card Content Child'),
            ),
          ),
        ),
      );

      // Verify child content exists
      expect(find.text('Card Content Child'), findsOneWidget);
    });
  });
}
