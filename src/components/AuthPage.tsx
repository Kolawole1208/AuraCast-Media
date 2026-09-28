import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  KeyRound,
  ArrowLeft
} from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  // Auth feedback states
  const [error, setError] = useState<string | null>(null);
  const [isOperationNotAllowed, setIsOperationNotAllowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsOperationNotAllowed(false);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onAuthSuccess();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Sign-In failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    if (!resetEmail) {
      setResetError('Please enter your email address.');
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim().toLowerCase());
      setResetSent(true);
    } catch (err: any) {
      console.error('Password Reset Error:', err);
      let msg = err.message || 'Failed to send password reset email.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setResetError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsOperationNotAllowed(false);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Explicit registration ONLY
        await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      } else {
        // Strict Sign-In ONLY - never auto-register an account here
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error('Authentication Error:', err);
      let friendlyMessage = 'Authentication failed. Please check your credentials.';

      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = isSignUp 
          ? 'Registration failed. Please check your information and try again.'
          : 'Invalid email or password. Please verify your credentials or register a new account.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already registered. Please sign in instead.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = 'Too many failed login attempts. Please wait a moment or reset your password.';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyMessage = 'Email/Password authentication is disabled in Firebase Console.';
        setIsOperationNotAllowed(true);
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-100 antialiased">
      {/* Top Navigation Bar */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">AURACAST</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Enterprise Social Automation</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xs p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-3 shadow-2xs">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {showForgotPassword 
                ? 'Reset your password' 
                : isSignUp 
                  ? 'Create your workspace' 
                  : 'Sign in to AuraCast'}
            </h1>
            <p className="text-xs text-slate-500">
              {showForgotPassword
                ? 'Enter your registered email to receive recovery instructions.'
                : isSignUp
                  ? 'Get started with autonomous social media management.'
                  : 'Welcome back. Enter your credentials to access your account.'}
            </p>
          </div>

          {/* Forgot Password Flow */}
          {showForgotPassword ? (
            <div className="space-y-4">
              {resetSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Reset link dispatched</span>
                  </div>
                  <p className="text-emerald-700 leading-relaxed">
                    We sent password reset instructions to <strong className="font-semibold">{resetEmail}</strong>. Please check your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSent(false);
                      setResetEmail('');
                      setResetError(null);
                    }}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
                  >
                    Return to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  {resetError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-lg text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xs"
                  >
                    {resetLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Send Reset Instructions</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetError(null);
                    }}
                    className="w-full text-xs font-medium text-slate-600 hover:text-slate-900 py-1.5 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to sign in</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                  or
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Error Alert */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-lg text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <span>{error}</span>
                    {isOperationNotAllowed && (
                      <p className="mt-1 text-[11px] text-rose-600">
                        Enable Email/Password under Firebase Authentication Console &gt; Sign-in method.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Email / Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setResetEmail(email);
                          setError(null);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-lg pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password on Sign Up */}
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-slate-300 focus:border-blue-600 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-600 transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me Option */}
                {!isSignUp && (
                  <div className="flex items-center gap-2 pt-0.5">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="text-xs text-slate-600 select-none cursor-pointer">
                      Keep me signed in on this device
                    </label>
                  </div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </>
                  )}
                </button>
              </form>

              {/* Toggle Sign In / Register Mode */}
              <div className="pt-2 text-center text-xs text-slate-600">
                {isSignUp ? (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setError(null);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer underline"
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setError(null);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer underline"
                    >
                      Create an account
                    </button>
                  </p>
                )}
              </div>

              {/* Subtle Security Badge */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Secure access to your AuraCast workspace</span>
              </div>
            </>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <p>© {new Date().getFullYear()} AuraCast. All rights reserved.</p>
      </footer>
    </div>
  );
}
