import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

export type FormInputProps = {
  label: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  secureTextEntry?: boolean;
  containerStyle?: object;
} & Omit<TextInputProps, 'style' | 'secureTextEntry'>;

export function FormInput({
  label,
  iconName,
  placeholder,
  secureTextEntry,
  containerStyle,
  ...rest
}: FormInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#5f6a7a"
          secureTextEntry={secureTextEntry}
          style={styles.input}
          {...rest}
        />
        {iconName ? (
          <MaterialIcons name={iconName} size={20} color="#70809b" style={styles.icon} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#7b8799',
    marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.28)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: '#e2e8f0',
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 10,
  },
});
