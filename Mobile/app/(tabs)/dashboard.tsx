import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/primary-button';

export default function DashboardScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon} />
            <Text style={styles.brandText}>AthletIA</Text>
          </View>
          <View style={styles.bellWrapper}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.bellDot} />
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityTop}>
            <View>
              <Text style={styles.cardLabel}>WEEKLY ACTIVITY</Text>
              <Text style={styles.activityValue}>8.4 hrs</Text>
            </View>
            <View style={styles.trendPill}>
              <Text style={styles.trendIcon}>↗</Text>
              <Text style={styles.trendText}>12%</Text>
            </View>
          </View>
          <View style={styles.chartArea}>
            <View style={styles.chartLine} />
            <View style={styles.chartDays}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => (
                <Text key={`${d}-${index}`} style={styles.dayLabel}>
                  {d}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, styles.statIconCheck]}>
              <Text style={styles.statIconText}>✓</Text>
            </View>
            <Text style={styles.statLabel}>Workouts Completed</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrapper, styles.statIconFire]}>
              <Text style={styles.statIconText}>🔥</Text>
            </View>
            <Text style={styles.statLabel}>Calories Burned</Text>
            <Text style={styles.statValue}>4,250</Text>
          </View>
        </View>

        <View style={styles.workoutCard}>
          <View style={styles.workoutBadgeRow}>
            <Text style={styles.workoutBadge}>TODAY'S WORKOUT</Text>
          </View>
          <Text style={styles.workoutTitle}>Full Body HIIT</Text>
          <View style={styles.workoutMetaRow}>
            <Text style={styles.workoutMeta}>⏱ 45 min</Text>
            <Text style={styles.workoutMeta}>⚡ Intermediate</Text>
          </View>
          <PrimaryButton label="Start Routine" onPress={() => {}} style={styles.workoutButton} />
        </View>
      </ScrollView>

      <View style={styles.fab}>
        <Text style={styles.fabIcon}>✧</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a',
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
  statIconText: {
    color: '#06b6d4',
    fontWeight: '800',
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
  workoutCard: {
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
  workoutBadgeRow: {
    flexDirection: 'row',
  },
  workoutBadge: {
    backgroundColor: 'rgba(6,182,212,0.2)',
    color: '#06b6d4',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    letterSpacing: 1,
  },
  workoutTitle: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 10,
  },
  workoutMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  workoutMeta: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  workoutButton: {
    borderRadius: 18,
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.4)',
    shadowColor: '#06b6d4',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  fabIcon: {
    color: '#06b6d4',
    fontSize: 22,
    fontWeight: '800',
  },
});
