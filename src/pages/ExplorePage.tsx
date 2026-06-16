import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { users as allUsers } from '../data/mockData';
import auroraBg from '../assets/bg-aurora.mp4';
import './ExplorePage.scss';

export const ExplorePage: React.FC = () => {
  const { setViewingUserId, setActiveTab, followedUserIds, toggleFollowUser } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'verified' | 'engineers' | 'designers'>('all');

  const displayed = [...allUsers].filter(u => {
    const matchQ = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.title.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === 'all' ? true :
      filter === 'verified' ? u.verified :
      filter === 'engineers' ? u.title.toLowerCase().includes('engineer') :
      u.title.toLowerCase().includes('design');
    return matchQ && matchF;
  });

  const handleView = (id: string) => {
    setViewingUserId(id);
    setActiveTab('profile');
  };

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

      <div className="explore-page">
        {/* ── Search ── */}
        <div className="explore-search">
          <div className="explore-search__input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="explore-search__icon">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by name, title, or skill..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="explore-search__input"
            />
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="explore-filters">
          {(['all', 'verified', 'engineers', 'designers'] as const).map(f => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '✦ All' :
               f === 'verified' ? '✓ Verified' :
               f === 'engineers' ? '⚡ Engineers' : '🎨 Designers'}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        <div className="explore-grid">
          {displayed.map((user, i) => (
            <div
              key={user.id}
              className="people-card"
              style={{ '--ci': i } as React.CSSProperties}
              onClick={() => handleView(user.id)}
            >
              <div className="people-card__bg" />
              <div className="people-card__header">
                <img src={user.avatar} alt={user.name} className="avatar avatar--lg" />
                {user.verified && (
                  <div className="people-card__verified">
                    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                      <path d="M8 1L10 3H13V6L15 8L13 10V13H10L8 15L6 13H3V10L1 8L3 6V3H6L8 1Z" fill="#22D3EE" opacity="0.2"/>
                      <path d="M8 1L10 3H13V6L15 8L13 10V13H10L8 15L6 13H3V10L1 8L3 6V3H6L8 1Z" stroke="#22D3EE" strokeWidth="1.2"/>
                      <path d="M5.5 8L7 9.5L10.5 6" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="people-card__info">
                <h3 className="people-card__name text-display">{user.name}</h3>
                <p className="people-card__title">{user.title}</p>
                <p className="people-card__location">{user.location}</p>
              </div>
              <div className="people-card__skills">
                {user.skills.slice(0, 3).map(s => (
                  <span key={s.id} className="tag">{s.name}</span>
                ))}
              </div>
              <div className="people-card__footer">
                <div className="people-card__stat">
                  <strong>{user.followers.toLocaleString()}</strong> followers
                </div>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={e => {
                    e.stopPropagation();
                    toggleFollowUser(user.id);
                  }}
                >
                  {followedUserIds.includes(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          ))}
          {displayed.length === 0 && (
            <div className="explore-empty">
              <p>No profiles match your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
