import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DumbbellIconProps {
  size?: number;
  color?: string;
}

export function DumbbellIcon({ size = 24, color = '#e3e3e3' }: DumbbellIconProps) {
  // En iOS usamos SymbolView para SF Symbols
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name="dumbbell.fill"
        size={size}
        tintColor={color}
        type="monochrome"
      />
    );
  }
  
  // En Android/Web usamos MaterialIcons
  return (
    <MaterialIcons
      name="fitness-center"
      size={size}
      color={color}
    />
  );
}
