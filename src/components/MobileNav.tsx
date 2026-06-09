import React from 'react';
import { useApp } from '../context/AppContext';
import type { TabType } from '../types';
import './MobileNav.scss';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, notifications } = useApp();

  const items: { id: TabType; icon: React.ReactNode; label: string }[] = [
    {
      id: 'feed',
      label: 'Home',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    },
    {
      id: 'network',
      label: 'Network',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    },
    {
      id: 'notifications',
      label: 'Notifs',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
  ];

  return (
    <nav className="mobile-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`mobile-nav__item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <span className="mobile-nav__icon">
            {item.icon}
            {item.id === 'notifications' && notifications > 0 && (
              <span className="mobile-nav__badge">{notifications}</span>
            )}
          </span>
          <span className="mobile-nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};