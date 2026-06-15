import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Post, TabType, AppNotification } from '../types';
import { currentUser as mockCurrentUser, posts as mockPosts, users as mockUsers } from '../data/mockData';
import { mockNotifications } from '../data/mockNotifications';

interface AppContextType {
  currentUser: User;
  posts: Post[];
  users: User[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  viewingUserId: string | null;
  setViewingUserId: (id: string | null) => void;
  toggleLike: (postId: string) => void;
  addPost: (content: string, type: Post['type']) => void;
  followedUserIds: string[];
  toggleFollowUser: (userId: string) => void;
  showVerifyModal: boolean;
  setShowVerifyModal: (show: boolean) => void;
  showEditProfile: boolean;
  setShowEditProfile: (show: boolean) => void;
  notifications: number;
  notificationList: AppNotification[];
  markAllNotificationsRead: () => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);

  const logout = () => {
    setActiveTab('landing');
    setViewingUserId(null);
    setShowVerifyModal(false);
    setShowEditProfile(false);
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const addPost = (content: string, type: Post['type']) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      content,
      type,
      likes: 0,
      comments: 0,
      reposts: 0,
      liked: false,
      createdAt: 'Just now',
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const toggleFollowUser = (userId: string) => {
    if (userId === currentUser.id) return;

    setFollowedUserIds(prev => {
      const alreadyFollowing = prev.includes(userId);

      setUsers(prevUsers => prevUsers.map(user => (
        user.id === userId
          ? { ...user, followers: user.followers + (alreadyFollowing ? -1 : 1) }
          : user
      )));

      setCurrentUser(prev => ({
        ...prev,
        following: prev.following + (alreadyFollowing ? -1 : 1),
      }));

      return alreadyFollowing ? prev.filter(id => id !== userId) : [...prev, userId];
    });
  };

  const updateCurrentUserProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      const next = { ...prev, ...updates };
      setPosts(prevPosts => prevPosts.map(post => (
        post.userId === prev.id ? { ...post, user: next } : post
      )));
      return next;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      currentUser,
      posts,
      users,
      activeTab,
      setActiveTab,
      viewingUserId,
      setViewingUserId,
      toggleLike,
      addPost,
      followedUserIds,
      toggleFollowUser,
      showVerifyModal,
      setShowVerifyModal,
      showEditProfile,
      setShowEditProfile,
      notifications: unreadNotificationCount,
      notificationList: notifications,
      markAllNotificationsRead,
      updateCurrentUserProfile,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};