import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors, displayFont, font, radius, spacing} from '../constants/theme';
import {PROFILE} from '../constants/profile';

interface Props {
  intro?: string;
}

export default function Hero({intro}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.avatar}>
        <Image
          source={require('../assets/portrait.png')}
          style={styles.avatarImg}
        />
      </View>
      <Text style={styles.name}>{PROFILE.fullName}</Text>
      <View style={styles.headlinePill}>
        <Text style={styles.headline}>{PROFILE.headline}</Text>
      </View>
      {intro ? <Text style={styles.intro}>{intro}</Text> : null}
    </View>
  );
}

const AVATAR = 150;

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    overflow: 'hidden',
    backgroundColor: '#0d0a07',
    borderWidth: 2,
    borderColor: colors.gold,
    marginBottom: spacing.lg,
    shadowColor: colors.gold,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 0},
    elevation: 8,
  },
  avatarImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: AVATAR,
    // portrait is 864x1536 (ratio 0.5625); keep aspect and align to top so the face shows
    height: AVATAR * (1536 / 864),
    resizeMode: 'cover',
  },
  name: {
    fontFamily: displayFont,
    color: colors.champagne,
    fontSize: font.hero,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headlinePill: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  headline: {
    color: colors.gold,
    fontSize: font.small - 0.5,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  intro: {
    color: colors.subtle,
    fontSize: font.body,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
});
