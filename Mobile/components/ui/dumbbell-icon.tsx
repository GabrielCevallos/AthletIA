import React from 'react';
import { View } from 'react-native';

interface DumbbellIconProps {
  size?: number;
}

export function DumbbellIcon({ size = 24 }: DumbbellIconProps) {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {/* Peso izquierdo */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          width: 6 * scale,
          height: 8 * scale,
          backgroundColor: '#e3e3e3',
          borderRadius: 1 * scale,
        }}
      />
      
      {/* Barra izquierda */}
      <View
        style={{
          position: 'absolute',
          left: 6 * scale,
          width: 4 * scale,
          height: 3 * scale,
          backgroundColor: '#e3e3e3',
          borderRadius: 0.5 * scale,
        }}
      />
      
      {/* Barra central */}
      <View
        style={{
          position: 'absolute',
          left: '50%',
          marginLeft: -(6 * scale) / 2,
          width: 6 * scale,
          height: 2 * scale,
          backgroundColor: '#e3e3e3',
          borderRadius: 1 * scale,
        }}
      />
      
      {/* Barra derecha */}
      <View
        style={{
          position: 'absolute',
          right: 6 * scale,
          width: 4 * scale,
          height: 3 * scale,
          backgroundColor: '#e3e3e3',
          borderRadius: 0.5 * scale,
        }}
      />
      
      {/* Peso derecho */}
      <View
        style={{
          position: 'absolute',
          right: 0,
          width: 6 * scale,
          height: 8 * scale,
          backgroundColor: '#e3e3e3',
          borderRadius: 1 * scale,
        }}
      />
    </View>
  );
}
