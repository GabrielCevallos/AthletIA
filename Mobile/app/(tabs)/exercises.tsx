import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { GlobalStyles } from '@/styles/global';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const EXERCISE_CATEGORIES = [
  { id: 'chest', label: 'Pecho' },
  { id: 'back', label: 'Espalda' },
  { id: 'legs', label: 'Piernas' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'arms', label: 'Brazos' },
];

const EXERCISES = [
  {
    id: '1',
    name: 'Press de Banca',
    category: 'chest',
    level: 'Intermedio',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Aperturas con Mancuernas',
    category: 'chest',
    level: 'Principiante',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Flexiones',
    category: 'chest',
    level: 'Principiante',
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'Remo con Barra',
    category: 'back',
    level: 'Intermedio',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=200&h=200&fit=crop',
  },
  {
    id: '5',
    name: 'Dominadas',
    category: 'back',
    level: 'Avanzado',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=200&h=200&fit=crop',
  },
];

export default function ExercisesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('chest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = EXERCISES.filter(
    (exercise) =>
      exercise.category === selectedCategory &&
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Biblioteca de Ejercicios</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ejercicios..."
            placeholderTextColor={Colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScroll}
      >
        {EXERCISE_CATEGORIES.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryPill,
              selectedCategory === category.id && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Exercise List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.exerciseList}>
          {filteredExercises.map((exercise) => (
            <Pressable key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseImage}>
                <Image
                  source={{ uri: exercise.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseMeta}>
                  {EXERCISE_CATEGORIES.find((c) => c.id === exercise.category)?.label} •{' '}
                  {exercise.level}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.DEFAULT,
    gap: Spacing.base,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...Typography.styles.h2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchIcon: {
    fontSize: Typography.fontSize.lg,
  },
  searchInput: {
    flex: 1,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    marginRight: Spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary.DEFAULT,
  },
  categoryText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.muted,
  },
  categoryTextActive: {
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  exerciseList: {
    padding: Spacing.base,
    gap: Spacing.md,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.DEFAULT,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  exerciseImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.DEFAULT,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  exerciseInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  exerciseName: {
    ...Typography.styles.h4,
    fontSize: Typography.fontSize.lg,
  },
  exerciseMeta: {
    ...Typography.styles.small,
    color: Colors.text.muted,
  },
  chevron: {
    fontSize: Typography.fontSize['2xl'],
    color: Colors.text.muted,
  },
});
