import React from 'react';
import { ActivityIndicator, Pressable, PressableStateCallbackType, StyleSheet, Text, ViewStyle } from 'react-native';

export type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, disabled, loading, style }: PrimaryButtonProps) {
  const getStyles = ({ pressed }: PressableStateCallbackType) => [
    styles.button,
    style,
    (disabled || loading) && styles.disabled,
    pressed && !disabled && !loading && styles.pressed,
  ];

  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={getStyles}>
      {loading ? <ActivityIndicator color="#e5f6ff" /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00aeef',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00aeef',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    color: '#e5f6ff',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
