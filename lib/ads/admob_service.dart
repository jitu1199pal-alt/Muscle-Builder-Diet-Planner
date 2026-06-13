import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class AdmobService {
  AdmobService._();

  static const bool _useRealAds = false;

  // Real or test ad units mapped properly
  static String get bannerAdUnitId {
    return _useRealAds
        ? 'ca-app-pub-3940256099942544/6300978111' // Production/Test Standard
        : 'ca-app-pub-3940256099942544/6300978111'; // Google standard test
  }

  static String get interstitialAdUnitId {
    return _useRealAds
        ? 'ca-app-pub-3940256099942544/1033173712'
        : 'ca-app-pub-3940256099942544/1033173712';
  }

  static Future<void> initialize() async {
    try {
      await MobileAds.instance.initialize();
      // Configure child safety rules dynamically
      RequestConfiguration configuration = RequestConfiguration(
        testDeviceIds: [],
        tagForChildDirectedTreatment: TagForChildDirectedTreatment.yes, // COPPA compliant
        maxAdContentRating: MaxAdContentRating.g,
      );
      await MobileAds.instance.updateRequestConfiguration(configuration);
    } catch (e) {
      debugPrint("AdMob Initializing exception: $e");
    }
  }

  // Load a banner ad with generic default safe listeners
  static BannerAd createBannerAd() {
    return BannerAd(
      adUnitId: bannerAdUnitId,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (Ad ad) => debugPrint('Ad loaded successfully: ${ad.adUnitId}'),
        onAdFailedToLoad: (Ad ad, LoadAdError error) {
          debugPrint('Ad failed to load: ${error.message}');
          ad.dispose();
        },
      ),
    );
  }

  static void showInterstitial({required VoidCallback onDismissed}) {
    InterstitialAd.load(
      adUnitId: interstitialAdUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (InterstitialAd ad) {
          ad.fullScreenContentCallback = FullScreenContentCallback(
            onAdDismissedFullScreenContent: (InterstitialAd ad) {
              ad.dispose();
              onDismissed();
            },
            onAdFailedToShowFullScreenContent: (InterstitialAd ad, AdError error) {
              ad.dispose();
              onDismissed();
            },
          );
          ad.show();
        },
        onAdFailedToLoad: (LoadAdError error) {
          debugPrint('Interstitial failed: $error');
          onDismissed(); // recover quickly
        },
      ),
    );
  }
}
