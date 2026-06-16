import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  sharePost,
  getComments,
  createComment,
} from '../services/api';
import auroraBg from '../assets/bg-aurora.mp4';
import './FeedPage.scss';

export const FeedPage: React.FC = () => {
  const { currentUser } = useApp();

  const [dbPosts, setDbPosts] = useState<any[]>([]);
  const [postText, setPostText] = useState('');
  const [postType, setPostType] = useState<'update' | 'project' | 'achievement'>('update');

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, any[]>>({});
  const [commentTextByPost, setCommentTextByPost] = useState<Record<string, string>>({});

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setDbPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePost = async () => {
    const trimmed = postText.trim();
    if (!trimmed) return;

    try {
      await createPost({
        title: postType,
        content: trimmed,
        author: currentUser.name,
      });

      setPostText('');
      setPostType('update');
      await loadPosts();
    } catch (error: any) {
      console.error('Failed to create post:', error);
      alert(error.message || 'Post failed');
    }
  };

  const handleDelete = async (postId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      await deletePost(postId);
      setDbPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      setOpenMenuId(null);
      setEditingPostId(null);
    } catch (error: any) {
      console.error('Failed to delete post:', error);
      alert(error.message || 'Delete failed');
    }
  };

  const startEdit = (post: any) => {
    setEditingPostId(post.id);
    setEditText(post.content);
    setOpenMenuId(null);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditText('');
  };

  const handleSaveEdit = async (post: any) => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    try {
      const updated = await updatePost(post.id, {
        title: post.title,
        content: trimmed,
        author: post.author,
      });

      const updatedPost = Array.isArray(updated) ? updated[0] : null;

      setDbPosts(prevPosts =>
        prevPosts.map(item =>
          item.id === post.id
            ? { ...item, content: updatedPost?.content ?? trimmed }
            : item
        )
      );

      setEditingPostId(null);
      setEditText('');
    } catch (error: any) {
      console.error('Failed to update post:', error);
      alert(error.message || 'Update failed');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const result = await likePost(postId);
      const updatedPost = Array.isArray(result) ? result[0] : null;

      setLikedPosts(prev => {
        const next = new Set(prev);
        if (next.has(postId)) next.delete(postId);
        else next.add(postId);
        return next;
      });

      setDbPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, likes: updatedPost?.likes ?? (post.likes || 0) + 1 }
            : post
        )
      );
    } catch (error: any) {
      console.error('Failed to like post:', error);
      alert(error.message || 'React failed');
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const result = await sharePost(postId);
      const updatedPost = Array.isArray(result) ? result[0] : null;

      setDbPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, shares: updatedPost?.shares ?? (post.shares || 0) + 1 }
            : post
        )
      );

      await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
      alert('Post link copied!');
    } catch (error: any) {
      console.error('Failed to share post:', error);
      alert(error.message || 'Share failed');
    }
  };

  const toggleComments = async (postId: string) => {
    if (openCommentsId === postId) {
      setOpenCommentsId(null);
      return;
    }

    try {
      const comments = await getComments(postId);
      setCommentsByPost(prev => ({ ...prev, [postId]: comments }));
      setOpenCommentsId(postId);
    } catch (error: any) {
      console.error('Failed to load comments:', error);
      alert(error.message || 'Failed to load comments');
    }
  };

  const handleCreateComment = async (postId: string) => {
    const commentText = commentTextByPost[postId]?.trim();
    if (!commentText) return;

    try {
      const result = await createComment(postId, {
        author: currentUser.name,
        content: commentText,
      });

      const newComment = Array.isArray(result) ? result[0] : null;

      setCommentsByPost(prev => ({
        ...prev,
        [postId]: newComment
          ? [...(prev[postId] || []), newComment]
          : prev[postId] || [],
      }));

      setCommentTextByPost(prev => ({ ...prev, [postId]: '' }));
    } catch (error: any) {
      console.error('Failed to comment:', error);
      alert(error.message || 'Comment failed');
    }
  };

  const typeConfig: Record<string, { emoji: string; label: string; color: string }> = {
    update:      { emoji: '💬', label: 'Update',      color: 'blue'   },
    project:     { emoji: '🚀', label: 'Project',     color: 'violet' },
    achievement: { emoji: '🏆', label: 'Achievement', color: 'amber'  },
  };

  return (
    <>
      <video
        className="feed-bg-video"
        src={auroraBg}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <div className="feed-page">

        {/* ── Composer ── */}
        <div className="composer">
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
                  type="button"
                  className={`type-btn type-btn--${typeConfig[t].color}${postType === t ? ' active' : ''}`}
                  onClick={() => setPostType(t)}
                >
                  <span className="type-btn__emoji">{typeConfig[t].emoji}</span>
                  <span className="type-btn__label">{typeConfig[t].label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="btn btn--primary btn--sm"
              disabled={!postText.trim()}
              onClick={handlePost}
            >
              Post
            </button>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="feed-divider">
          <span>Recent Activity</span>
        </div>

        {/* ── Posts ── */}
        {dbPosts.length === 0 ? (
          <div className="feed-empty">
            <p>No posts yet. Be the first to share something.</p>
          </div>
        ) : (
          dbPosts.map((post, i) => {
            const cfg = typeConfig[post.title] ?? { emoji: '📌', label: post.title, color: 'blue' };
            const isLiked = likedPosts.has(post.id);
            const commentCount = (commentsByPost[post.id] || []).length;

            return (
              <div
                key={post.id}
                className={`feed-post feed-post--${cfg.color}`}
                style={{ '--pi': i } as React.CSSProperties}
              >
                {/* 3-dot menu */}
                <div className="feed-post__menu-wrap">
                  <button
                    type="button"
                    className="feed-post__menu-btn"
                    aria-label="Post options"
                    onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5"  r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <circle cx="12" cy="19" r="2"/>
                    </svg>
                  </button>

                  {openMenuId === post.id && (
                    <div className="feed-post__menu">
                      <button type="button" onClick={() => startEdit(post)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit post
                      </button>
                      <button type="button" className="danger" onClick={() => handleDelete(post.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Type badge */}
                <div className={`feed-post__type feed-post__type--${cfg.color}`}>
                  <span>{cfg.emoji}</span>
                  <span>{cfg.label}</span>
                </div>

                {/* Content */}
                {editingPostId === post.id ? (
                  <div className="feed-post__edit-box">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={3}
                    />
                    <div className="feed-post__edit-actions">
                      <button type="button" className="btn btn--primary btn--sm" onClick={() => handleSaveEdit(post)}>
                        Save
                      </button>
                      <button type="button" className="btn btn--outline btn--sm" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="feed-post__content">{post.content}</p>
                )}

                <span className="feed-post__author">By {post.author}</span>

                {/* ── Action bar ── */}
                <div className="feed-post__actions">
                  <button
                    type="button"
                    className={`action-btn action-btn--like${isLiked ? ' active' : ''}`}
                    onClick={() => handleLike(post.id)}
                    aria-label={`Like — ${post.likes || 0}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span>{post.likes || 0}</span>
                    <span className="action-btn__label">React</span>
                  </button>

                  <button
                    type="button"
                    className={`action-btn action-btn--comment${openCommentsId === post.id ? ' active' : ''}`}
                    onClick={() => toggleComments(post.id)}
                    aria-label={`Comments — ${commentCount}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>{commentCount > 0 ? commentCount : ''}</span>
                    <span className="action-btn__label">Comment</span>
                  </button>

                  <button
                    type="button"
                    className="action-btn action-btn--share"
                    onClick={() => handleShare(post.id)}
                    aria-label={`Share — ${post.shares || 0}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    <span>{post.shares || 0}</span>
                    <span className="action-btn__label">Share</span>
                  </button>
                </div>

                {/* ── Comments ── */}
                {openCommentsId === post.id && (
                  <div className="feed-post__comments">
                    <div className="comment-form">
                      <img src={currentUser.avatar} alt={currentUser.name} className="avatar avatar--sm" />
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentTextByPost[post.id] || ''}
                        onChange={e =>
                          setCommentTextByPost(prev => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={e => e.key === 'Enter' && handleCreateComment(post.id)}
                      />
                      <button
                        type="button"
                        className="comment-send-btn"
                        disabled={!commentTextByPost[post.id]?.trim()}
                        onClick={() => handleCreateComment(post.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </button>
                    </div>

                    {(commentsByPost[post.id] || []).length === 0 ? (
                      <p className="comment-empty">No comments yet — be the first!</p>
                    ) : (
                      commentsByPost[post.id].map(comment => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-item__avatar">
                            {comment.author?.charAt(0).toUpperCase()}
                          </div>
                          <div className="comment-item__body">
                            <strong>{comment.author}</strong>
                            <p>{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};
