import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '../App';

/* ── The Raise badge ─────────────────────── */
const TheRaiseBadge = () => (
  <img src="/school-erp/the-raise-logo.png" alt="The Raise"
    style={{ height: 28, width: 'auto', display: 'block', userSelect: 'none' }} />
);

/* ── Credentials ──────────────────────────── */
const USERS = [
  { email: 'admin@srv.edu.in',    password: 'admin123',   role: 'Principal' },
  { email: 'teacher@srv.edu.in',  password: 'teacher123', role: 'Teacher'   },
  { email: 'accounts@srv.edu.in', password: 'fees123',    role: 'Accounts'  },
];

/* ── Custom CAPTCHA ───────────────────────── */
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
      setState('verified'); onVerify(true);
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
        background: state === 'verified' ? '#f0fdf4' : '#f8fafc',
        border: state === 'verified' ? '1px solid #86efac' : '1px solid #e2e8f0',
        borderRadius: 8, padding: '10px 14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={state === 'idle' ? open : undefined} style={{
            width: 22, height: 22, borderRadius: 4, flexShrink: 0,
            border: state === 'verified' ? '2px solid #22c55e' : '2px solid #cbd5e1',
            background: state === 'verified' ? '#22c55e' : 'white',
            cursor: state === 'idle' ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .2s',
          }}>
            {state === 'verified' && (
              <svg width="12" height="9" viewBox="0 0 13 10" fill="none">
                <path d="M1 5L4.5 8.5L12 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span style={{ fontSize: 13, color: '#475569', fontFamily: 'Roboto,sans-serif', userSelect: 'none' }}>I'm not a robot</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <svg width="32" height="32" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="none" stroke="#4285F4" strokeWidth="3"/>
            <path d="M32 10 L50 45 L14 45 Z" fill="#4285F4" opacity=".85"/>
            <path d="M24 37 L32 22 L40 37" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round"/>
            <circle cx="32" cy="40" r="3" fill="white"/>
          </svg>
          <span style={{ fontSize: 7, color: '#64748b', fontFamily: 'Roboto,sans-serif', fontWeight: 700, letterSpacing: '.5px' }}>reCAPTCHA</span>
        </div>
      </div>
      {state === 'challenge' && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 200,
          background: 'white', border: '1px solid #e2e8f0', borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: 16,
        }}>
          <p style={{ fontSize: 13, color: '#475569', marginBottom: 10 }}>Solve to verify you're human:</p>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px', fontSize: 20, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 12, border: '1px solid #e2e8f0' }}>
            {a} + {b} = ?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" value={ans} onChange={e => setAns(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') verify(); if (e.key === 'Escape') setState('idle'); }}
              placeholder="Answer" autoFocus
              style={{ flex: 1, padding: '9px 12px', border: err ? '1.5px solid #f43f5e' : '1.5px solid #e2e8f0', borderRadius: 7, fontSize: 14, outline: 'none', background: 'white', color: '#0f172a' }}
            />
            <button onClick={verify} style={{ background: 'linear-gradient(135deg,#4285F4,#1a73e8)', color: 'white', border: 'none', borderRadius: 7, padding: '9px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              Verify
            </button>
          </div>
          {err && <p style={{ fontSize: 12, color: '#f43f5e', marginTop: 7 }}>✗ Incorrect. Try again.</p>}
          <button onClick={() => setState('idle')} style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>×</button>
        </div>
      )}
    </div>
  );
};

/* ── Login page ───────────────────────────── */
export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
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
    await new Promise(r => setTimeout(r, 900));
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) { login(); navigate('/'); }
    else       { setError('Invalid email or password.'); }
    setLoading(false);
  };

  const inp: React.CSSProperties = {
    width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
    borderRadius: 8, padding: '10px 13px', color: '#0f172a', fontSize: 14,
    outline: 'none', transition: 'border-color .2s', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <style>{`
        @keyframes loginFadeUp { from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;} }
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>

      <div style={{ width: '100%', maxWidth: 420, animation: 'loginFadeUp .45s ease forwards' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, margin: '0 auto 12px',
            background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(139,92,246,0.35)',
          }}>
            <GraduationCap style={{ width: 28, height: 28, color: 'white' }} />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>Sri Ramakrishna Vidyalaya</h1>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>School ERP Portal · CBSE Affiliated</p>
          <div style={{ display: 'inline-flex', gap: 5, marginTop: 8 }}>
            {['Principal', 'Teacher', 'Accounts'].map(r => (
              <span key={r} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: '#ede9fe', color: '#7c3aed', border: '1px solid #ddd6fe' }}>{r}</span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px 22px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Sign in to access the school portal</p>

          {error && (
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 8, padding: '9px 13px', fontSize: 13, color: '#f43f5e', marginBottom: 12 }}>
              {error}
            </div>
          )}

          {/* Demo hint */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '9px 13px', marginBottom: 14 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', marginBottom: 2 }}>DEMO CREDENTIALS</p>
            <p style={{ fontSize: 11, color: '#64748b' }}>admin@srv.edu.in · <span style={{ color: '#0f172a', fontFamily: 'monospace', fontWeight: 600 }}>admin123</span></p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@srv.edu.in" style={inp}
                onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
                onBlur={e  => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inp, paddingRight: 42 }}
                  onFocus={e => (e.target.style.borderColor = '#8b5cf6')}
                  onBlur={e  => (e.target.style.borderColor = '#e2e8f0')}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <RobotCheck onVerify={setCaptcha} />

            <button type="submit" disabled={loading || !captcha} style={{
              width: '100%', padding: '11px',
              background: loading || !captcha ? '#e2e8f0' : 'linear-gradient(135deg,#8b5cf6,#3b82f6)',
              border: 'none', borderRadius: 8,
              color: loading || !captcha ? '#94a3b8' : 'white',
              fontSize: 14, fontWeight: 700, cursor: loading || !captcha ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: captcha && !loading ? '0 4px 14px rgba(139,92,246,0.35)' : 'none',
              transition: 'all .2s',
            }}>
              {loading
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Signing in…</>
                : <>Sign In <ArrowRight size={15} /></>
              }
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10 }}>
            © 2025 Sri Ramakrishna Vidyalaya, Chennai
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Powered by</span>
            <TheRaiseBadge />
          </div>
        </div>
      </div>
    </div>
  );
}
