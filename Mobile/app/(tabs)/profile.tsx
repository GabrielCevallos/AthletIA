import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>💪</Text>
          <Text style={styles.headerTitle}>AthletIA</Text>
        </View>
        <Pressable style={styles.notificationButton}>
          <Text style={styles.bellIcon}>🔔</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatarContainer}>
              <View style={styles.profileAvatar}>
                <Text style={styles.avatarText}>J</Text>
              </View>
              <View style={styles.onlineBadge} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>JGraso</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>✉️</Text>
                <Text style={styles.infoText}>admin.jgraso@email.com</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📱</Text>
                <Text style={styles.infoText}>0000000000</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileActions}>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Editar Perfil</Text>
            </Pressable>
            <Pressable style={styles.logoutButton}>
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏋️</Text>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Entrenamientos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Racha Días</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>18.5h</Text>
            <Text style={styles.statLabel}>Total Horas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💪</Text>
            <Text style={styles.statValue}>75kg</Text>
            <Text style={styles.statLabel}>Peso Actual</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={styles.menuText}>Información Personal</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🎯</Text>
              <Text style={styles.menuText}>Objetivos Fitness</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={styles.menuText}>Medidas y Progreso</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={styles.menuText}>Notificaciones</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>❓</Text>
              <Text style={styles.menuText}>Ayuda y Soporte</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...GlobalStyles.container,
  },
  header: {
    backgroundColor: Colors.background.DEFAULT,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerIcon: {
    fontSize: Typography.fontSize['4xl'],
    color: Colors.primary.DEFAULT,
  },
  headerTitle: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.xl,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: Typography.fontSize.xl,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.base,
    gap: Spacing.xl,
  },
  profileCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing['3xl'],
    ...Shadows.base,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing['3xl'],
  },
  profileAvatarContainer: {
    position: 'relative',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.background.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.DEFAULT,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success.DEFAULT,
    borderWidth: 4,
    borderColor: Colors.surface.DEFAULT,
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  profileName: {
    ...Typography.styles.h2,
    fontSize: Typography.fontSize['2xl'],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoIcon: {
    fontSize: Typography.fontSize.sm,
  },
  infoText: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  profileActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Colors.primary.DEFAULT,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...Typography.styles.bodyBold,
    color: Colors.background.DEFAULT,
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: `${Colors.error.DEFAULT}4D`,
    backgroundColor: `${Colors.error.DEFAULT}1A`,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  logoutIcon: {
    fontSize: Typography.fontSize.base,
  },
  logoutText: {
    ...Typography.styles.body,
    color: Colors.error.DEFAULT,
    fontWeight: Typography.fontWeight.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  statIcon: {
    fontSize: Typography.fontSize['2xl'],
  },
  statValue: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize['2xl'],
  },
  statLabel: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  section: {
    gap: Spacing.base,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
    marginBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface.DEFAULT,
    padding: Spacing.base,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIcon: {
    fontSize: Typography.fontSize.xl,
  },
  menuText: {
    ...Typography.styles.body,
    fontWeight: Typography.fontWeight.medium,
  },
  chevron: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.text.muted,
  },
});
