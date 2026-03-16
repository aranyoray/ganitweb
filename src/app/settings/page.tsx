'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import NavHeader from '@/components/NavHeader';

const SIGNAL_KEYS = [
  { key: 'eyeTracking', label: 'Eye Tracking' },
  { key: 'faceExpressions', label: 'Face Expressions' },
  { key: 'touchPatterns', label: 'Touch Patterns' },
  { key: 'voiceAnalysis', label: 'Voice Analysis' },
] as const;

type SignalKey = typeof SIGNAL_KEYS[number]['key'];

const DEFAULT_PIN = '1234';

function loadSignals(): Record<SignalKey, boolean> {
  if (typeof window === 'undefined') {
    return { eyeTracking: false, faceExpressions: false, touchPatterns: false, voiceAnalysis: false };
  }
  try {
    const stored = localStorage.getItem('ganit_learning_signals');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { eyeTracking: false, faceExpressions: false, touchPatterns: false, voiceAnalysis: false };
}

export default function SettingsPage() {
  const { deleteAccount, logout } = useAuth();

  // Learning signals
  const [signals, setSignals] = useState<Record<SignalKey, boolean>>(loadSignals);

  useEffect(() => {
    localStorage.setItem('ganit_learning_signals', JSON.stringify(signals));
  }, [signals]);

  function toggleSignal(key: SignalKey) {
    setSignals((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // Parent settings lock
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState(false);

  function handlePinSubmit() {
    if (pinValue === DEFAULT_PIN) {
      setIsUnlocked(true);
      setShowPinInput(false);
      setPinValue('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteAllData() {
    setIsDeleting(true);
    const success = await deleteAccount();
    setIsDeleting(false);
    if (success) {
      await logout();
    }
    setShowDeleteConfirm(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-slate-900 text-white">
      <NavHeader title="Settings" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Section: Learning Signals */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/40 px-4 mb-2">Learning Signals</h2>
          <div className="bg-white/5 rounded-lg overflow-hidden divide-y divide-white/5">
            {SIGNAL_KEYS.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm">{label}</span>
                <button
                  onClick={() => toggleSignal(key)}
                  className={`relative w-[51px] h-[31px] rounded-full transition-colors duration-200 ${
                    signals[key] ? 'bg-green-500' : 'bg-white/20'
                  }`}
                  role="switch"
                  aria-checked={signals[key]}
                >
                  <span
                    className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] rounded-full bg-white shadow transition-transform duration-200 ${
                      signals[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Parent Settings */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-white/40 px-4 mb-2">Parent Settings</h2>
          <div className="bg-white/5 rounded-lg overflow-hidden">
            {!isUnlocked ? (
              <div className="p-4 space-y-3">
                {!showPinInput ? (
                  <button
                    onClick={() => setShowPinInput(true)}
                    className="w-full rounded-lg bg-blue-500 hover:bg-blue-400 active:scale-[0.98] transition px-4 py-3 text-sm font-medium"
                  >
                    Unlock with PIN
                  </button>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-xs text-white/50">Enter Parent PIN</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={pinValue}
                      onChange={(e) => {
                        setPinValue(e.target.value.replace(/\D/g, ''));
                        setPinError(false);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
                      className={`w-full rounded-lg bg-white/10 border ${
                        pinError ? 'border-red-500' : 'border-white/20'
                      } px-4 py-3 text-center text-lg tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      placeholder="----"
                      autoFocus
                    />
                    {pinError && <p className="text-red-400 text-xs text-center">Incorrect PIN. Try again.</p>}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowPinInput(false); setPinValue(''); setPinError(false); }}
                        className="flex-1 rounded-lg bg-white/10 hover:bg-white/20 transition px-4 py-2.5 text-sm font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handlePinSubmit}
                        className="flex-1 rounded-lg bg-blue-500 hover:bg-blue-400 transition px-4 py-2.5 text-sm font-medium"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                <Link
                  href="/parent/dashboard"
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
                >
                  <span className="text-sm">Dashboard &amp; Reports</span>
                  <span className="text-white/30 text-sm">&rsaquo;</span>
                </Link>
                <Link
                  href="/parent/story"
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
                >
                  <span className="text-sm">Learning Story</span>
                  <span className="text-white/30 text-sm">&rsaquo;</span>
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition"
                >
                  Delete All Data
                </button>
                <button
                  onClick={() => setIsUnlocked(false)}
                  className="w-full text-left px-4 py-3 text-sm text-white/60 hover:bg-white/5 transition"
                >
                  Lock Parent Settings
                </button>
              </div>
            )}
          </div>
          {!isUnlocked && (
            <p className="text-xs text-white/30 px-4 mt-2">
              Dashboard, reports, and data controls are protected with PIN.
            </p>
          )}
        </section>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-800 rounded-lg border border-white/10 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-center">Delete All Data?</h3>
            <p className="text-sm text-white/60 text-center">
              This will permanently delete the account and all associated data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg bg-white/10 hover:bg-white/20 transition px-4 py-3 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllData}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-red-600 hover:bg-red-500 transition px-4 py-3 text-sm font-bold disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
