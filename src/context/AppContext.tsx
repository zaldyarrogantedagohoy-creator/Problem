import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Post, TabType } from '../types';
import { currentUser as mockCurrentUser, posts as mockPosts, users as mockUsers } from '../data/mockData';

interface AppContextType {
  currentUser: User;
  posts: Post[];
  users: User[];
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  viewingUserId: string | null;
  setViewingUserId: (id: string | null) => void;
  toggleLike: (postId: string) => void;
  showVerifyModal: boolean;
  setShowVerifyModal: (show: boolean) => void;
  showEditProfile: boolean;
  setShowEditProfile: (show: boolean) => void;
  notifications: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  return (
    <AppContext.Provider value={{
      currentUser: mockCurrentUser,
      posts,
      users: mockUsers,
      activeTab,
      setActiveTab,
      viewingUserId,
      setViewingUserId,
      toggleLike,
      showVerifyModal,
      setShowVerifyModal,
      showEditProfile,
      setShowEditProfile,
      notifications: 5,
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