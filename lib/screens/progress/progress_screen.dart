import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/colors.dart';
import '../../providers/user_provider.dart';
import '../../providers/progress_provider.dart';
import '../../widgets/custom_card.dart';

class ProgressScreen extends StatefulWidget {
  const ProgressScreen({Key? key}) : super(key: key);

  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  final TextEditingController _weightLogCont = TextEditingController();

  void _logNewWeight(ProgressProvider progProv) {
    if (_weightLogCont.text.isNotEmpty) {
      final double? wt = double.tryParse(_weightLogCont.text);
      if (wt != null && wt >= 30 && wt <= 180) {
        final List<String> days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        final String todayDay = days[(DateTime.now().weekday - 1).clamp(0, 6)];
        
        progProv.addWeight(todayDay, wt);
        _weightLogCont.clear();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Weight logged persistently!")),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Supported weights: 30kg - 180kg")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final userProv = Provider.of<UserProvider>(context);
    final progProv = Provider.of<ProgressProvider>(context);

    if (!userProv.hasPlan) {
      return const Scaffold(
        body: Center(
          child: Text("Please generate your fitness plan to track progress!"),
        ),
      );
    }

    final user = userProv.user!;
    final logs = progProv.weightLogs;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          "Commitment Logs",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Streak panel
            CustomCard(
              backgroundColor: AppColors.primary.withOpacity(0.06),
              child: Row(
                children: [
                  const Icon(Icons.workspace_premium, color: Colors.amber, size: 40),
                  const SizedBox(width: 16.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Streak Level Achieved",
                          style: TextStyle(fontSize: 12, color: AppColors.secondaryText),
                        ),
                        const SizedBox(height: 4.0),
                        Text(
                          "${progProv.consistencyStreak} Consecutive Days",
                          style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.primaryText),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
            const SizedBox(height: 20.0),

            // Line chart weight trend (Custom Painted for offline robustness and layout perfection)
            Text(
              "Weight Tracking Trend",
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryText.withOpacity(0.9)),
            ),
            const SizedBox(height: 10.0),
            CustomCard(
              child: Column(
                children: [
                  const SizedBox(height: 10),
                  SizedBox(
                    height: 140,
                    width: double.infinity,
                    child: CustomPaint(
                      painter: WeightChartPainter(logs: logs),
                    ),
                  ),
                  const SizedBox(height: 12.0),
                  const Text(
                    "Trend represents weight tracking indices over recent active weekdays.",
                    style: TextStyle(fontSize: 10.5, color: AppColors.secondaryText),
                    textAlign: TextAlign.center,
                  )
                ],
              ),
            ),
            const SizedBox(height: 20.0),

            // Log new weight row
            Text(
              "Log Today's Weight",
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryText.withOpacity(0.9)),
            ),
            const SizedBox(height: 10.0),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _weightLogCont,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      hintText: "Enter weight in kg (e.g. 74.5)",
                      contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    minimumSize: const Size(100, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  onPressed: () => _logNewWeight(progProv),
                  child: const Text("Log", style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 24.0),

            // Static Biometrics list
            Text(
              "Biometrics Blueprint",
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.primaryText.withOpacity(0.9)),
            ),
            const SizedBox(height: 10.0),
            CustomCard(
              child: Column(
                children: [
                  _buildBiometricRow("Basal Metric (Age)", "${user.age} Years"),
                  _buildBiometricRow("Target Height", "${user.height} cm"),
                  _buildBiometricRow("Starting Weight", "${user.weight} kg"),
                  _buildBiometricRow("Workout Split", user.focus),
                  _buildBiometricRow("Protein target", "${user.targetProteinGrams} g/day"),
                  _buildBiometricRow("Standard Water Goal", "${user.targetWaterCups} Cups"),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildBiometricRow(String name, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(name, style: const TextStyle(color: AppColors.secondaryText, fontSize: 12.5)),
          Text(value, style: const TextStyle(color: AppColors.primaryText, fontSize: 13, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

// Custom Painter to draw beautiful line chart
class WeightChartPainter extends CustomPainter {
  final List<dynamic> logs;

  WeightChartPainter({required this.logs});

  @override
  void paint(Canvas canvas, Size size) {
    if (logs.isEmpty) return;

    final Paint linePaint = Paint()
      ..color = AppColors.primary
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final Paint pointPaint = Paint()
      ..color = AppColors.success
      ..style = PaintingStyle.fill;

    final Paint gridPaint = Paint()
      ..color = Colors.grey[800]!
      ..strokeWidth = 0.5;

    // Find min/max values to fit charts nicely
    double minW = 10000;
    double maxW = -10000;
    for (var log in logs) {
      if (log.weight < minW) minW = log.weight;
      if (log.weight > maxW) maxW = log.weight;
    }

    // Add margin pad
    minW -= 1.0;
    maxW += 1.0;
    final double range = maxW - minW;

    final double widthSegment = size.width / (logs.length > 1 ? (logs.length - 1) : 1);
    
    // Draw reference grids
    canvas.drawLine(Offset(0, size.height * 0.25), Offset(size.width, size.height * 0.25), gridPaint);
    canvas.drawLine(Offset(0, size.height * 0.75), Offset(size.width, size.height * 0.75), gridPaint);

    final Path path = Path();
    final List<Offset> points = [];

    for (int i = 0; i < logs.length; i++) {
      final double x = i * widthSegment;
      final double normalizedY = (logs[i].weight - minW) / range;
      final double y = size.height - (normalizedY * size.height);
      
      final Offset point = Offset(x, y);
      points.add(point);

      if (i == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }

      // Draw text values
      final TextPainter weightText = TextPainter(
        text: TextSpan(
          text: "${logs[i].weight}kg",
          style: const TextStyle(color: AppColors.secondaryText, fontSize: 8),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      weightText.paint(canvas, Offset(x - 10, y - 18));

      final TextPainter labelText = TextPainter(
        text: TextSpan(
          text: logs[i].date,
          style: const TextStyle(color: AppColors.secondaryText, fontSize: 8),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      labelText.paint(canvas, Offset(x - 8, size.height - 12));
    }

    canvas.drawPath(path, linePaint);

    // Draw point circles
    for (var pt in points) {
      canvas.drawCircle(pt, 5.0, pointPaint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
