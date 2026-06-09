import React from 'react';
import { useApp } from '../context/AppContext';
import './RightPanel.scss';

export const RightPanel: React.FC = () => {
  const { currentUser, setShowVerifyModal } = useApp();
  const verifiedCount = currentUser.verifiedFields.length;
  const totalVerifiable = 4;
  const verifiedPct = Math.round((verifiedCount / totalVerifiable) * 100);

  return (
    <aside className="right-panel">
      {/* Profile strength */}
      <div className="panel-card card">
        <h3 className="panel-card__title text-display">Profile Strength</h3>
        <div className="strength-meter">
          <div className="strength-meter__bar">
            <div className="strength-meter__fill" style={{ width: `${verifiedPct}%` }} />
          </div>
          <div className="strength-meter__labels">
            <span className="strength-meter__label">
              {verifiedPct < 50 ? 'Building' : verifiedPct < 80 ? 'Strong' : 'All-Star'}
            </span>
            <span className="strength-meter__pct">{verifiedPct}%</span>
          </div>
        </div>
        <div className="strength-items">
          {[
            { label: 'Email verified', done: currentUser.verifiedFields.some(f => f.field === 'Email') },
            { label: 'LinkedIn connected', done: currentUser.verifiedFields.some(f => f.field === 'LinkedIn') },
            { label: 'GitHub connected', done: currentUser.verifiedFields.some(f => f.field === 'GitHub') },
            { label: 'Identity verified', done: false },
          ].map(item => (
            <div key={item.label} className={`strength-item ${item.done ? 'done' : ''}`}>
              <span className="strength-item__check">
                {item.done ? (
                  <svg viewBox="0 0 12 12" fill="#22D3EE" width="12" height="12">
                    <path d="M2 6l3 3 5-5"/>
                  </svg>
                ) : (
                  <span className="strength-item__empty" />
                )}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <button
          className="btn btn--primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          onClick={() => setShowVerifyModal(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Verify More
        </button>
      </div>

      {/* Who to follow */}
      <div className="panel-card card">
        <h3 className="panel-card__title text-display">Suggested</h3>
        <div className="suggested-list">
          {[
            { name: 'Yuki Tanaka', title: 'iOS Engineer @ Apple', seed: 'Yuki', bg: 'ffd5dc' },
            { name: 'Carlos Reyes', title: 'DevRel @ HashiCorp', seed: 'Carlos', bg: 'b6e3f4' },
            { name: 'Amara Okafor', title: 'ML Researcher', seed: 'Amara', bg: 'd4edda' },
          ].map(u => (
            <div key={u.name} className="suggested-item">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.seed}&backgroundColor=${u.bg}`}
                alt={u.name}
                className="avatar avatar--sm"
              />
              <div className="suggested-item__info">
                <span className="suggested-item__name">{u.name}</span>
                <span className="suggested-item__title">{u.title}</span>
              </div>
              <button className="btn btn--outline btn--sm">Follow</button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="panel-card card">
        <h3 className="panel-card__title text-display">Trending Tags</h3>
        <div className="trending-tags">
          {['#OpenSource', '#TypeScript', '#AIEngineering', '#DesignSystems', '#Rust', '#Web3'].map(tag => (
            <span key={tag} className="trending-tag">{tag}</span>
          ))}
        </div>
      </div>
    </aside>
  );
};