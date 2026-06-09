import React from 'react';
import { useApp } from '../context/AppContext';
import type { TabType } from '../types';
import './Sidebar.scss';

const NavIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactNode> = {
    feed: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    explore: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    profile: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    network: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    notifications: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  };
  return <span className="nav-icon">{icons[type]}</span>;
};

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, notifications } = useApp();

  const navItems: { id: TabType; label: string }[] = [
    { id: 'feed', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'network', label: 'Network' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'profile', label: 'My Profile' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-mark">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" fill="url(#logoGrad)" />
            <path d="M10 16.5L14 20.5L22 12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="logoGrad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F46E5"/>
                <stop offset="1" stopColor="#22D3EE"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="sidebar__brand">Portfol<span>.io</span></span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar__nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <NavIcon type={item.id} />
            <span className="nav-label">{item.label}</span>
            {item.id === 'notifications' && notifications > 0 && (
              <span className="notif-badge">{notifications}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar__user-card">
        <img src={currentUser.avatar} alt={currentUser.name} className="avatar avatar--md" />
        <div className="sidebar__user-info">
          <span className="sidebar__user-name">
            {currentUser.name}
            {currentUser.verified && (
              <span className="verified-icon" title="Verified">
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M8 1L10 3H13V6L15 8L13 10V13H10L8 15L6 13H3V10L1 8L3 6V3H6L8 1Z" fill="#22D3EE" opacity="0.2"/>
                  <path d="M8 1L10 3H13V6L15 8L13 10V13H10L8 15L6 13H3V10L1 8L3 6V3H6L8 1Z" stroke="#22D3EE" strokeWidth="1.2"/>
                  <path d="M5.5 8L7 9.5L10.5 6" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </span>
          <span className="sidebar__user-handle">@{currentUser.username}</span>
        </div>
      </div>
    </aside>
  );
};