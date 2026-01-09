import { User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'user',
    age: 29,
    state: 'ACTIVE',
    lastAccess: 'Today, 10:23 AM'
  },
  {
    id: '2',
    name: 'Mike Ross',
    email: 'mike.ross@example.com',
    role: 'user',
    age: 34,
    state: 'ACTIVE',
    lastAccess: 'Oct 24, 2023'
  },
  {
    id: '3',
    name: 'Elena Fisher',
    email: 'elena.fish@example.com',
    role: 'user',
    age: 24,
    state: 'SUSPENDED',
    lastAccess: 'Never'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'user',
    age: 31,
    state: 'ACTIVE',
    lastAccess: 'Yesterday, 4:15 PM'
  }
];