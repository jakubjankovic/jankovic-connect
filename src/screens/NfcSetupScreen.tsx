import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';
import {colors, font, radius, spacing} from '../constants/theme';
import {PUBLIC_CARD_URL, TEXTS} from '../constants/profile';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import ActionButton from '../components/ActionButton';
import Disclaimer from '../components/Disclaimer';

type NfcState =
  | 'checking'
  | 'unsupported'
  | 'disabled'
  | 'ready'
  | 'writing'
  | 'success'
  | 'failed';

const STATUS: Record<
  NfcState,
  {label: string; detail: string; tone: 'good' | 'warn' | 'bad' | 'neutral'}
> = {
  checking: {
    label: 'Kontrolujem NFC…',
    detail: 'Zisťujem dostupnosť NFC na zariadení.',
    tone: 'neutral',
  },
  unsupported: {
    label: 'NFC nie je dostupné',
    detail: 'Toto zariadenie nepodporuje NFC. Použi QR kód ako zálohu.',
    tone: 'bad',
  },
  disabled: {
    label: 'NFC je vypnuté',
    detail: 'Zapni NFC v nastaveniach Androidu a vráť sa späť.',
    tone: 'warn',
  },
  ready: {
    label: 'Pripravené na zápis',
    detail: 'Stlač tlačidlo nižšie a prilož NFC kartu/tag/nálepku.',
    tone: 'good',
  },
  writing: {
    label: 'Prilož NFC tag…',
    detail: 'Drž tag pri zadnej časti telefónu, kým neprebehne zápis.',
    tone: 'neutral',
  },
  success: {
    label: 'Zápis úspešný ✓',
    detail: 'Na tag bol zapísaný verejný link tvojej digitálnej vizitky.',
    tone: 'good',
  },
  failed: {
    label: 'Zápis zlyhal',
    detail: 'Skús to znova a prilož tag bližšie k telefónu.',
    tone: 'bad',
  },
};

export default function NfcSetupScreen() {
  const [state, setState] = useState<NfcState>('checking');

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
    setState('writing');
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const bytes = Ndef.encodeMessage([Ndef.uriRecord(PUBLIC_CARD_URL)]);
      if (!bytes) {
        throw new Error('Encode failed');
      }
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      setState('success');
    } catch (e) {
      setState('failed');
    } finally {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  }, []);

  const status = STATUS[state];
  const toneColor =
    status.tone === 'good'
      ? colors.success
      : status.tone === 'warn'
      ? colors.gold
      : status.tone === 'bad'
      ? colors.danger
      : colors.muted;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Card>
        <SectionTitle title="Nastavenie NFC" subtitle="Zapíš odkaz na kartu/tag" />
        <View style={[styles.statusBox, {borderColor: toneColor}]}>
          <View style={[styles.dot, {backgroundColor: toneColor}]} />
          <View style={styles.flex}>
            <Text style={[styles.statusLabel, {color: toneColor}]}>
              {status.label}
            </Text>
            <Text style={styles.statusDetail}>{status.detail}</Text>
          </View>
        </View>

        {(state === 'ready' ||
          state === 'writing' ||
          state === 'success' ||
          state === 'failed') && (
          <ActionButton
            label="Zapísať odkaz na NFC"
            icon="📶"
            variant="primary"
            loading={state === 'writing'}
            onPress={writeTag}
          />
        )}

        {(state === 'disabled' ||
          state === 'unsupported' ||
          state === 'success' ||
          state === 'failed') && (
          <ActionButton label="Skontrolovať znova" onPress={checkNfc} />
        )}
      </Card>

      <Card>
        <SectionTitle title="Ako to funguje" />
        <Text style={styles.explain}>{TEXTS.nfcExplain}</Text>
        <View style={styles.urlBox}>
          <Text style={styles.urlLabel}>Zapisovaný odkaz</Text>
          <Text style={styles.url}>{PUBLIC_CARD_URL}</Text>
        </View>
        <Text style={styles.note}>{TEXTS.nfcBackup}</Text>
      </Card>

      <Disclaimer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.lg, paddingBottom: spacing.xxl},
  flex: {flex: 1},
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  statusLabel: {
    fontSize: font.subtitle,
    fontWeight: '700',
  },
  statusDetail: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 2,
    lineHeight: 18,
  },
  explain: {
    color: colors.text,
    fontSize: font.body,
    lineHeight: 22,
  },
  urlBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  urlLabel: {
    color: colors.muted,
    fontSize: font.small - 1,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  url: {
    color: colors.emerald,
    fontSize: font.small,
  },
  note: {
    color: colors.gold,
    fontSize: font.small,
    marginTop: spacing.md,
    fontWeight: '600',
  },
});
