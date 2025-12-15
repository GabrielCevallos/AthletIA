export type UserStatus = 'Active' | 'Inactive' | 'Suspended';
export type UserRole = 'Trainer' | 'Member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age: number;
  status: UserStatus;
  lastAccess: string;
}

export interface NavItem {
  label: string;
  icon: string;
  isActive?: boolean;
  href: string;
}