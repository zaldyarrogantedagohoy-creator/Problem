import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { signupUser, loginUser } from '../services/api';
import auroraBg from '../assets/bg-aurora.mp4';
import './LandingPage.scss';

// ── Friendly error parser ──────────────────────────────────────────────────────
//  Catches network failures, non-JSON bodies, and known API error shapes.
function parseError(err: unknown): string {
  if (err instanceof TypeError && (err.message === 'Failed to fetch' || err.message.includes('NetworkError'))) {
    return 'Unable to reach the server. Check your connection and try again.';
  }
  if (err instanceof Error) {
    // Supabase / custom API often returns { message: '...' } or { error: '...' }
    const msg = err.message;
    if (msg.toLowerCase().includes('invalid login credentials') || msg.toLowerCase().includes('invalid_credentials')) {
      return 'Incorrect email or password. Please try again.';
    }
    if (msg.toLowerCase().includes('email not confirmed')) {
      return 'Please confirm your email before logging in.';
    }
    if (msg.toLowerCase().includes('user already registered') || msg.toLowerCase().includes('already exists')) {
      return 'An account with this email already exists. Try logging in instead.';
    }
    return msg || 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

// ── Main component ─────────────────────────────────────────────────────────────
export const LandingPage: React.FC = () => {
  const { setActiveTab, updateCurrentUserProfile, currentUser } = useApp();

  const [mode, setMode]             = useState<'signup' | 'login'>('signup');
  const [flipped, setFlipped]       = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [title, setTitle]       = useState('');
  const [password, setPassword] = useState('');

  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [loginError, setLoginError]   = useState('');
  const [signupError, setSignupError] = useState('');
  const [loading, setLoading]         = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage]     = useState('');
  const [successType, setSuccessType]           = useState<'signup' | 'login'>('signup');

  const switchMode = (newMode: 'signup' | 'login') => {
    if (newMode === mode || isFlipping) return;
    setIsFlipping(true);
    setLoginError('');
    setSignupError('');
    setTimeout(() => setMode(newMode), 400);
    setFlipped(newMode === 'login');
    setTimeout(() => setIsFlipping(false), 800);
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupError('');
    setLoading(true);
    try {
      await signupUser({
        name: fullName,
        username,
        email,
        password,
        title,
        bio: `Looking to grow as ${title || currentUser.title}.`,
      });
      updateCurrentUserProfile({
        name:     fullName || currentUser.name,
        username: username || currentUser.username,
        email:    email    || currentUser.email,
        title:    title    || currentUser.title,
        bio:      `Looking to grow as ${title || currentUser.title}.`,
      });
      setSuccessType('signup');
      setSuccessMessage('Your account has been created. Welcome to the network.');
      setShowSuccessModal(true);
    } catch (err) {
      setSignupError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const result  = await loginUser({ email: loginEmail, password: loginPassword });
      const user    = result.user;
      const profile = result.profile;
      updateCurrentUserProfile({
        name:     profile?.name     || user?.user_metadata?.name  || currentUser.name,
        username: profile?.username || user?.email?.split('@')[0] || currentUser.username,
        email:    profile?.email    || user?.email                || currentUser.email,
        title:    profile?.title    || currentUser.title,
        bio:      profile?.bio      || currentUser.bio,
      });
      setSuccessType('login');
      setSuccessMessage('Welcome back. Your session is active.');
      setShowSuccessModal(true);
    } catch (err) {
      setLoginError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => { setShowSuccessModal(false); setActiveTab('feed'); };

  return (
    <div className="landing-page">

      {/* ── Moving background ──────────────────── */}
      <video
        className="lp-bg-video"
        src={auroraBg}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* ── Hero ───────────────────────────────── */}
      <div className="lp-hero card">
        <div className="lp-hero__copy">
          <span className="eyebrow">
            <span className="eyebrow__dot" />
            Welcome to Problem
          </span>
          <h1>Build your network.<br />Showcase your skills.</h1>
          <p>Connect with talented professionals, discover trending skills, and share projects that matter.</p>

        </div>

        <div className="lp-hero__visual">
          <div className="hero-stat-card">
            <div className="hero-stat-card__header">
              <span>Account creation</span>
              <span className="tag tag--cyan">Fast</span>
            </div>
            <p>Sign up and start connecting with your professional community right away.</p>
            <div className="hero-stat-card__stats">
              <div><span>250+</span><small>Profiles</small></div>
              <div><span>90%</span><small>Active users</small></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form (flip card) ───────────────────── */}
      <div className="lp-form-scene">
        <div className={`lp-form-flipper${flipped ? ' lp-form-flipper--flipped' : ''}`}>

          {/* FRONT: signup */}
          <div className="lp-form-face lp-form-face--front card">
            <div className="lp-tab-switcher">
              <button type="button" className="tab-btn tab-btn--active" onClick={() => switchMode('signup')}>Create account</button>
              <button type="button" className="tab-btn" onClick={() => switchMode('login')}>Log in</button>
            </div>
            <h2>Start your account</h2>
            <p className="lp-subtitle">Enter your details to create a profile and begin exploring the network.</p>
            <form onSubmit={handleSignupSubmit} className="lp-form">
              {([
                { label: 'Full name',          type: 'text',     ph: 'Jane Doe',           val: fullName, set: setFullName, idx: 0 },
                { label: 'Username',           type: 'text',     ph: 'janedoe',            val: username, set: setUsername, idx: 1 },
                { label: 'Email',              type: 'email',    ph: 'jane@example.com',   val: email,    set: setEmail,    idx: 2 },
                { label: 'Professional title', type: 'text',     ph: 'Frontend Developer', val: title,    set: setTitle,    idx: 3 },
                { label: 'Password',           type: 'password', ph: 'Create a password',  val: password, set: setPassword, idx: 4 },
              ] as const).map(f => (
                <label key={f.label} style={{ '--fi': f.idx } as React.CSSProperties}>
                  {f.label}
                  <input type={f.type} placeholder={f.ph} value={f.val}
                    onChange={e => (f.set as any)(e.target.value)}
                    required={f.type !== 'text' || f.label !== 'Professional title'} />
                </label>
              ))}
              {signupError && <p className="form-error">{signupError}</p>}
              <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
                {loading ? <><span className="spinner" /> Creating account…</> : 'Create account'}
              </button>
            </form>
          </div>

          {/* BACK: login */}
          <div className="lp-form-face lp-form-face--back card">
            <div className="lp-tab-switcher">
              <button type="button" className="tab-btn" onClick={() => switchMode('signup')}>Create account</button>
              <button type="button" className="tab-btn tab-btn--active" onClick={() => switchMode('login')}>Log in</button>
            </div>
            <h2>Welcome back</h2>
            <p className="lp-subtitle">Use your account email to continue to your dashboard.</p>
            <form onSubmit={handleLoginSubmit} className="lp-form">
              {([
                { label: 'Email',    type: 'email',    ph: 'alex@example.com',    val: loginEmail,    set: setLoginEmail,    idx: 0 },
                { label: 'Password', type: 'password', ph: 'Enter your password', val: loginPassword, set: setLoginPassword, idx: 1 },
              ] as const).map(f => (
                <label key={f.label} style={{ '--fi': f.idx } as React.CSSProperties}>
                  {f.label}
                  <input type={f.type} placeholder={f.ph} value={f.val}
                    onChange={e => (f.set as any)(e.target.value)} required />
                </label>
              ))}
              {loginError && <p className="form-error">{loginError}</p>}
              <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
                {loading ? <><span className="spinner" /> Logging in…</> : 'Log in'}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* ── Success Modal ──────────────────────── */}
      {showSuccessModal && (
        <div className="success-overlay" onClick={e => e.target === e.currentTarget && handleContinue()}>
          <div className={`success-modal success-modal--${successType}`}>
            <div className="success-modal__rays" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="ray" style={{ '--ri': i } as React.CSSProperties} />
              ))}
            </div>

            <div className="success-modal__icon">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="check-circle" cx="32" cy="32" r="29" strokeWidth="2.5" />
                <polyline className="check-tick" points="18,33 27,43 46,22" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <span className="success-modal__eyebrow">
              {successType === 'signup' ? 'Account created' : 'Session active'}
            </span>
            <h2>{successType === 'signup' ? "You're in." : 'Welcome back.'}</h2>
            <p>{successMessage}</p>

            <button className="btn btn--primary btn--full success-modal__btn" onClick={handleContinue}>
              Continue to feed <span className="arrow">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
