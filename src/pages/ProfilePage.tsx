import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { User, ProfileTab } from '../types';
import './ProfilePage.scss';

const SkillLevelMap = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };

const VerifiedBadge = () => (
  <span className="verified-badge">
    <svg viewBox="0 0 10 10" fill="white" width="10" height="10">
      <path d="M4 7.5L1.5 5 2.5 4 4 5.5 7.5 2 8.5 3 4 7.5Z"/>
    </svg>
    Verified
  </span>
);

const ProfileHeader: React.FC<{ user: User; isOwn: boolean }> = ({ user, isOwn }) => {
  const { setShowVerifyModal, setShowEditProfile, followedUserIds, toggleFollowUser, setActiveTab: setAppTab } = useApp();
  const isFollowing = followedUserIds.includes(user.id);

  return (
    <div className="profile-header card">
      <div className="profile-header__banner">
        <div className="profile-header__banner-bg" />
      </div>
      <div className="profile-header__main">
        <div className="profile-header__avatar-wrap">
          <img src={user.avatar} alt={user.name} className="avatar avatar--xxl profile-header__avatar" />
          {user.verified && (
            <div className="profile-header__verified-ring" title="Verified Profile">
              <svg viewBox="0 0 20 20" fill="#22D3EE" width="20" height="20">
                <path d="M10 18A8 8 0 1 0 10 2a8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"/>
              </svg>
            </div>
          )}
        </div>
        <div className="profile-header__actions">
          {isOwn ? (
            <>
              <button className="btn btn--outline btn--sm" onClick={() => setShowVerifyModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Verify
              </button>
              <button className="btn btn--primary btn--sm" onClick={() => setShowEditProfile(true)}>
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn--outline btn--sm"
                onClick={() => setAppTab('notifications')}
              >
                Message
              </button>
              <button
                className="btn btn--primary btn--sm"
                onClick={() => toggleFollowUser(user.id)}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="profile-header__info">
        <div className="profile-header__name-row">
          <h1 className="profile-header__name text-display">{user.name}</h1>
          {user.verified && <VerifiedBadge />}
        </div>
        <p className="profile-header__title">{user.title}</p>
        <p className="profile-header__bio">{user.bio}</p>

        <div className="profile-header__meta">
          {user.location && (
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {user.location}
            </span>
          )}
          {user.website && (
            <a href={user.website} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {user.website.replace('https://', '')}
            </a>
          )}
          <span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Joined {user.joinedDate}
          </span>
        </div>

        <div className="profile-header__stats">
          <div className="stat-chip">
            <span className="stat-value">{user.followers.toLocaleString()}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">{user.following.toLocaleString()}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">{user.projects.length}</span>
            <span className="stat-label">Projects</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">{user.certificates.length}</span>
            <span className="stat-label">Certs</span>
          </div>
        </div>

        {/* Verified fields */}
        {user.verifiedFields.length > 0 && (
          <div className="profile-header__verified-fields">
            {user.verifiedFields.map(f => (
              <span key={f.field} className="tag tag--green">
                <svg viewBox="0 0 12 12" fill="currentColor" width="10" height="10">
                  <path d="M5 8.5L2.5 6 3.5 5 5 6.5 8.5 3 9.5 4 5 8.5Z"/>
                </svg>
                {f.field}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ExperienceSection: React.FC<{ user: User }> = ({ user }) => (
  <div className="profile-section">
    <h3 className="profile-section__title text-display">Experience</h3>
    <div className="timeline">
      {user.experiences.map(exp => (
        <div key={exp.id} className="timeline-item">
          <div className="timeline-item__dot" />
          <div className="timeline-item__content card">
            <div className="timeline-item__header">
              <img src={exp.companyLogo} alt={exp.company} className="avatar avatar--sm" style={{ borderRadius: '8px' }} />
              <div>
                <div className="timeline-item__role">{exp.role}</div>
                <div className="timeline-item__company">{exp.company}</div>
              </div>
              {exp.verified && <VerifiedBadge />}
            </div>
            <div className="timeline-item__dates">
              {exp.startDate} — {exp.current ? <span className="tag tag--green" style={{ padding: '2px 7px' }}>Current</span> : exp.endDate}
            </div>
            <p className="timeline-item__desc">{exp.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CertificatesSection: React.FC<{ user: User }> = ({ user }) => (
  <div className="profile-section">
    <h3 className="profile-section__title text-display">Certificates</h3>
    <div className="certs-grid">
      {user.certificates.map(cert => (
        <div key={cert.id} className="cert-card card card--hover">
          <div className="cert-card__header">
            <img src={cert.issuerLogo} alt={cert.issuer} className="avatar avatar--sm" style={{ borderRadius: '8px' }} />
            <div className="cert-card__issuer">{cert.issuer}</div>
            {cert.verified && <VerifiedBadge />}
          </div>
          <h4 className="cert-card__title">{cert.title}</h4>
          <div className="cert-card__meta">
            <span>Issued {cert.issuedDate}</span>
            {cert.expiryDate && <span>· Expires {cert.expiryDate}</span>}
          </div>
          <div className="cert-card__id">ID: {cert.credentialId}</div>
          <div className="cert-card__skills">
            {cert.skills.map(s => <span key={s} className="tag tag--cyan">{s}</span>)}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EducationSection: React.FC<{ user: User }> = ({ user }) => (
  <div className="profile-section">
    <h3 className="profile-section__title text-display">Education</h3>
    <div className="certs-grid">
      {user.education.map(edu => (
        <div key={edu.id} className="cert-card card card--hover">
          <div className="cert-card__header">
            <img src={edu.institutionLogo} alt={edu.institution} className="avatar avatar--sm" style={{ borderRadius: '8px' }} />
            <div>
              <div className="cert-card__title">{edu.institution}</div>
              <div className="cert-card__meta">{edu.degree} in {edu.field}</div>
            </div>
            {edu.verified && <VerifiedBadge />}
          </div>
          <div className="cert-card__meta" style={{ marginTop: '10px' }}>
            {edu.startYear} — {edu.endYear}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProjectsSection: React.FC<{ user: User }> = ({ user }) => (
  <div className="profile-section">
    <h3 className="profile-section__title text-display">Projects</h3>
    <div className="projects-grid">
      {user.projects.map(project => (
        <div key={project.id} className={`project-card card card--hover ${project.featured ? 'project-card--featured' : ''}`}>
          {project.featured && <div className="project-card__featured-badge tag tag--amber">⭐ Featured</div>}
          <div className="project-card__thumbnail">
            <div className="project-card__thumbnail-bg">
              <svg viewBox="0 0 40 40" fill="none" width="48" height="48" opacity="0.3">
                <rect width="18" height="14" x="4" y="8" rx="2" stroke="white" strokeWidth="1.5"/>
                <rect width="18" height="14" x="18" y="18" rx="2" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
          <div className="project-card__body">
            <h4 className="project-card__title">{project.title}</h4>
            <p className="project-card__desc">{project.description}</p>
            <div className="project-card__tags">
              {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <div className="project-card__stats">
              <span>
                <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {project.likes.toLocaleString()}
              </span>
              <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                {project.views.toLocaleString()}
              </span>
              <div className="project-card__links">
                {project.liveUrl && (
                  <a href={project.liveUrl} className="btn btn--ghost btn--sm" target="_blank" rel="noreferrer">Live ↗</a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} className="btn btn--ghost btn--sm" target="_blank" rel="noreferrer">Repo ↗</a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkillsSection: React.FC<{ user: User }> = ({ user }) => (
  <div className="profile-section">
    <h3 className="profile-section__title text-display">Skills</h3>
    <div className="skills-list">
      {user.skills.map(skill => (
        <div key={skill.id} className="skill-item">
          <div className="skill-item__header">
            <div className="skill-item__name">
              {skill.name}
              {skill.verified && (
                <svg className="verified-icon" viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M8 1L10 3H13V6L15 8L13 10V13H10L8 15L6 13H3V10L1 8L3 6V3H6L8 1Z" fill="#22D3EE" opacity="0.15"/>
                  <path d="M8 1L10 3H13V6L15 8L13 10V13H10L8 15L6 13H3V10L1 8L3 6V3H6L8 1Z" stroke="#22D3EE" strokeWidth="1.2"/>
                  <path d="M5.5 8L7 9.5L10.5 6" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="skill-item__right">
              <span className="skill-item__endorsed">+{skill.endorsed} endorsed</span>
              <span className={`tag tag--sm ${skill.level === 'Expert' ? 'tag--cyan' : skill.level === 'Advanced' ? '' : 'tag--amber'}`}>
                {skill.level}
              </span>
            </div>
          </div>
          <div className="skill-bar">
            <div
              className="skill-bar__fill"
              style={{ width: `${SkillLevelMap[skill.level]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ProfilePage: React.FC = () => {
  const { currentUser, viewingUserId, users } = useApp();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const user = viewingUserId
    ? (users.find(u => u.id === viewingUserId) ?? currentUser)
    : currentUser;
  const isOwn = !viewingUserId || viewingUserId === currentUser.id;

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'skills', label: 'Skills' },
  ];

  return (
    <div className="profile-page">
      <ProfileHeader user={user} isOwn={isOwn} />

      <div className="profile-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`profile-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="profile-content">
        {(activeTab === 'overview' || activeTab === 'experience') && <ExperienceSection user={user} />}
        {(activeTab === 'overview' || activeTab === 'education') && <EducationSection user={user} />}
        {(activeTab === 'overview' || activeTab === 'projects') && <ProjectsSection user={user} />}
        {(activeTab === 'overview' || activeTab === 'certificates') && <CertificatesSection user={user} />}
        {(activeTab === 'overview' || activeTab === 'skills') && <SkillsSection user={user} />}
      </div>
    </div>
  );
};