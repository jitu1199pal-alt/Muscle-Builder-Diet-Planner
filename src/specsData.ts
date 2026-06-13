export interface SpecPart {
  number: number;
  title: string;
  summary: string;
  badge: string;
  color: string;
  content: string;
}

export const SPECS_DATA: SpecPart[] = [
  {
    number: 1,
    title: "Master App Blueprint",
    summary: "Production-grade feature freeze, cross-platform architecture, and technology specs.",
    badge: "Architecture",
    color: "emerald",
    content: `### 📱 Muscle Builder & Diet Planner Architecture

This master plan provides a complete blueprint for a production-grade **Flutter** mobile application (Android & iOS) integrated with a backend server that handles secure AI synthesis, analytics tracking, and user synchronizations.

#### 🛠️ Core Technology Stack
- **Client Frontend**: Flutter (SDK v3.22+), Dart 3.4+
- **Primary State Management**: Flutter BLoC (Business Logic Component) or Riverpod
- **Local Persistence**: Hive or ObjectBox for lightning-fast, offline-first performance
- **Backend API**: Node.js with Express + TypeScript (mirrored in our current web prototype)
- **Database**: Cloud Firestore (NoSQL) for high-sync scalable user sessions
- **AI Core**: Google Gemini 3.5 Flash Model (integrated server-side)

#### 🗺️ Finalized Feature Set
1. **Adaptive Profile Setup**: Capture biometric data, goal coefficients (Bulking, Leaning, Recomposing), and physical constraints (injuries, food allergies).
2. **Offline workout tracker**: Daily reps/sets counters, real-time rest timers, audio visual cues, and local caching.
3. **Smart Nutrition Ledger**: Day-specific macros tracker, water intake logger, and recipe engine with local checklist logic.
4. **AI Plan Synthesis**: Secure server proxy querying Gemini API to generate complex structured schedules, saving them to Firestore.
5. **Monetization Layer**: Dynamic-load AdMob integration (low impact to conserve premium UX).
6. **Progress Space**: Weight tracking graphs, calorie logs, and dynamic adjustment estimations.

#### 🔒 Security & Performance Guidelines
- **Zero Client-Side Secrets**: No API keys, credentials, or prompts stored in the Dart bundle.
- **Strict HTTPS/SSL pinning**: All transactions to API routes must occur over TLS 1.3.
- **Offline Sync Queue**: Offline logs are serialized locally and synced to Firebase Firestore when net access is restored.`
  },
  {
    number: 2,
    title: "Complete UI/UX Layout",
    summary: "Complete layout variables, typography tokens, color palettes, and screen dimensions.",
    badge: "UI / UX Design",
    color: "blue",
    content: `### 🎨 UI Design Tokens & Typography

Designed to provide high visual hierarchy with a dark-ambient athletic aesthetic, reducing eye strain during high-intensity workouts.

#### 🎨 Color Hex Codes
- **Primary Brand**: \`#10B981\` (Active Emerald) - Used for primary buttons, completed state, active values
- **Secondary Accent**: \`#F59E0B\` (Dynamic Amber) - Used for progress ring, warning warnings, highlights
- **Background Slate**: \`#07090E\` (Midnight Void) - Absolute container background
- **Card Muted**: \`#0F131F\` (Charcoal Steel) - Background for exercise & meal cards
- **Border Crisp**: \`#1F2937\` (Crisp Boundary) - Divider lines and inactive inputs
- **Text Crisp White**: \`#F3F4F6\` - Primary headers and heavy typography
- **Text Muted Gray**: \`#9CA3AF\` - Subheadings, labels, and secondary indicators

#### ✍️ Typography Scale
- **Display Headings**: Font: *Outfit* or *Inter Bold*, Size: 24-32px, tracking: \`-0.05em\` (Compact, athletic vibe)
- **Sub-headings**: Font: *Inter SemiBold*, Size: 18-20px, tracking: \`-0.02em\`
- **Body & Captions**: Font: *Inter Regular*, Size: 14-16px, line-height: 1.5
- **Monospace Accents**: Font: *JetBrains Mono*, Size: 12px (used for timers, calorie counts, specs)

#### 📐 Layout Grid & Spacing Constraints
- **Base Grid**: 8px layout structure. Paddings can be \`8px (xs)\`, \`12px (sm)\`, \`16px (md)\`, \`24px (lg)\`
- **Responsive Wrappers**: Max container width set to \`768px\` on mobile screens, scaling centered on tablets.
- **Minimum Tap Targets**: 48px x 48px to prevent touch registration issues during sets when palms are sweating.`
  },
  {
    number: 3,
    title: "Flutter Architecture & Coding Rules",
    summary: "Complete 20-Rule system freeze using MVVM Lite + Provider for high efficiency.",
    badge: "Coding System",
    color: "purple",
    content: `### 📂 Flutter MVVM Lite Architecture + 20 Gold Rules

To ensure 100% reproducibility and prevent random code generation, follow this frozen configuration.

#### 1. Flutter Version Freeze
- **SDK Stable**: Always use the latest Flutter Stable channel release.
- **Strict Avoidance**: No beta, experimental, or non-tested packages to maintain ultimate play store stability.

#### 2. Target Native Devices
- **Minimum SDK Support**: Android API 26 (Android 8.0) to maximize worldwide store compatibility.
- **Recommended Range**: Android 10+ standard target bounds.

#### 3. App Architecture Pattern: MVVM Lite
- **Lightweight State**: Employs simple Model-View-ViewModel design mapping.
- **Avoid Over-Engineering**: Strictly avoid Clean Architecture (excessive boilerplates) and BLoC (unnecessary state complexity for initial builds).

#### 4. State Management Model
- **Provider Only**: Fast, lightweight, beginner-friendly, and highly stable with AI code assistance.
- **Strict Avoidance**: Do not pull Riverpod, BloC, or GetX into this project iteration.

#### 5. Frozen Folder Directory Tree
\`\`\`
lib/
├── main.dart
│
├── core/
│   ├── theme/
│   │   ├── app_theme.dart
│   │   └── colors.dart
│   │
│   ├── constants/
│   │   ├── app_strings.dart
│   │   ├── dimensions.dart
│   │   └── app_assets.dart
│   │
│   └── utils/
│       ├── bmi_calculator.dart
│       ├── calorie_calculator.dart
│       └── water_calculator.dart
│
├── data/
│   ├── diet_data.dart
│   ├── workout_data.dart
│   └── goal_data.dart
│
├── models/
│   ├── user_model.dart
│   ├── workout_model.dart
│   ├── diet_model.dart
│   └── progress_model.dart
│
├── providers/
│   ├── user_provider.dart
│   ├── workout_provider.dart
│   └── progress_provider.dart
│
├── services/
│   ├── local_storage_service.dart
│   └── plan_generator_service.dart
│
├── screens/
│   ├── splash/
│   ├── onboarding/
│   ├── user_details/
│   ├── goal_selection/
│   ├── focus_selection/
│   ├── generate_plan/
│   ├── dashboard/
│   ├── workout/
│   ├── diet/
│   ├── progress/
│   └── settings/
│
├── widgets/
│   ├── custom_button.dart
│   ├── custom_card.dart
│   ├── progress_card.dart
│   ├── workout_tile.dart
│   ├── diet_card.dart
│   └── loading_widget.dart
│
└── ads/
    └── admob_service.dart
\`\`\`

#### 6. Core Dependencies Freeze
- **Required Packages**: \`provider\`, \`shared_preferences\`, \`google_fonts\`, \`lottie\`, \`percent_indicator\`, \`fl_chart\`, \`google_mobile_ads\`. Avoid any external complex wrappers.

#### 7. Fluid Responsiveness Layout Rule
- **Scale Guarantee**: Adaptive viewports supporting 5.5\", 6.5\", and 7.0\"+ display ratios.
- **No Hardcoded Dimensions**: Use \`MediaQuery.of(context).size\` calculations.
- **Padding Constant**: Use 16px layouts for standard elements consistently.

#### 8. Absolute Theme Styling Control
- **Hex Repository**: Pull colors strictly from \`core/theme/colors.dart\`. Inline color hardcoding is prohibited.

#### 9. Navigator Routings
- **Declarative push**: Use basic \`Navigator.push()\` and \`Navigator.pushReplacement()\` wrappers only.

#### 10. Local-First States Persistence
- **No Remote Core Server Requirements**: Track active goals, weights, user profile, and completion records offline via \`SharedPreferences\`.

#### 11. Single Source Personalization Brain
- **Core Controller**: \`plan_generator_service.dart\` compiles raw inputs (Goal, Focus, Food restrictions, BMI, Activity Level) and produces baseline values. No duplicate state logic is permitted.

#### 12. Complete UI Reusability Constraint
- **Building Blocks**: Standardize custom elements such as \`custom_card.dart\`, custom buttons, and exercise list tiles to ensure design consistency.

#### 13. AdMob Placement Standard
- **Banners location**: Anchored strictly at screen footers on Dashboard, Workouts, and Diets.
- **Interstitial limits**: Pop after initial customized setup plan synthesis, and at a cap of 1 play per 5 cold-opens.

#### 14. Performance Bounds
- **Resource Constraints**: Limit Lottie animations to 1-2 key junctions. Utilize rapid WebP images and lazy-loading lists.

#### 15. Validation Rules
- **Age Bounds**: Strict range check: 13 to 60.
- **Weight Bounds**: Strict range check: 30kg to 180kg.
- **Height Bounds**: Strict range check: 120cm to 220cm.

#### 16. Structural Code Quality
- **Single Responsibility**: One active layout screen maps directly to one separate codebase file.

#### 17. System Naming Conventions
- **Explicit naming**: e.g., \`WorkoutScreen\`, \`DietCard\`, \`GoalSelectionScreen\`. Avoid cryptic codes.

#### 18. Layout Rebuild Optimization
- **Rebuild safeguards**: Do not nests scroll view nodes. Employ consumer selectors instead of global builders.

#### 19. Fast Lightweight Bundle Goal
- **Storage Target**: Keep final built Android APK under 30MB to optimize global installs.

#### 20. Retention UX Focus
- **Premium simplicity**: Keep the core simple, professional, and visually spectacular to boost organic retainment.`
  },
  {
    number: 4,
    title: "Nutrition & Gym Logic",
    summary: "Fully documented algorithmic formulas for baseline estimations (Mifflin-St Jeor & TDEE).",
    badge: "Calculators",
    color: "yellow",
    content: `### 🧮 Offline Rule-Based Workout & Diet Calculator

Before querying any AI models, the application executes standard sports science algorithms offline to get highly-reliable baseline bounds of user stats. This serves as a fail-safe.

#### 1. Basal Metabolic Rate (BMR) - Mifflin-St Jeor Equation
- **For Men**:
  $$\\text{BMR} = 10 \\times \\text{Weight (kg)} + 6.25 \\times \\text{Height (cm)} - 5 \\times \\text{Age (years)} + 5$$
- **For Women**:
  $$\\text{BMR} = 10 \\times \\text{Weight (kg)} + 6.25 \\times \\text{Height (cm)} - 5 \\times \\text{Age (years)} - 161$$

#### 2. Total Daily Energy Expenditure (TDEE)
Multiply BMR by an Activity Factor:
- **Sedentary**: BMR $\\times 1.2$
- **Moderate Activity**: BMR $\\times 1.55$
- **Highly Active**: BMR $\\times 1.725$
- **Extremely Active**: BMR $\\times 1.9$

#### 3. Goal Adjustment Rule Engine
- **Weight Loss (Cut)**: $\\text{TDEE} - 500$ kcal (deficit limit: $15\\%$ of TDEE)
- **Lean Bulk**: $\\text{TDEE} + 300$ kcal
- **Muscle Gain (Aggressive Bulk)**: $\\text{TDEE} + 500$ kcal
- **Recomposition**: Exactly $\\text{TDEE}$ (high protein)

#### 4. Macro Splits Optimization (Grams)
- **Protein**: 2.2g per kg of bodyweight ($1\\text{g} = 4\\text{kcal}$)
- **Fat**: $25\\%$ of total target calories ($1\\text{g} = 9\\text{kcal}$)
- **Carbohydrates**: Remaining calories divided by 4 ($1\\text{g} = 4\\text{kcal}$)`
  },
  {
    number: 5,
    title: "AdMob Strategy",
    summary: "Monetize cleanly without creating annoying user-interruption loops in workouts.",
    badge: "Monetization",
    color: "pink",
    content: `### 🛡️ Smart Admob Ads Placement Strategy

To prevent low app store ratings and high uninstallation ratios, advertisements must be embedded seamlessly and naturally.

#### 🎯 Placement Architecture
1. **Collapsible Anchored Banner**:
   - Mounted at the footer of the Workout Tracking screen.
   - Size: \`AdaptiveBannerAd\`. Only loaded once per workout.
2. **Native Ad Integration (Feed style)**:
   - Nested inside lists, e.g., between meals in the Diet Studio tab.
   - Blended to mimic card UI (Charcoal Steel background with Amber accents).
3. **Interstitial (Full-Screen) Ads**:
   - Only fired on logical "Workout Completed" actions, prior to summary rendering, capped at a absolute frequency limit of **1 interstitial ad per 24 hours per user**.

#### 🔒 COPPA & GDPR Compliance Flow
- **EEA Consent Flow**: Initialize the UMP SDK (User Messaging Platform) before initializing the Google Mobile Ads SDK.
- **COPPA compliance**: Check device age limits and configure \`tagForChildDirectedTreatment\` accordingly to prevent children-targeted tracking violations.`
  },
  {
    number: 6,
    title: "Gemini AI Master Prompt",
    summary: "Strict schema parameters for consistent JSON generations.",
    badge: "Core AI",
    color: "indigo",
    content: `### 🤖 Server-Side Gemini Prompt Configuration

The server executes a structured prompt engineering template to ensure Gemini 3.5 Flash consistently outputs perfectly valid JSON matching the exact schema definitions without conversational filler.

#### 📝 System Instruction Pattern
\`\`\`
You are an expert sports science algorithm and master dietitian. 
Your output must be structured strictly as a JSON object, adhering exactly to the schema provided. 
Do not include any conversational text, markdown formatting (like \`\`\`json blocks), or trailing commas.
\`\`\`

#### 📄 Prompt Template Structure
\`\`\`
Synthesize a high-performance personalized training and nutrition regimen for:
- Age: {age}
- Weight: {weight} kg
- Height: {height} cm
- Gender: {gender}
- Workout Goal: {goal}
- Dietary Preferences: {dietType}
- Fitness Level: {experienceLevel}

Generate:
1. Daily calorie objective and optimized macronutrient goals (protein, carbs, fat in grams).
2. Four custom calorie-mapped meals satisfying the '{dietType}' restriction, detailing ingredients and recipes.
3. A complete 7-day training schedule structure (Push/Pull/Legs or Arnold Split based on goal), with exercise name, targets, specific targets, sets, reps, and dynamic notes.

Outputs MUST follow this JSON structure exactly:
{{
  "dailyMacros": {{ "calories": 2500, "protein": 170, "carbs": 260, "fat": 65 }},
  "meals": [
    {{ "type": "Breakfast", "title": "...", "calories": 600, "protein": 40, "carbs": 70, "fat": 15, "ingredients": ["..."], "recipe": "..." }}
  ],
  "workout": {{
    "title": "7-Day High Performance Split",
    "days": [
      {{ "day": "Monday", "focus": "Push", "isRest": false, "exercises": [
        {{ "name": "...", "sets": 4, "reps": "8-12", "target": "Chest", "notes": "..." }}
      ] }}
    ]
  }}
}}
\`\`\``
  },
  {
    number: 7,
    title: "GitHub Integration",
    summary: "Best practices to secure reproducibility without losing properties or file configs.",
    badge: "Version Control",
    color: "cyan",
    content: `### 🐙 GitHub Actions & Code Replication Rules

Making your environment reproducible is key when distributing code or coordinating builds.

#### 🛡️ Handling Credentials
- Use **GitHub Secrets** for all keystores, Android Service Accounts, and Firebase configurations:
  - \`ANDROID_KEYSTORE_BASE64\`: Keeps the release keystore encrypted.
  - \`GEMINI_API_KEY\`: For backend actions.
- Use an env-template file (\`.env.example\`) in your repository root, keeping your active \`.env\` completely inside \`.gitignore\`.

#### 🤖 Continuous Integration Workflow (\`build.yml\`)
Trigger a test build on every pull request to ensure that TypeScript and Dart/Flutter tasks compiled cleanly:

\`\`\`yaml
name: Flutter Integration Tests
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      - name: Setup Java Jdk
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'zulu'
      - name: Setup Flutter SDK
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.x'
          channel: 'stable'
      - name: Validate Dependencies
        run: flutter pub get
      - name: Run Dart Analyzer
        run: flutter analyze
      - name: Compile Mock Android Bundle
        run: flutter build apk --debug
\`\`\``
  },
  {
    number: 8,
    title: "Play Store Ready Checklist",
    summary: "Step-by-step checklist to configure, optimize, and roll out to production stores worldwide.",
    badge: "Launch Prep",
    color: "rose",
    content: `### 🚀 Global Play Store Release Roadmap

Tick off these items to ensure your app compiles successfully and passes Google's automated application review guidelines.

#### 1. Build Optimization Configs
- Ensure you build with App Bundles rather than standard APKs to benefit from Google's Dynamic Delivery features:
  - Run command: \`flutter build appbundle --release\`
- Enable Proguard/R8 shrinking inside \`android/app/build.gradle\` to reduce total bundle download size by up to $40\\%$.

#### 2. Visual assets & Material Design Launch Components
- Create adaptive vector launcher icons inside \`res/mipmap\` using the \`flutter_launcher_icons\` package.
- Generate high-fidelity store screenshots (6.5-inch phone size, 10-inch tablet size) with a dedicated athletic background layout.

#### 3. Essential Store Metadata & Legal Compliance
- **Short Description**: High-performance AI-powered workout schedules and personalized meal planner.
- **Privacy Policy**: Secure a hosted link explaining how biometric values are processed safely on the server and cached only inside local system files.
- **Testing Track Requirements**: Secure 20 active testers for a minimum of 14 continuous days to satisfy Play Store's verification criteria for individual developers.`
  }
];
