import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors, font, radius, spacing} from '../constants/theme';

type Variant = 'default' | 'cta' | 'primary' | 'secondary' | 'ghost';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  subtitle?: string;
  chevron?: boolean;
  loading?: boolean;
  success?: boolean;
  successLabel?: string;
}

export default function ActionButton({
  label,
  onPress,
  variant = 'default',
  icon,
  subtitle,
  chevron,
  loading,
  success,
  successLabel,
}: Props) {
  // Back-compat: old "primary" was the emphasized button -> gold CTA.
  const isCta = variant === 'cta' || variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({pressed}) => [
        styles.base,
        isCta ? styles.cta : styles.default,
        success && styles.success,
        pressed && styles.pressed,
      ]}>
      {icon != null ? (
        <View style={[styles.chip, isCta && styles.chipCta]}>
          {typeof icon === 'string' ? (
            <Text style={[styles.chipText, isCta && styles.chipTextCta]}>
              {icon}
            </Text>
          ) : (
            icon
          )}
        </View>
      ) : null}

      <View style={styles.labelWrap}>
        <Text style={[styles.t1, isCta && styles.t1Cta]}>
          {success && successLabel ? successLabel : label}
        </Text>
        {subtitle ? (
          <Text style={[styles.t2, isCta && styles.t2Cta]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {loading ? (
        <ActivityIndicator color={isCta ? colors.ctaText : colors.gold} />
      ) : chevron ? (
        <Text style={[styles.chev, isCta && styles.chevCta]}>›</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    borderRadius: radius.md,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginVertical: spacing.xs + 1,
    borderWidth: 1,
  },
  default: {
    backgroundColor: 'rgba(245,239,224,0.03)',
    borderColor: 'rgba(232,201,137,0.12)',
  },
  cta: {
    backgroundColor: colors.gold,
    borderColor: colors.goldDeep,
    shadowColor: colors.gold,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 8},
    elevation: 6,
  },
  success: {
    borderColor: 'rgba(111,212,154,0.5)',
  },
  pressed: {
    opacity: 0.8,
    transform: [{scale: 0.99}],
  },
  chip: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(232,201,137,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(232,201,137,0.28)',
  },
  chipCta: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderColor: 'rgba(0,0,0,0.32)',
  },
  chipText: {
    color: colors.champagne,
    fontSize: font.subtitle,
    fontWeight: '700',
  },
  chipTextCta: {
    color: colors.ctaText,
  },
  labelWrap: {
    flex: 1,
  },
  t1: {
    color: colors.text,
    fontSize: font.body - 1,
    fontWeight: '600',
  },
  t1Cta: {
    color: colors.ctaText,
    fontWeight: '700',
  },
  t2: {
    color: colors.muted,
    fontSize: font.small - 1,
    marginTop: 1,
  },
  t2Cta: {
    color: 'rgba(26,20,10,0.7)',
  },
  chev: {
    color: colors.faint,
    fontSize: 22,
    fontWeight: '400',
    marginLeft: 2,
  },
  chevCta: {
    color: 'rgba(26,20,10,0.6)',
  },
});
