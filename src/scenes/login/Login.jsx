import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import './Login.css';

/**
 * Login - Sign-in page for node Safety Dashboard
 * Connects to AWS Cognito User Pool via Amplify Auth
 * Handles: sign-in, first-time new password, forgot password
 */
const Login = () => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [newPassword, setNewPassword]   = useState('');
  const [confirmPwd, setConfirmPwd]     = useState('');
  const [forgotCode, setForgotCode]     = useState('');
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [loading, setLoading]           = useState(false);
  const [showPwd, setShowPwd]           = useState(false);
  const [stage, setStage]               = useState('signin'); // 'signin' | 'newpassword' | 'forgotrequest' | 'forgotconfirm'
  const [cognitoUser, setCognitoUser]   = useState(null);

  const navigate = useNavigate();

  // ── Error code → human message ────────────────────────────────
  const friendlyError = (err) => {
    switch (err.code) {
      case 'UserNotFoundException':
        return 'No account found with this email address.';
      case 'NotAuthorizedException':
        return 'Incorrect email or password.';
      case 'UserNotConfirmedException':
        return 'Account not verified. Please contact your administrator.';
      case 'PasswordResetRequiredException':
        return 'A password reset is required. Use "Forgot password" below.';
      case 'InvalidPasswordException':
        return err.message;
      case 'CodeMismatchException':
        return 'Invalid verification code. Please try again.';
      case 'ExpiredCodeException':
        return 'Verification code expired. Please request a new one.';
      case 'LimitExceededException':
        return 'Too many attempts. Please wait a moment and try again.';
      default:
        return err.message || 'Something went wrong. Please try again.';
    }
  };

  // ── Stage: Sign in ────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await Auth.signIn(email, password);
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setCognitoUser(user);
        setStage('newpassword');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Stage: First-time new password ───────────────────────────
  const handleNewPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPwd) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await Auth.completeNewPassword(cognitoUser, newPassword);
      navigate('/');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Stage: Request forgot-password code ──────────────────────
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await Auth.forgotPassword(email);
      setStage('forgotconfirm');
      setSuccess(`A reset code has been sent to ${email}`);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Stage: Confirm new password with code ────────────────────
  const handleForgotConfirm = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPwd) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await Auth.forgotPasswordSubmit(email, forgotCode, newPassword);
      setSuccess('Password updated. You can now sign in.');
      setStage('signin');
      setNewPassword('');
      setConfirmPwd('');
      setForgotCode('');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Password strength hint ────────────────────────────────────
  const pwdRules = [
    { label: '8+ characters',  ok: newPassword.length >= 8 },
    { label: 'Uppercase',       ok: /[A-Z]/.test(newPassword) },
    { label: 'Number',          ok: /[0-9]/.test(newPassword) },
    { label: 'Symbol',          ok: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  // ── Shared field component ────────────────────────────────────
  const Field = ({ label, right, type = 'text', value, onChange, placeholder, autoComplete }) => (
    <div className="login-field">
      <div className="login-field-header">
        <label className="login-label">{label}</label>
        {right}
      </div>
      <input
        className="login-input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
    </div>
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="login-page">
      {/* Ambient orbs */}
      <div className="login-orb login-orb--cyan"   aria-hidden="true" />
      <div className="login-orb login-orb--violet" aria-hidden="true" />
      <div className="login-orb login-orb--green"  aria-hidden="true" />

      <div className="login-container">

        {/* Brand */}
        <div className="login-brand">
          <span className="login-wordmark">node</span>
          <span className="login-wordmark-dot">.</span>
        </div>
        <p className="login-tagline">AI-powered logistics safety platform</p>

        {/* Card */}
        <div className="login-card">

          {/* ── SIGN IN ── */}
          {stage === 'signin' && (
            <>
              <h2 className="login-card-title">Welcome back</h2>
              <p className="login-card-sub">Sign in to your account</p>

              <form onSubmit={handleSignIn} className="login-form" noValidate>
                <Field
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />

                <div className="login-field">
                  <div className="login-field-header">
                    <label className="login-label">Password</label>
                    <button
                      type="button"
                      className="login-text-btn"
                      onClick={() => { setStage('forgotrequest'); setError(''); setSuccess(''); }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="login-input-wrap">
                    <input
                      className="login-input"
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="login-eye"
                      onClick={() => setShowPwd(v => !v)}
                      aria-label={showPwd ? 'Hide password' : 'Show password'}
                    >
                      {showPwd ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error   && <p className="login-error">{error}</p>}
                {success && <p className="login-success">{success}</p>}

                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? <span className="login-spinner" /> : 'Sign in'}
                </button>
              </form>
            </>
          )}

          {/* ── NEW PASSWORD (first login) ── */}
          {stage === 'newpassword' && (
            <>
              <h2 className="login-card-title">Set your password</h2>
              <p className="login-card-sub">This is your first sign-in. Please create a new password.</p>

              <form onSubmit={handleNewPassword} className="login-form" noValidate>
                <Field
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <Field
                  label="Confirm password"
                  type="password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />

                {newPassword.length > 0 && (
                  <div className="login-pwd-rules">
                    {pwdRules.map(r => (
                      <span key={r.label} className={`pwd-rule ${r.ok ? 'ok' : ''}`}>
                        {r.ok ? '✓' : '○'} {r.label}
                      </span>
                    ))}
                  </div>
                )}

                {error && <p className="login-error">{error}</p>}

                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? <span className="login-spinner" /> : 'Set password & sign in'}
                </button>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD: enter email ── */}
          {stage === 'forgotrequest' && (
            <>
              <h2 className="login-card-title">Reset password</h2>
              <p className="login-card-sub">Enter your email and we'll send a verification code.</p>

              <form onSubmit={handleForgotRequest} className="login-form" noValidate>
                <Field
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                />

                {error   && <p className="login-error">{error}</p>}
                {success && <p className="login-success">{success}</p>}

                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? <span className="login-spinner" /> : 'Send reset code'}
                </button>

                <button
                  type="button"
                  className="login-back-btn"
                  onClick={() => { setStage('signin'); setError(''); setSuccess(''); }}
                >
                  ← Back to sign in
                </button>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD: enter code + new password ── */}
          {stage === 'forgotconfirm' && (
            <>
              <h2 className="login-card-title">Enter new password</h2>
              <p className="login-card-sub">Check your email for the verification code.</p>

              <form onSubmit={handleForgotConfirm} className="login-form" noValidate>
                <Field
                  label="Verification code"
                  type="text"
                  value={forgotCode}
                  onChange={e => setForgotCode(e.target.value)}
                  placeholder="6-digit code"
                  autoComplete="one-time-code"
                />
                <Field
                  label="New password"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <Field
                  label="Confirm password"
                  type="password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />

                {newPassword.length > 0 && (
                  <div className="login-pwd-rules">
                    {pwdRules.map(r => (
                      <span key={r.label} className={`pwd-rule ${r.ok ? 'ok' : ''}`}>
                        {r.ok ? '✓' : '○'} {r.label}
                      </span>
                    ))}
                  </div>
                )}

                {error   && <p className="login-error">{error}</p>}
                {success && <p className="login-success">{success}</p>}

                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? <span className="login-spinner" /> : 'Reset password'}
                </button>

                <button
                  type="button"
                  className="login-back-btn"
                  onClick={() => { setStage('signin'); setError(''); setSuccess(''); }}
                >
                  ← Back to sign in
                </button>
              </form>
            </>
          )}

        </div>

        <p className="login-footer">
          © 2026 node &nbsp;·&nbsp; A{' '}
          <a href="https://nodehub.uk" target="_blank" rel="noreferrer">Praxis GB</a>{' '}
          product
        </p>

      </div>
    </div>
  );
};

export default Login;
