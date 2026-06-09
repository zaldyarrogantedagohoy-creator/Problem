import React, { useState } from 'react';
import type { Post } from '../types';
import { useApp } from '../context/AppContext';
import './PostCard.scss';

interface Props {
  post: Post;
}

const TypeBadge = ({ type }: { type: Post['type'] }) => {
  const map = {
    update: null,
    project: { label: '🚀 Project', className: 'tag--cyan' },
    achievement: { label: '🏆 Achievement', className: 'tag--amber' },
    certificate: { label: '🎓 Certificate', className: 'tag--green' },
  };
  const badge = map[type];
  if (!badge) return null;
  return <span className={`tag ${badge.className}`}>{badge.label}</span>;
};

export const PostCard: React.FC<Props> = ({ post }) => {
  const { toggleLike, setViewingUserId, setActiveTab } = useApp();
  const [reposted, setReposted] = useState(false);

  const handleUserClick = () => {
    setViewingUserId(post.userId);
    setActiveTab('profile');
  };

  return (
    <article className="post-card card card--hover">
      <div className="post-card__header">
        <button className="post-card__user" onClick={handleUserClick}>
          <img src={post.user.avatar} alt={post.user.name} className="avatar avatar--md" />
          <div className="post-card__user-info">
            <span className="post-card__user-name">
              {post.user.name}
              {post.user.verified && (
                <svg className="verified-icon-sm" viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M8 1L10 3H13V6L15 8L13 10V13H10L8 15L6 13H3V10L1 8L3 6V3H6L8 1Z" fill="#22D3EE" opacity="0.15"/>
                  <path d="M8 1L10 3H13V6L15 8L13 10V13H10L8 15L6 13H3V10L1 8L3 6V3H6L8 1Z" stroke="#22D3EE" strokeWidth="1.2"/>
                  <path d="M5.5 8L7 9.5L10.5 6" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className="post-card__meta">
              <span className="post-card__title">{post.user.title}</span>
              <span className="post-card__dot">·</span>
              <span className="post-card__time">{post.createdAt}</span>
            </span>
          </div>
        </button>

        <div className="post-card__type">
          <TypeBadge type={post.type} />
        </div>
      </div>

      <div className="post-card__body">
        <p className="post-card__content">{post.content}</p>
      </div>

      <div className="post-card__actions">
        <button
          className={`action-btn ${post.liked ? 'action-btn--liked' : ''}`}
          onClick={() => toggleLike(post.id)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18"
            fill={post.liked ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{post.likes.toLocaleString()}</span>
        </button>

        <button className="action-btn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{post.comments.toLocaleString()}</span>
        </button>

        <button
          className={`action-btn ${reposted ? 'action-btn--reposted' : ''}`}
          onClick={() => setReposted(r => !r)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
          </svg>
          <span>{(post.reposts + (reposted ? 1 : 0)).toLocaleString()}</span>
        </button>

        <button className="action-btn action-btn--share">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
    </article>
  );
};