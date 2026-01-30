import { IconSymbol } from '@/components/ui/icon-symbol';
import { Config } from '@/constants';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { GlobalStyles } from '@/styles/global';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type ProfileData = {
  name: string;
  birthDate: string;
  phoneNumber: string;
  gender: string;
  fitGoals: string[];
  email: string;
  createdAt: string;
  updatedAt: string;
  age: number;
};

type AuthData = {
  id: string;
  email: string;
  status: string;
  role: string;
  hasProfile: boolean;
  name: string;
};

const GOAL_MAPPING: Record<string, string> = {
  lose_weight: 'Perder peso',
  build_muscle: 'Ganar músculo',
  stay_fit: 'Mantenerse en forma',
  improve_endurance: 'Mejorar resistencia',
  reduce_stress: 'Reducir estrés',
  increase_flexibility: 'Aumentar flexibilidad'
};

const GENDER_MAPPING: Record<string, string> = {
  male: 'Masculino',
  female: 'Femenino',
  other: 'Otro',
  prefer_not_to_say: 'Prefiero no decirlo'
};

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;

      try {
        const headers = { Authorization: `Bearer ${user.token}` };

        const [profileRes, authRes] = await Promise.all([
          fetch(`${Config.apiUrl}/profiles/me`, { headers }),
          fetch(`${Config.apiUrl}/auth/me`, { headers }),
        ]);

        const profileJson = await profileRes.json();
        const authJson = await authRes.json();

        if (profileJson.success && profileJson.data) {
          setProfile(profileJson.data);
        }

        if (authJson.success && authJson.data) {
          setAuthData(authJson.data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token]);

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
      </View>
    );
  }

  const displayName = profile?.name || authData?.name || 'Usuario';
  const displayEmail = profile?.email || authData?.email || '';
  const displayPhone = profile?.phoneNumber || 'No registrado';
  const displayMobileInitial = displayName.charAt(0).toUpperCase();
  
  const displayGender = profile?.gender ? (GENDER_MAPPING[profile.gender] || profile.gender) : 'No especificado';
  const displayGoals = profile?.fitGoals?.map(goal => GOAL_MAPPING[goal] || goal).join(', ') || 'Sin objetivos definidos';
  const displayAge = profile?.age ? `${profile.age} años` : 'Edad desconocida';

  // TODO: Estos datos son estáticos por ahora. Conectar con endpoint de estadísticas cuando esté disponible.
  const stats = {
    workouts: 0,
    streak: 0,
    hours: '0h',
    weight: '--'
  };

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
                <Text style={styles.avatarText}>{displayMobileInitial}</Text>
              </View>
              <View style={styles.onlineBadge} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{displayName}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>✉️</Text>
                <Text style={styles.infoText}>{displayEmail}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📱</Text>
                <Text style={styles.infoText}>{displayPhone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileActions}>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Editar Perfil</Text>
            </Pressable>
            <Pressable style={styles.logoutButton} onPress={() => signOut()}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={Colors.error.DEFAULT} />
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏋️</Text>
            <Text style={styles.statValue}>{stats.workouts}</Text>
            <Text style={styles.statLabel}>Entrenamientos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Racha Días</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>{stats.hours}</Text>
            <Text style={styles.statLabel}>Total Horas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💪</Text>
            <Text style={styles.statValue}>{stats.weight}</Text>
            <Text style={styles.statLabel}>Peso Actual</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>👤</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuText}>Información Personal</Text>
                <Text style={styles.menuSubtext}>{displayAge} • {displayGender}</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🎯</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuText}>Objetivos Fitness</Text>
                <Text style={styles.menuSubtext} numberOfLines={1} ellipsizeMode="tail">
                  {displayGoals}
                </Text>
              </View>
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
  menuSubtext: {
    ...Typography.styles.small,
    color: Colors.text.muted,
    marginTop: 2,
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
