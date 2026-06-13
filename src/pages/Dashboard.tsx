import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, GraduationCap, UserCheck, CalendarDays, Bell,
  DollarSign, Users, BookOpen, Bus, FileText,
  TrendingUp, Award, CheckCircle2, AlertCircle, Star,
  Menu, X, LogOut, Search, ChevronRight, Activity,
  MapPin, Clock, Building2, Phone, BookMarked,
  Shield,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from '../App';

/* ─── The Raise badge ───────────────────────────────────────── */
const TheRaiseBadge = () => (
  <div style={{
    display: 'inline-block',
    background: 'white',
    borderRadius: 6,
    padding: '3px 8px',
    lineHeight: 1,
    userSelect: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  }}>
    <svg viewBox="0 0 130 38" width="130" height="38" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      {/* THE — small red, top-left */}
      <text x="2" y="12"
        fontFamily="'Arial Black','Franklin Gothic Heavy',Impact,sans-serif"
        fontSize="11" fontWeight="900" fill="#E8231E" letterSpacing="2">THE</text>
      {/* RAISE — large blue */}
      <text x="2" y="36"
        fontFamily="'Arial Black','Franklin Gothic Heavy',Impact,sans-serif"
        fontSize="28" fontWeight="900" fill="#2E6DB4" letterSpacing="-0.5">RAISE</text>
      {/* Red curved arrow — sweeps from R/A area up to above I */}
      <path d="M 20 32 C 42 10, 75 3, 95 1"
        stroke="#E8231E" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Arrowhead */}
      <polygon points="95,1 82,9 94,17" fill="#E8231E"/>
    </svg>
  </div>
);

/* ─── Types ──────────────────────────────────────────────────── */
type SectionId =
  | 'overview' | 'students' | 'attendance' | 'calendar'
  | 'announcements' | 'fees' | 'staff' | 'library'
  | 'transport' | 'exams';

/* ─── Nav ────────────────────────────────────────────────────── */
const NAV = [
  { id: 'overview',      label: 'Overview',       icon: Home,          color: '#8b5cf6', glow: 'rgba(139,92,246,0.4)' },
  { id: 'students',      label: 'Students',       icon: GraduationCap, color: '#3b82f6', glow: 'rgba(59,130,246,0.4)' },
  { id: 'attendance',    label: 'Attendance',     icon: UserCheck,     color: '#10b981', glow: 'rgba(16,185,129,0.4)' },
  { id: 'calendar',      label: 'Calendar',       icon: CalendarDays,  color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
  { id: 'announcements', label: 'Announcements',  icon: Bell,          color: '#ec4899', glow: 'rgba(236,72,153,0.4)' },
  { id: 'fees',          label: 'Fees & Finance', icon: DollarSign,    color: '#14b8a6', glow: 'rgba(20,184,166,0.4)' },
  { id: 'staff',         label: 'Staff',          icon: Users,         color: '#6366f1', glow: 'rgba(99,102,241,0.4)' },
  { id: 'library',       label: 'Library',        icon: BookOpen,      color: '#f97316', glow: 'rgba(249,115,22,0.4)' },
  { id: 'transport',     label: 'Transport',      icon: Bus,           color: '#38bdf8', glow: 'rgba(56,189,248,0.4)' },
  { id: 'exams',         label: 'Examinations',   icon: FileText,      color: '#f43f5e', glow: 'rgba(244,63,94,0.4)'  },
] as const;

/* ─── Mock Data ──────────────────────────────────────────────── */
const SCHOOL = {
  name: 'Sri Ramakrishna Vidyalaya',
  tagline: 'Excellence in Education Since 1985',
  location: 'Chennai, Tamil Nadu',
  principal: 'Dr. K. Subramanian',
  affiliation: 'CBSE • Affil. No. 1234567',
  phone: '+91 44-2234-5678',
  email: 'info@srvschool.edu.in',
};

const CLASSES = [
  { grade: 'LKG',       students: 45,  boys: 22, girls: 23, sections: 2, att: 97, color: '#8b5cf6' },
  { grade: 'UKG',       students: 48,  boys: 25, girls: 23, sections: 2, att: 96, color: '#7c3aed' },
  { grade: 'Class I',   students: 95,  boys: 48, girls: 47, sections: 3, att: 97, color: '#3b82f6' },
  { grade: 'Class II',  students: 92,  boys: 47, girls: 45, sections: 3, att: 96, color: '#2563eb' },
  { grade: 'Class III', students: 98,  boys: 50, girls: 48, sections: 3, att: 95, color: '#10b981' },
  { grade: 'Class IV',  students: 94,  boys: 48, girls: 46, sections: 3, att: 94, color: '#059669' },
  { grade: 'Class V',   students: 102, boys: 52, girls: 50, sections: 3, att: 94, color: '#f59e0b' },
  { grade: 'Class VI',  students: 98,  boys: 50, girls: 48, sections: 3, att: 93, color: '#d97706' },
  { grade: 'Class VII', students: 95,  boys: 48, girls: 47, sections: 3, att: 92, color: '#ec4899' },
  { grade: 'Class VIII',students: 90,  boys: 46, girls: 44, sections: 3, att: 91, color: '#db2777' },
  { grade: 'Class IX',  students: 88,  boys: 45, girls: 43, sections: 3, att: 90, color: '#f97316' },
  { grade: 'Class X',   students: 85,  boys: 43, girls: 42, sections: 3, att: 89, color: '#ea580c' },
  { grade: 'Class XI',  students: 78,  boys: 40, girls: 38, sections: 2, att: 91, color: '#f43f5e' },
  { grade: 'Class XII', students: 76,  boys: 39, girls: 37, sections: 2, att: 92, color: '#be123c' },
];

const ATT_MONTHLY = [
  { month: 'Jan', rate: 96.2 }, { month: 'Feb', rate: 94.8 },
  { month: 'Mar', rate: 93.5 }, { month: 'Apr', rate: 91.2 },
  { month: 'May', rate: 95.4 }, { month: 'Jun', rate: 94.2 },
];

const FEE_MONTHLY = [
  { month: 'Jan', col: 6.2 }, { month: 'Feb', col: 4.8 },
  { month: 'Mar', col: 8.1 }, { month: 'Apr', col: 5.5 },
  { month: 'May', col: 7.2 }, { month: 'Jun', col: 12.4 },
];

const JUNE_EVENTS: Record<number, { label: string; type: 'holiday'|'exam'|'event'|'ptm' }[]> = {
  3:  [{ label: 'Eid-ul-Adha', type: 'holiday' }],
  5:  [{ label: 'Env. Day',    type: 'event'   }],
  13: [{ label: "Principal B'day", type: 'event' }],
  15: [{ label: 'Sports Meet', type: 'event'   }],
  20: [{ label: 'Quarterly Exams', type: 'exam' }],
  21: [{ label: 'Exams / PTM', type: 'exam' }],
  23: [{ label: 'Quarterly Exams', type: 'exam' }],
  24: [{ label: 'Quarterly Exams', type: 'exam' }],
  25: [{ label: 'Quarterly Exams', type: 'exam' }],
  28: [{ label: 'Term End',   type: 'event'   }],
};

const HOLIDAYS = [
  { date: 'Jan 14', name: 'Pongal',             type: 'National',  c: '#f59e0b' },
  { date: 'Jan 15', name: 'Thiruvalluvar Day',  type: 'State',     c: '#8b5cf6' },
  { date: 'Jan 26', name: 'Republic Day',       type: 'National',  c: '#f59e0b' },
  { date: 'Apr 14', name: 'Tamil New Year',     type: 'State',     c: '#8b5cf6' },
  { date: 'Apr 18', name: 'Good Friday',        type: 'Religious', c: '#ec4899' },
  { date: 'May 1',  name: 'May Day',            type: 'National',  c: '#f59e0b' },
  { date: 'Jun 3',  name: 'Eid-ul-Adha',        type: 'Religious', c: '#ec4899' },
  { date: 'Aug 15', name: 'Independence Day',   type: 'National',  c: '#f59e0b' },
  { date: 'Oct 2',  name: 'Gandhi Jayanthi',    type: 'National',  c: '#f59e0b' },
  { date: 'Oct 20', name: 'Diwali',             type: 'Religious', c: '#ec4899' },
  { date: 'Nov 14', name: "Children's Day",     type: 'School',    c: '#10b981' },
  { date: 'Dec 25', name: 'Christmas',          type: 'Religious', c: '#ec4899' },
];

const ANNOUNCEMENTS = [
  { id:1, type:'urgent',       icon:'🏅', color:'#ef4444', title:'Annual Sports Day — Dec 20',              desc:'All students must participate. Practice begins July 1st.',               date:'Jun 10', by:'Principal'     },
  { id:2, type:'exam',         icon:'📝', color:'#8b5cf6', title:'Quarterly Exam Schedule Released',         desc:'Exams from June 20–25. Timetable shared via portal.',                   date:'Jun 8',  by:'Exam Cell'     },
  { id:3, type:'fee',          icon:'💰', color:'#14b8a6', title:'Term 2 Fee — Last Date Jun 30',            desc:'Clear dues before June 30 to avoid ₹500/day late charge.',              date:'Jun 5',  by:'Accounts'      },
  { id:4, type:'event',        icon:'👨‍👩‍👧', color:'#3b82f6', title:'Parent-Teacher Meeting — Jun 21',          desc:'PTM for Classes 9–12, Saturday June 21st, 9 AM–1 PM.',                date:'Jun 1',  by:'Admin'         },
  { id:5, type:'achievement',  icon:'🔬', color:'#10b981', title:'Science Fair — 3 Gold Medals! 🥇',        desc:'Students won 3 gold medals at District Science Olympiad.',               date:'May 28', by:'Science Dept.' },
  { id:6, type:'event',        icon:'🧘', color:'#f59e0b', title:'International Yoga Day — Jun 21',         desc:'School-wide yoga session at 7 AM on the main ground.',                  date:'May 25', by:'Sports Dept.'  },
];

const FEES = [
  { cls:'LKG–UKG',        total:93,  paid:88,  pending:5,  amt:'₹4.4L'  },
  { cls:'Class I–V',      total:481, paid:440, pending:41, amt:'₹22.0L' },
  { cls:'Class VI–VIII',  total:283, paid:251, pending:32, amt:'₹12.6L' },
  { cls:'Class IX–X',     total:173, paid:148, pending:25, amt:'₹7.4L'  },
  { cls:'Class XI–XII',   total:154, paid:121, pending:33, amt:'₹6.0L'  },
];

const STAFF = [
  { dept:'Mathematics',     count:8,  hod:'Mr. R. Kumar',      present:7,  c:'#3b82f6' },
  { dept:'Sciences',        count:10, hod:'Mrs. P. Anitha',    present:9,  c:'#10b981' },
  { dept:'Languages',       count:12, hod:'Mr. S. Venkatesh',  present:11, c:'#8b5cf6' },
  { dept:'Social Science',  count:6,  hod:'Mrs. K. Meena',     present:6,  c:'#f59e0b' },
  { dept:'Computer Sci.',   count:5,  hod:'Mr. A. Rajesh',     present:5,  c:'#ec4899' },
  { dept:'Physical Edu.',   count:4,  hod:'Mr. B. Selvam',     present:4,  c:'#14b8a6' },
  { dept:'Arts & Music',    count:4,  hod:'Mrs. V. Lakshmi',   present:3,  c:'#f97316' },
  { dept:'Administration',  count:19, hod:'Mr. C. Gopal',      present:18, c:'#6366f1' },
];

const LIB_CATS = [
  { name:'Science & Math', count:2100, color:'#3b82f6' },
  { name:'Literature',     count:1850, color:'#8b5cf6' },
  { name:'History',        count:1200, color:'#f59e0b' },
  { name:'Reference',      count:980,  color:'#10b981' },
  { name:'Fiction',        count:1450, color:'#ec4899' },
  { name:'Others',         count:840,  color:'#94a3b8' },
];

const BUSES = [
  { route:'Route 1 – Anna Nagar', driver:'P. Murugan',  students:42, status:'On Time', c:'#10b981' },
  { route:'Route 2 – Adyar',      driver:'K. Rajan',    students:38, status:'On Time', c:'#10b981' },
  { route:'Route 3 – Velachery',  driver:'S. Srinivas', students:45, status:'Delayed', c:'#f59e0b' },
  { route:'Route 4 – Tambaram',   driver:'M. Pandian',  students:35, status:'On Time', c:'#10b981' },
  { route:'Route 5 – Porur',      driver:'V. Krishnan', students:40, status:'On Time', c:'#10b981' },
  { route:'Route 6 – Guindy',     driver:'A. Anand',    students:33, status:'On Time', c:'#10b981' },
  { route:'Route 7 – Perambur',   driver:'R. Selvam',   students:28, status:'Early',   c:'#3b82f6' },
  { route:'Route 8 – Chromepet',  driver:'B. Kumar',    students:36, status:'On Time', c:'#10b981' },
];

const EXAMS = [
  { subject:'Mathematics',    cls:'Class X',    date:'Jun 20', day:'Fri', time:'9:00 AM', hall:'Hall A', dur:'3 hrs',   c:'#3b82f6' },
  { subject:'Science',        cls:'Class IX',   date:'Jun 21', day:'Sat', time:'9:00 AM', hall:'Hall B', dur:'3 hrs',   c:'#10b981' },
  { subject:'English',        cls:'Class XII',  date:'Jun 23', day:'Mon', time:'9:00 AM', hall:'Hall C', dur:'3 hrs',   c:'#8b5cf6' },
  { subject:'Tamil',          cls:'Class XI',   date:'Jun 24', day:'Tue', time:'9:00 AM', hall:'Hall A', dur:'3 hrs',   c:'#f59e0b' },
  { subject:'Social Science', cls:'Class VIII', date:'Jun 25', day:'Wed', time:'9:00 AM', hall:'Hall B', dur:'2.5 hrs', c:'#ec4899' },
];

const JUNE_DAILY = [97,96,0,95,94,96,0,0,96,95,94,94,94,95,96,97,95,93,91,91,0,0,92,93,94,0,95,96,94,95];

/* ─── Hooks ──────────────────────────────────────────────────── */
const useCountUp = (target: number, dur = 1400) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf: number, start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(step); else setV(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
};

/* ─── Style helpers ──────────────────────────────────────────── */
const glass = (ex: React.CSSProperties = {}): React.CSSProperties => ({
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16, padding: 20, ...ex,
});

const bdg = (c: string): React.CSSProperties => ({
  display:'inline-flex', alignItems:'center', gap:4,
  background:`${c}20`, color:c, border:`1px solid ${c}40`,
  padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700,
});

const th: React.CSSProperties = {
  padding:'10px 16px', fontSize:10, fontWeight:700, color:'#64748b',
  textTransform:'uppercase', letterSpacing:'0.07em', textAlign:'left',
  borderBottom:'1px solid rgba(255,255,255,0.06)',
};
const td = (ex: React.CSSProperties = {}): React.CSSProperties => ({
  padding:'11px 16px', fontSize:13, color:'#94a3b8', verticalAlign:'middle', ...ex,
});

/* ─── Stat card ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, suffix='', sub, color, trend, up }: {
  icon: React.ElementType; label: string; value: number; suffix?: string;
  sub?: string; color: string; trend?: string; up?: boolean;
}) => {
  const n = useCountUp(value);
  return (
    <div className="srv-stat" style={glass({ position:'relative', overflow:'hidden', cursor:'default' })}>
      <div style={{ position:'absolute', top:-16, right:-16, width:80, height:80, borderRadius:'50%', background:`radial-gradient(circle,${color}25,transparent 70%)`, pointerEvents:'none' }} />
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:`${color}22`, border:`1px solid ${color}40`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon style={{ width:18, height:18, color }} />
        </div>
        {trend && (
          <span style={{ fontSize:11, fontWeight:700, color:up?'#10b981':'#f43f5e', background:up?'rgba(16,185,129,0.12)':'rgba(244,63,94,0.12)', padding:'3px 8px', borderRadius:999 }}>
            {up?'↑':'↓'} {trend}
          </span>
        )}
      </div>
      <div style={{ fontSize:11, color:'#64748b', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:800, color:'#f1f5f9', lineHeight:1 }}>{n.toLocaleString()}{suffix}</div>
      {sub && <div style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>{sub}</div>}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${color},${color}22)`, borderRadius:'0 0 14px 14px' }} />
    </div>
  );
};

const SectionHeader = ({ title, sub, color, icon: Icon }: { title:string; sub:string; color:string; icon:React.ElementType }) => (
  <div style={{ marginBottom:24 }}>
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:40, height:40, borderRadius:10, background:`${color}20`, border:`1px solid ${color}35`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon style={{ width:18, height:18, color }} />
      </div>
      <div>
        <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:'#f1f5f9' }}>{title}</h2>
        <p style={{ margin:0, fontSize:12, color:'#64748b' }}>{sub}</p>
      </div>
    </div>
  </div>
);

/* ═══════════════════ SECTIONS ═══════════════════════════════ */

const OverviewSection = () => {
  const kpis = [
    { icon:GraduationCap, label:'Total Students',   value:1247,  suffix:'', sub:'14 classes · 36 sections',    color:'#3b82f6', trend:'3.2%', up:true  },
    { icon:Users,         label:'Total Teachers',   value:68,    suffix:'', sub:'10 departments',               color:'#8b5cf6', trend:'2.9%', up:true  },
    { icon:UserCheck,     label:'Today Attendance', value:94,    suffix:'%',sub:'1,173 present · 74 absent',    color:'#10b981', trend:'0.8%', up:true  },
    { icon:DollarSign,    label:'Fee Collected',    value:12,    suffix:'L',sub:'₹18.6L total · 33% pending',   color:'#f59e0b', trend:'5.1%', up:true  },
    { icon:Building2,     label:'Active Classes',   value:42,    suffix:'', sub:'All sections running',          color:'#ec4899' },
    { icon:BookOpen,      label:'Library Books',    value:8420,  suffix:'', sub:'342 issued · 23 overdue',      color:'#f97316', trend:'1.2%', up:true  },
    { icon:Bus,           label:'Bus Routes',       value:8,     suffix:'', sub:'297 students transported',     color:'#38bdf8' },
    { icon:FileText,      label:'Upcoming Exams',   value:4,     suffix:'', sub:'Starting June 20',              color:'#f43f5e' },
  ];

  const ttStyle = { background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#e2e8f0' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Hero banner */}
      <div style={{ ...glass({ padding:0, overflow:'hidden' }), background:'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(59,130,246,0.08),rgba(16,185,129,0.06))', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          {[['-30%','-10%',280,'rgba(139,92,246,0.12)','18s'],['20%',undefined,240,'rgba(59,130,246,0.1)','22s',undefined,'-5%']].map((o,i)=>(
            <div key={i} className="srv-orb" style={{ position:'absolute', width:+o[2]!, height:+o[2]!, borderRadius:'50%', background:`radial-gradient(circle,${o[3]},transparent 70%)`, top:o[0] as string, left:o[1] as string|undefined, right:o[6] as string|undefined, animationDuration:o[4] as string }} />
          ))}
        </div>
        <div style={{ position:'relative', zIndex:1, padding:'24px 28px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ width:60, height:60, borderRadius:14, background:'linear-gradient(135deg,#8b5cf6,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'white', flexShrink:0, boxShadow:'0 6px 24px rgba(139,92,246,0.45)' }}>SRV</div>
              <div>
                <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:'#f1f5f9' }}>{SCHOOL.name}</h1>
                <p style={{ margin:'2px 0 0', fontSize:12, color:'#94a3b8' }}>{SCHOOL.tagline}</p>
                <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
                  <span style={bdg('#8b5cf6')}><MapPin size={9}/> {SCHOOL.location}</span>
                  <span style={bdg('#3b82f6')}><Shield size={9}/> {SCHOOL.affiliation}</span>
                  <span style={bdg('#10b981')}><Phone size={9}/> {SCHOOL.phone}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, color:'#64748b' }}>Principal</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#e2e8f0' }}>{SCHOOL.principal}</div>
              <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{SCHOOL.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="g4">
        {kpis.map((k,i)=>(
          <div key={k.label} className="srv-fade" style={{ animationDelay:`${i*60}ms` }}>
            <StatCard {...k} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="g2">
        <div style={glass()}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0' }}>Monthly Attendance Trend</div>
              <div style={{ fontSize:11, color:'#64748b' }}>Jan – Jun 2025</div>
            </div>
            <TrendingUp size={16} color="#10b981"/>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={ATT_MONTHLY}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[88,98]} tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={ttStyle} labelStyle={{ color:'#e2e8f0' }} itemStyle={{ color:'#10b981' }}/>
              <Area type="monotone" dataKey="rate" stroke="#10b981" fill="url(#ag)" strokeWidth={2} dot={{ fill:'#10b981', r:3 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={glass()}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0' }}>Fee Collection (₹L)</div>
              <div style={{ fontSize:11, color:'#64748b' }}>Monthly trend</div>
            </div>
            <DollarSign size={16} color="#f59e0b"/>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={FEE_MONTHLY} barSize={28}>
              <defs>
                <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#d97706"/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={ttStyle} itemStyle={{ color:'#f59e0b' }} labelStyle={{ color:'#e2e8f0' }}/>
              <Bar dataKey="col" fill="url(#fg)" radius={[6,6,0,0]} name="₹L Collected"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="g2">
        <div style={glass()}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0' }}>Recent Announcements</div>
            <Bell size={15} color="#ec4899"/>
          </div>
          {ANNOUNCEMENTS.slice(0,4).map(a=>(
            <div key={a.id} style={{ display:'flex', gap:10, padding:'9px 11px', borderRadius:10, background:`${a.color}10`, border:`1px solid ${a.color}22`, marginBottom:8 }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{a.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.title}</div>
                <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{a.by} · {a.date}</div>
              </div>
              <ChevronRight size={14} color="#475569" style={{ flexShrink:0 }}/>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ ...glass(), flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0', marginBottom:10 }}>Today's Schedule</div>
            {[['8:30 AM','School Assembly','#8b5cf6'],['9:00 AM','Classes Begin','#3b82f6'],['12:30 PM','Lunch Break','#f59e0b'],['4:30 PM','Dispersal','#10b981']].map(([t,e,c])=>(
              <div key={t} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:7 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:c, boxShadow:`0 0 6px ${c}`, flexShrink:0 }}/>
                <span style={{ fontSize:11, color:'#64748b', width:60, flexShrink:0 }}>{t}</span>
                <span style={{ fontSize:12, color:'#cbd5e1' }}>{e}</span>
              </div>
            ))}
          </div>
          <div style={{ ...glass(), flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0', marginBottom:10 }}>Upcoming Holidays</div>
            {HOLIDAYS.slice(5,9).map(h=>(
              <div key={h.name} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:h.c }}/>
                  <span style={{ fontSize:12, color:'#cbd5e1' }}>{h.name}</span>
                </div>
                <span style={{ fontSize:11, color:'#64748b' }}>{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentsSection = () => {
  const boys = CLASSES.reduce((a,c)=>a+c.boys,0);
  const girls = CLASSES.reduce((a,c)=>a+c.girls,0);
  const total = boys + girls;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <SectionHeader title="Student Management" sub="Class-wise data, demographics & admissions" color="#3b82f6" icon={GraduationCap}/>
      <div className="g4">
        {[
          { icon:GraduationCap, label:'Total Students', value:total, sub:'All classes',       color:'#3b82f6' },
          { icon:Users,         label:'Total Boys',     value:boys,  sub:'52% of students',   color:'#8b5cf6' },
          { icon:Users,         label:'Total Girls',    value:girls, sub:'48% of students',   color:'#ec4899' },
          { icon:Star,          label:'New Admissions', value:87,    sub:'Academic year 2025', color:'#10b981' },
        ].map(k=><StatCard key={k.label} {...k} />)}
      </div>
      <div style={glass()}>
        <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0', marginBottom:10 }}>Gender Distribution</div>
        <div style={{ height:14, borderRadius:999, overflow:'hidden', display:'flex' }}>
          <div className="srv-bar" style={{ height:'100%', width:`${Math.round(boys/total*100)}%`, background:'linear-gradient(90deg,#3b82f6,#8b5cf6)', borderRadius:'999px 0 0 999px' }}/>
          <div className="srv-bar" style={{ height:'100%', width:`${Math.round(girls/total*100)}%`, background:'linear-gradient(90deg,#ec4899,#db2777)', borderRadius:'0 999px 999px 0' }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
          <span style={{ fontSize:11, color:'#3b82f6', fontWeight:700 }}>Boys {boys} ({Math.round(boys/total*100)}%)</span>
          <span style={{ fontSize:11, color:'#ec4899', fontWeight:700 }}>Girls {girls} ({Math.round(girls/total*100)}%)</span>
        </div>
      </div>
      <div style={glass({ padding:0, overflow:'hidden' })}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:14, fontWeight:700, color:'#e2e8f0' }}>Class-wise Strength</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Grade','Sections','Boys','Girls','Total','Attendance'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {CLASSES.map(c=>(
                <tr key={c.grade} className="srv-tr">
                  <td style={td()}><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:8, height:8, borderRadius:'50%', background:c.color }}/><span style={{ fontWeight:600, color:'#e2e8f0' }}>{c.grade}</span></div></td>
                  <td style={td()}>{c.sections}</td>
                  <td style={td({ color:'#3b82f6', fontWeight:600 })}>{c.boys}</td>
                  <td style={td({ color:'#ec4899', fontWeight:600 })}>{c.girls}</td>
                  <td style={td({ color:'#f1f5f9', fontWeight:700 })}>{c.students}</td>
                  <td style={td()}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1, height:4, borderRadius:999, background:'rgba(255,255,255,0.07)', minWidth:50 }}>
                        <div className="srv-bar" style={{ height:'100%', borderRadius:999, width:`${c.att}%`, background:c.att>=95?'#10b981':c.att>=90?'#f59e0b':'#f43f5e' }}/>
                      </div>
                      <span style={{ fontSize:12, color:'#94a3b8', fontWeight:600 }}>{c.att}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AttendanceSection = () => {
  const hc = (v:number) => v===0?'rgba(255,255,255,0.04)':v>=95?'#10b981':v>=90?'#34d399':v>=85?'#f59e0b':v>=80?'#f97316':'#f43f5e';
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <SectionHeader title="Attendance Tracker" sub="Daily, monthly & class-wise attendance monitoring" color="#10b981" icon={UserCheck}/>
      <div className="g4">
        {[
          { icon:CheckCircle2, label:'Today Present',   value:1173, sub:'94.2% rate',         color:'#10b981' },
          { icon:AlertCircle,  label:'Today Absent',    value:74,   sub:'Notified to parents', color:'#f43f5e' },
          { icon:Activity,     label:'Monthly Average', value:94,   sub:'June 2025', suffix:'%', color:'#3b82f6' },
          { icon:Clock,        label:'Late Arrivals',   value:23,   sub:'After 8:45 AM',       color:'#f59e0b' },
        ].map(k=><StatCard key={k.label} {...k}/>)}
      </div>
      <div style={glass()}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:8 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0' }}>June 2025 — Attendance Heatmap</div>
            <div style={{ fontSize:11, color:'#64748b' }}>Each cell = daily attendance %</div>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {[['≥95%','#10b981'],['≥90%','#34d399'],['≥85%','#f59e0b'],['<85%','#f43f5e'],['Holiday','rgba(255,255,255,0.1)']].map(([l,c])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:c }}/>
                <span style={{ fontSize:10, color:'#64748b' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
            <div key={d} style={{ textAlign:'center', fontSize:10, color:'#475569', fontWeight:700, paddingBottom:4 }}>{d}</div>
          ))}
          {JUNE_DAILY.map((v,i)=>{
            const day=i+1, isToday=day===13;
            return (
              <div key={day} title={v>0?`Jun ${day}: ${v}% attendance`:`Jun ${day}: Holiday`}
                style={{ aspectRatio:'1', borderRadius:6, background:isToday?'linear-gradient(135deg,#8b5cf6,#3b82f6)':hc(v), display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:isToday?800:600, color:isToday?'white':v>0?'rgba(255,255,255,0.85)':'#475569', boxShadow:isToday?'0 0 12px rgba(139,92,246,0.5)':'none', cursor:'default', transition:'transform .1s' }}
                onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.15)')}
                onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}
              >{day}</div>
            );
          })}
        </div>
      </div>
      <div style={glass()}>
        <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0', marginBottom:14 }}>Today's Class-wise Attendance</div>
        <div className="g4" style={{ gap:10 }}>
          {CLASSES.map(c=>{
            const color=c.att>=95?'#10b981':c.att>=90?'#f59e0b':'#f43f5e';
            return (
              <div key={c.grade} style={{ padding:12, borderRadius:10, background:`${color}10`, border:`1px solid ${color}22`, textAlign:'center' }}>
                <div style={{ fontSize:11, color:'#94a3b8', marginBottom:3 }}>{c.grade}</div>
                <div style={{ fontSize:22, fontWeight:800, color }}>{c.att}%</div>
                <div style={{ fontSize:10, color:'#64748b' }}>{Math.round(c.students*c.att/100)}/{c.students}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CalendarSection = () => {
  const evColor: Record<string,string> = { holiday:'#f43f5e', exam:'#8b5cf6', event:'#3b82f6', ptm:'#f59e0b' };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <SectionHeader title="School Calendar" sub="Events, holidays, exams & schedules — June 2025" color="#f59e0b" icon={CalendarDays}/>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        {[['Holiday','#f43f5e'],['Exam','#8b5cf6'],['Event','#3b82f6'],['PTM','#f59e0b'],['Today','#10b981']].map(([l,c])=>(
          <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:12, height:12, borderRadius:3, background:c }}/>
            <span style={{ fontSize:12, color:'#94a3b8' }}>{l}</span>
          </div>
        ))}
      </div>
      <div className="g2" style={{ alignItems:'start' }}>
        <div style={glass()}>
          <div style={{ textAlign:'center', fontSize:16, fontWeight:700, color:'#f1f5f9', marginBottom:16 }}>June 2025</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
              <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:'#64748b', padding:'6px 0' }}>{d}</div>
            ))}
            {Array.from({length:30},(_,i)=>{
              const day=i+1, evs=JUNE_EVENTS[day]||[], isToday=day===13;
              const isHoliday=evs.some(e=>e.type==='holiday'), hasExam=evs.some(e=>e.type==='exam');
              const isWknd=(i)%7===0||(i)%7===6;
              return (
                <div key={day} style={{ padding:'5px 3px 3px', borderRadius:8, minHeight:52, cursor:'default',
                  background:isToday?'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(59,130,246,0.2))':isHoliday?'rgba(244,63,94,0.07)':hasExam?'rgba(139,92,246,0.07)':isWknd?'rgba(255,255,255,0.02)':'transparent',
                  border:isToday?'1px solid rgba(139,92,246,0.5)':'1px solid transparent',
                }}>
                  <div style={{ fontSize:12, fontWeight:isToday?800:600, color:isToday?'#c4b5fd':isHoliday?'#f43f5e':isWknd?'#64748b':'#e2e8f0', marginBottom:2 }}>{day}</div>
                  {evs.slice(0,2).map((ev,ei)=>(
                    <div key={ei} style={{ fontSize:8, fontWeight:600, lineHeight:1.3, color:evColor[ev.type], background:`${evColor[ev.type]}15`, borderRadius:3, padding:'1px 3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:1 }}>{ev.label}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={glass()}>
            <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0', marginBottom:12 }}>Holiday List 2025</div>
            {HOLIDAYS.map(h=>(
              <div key={h.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', borderRadius:8, background:`${h.c}10`, border:`1px solid ${h.c}20`, marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:h.c }}/>
                  <span style={{ fontSize:12, color:'#e2e8f0', fontWeight:600 }}>{h.name}</span>
                </div>
                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                  <span style={{ fontSize:11, color:'#64748b' }}>{h.date}</span>
                  <span style={bdg(h.c)}>{h.type}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={glass()}>
            <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0', marginBottom:12 }}>Upcoming Events</div>
            {[['🏃','Sports Meet','Jun 15'],['🧘','Yoga Day','Jun 21'],['📝','Quarterly Exams','Jun 20'],['👨‍👩‍👧','PTM (Class 9-12)','Jun 21'],['📅','Term End','Jun 28']].map(([icon,name,date])=>(
              <div key={name as string} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#e2e8f0' }}>{name}</div>
                  <div style={{ fontSize:11, color:'#64748b' }}>{date}</div>
                </div>
                <ChevronRight size={14} color="#475569"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AnnouncementsSection = () => {
  const types: Record<string,{label:string;color:string}> = {
    urgent:{label:'Urgent',color:'#f43f5e'}, exam:{label:'Exam',color:'#8b5cf6'},
    fee:{label:'Finance',color:'#14b8a6'}, event:{label:'Event',color:'#3b82f6'}, achievement:{label:'Achievement',color:'#10b981'},
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <SectionHeader title="Announcements & Circulars" sub="Notices, events, achievements & important updates" color="#ec4899" icon={Bell}/>
      <div className="g3">
        {[{ icon:FileText, label:'Total Circulars', value:24, color:'#ec4899' },{ icon:AlertCircle, label:'Urgent Notices', value:3, color:'#f43f5e' },{ icon:Award, label:'Achievements', value:7, color:'#10b981' }].map(k=><StatCard key={k.label} {...k}/>)}
      </div>
      {ANNOUNCEMENTS.map((a,i)=>{
        const tc=types[a.type]||{label:a.type,color:'#94a3b8'};
        return (
          <div key={a.id} className="srv-fade" style={{ ...glass({ padding:0, overflow:'hidden' }), animationDelay:`${i*60}ms` }}>
            <div style={{ display:'flex' }}>
              <div style={{ width:4, flexShrink:0, background:`linear-gradient(180deg,${a.color},${a.color}55)` }}/>
              <div style={{ padding:'14px 18px', flex:1 }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, flexWrap:'wrap', marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:22 }}>{a.icon}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0' }}>{a.title}</div>
                      <div style={{ fontSize:11, color:'#64748b' }}>{a.by} · {a.date}</div>
                    </div>
                  </div>
                  <span style={bdg(tc.color)}>{tc.label}</span>
                </div>
                <p style={{ fontSize:13, color:'#94a3b8', lineHeight:1.6 }}>{a.desc}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FeesSection = () => {
  const totS=FEES.reduce((a,f)=>a+f.total,0), totP=FEES.reduce((a,f)=>a+f.paid,0), totPend=FEES.reduce((a,f)=>a+f.pending,0);
  const pct=Math.round(totP/totS*100);
  const ttStyle = { background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#e2e8f0' };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <SectionHeader title="Fees & Finance" sub="Collection status, pending dues & monthly trends" color="#14b8a6" icon={DollarSign}/>
      <div className="g4">
        {[
          { icon:Users,         label:'Total Students', value:totS,  sub:'All classes',      color:'#14b8a6' },
          { icon:CheckCircle2,  label:'Fee Paid',       value:totP,  sub:`${pct}% collected`, color:'#10b981' },
          { icon:AlertCircle,   label:'Pending',        value:totPend,sub:'Needs follow-up',  color:'#f43f5e' },
          { icon:TrendingUp,    label:'Collected (₹L)', value:12,    sub:'of ₹18.6L total',   color:'#f59e0b' },
        ].map(k=><StatCard key={k.label} {...k}/>)}
      </div>
      <div style={glass()}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0' }}>Overall Collection Progress</div>
          <span style={{ fontSize:20, fontWeight:800, color:'#14b8a6' }}>{pct}%</span>
        </div>
        <div style={{ height:10, borderRadius:999, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
          <div className="srv-bar" style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#14b8a6,#10b981)', borderRadius:999 }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:12, color:'#64748b' }}>
          <span>₹12.4L collected</span><span>₹6.2L pending</span>
        </div>
      </div>
      <div style={glass({ padding:0, overflow:'hidden' })}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:14, fontWeight:700, color:'#e2e8f0' }}>Class-wise Fee Status</div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr>{['Class Group','Total','Paid','Pending','Collection %','Amount'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {FEES.map(f=>{
                const fp=Math.round(f.paid/f.total*100), c=fp>=90?'#10b981':fp>=75?'#f59e0b':'#f43f5e';
                return (
                  <tr key={f.cls} className="srv-tr">
                    <td style={td({ color:'#e2e8f0', fontWeight:700 })}>{f.cls}</td>
                    <td style={td()}>{f.total}</td>
                    <td style={td({ color:'#10b981', fontWeight:600 })}>{f.paid}</td>
                    <td style={td({ color:'#f43f5e', fontWeight:600 })}>{f.pending}</td>
                    <td style={td()}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ flex:1, height:4, borderRadius:999, background:'rgba(255,255,255,0.07)', minWidth:50 }}>
                          <div className="srv-bar" style={{ height:'100%', borderRadius:999, width:`${fp}%`, background:c }}/>
                        </div>
                        <span style={{ fontSize:12, color:c, fontWeight:700 }}>{fp}%</span>
                      </div>
                    </td>
                    <td style={td({ fontFamily:'monospace' })}>{f.amt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={glass()}>
        <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0', marginBottom:14 }}>Monthly Collection Trend (₹L)</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={FEE_MONTHLY} barSize={32}>
            <defs><linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14b8a6"/><stop offset="100%" stopColor="#0d9488"/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
            <XAxis dataKey="month" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={ttStyle} itemStyle={{ color:'#14b8a6' }} labelStyle={{ color:'#e2e8f0' }}/>
            <Bar dataKey="col" fill="url(#fg2)" radius={[6,6,0,0]} name="₹L"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StaffSection = () => {
  const totS=STAFF.reduce((a,d)=>a+d.count,0), totP=STAFF.reduce((a,d)=>a+d.present,0);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <SectionHeader title="Staff Management" sub="Department-wise staff, attendance & HOD details" color="#6366f1" icon={Users}/>
      <div className="g4">
        {[
          { icon:Users,        label:'Total Staff',   value:totS, sub:'Teaching + Admin',   color:'#6366f1' },
          { icon:CheckCircle2, label:'Present Today', value:totP, sub:`${Math.round(totP/totS*100)}% rate`,   color:'#10b981' },
          { icon:AlertCircle,  label:'On Leave',      value:totS-totP,sub:'Approved leaves',  color:'#f59e0b' },
          { icon:Building2,    label:'Departments',   value:8,    sub:'Academic + Admin',   color:'#ec4899' },
        ].map(k=><StatCard key={k.label} {...k}/>)}
      </div>
      <div className="g2">
        {STAFF.map(d=>{
          const p=Math.round(d.present/d.count*100);
          return (
            <div key={d.dept} style={glass({ padding:16 })}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:d.c, boxShadow:`0 0 6px ${d.c}` }}/>
                  <span style={{ fontSize:13, fontWeight:700, color:'#e2e8f0' }}>{d.dept}</span>
                </div>
                <span style={{ fontSize:20, fontWeight:800, color:d.c }}>{d.count}</span>
              </div>
              <div style={{ fontSize:11, color:'#64748b', marginBottom:8 }}>HOD: {d.hod}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ flex:1, height:4, borderRadius:999, background:'rgba(255,255,255,0.07)' }}>
                  <div className="srv-bar" style={{ height:'100%', width:`${p}%`, borderRadius:999, background:d.c }}/>
                </div>
                <span style={{ fontSize:11, color:d.c, fontWeight:700 }}>{d.present}/{d.count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LibrarySection = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
    <SectionHeader title="Library Management" sub="Books inventory, issued & reading statistics" color="#f97316" icon={BookOpen}/>
    <div className="g4">
      {[
        { icon:BookOpen,    label:'Total Books',  value:8420, sub:'All categories',          color:'#f97316' },
        { icon:BookMarked,  label:'Issued',       value:342,  sub:'With students',           color:'#3b82f6' },
        { icon:CheckCircle2,label:'Available',    value:8078, sub:'Ready to issue',          color:'#10b981' },
        { icon:AlertCircle, label:'Overdue',      value:23,   sub:'Past return date',        color:'#f43f5e' },
      ].map(k=><StatCard key={k.label} {...k}/>)}
    </div>
    <div className="g2">
      <div style={glass()}>
        <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0', marginBottom:14 }}>Books by Category</div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <PieChart width={160} height={160}>
            <Pie data={LIB_CATS} cx={75} cy={75} innerRadius={45} outerRadius={72} dataKey="count" stroke="none">
              {LIB_CATS.map((_,i)=><Cell key={i} fill={LIB_CATS[i].color}/>)}
            </Pie>
          </PieChart>
          <div style={{ flex:1 }}>
            {LIB_CATS.map(c=>(
              <div key={c.name} style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:c.color }}/>
                  <span style={{ fontSize:12, color:'#cbd5e1' }}>{c.name}</span>
                </div>
                <span style={{ fontSize:12, fontWeight:700, color:c.color }}>{c.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={glass()}>
          <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0', marginBottom:10 }}>Most Borrowed</div>
          {[['NCERT Mathematics X',48,'#3b82f6'],['Wings of Fire',41,'#8b5cf6'],['NCERT Science IX',38,'#10b981'],['The Alchemist',35,'#f59e0b'],['Sivagamiyin Sabatham',30,'#ec4899']].map(([t,n,c])=>(
            <div key={t as string} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:12, color:'#e2e8f0', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t}</span>
              <span style={bdg(c as string)}>{n}x</span>
            </div>
          ))}
        </div>
        <div style={glass()}>
          <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0', marginBottom:10 }}>New This Month (48)</div>
          {['Mathematics Reference Set','Tamil Classic Collection','Science Lab Manual','History of India Vol.3'].map(b=>(
            <div key={b} style={{ display:'flex', gap:7, marginBottom:8 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#f97316', marginTop:4, flexShrink:0 }}/>
              <span style={{ fontSize:12, color:'#94a3b8' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TransportSection = () => {
  const totS=BUSES.reduce((a,r)=>a+r.students,0), onTime=BUSES.filter(r=>r.status==='On Time').length;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <SectionHeader title="Transport Management" sub="Bus routes, drivers, student counts & live status" color="#38bdf8" icon={Bus}/>
      <div className="g4">
        {[
          { icon:MapPin,       label:'Total Routes',     value:8,     sub:'Active routes',        color:'#38bdf8' },
          { icon:Users,        label:'Students in Bus',  value:totS,  sub:'Daily commuters',      color:'#3b82f6' },
          { icon:CheckCircle2, label:'On Time Today',    value:onTime,sub:`${onTime} of 8 routes`,color:'#10b981' },
          { icon:Clock,        label:'Delayed Routes',   value:1,     sub:'Minor delay',          color:'#f59e0b' },
        ].map(k=><StatCard key={k.label} {...k}/>)}
      </div>
      <div style={glass({ padding:0, overflow:'hidden' })}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0' }}>Route Status</div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div className="srv-pulse" style={{ width:8, height:8, borderRadius:'50%', background:'#10b981' }}/>
            <span style={{ fontSize:11, color:'#64748b' }}>Live</span>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:12, padding:16 }}>
          {BUSES.map(r=>(
            <div key={r.route} style={{ padding:14, borderRadius:12, background:`${r.c}10`, border:`1px solid ${r.c}22` }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0' }}>{r.route}</div>
                <span style={bdg(r.c)}>{r.status}</span>
              </div>
              <div style={{ fontSize:12, color:'#94a3b8' }}>Driver: {r.driver}</div>
              <div style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}><span style={{ color:'#38bdf8', fontWeight:700 }}>{r.students}</span> students</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ExamsSection = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
    <SectionHeader title="Examinations" sub="Upcoming schedule, results & top performers" color="#f43f5e" icon={FileText}/>
    <div className="g4">
      {[
        { icon:FileText,     label:'Upcoming Exams',    value:5, sub:'June 20–25',        color:'#f43f5e' },
        { icon:GraduationCap,label:'Classes Appearing', value:5, sub:'Classes VIII–XII',  color:'#8b5cf6' },
        { icon:Building2,    label:'Hall Capacity',     value:300,sub:'3 exam halls',     color:'#3b82f6' },
        { icon:Users,        label:'Invigilators',      value:15, sub:'Assigned staff',   color:'#f59e0b' },
      ].map(k=><StatCard key={k.label} {...k}/>)}
    </div>
    <div style={glass({ padding:0, overflow:'hidden' })}>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:14, fontWeight:700, color:'#e2e8f0' }}>Quarterly Examination Schedule — June 2025</div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{['Subject','Class','Date','Day','Time','Hall','Duration'].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>
            {EXAMS.map(ex=>(
              <tr key={ex.subject} className="srv-tr">
                <td style={td()}><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:8, height:8, borderRadius:'50%', background:ex.c, boxShadow:`0 0 6px ${ex.c}` }}/><span style={{ fontWeight:700, color:'#e2e8f0' }}>{ex.subject}</span></div></td>
                <td style={td()}><span style={bdg(ex.c)}>{ex.cls}</span></td>
                <td style={td({ color:'#f43f5e', fontWeight:700 })}>{ex.date}</td>
                <td style={td()}>{ex.day}</td>
                <td style={td()}>{ex.time}</td>
                <td style={td({ color:'#38bdf8', fontWeight:600 })}>{ex.hall}</td>
                <td style={td()}>{ex.dur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div style={glass()}>
      <div style={{ fontSize:14, fontWeight:700, color:'#e2e8f0', marginBottom:14 }}>Previous Term — Top Performers</div>
      <div className="g4" style={{ gap:12 }}>
        {[['🥇','Kavya S.','Class XII','98.4%','#f59e0b'],['🥈','Arjun R.','Class X','97.8%','#94a3b8'],['🥉','Priya M.','Class XII','97.2%','#f97316'],['⭐','Rohan T.','Class XI','96.6%','#10b981']].map(([icon,name,cls,score,c])=>(
          <div key={name as string} style={{ padding:14, borderRadius:12, textAlign:'center', background:`${c as string}10`, border:`1px solid ${c as string}22` }}>
            <div style={{ fontSize:26, marginBottom:6 }}>{icon}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0' }}>{name}</div>
            <div style={{ fontSize:11, color:'#64748b' }}>{cls}</div>
            <div style={{ fontSize:20, fontWeight:800, color:c as string, marginTop:4 }}>{score}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════ MAIN DASHBOARD ════════════════════════ */
export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState<SectionId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const activeNav = NAV.find(n => n.id === active)!;

  const renderSection = () => {
    switch (active) {
      case 'overview':      return <OverviewSection/>;
      case 'students':      return <StudentsSection/>;
      case 'attendance':    return <AttendanceSection/>;
      case 'calendar':      return <CalendarSection/>;
      case 'announcements': return <AnnouncementsSection/>;
      case 'fees':          return <FeesSection/>;
      case 'staff':         return <StaffSection/>;
      case 'library':       return <LibrarySection/>;
      case 'transport':     return <TransportSection/>;
      case 'exams':         return <ExamsSection/>;
      default:              return <OverviewSection/>;
    }
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#06060f', fontFamily:'system-ui,-apple-system,sans-serif' }}>
      <style>{`
        @keyframes srvFadeIn  { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;} }
        @keyframes srvOrb     { 0%,100%{transform:translate(0,0);}33%{transform:translate(20px,-15px);}66%{transform:translate(-15px,10px);} }
        @keyframes srvPulse   { 0%,100%{opacity:1;}50%{opacity:.5;} }
        @keyframes srvBar     { from{width:0}to{} }
        @keyframes spin       { to{transform:rotate(360deg);} }

        .srv-fade { animation: srvFadeIn .4s ease both; }
        .srv-orb  { animation: srvOrb 18s ease-in-out infinite; }
        .srv-pulse{ animation: srvPulse 2s ease-in-out infinite; }
        .srv-bar  { animation: srvBar 1.2s cubic-bezier(.17,.67,.31,1) both; }
        .srv-stat { transition: transform .2s, box-shadow .2s; }
        .srv-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,.4) !important; }
        .srv-tr:hover td { background: rgba(255,255,255,0.025) !important; }
        .srv-nav  { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;cursor:pointer;transition:all .18s;background:transparent;border:1px solid transparent;width:100%;text-align:left; }
        .srv-nav:hover { background:rgba(255,255,255,.05); }

        .g2 { display:grid; gap:20px; grid-template-columns:1fr; }
        .g3 { display:grid; gap:16px; grid-template-columns:1fr; }
        .g4 { display:grid; gap:16px; grid-template-columns:1fr; }

        @media(min-width:600px) { .g2{grid-template-columns:1fr 1fr;} .g3{grid-template-columns:1fr 1fr;} .g4{grid-template-columns:1fr 1fr;} }
        @media(min-width:1024px){ .g3{grid-template-columns:repeat(3,1fr);} .g4{grid-template-columns:repeat(4,1fr);} }

        @media(min-width:900px) {
          .srv-sidebar { transform:translateX(0) !important; position:relative !important; flex-shrink:0; }
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:40, backdropFilter:'blur(4px)' }}/>
      )}

      {/* Sidebar */}
      <aside className="srv-sidebar" style={{
        position:'fixed', top:0, left:0, bottom:0, width:240, zIndex:50,
        background:'rgba(8,8,22,0.96)', borderRight:'1px solid rgba(255,255,255,0.07)',
        backdropFilter:'blur(20px)', display:'flex', flexDirection:'column',
        transform:sidebarOpen?'translateX(0)':'translateX(-100%)',
        transition:'transform .25s cubic-bezier(.4,0,.2,1)', overflowY:'auto',
      }}>
        {/* Logo */}
        <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#8b5cf6,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'white', flexShrink:0, boxShadow:'0 4px 16px rgba(139,92,246,0.4)' }}>SRV</div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:'#f1f5f9', lineHeight:1.2 }}>SRV School</div>
              <div style={{ fontSize:10, color:'#64748b' }}>ERP Portal 2025</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(item=>{
            const isActive=active===item.id, Icon=item.icon;
            return (
              <button key={item.id} className="srv-nav"
                onClick={()=>{ setActive(item.id as SectionId); setSidebarOpen(false); }}
                style={{ background:isActive?`${item.color}18`:'transparent', border:isActive?`1px solid ${item.color}28`:'1px solid transparent', boxShadow:isActive?`0 0 16px ${item.glow}`:'none' }}
              >
                <div style={{ width:30, height:30, borderRadius:8, flexShrink:0, background:isActive?`${item.color}25`:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon style={{ width:15, height:15, color:isActive?item.color:'#64748b' }}/>
                </div>
                <span style={{ fontSize:13, fontWeight:isActive?700:500, color:isActive?'#f1f5f9':'#94a3b8' }}>{item.label}</span>
                {isActive && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:item.color, boxShadow:`0 0 6px ${item.color}` }}/>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize:11, color:'#475569', marginBottom:8 }}>Academic Year 2025–26</div>
          <button onClick={()=>{ logout(); navigate('/login'); }} className="srv-nav"
            style={{ color:'#64748b', fontSize:12, fontWeight:500, gap:8, padding:'8px 12px' }}>
            <LogOut size={14}/>Logout
          </button>
          {/* Powered by The Raise */}
          <div style={{ marginTop:12, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <span style={{ fontSize:9, color:'#334155', letterSpacing:'0.04em', textTransform:'uppercase' }}>Powered by</span>
            <TheRaiseBadge size="sm" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Header */}
        <header style={{ position:'sticky', top:0, zIndex:30, background:'rgba(6,6,15,0.92)', borderBottom:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(20px)', padding:'10px 18px', display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, padding:6, cursor:'pointer', color:'#94a3b8', display:'flex' }}>
            {sidebarOpen?<X size={18}/>:<Menu size={18}/>}
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ width:26, height:26, borderRadius:6, background:`${activeNav.color}22`, border:`1px solid ${activeNav.color}35`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <activeNav.icon style={{ width:13, height:13, color:activeNav.color }}/>
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:'#f1f5f9' }}>{activeNav.label}</span>
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 11px', maxWidth:180 }}>
            <Search size={13} color="#64748b"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{ background:'transparent', border:'none', outline:'none', fontSize:12, color:'#e2e8f0', width:'100%' }}/>
          </div>
          <div style={{ textAlign:'right', fontSize:11, color:'#64748b' }}>
            <div style={{ fontWeight:700, color:'#94a3b8' }}>{time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</div>
            <div>{time.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</div>
          </div>
          <button style={{ position:'relative', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:7, cursor:'pointer', display:'flex', color:'#94a3b8' }}>
            <Bell size={15}/>
            <div style={{ position:'absolute', top:5, right:5, width:6, height:6, borderRadius:'50%', background:'#f43f5e', border:'1.5px solid #06060f' }}/>
          </button>
        </header>

        {/* Content */}
        <main key={active} className="srv-fade" style={{ flex:1, padding:'22px 18px 40px', overflowY:'auto' }}>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
