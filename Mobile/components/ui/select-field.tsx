import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type SelectFieldProps = {
  label: string;
  placeholder: string;
  value?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
};

export function SelectField({ label, placeholder, value, iconName, onPress }: SelectFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.field} onPress={onPress}>
        {iconName ? (
          <MaterialIcons name={iconName} size={20} color="#70809b" style={styles.icon} />
        ) : null}
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <MaterialIcons name="expand-more" size={22} color="#6b7280" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.28)',
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 12,
  },
  icon: {
    marginRight: 4,
  },
  value: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600',
  },
  placeholder: {
    color: '#6b7280',
    fontWeight: '500',
  },
});
