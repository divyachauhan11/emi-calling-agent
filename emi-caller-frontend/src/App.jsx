// import { useState } from 'react';
// import axios from 'axios';

// const API_URL = 'http://localhost:8000';

// function App() {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const [customers, setCustomers] = useState([]);
//   const [callLogs, setCallLogs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const uploadExcel = async () => {
//     if (!file) {
//       alert("Please select an Excel file first");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_URL}/upload-excel`, formData);
//       setMessage(res.data.message);
//       fetchCustomers();
//     } catch (error) {
//       setMessage("Upload failed. Please try again.");
//     }
//     setLoading(false);
//   };

//   const fetchCustomers = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/customers`);
//       setCustomers(res.data);
//     } catch (error) {
//       console.error("Failed to fetch customers");
//     }
//   };

//   const startCalling = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_URL}/start-calling`);
//       setMessage(res.data.message);
//     } catch (error) {
//       setMessage("Failed to start calling campaign");
//     }
//     setLoading(false);
//   };

//   const fetchCallLogs = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/call-logs`);
//       setCallLogs(res.data);
//     } catch (error) {
//       console.error("Failed to fetch call logs");
//     }
//   };

//   return (
//     <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial' }}>
//       <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>EMI Calling Agent</h1>

//       {/* Upload Section */}
//       <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
//         <h2>Upload Excel File</h2>
//         <input 
//           type="file" 
//           accept=".xlsx,.xls" 
//           onChange={handleFileChange} 
//           style={{ margin: '15px 0' }}
//         />
//         <br />
//         <button 
//           onClick={uploadExcel} 
//           disabled={loading}
//           style={{ 
//             padding: '10px 20px', 
//             backgroundColor: '#007bff', 
//             color: 'white', 
//             border: 'none', 
//             borderRadius: '5px',
//             cursor: 'pointer'
//           }}
//         >
//           {loading ? 'Uploading...' : 'Upload & Import Customers'}
//         </button>
//         {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
//       </div>

//       {/* Customers List */}
//       <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2>Customers ({customers.length})</h2>
//           <button onClick={fetchCustomers} style={{ padding: '8px 15px' }}>
//             Refresh List
//           </button>
//         </div>

//         {customers.length > 0 ? (
//           <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
//                 <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Phone</th>
//                 <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>EMI Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {customers.map((customer, index) => (
//                 <tr key={index}>
//                   <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{customer.name}</td>
//                   <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{customer.phone}</td>
//                   <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{customer.emi_amount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No customers imported yet.</p>
//         )}
//       </div>

//       {/* Start Calling Button */}
//       <div style={{ textAlign: 'center', marginBottom: '40px' }}>
//         <button 
//           onClick={startCalling} 
//           disabled={loading || customers.length === 0}
//           style={{ 
//             padding: '15px 40px', 
//             fontSize: '18px', 
//             backgroundColor: '#28a745', 
//             color: 'white', 
//             border: 'none', 
//             borderRadius: '8px',
//             cursor: 'pointer'
//           }}
//         >
//           {loading ? 'Starting Calls...' : '🚀 Start Calling Campaign'}
//         </button>
//       </div>

//       {/* Call Logs */}
//       <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2>Call Logs</h2>
//           <button onClick={fetchCallLogs} style={{ padding: '8px 15px' }}>
//             Refresh Logs
//           </button>
//         </div>

//         {callLogs.length > 0 ? (
//           <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Call SID</th>
//                 <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
//                 <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Response</th>
//               </tr>
//             </thead>
//             <tbody>
//               {callLogs.map((log, index) => (
//                 <tr key={index}>
//                   <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{log.call_sid}</td>
//                   <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{log.status}</td>
//                   <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{log.response || '-'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No call logs yet.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

/* ─── Response Code → Human Label ─────────────────────────────────────── */
const RESPONSE_LABELS = {
  '1': { label: 'Will Pay on Time',    color: '#1C7A3A', bg: '#E8F8EE', dot: '#34C759' },
  '2': { label: 'Needs Follow-up Call', color: '#B25000', bg: '#FFF3E5', dot: '#FF9500' },
};
function parseResponse(val) {
  if (val == null || val === '') return null;
  const key = String(val).trim();
  return RESPONSE_LABELS[key] || null;
}

/* ─── Design Tokens ─────────────────────────────────────────────────────── */
const tk = {
  pageBg:    '#F2F2F7',
  white:     '#FFFFFF',
  border:    'rgba(0,0,0,0.08)',
  borderMid: 'rgba(0,0,0,0.12)',
  blue:      '#007AFF',
  blueHover: '#0066D6',
  blueDim:   'rgba(0,122,255,0.10)',
  green:     '#34C759',
  greenDim:  '#E8F8EE',
  orange:    '#FF9500',
  orangeDim: '#FFF3E5',
  red:       '#FF3B30',
  redDim:    '#FFECEB',
  textPri:   '#1C1C1E',
  textSec:   '#3C3C43',
  textTer:   '#8E8E93',
  textQuat:  '#AEAEB2',
  sans:      "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
  mono:      "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
  r8:        '8px',
  r12:       '12px',
  r16:       '16px',
  r20:       '20px',
  shadow:    '0 2px 8px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.06)',
  shadowMd:  '0 4px 16px rgba(0,0,0,0.10), 0 0 1px rgba(0,0,0,0.06)',
  shadowLg:  '0 8px 32px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.06)',
};

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: ${tk.pageBg}; font-family: ${tk.sans}; color: ${tk.textPri}; -webkit-font-smoothing: antialiased; }

    .apple-card { background: ${tk.white}; border-radius: ${tk.r16}; box-shadow: ${tk.shadow}; }

    /* Table rows */
    .trow { transition: background 0.12s; }
    .trow:hover { background: #F9F9FB !important; }

    /* Buttons */
    .btn-blue {
      background: ${tk.blue}; color: #fff; border: none; border-radius: ${tk.r12};
      font-family: ${tk.sans}; font-weight: 600; cursor: pointer;
      transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
    }
    .btn-blue:hover:not(:disabled) { background: ${tk.blueHover}; box-shadow: 0 4px 12px rgba(0,122,255,0.3); }
    .btn-blue:active:not(:disabled) { transform: scale(0.97); }
    .btn-blue:disabled { background: ${tk.textQuat}; cursor: not-allowed; }

    .btn-outline {
      background: ${tk.white}; border: 1px solid ${tk.borderMid}; border-radius: ${tk.r8};
      font-family: ${tk.sans}; color: ${tk.blue}; font-size: 13px; font-weight: 500;
      cursor: pointer; transition: background 0.12s, box-shadow 0.12s;
    }
    .btn-outline:hover:not(:disabled) { background: #F5F5F7; box-shadow: ${tk.shadow}; }
    .btn-outline:disabled { color: ${tk.textQuat}; cursor: not-allowed; }

    /* Tab underline */
    .tab { cursor: pointer; background: none; border: none; font-family: ${tk.sans}; transition: color 0.15s; }
    .tab.active { color: ${tk.blue} !important; }
    .tab.active .tab-line { background: ${tk.blue} !important; }

    /* Upload zone */
    .upload-zone { transition: border-color 0.2s, background 0.2s; cursor: pointer; }
    .upload-zone:hover, .upload-zone.drag { border-color: ${tk.blue} !important; background: ${tk.blueDim} !important; }

    /* Search input */
    .search-input {
      background: #F2F2F7; border: 1px solid transparent; border-radius: ${tk.r8};
      font-family: ${tk.sans}; font-size: 13px; color: ${tk.textPri};
      padding: 7px 11px; outline: none; transition: border-color 0.15s, background 0.15s;
    }
    .search-input:focus { background: ${tk.white}; border-color: ${tk.blue}; box-shadow: 0 0 0 3px ${tk.blueDim}; }
    .search-input::placeholder { color: ${tk.textQuat}; }

    /* Campaign button pulse ring */
    .btn-campaign { transition: box-shadow 0.2s, transform 0.1s; position: relative; overflow: visible !important; }
    .btn-campaign:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(0,122,255,0.35) !important; }
    .btn-campaign:active:not(:disabled) { transform: scale(0.97); }
    .btn-campaign.live::after {
      content: '';
      position: absolute;
      inset: -5px;
      border-radius: 18px;
      border: 2px solid ${tk.blue};
      animation: apple-ring 1.8s ease-out infinite;
      pointer-events: none;
    }
    @keyframes apple-ring {
      0%   { opacity: 0.7; transform: scale(1); }
      100% { opacity: 0;   transform: scale(1.1); }
    }

    /* Toast */
    .toast-wrap { animation: toast-up 0.28s cubic-bezier(0.34,1.56,0.64,1); }
    @keyframes toast-up {
      from { opacity: 0; transform: translateY(14px) scale(0.94); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Spinner */
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 0.7s linear infinite; }

    /* Live dot pulse */
    @keyframes live-dot { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
    .live-dot { animation: live-dot 1.4s ease-in-out infinite; }

    /* Segmented pill for response */
    .resp-pill { display: inline-flex; align-items: center; gap: 5px; border-radius: 20px; padding: 3px 10px 3px 7px; font-size: 12px; font-weight: 500; white-space: nowrap; }

    @media (max-width: 640px) {
      .stats-row { grid-template-columns: repeat(2,1fr) !important; }
      .hide-sm { display: none !important; }
      .header-inner { padding: 0 16px !important; }
      .main-pad { padding: 20px 16px 60px !important; }
    }
  `}</style>
);

/* ─── Toast ──────────────────────────────────────────────────────────────── */
let _tid = 0;
function useToast() {
  const [list, setList] = useState([]);
  const add = useCallback((text, type = 'info') => {
    const id = ++_tid;
    setList(p => [...p, { id, text, type }]);
    setTimeout(() => setList(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const dismiss = id => setList(p => p.filter(t => t.id !== id));
  return { list, toast: add, dismiss };
}
function Toasts({ list, dismiss }) {
  const icons = { success: '✓', error: '✗', info: 'ℹ' };
  const colors = { success: tk.green, error: tk.red, info: tk.blue };
  return (
    <div style={{ position: 'fixed', bottom: 28, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
      {list.map(t => (
        <div key={t.id} className="toast-wrap" onClick={() => dismiss(t.id)}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: tk.white, borderRadius: tk.r12, padding: '12px 14px', boxShadow: tk.shadowLg, cursor: 'pointer', border: `1px solid ${tk.border}` }}>
          <span style={{ width: 20, height: 20, borderRadius: '50%', background: colors[t.type], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
            {icons[t.type]}
          </span>
          <p style={{ fontSize: 13, color: tk.textPri, lineHeight: 1.5 }}>{t.text}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Spinner ────────────────────────────────────────────────────────────── */
function Spin({ size = 14, color = '#fff' }) {
  return (
    <span className="spin" style={{ display: 'inline-block', width: size, height: size, border: `2px solid rgba(255,255,255,0.3)`, borderTopColor: color, borderRadius: '50%' }} />
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ label, value, sub, accent }) {
  return (
    <div className="apple-card" style={{ padding: '18px 20px' }}>
      <p style={{ fontSize: 12, fontWeight: 500, color: tk.textTer, letterSpacing: '0.03em', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 30, fontWeight: 700, color: accent || tk.textPri, letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: tk.textTer, marginTop: 5 }}>{sub}</p>}
    </div>
  );
}

/* ─── Response Badge ─────────────────────────────────────────────────────── */
function ResponseBadge({ value }) {
  if (value == null || value === '') return <span style={{ color: tk.textQuat, fontSize: 13 }}>—</span>;
  const r = parseResponse(value);
  if (!r) return <span style={{ fontSize: 13, color: tk.textSec }}>{value}</span>;
  return (
    <span className="resp-pill" style={{ background: r.bg, color: r.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.dot, flexShrink: 0 }} />
      {r.label}
    </span>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────────────── */
const STATUS = {
  completed:    { label: 'Completed',    bg: '#E8F8EE', color: '#1C7A3A' },
  answered:     { label: 'Answered',     bg: '#E8F8EE', color: '#1C7A3A' },
  failed:       { label: 'Failed',       bg: '#FFECEB', color: '#C0392B' },
  busy:         { label: 'Busy',         bg: '#FFF3E5', color: '#B25000' },
  'no-answer':  { label: 'No Answer',    bg: '#FFF3E5', color: '#B25000' },
  queued:       { label: 'Queued',       bg: '#EEF4FF', color: '#1A56CC' },
  initiated:    { label: 'Initiated',    bg: '#EEF4FF', color: '#1A56CC' },
  'in-progress':{ label: 'In Progress',  bg: '#EEF4FF', color: '#1A56CC' },
};
function StatusBadge({ status = '' }) {
  const s = STATUS[status.toLowerCase()] || { label: status || '—', bg: '#F2F2F7', color: tk.textTer };
  const isLive = ['in-progress', 'initiated'].includes(status.toLowerCase());
  return (
    <span className="resp-pill" style={{ background: s.bg, color: s.color }}>
      {isLive
        ? <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: tk.blue, flexShrink: 0 }} />
        : <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      }
      {s.label}
    </span>
  );
}

/* ─── Upload Zone ────────────────────────────────────────────────────────── */
function UploadZone({ onFile, file }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const onDrop = e => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.xlsx') || f.name.endsWith('.xls'))) onFile(f);
  };
  return (
    <div
      className={`upload-zone${drag ? ' drag' : ''}`}
      onClick={() => ref.current.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      style={{
        border: `1.5px dashed ${file ? tk.blue : 'rgba(0,0,0,0.15)'}`,
        borderRadius: tk.r12,
        background: file ? tk.blueDim : '#FAFAFA',
        padding: '28px 20px',
        textAlign: 'center',
        userSelect: 'none',
      }}
    >
      <input ref={ref} type="file" accept=".xlsx,.xls" onChange={e => onFile(e.target.files[0])} style={{ display: 'none' }} />
      <div style={{ fontSize: 30, marginBottom: 8 }}>{file ? '📊' : '📁'}</div>
      {file ? (
        <>
          <p style={{ fontSize: 14, fontWeight: 600, color: tk.blue }}>{file.name}</p>
          <p style={{ fontSize: 12, color: tk.textTer, marginTop: 3 }}>{(file.size / 1024).toFixed(1)} KB · Click to change file</p>
        </>
      ) : (
        <>
          <p style={{ fontSize: 14, fontWeight: 500, color: tk.textSec }}>Drop Excel file here, or click to browse</p>
          <p style={{ fontSize: 12, color: tk.textQuat, marginTop: 3 }}>.xlsx or .xls format</p>
        </>
      )}
    </div>
  );
}

/* ─── Empty State ────────────────────────────────────────────────────────── */
function Empty({ icon, title, sub }) {
  return (
    <div style={{ padding: '52px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 10, opacity: 0.35 }}>{icon}</div>
      <p style={{ fontSize: 14, fontWeight: 600, color: tk.textTer, marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: 13, color: tk.textQuat }}>{sub}</p>
    </div>
  );
}

/* ─── Section Label ──────────────────────────────────────────────────────── */
function SLabel({ children }) {
  return <p style={{ fontSize: 11, fontWeight: 600, color: tk.textTer, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{children}</p>;
}

/* ─── INR Formatter ──────────────────────────────────────────────────────── */
const fmtINR = v => {
  if (v == null || v === '') return '—';
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
};

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [file, setFile]           = useState(null);
  const [customers, setCustomers] = useState([]);
  const [callLogs, setCallLogs]   = useState([]);
  const [tab, setTab]             = useState('customers');
  const [search, setSearch]       = useState('');
  const [uploading, setUploading] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [loadingC, setLoadingC]   = useState(false);
  const [loadingL, setLoadingL]   = useState(false);
  const [campaignLive, setCampaignLive] = useState(false);
  const { list: toasts, toast, dismiss } = useToast();

  /* ── Stats ── */
  const completed = callLogs.filter(l => ['completed','answered'].includes((l.status||'').toLowerCase())).length;
  const failed    = callLogs.filter(l => ['failed','busy','no-answer'].includes((l.status||'').toLowerCase())).length;
  const willPay   = callLogs.filter(l => String(l.response).trim() === '1').length;
  const needsCall = callLogs.filter(l => String(l.response).trim() === '2').length;

  /* ── Filtered ── */
  const q = search.toLowerCase();
  const filtered = customers.filter(c =>
    (c.name||'').toLowerCase().includes(q) || (c.phone||'').includes(search)
  );

  /* ── API ── */
  const loadCustomers = useCallback(async (silent = false) => {
    if (!silent) setLoadingC(true);
    try {
      const r = await axios.get(`${API_URL}/customers`);
      setCustomers(r.data);
    } catch {
      if (!silent) toast('Could not load customers. Check the server.', 'error');
    } finally {
      if (!silent) setLoadingC(false);
    }
  }, [toast]);

  const loadLogs = useCallback(async (silent = false) => {
    if (!silent) setLoadingL(true);
    try {
      const r = await axios.get(`${API_URL}/call-logs`);
      setCallLogs(r.data);
    } catch {
      if (!silent) toast('Could not load call logs.', 'error');
    } finally {
      if (!silent) setLoadingL(false);
    }
  }, [toast]);

  const handleUpload = async () => {
    if (!file) { toast('Select an Excel file first.', 'error'); return; }
    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);
    try {
      const r = await axios.post(`${API_URL}/upload-excel`, fd);
      toast(r.data.message || 'Customers imported.', 'success');
      setFile(null);
      await loadCustomers(true);
    } catch (e) {
      toast(e.response?.data?.message || 'Import failed. Try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCampaign = async () => {
    if (!window.confirm(`Start campaign for ${customers.length} customer${customers.length !== 1 ? 's' : ''}?`)) return;
    setLaunching(true);
    try {
      const r = await axios.post(`${API_URL}/start-calling`);
      toast(r.data.message || 'Campaign started.', 'success');
      setCampaignLive(true);
      setTab('logs');
      await loadLogs(true);
    } catch (e) {
      toast(e.response?.data?.message || 'Failed to start campaign.', 'error');
    } finally {
      setLaunching(false);
    }
  };

  /* ── Auto-refresh while campaign is live ── */
  useEffect(() => {
    if (!campaignLive) return;
    const iv = setInterval(async () => {
      await loadLogs(true);
      const active = callLogs.some(l => ['in-progress','initiated','queued'].includes((l.status||'').toLowerCase()));
      if (!active && callLogs.length > 0) setCampaignLive(false);
    }, 5000);
    return () => clearInterval(iv);
  }, [campaignLive, callLogs, loadLogs]);

  /* ────────────────────────────────────────────────────────────────────────── */
  return (
    <>
      <GlobalStyle />
      <Toasts list={toasts} dismiss={dismiss} />

      {/* ── Nav ── */}
      <header style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', borderBottom: `0.5px solid ${tk.border}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="header-inner" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 28px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>📞</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: tk.textPri, letterSpacing: '-0.02em' }}>EMI Calling Agent</span>
          </div>
          {campaignLive && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: tk.blueDim, borderRadius: 20, padding: '4px 12px' }}>
              <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: tk.blue }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: tk.blue }}>Campaign running</span>
            </div>
          )}
        </div>
      </header>

      <main className="main-pad" style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 28px 60px' }}>

        {/* ── Stats Row ── */}
        <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
          <StatCard label="Total Customers" value={customers.length}  accent={tk.blue}   sub={customers.length ? `${customers.length} imported` : 'No data yet'} />
          <StatCard label="Calls Completed" value={completed}         accent="#1C7A3A"   sub={callLogs.length ? `of ${callLogs.length} calls` : 'No calls yet'} />
          <StatCard label="Will Pay on Time" value={willPay}          accent="#1C7A3A"   sub="Response code 1" />
          <StatCard label="Needs Follow-up"  value={needsCall}        accent="#B25000"   sub="Response code 2" />
        </div>

        {/* ── Upload Card ── */}
        <div style={{ marginBottom: 16 }}>
          <SLabel>Import</SLabel>
          <div className="apple-card" style={{ padding: '20px 22px' }}>
            <UploadZone onFile={setFile} file={file} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
              <button
                className="btn-blue"
                onClick={handleUpload}
                disabled={!file || uploading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 14, padding: '10px 22px' }}
              >
                {uploading && <Spin />}
                {uploading ? 'Importing…' : 'Import Customers'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Customers / Logs Card ── */}
        <div style={{ marginBottom: 24 }}>
          <SLabel>Data</SLabel>
          <div className="apple-card" style={{ overflow: 'hidden' }}>

            {/* Tab bar */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: `0.5px solid ${tk.border}`, padding: '0 20px' }}>
              {[
                { id: 'customers', label: `Customers${customers.length ? ` (${customers.length})` : ''}` },
                { id: 'logs',      label: `Call Logs${callLogs.length ? ` (${callLogs.length})` : ''}` },
              ].map(t => (
                <button key={t.id} className={`tab${tab === t.id ? ' active' : ''}`}
                  onClick={() => setTab(t.id)}
                  style={{ fontSize: 13, fontWeight: 500, color: tab === t.id ? tk.blue : tk.textTer, padding: '13px 0', marginRight: 24, border: 'none', background: 'none', position: 'relative' }}>
                  {t.label}
                  <span className="tab-line" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, borderRadius: 2, background: tab === t.id ? tk.blue : 'transparent' }} />
                </button>
              ))}
              <div style={{ flex: 1 }} />
              {tab === 'customers' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                  <input className="search-input" type="search" placeholder="Search name or phone…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
                  <button className="btn-outline" onClick={() => loadCustomers()} disabled={loadingC} style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    {loadingC ? <Spin size={12} color={tk.blue} /> : '↻'} Refresh
                  </button>
                </div>
              )}
              {tab === 'logs' && (
                <div style={{ padding: '8px 0' }}>
                  <button className="btn-outline" onClick={() => loadLogs()} disabled={loadingL} style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    {loadingL ? <Spin size={12} color={tk.blue} /> : '↻'} Refresh
                  </button>
                </div>
              )}
            </div>

            {/* ── Customers Table ── */}
            {tab === 'customers' && (
              customers.length === 0
                ? <Empty icon="👥" title="No customers imported" sub="Upload an Excel file above to get started." />
                : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#F9F9FB' }}>
                          {['#', 'Name', 'Phone', 'EMI Amount', 'Loan ID'].map(h => (
                            <th key={h} style={{ padding: '9px 16px', textAlign: 'left', color: tk.textTer, fontWeight: 600, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: `0.5px solid ${tk.border}` }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(q ? filtered : customers).map((c, i) => (
                          <tr key={i} className="trow" style={{ borderBottom: `0.5px solid ${tk.border}` }}>
                            <td style={{ padding: '12px 16px', color: tk.textQuat, fontFamily: tk.mono, fontSize: 11 }}>{i + 1}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 500, color: tk.textPri }}>{c.name || '—'}</td>
                            <td style={{ padding: '12px 16px', fontFamily: tk.mono, color: tk.textSec, fontSize: 12 }}>{c.phone || '—'}</td>
                            <td style={{ padding: '12px 16px', fontWeight: 600, color: tk.blue }}>{fmtINR(c.emi_amount)}</td>
                            <td style={{ padding: '12px 16px', fontFamily: tk.mono, color: tk.textTer, fontSize: 11 }}>{c.loan_id || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {q && filtered.length === 0 && (
                      <Empty icon="🔍" title={`No results for "${search}"`} sub="Try a different name or phone number." />
                    )}
                  </div>
                )
            )}

            {/* ── Call Logs Table ── */}
            {tab === 'logs' && (
              callLogs.length === 0
                ? <Empty icon="📋" title="No call logs yet" sub="Start a calling campaign to see results here." />
                : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#F9F9FB' }}>
                          {['#', 'Call SID', 'Customer', 'Status', 'Customer Response', 'Duration'].map(h => (
                            <th key={h} style={{ padding: '9px 16px', textAlign: 'left', color: tk.textTer, fontWeight: 600, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: `0.5px solid ${tk.border}`, whiteSpace: 'nowrap' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {callLogs.map((log, i) => (
                          <tr key={i} className="trow" style={{ borderBottom: `0.5px solid ${tk.border}` }}>
                            <td style={{ padding: '12px 16px', color: tk.textQuat, fontFamily: tk.mono, fontSize: 11 }}>{i + 1}</td>
                            <td style={{ padding: '12px 16px', fontFamily: tk.mono, color: tk.textTer, fontSize: 11, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.call_sid}>
                              {log.call_sid || '—'}
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 500, color: tk.textPri }}>{log.customer_name || '—'}</td>
                            <td style={{ padding: '12px 16px' }}><StatusBadge status={log.status} /></td>
                            <td style={{ padding: '12px 16px' }}><ResponseBadge value={log.response} /></td>
                            <td style={{ padding: '12px 16px', fontFamily: tk.mono, color: tk.textTer, fontSize: 11 }}>{log.duration ? `${log.duration}s` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
            )}
          </div>
        </div>

        {/* ── Response Legend ── */}
        {callLogs.length > 0 && tab === 'logs' && (
          <div style={{ marginBottom: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(RESPONSE_LABELS).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, background: tk.white, borderRadius: tk.r8, padding: '6px 12px', boxShadow: tk.shadow }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: v.dot }} />
                <span style={{ fontSize: 12, color: tk.textSec }}><strong style={{ color: tk.textPri }}>Code {k}</strong> — {v.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Campaign CTA ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, paddingTop: 8 }}>
          <button
            className={`btn-blue btn-campaign${campaignLive ? ' live' : ''}`}
            onClick={handleCampaign}
            disabled={launching || customers.length === 0}
            style={{ fontSize: 15, fontWeight: 700, padding: '14px 40px', borderRadius: 14, letterSpacing: '-0.02em', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            {launching
              ? <><Spin /> Starting campaign…</>
              : campaignLive
                ? 'Campaign Running…'
                : 'Start Calling Campaign'
            }
          </button>
          <p style={{ fontSize: 12, color: tk.textQuat }}>
            {customers.length === 0
              ? 'Import customers to enable the campaign'
              : campaignLive
                ? 'Auto-refreshing call logs every 5 seconds'
                : `${customers.length} customer${customers.length !== 1 ? 's' : ''} will be called`
            }
          </p>
        </div>

      </main>
    </>
  );
}
