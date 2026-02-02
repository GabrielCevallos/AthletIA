import { Stack } from 'expo-router';

export default function ExerciseDetailLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Detalles del Ejercicio',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
