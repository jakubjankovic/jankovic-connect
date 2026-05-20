import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types/navigation';
import {colors, displayFont, font, radius, spacing} from '../constants/theme';
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

function TrustChip({title, sub}: {title: string; sub: string}) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipTitle}>{title}</Text>
      <Text style={styles.chipSub}>{sub}</Text>
    </View>
  );
}

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
          subtitle="Ulož si môj kontakt"
          icon="👤"
          chevron
          onPress={saveContact}
        />
        <ActionButton
          label="LinkedIn"
          subtitle="Spojme sa profesionálne"
          icon="in"
          chevron
          onPress={openLinkedIn}
        />
        <ActionButton
          label="Napísať e-mail"
          subtitle="Otvorí poštovú aplikáciu"
          icon="✉️"
          chevron
          onPress={openEmail}
        />
        <ActionButton
          label="Kopírovať e-mail"
          subtitle={PROFILE.email}
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
        <ActionButton
          label="Facebook"
          subtitle="Spoj sa na Facebooku"
          icon="f"
          chevron
          onPress={openFacebook}
        />
        <ActionButton
          label="Rezervovať termín"
          subtitle="Naživo cez Google Calendar"
          icon="📅"
          variant="cta"
          chevron
          onPress={openBooking}
        />
        <Text style={styles.tagline}>Spojme sa. Vytvorme hodnotu.</Text>
      </Card>

      <View style={styles.chipRow}>
        <TrustChip title="NFC" sub="Priložením" />
        <TrustChip title="NAŽIVO" sub="Google Calendar" />
        <TrustChip title="SÚKROMIE" sub="Dáta v bezpečí" />
      </View>

      <Card>
        <SectionTitle title="Nástroje na networking" subtitle="Zdieľaj a zapisuj" />
        <ActionButton
          label="Zdieľať vizitku"
          subtitle="QR kód pre tvoju vizitku"
          icon="🔳"
          chevron
          onPress={() => navigation.navigate('ShareCard')}
        />
        <ActionButton
          label="Nastavenie NFC"
          subtitle="Zapíš odkaz na kartu/tag"
          icon="📶"
          chevron
          onPress={() => navigation.navigate('NfcSetup')}
        />
        <ActionButton
          label="Správa po stretnutí"
          subtitle="Vygeneruj správu po stretnutí"
          icon="✍️"
          chevron
          onPress={() => navigation.navigate('FollowUpHelper')}
        />
      </Card>

      <Text style={styles.bookingNote}>{TEXTS.bookingHelper}</Text>

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
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  chipTitle: {
    color: colors.champagne,
    fontSize: font.small - 2,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  chipSub: {
    color: colors.muted,
    fontSize: font.small - 3,
    marginTop: 2,
    textAlign: 'center',
  },
  bookingNote: {
    color: colors.muted,
    fontSize: font.small,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  footer: {
    color: colors.champagne,
    fontSize: font.small - 1,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: spacing.lg,
    textTransform: 'uppercase',
  },
});
