import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {colors, displayFont, font, radius, spacing} from '../constants/theme';
import {PROFILE, PUBLIC_CARD_URL, TEXTS} from '../constants/profile';
import Card from '../components/Card';
import ActionButton from '../components/ActionButton';
import Disclaimer from '../components/Disclaimer';
import {
  copyCardLink,
  openBooking,
  openLinkedIn,
  saveContact,
} from '../utils/actions';

export default function ShareCardScreen() {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    copyCardLink();
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Card style={styles.qrCard}>
        <Text style={styles.scanTitle}>{TEXTS.scanOrTap}</Text>
        <View style={styles.qrFrame}>
          <QRCode
            value={PUBLIC_CARD_URL}
            size={232}
            backgroundColor="#FFFFFF"
            color="#0a0908"
          />
        </View>
        <Text style={styles.name}>{PROFILE.fullName}</Text>
        <Text style={styles.headline}>{PROFILE.headline}</Text>
        <Text style={styles.helper}>{TEXTS.shareHelper}</Text>
      </Card>

      <Card>
        <ActionButton
          label="Copy Link"
          icon="🔗"
          variant="primary"
          onPress={handleCopyLink}
          success={linkCopied}
          successLabel="Link skopírovaný ✓"
        />
        <ActionButton label="Save Contact" icon="👤" onPress={saveContact} />
        <ActionButton
          label="Connect on LinkedIn"
          icon="in"
          onPress={openLinkedIn}
        />
        <ActionButton
          label="Book a Meeting"
          icon="📅"
          onPress={openBooking}
        />
      </Card>

      <Disclaimer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.lg, paddingBottom: spacing.xxl},
  qrCard: {alignItems: 'center'},
  scanTitle: {
    color: colors.text,
    fontSize: font.subtitle,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  qrFrame: {
    backgroundColor: '#FFFFFF',
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  name: {
    fontFamily: displayFont,
    color: colors.champagne,
    fontSize: font.title + 4,
    fontWeight: '600',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  headline: {
    color: colors.gold,
    fontSize: font.small,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  helper: {
    color: colors.muted,
    fontSize: font.small,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
