class WaterCalculator {
  WaterCalculator._();

  static double calculateLiters(double weightKg) {
    // weight × 0.04
    return weightKg * 0.04;
  }

  static int calculateCups(double weightKg) {
    final double liters = calculateLiters(weightKg);
    // Standard cup of 250ml (0.25L)
    return (liters / 0.25).ceil();
  }
}
