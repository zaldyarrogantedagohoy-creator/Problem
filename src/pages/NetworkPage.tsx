import React from 'react';
import { useApp } from '../context/AppContext';
import { users } from '../data/mockData';
import './NetworkPage.scss';

export const NetworkPage: React.FC = () => {
  const { setViewingUserId, setActiveTab } = useApp();

  return (
    <div className="network-page">
      <div className="network-section">
        <h2 className="network-section__title text-display">People You May Know</h2>
        <div className="network-list">
          {users.map(user => (
            <div key={user.id} className="network-card card card--hover">
              <img src={user.avatar} alt={user.name} className="avatar avatar--md" />
              <div className="network-card__info">
                <div className="network-card__name">
                  {user.name}
                  {user.verified && (
                    <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                      <path d="M8 1L10 3H13V6L15 8L13 10V13H10L8 15L6 13H3V10L1 8L3 6V3H6L8 1Z" stroke="#22D3EE" strokeWidth="1.2"/>
                      <path d="M5.5 8L7 9.5L10.5 6" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="network-card__title">{user.title}</div>
                <div className="network-card__skills">
                  {user.skills.slice(0, 2).map(s => <span key={s.id} className="tag">{s.name}</span>)}
                </div>
              </div>
              <div className="network-card__actions">
                <button className="btn btn--primary btn--sm">Follow</button>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => { setViewingUserId(user.id); setActiveTab('profile'); }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="network-section">
        <h2 className="network-section__title text-display">Trending Skills</h2>
        <div className="trending-skills">
          {['TypeScript', 'Rust', 'LLMs', 'Figma', 'Kubernetes', 'GraphQL', 'WebAssembly', 'Svelte'].map((skill, i) => (
            <div key={skill} className="trending-skill card">
              <span className="trending-skill__rank">#{i + 1}</span>
              <span className="trending-skill__name">{skill}</span>
              <span className="tag tag--cyan trending-skill__tag">Trending</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};