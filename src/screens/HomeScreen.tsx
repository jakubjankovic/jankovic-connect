import React, {useState} from 'react';
import {ActivityIndicator, Linking, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {colors} from '../constants/theme';
import {PUBLIC_CARD_URL} from '../constants/profile';

/**
 * The app shows the OWNER's real public business card (the exact same page a
 * visitor sees after scanning the QR), so the app and the public card are
 * always identical — same layout, fonts, gold animation, photo.
 * External links (mailto:, tel:, LinkedIn, Facebook, booking) open in the
 * appropriate app; the card itself stays inside the WebView.
 */
export default function HomeScreen() {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.screen}>
      <WebView
        source={{uri: PUBLIC_CARD_URL}}
        style={styles.web}
        originWhitelist={['*']}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={req => {
          const url = req.url || '';
          if (
            url.startsWith(PUBLIC_CARD_URL) ||
            url.startsWith('https://jakubjankovic.github.io') ||
            url.startsWith('about:') ||
            url.startsWith('data:') ||
            url.startsWith('blob:')
          ) {
            return true;
          }
          // mailto:, tel:, LinkedIn, Facebook, Google Calendar -> open externally
          Linking.openURL(url).catch(() => {});
          return false;
        }}
      />
      {loading ? (
        <View style={styles.loader} pointerEvents="none">
          <ActivityIndicator color={colors.gold} size="large" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  web: {flex: 1, backgroundColor: colors.background},
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
