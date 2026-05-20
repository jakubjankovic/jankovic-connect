import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, font, radius, spacing} from '../constants/theme';
import {TEXTS} from '../constants/profile';

export default function Disclaimer() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{TEXTS.disclaimer}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: radius.sm,
  },
  text: {
    color: colors.muted,
    fontSize: font.small,
    lineHeight: 19,
    textAlign: 'center',
  },
});
