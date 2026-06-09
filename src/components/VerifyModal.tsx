import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './VerifyModal.scss';

type VerifyStep = 'choose' | 'email' | 'linkedin' | 'github' | 'document' | 'success';

const steps = [
  { id: 'email' as const, label: 'Email Address', icon: '📧', desc: 'Verify your email to build trust' },
  { id: 'linkedin' as const, label: 'LinkedIn Profile', icon: '💼', desc: 'Connect your professional network' },
  { id: 'github' as const, label: 'GitHub Account', icon: '⚡', desc: 'Showcase your code contributions' },
  { id: 'document' as const, label: 'Identity Document', icon: '🪪', desc: 'Verify your real identity' },
];

export const VerifyModal: React.FC = () => {
  const { setShowVerifyModal, currentUser } = useApp();
  const [step, setStep] = useState<VerifyStep>('choose');
  const [selected, setSelected] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const isVerified = (id: string) =>
    currentUser.verifiedFields.some(f => f.field.toLowerCase().includes(id));

  const handleVerify = () => {
    if (!inputVal.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1800);
  };

  const handleClose = () => setShowVerifyModal(false);

  if (step === 'success') return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal verify-modal" onClick={e => e.stopPropagation()}>
        <div className="verify-success">
          <div className="verify-success__icon">
            <svg viewBox="0 0 48 48" fill="none" width="64" height="64">
              <circle cx="24" cy="24" r="22" fill="url(#successGrad)" opacity="0.15"/>
              <circle cx="24" cy="24" r="22" stroke="url(#successGrad)" strokeWidth="2"/>
              <path d="M15 24L21 30L33 18" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="successGrad" x1="2" y1="2" x2="46" y2="46" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5"/><stop offset="1" stopColor="#22D3EE"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="verify-success__title">Verification Submitted!</h2>
          <p className="verify-success__desc">
            Your {selected} verification is being processed. This usually takes a few minutes.
            You'll get a notification once confirmed.
          </p>
          <div className="verify-success__badge">
            <span className="verified-badge">
              <svg viewBox="0 0 10 10" fill="white" width="10" height="10">
                <path d="M4 7.5L1.5 5 2.5 4 4 5.5 7.5 2 8.5 3 4 7.5Z"/>
              </svg>
              Verified
            </span>
            <span className="verify-success__note">Badge pending confirmation</span>
          </div>
          <button className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );

  if (step !== 'choose') {
    const info = steps.find(s => s.id === step)!;
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal verify-modal" onClick={e => e.stopPropagation()}>
          <div className="modal__header">
            <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setStep('choose')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h2>Verify {info.label}</h2>
            <button className="modal__close" onClick={handleClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div className="verify-form">
            <div className="verify-form__icon">{info.icon}</div>
            <p className="verify-form__desc">
              {step === 'email' && 'Enter your email address. We\'ll send a verification code.'}
              {step === 'linkedin' && 'Paste your LinkedIn profile URL to connect your account.'}
              {step === 'github' && 'Enter your GitHub username to verify your contributions.'}
              {step === 'document' && 'Upload a government-issued ID. It\'s encrypted and never stored.'}
            </p>
            <div className="form-group">
              <label>
                {step === 'email' && 'Email Address'}
                {step === 'linkedin' && 'LinkedIn URL'}
                {step === 'github' && 'GitHub Username'}
                {step === 'document' && 'Upload Document'}
              </label>
              {step === 'document' ? (
                <div className="upload-area">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Click to upload or drag & drop</span>
                  <span className="upload-area__sub">PNG, JPG, PDF up to 10MB</span>
                  <input type="file" onChange={e => setInputVal(e.target.files?.[0]?.name || '')} />
                </div>
              ) : (
                <input
                  type={step === 'email' ? 'email' : 'text'}
                  placeholder={
                    step === 'email' ? 'you@example.com' :
                    step === 'linkedin' ? 'https://linkedin.com/in/yourname' :
                    'yourhandle'
                  }
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                />
              )}
            </div>
            <button
              className="btn btn--primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleVerify}
              disabled={loading || !inputVal.trim()}
            >
              {loading ? (
                <span className="loading-spinner" />
              ) : `Verify ${info.label}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal verify-modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Verify Your Profile</h2>
          <button className="modal__close" onClick={handleClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <p className="verify-intro">
          Verified profiles get a trust badge and rank higher in search. Choose what to verify:
        </p>
        <div className="verify-options">
          {steps.map(s => {
            const verified = isVerified(s.id);
            return (
              <button
                key={s.id}
                className={`verify-option ${verified ? 'verified' : ''}`}
                onClick={() => { setSelected(s.id); setStep(s.id); setInputVal(''); }}
                disabled={verified}
              >
                <span className="verify-option__icon">{s.icon}</span>
                <div className="verify-option__info">
                  <span className="verify-option__label">{s.label}</span>
                  <span className="verify-option__desc">{verified ? '✓ Already verified' : s.desc}</span>
                </div>
                {verified ? (
                  <svg className="verify-option__check" viewBox="0 0 20 20" fill="#22D3EE" width="18" height="18">
                    <path d="M10 18A8 8 0 1 0 10 2a8 8 0 0 0 0 16zm3.707-9.293a1 1 0 0 0-1.414-1.414L9 10.586 7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ color: 'var(--slate-400)' }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};