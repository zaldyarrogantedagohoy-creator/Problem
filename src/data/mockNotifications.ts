import type { AppNotification } from '../types';

export const mockNotifications: AppNotification[] = [
  { id: 'n1', type: 'follow', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=c0aede', name: 'Priya Sharma', action: 'started following you', time: '2m ago', read: false },
  { id: 'n2', type: 'like', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=d1d4f9', name: 'Marcus Chen', action: 'liked your post about OpenGraph Studio', time: '1h ago', read: false },
  { id: 'n3', type: 'endorse', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=ffd5dc', name: 'Sofia Andres', action: 'endorsed your TypeScript skill', time: '3h ago', read: false },
  { id: 'n4', type: 'verify', avatar: '', name: 'Portfol.io', action: 'Your GitHub account has been verified ✓', time: '1d ago', read: true, system: true },
  { id: 'n5', type: 'comment', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=b6e3f4', name: 'James Park', action: 'commented on your project: "This is brilliant!"', time: '1d ago', read: true },
  { id: 'n6', type: 'verify', avatar: '', name: 'Portfol.io', action: 'Your LinkedIn profile has been verified ✓', time: '2d ago', read: true, system: true },
];
