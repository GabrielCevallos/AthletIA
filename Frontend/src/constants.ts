import { User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'Trainer',
    age: 29,
    status: 'Active',
    lastAccess: 'Today, 10:23 AM'
  },
  {
    id: '2',
    name: 'Mike Ross',
    email: 'mike.ross@example.com',
    role: 'Member',
    age: 34,
    status: 'Inactive',
    lastAccess: 'Oct 24, 2023'
  },
  {
    id: '3',
    name: 'Elena Fisher',
    email: 'elena.fish@example.com',
    role: 'Member',
    age: 24,
    status: 'Suspended',
    lastAccess: 'Never'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Trainer',
    age: 31,
    status: 'Active',
    lastAccess: 'Yesterday, 4:15 PM'
  }
];