import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DumbbellIcon } from '@/components/ui/dumbbell-icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Config } from '@/constants';
import { useAuth } from '@/context/auth-context';
import { useRoutines } from '@/hooks/use-routines';
import { useSplits } from '@/hooks/use-splits';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

type MeasurementData = {
  weight: number;
  updatedAt: string;
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { splits, fetchSplits, loading: splitsLoading } = useSplits();
  const { routines, refetch: fetchRoutines, loading: routinesLoading } = useRoutines();

  const [userName, setUserName] = useState<string>('Usuario');
  const [measurement, setMeasurement] = useState<MeasurementData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 19) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user?.token) return;

      try {
        const [profileRes, measurementRes] = await Promise.all([
          fetch(`${Config.apiUrl}/profiles/me`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch(`${Config.apiUrl}/measurements/me`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success && profileData.data?.name) {
            setUserName(profileData.data.name);
          }
        }

        if (measurementRes.ok) {
          const measurementData = await measurementRes.json();
          if (measurementData.success && measurementData.data) {
            setMeasurement({
              weight: measurementData.data.weight,
              updatedAt: measurementData.data.updatedAt,
            });
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    void loadData();
    void fetchSplits();
    void fetchRoutines();
  }, [user?.token]);

  const activeSplits = splits.filter((s) => s.active).length;
  const totalRoutines = routines.length;
  const lastWeight = measurement?.weight || null;

  const isLoading = profileLoading || splitsLoading || routinesLoading;

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <DumbbellIcon size={24} />
            <Text style={styles.brandText}>AthletIA</Text>
          </View>
        </View>

        {/* Saludo personalizado */}
        <View style={styles.greetingCard}>
          <Text style={styles.greetingText}>
            {getGreeting()}, <Text style={styles.greetingName}>{userName}</Text>! 💪
          </Text>
          <Text style={styles.greetingSubtext}>¿Listo para entrenar hoy?</Text>
        </View>

        {/* Estadísticas reales */}
        <View style={styles.statsGrid}>
          <Pressable style={styles.statCard} onPress={() => router.push('/(tabs)/routines')}>
            <View style={[styles.statIconWrapper, styles.statIconCheck]}>
              <Text style={styles.statIconText}>🏋️</Text>
            </View>
            <Text style={styles.statLabel}>Mis Rutinas</Text>
            <Text style={styles.statValue}>{totalRoutines}</Text>
          </Pressable>
          <Pressable style={styles.statCard} onPress={() => router.push('/(tabs)/splits')}>
            <View style={[styles.statIconWrapper, styles.statIconFire]}>
              <Text style={styles.statIconText}>📋</Text>
            </View>
            <Text style={styles.statLabel}>Splits Activos</Text>
            <Text style={styles.statValue}>{activeSplits}</Text>
          </Pressable>
          <Pressable style={styles.statCard} onPress={() => router.push('/measurements')}>
            <View style={[styles.statIconWrapper, styles.statIconWeight]}>
              <Text style={styles.statIconText}>⚖️</Text>
            </View>
            <Text style={styles.statLabel}>Último Peso</Text>
            <Text style={styles.statValue}>{lastWeight ? `${lastWeight}kg` : '--'}</Text>
          </Pressable>
        </View>

        {/* Acción principal */}
        <View style={styles.actionCard}>
          {activeSplits > 0 ? (
            <>
              <Text style={styles.actionBadge}>ACCIÓN RÁPIDA</Text>
              <Text style={styles.actionTitle}>Continuar entrenamiento</Text>
              <Text style={styles.actionSubtext}>
                Tienes {activeSplits} split{activeSplits > 1 ? 's' : ''} activo{activeSplits > 1 ? 's' : ''}
              </Text>
              <PrimaryButton
                label="Ver mis Splits"
                onPress={() => router.push('/(tabs)/splits')}
                style={styles.actionButton}
              />
            </>
          ) : (
            <>
              <Text style={styles.actionBadge}>COMIENZA AHORA</Text>
              <Text style={styles.actionTitle}>Crea tu primer split</Text>
              <Text style={styles.actionSubtext}>
                Organiza tus rutinas y alcanza tus objetivos
              </Text>
              <PrimaryButton
                label="Crear Split"
                onPress={() => router.push('/create-split')}
                style={styles.actionButton}
              />
            </>
          )}
        </View>

        {/* Accesos rápidos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accesos rápidos</Text>
          <View style={styles.quickAccessGrid}>
            <Pressable style={styles.quickAccessCard} onPress={() => router.push('/measurements')}>
              <Text style={styles.quickAccessIcon}>📊</Text>
              <Text style={styles.quickAccessLabel}>Medidas</Text>
            </Pressable>
            <Pressable style={styles.quickAccessCard} onPress={() => router.push('/(tabs)/routines')}>
              <Text style={styles.quickAccessIcon}>🏋️</Text>
              <Text style={styles.quickAccessLabel}>Rutinas</Text>
            </Pressable>
            <Pressable style={styles.quickAccessCard} onPress={() => router.push('/(tabs)/splits')}>
              <Text style={styles.quickAccessIcon}>📋</Text>
              <Text style={styles.quickAccessLabel}>Splits</Text>
            </Pressable>
            <Pressable style={styles.quickAccessCard} onPress={() => router.push('/(tabs)/exercises')}>
              <Text style={styles.quickAccessIcon}>💪</Text>
              <Text style={styles.quickAccessLabel}>Ejercicios</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 120,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#06b6d4',
  },
  brandText: {
    color: '#e2e8f0',
    fontSize: 22,
    fontWeight: '800',
  },
  bellWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    color: '#cbd5e1',
    fontSize: 20,
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#06b6d4',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  activityCard: {
    backgroundColor: '#1f2937',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  activityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  activityValue: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6,182,212,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendIcon: {
    color: '#06b6d4',
    fontWeight: '800',
  },
  trendText: {
    color: '#06b6d4',
    fontWeight: '700',
  },
  chartArea: {
    height: 180,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
    padding: 12,
    justifyContent: 'flex-end',
  },
  chartLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 20,
    bottom: 26,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#06b6d4',
    opacity: 0.65,
  },
  chartDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  dayLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 6,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statIconCheck: {
    backgroundColor: 'rgba(6,182,212,0.15)',
  },
  statIconFire: {
    backgroundColor: 'rgba(249,115,22,0.15)',
  },
  statIconWeight: {
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  statIconText: {
    fontSize: 18,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
  },
  greetingCard: {
    backgroundColor: 'rgba(6,182,212,0.08)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.3)',
  },
  greetingText: {
    color: '#e2e8f0',
    fontSize: 24,
    fontWeight: '700',
  },
  greetingName: {
    color: '#06b6d4',
    fontWeight: '800',
  },
  greetingSubtext: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  actionCard: {
    backgroundColor: 'rgba(30,41,59,0.95)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  actionBadge: {
    backgroundColor: 'rgba(6,182,212,0.2)',
    color: '#06b6d4',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    letterSpacing: 1,
    alignSelf: 'flex-start',
  },
  actionTitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 10,
  },
  actionSubtext: {
    color: '#cbd5e1',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 18,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '700',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessCard: {
    width: '47.5%',
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    gap: 8,
  },
  quickAccessIcon: {
    fontSize: 32,
  },
  quickAccessLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
  },
});
