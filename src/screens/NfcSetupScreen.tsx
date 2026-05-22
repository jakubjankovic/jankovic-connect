import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, Path, Stop} from 'react-native-svg';
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';
import {colors, font, radius, spacing} from '../constants/theme';
import {PUBLIC_CARD_URL, TEXTS} from '../constants/profile';

type NfcState =
  | 'checking'
  | 'unsupported'
  | 'disabled'
  | 'ready'
  | 'writing'
  | 'success'
  | 'failed';

const STATUS: Record<NfcState, {label: string; detail: string; tone: string}> = {
  checking: {label: 'Kontrolujem NFC…', detail: 'Zisťujem dostupnosť NFC.', tone: colors.muted},
  unsupported: {
    label: 'NFC nie je dostupné',
    detail: 'Toto zariadenie nepodporuje NFC. Použite QR kód ako zálohu.',
    tone: colors.danger,
  },
  disabled: {
    label: 'NFC je vypnuté',
    detail: 'Zapnite NFC v nastaveniach Androidu a vráťte sa späť.',
    tone: colors.gold,
  },
  ready: {
    label: 'Ťuknite na symbol',
    detail: 'Ťuknite na zlatý NFC symbol a priložte kartu/nálepku k telefónu.',
    tone: colors.champagne,
  },
  writing: {
    label: 'Priložte NFC kartu…',
    detail: 'Držte kartu/nálepku pri zadnej časti telefónu, kým prebehne zápis.',
    tone: colors.champagne,
  },
  success: {
    label: 'Zápis úspešný ✓',
    detail: 'Na kartu bol zapísaný odkaz vašej vizitky. Po priložení sa otvorí.',
    tone: colors.success,
  },
  failed: {
    label: 'Zápis zlyhal',
    detail: 'Skúste to znova a priložte kartu bližšie k telefónu.',
    tone: colors.danger,
  },
};

function NfcSymbol({size}: {size: number}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="nfcG" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={colors.goldDeep} />
          <Stop offset="0.5" stopColor={colors.champagne} />
          <Stop offset="1" stopColor={colors.gold} />
        </LinearGradient>
      </Defs>
      <Path d="M7 7c2.6 2.8 2.6 7.2 0 10" stroke="url(#nfcG)" strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M11 4.4c4.4 4.8 4.4 10.4 0 15.2" stroke="url(#nfcG)" strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M15 2c6 6.6 6 13.4 0 20" stroke="url(#nfcG)" strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

export default function NfcSetupScreen() {
  const [state, setState] = useState<NfcState>('checking');
  const pulse = useRef(new Animated.Value(1)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;

  // Idle pulse + rotating ring
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {toValue: 1.1, duration: 950, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
        Animated.timing(pulse, {toValue: 1, duration: 950, easing: Easing.inOut(Easing.ease), useNativeDriver: true}),
      ]),
    ).start();
    Animated.loop(
      Animated.timing(spin, {toValue: 1, duration: 3600, easing: Easing.linear, useNativeDriver: true}),
    ).start();
  }, [pulse, spin]);

  // Beacon waves while writing
  useEffect(() => {
    const mk = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, {toValue: 1, duration: 1500, easing: Easing.out(Easing.ease), useNativeDriver: true}),
          Animated.timing(v, {toValue: 0, duration: 0, useNativeDriver: true}),
        ]),
      );
    if (state === 'writing') {
      const a = mk(wave1, 0);
      const b = mk(wave2, 750);
      a.start();
      b.start();
      return () => {
        a.stop();
        b.stop();
        wave1.setValue(0);
        wave2.setValue(0);
      };
    }
  }, [state, wave1, wave2]);

  const checkNfc = useCallback(async () => {
    setState('checking');
    try {
      const supported = await NfcManager.isSupported();
      if (!supported) {
        setState('unsupported');
        return;
      }
      await NfcManager.start();
      const enabled = await NfcManager.isEnabled();
      setState(enabled ? 'ready' : 'disabled');
    } catch (e) {
      setState('unsupported');
    }
  }, []);

  useEffect(() => {
    checkNfc();
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, [checkNfc]);

  const writeTag = useCallback(async () => {
    if (state === 'disabled' || state === 'unsupported' || state === 'checking') {
      checkNfc();
      return;
    }
    setState('writing');
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(PUBLIC_CARD_URL)]);
      if (!bytes) {
        throw new Error('encode failed');
      }
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      setState('success');
    } catch (e) {
      setState('failed');
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }, [state, checkNfc]);

  const status = STATUS[state];
  const spinDeg = spin.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']});
  const writing = state === 'writing';

  const waveStyle = (v: Animated.Value) => ({
    transform: [{scale: v.interpolate({inputRange: [0, 1], outputRange: [1, 2.5]})}],
    opacity: v.interpolate({inputRange: [0, 1], outputRange: [0.45, 0]}),
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.stage}>
        {writing ? (
          <>
            <Animated.View style={[styles.wave, waveStyle(wave1)]} />
            <Animated.View style={[styles.wave, waveStyle(wave2)]} />
          </>
        ) : null}

        <Animated.View style={[styles.ring, {transform: [{rotate: spinDeg}]}]}>
          <Svg width={210} height={210} viewBox="0 0 210 210">
            <Defs>
              <LinearGradient id="ringG" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={colors.goldDeep} />
                <Stop offset="0.5" stopColor={colors.champagne} />
                <Stop offset="1" stopColor={colors.gold} />
              </LinearGradient>
            </Defs>
            <Circle
              cx={105}
              cy={105}
              r={100}
              fill="none"
              stroke="url(#ringG)"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="160 470"
            />
          </Svg>
        </Animated.View>

        <Pressable onPress={writeTag} style={styles.tapArea}>
          <Animated.View style={[styles.symbol, {transform: [{scale: pulse}]}]}>
            <NfcSymbol size={92} />
          </Animated.View>
        </Pressable>
      </View>

      <Text style={[styles.statusLabel, {color: status.tone}]}>{status.label}</Text>
      <Text style={styles.statusDetail}>{status.detail}</Text>

      <View style={styles.urlBox}>
        <Text style={styles.urlLabel}>Zapisovaný odkaz</Text>
        <Text style={styles.url}>{PUBLIC_CARD_URL}</Text>
      </View>
      <Text style={styles.note}>{TEXTS.nfcBackup}</Text>
      <Text style={styles.explain}>{TEXTS.nfcExplain}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.lg, paddingTop: spacing.xxl, alignItems: 'center'},
  stage: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  wave: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  ring: {position: 'absolute', width: 210, height: 210},
  tapArea: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d0a07',
    borderWidth: 1,
    borderColor: colors.border,
  },
  symbol: {alignItems: 'center', justifyContent: 'center'},
  statusLabel: {fontSize: font.title, fontWeight: '700', textAlign: 'center'},
  statusDetail: {
    color: colors.muted,
    fontSize: font.body,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  urlBox: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  urlLabel: {
    color: colors.muted,
    fontSize: font.small - 1,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  url: {color: colors.gold, fontSize: font.small},
  note: {
    color: colors.champagne,
    fontSize: font.small,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  explain: {
    color: colors.muted,
    fontSize: font.small,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
