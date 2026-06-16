import React from 'react';
import { useApp } from '../context/AppContext';
import auroraBg from '../assets/bg-aurora.mp4';
import './NotificationsPage.scss';

const typeIcon: Record<string, string> = {
  follow: '👤',
  like: '❤️',
  endorse: '⚡',
  verify: '✓',
  comment: '💬',
};

export const NotificationsPage: React.FC = () => {
  const { notificationList, markAllNotificationsRead } = useApp();

  return (
    <>
      {/* ── Aurora background (shared with FeedPage) ── */}
      <video
        className="feed-bg-video"
        src={auroraBg}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <div className="notif-page">
        {/* ── Header ── */}
        <div className="notif-header">
          <h2 className="text-display">Notifications</h2>
          <button className="btn btn--ghost btn--sm" onClick={markAllNotificationsRead}>
            Mark all read
          </button>
        </div>

        {/* ── List ── */}
        <div className="notif-list">
          {notificationList.map((n, i) => (
            <div
              key={n.id}
              className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}
              style={{ '--noti': i } as React.CSSProperties}
            >
              <div className="notif-item__avatar">
                {n.system ? (
                  <div className="notif-item__system-icon">
                    <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
                      <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" fill="url(#nGrad)" />
                      <path d="M10 16.5L14 20.5L22 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <defs>
                        <linearGradient id="nGrad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#4F46E5"/><stop offset="1" stopColor="#22D3EE"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                ) : (
                  <img src={n.avatar} alt={n.name} className="avatar avatar--sm" />
                )}
                <span className="notif-item__type-icon">{typeIcon[n.type]}</span>
              </div>
              <div className="notif-item__content">
                <p className="notif-item__text">
                  <strong>{n.name}</strong> {n.action}
                </p>
                <span className="notif-item__time text-xs text-muted">{n.time}</span>
              </div>
              {!n.read && <div className="notif-item__dot" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
