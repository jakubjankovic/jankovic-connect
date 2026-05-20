import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, font, spacing} from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionTitle({title, subtitle}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar} />
      <View style={styles.flex}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bar: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: colors.emerald,
    marginRight: spacing.md,
  },
  flex: {flex: 1},
  title: {
    color: colors.text,
    fontSize: font.title,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 2,
  },
});
