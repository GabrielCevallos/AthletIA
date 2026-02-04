import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useNotifications } from '@/context/notification-context';
import { NotificationItem } from '@/services/notifications-api';
import { GlobalStyles } from '@/styles/global';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const NotificationCard = ({
  item,
  onPress,
}: {
  item: NotificationItem;
  onPress: () => void;
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'checkmark.circle.fill';
      case 'warning':
        return 'exclamationmark.triangle.fill';
      case 'error':
        return 'xmark.circle.fill';
      default:
        return 'info.circle.fill';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return Colors.success.DEFAULT;
      case 'warning':
        return Colors.warning.DEFAULT;
      case 'error':
        return Colors.error.DEFAULT;
      default:
        return Colors.primary.DEFAULT;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Si es menos de 24 horas
    if (diff < 24 * 60 * 60 * 1000) {
        if (diff < 60 * 60 * 1000) {
            const minutes = Math.floor(diff / (60 * 1000));
            return `Hace ${minutes} min`;
        }
        const hours = Math.floor(diff / (60 * 60 * 1000));
        return `Hace ${hours} h`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <Pressable
      style={[
        styles.card,
        !item.isRead && styles.unreadCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.cardIconContainer}>
        <IconSymbol
          name={getIcon(item.type) as any}
          size={24}
          color={getColor(item.type)}
        />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, !item.isRead && styles.unreadText]}>
            {item.title}
          </Text>
          <Text style={styles.cardTime}>{formatDate(item.createdAt)}</Text>
        </View>
        <Text style={styles.cardMessage} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </Pressable>
  );
};

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    notifications,
    loading,
    refreshNotifications,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    hasMore,
  } = useNotifications();

  // Marcar como leída al interactuar con ella
  const handlePressNotification = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
    // Aquí podriamos navegar a algún detalle si el payload "data" tiene info
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={Colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <Pressable onPress={() => markAllAsRead()} style={styles.readAllButton}>
          <IconSymbol name="checkmark.circle" size={20} color={Colors.primary.DEFAULT} />
        </Pressable>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard item={item} onPress={() => handlePressNotification(item)} />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshNotifications} colors={[Colors.primary.DEFAULT]} />
        }
        onEndReached={loadMoreNotifications}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
            hasMore && !loading ? <ActivityIndicator style={{ padding: 20 }} color={Colors.primary.DEFAULT} /> : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <IconSymbol name="bell.slash" size={48} color={Colors.text.tertiary} />
              <Text style={styles.emptyText}>No tienes notificaciones</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.container,
    backgroundColor: Colors.background.DEFAULT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl + Spacing.base, // Status bar offset
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    backgroundColor: Colors.surface.DEFAULT,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    ...Typography.styles.h3,
    fontSize: Typography.fontSize.lg,
  },
  readAllButton: {
    padding: Spacing.sm,
  },
  listContent: {
    padding: Spacing.base,
    gap: Spacing.sm,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    padding: Spacing.base,
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.lg,
    alignItems: 'flex-start',
    gap: Spacing.sm,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unreadCard: {
    backgroundColor: Colors.surface.elevated,
    borderColor: Colors.primary.light,
  },
  cardIconContainer: {
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    ...Typography.styles.body,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  unreadText: {
    color: Colors.primary.DEFAULT,
  },
  cardTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  cardMessage: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.DEFAULT,
    marginTop: 6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: Spacing.base,
  },
  emptyText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
});
