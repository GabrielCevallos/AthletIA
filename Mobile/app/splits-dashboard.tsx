// Este archivo ha sido reemplazado por (tabs)/splits.tsx
// Se mantiene aquí como referencia pero no se utiliza en la navegación

import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function SplitsDashboardScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a la pantalla de splits en las tabs
    router.replace('/(tabs)/splits');
  }, [router]);

  return null;
}
