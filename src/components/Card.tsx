import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors, radius, spacing} from '../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Card({children, style}: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 12},
    elevation: 4,
  },
});
