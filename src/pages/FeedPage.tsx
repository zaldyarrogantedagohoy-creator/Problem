import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from '../components/PostCard';
import './FeedPage.scss';

export const FeedPage: React.FC = () => {
  const { posts, currentUser } = useApp();
  const [postText, setPostText] = useState('');
  const [postType, setPostType] = useState<'update' | 'project' | 'achievement'>('update');

  return (
    <div className="feed-page">
      {/* Composer */}
      <div className="composer card">
        <div className="composer__top">
          <img src={currentUser.avatar} alt={currentUser.name} className="avatar avatar--md" />
          <textarea
            className="composer__input"
            placeholder="Share an update, project, or achievement..."
            value={postText}
            onChange={e => setPostText(e.target.value)}
            rows={postText ? 3 : 1}
          />
        </div>
        <div className="composer__footer">
          <div className="composer__types">
            {(['update', 'project', 'achievement'] as const).map(t => (
              <button
                key={t}
                className={`type-btn ${postType === t ? 'active' : ''}`}
                onClick={() => setPostType(t)}
              >
                {t === 'update' && '💬'}
                {t === 'project' && '🚀'}
                {t === 'achievement' && '🏆'}
                <span className="type-btn__label">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
              </button>
            ))}
          </div>
          <button className="btn btn--primary btn--sm" disabled={!postText.trim()}>
            Post
          </button>
        </div>
      </div>

      <div className="feed-divider">
        <span>Recent Activity</span>
      </div>

      {/* Posts */}
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
};