import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './LandingPage.scss';

export const LandingPage: React.FC = () => {
  const { setActiveTab, updateCurrentUserProfile, currentUser } = useApp();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSignupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateCurrentUserProfile({
      name: fullName || currentUser.name,
      username: username || currentUser.username,
      email: email || currentUser.email,
      title: title || currentUser.title,
      bio: `Looking to grow as ${title || currentUser.title}.`,
    });
    setActiveTab('feed');
  };

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Enter both email and password to continue.');
      return;
    }

    if (loginEmail.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
      setLoginError('No account found with that email. Please sign up first.');
      return;
    }

    setLoginError('');
    setActiveTab('feed');
  };

  return (
    <div className="landing-page">
      <div className="landing-page__hero card">
        <div className="landing-page__hero-copy">
          <span className="eyebrow">Welcome to Problem</span>
          <h1>Create your account, build your network, and showcase your skills.</h1>
          <p>Connect with talented professionals, discover trending skills, and share projects that matter.</p>
          <button className="btn btn--primary" onClick={() => setActiveTab('feed')}>
            Explore already built demo
          </button>
        </div>
        <div className="landing-page__hero-visual">
          <div className="hero-card">
            <div className="hero-card__header">
              <span>Account creation</span>
              <span className="tag tag--cyan">Fast</span>
            </div>
            <p>Sign up and start connecting with your professional community right away.</p>
            <div className="hero-card__stats">
              <div>
                <span>250+</span>
                <small>Profiles</small>
              </div>
              <div>
                <span>90%</span>
                <small>Active users</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-page__form card">
        <div className="landing-page__tab-switcher">
          <button
            type="button"
            className={`tab-button ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Create account
          </button>
          <button
            type="button"
            className={`tab-button ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
        </div>

        {mode === 'signup' ? (
          <>
            <h2>Start your account</h2>
            <p>Enter your details to create a profile and begin exploring the network.</p>
            <form onSubmit={handleSignupSubmit} className="signup-form">
              <label>
                Full name
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </label>

              <label>
                Username
                <input
                  type="text"
                  placeholder="janedoe"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Professional title
                <input
                  type="text"
                  placeholder="Frontend Developer"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </label>

              <button type="submit" className="btn btn--primary btn--full">
                Create account
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Log in to your account</h2>
            <p>Use your account email to continue to your dashboard.</p>
            <form onSubmit={handleLoginSubmit} className="signup-form">
              <label>
                Email
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                />
              </label>

              {loginError && <p className="login-error">{loginError}</p>}

              <button type="submit" className="btn btn--primary btn--full">
                Log in
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
