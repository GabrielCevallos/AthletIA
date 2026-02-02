import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useSplits } from '@/hooks/use-splits';
import { GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const DAY_MAP: { [key: string]: number } = {
  'Monday': 0,
  'Tuesday': 1,
  'Wednesday': 2,
  'Thursday': 3,
  'Friday': 4,
  'Saturday': 5,
  'Sunday': 6,
};

export default function SplitsTabScreen() {
  const router = useRouter();
  const { splits, loading, refresh, deleteSplit } = useSplits();

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleDeleteSplit = (splitId: string, splitName: string) => {
    Alert.alert(
      'Eliminar Split',
      `¿Estás seguro de que deseas eliminar "${splitName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteSplit(splitId);
            if (success) {
              Alert.alert('Éxito', 'Split eliminado exitosamente');
            } else {
              Alert.alert('Error', 'No se pudo eliminar el split');
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (splitId: string) => {
    router.push(`/split-detail/${splitId}`);
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mis Splits</Text>
          <Text style={styles.subtitle}>Gestiona tus planes de entrenamiento</Text>
        </View>
        <Pressable style={styles.notificationButton}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
      >
        {loading && splits.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary.DEFAULT} />
            <Text style={styles.loadingText}>Cargando splits...</Text>
          </View>
        ) : splits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No tienes splits</Text>
            <Text style={styles.emptyText}>Crea tu primer plan de entrenamiento</Text>
          </View>
        ) : (
          splits.map((split) => {
            const activeDays = split.trainingDays.map(day => DAY_MAP[day] || 0);
            const frequency = `${split.trainingDays.length} ${split.trainingDays.length === 1 ? 'día' : 'días'} / semana`;
            
            return (
              <Pressable 
                key={split.id} 
                style={styles.splitCard}
                onLongPress={() => handleDeleteSplit(split.id, split.name)}
              >
                <View style={styles.splitInfo}>
                  <Text style={styles.splitName}>{split.name}</Text>
                  <Text style={styles.splitFrequency}>{frequency}</Text>
                  {split.description && (
                    <Text style={styles.splitDescription} numberOfLines={2}>
                      {split.description}
                    </Text>
                  )}
                </View>

                {/* Days Grid */}
                <View style={styles.daysContainer}>
                  <View style={styles.daysGrid}>
                    {DAYS.map((day, index) => (
                      <View
                        key={index}
                        style={[styles.dayBox, activeDays.includes(index) && styles.dayBoxActive]}
                      >
                        <Text
                          style={[styles.dayText, activeDays.includes(index) && styles.dayTextActive]}
                        >
                          {day}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  <Pressable 
                    style={styles.viewButton}
                    onPress={() => handleViewDetails(split.id)}
                  >
                    <Text style={styles.viewButtonText}>Ver Detalles</Text>
                  </Pressable>
                  <Pressable 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteSplit(split.id, split.name)}
                  >
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })
        )}

        {/* Add New Split Button */}
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/create-split')}
        >
          <IconSymbol size={32} name="plus" color={Colors.primary.DEFAULT} />
          <Text style={styles.addText}>Crear Nuevo Split</Text>
        </Pressable>
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
    paddingHorizontal: Spacing['3xl'],
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['3xl'],
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.styles.h2,
  },
  subtitle: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    fontSize: Typography.fontSize.lg,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error.DEFAULT,
    borderWidth: 2,
    borderColor: Colors.background.DEFAULT,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.base,
    gap: Spacing.base,
    paddingBottom: Spacing['6xl'],
  },
  splitCard: {
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.base,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    position: 'relative',
    gap: Spacing.base,
  },
  splitInfo: {
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  splitName: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
  },
  splitFrequency: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
  },
  splitDescription: {
    ...Typography.styles.small,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  daysContainer: {
    gap: Spacing.sm,
  },
  daysGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  dayBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBoxActive: {
    backgroundColor: Colors.primary.DEFAULT,
    ...Shadows.cyan,
  },
  dayText: {
    ...Typography.styles.tiny,
    color: Colors.text.muted,
    fontWeight: Typography.fontWeight.bold,
  },
  dayTextActive: {
    color: Colors.text.primary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  viewButton: {
    flex: 1,
    backgroundColor: Colors.background.DEFAULT,
    borderWidth: 1,
    borderColor: Colors.border.DEFAULT,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  viewButtonText: {
    ...Typography.styles.bodyBold,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.error.DEFAULT,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  deleteButtonText: {
    ...Typography.styles.bodyBold,
    fontSize: Typography.fontSize.sm,
    color: Colors.background.DEFAULT,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    gap: Spacing.base,
  },
  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    gap: Spacing.base,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    ...Typography.styles.h3,
    color: Colors.text.tertiary,
  },
  emptyText: {
    ...Typography.styles.body,
    color: Colors.text.muted,
  },
  addButton: {
    borderWidth: 2,
    borderColor: Colors.primary.DEFAULT,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.base,
    gap: Spacing.sm,
  },
  addText: {
    ...Typography.styles.bodyBold,
    color: Colors.primary.DEFAULT,
  },
});
