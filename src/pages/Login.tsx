import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '../App';

/* ── The Raise badge ─────────────────────── */
const TheRaiseBadge = () => (
  <img
    src="/school-erp/the-raise-logo.png"
    alt="The Raise"
    style={{ height: 28, width: 'auto', display: 'block', userSelect: 'none' }}
  />
);

/* ── Credentials (demo) ───────────────────── */
const USERS = [
  { email: 'admin@srv.edu.in',     password: 'admin123',   role: 'Principal'  },
  { email: 'teacher@srv.edu.in',   password: 'teacher123', role: 'Teacher'    },
  { email: 'accounts@srv.edu.in',  password: 'fees123',    role: 'Accounts'   },
];

/* ── Custom reCAPTCHA widget ──────────────── */
const RobotCheck = ({ onVerify }: { onVerify: (v: boolean) => void }) => {
  const [state, setState] = useState<'idle' | 'challenge' | 'verified'>('idle');
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [ans, setAns] = useState('');
  const [err, setErr] = useState(false);

  const open = () => {
    const x = Math.floor(Math.random() * 12) + 1;
    const y = Math.floor(Math.random() * 12) + 1;
    setA(x); setB(y); setAns(''); setErr(false);
    setState('challenge');
  };

  const verify = () => {
    if (parseInt(ans) === a + b) {
      setState('verified');
      onVerify(true);
    } else {
      setErr(true);
      const x = Math.floor(Math.random() * 12) + 1;
      const y = Math.floor(Math.random() * 12) + 1;
      setA(x); setB(y); setAns('');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: state === 'verified' ? 'rgba(34,197,94,0.06)' : '#f9f9f9',
        border: state === 'verified' ? '1px solid #22c55e' : '1px solid #d1d5db',
        borderRadius: 6, padding: '11px 14px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            onClick={state === 'idle' ? open : undefined}
            style={{
              width: 24, height: 24, borderRadius: 3, flexShrink: 0,
              border: state === 'verified' ? '2px solid #22c55e' : '2px solid #bbb',
              background: state === 'verified' ? '#22c55e' : 'white',
              cursor: state === 'idle' ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .2s',
              boxShadow: state === 'verified' ? '0 0 0 3px rgba(34,197,94,0.2)' : 'none',
            }}
          >
            {state === 'verified' && (
              <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                <path d="M1 5L4.5 8.5L12 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: 14, color: '#333', fontFamily: 'Roboto,sans-serif', userSelect: 'none' }}>
            I'm not a robot
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <svg width="36" height="36" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="none" stroke="#4285F4" strokeWidth="3" />
            <path d="M32 10 L50 45 L14 45 Z" fill="#4285F4" opacity=".85" />
            <path d="M24 37 L32 22 L40 37" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="32" cy="40" r="3" fill="white" />
          </svg>
          <span style={{ fontSize: 8, color: '#888', fontFamily: 'Roboto,sans-serif', fontWeight: 700, letterSpacing: '.5px' }}>reCAPTCHA</span>
          <span style={{ fontSize: 7, color: '#aaa', fontFamily: 'Roboto,sans-serif' }}>Privacy · Terms</span>
        </div>
      </div>

      {state === 'challenge' && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 200,
          background: 'white', border: '1px solid #e5e7eb', borderRadius: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <svg width="20" height="20" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="none" stroke="#4285F4" strokeWidth="3" /><path d="M32 10 L50 45 L14 45 Z" fill="#4285F4" opacity=".85" /></svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Quick Verification</span>
          </div>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 10, fontFamily: 'Roboto,sans-serif' }}>
            Solve to verify you're human:
          </p>
          <div style={{ background: '#f3f4f6', borderRadius: 8, padding: '10px 14px', fontSize: 20, fontWeight: 800, color: '#1f2937', textAlign: 'center', marginBottom: 12 }}>
            {a} + {b} = ?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number" value={ans} onChange={e => setAns(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') verify(); if (e.key === 'Escape') setState('idle'); }}
              placeholder="Your answer" autoFocus
              style={{ flex: 1, padding: '9px 12px', border: err ? '1.5px solid #ef4444' : '1.5px solid #d1d5db', borderRadius: 7, fontSize: 14, outline: 'none', background: err ? '#fff5f5' : 'white' }}
            />
            <button onClick={verify} style={{ background: 'linear-gradient(135deg,#4285F4,#1a73e8)', color: 'white', border: 'none', borderRadius: 7, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              Verify
            </button>
          </div>
          {err && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 7 }}>✗ Incorrect. Try again.</p>}
          <button onClick={() => setState('idle')} style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9ca3af' }}>×</button>
        </div>
      )}
    </div>
  );
};

/* ── Animated orb background ──────────────── */
const Orbs = () => (
  <>
    <style>{`
      @keyframes orbMove1 { 0%,100%{transform:translate(0,0);} 33%{transform:translate(40px,-30px);} 66%{transform:translate(-20px,20px);} }
      @keyframes orbMove2 { 0%,100%{transform:translate(0,0);} 33%{transform:translate(-35px,25px);} 66%{transform:translate(20px,-30px);} }
      @keyframes orbMove3 { 0%,100%{transform:translate(0,0);} 50%{transform:translate(15px,-20px);} }
      @keyframes loginFadeUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:none;} }
    `}</style>
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {[
        { w: 500, top: '-15%', left: '-10%', c: 'rgba(139,92,246,0.18)', dur: '20s' },
        { w: 400, bottom: '-10%', right: '-5%', c: 'rgba(59,130,246,0.14)', dur: '25s' },
        { w: 300, top: '40%', left: '55%', c: 'rgba(16,185,129,0.10)', dur: '18s' },
      ].map((o, i) => (
        <div key={i} style={{
          position: 'absolute', width: o.w, height: o.w, borderRadius: '50%',
          background: `radial-gradient(circle, ${o.c}, transparent 70%)`,
          top: (o as any).top, left: (o as any).left, right: (o as any).right, bottom: (o as any).bottom,
          animation: `orbMove${i + 1} ${o.dur} ease-in-out infinite`,
        }} />
      ))}
    </div>
  </>
);

/* ── Login page ───────────────────────────── */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [captcha, setCaptcha]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill all fields.'); return; }
    if (!captcha)             { setError('Please complete the CAPTCHA.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate auth delay

    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      login();
      navigate('/');
    } else {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  const inp: React.CSSProperties = {
    width: '100%', background: '#1c1c1c', border: '1px solid #2a2a2a',
    borderRadius: 10, padding: '11px 14px', color: '#ebebeb', fontSize: 14,
    outline: 'none', transition: 'border-color .2s', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#06060f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative' }}>
      <Orbs />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, animation: 'loginFadeUp .5s ease forwards' }}>

        {/* School logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 14px',
            background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(139,92,246,0.45)',
          }}>
            <GraduationCap style={{ width: 30, height: 30, color: 'white' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Sri Ramakrishna Vidyalaya</h1>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>School ERP Portal · CBSE Affiliated</p>
          <div style={{ display: 'inline-flex', gap: 6, marginTop: 8 }}>
            {['Principal', 'Teacher', 'Accounts'].map(r => (
              <span key={r} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '32px 28px', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Sign in to access the school portal</p>

          {error && (
            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f43f5e', marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Demo credentials hint */}
          <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', marginBottom: 4 }}>DEMO CREDENTIALS</p>
            <p style={{ fontSize: 11, color: '#94a3b8' }}>admin@srv.edu.in · <span style={{ color: '#f1f5f9', fontFamily: 'monospace' }}>admin123</span></p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@srv.edu.in" style={inp}
                onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
                onBlur={e  => (e.target.style.borderColor = '#2a2a2a')}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inp, paddingRight: 44 }}
                  onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
                  onBlur={e  => (e.target.style.borderColor = '#2a2a2a')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <RobotCheck onVerify={setCaptcha} />

            <button
              type="submit" disabled={loading || !captcha}
              style={{
                width: '100%', padding: '12px',
                background: loading || !captcha ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
                border: 'none', borderRadius: 10, color: loading || !captcha ? '#7c3aed' : 'white',
                fontSize: 14, fontWeight: 700, cursor: loading || !captcha ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: captcha && !loading ? '0 4px 20px rgba(139,92,246,0.4)' : 'none',
                transition: 'all .2s',
              }}
            >
              {loading
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in…</>
                : <>Sign In <ArrowRight size={16} /></>
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#334155', marginTop: 16 }}>
          © 2025 Sri Ramakrishna Vidyalaya, Chennai · All rights reserved
        </p>

        {/* Powered by The Raise */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 }}>
          <span style={{ fontSize: 11, color: '#475569' }}>Powered by</span>
          <TheRaiseBadge />
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
