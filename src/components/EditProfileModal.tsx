import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './EditProfileModal.scss';

export const EditProfileModal: React.FC = () => {
  const { setShowEditProfile, currentUser } = useApp();
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [website, setWebsite] = useState(currentUser.website);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setShowEditProfile(false), 800);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
      <div className="modal edit-modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Edit Profile</h2>
          <button className="modal__close" onClick={() => setShowEditProfile(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="edit-avatar-section">
          <img src={currentUser.avatar} alt={currentUser.name} className="avatar avatar--xl" />
          <button className="btn btn--outline btn--sm">Change Photo</button>
        </div>

        <div className="divider" />

        <div className="form-group">
          <label>Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Professional Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
        </div>
        <div className="form-group">
          <label>Website</label>
          <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yoursite.com" />
        </div>

        <div className="edit-modal__footer">
          <button className="btn btn--outline" onClick={() => setShowEditProfile(false)}>Cancel</button>
          <button
            className={`btn btn--primary ${saved ? 'btn--saved' : ''}`}
            onClick={handleSave}
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};