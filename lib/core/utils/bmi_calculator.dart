class BmiCalculator {
  BmiCalculator._();

  static double calculate(double weightKg, double heightCm) {
    if (heightCm <= 0) return 0.0;
    final double heightM = heightCm / 100.0;
    return weightKg / (heightM * heightM);
  }

  static String getCategory(double bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25.0) return "Healthy Weight";
    if (bmi < 30.0) return "Overweight";
    return "Obese";
  }
}
