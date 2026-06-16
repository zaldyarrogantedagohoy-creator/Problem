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
            ? {
                ...item,
                content: updatedPost?.content ?? trimmed,
              }
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

      setDbPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                likes: updatedPost?.likes ?? (post.likes || 0) + 1,
              }
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
            ? {
                ...post,
                shares: updatedPost?.shares ?? (post.shares || 0) + 1,
              }
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
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: comments,
      }));
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

      setCommentTextByPost(prev => ({
        ...prev,
        [postId]: '',
      }));
    } catch (error: any) {
      console.error('Failed to comment:', error);
      alert(error.message || 'Comment failed');
    }
  };

  const typeEmoji: Record<string, string> = {
    update: '💬',
    project: '🚀',
    achievement: '🏆',
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
                  className={`type-btn${postType === t ? ' active' : ''}`}
                  onClick={() => setPostType(t)}
                >
                  {typeEmoji[t]}
                  <span className="type-btn__label">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </span>
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

        <div className="feed-divider">
          <span>Recent Activity</span>
        </div>

        {dbPosts.length === 0 ? (
          <div className="feed-empty">
            <p>No posts yet. Be the first to share something.</p>
          </div>
        ) : (
          dbPosts.map((post, i) => (
            <div
              key={post.id}
              className="feed-post"
              style={{ '--pi': i } as React.CSSProperties}
            >
              <div className="feed-post__menu-wrap">
                <button
                  type="button"
                  className="feed-post__menu-btn"
                  onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                >
                  ⋮
                </button>

                {openMenuId === post.id && (
                  <div className="feed-post__menu">
                    <button type="button" onClick={() => startEdit(post)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(post.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="feed-post__type">
                {typeEmoji[post.title] ?? '📌'} {post.title}
              </div>

              {editingPostId === post.id ? (
                <div className="feed-post__edit-box">
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={3}
                  />

                  <div className="feed-post__edit-actions">
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => handleSaveEdit(post)}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p>{post.content}</p>
              )}

              <small>By {post.author}</small>

              <div className="feed-post__actions">
                <button type="button" className="action-btn" onClick={() => handleLike(post.id)}>
                  ❤️ React {post.likes || 0}
                </button>

                <button type="button" className="action-btn" onClick={() => toggleComments(post.id)}>
                  💬 Comment
                </button>

                <button type="button" className="action-btn" onClick={() => handleShare(post.id)}>
                  🔄 Share {post.shares || 0}
                </button>
              </div>

              {openCommentsId === post.id && (
                <div className="feed-post__comments">
                  <div className="comment-form">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentTextByPost[post.id] || ''}
                      onChange={e =>
                        setCommentTextByPost(prev => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                    />

                    <button type="button" onClick={() => handleCreateComment(post.id)}>
                      Send
                    </button>
                  </div>

                  {(commentsByPost[post.id] || []).length === 0 ? (
                    <p className="comment-empty">No comments yet.</p>
                  ) : (
                    commentsByPost[post.id].map(comment => (
                      <div key={comment.id} className="comment-item">
                        <strong>{comment.author}</strong>
                        <p>{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};