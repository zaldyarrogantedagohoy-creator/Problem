import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { MobileNav } from './components/MobileNav';
import { VerifyModal } from './components/VerifyModal';
import { EditProfileModal } from './components/EditProfileModal';
import { FeedPage } from './pages/FeedPage';
import { ExplorePage } from './pages/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';
import { NetworkPage } from './pages/NetworkPage';
import { NotificationsPage } from './pages/NotificationsPage';
import './styles/globals.scss';

const AppContent: React.FC = () => {
  const { activeTab, showVerifyModal, showEditProfile } = useApp();

  const showRightPanel = ['feed', 'explore'].includes(activeTab);

  return (
    <>
      <div className="app-bg" />

      <div className="app-layout">
        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <main className="main-content">
          {activeTab === 'feed' && <FeedPage />}
          {activeTab === 'explore' && <ExplorePage />}
          {activeTab === 'profile' && <ProfilePage />}
          {activeTab === 'network' && <NetworkPage />}
          {activeTab === 'notifications' && <NotificationsPage />}
        </main>

        {/* Right panel */}
        {showRightPanel && <RightPanel />}
      </div>

      {/* Mobile nav */}
      <MobileNav />

      {/* Modals */}
      {showVerifyModal && <VerifyModal />}
      {showEditProfile && <EditProfileModal />}
    </>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;