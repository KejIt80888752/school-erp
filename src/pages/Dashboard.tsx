import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, GraduationCap, UserCheck, CalendarDays, Bell,
  DollarSign, Users, BookOpen, Bus, FileText,
  TrendingUp, Award, CheckCircle2, AlertCircle, Star,
  Menu, X, LogOut, Search, ChevronRight, Activity,
  MapPin, Clock, Building2, Phone, BookMarked, Shield, TrendingDown,
  MessageSquare, Receipt, Briefcase, Layers, QrCode, Smartphone,
  Wifi, CreditCard, Package, UserPlus, Video, Brain,
  Fingerprint, IdCard, Wallet, ClipboardList, BarChart2, Send,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from '../App';

/* ─── The Raise ──────────────────────────────────────────────── */
const TheRaiseBadge = () => (
  <img src="/school-erp/the-raise-logo.png" alt="The Raise"
    style={{ height: 26, width: 'auto', display: 'block' }} />
);

/* ─── Nav config ─────────────────────────────────────────────── */
type SectionId = 'overview'|'students'|'attendance'|'calendar'|'announcements'|'fees'|'staff'|'library'|'transport'|'exams'|'communication'|'expenses'|'hrpayroll'|'admission'|'platform';
const NAV = [
  { id:'overview',      label:'Overview',          icon:Home,           color:'#818cf8', bg:'rgba(129,140,248,0.15)' },
  { id:'students',      label:'Students',          icon:GraduationCap,  color:'#60a5fa', bg:'rgba(96,165,250,0.15)'  },
  { id:'admission',     label:'Admission',         icon:UserPlus,       color:'#a78bfa', bg:'rgba(167,139,250,0.15)' },
  { id:'attendance',    label:'Attendance',        icon:UserCheck,      color:'#34d399', bg:'rgba(52,211,153,0.15)'  },
  { id:'calendar',      label:'Calendar',          icon:CalendarDays,   color:'#fbbf24', bg:'rgba(251,191,36,0.15)'  },
  { id:'communication', label:'Communication',     icon:MessageSquare,  color:'#f472b6', bg:'rgba(244,114,182,0.15)' },
  { id:'announcements', label:'Notice & Homework', icon:Bell,           color:'#fb923c', bg:'rgba(251,146,60,0.15)'  },
  { id:'fees',          label:'Fees & Finance',    icon:DollarSign,     color:'#2dd4bf', bg:'rgba(45,212,191,0.15)'  },
  { id:'expenses',      label:'Expenses & Budget', icon:Receipt,        color:'#f87171', bg:'rgba(248,113,113,0.15)' },
  { id:'staff',         label:'Staff',             icon:Users,          color:'#a78bfa', bg:'rgba(167,139,250,0.15)' },
  { id:'hrpayroll',     label:'HR & Payroll',      icon:Briefcase,      color:'#34d399', bg:'rgba(52,211,153,0.15)'  },
  { id:'library',       label:'Library',           icon:BookOpen,       color:'#fb923c', bg:'rgba(251,146,60,0.15)'  },
  { id:'transport',     label:'Transport',         icon:Bus,            color:'#38bdf8', bg:'rgba(56,189,248,0.15)'  },
  { id:'exams',         label:'Examinations',      icon:FileText,       color:'#f87171', bg:'rgba(248,113,113,0.15)' },
  { id:'platform',      label:'Platform Features', icon:Layers,         color:'#fbbf24', bg:'rgba(251,191,36,0.15)'  },
] as const;

/* ─── Mock data ──────────────────────────────────────────────── */
const SCHOOL = { name:'Sri Ramakrishna Vidyalaya', tagline:'Excellence in Education Since 1985', location:'Chennai, Tamil Nadu', principal:'Dr. K. Subramanian', affiliation:'CBSE • Affil. No. 1234567', phone:'+91 44-2234-5678', email:'info@srvschool.edu.in' };
const CLASSES = [
  { grade:'LKG',       students:45,  boys:22, girls:23, sections:2, att:97, color:'#818cf8' },
  { grade:'UKG',       students:48,  boys:25, girls:23, sections:2, att:96, color:'#a78bfa' },
  { grade:'Class I',   students:95,  boys:48, girls:47, sections:3, att:97, color:'#60a5fa' },
  { grade:'Class II',  students:92,  boys:47, girls:45, sections:3, att:96, color:'#38bdf8' },
  { grade:'Class III', students:98,  boys:50, girls:48, sections:3, att:95, color:'#34d399' },
  { grade:'Class IV',  students:94,  boys:48, girls:46, sections:3, att:94, color:'#4ade80' },
  { grade:'Class V',   students:102, boys:52, girls:50, sections:3, att:94, color:'#fbbf24' },
  { grade:'Class VI',  students:98,  boys:50, girls:48, sections:3, att:93, color:'#fb923c' },
  { grade:'Class VII', students:95,  boys:48, girls:47, sections:3, att:92, color:'#f472b6' },
  { grade:'Class VIII',students:90,  boys:46, girls:44, sections:3, att:91, color:'#e879f9' },
  { grade:'Class IX',  students:88,  boys:45, girls:43, sections:3, att:90, color:'#fb923c' },
  { grade:'Class X',   students:85,  boys:43, girls:42, sections:3, att:89, color:'#f87171' },
  { grade:'Class XI',  students:78,  boys:40, girls:38, sections:2, att:91, color:'#f87171' },
  { grade:'Class XII', students:76,  boys:39, girls:37, sections:2, att:92, color:'#fca5a5' },
];
const ATT_MONTHLY = [{m:'Jan',r:96.2},{m:'Feb',r:94.8},{m:'Mar',r:93.5},{m:'Apr',r:91.2},{m:'May',r:95.4},{m:'Jun',r:94.2}];
const FEE_MONTHLY = [{m:'Jan',c:6.2},{m:'Feb',c:4.8},{m:'Mar',c:8.1},{m:'Apr',c:5.5},{m:'May',c:7.2},{m:'Jun',c:12.4}];
const JUNE_EVENTS: Record<number,{label:string;type:string}[]> = {
  3:[{label:'Eid-ul-Adha',type:'holiday'}], 5:[{label:'Env. Day',type:'event'}],
  13:[{label:"Principal B'day",type:'event'}], 15:[{label:'Sports Meet',type:'event'}],
  20:[{label:'Quarterly Exams',type:'exam'}], 21:[{label:'Exams / PTM',type:'exam'}],
  23:[{label:'Quarterly Exams',type:'exam'}], 24:[{label:'Quarterly Exams',type:'exam'}],
  25:[{label:'Quarterly Exams',type:'exam'}], 28:[{label:'Term End',type:'event'}],
};
const HOLIDAYS = [
  {date:'Jan 14',name:'Pongal',type:'National',c:'#fbbf24'},{date:'Jan 26',name:'Republic Day',type:'National',c:'#fbbf24'},
  {date:'Apr 14',name:'Tamil New Year',type:'State',c:'#818cf8'},{date:'Apr 18',name:'Good Friday',type:'Religious',c:'#f472b6'},
  {date:'Jun 3',name:'Eid-ul-Adha',type:'Religious',c:'#f472b6'},{date:'Aug 15',name:'Independence Day',type:'National',c:'#fbbf24'},
  {date:'Oct 2',name:'Gandhi Jayanthi',type:'National',c:'#fbbf24'},{date:'Oct 20',name:'Diwali',type:'Religious',c:'#f472b6'},
  {date:'Nov 14',name:"Children's Day",type:'School',c:'#34d399'},{date:'Dec 25',name:'Christmas',type:'Religious',c:'#f472b6'},
];
const ANNOUNCEMENTS = [
  {id:1,type:'urgent',    icon:'🏅',color:'#f87171',title:'Annual Sports Day — Dec 20',          desc:'All students must participate. Practice begins July 1st.',     date:'Jun 10',by:'Principal'},
  {id:2,type:'exam',      icon:'📝',color:'#818cf8',title:'Quarterly Exam Schedule Released',     desc:'Exams from June 20–25. Timetable shared via portal.',           date:'Jun 8', by:'Exam Cell'},
  {id:3,type:'fee',       icon:'💰',color:'#2dd4bf',title:'Term 2 Fee — Last Date Jun 30',        desc:'Clear dues before June 30 to avoid ₹500/day late charge.',      date:'Jun 5', by:'Accounts'},
  {id:4,type:'event',     icon:'👨‍👩‍👧',color:'#60a5fa',title:'Parent-Teacher Meeting — Jun 21',      desc:'PTM for Classes 9–12, Saturday June 21st, 9 AM–1 PM.',         date:'Jun 1', by:'Admin'},
  {id:5,type:'achievement',icon:'🔬',color:'#34d399',title:'Science Fair — 3 Gold Medals! 🥇',    desc:'Students won 3 gold medals at District Science Olympiad.',       date:'May 28',by:'Science Dept.'},
  {id:6,type:'event',     icon:'🧘',color:'#fbbf24',title:'International Yoga Day — Jun 21',     desc:'School-wide yoga session at 7 AM on the main ground.',          date:'May 25',by:'Sports Dept.'},
];
const FEES = [
  {cls:'LKG–UKG',       total:93, paid:88, pending:5,  amt:'₹4.4L'},
  {cls:'Class I–V',     total:481,paid:440,pending:41, amt:'₹22.0L'},
  {cls:'Class VI–VIII', total:283,paid:251,pending:32, amt:'₹12.6L'},
  {cls:'Class IX–X',    total:173,paid:148,pending:25, amt:'₹7.4L'},
  {cls:'Class XI–XII',  total:154,paid:121,pending:33, amt:'₹6.0L'},
];
const STAFF = [
  {dept:'Mathematics',   count:8, hod:'Mr. R. Kumar',     present:7, c:'#60a5fa'},
  {dept:'Sciences',      count:10,hod:'Mrs. P. Anitha',   present:9, c:'#34d399'},
  {dept:'Languages',     count:12,hod:'Mr. S. Venkatesh', present:11,c:'#818cf8'},
  {dept:'Social Science',count:6, hod:'Mrs. K. Meena',    present:6, c:'#fbbf24'},
  {dept:'Computer Sci.', count:5, hod:'Mr. A. Rajesh',    present:5, c:'#f472b6'},
  {dept:'Physical Edu.', count:4, hod:'Mr. B. Selvam',    present:4, c:'#2dd4bf'},
  {dept:'Arts & Music',  count:4, hod:'Mrs. V. Lakshmi',  present:3, c:'#fb923c'},
  {dept:'Administration',count:19,hod:'Mr. C. Gopal',     present:18,c:'#a78bfa'},
];
const LIB_CATS = [
  {name:'Science & Math',count:2100,color:'#60a5fa'},{name:'Literature',count:1850,color:'#818cf8'},
  {name:'History',       count:1200,color:'#fbbf24'},{name:'Reference', count:980, color:'#34d399'},
  {name:'Fiction',       count:1450,color:'#f472b6'},{name:'Others',    count:840, color:'#94a3b8'},
];
const BUSES = [
  {route:'Route 1 – Anna Nagar',driver:'P. Murugan', students:42,status:'On Time',c:'#34d399'},
  {route:'Route 2 – Adyar',     driver:'K. Rajan',  students:38,status:'On Time',c:'#34d399'},
  {route:'Route 3 – Velachery', driver:'S. Srinivas',students:45,status:'Delayed',c:'#fbbf24'},
  {route:'Route 4 – Tambaram',  driver:'M. Pandian',students:35,status:'On Time',c:'#34d399'},
  {route:'Route 5 – Porur',     driver:'V. Krishnan',students:40,status:'On Time',c:'#34d399'},
  {route:'Route 6 – Guindy',    driver:'A. Anand',  students:33,status:'On Time',c:'#34d399'},
  {route:'Route 7 – Perambur',  driver:'R. Selvam', students:28,status:'Early',  c:'#60a5fa'},
  {route:'Route 8 – Chromepet', driver:'B. Kumar',  students:36,status:'On Time',c:'#34d399'},
];
const EXAMS = [
  {subject:'Mathematics',   cls:'Class X',    date:'Jun 20',day:'Fri',time:'9:00 AM',hall:'Hall A',dur:'3 hrs',  c:'#60a5fa'},
  {subject:'Science',       cls:'Class IX',   date:'Jun 21',day:'Sat',time:'9:00 AM',hall:'Hall B',dur:'3 hrs',  c:'#34d399'},
  {subject:'English',       cls:'Class XII',  date:'Jun 23',day:'Mon',time:'9:00 AM',hall:'Hall C',dur:'3 hrs',  c:'#818cf8'},
  {subject:'Tamil',         cls:'Class XI',   date:'Jun 24',day:'Tue',time:'9:00 AM',hall:'Hall A',dur:'3 hrs',  c:'#fbbf24'},
  {subject:'Social Science',cls:'Class VIII', date:'Jun 25',day:'Wed',time:'9:00 AM',hall:'Hall B',dur:'2.5 hrs',c:'#f472b6'},
];
const JUNE_DAILY = [97,96,0,95,94,96,0,0,96,95,94,94,94,95,96,97,95,93,91,91,0,0,92,93,94,0,95,96,94,95];

/* ─── Hook ───────────────────────────────────────────────────── */
const useCountUp = (target:number,dur=1200) => {
  const [v,setV] = useState(0);
  useEffect(()=>{
    let raf:number,start:number;
    const step=(ts:number)=>{
      if(!start) start=ts;
      const p=Math.min((ts-start)/dur,1);
      setV(Math.round((1-Math.pow(1-p,3))*target));
      if(p<1) raf=requestAnimationFrame(step); else setV(target);
    };
    raf=requestAnimationFrame(step);
    return ()=>cancelAnimationFrame(raf);
  },[target,dur]);
  return v;
};

/* ─── Style helpers ──────────────────────────────────────────── */
const C = (ex:React.CSSProperties={}):React.CSSProperties => ({
  background:'#fff', border:'1px solid #e8ecf4', borderRadius:14,
  boxShadow:'0 1px 4px rgba(15,23,42,0.06)', ...ex,
});

const tt = {
  background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:8, padding:'8px 12px', fontSize:11, color:'#f1f5f9',
  boxShadow:'0 8px 24px rgba(0,0,0,0.2)',
};

/* ─── Gradient Stat Card ─────────────────────────────────────── */
const KPI = ({icon:Icon,label,value,suffix='',sub,grad,trend,up}:{
  icon:React.ElementType; label:string; value:number; suffix?:string;
  sub?:string; grad:string[]; trend?:string; up?:boolean;
}) => {
  const n = useCountUp(value);
  return (
    <div className="kpi" style={C({overflow:'hidden',position:'relative',cursor:'default',padding:0})}>
      {/* Top gradient strip */}
      <div style={{height:4,background:`linear-gradient(90deg,${grad[0]},${grad[1]})`,borderRadius:'14px 14px 0 0'}}/>
      <div style={{padding:'14px 16px'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
          <div style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${grad[0]},${grad[1]})`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 12px ${grad[0]}55`}}>
            <Icon style={{width:18,height:18,color:'white'}}/>
          </div>
          {trend && (
            <span style={{display:'flex',alignItems:'center',gap:3,fontSize:11,fontWeight:700,color:up?'#10b981':'#f43f5e',background:up?'#dcfce7':'#fee2e2',padding:'2px 7px',borderRadius:999}}>
              {up?<TrendingUp size={10}/>:<TrendingDown size={10}/>} {trend}
            </span>
          )}
        </div>
        <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#94a3b8',marginBottom:2}}>{label}</div>
        <div style={{fontSize:26,fontWeight:800,color:'#0f172a',lineHeight:1}}>{n.toLocaleString()}{suffix}</div>
        {sub && <div style={{fontSize:11,color:'#94a3b8',marginTop:3}}>{sub}</div>}
      </div>
    </div>
  );
};

/* ─── Section header ─────────────────────────────────────────── */
const SH = ({title,sub,color,icon:Icon}:{title:string;sub:string;color:string;icon:React.ElementType}) => (
  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
    <div style={{width:34,height:34,borderRadius:9,background:`${color}20`,border:`1px solid ${color}35`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <Icon style={{width:16,height:16,color}}/>
    </div>
    <div>
      <h2 style={{margin:0,fontSize:16,fontWeight:700,color:'#0f172a'}}>{title}</h2>
      <p style={{margin:0,fontSize:11,color:'#94a3b8'}}>{sub}</p>
    </div>
  </div>
);

const Bdg = ({c,children}:{c:string;children:React.ReactNode}) => (
  <span style={{display:'inline-flex',alignItems:'center',background:`${c}18`,color:c,border:`1px solid ${c}30`,padding:'2px 8px',borderRadius:999,fontSize:10,fontWeight:700,whiteSpace:'nowrap'}}>{children}</span>
);

const TH:React.CSSProperties = {padding:'7px 12px',fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.07em',textAlign:'left',borderBottom:'2px solid #f1f5f9',background:'#fafbff',whiteSpace:'nowrap'};
const TD = (ex:React.CSSProperties={}):React.CSSProperties => ({padding:'8px 12px',fontSize:12,color:'#475569',verticalAlign:'middle',...ex});

/* ══════════════════ OVERVIEW ═══════════════════════════════ */
const Overview = () => {
  const kpis = [
    {icon:GraduationCap,label:'Total Students',  value:1247,sub:'14 classes · 36 sections',  grad:['#6366f1','#818cf8'],trend:'3.2%',up:true},
    {icon:Users,        label:'Total Teachers',   value:68,  sub:'10 departments',             grad:['#3b82f6','#60a5fa'],trend:'2.9%',up:true},
    {icon:UserCheck,    label:'Today Attendance', value:94,  suffix:'%',sub:'1,173 present · 74 absent', grad:['#10b981','#34d399'],trend:'0.8%',up:true},
    {icon:DollarSign,   label:'Fee Collected',    value:12,  suffix:'L',sub:'₹18.6L total · 33% pending', grad:['#f59e0b','#fbbf24'],trend:'5.1%',up:true},
    {icon:Building2,    label:'Active Classes',   value:42,  sub:'All 36 sections running',   grad:['#ec4899','#f472b6']},
    {icon:BookOpen,     label:'Library Books',    value:8420,sub:'342 issued · 23 overdue',   grad:['#f97316','#fb923c'],trend:'1.2%',up:true},
    {icon:Bus,          label:'Bus Routes',       value:8,   sub:'297 students transported',  grad:['#0ea5e9','#38bdf8']},
    {icon:FileText,     label:'Upcoming Exams',   value:4,   sub:'Starting June 20',           grad:['#f43f5e','#f87171']},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {/* School hero */}
      <div style={C({background:'linear-gradient(135deg,#f5f3ff,#eff6ff)',padding:'16px 20px',border:'1px solid #e0e7ff'})}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#6366f1,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:16,color:'white',flexShrink:0,boxShadow:'0 6px 16px rgba(99,102,241,0.4)'}}>SRV</div>
            <div>
              <h1 style={{margin:0,fontSize:18,fontWeight:800,color:'#1e1b4b'}}>{SCHOOL.name}</h1>
              <p style={{margin:'2px 0 6px',fontSize:11,color:'#6366f1'}}>{SCHOOL.tagline}</p>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                <Bdg c="#6366f1"><MapPin size={8}/> {SCHOOL.location}</Bdg>
                <Bdg c="#3b82f6"><Shield size={8}/> {SCHOOL.affiliation}</Bdg>
                <Bdg c="#10b981"><Phone size={8}/> {SCHOOL.phone}</Bdg>
              </div>
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.06em'}}>Principal</div>
            <div style={{fontSize:14,fontWeight:700,color:'#1e293b'}}>{SCHOOL.principal}</div>
            <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>{SCHOOL.email}</div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="g4">{kpis.map((k,i)=><div key={k.label} className="srv-fade" style={{animationDelay:`${i*50}ms`}}><KPI {...k}/></div>)}</div>

      {/* Charts */}
      <div className="g2">
        <div style={C({padding:'14px 16px'})}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Monthly Attendance Trend</div>
              <div style={{fontSize:10,color:'#94a3b8'}}>Jan – Jun 2025</div>
            </div>
            <Bdg c="#10b981">94.2% avg</Bdg>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={ATT_MONTHLY}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
              <XAxis dataKey="m" tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis domain={[88,98]} tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tt}/>
              <Area type="monotone" dataKey="r" stroke="#10b981" fill="url(#ag)" strokeWidth={2.5} dot={{fill:'#10b981',r:3,strokeWidth:0}} name="Attendance %"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={C({padding:'14px 16px'})}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Fee Collection</div>
              <div style={{fontSize:10,color:'#94a3b8'}}>Monthly (₹L)</div>
            </div>
            <Bdg c="#f59e0b">₹12.4L this month</Bdg>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={FEE_MONTHLY} barSize={26}>
              <defs>
                <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#fbbf24"/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
              <XAxis dataKey="m" tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tt}/>
              <Bar dataKey="c" fill="url(#fg)" radius={[6,6,0,0]} name="₹L"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="g2">
        <div style={C({padding:'14px 16px'})}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
            <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Recent Announcements</span>
            <Bdg c="#ec4899">6 notices</Bdg>
          </div>
          {ANNOUNCEMENTS.slice(0,4).map(a=>(
            <div key={a.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:10,marginBottom:6,background:`${a.color}0a`,border:`1px solid ${a.color}18`,cursor:'pointer'}}>
              <span style={{fontSize:18,flexShrink:0}}>{a.icon}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:'#1e293b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.title}</div>
                <div style={{fontSize:10,color:'#94a3b8'}}>{a.by} · {a.date}</div>
              </div>
              <ChevronRight size={13} color="#cbd5e1"/>
            </div>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div style={C({padding:'14px 16px'})}>
            <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:8}}>Today's Schedule</div>
            {[['8:30 AM','School Assembly','#818cf8'],['9:00 AM','Classes Begin','#60a5fa'],['12:30 PM','Lunch Break','#fbbf24'],['4:30 PM','Dispersal','#34d399']].map(([t,e,c])=>(
              <div key={t} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:c,flexShrink:0,boxShadow:`0 0 5px ${c}`}}/>
                <span style={{fontSize:10,color:'#94a3b8',width:56,flexShrink:0,fontFamily:'monospace'}}>{t}</span>
                <span style={{fontSize:12,color:'#334155',fontWeight:500}}>{e}</span>
              </div>
            ))}
          </div>
          <div style={C({padding:'14px 16px'})}>
            <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:8}}>Upcoming Holidays</div>
            {HOLIDAYS.slice(4,8).map(h=>(
              <div key={h.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:h.c,flexShrink:0}}/>
                  <span style={{fontSize:12,color:'#334155'}}>{h.name}</span>
                </div>
                <div style={{display:'flex',gap:5,alignItems:'center'}}>
                  <span style={{fontSize:10,color:'#94a3b8'}}>{h.date}</span>
                  <Bdg c={h.c}>{h.type}</Bdg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════ STUDENTS ════════════════════════════════ */
const Students = () => {
  const boys=CLASSES.reduce((a,c)=>a+c.boys,0), girls=CLASSES.reduce((a,c)=>a+c.girls,0), total=boys+girls;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="Student Management" sub="Class-wise data, demographics & admissions" color="#60a5fa" icon={GraduationCap}/>
      <div className="g4">
        {[{icon:GraduationCap,label:'Total Students',value:total,sub:'All classes',grad:['#3b82f6','#60a5fa']},{icon:Users,label:'Total Boys',value:boys,sub:'52%',grad:['#6366f1','#818cf8']},{icon:Users,label:'Total Girls',value:girls,sub:'48%',grad:['#ec4899','#f472b6']},{icon:Star,label:'New Admissions',value:87,sub:'2025–26',grad:['#10b981','#34d399']}].map(k=><KPI key={k.label} {...k}/>)}
      </div>
      {/* Gender bar */}
      <div style={C({padding:'14px 16px'})}>
        <div style={{fontSize:12,fontWeight:700,color:'#0f172a',marginBottom:8}}>Gender Distribution</div>
        <div style={{height:12,borderRadius:999,overflow:'hidden',display:'flex'}}>
          <div className="srv-bar" style={{height:'100%',width:`${Math.round(boys/total*100)}%`,background:'linear-gradient(90deg,#3b82f6,#818cf8)',borderRadius:'999px 0 0 999px'}}/>
          <div className="srv-bar" style={{height:'100%',width:`${Math.round(girls/total*100)}%`,background:'linear-gradient(90deg,#ec4899,#f472b6)',borderRadius:'0 999px 999px 0'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
          <span style={{fontSize:11,color:'#3b82f6',fontWeight:700}}>Boys {boys} ({Math.round(boys/total*100)}%)</span>
          <span style={{fontSize:11,color:'#ec4899',fontWeight:700}}>Girls {girls} ({Math.round(girls/total*100)}%)</span>
        </div>
      </div>
      <div style={C({padding:0,overflow:'hidden'})}>
        <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Class-wise Strength</span>
          <Bdg c="#3b82f6">{CLASSES.length} classes</Bdg>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Grade','Sections','Boys','Girls','Total','Attendance'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {CLASSES.map((c,i)=>(
                <tr key={c.grade} className="srv-tr" style={{background:i%2===0?'transparent':'#fafbff'}}>
                  <td style={TD()}><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:8,height:8,borderRadius:'50%',background:c.color}}/><span style={{fontWeight:600,color:'#1e293b'}}>{c.grade}</span></div></td>
                  <td style={TD()}><Bdg c="#94a3b8">{c.sections} sec</Bdg></td>
                  <td style={TD({color:'#3b82f6',fontWeight:600})}>{c.boys}</td>
                  <td style={TD({color:'#ec4899',fontWeight:600})}>{c.girls}</td>
                  <td style={TD({fontWeight:700,color:'#0f172a'})}>{c.students}</td>
                  <td style={TD()}>
                    <div style={{display:'flex',alignItems:'center',gap:8,minWidth:100}}>
                      <div style={{flex:1,height:5,borderRadius:999,background:'#f1f5f9'}}>
                        <div className="srv-bar" style={{height:'100%',borderRadius:999,width:`${c.att}%`,background:c.att>=95?'linear-gradient(90deg,#10b981,#34d399)':c.att>=90?'linear-gradient(90deg,#f59e0b,#fbbf24)':'linear-gradient(90deg,#f43f5e,#f87171)'}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:700,color:c.att>=95?'#10b981':c.att>=90?'#f59e0b':'#f43f5e',width:30}}>{c.att}%</span>
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

/* ══════════════════ ATTENDANCE ══════════════════════════════ */
const Attendance = () => {
  const hc=(v:number)=>v===0?'#f1f5f9':v>=95?'#10b981':v>=90?'#34d399':v>=85?'#fbbf24':v>=80?'#fb923c':'#f87171';
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="Attendance Tracker" sub="Daily, monthly & class-wise monitoring" color="#34d399" icon={UserCheck}/>
      <div className="g4">
        {[{icon:CheckCircle2,label:'Present Today',value:1173,sub:'94.2%',grad:['#10b981','#34d399']},{icon:AlertCircle,label:'Absent Today',value:74,sub:'5.8%',grad:['#f43f5e','#f87171']},{icon:Activity,label:'Monthly Average',value:94,suffix:'%',sub:'June 2025',grad:['#3b82f6','#60a5fa']},{icon:Clock,label:'Late Arrivals',value:23,sub:'After 8:45 AM',grad:['#f59e0b','#fbbf24']}].map(k=><KPI key={k.label} {...k}/>)}
      </div>
      <div style={C({padding:'14px 16px'})}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div><div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>June 2025 Attendance Heatmap</div><div style={{fontSize:10,color:'#94a3b8'}}>Hover a day for details</div></div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {[['≥95%','#10b981'],['≥90%','#34d399'],['≥85%','#fbbf24'],['<85%','#f87171'],['Holiday','#f1f5f9']].map(([l,c])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:3}}><div style={{width:9,height:9,borderRadius:2,background:c,border:'1px solid #e2e8f0'}}/><span style={{fontSize:9,color:'#64748b'}}>{l}</span></div>
            ))}
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}}>
          {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} style={{textAlign:'center',fontSize:9,color:'#94a3b8',fontWeight:700,paddingBottom:3}}>{d}</div>)}
          {JUNE_DAILY.map((v,i)=>{
            const day=i+1,isT=day===13;
            return <div key={day} title={v>0?`Jun ${day}: ${v}%`:`Jun ${day}: Holiday`}
              style={{aspectRatio:'1',borderRadius:6,background:isT?'linear-gradient(135deg,#6366f1,#818cf8)':hc(v),display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:isT?800:600,color:isT?'white':v>0?'white':'#94a3b8',cursor:'default',border:isT?'2px solid #6366f1':'1px solid transparent',boxShadow:isT?'0 0 10px rgba(99,102,241,0.4)':'none',transition:'transform .1s'}}
              onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.15)')}
              onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}
            >{day}</div>;
          })}
        </div>
      </div>
      <div style={C({padding:'14px 16px'})}>
        <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10}}>Class-wise Today</div>
        <div className="g4" style={{gap:8}}>
          {CLASSES.map(c=>{const cl=c.att>=95?'#10b981':c.att>=90?'#fbbf24':'#f87171';return(
            <div key={c.grade} style={{padding:'10px 12px',borderRadius:10,background:`${cl}0d`,border:`1px solid ${cl}20`,textAlign:'center'}}>
              <div style={{fontSize:10,color:'#64748b',marginBottom:2}}>{c.grade}</div>
              <div style={{fontSize:20,fontWeight:800,color:cl}}>{c.att}%</div>
              <div style={{fontSize:9,color:'#94a3b8'}}>{Math.round(c.students*c.att/100)}/{c.students}</div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════ CALENDAR ════════════════════════════════ */
const Calendar = () => {
  const ec:Record<string,string>={holiday:'#f87171',exam:'#818cf8',event:'#60a5fa',ptm:'#fbbf24'};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="School Calendar" sub="Events, holidays, exams — June 2025" color="#fbbf24" icon={CalendarDays}/>
      <div className="g2" style={{alignItems:'start'}}>
        <div style={C({padding:'14px 16px'})}>
          <div style={{textAlign:'center',fontSize:15,fontWeight:700,color:'#0f172a',marginBottom:12}}>June 2025</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3}}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=><div key={d} style={{textAlign:'center',fontSize:9,fontWeight:700,color:'#94a3b8',padding:'4px 0'}}>{d}</div>)}
            {Array.from({length:30},(_,i)=>{
              const day=i+1,evs=JUNE_EVENTS[day]||[],isT=day===13;
              const isH=evs.some(e=>e.type==='holiday'),hasEx=evs.some(e=>e.type==='exam');
              const isW=i%7===0||i%7===6;
              return <div key={day} style={{padding:'4px 2px',borderRadius:7,minHeight:44,cursor:'default',background:isT?'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(96,165,250,0.15))':isH?'#fff1f2':hasEx?'#f5f3ff':isW?'#fafbff':'transparent',border:isT?'1.5px solid #6366f1':'1px solid transparent'}}>
                <div style={{fontSize:11,fontWeight:isT?800:600,color:isT?'#6366f1':isH?'#f87171':isW?'#94a3b8':'#1e293b',marginBottom:2}}>{day}</div>
                {evs.slice(0,1).map((ev,ei)=><div key={ei} style={{fontSize:7,fontWeight:700,color:ec[ev.type]||'#64748b',background:`${ec[ev.type]||'#94a3b8'}18`,borderRadius:3,padding:'1px 3px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ev.label}</div>)}
              </div>;
            })}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div style={C({padding:'14px 16px'})}>
            <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:8}}>Holiday List 2025</div>
            {HOLIDAYS.map(h=>(
              <div key={h.name} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 8px',borderRadius:8,background:`${h.c}0a`,marginBottom:5}}>
                <div style={{display:'flex',alignItems:'center',gap:7}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:h.c,flexShrink:0}}/>
                  <span style={{fontSize:12,color:'#1e293b',fontWeight:500}}>{h.name}</span>
                </div>
                <div style={{display:'flex',gap:5}}><span style={{fontSize:10,color:'#94a3b8'}}>{h.date}</span><Bdg c={h.c}>{h.type}</Bdg></div>
              </div>
            ))}
          </div>
          <div style={C({padding:'14px 16px'})}>
            <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:8}}>Upcoming Events</div>
            {[['🏃','Sports Meet','Jun 15'],['🧘','Yoga Day','Jun 21'],['📝','Quarterly Exams','Jun 20'],['👨‍👩‍👧','PTM (9-12)','Jun 21'],['📅','Term End','Jun 28']].map(([icon,name,date])=>(
              <div key={name} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',borderBottom:'1px solid #f8fafc'}}>
                <span style={{fontSize:16}}>{icon}</span>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:'#1e293b'}}>{name}</div><div style={{fontSize:10,color:'#94a3b8'}}>{date}</div></div>
                <ChevronRight size={13} color="#cbd5e1"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════ ANNOUNCEMENTS ═══════════════════════════ */
const Announcements = () => {
  const types:Record<string,string>={urgent:'#f87171',exam:'#818cf8',fee:'#2dd4bf',event:'#60a5fa',achievement:'#34d399'};
  const labels:Record<string,string>={urgent:'Urgent',exam:'Exam',fee:'Finance',event:'Event',achievement:'Achievement'};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="Announcements & Circulars" sub="Notices, events & achievements" color="#f472b6" icon={Bell}/>
      <div className="g3">
        {[{icon:FileText,label:'Total Circulars',value:24,grad:['#ec4899','#f472b6']},{icon:AlertCircle,label:'Urgent Notices',value:3,grad:['#f43f5e','#f87171']},{icon:Award,label:'Achievements',value:7,grad:['#10b981','#34d399']}].map(k=><KPI key={k.label} {...k}/>)}
      </div>
      {ANNOUNCEMENTS.map((a,i)=>(
        <div key={a.id} className="srv-fade" style={{...C({padding:0,overflow:'hidden'}),animationDelay:`${i*50}ms`}}>
          <div style={{display:'flex'}}>
            <div style={{width:4,flexShrink:0,background:`linear-gradient(180deg,${a.color},${a.color}66)`}}/>
            <div style={{padding:'10px 14px',flex:1}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:6}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:34,height:34,borderRadius:8,background:`${a.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{a.icon}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>{a.title}</div>
                    <div style={{fontSize:10,color:'#94a3b8'}}>{a.by} · {a.date}</div>
                  </div>
                </div>
                <Bdg c={types[a.type]||'#94a3b8'}>{labels[a.type]||a.type}</Bdg>
              </div>
              <p style={{fontSize:12,color:'#64748b',lineHeight:1.55,margin:0}}>{a.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════ FEES ════════════════════════════════════ */
const Fees = () => {
  const totS=FEES.reduce((a,f)=>a+f.total,0),totP=FEES.reduce((a,f)=>a+f.paid,0),totPend=FEES.reduce((a,f)=>a+f.pending,0),pct=Math.round(totP/totS*100);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="Fees & Finance" sub="Collection status, pending dues & trends" color="#2dd4bf" icon={DollarSign}/>
      <div className="g4">
        {[{icon:Users,label:'Total Students',value:totS,sub:'All classes',grad:['#14b8a6','#2dd4bf']},{icon:CheckCircle2,label:'Fee Paid',value:totP,sub:`${pct}% collected`,grad:['#10b981','#34d399']},{icon:AlertCircle,label:'Pending',value:totPend,sub:'Needs follow-up',grad:['#f43f5e','#f87171']},{icon:TrendingUp,label:'Collected (₹L)',value:12,sub:'of ₹18.6L total',grad:['#f59e0b','#fbbf24']}].map(k=><KPI key={k.label} {...k}/>)}
      </div>
      <div style={C({padding:'14px 16px'})}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,alignItems:'center'}}>
          <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Overall Collection Progress</span>
          <span style={{fontSize:22,fontWeight:800,background:'linear-gradient(135deg,#14b8a6,#10b981)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{pct}%</span>
        </div>
        <div style={{height:10,borderRadius:999,background:'#f1f5f9',overflow:'hidden'}}>
          <div className="srv-bar" style={{height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#14b8a6,#10b981)',borderRadius:999}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:11,color:'#94a3b8'}}>
          <span>₹12.4L collected</span><span>₹6.2L pending</span>
        </div>
      </div>
      <div style={C({padding:0,overflow:'hidden'})}>
        <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',fontSize:13,fontWeight:700,color:'#0f172a'}}>Class-wise Fee Status</div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Class Group','Total','Paid','Pending','Collection','Amount'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {FEES.map((f,i)=>{const fp=Math.round(f.paid/f.total*100),c=fp>=90?'#10b981':fp>=75?'#fbbf24':'#f87171';return(
                <tr key={f.cls} className="srv-tr" style={{background:i%2===0?'transparent':'#fafbff'}}>
                  <td style={TD({fontWeight:700,color:'#0f172a'})}>{f.cls}</td>
                  <td style={TD()}>{f.total}</td>
                  <td style={TD({color:'#10b981',fontWeight:600})}>{f.paid}</td>
                  <td style={TD({color:'#f43f5e',fontWeight:600})}>{f.pending}</td>
                  <td style={TD()}>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <div style={{flex:1,height:5,borderRadius:999,background:'#f1f5f9',minWidth:50}}>
                        <div className="srv-bar" style={{height:'100%',borderRadius:999,width:`${fp}%`,background:c}}/>
                      </div>
                      <span style={{fontSize:11,color:c,fontWeight:700,width:28}}>{fp}%</span>
                    </div>
                  </td>
                  <td style={TD({fontFamily:'monospace',color:'#475569'})}>{f.amt}</td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </div>
      <div style={C({padding:'14px 16px'})}>
        <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10}}>Monthly Collection Trend</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={FEE_MONTHLY} barSize={28}>
            <defs><linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14b8a6"/><stop offset="100%" stopColor="#2dd4bf"/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="m" tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:'#94a3b8',fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={tt}/>
            <Bar dataKey="c" fill="url(#fg2)" radius={[6,6,0,0]} name="₹L"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ══════════════════ STAFF ═══════════════════════════════════ */
const Staff = () => {
  const totS=STAFF.reduce((a,d)=>a+d.count,0),totP=STAFF.reduce((a,d)=>a+d.present,0);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="Staff Management" sub="Department-wise staff, attendance & HODs" color="#a78bfa" icon={Users}/>
      <div className="g4">
        {[{icon:Users,label:'Total Staff',value:totS,sub:'Teaching + Admin',grad:['#6366f1','#818cf8']},{icon:CheckCircle2,label:'Present Today',value:totP,sub:`${Math.round(totP/totS*100)}%`,grad:['#10b981','#34d399']},{icon:AlertCircle,label:'On Leave',value:totS-totP,sub:'Approved',grad:['#f59e0b','#fbbf24']},{icon:Building2,label:'Departments',value:8,sub:'Academic+Admin',grad:['#ec4899','#f472b6']}].map(k=><KPI key={k.label} {...k}/>)}
      </div>
      <div className="g2">
        {STAFF.map(d=>{const p=Math.round(d.present/d.count*100);return(
          <div key={d.dept} style={C({padding:'12px 14px'})}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:d.c,boxShadow:`0 0 5px ${d.c}`,flexShrink:0}}/>
                <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>{d.dept}</span>
              </div>
              <span style={{fontSize:22,fontWeight:800,color:d.c}}>{d.count}</span>
            </div>
            <div style={{fontSize:10,color:'#94a3b8',marginBottom:7}}>HOD: {d.hod}</div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{flex:1,height:5,borderRadius:999,background:'#f1f5f9'}}>
                <div className="srv-bar" style={{height:'100%',width:`${p}%`,borderRadius:999,background:`linear-gradient(90deg,${d.c},${d.c}cc)`}}/>
              </div>
              <span style={{fontSize:10,color:d.c,fontWeight:700}}>{d.present}/{d.count}</span>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
};

/* ══════════════════ LIBRARY ═════════════════════════════════ */
const Library = () => (
  <div style={{display:'flex',flexDirection:'column',gap:12}}>
    <SH title="Library Management" sub="Books inventory, issued & statistics" color="#fb923c" icon={BookOpen}/>
    <div className="g4">
      {[{icon:BookOpen,label:'Total Books',value:8420,sub:'All categories',grad:['#f97316','#fb923c']},{icon:BookMarked,label:'Issued',value:342,sub:'With students',grad:['#3b82f6','#60a5fa']},{icon:CheckCircle2,label:'Available',value:8078,sub:'Ready to issue',grad:['#10b981','#34d399']},{icon:AlertCircle,label:'Overdue',value:23,sub:'Past return date',grad:['#f43f5e','#f87171']}].map(k=><KPI key={k.label} {...k}/>)}
    </div>
    <div className="g2">
      <div style={C({padding:'14px 16px'})}>
        <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10}}>Books by Category</div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <PieChart width={150} height={150}>
            <Pie data={LIB_CATS} cx={70} cy={70} innerRadius={40} outerRadius={68} dataKey="count" stroke="none">
              {LIB_CATS.map((_,i)=><Cell key={i} fill={LIB_CATS[i].color}/>)}
            </Pie>
          </PieChart>
          <div style={{flex:1}}>
            {LIB_CATS.map(c=>(
              <div key={c.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:7,height:7,borderRadius:2,background:c.color}}/><span style={{fontSize:11,color:'#334155'}}>{c.name}</span></div>
                <span style={{fontSize:11,fontWeight:700,color:c.color}}>{c.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        <div style={C({padding:'14px 16px'})}>
          <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:8}}>Top Borrowed</div>
          {[['NCERT Mathematics X',48,'#60a5fa'],['Wings of Fire',41,'#818cf8'],['NCERT Science IX',38,'#34d399'],['The Alchemist',35,'#fbbf24'],['Sivagamiyin Sabatham',30,'#f472b6']].map(([t,n,c])=>(
            <div key={t as string} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:7}}>
              <span style={{fontSize:11,color:'#334155',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t}</span>
              <Bdg c={c as string}>{n}×</Bdg>
            </div>
          ))}
        </div>
        <div style={C({padding:'14px 16px'})}>
          <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:8}}>New Arrivals (48)</div>
          {['Mathematics Reference Set','Tamil Classic Collection','Science Lab Manual','History of India Vol.3'].map(b=>(
            <div key={b} style={{display:'flex',gap:8,marginBottom:7}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:'#fb923c',marginTop:4,flexShrink:0}}/>
              <span style={{fontSize:11,color:'#64748b'}}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════ TRANSPORT ═══════════════════════════════ */
const Transport = () => {
  const totS=BUSES.reduce((a,r)=>a+r.students,0),onT=BUSES.filter(r=>r.status==='On Time').length;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="Transport Management" sub="Bus routes, drivers & live status" color="#38bdf8" icon={Bus}/>
      <div className="g4">
        {[{icon:MapPin,label:'Total Routes',value:8,sub:'Active routes',grad:['#0ea5e9','#38bdf8']},{icon:Users,label:'Students in Bus',value:totS,sub:'Daily commuters',grad:['#3b82f6','#60a5fa']},{icon:CheckCircle2,label:'On Time',value:onT,sub:`${onT} of 8 routes`,grad:['#10b981','#34d399']},{icon:Clock,label:'Delayed',value:1,sub:'Minor delay',grad:['#f59e0b','#fbbf24']}].map(k=><KPI key={k.label} {...k}/>)}
      </div>
      <div style={C({padding:0,overflow:'hidden'})}>
        <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Live Route Status</span>
          <div style={{display:'flex',alignItems:'center',gap:5}}><div className="srv-pulse" style={{width:7,height:7,borderRadius:'50%',background:'#10b981'}}/><span style={{fontSize:10,color:'#64748b'}}>Live</span></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:10,padding:12}}>
          {BUSES.map(r=>(
            <div key={r.route} style={{padding:'10px 12px',borderRadius:10,background:`${r.c}0d`,border:`1px solid ${r.c}22`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:700,color:'#0f172a',flex:1}}>{r.route}</span>
                <Bdg c={r.c}>{r.status}</Bdg>
              </div>
              <div style={{fontSize:11,color:'#64748b'}}>Driver: {r.driver}</div>
              <div style={{fontSize:11,color:'#64748b',marginTop:2}}><span style={{color:r.c,fontWeight:700}}>{r.students}</span> students</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════ EXAMS ═══════════════════════════════════ */
const Exams = () => (
  <div style={{display:'flex',flexDirection:'column',gap:12}}>
    <SH title="Examinations" sub="Schedule, halls & top performers" color="#f87171" icon={FileText}/>
    <div className="g4">
      {[{icon:FileText,label:'Upcoming Exams',value:5,sub:'June 20–25',grad:['#f43f5e','#f87171']},{icon:GraduationCap,label:'Classes Appearing',value:5,sub:'VIII–XII',grad:['#818cf8','#a78bfa']},{icon:Building2,label:'Hall Capacity',value:300,sub:'3 exam halls',grad:['#3b82f6','#60a5fa']},{icon:Users,label:'Invigilators',value:15,sub:'Assigned staff',grad:['#f59e0b','#fbbf24']}].map(k=><KPI key={k.label} {...k}/>)}
    </div>
    <div style={C({padding:0,overflow:'hidden'})}>
      <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',fontSize:13,fontWeight:700,color:'#0f172a'}}>Quarterly Exam Schedule — June 2025</div>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>{['Subject','Class','Date','Day','Time','Hall','Duration'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {EXAMS.map((ex,i)=>(
              <tr key={ex.subject} className="srv-tr" style={{background:i%2===0?'transparent':'#fafbff'}}>
                <td style={TD()}><div style={{display:'flex',alignItems:'center',gap:7}}><div style={{width:7,height:7,borderRadius:'50%',background:ex.c,boxShadow:`0 0 5px ${ex.c}`}}/><span style={{fontWeight:700,color:'#0f172a'}}>{ex.subject}</span></div></td>
                <td style={TD()}><Bdg c={ex.c}>{ex.cls}</Bdg></td>
                <td style={TD({color:'#f87171',fontWeight:700})}>{ex.date}</td>
                <td style={TD()}>{ex.day}</td>
                <td style={TD({fontFamily:'monospace'})}>{ex.time}</td>
                <td style={TD({color:'#38bdf8',fontWeight:600})}>{ex.hall}</td>
                <td style={TD()}>{ex.dur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div style={C({padding:'14px 16px'})}>
      <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10}}>Previous Term — Top Performers</div>
      <div className="g4" style={{gap:8}}>
        {[['🥇','Kavya S.','Class XII','98.4%','#fbbf24'],['🥈','Arjun R.','Class X','97.8%','#94a3b8'],['🥉','Priya M.','Class XII','97.2%','#fb923c'],['⭐','Rohan T.','Class XI','96.6%','#34d399']].map(([icon,name,cls,score,c])=>(
          <div key={name as string} style={{padding:'12px',borderRadius:12,textAlign:'center',background:`${c as string}0d`,border:`1px solid ${c as string}20`}}>
            <div style={{fontSize:24,marginBottom:5}}>{icon}</div>
            <div style={{fontSize:12,fontWeight:700,color:'#0f172a'}}>{name}</div>
            <div style={{fontSize:10,color:'#94a3b8'}}>{cls}</div>
            <div style={{fontSize:18,fontWeight:800,color:c as string,marginTop:3}}>{score}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ══════════════════ ADMISSION ═══════════════════════════════ */
const Admission = () => {
  const admissions=[
    {name:'Arjun Sharma',   class:'Class I', parent:'R. Sharma',   phone:'98400-11111',status:'Approved', date:'Jun 10',c:'#34d399'},
    {name:'Priya Nair',     class:'LKG',     parent:'V. Nair',     phone:'98400-22222',status:'Pending',  date:'Jun 12',c:'#fbbf24'},
    {name:'Karthik M.',     class:'Class VI',parent:'M. Kumar',    phone:'98400-33333',status:'Approved', date:'Jun 13',c:'#34d399'},
    {name:'Sneha Reddy',    class:'Class IX',parent:'P. Reddy',    phone:'98400-44444',status:'Pending',  date:'Jun 14',c:'#fbbf24'},
    {name:'Rohan Das',      class:'UKG',     parent:'S. Das',      phone:'98400-55555',status:'Rejected', date:'Jun 9', c:'#f87171'},
    {name:'Ananya Pillai',  class:'Class IV',parent:'K. Pillai',   phone:'98400-66666',status:'Approved', date:'Jun 8', c:'#34d399'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="Admission Management" sub="Online form, QR code, WhatsApp link & auto account creation" color="#a78bfa" icon={UserPlus}/>
      <div className="g4">
        {[{icon:UserPlus,label:'Total Applications',value:87,sub:'2025–26 batch',grad:['#7c3aed','#a78bfa'],trend:'12%',up:true},{icon:CheckCircle2,label:'Approved',value:61,sub:'Accounts created',grad:['#10b981','#34d399']},{icon:Clock,label:'Pending Review',value:18,sub:'Awaiting approval',grad:['#f59e0b','#fbbf24']},{icon:AlertCircle,label:'Rejected',value:8,sub:'Docs incomplete',grad:['#f43f5e','#f87171']}].map(k=><KPI key={k.label} {...k}/>)}
      </div>
      {/* Share methods */}
      <div className="g3">
        {[
          {icon:QrCode,    label:'QR Code Admission',     desc:'Scan & fill form instantly — share at school gate or notice board',        color:'#818cf8',action:'Download QR'},
          {icon:Smartphone,label:'WhatsApp Link',         desc:'Share admission form link directly on parent WhatsApp groups',              color:'#34d399',action:'Copy Link'},
          {icon:Send,      label:'Email / SMS Invite',    desc:'Send individual admission link via email or SMS to specific parents',       color:'#60a5fa',action:'Send Now'},
        ].map(m=>(
          <div key={m.label} style={C({padding:'14px 16px',textAlign:'center'})}>
            <div style={{width:44,height:44,borderRadius:12,background:`${m.color}18`,border:`1px solid ${m.color}25`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px'}}>
              <m.icon style={{width:20,height:20,color:m.color}}/>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:4}}>{m.label}</div>
            <div style={{fontSize:11,color:'#94a3b8',marginBottom:10,lineHeight:1.5}}>{m.desc}</div>
            <button style={{background:`linear-gradient(135deg,${m.color},${m.color}cc)`,color:'white',border:'none',borderRadius:8,padding:'6px 14px',fontSize:11,fontWeight:700,cursor:'pointer'}}>{m.action}</button>
          </div>
        ))}
      </div>
      {/* Admission list */}
      <div style={C({padding:0,overflow:'hidden'})}>
        <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Recent Applications</span>
          <Bdg c="#a78bfa">Auto-creates parent + student account on approval</Bdg>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Student Name','Class','Parent','Phone','Date','Status','Action'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {admissions.map((a,i)=>(
                <tr key={a.name} className="srv-tr" style={{background:i%2===0?'transparent':'#fafbff'}}>
                  <td style={TD({fontWeight:700,color:'#0f172a'})}>{a.name}</td>
                  <td style={TD()}><Bdg c="#60a5fa">{a.class}</Bdg></td>
                  <td style={TD()}>{a.parent}</td>
                  <td style={TD({fontFamily:'monospace'})}>{a.phone}</td>
                  <td style={TD({color:'#94a3b8'})}>{a.date}</td>
                  <td style={TD()}><Bdg c={a.c}>{a.status}</Bdg></td>
                  <td style={TD()}>
                    {a.status==='Pending' && <button style={{background:'linear-gradient(135deg,#10b981,#34d399)',color:'white',border:'none',borderRadius:6,padding:'4px 10px',fontSize:10,fontWeight:700,cursor:'pointer'}}>Approve</button>}
                    {a.status==='Approved' && <span style={{fontSize:11,color:'#34d399',fontWeight:600}}>✓ Account Created</span>}
                    {a.status==='Rejected' && <span style={{fontSize:11,color:'#f87171',fontWeight:600}}>✗ Rejected</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Settings */}
      <div className="g2">
        <div style={C({padding:'14px 16px'})}>
          <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10}}>Admission Settings</div>
          {[['Academic Year','2025–26','#818cf8'],['Application Fee','₹500 (One-time)','#2dd4bf'],['Open Classes','LKG to Class IX','#34d399'],['Last Date','July 31, 2025','#f87171'],['Required Docs','Birth Cert, Transfer Cert, Photos','#fbbf24']].map(([k,v,c])=>(
            <div key={k as string} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:'1px solid #f8fafc'}}>
              <span style={{fontSize:12,color:'#64748b'}}>{k}</span><span style={{fontSize:12,fontWeight:600,color:c as string}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={C({padding:'14px 16px'})}>
          <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10}}>Documents Required</div>
          {['Birth Certificate (Original + Copy)','Previous School Transfer Certificate','Passport Size Photos (4 nos.)','Aadhaar Card (Student + Parent)','Caste Certificate (if applicable)','Medical Fitness Certificate'].map((d,i)=>(
            <div key={i} style={{display:'flex',gap:8,marginBottom:7}}>
              <CheckCircle2 size={13} color="#34d399" style={{flexShrink:0,marginTop:1}}/>
              <span style={{fontSize:11,color:'#475569'}}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════ COMMUNICATION ═══════════════════════════ */
const Communication = () => {
  const msgs=[
    {to:'All Parents',  subject:'Sports Day Reminder',       channel:'WhatsApp',status:'Delivered',count:847,date:'Jun 13'},
    {to:'Class X',      subject:'Exam Timetable Released',   channel:'SMS',     status:'Delivered',count:85, date:'Jun 12'},
    {to:'All Staff',    subject:'Staff Meeting — June 15',   channel:'In-App',  status:'Delivered',count:68, date:'Jun 11'},
    {to:'Defaulters',   subject:'Fee Due Reminder',          channel:'Email',   status:'Delivered',count:74, date:'Jun 10'},
    {to:'Parents LKG',  subject:'PTM Schedule',              channel:'WhatsApp',status:'Sent',     count:45, date:'Jun 9'},
  ];
  const hw=[
    {class:'Class X',   subject:'Mathematics',  title:'Chapter 5 Exercise',   due:'Jun 16',status:'15 Pending',c:'#f87171'},
    {class:'Class IX',  subject:'Science',      title:'Lab Report – Osmosis',  due:'Jun 17',status:'Completed',c:'#34d399'},
    {class:'Class VIII',subject:'English',      title:'Essay Writing',         due:'Jun 18',status:'8 Pending', c:'#fbbf24'},
    {class:'Class VII', subject:'History',      title:'Map Work Chapter 3',    due:'Jun 19',status:'Completed',c:'#34d399'},
  ];
  const channels=[
    {icon:Smartphone,label:'WhatsApp',   cost:'₹0.30/msg',  color:'#34d399',free:false,info:'Rich media, read receipts'},
    {icon:MessageSquare,label:'SMS',     cost:'₹0.15/msg',  color:'#60a5fa',free:false,info:'Universal reach'},
    {icon:Send,       label:'Email',     cost:'₹0.05/msg',  color:'#f472b6',free:false,info:'Attachments supported'},
    {icon:Bell,       label:'In-App',    cost:'Free',        color:'#818cf8',free:true, info:'Instant push notification'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="Communication Hub" sub="SMS · WhatsApp · Email · In-App notifications" color="#f472b6" icon={MessageSquare}/>
      <div className="g4">
        {[{icon:Send,label:'Msgs This Month',value:2847,sub:'All channels combined',grad:['#ec4899','#f472b6'],trend:'18%',up:true},{icon:Smartphone,label:'WhatsApp Sent',value:1240,sub:'₹372 spent',grad:['#10b981','#34d399']},{icon:MessageSquare,label:'SMS Sent',value:890,sub:'₹133 spent',grad:['#3b82f6','#60a5fa']},{icon:Bell,label:'In-App (Free)',value:717,sub:'No cost',grad:['#818cf8','#a78bfa']}].map(k=><KPI key={k.label} {...k}/>)}
      </div>
      {/* Channels */}
      <div className="g4">
        {channels.map(ch=>(
          <div key={ch.label} style={C({padding:'14px 16px',textAlign:'center',border:`1px solid ${ch.color}25`,background:`${ch.color}06`})}>
            <div style={{width:40,height:40,borderRadius:10,background:`${ch.color}18`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px'}}>
              <ch.icon style={{width:18,height:18,color:ch.color}}/>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>{ch.label}</div>
            <div style={{fontSize:14,fontWeight:800,color:ch.color,margin:'4px 0'}}>{ch.cost}</div>
            <div style={{fontSize:10,color:'#94a3b8'}}>{ch.info}</div>
            {ch.free && <div style={{marginTop:6,fontSize:9,fontWeight:700,color:'#34d399',background:'#dcfce7',padding:'2px 8px',borderRadius:999,display:'inline-block'}}>NO COST</div>}
          </div>
        ))}
      </div>
      {/* Notice Board */}
      <div style={C({padding:0,overflow:'hidden'})}>
        <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',fontSize:13,fontWeight:700,color:'#0f172a'}}>Recent Messages Sent</div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Recipients','Subject','Channel','Reach','Status','Date'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {msgs.map((m,i)=>{
                const cc=m.channel==='WhatsApp'?'#34d399':m.channel==='SMS'?'#60a5fa':m.channel==='Email'?'#f472b6':'#818cf8';
                return(<tr key={i} className="srv-tr" style={{background:i%2===0?'transparent':'#fafbff'}}>
                  <td style={TD({fontWeight:600,color:'#0f172a'})}>{m.to}</td>
                  <td style={TD()}>{m.subject}</td>
                  <td style={TD()}><Bdg c={cc}>{m.channel}</Bdg></td>
                  <td style={TD({fontWeight:700,color:'#0f172a'})}>{m.count}</td>
                  <td style={TD()}><Bdg c="#34d399">{m.status}</Bdg></td>
                  <td style={TD({color:'#94a3b8'})}>{m.date}</td>
                </tr>);
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Homework */}
      <div style={C({padding:0,overflow:'hidden'})}>
        <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Homework Tracker</span>
          <Bdg c="#fb923c">Parents notified via Mobile App instantly</Bdg>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Class','Subject','Title','Due Date','Status'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {hw.map((h,i)=>(
                <tr key={i} className="srv-tr" style={{background:i%2===0?'transparent':'#fafbff'}}>
                  <td style={TD()}><Bdg c="#60a5fa">{h.class}</Bdg></td>
                  <td style={TD({color:'#475569'})}>{h.subject}</td>
                  <td style={TD({fontWeight:600,color:'#0f172a'})}>{h.title}</td>
                  <td style={TD({color:'#94a3b8',fontFamily:'monospace'})}>{h.due}</td>
                  <td style={TD()}><Bdg c={h.c}>{h.status}</Bdg></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════ EXPENSES & BUDGET ═══════════════════════ */
const ExpensesBudget = () => {
  const expenses=[
    {category:'Events & Functions',vendor:'Star Caterers',    method:'UPI',        amount:'₹45,000',status:'Approved', date:'Jun 12',c:'#818cf8'},
    {category:'Books & Library',   vendor:'Oxford Supplies',  method:'Bank Transfer',amount:'₹18,500',status:'Approved', date:'Jun 10',c:'#60a5fa'},
    {category:'Software License',  vendor:'EdTech Solutions', method:'Online',      amount:'₹12,000',status:'Pending',  date:'Jun 13',c:'#fbbf24'},
    {category:'Maintenance',       vendor:'ABC Repairs',      method:'Cash',        amount:'₹8,200',status:'Approved', date:'Jun 9', c:'#34d399'},
    {category:'Sports Equipment',  vendor:'Decathlon',        method:'Cheque',      amount:'₹22,000',status:'Pending',  date:'Jun 11',c:'#fbbf24'},
    {category:'Stationery',        vendor:'Paper World',      method:'Cash',        amount:'₹3,500',status:'Rejected', date:'Jun 8', c:'#f87171'},
  ];
  const budgets=[
    {cat:'Events & Functions',budget:150000,spent:98000,c:'#818cf8'},
    {cat:'Books & Library',   budget:80000, spent:62000,c:'#60a5fa'},
    {cat:'Software',          budget:50000, spent:48000,c:'#f87171'},
    {cat:'Maintenance',       budget:60000, spent:28000,c:'#34d399'},
    {cat:'Sports',            budget:70000, spent:42000,c:'#fbbf24'},
    {cat:'Stationery',        budget:20000, spent:8500, c:'#fb923c'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="Expenses & Budget" sub="Category-wise expenses, vendor management & budget tracking" color="#f87171" icon={Receipt}/>
      <div className="g4">
        {[{icon:Receipt,label:'Total Expenses',value:154,suffix:'K',sub:'This month (₹)',grad:['#f43f5e','#f87171']},{icon:CheckCircle2,label:'Approved',value:98,suffix:'K',sub:'4 transactions',grad:['#10b981','#34d399']},{icon:Clock,label:'Pending Approval',value:34,suffix:'K',sub:'2 transactions',grad:['#f59e0b','#fbbf24']},{icon:BarChart2,label:'Budget Used',value:64,suffix:'%',sub:'₹3.8L of ₹6L total',grad:['#818cf8','#a78bfa']}].map(k=><KPI key={k.label} {...k}/>)}
      </div>
      {/* Budget progress */}
      <div style={C({padding:'14px 16px'})}>
        <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10}}>Budget vs Actual (FY 2025–26)</div>
        {budgets.map(b=>{
          const pct=Math.round(b.spent/b.budget*100);
          const over=pct>90;
          return(
            <div key={b.cat} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:12,color:'#334155',fontWeight:500}}>{b.cat}</span>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <span style={{fontSize:11,color:'#94a3b8'}}>₹{(b.spent/1000).toFixed(0)}K / ₹{(b.budget/1000).toFixed(0)}K</span>
                  <span style={{fontSize:11,fontWeight:700,color:over?'#f87171':b.c}}>{pct}%</span>
                  {over && <Bdg c="#f87171">Over Budget!</Bdg>}
                </div>
              </div>
              <div style={{height:7,borderRadius:999,background:'#f1f5f9',overflow:'hidden'}}>
                <div className="srv-bar" style={{height:'100%',borderRadius:999,width:`${Math.min(pct,100)}%`,background:over?'linear-gradient(90deg,#f43f5e,#f87171)':`linear-gradient(90deg,${b.c},${b.c}cc)`}}/>
              </div>
            </div>
          );
        })}
      </div>
      {/* Expense table */}
      <div style={C({padding:0,overflow:'hidden'})}>
        <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Recent Expenses</span>
          <div style={{display:'flex',gap:5}}>{['Cash','UPI','Cheque','Bank Transfer'].map(m=><Bdg key={m} c="#94a3b8">{m}</Bdg>)}</div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Category','Vendor','Method','Amount','Status','Date','Action'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {expenses.map((e,i)=>(
                <tr key={i} className="srv-tr" style={{background:i%2===0?'transparent':'#fafbff'}}>
                  <td style={TD()}><div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:7,height:7,borderRadius:'50%',background:e.c}}/><span style={{fontWeight:600,color:'#0f172a'}}>{e.category}</span></div></td>
                  <td style={TD()}>{e.vendor}</td>
                  <td style={TD()}><Bdg c="#94a3b8">{e.method}</Bdg></td>
                  <td style={TD({fontFamily:'monospace',fontWeight:700,color:'#0f172a'})}>{e.amount}</td>
                  <td style={TD()}><Bdg c={e.status==='Approved'?'#34d399':e.status==='Pending'?'#fbbf24':'#f87171'}>{e.status}</Bdg></td>
                  <td style={TD({color:'#94a3b8'})}>{e.date}</td>
                  <td style={TD()}>
                    {e.status==='Pending' && <div style={{display:'flex',gap:5}}>
                      <button style={{background:'#dcfce7',color:'#166534',border:'none',borderRadius:5,padding:'3px 9px',fontSize:10,fontWeight:700,cursor:'pointer'}}>✓ Approve</button>
                      <button style={{background:'#fee2e2',color:'#991b1b',border:'none',borderRadius:5,padding:'3px 9px',fontSize:10,fontWeight:700,cursor:'pointer'}}>✗ Reject</button>
                    </div>}
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

/* ══════════════════ HR & PAYROLL ════════════════════════════ */
const HrPayroll = () => {
  const salaries=[
    {name:'Mr. R. Kumar',   desig:'HoD Mathematics', basic:45000,allow:8000,deduct:2200,net:50800,status:'Paid',  c:'#34d399'},
    {name:'Mrs. P. Anitha', desig:'Science Teacher',  basic:38000,allow:6000,deduct:1900,net:42100,status:'Paid',  c:'#34d399'},
    {name:'Mr. S. Venkat',  desig:'Languages HoD',    basic:42000,allow:7000,deduct:2100,net:46900,status:'Pending',c:'#fbbf24'},
    {name:'Mrs. K. Meena',  desig:'Social Science',   basic:36000,allow:5500,deduct:1800,net:39700,status:'Paid',  c:'#34d399'},
    {name:'Mr. C. Gopal',   desig:'Admin Manager',    basic:52000,allow:9000,deduct:2600,net:58400,status:'Pending',c:'#fbbf24'},
  ];
  const tasks=[
    {task:'Prepare June Timetable',    assigned:'Mr. A. Rajesh', due:'Jun 15',priority:'High',  status:'In Progress',c:'#fbbf24'},
    {task:'Complete Student ID Cards', assigned:'Mrs. V. Lakshmi',due:'Jun 18',priority:'Medium',status:'Pending',   c:'#f87171'},
    {task:'Library Stock Audit',       assigned:'Mr. B. Selvam', due:'Jun 20',priority:'Low',   status:'Completed',  c:'#34d399'},
    {task:'Upload Q1 Results',         assigned:'Mr. R. Kumar',  due:'Jun 22',priority:'High',  status:'Pending',    c:'#f87171'},
    {task:'Parent Meeting Prep',       assigned:'Admin Team',    due:'Jun 21',priority:'High',  status:'In Progress',c:'#fbbf24'},
  ];
  const timetable=[
    {period:'P1 8:30',class:'X-A',subject:'Mathematics',teacher:'Mr. R. Kumar'},
    {period:'P2 9:20',class:'IX-B',subject:'Science',   teacher:'Mrs. P. Anitha'},
    {period:'P3 10:10',class:'XI-A',subject:'Physics',  teacher:'Mr. A. Rajesh'},
    {period:'P4 11:00',class:'VIII-C',subject:'English',teacher:'Mr. S. Venkat'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="HR & Payroll" sub="Salary structures, allowances, deductions, tasks & timetable" color="#34d399" icon={Briefcase}/>
      <div className="g4">
        {[{icon:Users,label:'Total Staff',value:68,sub:'Teaching + Admin',grad:['#10b981','#34d399']},{icon:Wallet,label:'Monthly Payroll',value:28,suffix:'L',sub:'Total salary this month',grad:['#3b82f6','#60a5fa']},{icon:CheckCircle2,label:'Salaries Paid',value:54,sub:'Of 68 staff',grad:['#818cf8','#a78bfa']},{icon:ClipboardList,label:'Active Tasks',value:12,sub:'Assigned to staff',grad:['#f59e0b','#fbbf24']}].map(k=><KPI key={k.label} {...k}/>)}
      </div>
      {/* Salary table */}
      <div style={C({padding:0,overflow:'hidden'})}>
        <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Salary Slip — June 2025</span>
          <Bdg c="#34d399">Auto-deduction: Late coming + Holidays</Bdg>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>{['Employee','Designation','Basic','Allowance','Deduction','Net Salary','Status'].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {salaries.map((s,i)=>(
                <tr key={i} className="srv-tr" style={{background:i%2===0?'transparent':'#fafbff'}}>
                  <td style={TD({fontWeight:700,color:'#0f172a'})}>{s.name}</td>
                  <td style={TD()}>{s.desig}</td>
                  <td style={TD({fontFamily:'monospace'})}>₹{s.basic.toLocaleString()}</td>
                  <td style={TD({fontFamily:'monospace',color:'#34d399',fontWeight:600})}>+₹{s.allow.toLocaleString()}</td>
                  <td style={TD({fontFamily:'monospace',color:'#f87171',fontWeight:600})}>-₹{s.deduct.toLocaleString()}</td>
                  <td style={TD({fontFamily:'monospace',fontWeight:800,color:'#0f172a'})}>₹{s.net.toLocaleString()}</td>
                  <td style={TD()}><Bdg c={s.c}>{s.status}</Bdg></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="g2">
        {/* Tasks */}
        <div style={C({padding:0,overflow:'hidden'})}>
          <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',fontSize:13,fontWeight:700,color:'#0f172a'}}>Task Management</div>
          <div style={{padding:'10px 14px'}}>
            {tasks.map((t,i)=>(
              <div key={i} style={{padding:'8px 10px',borderRadius:9,background:`${t.c}0a`,border:`1px solid ${t.c}18`,marginBottom:7}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:600,color:'#0f172a'}}>{t.task}</span>
                  <Bdg c={t.c}>{t.status}</Bdg>
                </div>
                <div style={{display:'flex',gap:10}}>
                  <span style={{fontSize:10,color:'#94a3b8'}}>👤 {t.assigned}</span>
                  <span style={{fontSize:10,color:'#94a3b8'}}>📅 {t.due}</span>
                  <Bdg c={t.priority==='High'?'#f87171':t.priority==='Medium'?'#fbbf24':'#34d399'}>{t.priority}</Bdg>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Timetable */}
        <div style={C({padding:0,overflow:'hidden'})}>
          <div style={{padding:'10px 14px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>Today's Timetable</span>
            <Bdg c="#818cf8">AI-Generated</Bdg>
          </div>
          <div style={{padding:'10px 14px'}}>
            {timetable.map((t,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:9,background:'#fafbff',marginBottom:6}}>
                <span style={{fontSize:10,fontFamily:'monospace',color:'#94a3b8',width:52,flexShrink:0}}>{t.period}</span>
                <div style={{flex:1}}>
                  <span style={{fontSize:12,fontWeight:600,color:'#0f172a'}}>{t.subject}</span>
                  <span style={{fontSize:10,color:'#94a3b8',display:'block'}}>{t.teacher}</span>
                </div>
                <Bdg c="#60a5fa">{t.class}</Bdg>
              </div>
            ))}
            <div style={{padding:'8px 10px',borderRadius:9,background:'#f0fdf4',border:'1px dashed #86efac',textAlign:'center'}}>
              <span style={{fontSize:11,color:'#166534'}}>⚡ Substitute teacher assignment available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════ PLATFORM FEATURES ═══════════════════════ */
const PlatformFeatures = () => {
  const modules = [
    {icon:CalendarDays, name:'Holiday Calendar',    desc:'Events, vacations & push notifications to all',               color:'#fbbf24'},
    {icon:UserCheck,    name:'Student Attendance',  desc:'Biometric / Manual / Mobile App — CSV & PDF export',          color:'#34d399'},
    {icon:Users,        name:'Staff Attendance',    desc:'By designation — teacher, coordinator, finance, VP',          color:'#a78bfa'},
    {icon:ClipboardList,name:'Timetable',           desc:'Manual or AI-generated, substitute teacher management',       color:'#60a5fa'},
    {icon:Receipt,      name:'Expense Management',  desc:'Categories, vendors, approve/reject workflow, budget control', color:'#f87171'},
    {icon:UserPlus,     name:'Admission Management',desc:'QR code, WhatsApp link, auto account creation',               color:'#818cf8'},
    {icon:IdCard,       name:'Student ID Cards',    desc:'Design, print & export student ID cards anytime',             color:'#2dd4bf'},
    {icon:MessageSquare,name:'Communication',       desc:'SMS, WhatsApp, Email & free In-App notifications',            color:'#f472b6'},
    {icon:Bell,         name:'Notice Board',        desc:'Announcements to all — parents, students & staff',            color:'#fb923c'},
    {icon:BookMarked,   name:'Homework Tracker',    desc:'Assign, track & notify parents via mobile app',              color:'#38bdf8'},
    {icon:Video,        name:'Online Classes',       desc:'Integrated with Zoom & Microsoft Teams',                     color:'#818cf8'},
    {icon:FileText,     name:'Exam & Results',       desc:'Date sheets, marks entry, publish to parent app',            color:'#f87171'},
    {icon:DollarSign,   name:'Fees Management',     desc:'Partial pay, defaulter alerts, payment gateways, discounts', color:'#2dd4bf'},
    {icon:Bus,          name:'Transport + GPS',      desc:'Routes, stops, live GPS tracking, driver mobile',             color:'#38bdf8'},
    {icon:Package,      name:'Inventory Management',desc:'Uniform, books, accessories — stock & supplier management',   color:'#fb923c'},
    {icon:BookOpen,     name:'Library Management',  desc:'Books catalog, issue/return, fines & overdue tracking',      color:'#fbbf24'},
    {icon:Activity,     name:'Daily Activities',    desc:'Snacks, medicine, temperature, exercise logs for students',   color:'#34d399'},
    {icon:Wallet,       name:'Day Book',            desc:'Daily balance sheet — income, expenses, fee receipts',       color:'#60a5fa'},
    {icon:Briefcase,    name:'Salary Management',   desc:'Structures, allowances, deductions, late-coming penalty',    color:'#34d399'},
    {icon:ClipboardList,name:'Task Management',     desc:'Assign & track tasks for any staff member',                  color:'#818cf8'},
    {icon:Brain,        name:'AI Features',         desc:'AI timetable + AI homework help for students (safe)',        color:'#a78bfa'},
    {icon:Fingerprint,  name:'Biometric Integration',desc:'Fingerprint & RFID card attendance for staff & students',   color:'#f472b6'},
    {icon:MapPin,       name:'Visitor Management',  desc:'Visitor details, purpose tracking & printed pass generation',color:'#fbbf24'},
    {icon:Video,        name:'Learning Management', desc:'Quizzes, certificates, lesson plans & daily class logs',     color:'#2dd4bf'},
    {icon:QrCode,       name:'Document Templates',  desc:'TC, Bonafide, Admit Card, Fee Invoice — auto generated',    color:'#fb923c'},
    {icon:BarChart2,    name:'Reports & Analytics', desc:'Attendance, fee, expense & salary reports — export CSV/PDF', color:'#60a5fa'},
  ];
  const integrations=[
    {icon:Smartphone,  name:'Mobile App',        desc:'Parents, Students & Teachers',color:'#34d399'},
    {icon:Wifi,        name:'GPS Live Tracking', desc:'Real-time bus location',       color:'#38bdf8'},
    {icon:Fingerprint, name:'Biometric Device',  desc:'Fingerprint & RFID card',     color:'#f472b6'},
    {icon:Brain,       name:'AI Engine',         desc:'Timetable + Student help',     color:'#818cf8'},
    {icon:CreditCard,  name:'Payment Gateway',   desc:'Online fee collection',        color:'#2dd4bf'},
    {icon:MessageSquare,name:'WhatsApp API',     desc:'Business messaging',           color:'#34d399'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <SH title="Platform Features" sub="Complete School ERP — 26 modules from the video demo" color="#fbbf24" icon={Layers}/>
      {/* Pricing banner */}
      <div style={{background:'linear-gradient(135deg,#1e1b4b,#312e81)',borderRadius:16,padding:'20px 24px',color:'white',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-30,right:-30,width:150,height:150,borderRadius:'50%',background:'rgba(129,140,248,0.15)'}}/>
        <div style={{position:'absolute',bottom:-20,left:100,width:100,height:100,borderRadius:'50%',background:'rgba(251,191,36,0.1)'}}/>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:14}}>
          <div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>Simple Transparent Pricing</div>
            <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:6}}>
              <span style={{fontSize:36,fontWeight:900,color:'#fbbf24'}}>₹10</span>
              <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>/student/month</span>
            </div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.6)'}}>200 students = ₹2,000/month · No setup fee · No hidden charges</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {['✓  All 26 modules included','✓  Mobile apps for all users','✓  No setup or customisation cost','✓  Data security + SLA + NDA','✓  Annual plan → 3 months FREE'].map(t=>(
              <div key={t} style={{fontSize:12,color:'rgba(255,255,255,0.85)',display:'flex',alignItems:'center',gap:6}}>{t}</div>
            ))}
          </div>
        </div>
      </div>
      {/* All 26 modules grid */}
      <div style={C({padding:'14px 16px'})}>
        <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:12}}>All 26 Modules — Included in Base Price</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:8}}>
          {modules.map((m,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:9,padding:'9px 11px',borderRadius:10,background:`${m.color}0a`,border:`1px solid ${m.color}18`}}>
              <div style={{width:30,height:30,borderRadius:8,background:`${m.color}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <m.icon style={{width:14,height:14,color:m.color}}/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:700,color:'#0f172a',marginBottom:2}}>{m.name}</div>
                <div style={{fontSize:9,color:'#94a3b8',lineHeight:1.4}}>{m.desc}</div>
              </div>
              <CheckCircle2 size={12} color="#34d399" style={{flexShrink:0,marginTop:2}}/>
            </div>
          ))}
        </div>
      </div>
      {/* Integrations */}
      <div style={C({padding:'14px 16px'})}>
        <div style={{fontSize:13,fontWeight:700,color:'#0f172a',marginBottom:10}}>Key Integrations & Hardware</div>
        <div className="g3">
          {integrations.map(ig=>(
            <div key={ig.name} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,background:`${ig.color}0a`,border:`1px solid ${ig.color}20`}}>
              <div style={{width:34,height:34,borderRadius:9,background:`${ig.color}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <ig.icon style={{width:16,height:16,color:ig.color}}/>
              </div>
              <div><div style={{fontSize:12,fontWeight:700,color:'#0f172a'}}>{ig.name}</div><div style={{fontSize:10,color:'#94a3b8'}}>{ig.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
      {/* Cloud & Security */}
      <div className="g3">
        {[
          {icon:Shield,    title:'Data Security',    points:['Cloud-based secure storage','SLA agreement provided','NDA agreement available','Your data stays private'],color:'#34d399'},
          {icon:Smartphone,title:'Mobile App Access',points:['Parent portal — attendance, fees, results','Student portal — homework, AI help, results','Teacher app — attendance, homework, grades','Admin app — full control'],color:'#60a5fa'},
          {icon:Brain,     title:'AI Capabilities',  points:['AI timetable generation','AI homework helper for students','Study tips & course assistance','Restricted to academics only'],color:'#a78bfa'},
        ].map(card=>(
          <div key={card.title} style={C({padding:'14px 16px',border:`1px solid ${card.color}25`,background:`${card.color}06`})}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <div style={{width:32,height:32,borderRadius:8,background:`${card.color}18`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <card.icon style={{width:15,height:15,color:card.color}}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:'#0f172a'}}>{card.title}</span>
            </div>
            {card.points.map((p,i)=>(
              <div key={i} style={{display:'flex',gap:7,marginBottom:6}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:card.color,marginTop:4,flexShrink:0}}/>
                <span style={{fontSize:11,color:'#475569'}}>{p}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════ MAIN DASHBOARD ══════════════════════════ */
export default function Dashboard() {
  const {logout} = useAuth();
  const navigate = useNavigate();
  const [active,setActive] = useState<SectionId>('overview');
  const [sideOpen,setSideOpen] = useState(false);
  const [time,setTime] = useState(new Date());
  const [search,setSearch] = useState('');

  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);

  const an = NAV.find(n=>n.id===active)!;

  const render = () => {
    switch(active){
      case 'overview': return <Overview/>;
      case 'students': return <Students/>;
      case 'attendance': return <Attendance/>;
      case 'calendar': return <Calendar/>;
      case 'announcements': return <Announcements/>;
      case 'fees': return <Fees/>;
      case 'staff': return <Staff/>;
      case 'library': return <Library/>;
      case 'transport': return <Transport/>;
      case 'exams':         return <Exams/>;
      case 'admission':     return <Admission/>;
      case 'communication': return <Communication/>;
      case 'expenses':      return <ExpensesBudget/>;
      case 'hrpayroll':     return <HrPayroll/>;
      case 'platform':      return <PlatformFeatures/>;
      default: return <Overview/>;
    }
  };

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f0f4f8',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      <style>{`
        @keyframes srvFadeIn {from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
        @keyframes srvPulse  {0%,100%{opacity:1;}50%{opacity:.4;}}
        @keyframes srvBar    {from{width:0}to{}}
        @keyframes spin      {to{transform:rotate(360deg);}}
        @keyframes srvGlow   {0%,100%{opacity:.7;}50%{opacity:1;}}

        .srv-fade {animation:srvFadeIn .35s ease both;}
        .srv-pulse{animation:srvPulse 2s ease-in-out infinite;}
        .srv-bar  {animation:srvBar 1.1s cubic-bezier(.17,.67,.31,1) both;}
        .kpi      {transition:transform .2s,box-shadow .2s;}
        .kpi:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(15,23,42,0.10)!important;}
        .srv-tr:hover td{background:#f5f7ff!important;}
        .srv-nav  {display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;cursor:pointer;transition:all .15s;background:transparent;border:1px solid transparent;width:100%;text-align:left;}
        .srv-nav:hover{background:rgba(255,255,255,0.08);}

        .g2{display:grid;gap:10px;grid-template-columns:1fr;}
        .g3{display:grid;gap:8px;grid-template-columns:1fr;}
        .g4{display:grid;gap:8px;grid-template-columns:1fr;}
        @media(min-width:600px) {.g2{grid-template-columns:1fr 1fr;}.g3{grid-template-columns:1fr 1fr;}.g4{grid-template-columns:1fr 1fr;}}
        @media(min-width:1024px){.g3{grid-template-columns:repeat(3,1fr);}.g4{grid-template-columns:repeat(4,1fr);}}
        @media(min-width:900px) {.srv-sidebar{transform:translateX(0)!important;position:relative!important;flex-shrink:0;}}

        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:999px;}
      `}</style>

      {sideOpen && <div onClick={()=>setSideOpen(false)} style={{position:'fixed',inset:0,background:'rgba(15,23,42,.6)',zIndex:40,backdropFilter:'blur(3px)'}}/>}

      {/* ── Sidebar ── */}
      <aside className="srv-sidebar" style={{
        position:'fixed',top:0,left:0,bottom:0,width:236,zIndex:50,
        background:'linear-gradient(180deg,#1e1b4b 0%,#1e1b4b 40%,#1a1840 100%)',
        borderRight:'1px solid rgba(255,255,255,0.06)',
        boxShadow:'4px 0 24px rgba(0,0,0,0.25)',
        display:'flex',flexDirection:'column',
        transform:sideOpen?'translateX(0)':'translateX(-100%)',
        transition:'transform .25s cubic-bezier(.4,0,.2,1)',overflowY:'auto',
      }}>
        {/* Logo */}
        <div style={{padding:'16px 14px 12px',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#818cf8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'white',flexShrink:0,boxShadow:'0 4px 14px rgba(99,102,241,0.5)'}}>SRV</div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:'#f1f5f9',lineHeight:1.2}}>SRV School</div>
              <div style={{fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:'0.04em'}}>ERP PORTAL 2025</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{padding:'10px 8px',display:'flex',flexDirection:'column',gap:2}}>
          <div style={{fontSize:9,fontWeight:700,color:'rgba(255,255,255,0.25)',letterSpacing:'0.1em',textTransform:'uppercase',padding:'4px 12px 6px'}}>MAIN MENU</div>
          {NAV.map(item=>{
            const isA=active===item.id, Icon=item.icon;
            return (
              <button key={item.id} className="srv-nav"
                onClick={()=>{setActive(item.id as SectionId);setSideOpen(false);}}
                style={{background:isA?item.bg:'transparent',border:isA?`1px solid rgba(255,255,255,0.1)`:'1px solid transparent',position:'relative'}}>
                {isA && <div style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:3,height:22,borderRadius:'0 3px 3px 0',background:item.color}}/>}
                <div style={{width:28,height:28,borderRadius:7,flexShrink:0,background:isA?`${item.color}25`:'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon style={{width:14,height:14,color:isA?item.color:'rgba(255,255,255,0.45)'}}/>
                </div>
                <span style={{fontSize:12,fontWeight:isA?700:400,color:isA?'#f1f5f9':'rgba(255,255,255,0.55)'}}>{item.label}</span>
                {isA && <div style={{marginLeft:'auto',width:5,height:5,borderRadius:'50%',background:item.color,animation:'srvGlow 2s ease-in-out infinite'}}/>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{marginTop:'auto',padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.06em'}}>Academic Year 2025–26</div>
          <button onClick={()=>{logout();navigate('/login');}} className="srv-nav"
            style={{color:'rgba(255,255,255,0.5)',fontSize:11,fontWeight:500,padding:'7px 10px',gap:8}}>
            <LogOut size={13}/> Logout
          </button>
          <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.06)',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <span style={{fontSize:8,color:'rgba(255,255,255,0.3)',letterSpacing:'0.07em',textTransform:'uppercase',fontWeight:600}}>Powered by</span>
            <TheRaiseBadge/>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
        {/* Header */}
        <header style={{
          position:'sticky',top:0,zIndex:30,
          background:'rgba(255,255,255,0.92)',backdropFilter:'blur(16px)',
          borderBottom:'1px solid #e8ecf4',
          boxShadow:'0 1px 4px rgba(15,23,42,0.06)',
          padding:'8px 16px',display:'flex',alignItems:'center',gap:10,
        }}>
          <button onClick={()=>setSideOpen(!sideOpen)} style={{background:'#f5f7ff',border:'1px solid #e8ecf4',borderRadius:8,padding:7,cursor:'pointer',color:'#64748b',display:'flex'}}>
            {sideOpen?<X size={17}/>:<Menu size={17}/>}
          </button>

          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:24,height:24,borderRadius:6,background:an.bg,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <an.icon style={{width:12,height:12,color:an.color}}/>
            </div>
            <span style={{fontSize:14,fontWeight:700,color:'#0f172a'}}>{an.label}</span>
          </div>

          <div style={{flex:1}}/>

          <div style={{display:'flex',alignItems:'center',gap:7,background:'#f5f7ff',border:'1px solid #e8ecf4',borderRadius:8,padding:'5px 11px',maxWidth:180}}>
            <Search size={12} color="#94a3b8"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
              style={{background:'transparent',border:'none',outline:'none',fontSize:11,color:'#1e293b',width:'100%'}}/>
          </div>

          <div style={{textAlign:'right',fontSize:10,color:'#94a3b8'}}>
            <div style={{fontWeight:700,color:'#475569',fontFamily:'monospace'}}>{time.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</div>
            <div>{time.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
          </div>

          <button style={{position:'relative',background:'#f5f7ff',border:'1px solid #e8ecf4',borderRadius:8,padding:7,cursor:'pointer',display:'flex',color:'#64748b'}}>
            <Bell size={15}/>
            <div style={{position:'absolute',top:5,right:5,width:5,height:5,borderRadius:'50%',background:'#f87171',border:'1.5px solid white'}}/>
          </button>
        </header>

        {/* Content */}
        <main key={active} className="srv-fade" style={{flex:1,padding:'14px',overflowY:'auto'}}>
          {render()}
        </main>
      </div>
    </div>
  );
}
