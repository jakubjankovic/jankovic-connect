import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import {colors, displayFont, font, spacing} from '../constants/theme';
import {PROFILE, TEXTS} from '../constants/profile';
import Hero from '../components/Hero';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import ActionButton from '../components/ActionButton';
import Disclaimer from '../components/Disclaimer';
import {
  callPhone,
  copyEmail,
  openBooking,
  openEmail,
  openFacebook,
  openLinkedIn,
  saveContact,
} from '../utils/actions';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({navigation}: Props) {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = () => {
    copyEmail();
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Hero intro={PROFILE.shortIntro} />

      <Card>
        <ActionButton
          label="Uložiť kontakt"
          icon="👤"
          chevron
          onPress={saveContact}
        />
        <ActionButton label="LinkedIn" icon="in" chevron onPress={openLinkedIn} />
        <ActionButton
          label="Napísať e-mail"
          icon="✉️"
          chevron
          onPress={openEmail}
        />
        <ActionButton
          label="Kopírovať e-mail"
          icon="📋"
          chevron
          onPress={handleCopyEmail}
          success={emailCopied}
          successLabel="E-mail skopírovaný ✓"
        />
        <ActionButton
          label="Zavolať"
          subtitle={PROFILE.phone}
          icon="📞"
          chevron
          onPress={callPhone}
        />
        <ActionButton label="Facebook" icon="f" chevron onPress={openFacebook} />
        <ActionButton
          label="Rezervovať termín"
          icon="📅"
          variant="cta"
          chevron
          onPress={openBooking}
        />
        <Text style={styles.tagline}>Spojme sa. Vytvorme hodnotu.</Text>
      </Card>

      <Card>
        <SectionTitle title="Nástroje na networking" subtitle="Zdieľaj a zapisuj" />
        <ActionButton
          label="Zdieľať vizitku (QR)"
          icon="🔳"
          chevron
          onPress={() => navigation.navigate('ShareCard')}
        />
        <ActionButton
          label="Nastavenie NFC"
          icon="📶"
          chevron
          onPress={() => navigation.navigate('NfcSetup')}
        />
        <ActionButton
          label="Správa po stretnutí"
          icon="✍️"
          chevron
          onPress={() => navigation.navigate('FollowUpHelper')}
        />
      </Card>

      <Disclaimer />
      <Text style={styles.footer}>{TEXTS.footer}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  tagline: {
    fontFamily: displayFont,
    fontStyle: 'italic',
    color: colors.muted,
    fontSize: font.subtitle,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  footer: {
    color: colors.champagne,
    fontFamily: displayFont,
    fontStyle: 'italic',
    fontSize: font.subtitle,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
