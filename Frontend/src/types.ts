export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type UserRole = 'user' | 'admin' | 'moderator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum RoutineGoal {
  WEIGHT_LOSS = 'weight_loss',
  MUSCLE_GAIN = 'muscle_gain',
  WEIGHT_MAINTENANCE = 'weight_maintenance',
  ENDURANCE = 'endurance',
  FLEXIBILITY = 'flexibility',
  GENERAL_FITNESS = 'general_fitness',
  REHABILITATION = 'rehabilitation',
  IMPROVED_POSTURE = 'improved_posture',
  BALANCE_AND_COORDINATION = 'balance_and_coordination',
  CARDIOVASCULAR_HEALTH = 'cardiovascular_health',
  STRENGTH_TRAINING = 'strength_training',
  ATHLETIC_PERFORMANCE = 'athletic_performance',
  LIFESTYLE_ENHANCEMENT = 'lifestyle_enhancement',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age: number;
  state: UserStatus;
  lastAccess: string;
}

export interface NavItem {
  label: string;
  icon: string;
  isActive?: boolean;
  href: string;
}