import { useState, useEffect } from "react";
import {
  C, MONTHS, WD_SHORT, WD_FULL,
  ff, ffb, dkey, getDays, getFirst,
  card, btnS, oBtnS, inpS, lblS, badge
} from "./data";
import { fetchSchedule, fetchProviders, fetchRequests, submitRequest, updateRequestStatus, fetchMessages, sendMessage, generateSchedule, saveGeneratedSchedule, cancelRequest, fetchNoCallDayRequests, submitNoCallDayRequest, updateNoCallDayStatus } from "./api";
import { supabase } from "./supabase";

export function IcoHome({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <path d="M3 9.5L12 3l9 6.5V21H15v-6H9v6H3V9.5z" fill={color}/>
    </svg>
  );
}
export function IcoProviders({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <circle cx={9} cy={7} r={3.5} fill={color}/>
      <circle cx={16.5} cy={8} r={2.5} fill={color} opacity={0.5}/>
      <path d="M1 20c0-3.866 3.582-7 8-7s8 3.134 8 7" fill={color}/>
      <path d="M17 14c2.5 0 4.5 1.79 4.5 4" stroke={color} strokeWidth={2.2} strokeLinecap="round" fill="none"/>
    </svg>
  );
}
export function IcoRequest({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <rect x={4} y={3} width={16} height={18} rx={2} stroke={color} strokeWidth={2}/>
      <line x1={8} y1={9}  x2={16} y2={9}  stroke={color} strokeWidth={2} strokeLinecap="round"/>
      <line x1={8} y1={13} x2={16} y2={13} stroke={color} strokeWidth={2} strokeLinecap="round"/>
      <line x1={8} y1={17} x2={12} y2={17} stroke={color} strokeWidth={2} strokeLinecap="round"/>
    </svg>
  );
}
export function IcoMore({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24">
      <circle cx={5}  cy={12} r={2} fill={color}/>
      <circle cx={12} cy={12} r={2} fill={color}/>
      <circle cx={19} cy={12} r={2} fill={color}/>
    </svg>
  );
}
export function IcoBell({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <path d="M12 2a7 7 0 0 0-7 7v4l-2 2.5h18L19 13V9a7 7 0 0 0-7-7z" stroke={color} strokeWidth={2} strokeLinejoin="round"/>
      <path d="M10 19a2 2 0 0 0 4 0" stroke={color} strokeWidth={2} strokeLinecap="round"/>
    </svg>
  );
}
export function IcoGear({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <circle cx={12} cy={12} r={3} fill={color}/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth={1.8}/>
    </svg>
  );
}
export function IcoLock({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <rect x={5} y={11} width={14} height={10} rx={2} stroke={color} strokeWidth={2}/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth={2} strokeLinecap="round"/>
      <circle cx={12} cy={16} r={1.5} fill={color}/>
    </svg>
  );
}
export function IcoClipboard({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <rect x={4} y={4} width={16} height={18} rx={2} stroke={color} strokeWidth={2}/>
      <path d="M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" stroke={color} strokeWidth={2}/>
      <line x1={8} y1={11} x2={16} y2={11} stroke={color} strokeWidth={2} strokeLinecap="round"/>
      <line x1={8} y1={15} x2={13} y2={15} stroke={color} strokeWidth={2} strokeLinecap="round"/>
    </svg>
  );
}
export function IcoPalm({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <path d="M12 22V12" stroke={color} strokeWidth={2} strokeLinecap="round"/>
      <path d="M12 12c0-4 3-7 6-7-1 3-2 5-6 7z" fill={color} opacity={0.7}/>
      <path d="M12 12c0-4-3-7-6-7 1 3 2 5 6 7z" fill={color}/>
      <path d="M12 12c-4 0-7-2-7-5 3 0 5 1 7 5z" fill={color} opacity={0.5}/>
      <line x1={8} y1={22} x2={16} y2={22} stroke={color} strokeWidth={2} strokeLinecap="round"/>
    </svg>
  );
}
export function IcoScale({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <line x1={12} y1={3} x2={12} y2={21} stroke={color} strokeWidth={2} strokeLinecap="round"/>
      <line x1={3} y1={21} x2={21} y2={21} stroke={color} strokeWidth={2} strokeLinecap="round"/>
      <path d="M5 12l-2 6h4l-2-6z" stroke={color} strokeWidth={1.5} strokeLinejoin="round"/>
      <path d="M19 12l-2 6h4l-2-6z" stroke={color} strokeWidth={1.5} strokeLinejoin="round"/>
      <line x1={5} y1={12} x2={19} y2={12} stroke={color} strokeWidth={1.5} strokeLinecap="round"/>
    </svg>
  );
}

export function Avatar({ p, size=40, ring=false }) {
  if (p.avatar_url) {
    return (
      <div style={{
        width:size, height:size, borderRadius:"50%", flexShrink:0,
        outline:ring?`3px solid ${p.color}55`:"none", outlineOffset:2,
        overflow:"hidden"
      }}>
        <img src={p.avatar_url} alt={p.name} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
      </div>
    );
  }
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", background:p.color,
      display:"flex", alignItems:"center", justifyContent:"center",
      color:"#fff", fontFamily:ff, fontWeight:900, fontSize:Math.floor(size*.32),
      flexShrink:0, outline:ring?`3px solid ${p.color}55`:"none", outlineOffset:2
    }}>
      {p.initials}
    </div>
  );
}

export function Toggle({ val, fn }) {
  return (
    <div onClick={() => fn(!val)} style={{
      width:44, height:24, borderRadius:4, cursor:"pointer",
      background:val?C.teal:C.greyMid, position:"relative", transition:"background 0.2s"
    }}>
      <div style={{
        width:18, height:18, borderRadius:3, background:"#fff",
        position:"absolute", top:3, left:val?23:3,
        transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)"
      }}/>
    </div>
  );
}

export function Header({ onNotif, onSettings, logoSrc }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"8px 16px", background:"#FFF", borderBottom:`1px solid ${C.grey}`
    }}>
      <div style={{width:50}}/>
      <img src={logoSrc} alt="Beaches OBGYN" style={{height:52, objectFit:"contain"}}/>
      <div style={{display:"flex", gap:14, alignItems:"center", width:50, justifyContent:"flex-end"}}>
        <div style={{position:"relative", cursor:"pointer"}} onClick={onNotif}>
          <IcoBell color={C.teal}/>
          <div style={{
            position:"absolute", top:-3, right:-3, width:14, height:14,
            background:C.coral, borderRadius:"50%", display:"flex",
            alignItems:"center", justifyContent:"center", border:"2px solid #fff"
          }}>
            <span style={{fontSize:8, color:"#fff", fontWeight:900}}>3</span>
          </div>
        </div>
        <div style={{cursor:"pointer"}} onClick={onSettings}>
          <IcoGear color={C.teal}/>
        </div>
      </div>
    </div>
  );
}

export function NextStrip({ schedule={}, year, month }) {
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const base = isCurrentMonth ? now : new Date(year, month, 1);

  const days = Array.from({length:5}, (_,i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const k = dkey(d.getFullYear(), d.getMonth(), d.getDate());
    return { d, p: schedule[k] };
  });

  return (
    <div style={card({padding:"12px 14px", background:`linear-gradient(135deg,${C.wave}99,#FFF)`, border:`1px solid ${C.wave}`})}>
      <p style={{margin:"0 0 10px", fontFamily:ff, fontWeight:800, fontSize:10, color:C.teal, letterSpacing:1.2, textTransform:"uppercase"}}>
        On Call — Next 5 Days
      </p>
      <div style={{display:"flex", justifyContent:"space-around"}}>
        {days.map(({d,p},i) => (
          <div key={i} style={{display:"flex", flexDirection:"column", alignItems:"center", gap:5}}>
            <span style={{fontFamily:ff, fontWeight:700, fontSize:10, color:C.sub}}>{WD_FULL[d.getDay()].slice(0,3)}</span>
            <span style={{fontFamily:ff, fontWeight:800, fontSize:12, color:C.text}}>{d.getDate()}</span>
            {p ? <Avatar p={p} size={34} ring/> : <div style={{width:34, height:34, borderRadius:"50%", background:C.grey}}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const [yr,setYr]             = useState(new Date().getFullYear());
  const [mo,setMo]             = useState(new Date().getMonth());
  const [sel,setSel]           = useState(null);
  const [schedule,setSchedule] = useState({});
  const [loading,setLoading]   = useState(true);

  useEffect(() => { loadSchedule(yr, mo); }, [yr, mo]);

  async function loadSchedule(year, month) {
    setLoading(true);
    const data = await fetchSchedule(year, month);
    setSchedule(data);
    setLoading(false);
  }

  const days  = getDays(yr,mo);
  const first = getFirst(yr,mo);
  const cells = [];
  for(let i=0;i<first;i++) cells.push(null);
  for(let d=1;d<=days;d++) cells.push(d);

  const today = new Date();
  const isToday = d => yr===today.getFullYear() && mo===today.getMonth() && d===today.getDate();
  const prov    = d => schedule[dkey(yr,mo,d)];
  const prevMo  = () => mo===0  ? (setMo(11), setYr(y=>y-1)) : setMo(m=>m-1);
  const nextMo  = () => mo===11 ? (setMo(0),  setYr(y=>y+1)) : setMo(m=>m+1);
  const selProv = sel ? prov(sel) : null;

  return (
    <div style={{paddingBottom:20}}>
      <div style={card({padding:"16px 14px", marginBottom:14})}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
          <button onClick={prevMo} style={{background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.primary, padding:"0 8px"}}>‹</button>
          <span style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text}}>{MONTHS[mo]} {yr}</span>
          <button onClick={nextMo} style={{background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.primary, padding:"0 8px"}}>›</button>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:6}}>
          {WD_SHORT.map((w,i) => (
            <div key={w} style={{textAlign:"center", fontFamily:ff, fontWeight:800, fontSize:11, color:i===0||i===6?C.coral:C.teal}}>{w}</div>
          ))}
        </div>
        {loading
          ? <div style={{textAlign:"center", padding:"20px", color:C.sub, fontFamily:ff, fontSize:13}}>Loading schedule...</div>
          : <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"2px 0"}}>
              {cells.map((d,i) => {
                if(!d) return <div key={i}/>;
                const p=prov(d), t=isToday(d), s=sel===d;
                return (
                  <div key={i} onClick={()=>setSel(s?null:d)} style={{
                    display:"flex", flexDirection:"column", alignItems:"center",
                    padding:"5px 2px", borderRadius:6, cursor:"pointer",
                    background: s?`${C.teal}15` : t?C.wave : "transparent"
                  }}>
                    <span style={{fontFamily:ff, fontWeight:t||s?900:400, fontSize:13, color:t?C.teal:s?C.primary:C.text}}>{d}</span>
                    {p ? <div style={{width:6, height:6, borderRadius:"50%", background:p.color, marginTop:2}}/> : <div style={{width:6, height:6, marginTop:2}}/>}
                  </div>
                );
              })}
            </div>
        }
        {sel && (
          <div style={{marginTop:12, paddingTop:12, borderTop:`1px solid ${C.grey}`, display:"flex", alignItems:"center", gap:12}}>
            <div style={{width:40, height:40, borderRadius:8, background:C.wave, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <span style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.teal}}>{sel}</span>
            </div>
            {selProv
              ? <><Avatar p={selProv} size={40} ring/><div style={{flex:1}}><p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:13, color:C.text}}>{selProv.name}, {selProv.credentials}</p><p style={{margin:"2px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>On call 7AM → 7AM next day</p></div></>
              : <p style={{fontFamily:ffb, fontSize:13, color:C.sub, margin:0}}>No call assigned</p>
            }
          </div>
        )}
      </div>
      <NextStrip schedule={schedule} year={yr} month={mo}/>
      <button style={btnS({marginTop:14})}>Sync to Calendar</button>
    </div>
  );
}

export function ProvidersPage({ onMessage }) {
  const [providers, setProviders] = useState([]);
  const [open, setOpen]           = useState(null);

  useEffect(() => { fetchProviders().then(setProviders); }, []);

  return (
    <div style={{paddingBottom:20}}>
      <p style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text, marginBottom:12}}>Provider Directory</p>
      {providers.map(p => (
        <div key={p.id} onClick={()=>setOpen(open===p.id?null:p.id)}
          style={card({padding:"13px 16px", marginBottom:10, cursor:"pointer", borderLeft:`3px solid ${open===p.id?p.color:"transparent"}`})}>
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <Avatar p={p} size={46} ring/>
            <div style={{flex:1}}>
              <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>{p.name}</p>
              <p style={{margin:"3px 0 0", fontFamily:ffb, fontSize:12, color:C.sub}}>{p.credentials}</p>
            </div>
            <span style={{color:C.greyMid, fontSize:18}}>{open===p.id?"∨":"›"}</span>
          </div>
          {open===p.id && (
            <div style={{display:"flex", gap:10, marginTop:12, paddingTop:12, borderTop:`1px solid ${C.grey}`}}>
              <button style={btnS({flex:1, padding:"9px", fontSize:13})} onClick={ev=>{ev.stopPropagation(); onMessage(p);}}>Message</button>
              <button style={oBtnS({flex:1, padding:"9px", fontSize:13})} onClick={ev=>ev.stopPropagation()}>Switch Call</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function RequestPage({ currentProvider }) {
  const [tab, setTab]         = useState("new");
  const [type, setType]       = useState("Days Off");
  const [done, setDone]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [myReqs, setMyReqs]   = useState([]);
  const [start, setStart]     = useState("");
  const [end, setEnd]         = useState("");

  const [noCallReqs, setNoCallReqs]       = useState([]);
  const [noCallDay, setNoCallDay]         = useState("");
  const [noCallNotes, setNoCallNotes]     = useState("");
  const [noCallDone, setNoCallDone]       = useState(false);
  const [noCallLoading, setNoCallLoading] = useState(false);

  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  useEffect(() => {
    if (!currentProvider) return;
    fetchRequests(currentProvider.id).then(setMyReqs);
    fetchNoCallDayRequests(currentProvider.id).then(setNoCallReqs);
  }, [currentProvider]);

  const opts = [
    ["Days Off",      "Completely unavailable"],
    ["Off Call Only", "Available for clinic, no call"],
    ["Call Switch",   "Swap with another provider"],
  ];

  const handleSubmit = async () => {
    if (!start || !end || !currentProvider) return;
    setLoading(true);
    const { error } = await submitRequest({ providerId: currentProvider.id, type, startDate: start, endDate: end, notes: "" });
    if (!error) {
      setDone(true);
      fetchRequests(currentProvider.id).then(setMyReqs);
      setTimeout(() => setDone(false), 2500);
    }
    setLoading(false);
  };

  const handleNoCallSubmit = async () => {
    if (!noCallDay || !currentProvider) return;
    setNoCallLoading(true);
    const { error } = await submitNoCallDayRequest({ providerId: currentProvider.id, requestedDay: noCallDay, notes: noCallNotes });
    if (!error) {
      setNoCallDone(true);
      setNoCallDay("");
      setNoCallNotes("");
      fetchNoCallDayRequests(currentProvider.id).then(setNoCallReqs);
      setTimeout(() => setNoCallDone(false), 2500);
    }
    setNoCallLoading(false);
  };

  const takenDays = noCallReqs.filter(r => r.status !== "Denied").map(r => r.requested_day);

  const noCallBadgeStyle = (status) => {
    if (status === "Approved") return { ...badge(status), background: "#65b896" };
    if (status === "Denied")   return { ...badge(status), background: C.coral };
    return badge(status);
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ display: "flex", background: "#FFF", borderRadius: 8, padding: 3, marginBottom: 16, border: `1px solid ${C.grey}` }}>
        {[
          ["new",    "New Request"],
          ["mine",   `My Requests (${myReqs.length})`],
          ["nocall", "No-Call Day"],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: "9px 4px", borderRadius: 6, border: "none",
            fontFamily: ff, fontWeight: 800, fontSize: 11, cursor: "pointer",
            background: tab === k ? C.teal : "transparent",
            color: tab === k ? "#fff" : C.sub,
          }}>{l}</button>
        ))}
      </div>

      {tab === "new" && <>
        <div style={card({ padding: "14px", marginBottom: 12, display: "flex", gap: 10, alignItems: "center" })}>
          <div style={{ flex: 1 }}>
            <span style={lblS}>Start</span>
            <input type="date" value={start} onChange={e => setStart(e.target.value)} style={inpS} />
          </div>
          <span style={{ fontSize: 18, color: C.teal, marginTop: 16 }}>→</span>
          <div style={{ flex: 1 }}>
            <span style={lblS}>End</span>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} style={inpS} />
          </div>
        </div>
        {opts.map(([title, sub]) => (
          <div key={title} onClick={() => setType(title)} style={card({
            padding: "13px 16px", marginBottom: 10, cursor: "pointer",
            border: `1.5px solid ${type === title ? C.teal : C.grey}`,
            background: type === title ? `${C.wave}55` : "#FFF",
            display: "flex", alignItems: "center", gap: 14,
          })}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${type === title ? C.teal : C.greyMid}`,
              background: type === title ? C.teal : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {type === title && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 14, color: C.text }}>{title}</p>
              <p style={{ margin: "2px 0 0", fontFamily: ffb, fontSize: 11, color: C.sub }}>{sub}</p>
            </div>
          </div>
        ))}
        {done
          ? <div style={{ padding: 13, borderRadius: 8, textAlign: "center", background: C.wave, border: `1.5px solid ${C.teal}` }}>
              <span style={{ fontFamily: ff, fontWeight: 900, fontSize: 14, color: C.teal }}>Request Submitted!</span>
            </div>
          : <button style={btnS({ opacity: loading ? 0.7 : 1 })} onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>
        }
      </>}

      {tab === "mine" && myReqs.map(r => {
        const canCancel = new Date(r.start_date) > new Date();
        return (
          <div key={r.id} style={card({ padding: "13px 16px", marginBottom: 10 })}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: canCancel ? 10 : 0 }}>
              <div>
                <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 14, color: C.text }}>{r.type}</p>
                <p style={{ margin: "3px 0 0", fontFamily: ffb, fontSize: 12, color: C.sub }}>{r.start_date} → {r.end_date}</p>
              </div>
              <span style={badge(r.status)}>{r.status}</span>
            </div>
            {canCancel && (
              <button
                style={oBtnS({ width: "100%", padding: "8px", fontSize: 12, color: C.coral, borderColor: C.coral })}
                onClick={async () => {
                  const ok = await cancelRequest(r.id);
                  if (ok) fetchRequests(currentProvider.id).then(setMyReqs);
                }}>
                Cancel Request
              </button>
            )}
          </div>
        );
      })}

      {tab === "nocall" && <>
        <div style={card({ padding: "12px 14px", marginBottom: 14, background: `${C.wave}88`, border: `1px solid ${C.teal}33` })}>
          <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 13, color: C.teal }}>Recurring Weekly No-Call Day</p>
          <p style={{ margin: "4px 0 0", fontFamily: ffb, fontSize: 12, color: C.sub }}>
            Request one day per week where you won't be assigned to call. Requires admin approval.
          </p>
        </div>
        {currentProvider?.no_call_day && (
          <div style={card({ padding: "12px 14px", marginBottom: 14, borderLeft: `3px solid #65b896` })}>
            <p style={{ margin: 0, fontFamily: ff, fontWeight: 700, fontSize: 11, color: C.sub, textTransform: "uppercase", letterSpacing: 1 }}>
              Current No-Call Day
            </p>
            <p style={{ margin: "4px 0 0", fontFamily: ff, fontWeight: 900, fontSize: 15, color: C.text }}>
              {currentProvider.no_call_day}
            </p>
          </div>
        )}
        <div style={card({ padding: "14px", marginBottom: 14 })}>
          <p style={{ margin: "0 0 12px", fontFamily: ff, fontWeight: 800, fontSize: 13, color: C.text }}>Submit a New Request</p>
          <span style={lblS}>Preferred Day</span>
          <select value={noCallDay} onChange={e => setNoCallDay(e.target.value)} style={{ ...inpS, marginBottom: 12 }}>
            <option value="">Select a day…</option>
            {DAYS.map(d => (
              <option key={d} value={d} disabled={takenDays.includes(d)}>
                {d}{takenDays.includes(d) ? " (already requested)" : ""}
              </option>
            ))}
          </select>
          <span style={lblS}>Notes (optional)</span>
          <textarea
            value={noCallNotes}
            onChange={e => setNoCallNotes(e.target.value)}
            placeholder="e.g. Teaching duties, research day…"
            rows={2}
            style={{ ...inpS, resize: "none", marginBottom: 12, fontFamily: ffb }}
          />
          {noCallDone
            ? <div style={{ padding: 13, borderRadius: 8, textAlign: "center", background: C.wave, border: `1.5px solid ${C.teal}` }}>
                <span style={{ fontFamily: ff, fontWeight: 900, fontSize: 14, color: C.teal }}>Request Submitted!</span>
              </div>
            : <button
                style={btnS({ opacity: (!noCallDay || noCallLoading) ? 0.6 : 1 })}
                onClick={handleNoCallSubmit}
                disabled={!noCallDay || noCallLoading}
              >
                {noCallLoading ? "Submitting…" : "Submit Request"}
              </button>
          }
        </div>
        {noCallReqs.length > 0 && <>
          <p style={{ fontFamily: ff, fontWeight: 800, fontSize: 11, color: C.sub, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            My Requests
          </p>
          {noCallReqs.map(r => (
            <div key={r.id} style={card({ padding: "13px 16px", marginBottom: 10 })}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 14, color: C.text }}>{r.requested_day}</p>
                  <p style={{ margin: "3px 0 0", fontFamily: ffb, fontSize: 11, color: C.sub }}>
                    Recurring weekly · {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  {r.notes && <p style={{ margin: "3px 0 0", fontFamily: ffb, fontSize: 11, color: C.sub }}>{r.notes}</p>}
                </div>
                <span style={noCallBadgeStyle(r.status)}>{r.status}</span>
              </div>
            </div>
          ))}
        </>}
      </>}
    </div>
  );
}

export function MorePage({ onNav, currentProvider }) {
  const isAdmin = currentProvider?.is_admin;
  const items = [
    ...(isAdmin ? [[IcoLock,"Admin Panel","admin"]] : []),
    [IcoClipboard,"Call Logic","logic"],
    [IcoPalm,"Upcoming Vacations","vacations"],
    [IcoScale,"Call Fairness","fairness"],
    [IcoGear,"Settings","settings"],
  ];
  return (
    <div style={{paddingBottom:20}}>
      <p style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text, marginBottom:12}}>More</p>
      {items.map(([Icon,label,key]) => (
        <div key={key} onClick={()=>onNav(key)} style={card({padding:"13px 16px", marginBottom:10, display:"flex", alignItems:"center", gap:14, cursor:"pointer"})}>
          <div style={{width:36, height:36, borderRadius:8, background:C.wave, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
            <Icon color={C.teal}/>
          </div>
          <span style={{fontFamily:ff, fontWeight:700, fontSize:14, color:C.text, flex:1}}>{label}</span>
          <span style={{color:C.greyMid, fontSize:18}}>›</span>
        </div>
      ))}
    </div>
  );
}

// Returns the number of calendar days in a given year/month
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns true if every calendar day in the month has a provider assigned
function isMonthComplete(scheduleData, year, month) {
  const total = daysInMonth(year, month);
  for (let d = 1; d <= total; d++) {
    const key = `${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    if (!scheduleData[key]) return false;
  }
  return true;
}

// Returns a list of {year, month} from startYM up to (not including) targetYM
function monthsBetween(startY, startM, endY, endM) {
  const result = [];
  let y = startY, m = startM;
  while (y < endY || (y === endY && m < endM)) {
    result.push({ year: y, month: m });
    m++;
    if (m > 11) { m = 0; y++; }
  }
  return result;
}

function AIScheduleGenerator() {
  const [loading, setLoading]         = useState(false);
  const [checking, setChecking]       = useState(true);
  const [summary, setSummary]         = useState(null);
  const [error, setError]             = useState(null);
  const [month, setMonth]             = useState(new Date().getMonth());
  const [year, setYear]               = useState(new Date().getFullYear());
  const [originYM, setOriginYM]       = useState(null);   // { year, month } of earliest scheduled month
  const [completeMonths, setCompleteMonths] = useState({}); // "YYYY-M" -> true/false

  // On mount: find the origin month (earliest month with ANY schedule data)
  // then check completeness of every month from origin up to 12 months ahead
  useEffect(() => {
    async function init() {
      setChecking(true);
      const today = new Date();
      const scanStart = { year: today.getFullYear() - 2, month: 0 };
      const scanEnd   = { year: today.getFullYear() + 2, month: 11 };

      // Collect all months to scan
      const toScan = monthsBetween(scanStart.year, scanStart.month, scanEnd.year, scanEnd.month + 1);

      // Fetch all in parallel
      const results = await Promise.all(
        toScan.map(({ year, month }) =>
          fetchSchedule(year, month).then(data => ({ year, month, data }))
        )
      );

      // Find origin: earliest month with at least 1 day assigned
      let origin = null;
      for (const { year, month, data } of results) {
        if (Object.keys(data).length > 0) {
          if (!origin || year < origin.year || (year === origin.year && month < origin.month)) {
            origin = { year, month };
          }
        }
      }

      if (!origin) {
        // No schedules exist at all — allow generating current month freely
        setOriginYM(null);
        setCompleteMonths({});
        setChecking(false);
        return;
      }

      setOriginYM(origin);

      // Check completeness for every month from origin onwards
      const completeness = {};
      for (const { year, month, data } of results) {
        const key = `${year}-${month}`;
        completeness[key] = isMonthComplete(data, year, month);
      }
      setCompleteMonths(completeness);
      setChecking(false);
    }
    init();
  }, []);

  // For a given target year/month, check if all months from origin up to (not including) target are complete
  const getBlockingMonths = (targetYear, targetMonth) => {
    if (!originYM) return []; // no origin = no restriction
    const prior = monthsBetween(originYM.year, originYM.month, targetYear, targetMonth);
    return prior.filter(({ year, month }) => {
      const key = `${year}-${month}`;
      return !completeMonths[key];
    });
  };

  const selectedBlocking = getBlockingMonths(year, month);
  const isBlocked = selectedBlocking.length > 0;

  // Build year options: current year and next 2
  const thisYear = new Date().getFullYear();
  const yearOptions = [thisYear, thisYear + 1, thisYear + 2];

  const handleYearChange = (newYear) => {
    setYear(Number(newYear));
    setSummary(null);
    setError(null);
  };

  const handleMonthChange = (newMonth) => {
    setMonth(Number(newMonth));
    setSummary(null);
    setError(null);
  };

  const [bulk, setBulk] = useState(false); // false = 1 month, true = 3 months

  // The 3 months starting from selected month
  const bulkMonths = (() => {
    const result = [];
    let y = year, m = month;
    for (let i = 0; i < 3; i++) {
      result.push({ year: y, month: m });
      m++;
      if (m > 11) { m = 0; y++; }
    }
    return result;
  })();

  // For bulk mode, check if ANY of the 3 months is blocked
  const bulkBlockingMap = bulk
    ? bulkMonths.map(({ year: y, month: m }) => ({ year: y, month: m, blocking: getBlockingMonths(y, m) }))
    : [];
  const bulkBlocked = bulkBlockingMap.some(b => b.blocking.length > 0);

  const handleGenerate = async () => {
    if (bulk ? bulkBlocked : isBlocked) return;
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const [providers, requests] = await Promise.all([fetchProviders(), fetchRequests()]);
      const monthsToGenerate = bulk ? bulkMonths : [{ year, month }];
      const summaries = [];

      for (const { year: y, month: m } of monthsToGenerate) {
        const previousSchedule = await fetchSchedule(m === 0 ? y - 1 : y, m === 0 ? 11 : m - 1);
        const result = await generateSchedule({ providers, requests, year: y, month: m, previousSchedule });
        await saveGeneratedSchedule(result.schedule, providers, y, m);
        summaries.push(`${MONTHS[m]} ${y}: ${result.summary}`);
        // Update completeness live as each month finishes
        const newData = await fetchSchedule(y, m);
        setCompleteMonths(prev => ({
          ...prev,
          [`${y}-${m}`]: isMonthComplete(newData, y, m),
        }));
      }

      setSummary(summaries.join("\n\n"));
    } catch(err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={card({padding:"14px"})}>
      <p style={{margin:"0 0 4px", fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>AI Schedule Generator</p>
      <p style={{margin:"0 0 12px", fontFamily:ffb, fontSize:12, color:C.sub}}>
        Generate a fair call schedule using AI. All prior months must be fully scheduled first to ensure accurate call parity tracking.
      </p>

      {checking
        ? <p style={{fontFamily:ffb, fontSize:12, color:C.sub, marginBottom:12}}>Checking schedule history…</p>
        : <>
            {/* 1 month vs 3 months toggle */}
            <div style={{display:"flex", background:"#FFF", borderRadius:8, padding:3, marginBottom:12, border:`1px solid ${C.grey}`}}>
              {[["1 Month", false],["3 Months", true]].map(([label, val]) => (
                <button key={label} onClick={() => { setBulk(val); setSummary(null); setError(null); }} style={{
                  flex:1, padding:"8px", borderRadius:6, border:"none",
                  fontFamily:ff, fontWeight:800, fontSize:12, cursor:"pointer",
                  background: bulk === val ? C.teal : "transparent",
                  color: bulk === val ? "#fff" : C.sub,
                }}>{label}</button>
              ))}
            </div>

            <div style={{display:"flex", gap:8, marginBottom:10}}>
              {/* Month dropdown — disable months that are blocked */}
              <select
                value={month}
                onChange={e => handleMonthChange(e.target.value)}
                style={{...inpS, flex:1}}
              >
                {MONTHS.map((m, i) => {
                  const blocking = getBlockingMonths(year, i);
                  const blocked  = blocking.length > 0;
                  return (
                    <option key={i} value={i} disabled={blocked}>
                      {m}{blocked ? " ⚠ incomplete prior months" : ""}
                    </option>
                  );
                })}
              </select>

              {/* Year dropdown */}
              <select
                value={year}
                onChange={e => handleYearChange(e.target.value)}
                style={{...inpS, width:90}}
              >
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Bulk month preview chips */}
            {bulk && (
              <div style={{display:"flex", gap:6, marginBottom:12}}>
                {bulkMonths.map(({ year: y, month: m }, i) => {
                  const blocked = getBlockingMonths(y, m).length > 0;
                  return (
                    <div key={i} style={{
                      flex:1, padding:"6px 8px", borderRadius:8, textAlign:"center",
                      background: blocked ? "#fff7ed" : `${C.wave}88`,
                      border: `1.5px solid ${blocked ? "#f59e0b" : C.teal}`,
                    }}>
                      <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:11, color: blocked ? "#b45309" : C.teal}}>{MONTHS[m]}</p>
                      <p style={{margin:"2px 0 0", fontFamily:ffb, fontSize:10, color: blocked ? "#b45309" : C.sub}}>{y}</p>
                      {blocked && <p style={{margin:"2px 0 0", fontSize:10}}>⚠</p>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Blocking warning — single month */}
            {!bulk && isBlocked && (
              <div style={{padding:"10px 12px", borderRadius:8, marginBottom:12, background:"#fff7ed", border:"1px solid #f59e0b"}}>
                <p style={{margin:"0 0 4px", fontFamily:ff, fontWeight:800, fontSize:12, color:"#b45309"}}>
                  ⚠ Cannot generate {MONTHS[month]} {year}
                </p>
                <p style={{margin:"0 0 6px", fontFamily:ffb, fontSize:11, color:"#92400e"}}>
                  The following months must be fully completed first:
                </p>
                {selectedBlocking.map(({year: y, month: m}) => (
                  <p key={`${y}-${m}`} style={{margin:"2px 0", fontFamily:ff, fontWeight:700, fontSize:11, color:"#b45309"}}>
                    · {MONTHS[m]} {y} — incomplete
                  </p>
                ))}
              </div>
            )}

            {/* Blocking warning — bulk */}
            {bulk && bulkBlocked && (
              <div style={{padding:"10px 12px", borderRadius:8, marginBottom:12, background:"#fff7ed", border:"1px solid #f59e0b"}}>
                <p style={{margin:"0 0 4px", fontFamily:ff, fontWeight:800, fontSize:12, color:"#b45309"}}>
                  ⚠ Some months in this range cannot be generated yet
                </p>
                {bulkBlockingMap.filter(b => b.blocking.length > 0).map(({ year: y, month: m, blocking }) => (
                  <div key={`${y}-${m}`} style={{marginTop:6}}>
                    <p style={{margin:"0 0 2px", fontFamily:ff, fontWeight:800, fontSize:11, color:"#b45309"}}>{MONTHS[m]} {y} requires:</p>
                    {blocking.map(({ year: by, month: bm }) => (
                      <p key={`${by}-${bm}`} style={{margin:"1px 0 1px 8px", fontFamily:ffb, fontSize:11, color:"#92400e"}}>
                        · {MONTHS[bm]} {by} — incomplete
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {summary && (
              <div style={{padding:"10px 12px", borderRadius:8, background:C.wave, border:`1px solid ${C.teal}`, marginBottom:12}}>
                {summary.split("\n\n").map((s, i) => (
                  <p key={i} style={{margin: i > 0 ? "8px 0 0" : 0, fontFamily:ffb, fontSize:12, color:C.text}}>{s}</p>
                ))}
              </div>
            )}
            {error && <p style={{fontFamily:ffb, fontSize:12, color:"#e05555", marginBottom:12}}>{error}</p>}

            <button
              style={btnS({opacity: (loading || (bulk ? bulkBlocked : isBlocked)) ? 0.5 : 1, cursor: (bulk ? bulkBlocked : isBlocked) ? "not-allowed" : "pointer"})}
              onClick={handleGenerate}
              disabled={loading || (bulk ? bulkBlocked : isBlocked)}
            >
              {loading
                ? "Generating schedule..."
                : bulk
                  ? `Generate ${MONTHS[month]}–${MONTHS[bulkMonths[2].month]} ${year}${bulkMonths[2].year !== year ? "/"+bulkMonths[2].year : ""}`
                  : `Generate ${MONTHS[month]} ${year} Schedule`
              }
            </button>
          </>
      }
    </div>
  );
}

export function AdminPage({ onBack }) {
  const [tab, setTab]               = useState("requests");
  const [reqs, setReqs]             = useState([]);
  const [noCallReqs, setNoCallReqs] = useState([]);
  const [providers, setProviders]   = useState([]);

  // Users tab state
  const [userAction, setUserAction]     = useState(null); // "invite" | "create" | "reset" | null
  const [targetProvider, setTargetProvider] = useState(null);
  const [newName, setNewName]           = useState("");
  const [newEmail, setNewEmail]         = useState("");
  const [newCreds, setNewCreds]         = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [userMsg, setUserMsg]           = useState(null); // { text, ok }
  const [userLoading, setUserLoading]   = useState(false);

  useEffect(() => {
    fetchRequests().then(setReqs);
    fetchNoCallDayRequests().then(setNoCallReqs);
    fetchProviders().then(setProviders);
  }, []);

  const resetUserForm = () => {
    setUserAction(null); setTargetProvider(null);
    setNewName(""); setNewEmail(""); setNewCreds(""); setTempPassword("");
    setUserMsg(null);
  };

  const callApi = async (path, body) => {
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error(`API ${path} returned ${res.status}:`, text);
        return { error: `Server error ${res.status}: ${text}` };
      }
      return res.json();
    } catch (err) {
      console.error(`API ${path} fetch failed:`, err);
      return { error: `Network error: ${err.message}` };
    }
  };

  const handleInvite = async (mode) => {
    setUserLoading(true); setUserMsg(null);
    const result = await callApi("/api/admin-invite", { name: newName, email: newEmail, credentials: newCreds, mode, tempPassword });
    setUserMsg({ text: result.message || result.error || "Unknown error", ok: !!result.message });
    if (result.message) { fetchProviders().then(setProviders); setNewName(""); setNewEmail(""); setNewCreds(""); setTempPassword(""); }
    setUserLoading(false);
  };

  const handleReset = async (mode) => {
    setUserLoading(true); setUserMsg(null);
    const result = await callApi("/api/admin-reset-password", { email: targetProvider.email, mode, tempPassword });
    setUserMsg({ text: result.message || result.error || "Unknown error", ok: !!result.message });
    if (result.message) setTempPassword("");
    setUserLoading(false);
  };

  const handleDeleteUser = async (provider) => {
    if (!window.confirm(`Are you sure you want to delete ${provider.name}? This cannot be undone.`)) return;
    setUserLoading(true);
    const result = await callApi("/api/admin-delete-user", { providerId: provider.id, email: provider.email });
    if (result.message) {
      fetchProviders().then(setProviders);
      setTargetProvider(null);
    } else {
      setUserMsg({ text: result.error || "Failed to delete user", ok: false });
    }
    setUserLoading(false);
  };

  const handleRoleToggle = async (provider) => {
    setUserLoading(true);
    const result = await callApi("/api/admin-update-role", { providerId: provider.id, isAdmin: !provider.is_admin });
    if (result.message) {
      fetchProviders().then(setProviders);
    } else {
      setUserMsg({ text: result.error || "Failed to update role", ok: false });
    }
    setUserLoading(false);
  };

  const handleStatus = async (id, status) => {
    await updateRequestStatus(id, status);
    fetchRequests().then(setReqs);
  };

  const handleNoCallStatus = async (id, status, providerId, day) => {
    await updateNoCallDayStatus(id, status, providerId, day);
    fetchNoCallDayRequests().then(setNoCallReqs);
  };

  const pendingNoCall = noCallReqs.filter(r => r.status === "Pending").length;

  return (
    <div style={{paddingBottom:20}}>
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
        <button onClick={onBack} style={{background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.primary}}>‹</button>
        <span style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text}}>Admin Panel</span>
      </div>
      <div style={{display:"flex", background:"#FFF", borderRadius:8, padding:3, marginBottom:16, border:`1px solid ${C.grey}`}}>
        {[
          ["requests", "Requests"],
          ["nocall",   `No-Call${pendingNoCall > 0 ? ` (${pendingNoCall})` : ""}`],
          ["users",    "Users"],
          ["schedule", "Schedule"],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: "9px 2px", borderRadius: 6, border: "none",
            fontFamily: ff, fontWeight: 800, fontSize: 10, cursor: "pointer",
            background: tab === k ? C.teal : "transparent",
            color: tab === k ? "#fff" : C.sub,
          }}>{l}</button>
        ))}
      </div>

      {tab === "requests" && <>
        {reqs.length === 0 && <div style={card({padding:"20px", textAlign:"center"})}><p style={{fontFamily:ff, fontSize:13, color:C.sub}}>No requests yet</p></div>}
        {reqs.map(r => (
          <div key={r.id} style={card({padding:"13px 16px", marginBottom:10})}>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:r.status==="Pending"?10:0}}>
              {r.providers && <Avatar p={r.providers} size={36}/>}
              <div style={{flex:1}}>
                <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:13, color:C.text}}>{r.providers?.name}</p>
                <p style={{margin:"2px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>{r.type} · {r.start_date} → {r.end_date}</p>
              </div>
              <span style={badge(r.status)}>{r.status}</span>
            </div>
            {r.status === "Pending" && (
              <div style={{display:"flex", gap:8}}>
                <button style={btnS({flex:1, padding:"9px", fontSize:12, background:"#65b896"})} onClick={()=>handleStatus(r.id,"Approved")}>Approve</button>
                <button style={btnS({flex:1, padding:"9px", fontSize:12, background:C.coral})} onClick={()=>handleStatus(r.id,"Denied")}>Deny</button>
              </div>
            )}
          </div>
        ))}
        <AIScheduleGenerator/>
      </>}

      {tab === "nocall" && <>
        {noCallReqs.length === 0 && (
          <div style={card({padding:"20px", textAlign:"center"})}>
            <p style={{fontFamily:ff, fontSize:13, color:C.sub}}>No no-call day requests yet</p>
          </div>
        )}
        {noCallReqs.map(r => (
          <div key={r.id} style={card({padding:"13px 16px", marginBottom:10})}>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom: r.status === "Pending" ? 10 : 0}}>
              {r.providers && <Avatar p={r.providers} size={36}/>}
              <div style={{flex:1}}>
                <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:13, color:C.text}}>{r.providers?.name}</p>
                <p style={{margin:"2px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>Recurring · {r.requested_day}</p>
                {r.notes && <p style={{margin:"2px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>{r.notes}</p>}
              </div>
              <span style={badge(r.status)}>{r.status}</span>
            </div>
            {r.status === "Pending" && (
              <div style={{display:"flex", gap:8}}>
                <button style={btnS({flex:1, padding:"9px", fontSize:12, background:"#65b896"})} onClick={()=>handleNoCallStatus(r.id,"Approved",r.provider_id,r.requested_day)}>Approve</button>
                <button style={btnS({flex:1, padding:"9px", fontSize:12, background:C.coral})} onClick={()=>handleNoCallStatus(r.id,"Denied",r.provider_id,r.requested_day)}>Deny</button>
              </div>
            )}
          </div>
        ))}
      </>}

      {tab === "users" && <>

        {/* Add new user card */}
        <div style={card({padding:"14px", marginBottom:14})}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: userAction === "invite" || userAction === "create" ? 12 : 0}}>
            <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:13, color:C.text}}>Add New User</p>
            <div style={{display:"flex", gap:6}}>
              {[["invite","Send Invite"],["create","Set Password"]].map(([mode, label]) => (
                <button key={mode} onClick={() => { resetUserForm(); setUserAction(userAction === mode ? null : mode); }} style={{
                  padding:"6px 10px", borderRadius:7, border:`1.5px solid ${userAction===mode ? C.teal : C.grey}`,
                  background: userAction===mode ? C.teal : "#FFF",
                  color: userAction===mode ? "#fff" : C.sub,
                  fontFamily:ff, fontWeight:700, fontSize:11, cursor:"pointer",
                }}>{label}</button>
              ))}
            </div>
          </div>

          {(userAction === "invite" || userAction === "create") && <>
            <div style={{marginBottom:8}}>
              <span style={lblS}>Full Name</span>
              <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Dr. Jane Smith" style={inpS}/>
            </div>
            <div style={{marginBottom:8}}>
              <span style={lblS}>Email</span>
              <input type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="jane@beachesobgyn.com" style={inpS}/>
            </div>
            <div style={{marginBottom: userAction==="create" ? 8 : 12}}>
              <span style={lblS}>Credentials</span>
              <input value={newCreds} onChange={e=>setNewCreds(e.target.value)} placeholder="MD, DO, NP…" style={inpS}/>
            </div>
            {userAction === "create" && (
              <div style={{marginBottom:12}}>
                <span style={lblS}>Temporary Password</span>
                <input type="password" value={tempPassword} onChange={e=>setTempPassword(e.target.value)} placeholder="Min 6 characters" style={inpS}/>
              </div>
            )}
            {userMsg && (
              <div style={{padding:"8px 12px", borderRadius:7, marginBottom:10, background: userMsg.ok ? C.wave : "#fff0f0", border:`1px solid ${userMsg.ok ? C.teal : C.coral}`}}>
                <p style={{margin:0, fontFamily:ffb, fontSize:12, color: userMsg.ok ? C.teal : C.coral}}>{userMsg.text}</p>
              </div>
            )}
            <button
              style={btnS({opacity: userLoading ? 0.6 : 1})}
              disabled={userLoading}
              onClick={() => handleInvite(userAction)}
            >
              {userLoading ? "Processing…" : userAction === "invite" ? "Send Invite Email" : "Create Account"}
            </button>
          </>}
        </div>

        {/* Provider list */}
        <p style={{fontFamily:ff, fontWeight:800, fontSize:11, color:C.sub, textTransform:"uppercase", letterSpacing:1, marginBottom:8}}>
          Current Users
        </p>
        {providers.map(p => (
          <div key={p.id} style={card({padding:"13px 16px", marginBottom:10})}>
            <div style={{display:"flex", alignItems:"center", gap:10, marginBottom: targetProvider?.id === p.id ? 12 : 0}}>
              <Avatar p={p} size={36}/>
              <div style={{flex:1}}>
                <div style={{display:"flex", alignItems:"center", gap:6}}>
                  <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:13, color:C.text}}>{p.name}</p>
                  {p.is_admin && <span style={{fontFamily:ff, fontWeight:700, fontSize:9, color:"#fff", background:C.teal, borderRadius:4, padding:"2px 5px"}}>ADMIN</span>}
                </div>
                <p style={{margin:"2px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>{p.email}</p>
              </div>
              <button
                onClick={() => { setTargetProvider(targetProvider?.id === p.id ? null : p); setUserMsg(null); setTempPassword(""); }}
                style={{background:"none", border:"none", fontSize:18, cursor:"pointer", color:C.greyMid}}
              >
                {targetProvider?.id === p.id ? "∨" : "›"}
              </button>
            </div>

            {targetProvider?.id === p.id && <>
              {/* Reset password */}
              <div style={{borderTop:`1px solid ${C.grey}`, paddingTop:12, marginBottom:10}}>
                <p style={{margin:"0 0 8px", fontFamily:ff, fontWeight:700, fontSize:12, color:C.text}}>Reset Password</p>
                <div style={{display:"flex", gap:8, marginBottom:8}}>
                  <button
                    style={oBtnS({flex:1, padding:"8px", fontSize:11})}
                    disabled={userLoading}
                    onClick={() => handleReset("email")}
                  >
                    {userLoading ? "…" : "Send Reset Email"}
                  </button>
                </div>
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <input
                    type="password"
                    value={tempPassword}
                    onChange={e=>setTempPassword(e.target.value)}
                    placeholder="Set temp password…"
                    style={{...inpS, flex:1, margin:0}}
                  />
                  <button
                    style={btnS({width:"auto", padding:"9px 12px", fontSize:11, opacity: tempPassword ? 1 : 0.5})}
                    disabled={!tempPassword || userLoading}
                    onClick={() => handleReset("temp")}
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* Toggle admin role */}
              <div style={{borderTop:`1px solid ${C.grey}`, paddingTop:12, display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12}}>
                <div>
                  <p style={{margin:0, fontFamily:ff, fontWeight:700, fontSize:12, color:C.text}}>Admin Access</p>
                  <p style={{margin:"2px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>Can manage schedules & users</p>
                </div>
                <Toggle val={!!p.is_admin} fn={() => handleRoleToggle(p)}/>
              </div>

              {/* Delete user */}
              <button
                style={oBtnS({width:"100%", padding:"9px", fontSize:12, color:C.coral, borderColor:C.coral, opacity: userLoading ? 0.6 : 1})}
                disabled={userLoading}
                onClick={() => handleDeleteUser(p)}
              >
                {userLoading ? "Processing…" : "Delete User"}
              </button>

              {userMsg && targetProvider?.id === p.id && (
                <div style={{padding:"8px 12px", borderRadius:7, marginTop:10, background: userMsg.ok ? C.wave : "#fff0f0", border:`1px solid ${userMsg.ok ? C.teal : C.coral}`}}>
                  <p style={{margin:0, fontFamily:ffb, fontSize:12, color: userMsg.ok ? C.teal : C.coral}}>{userMsg.text}</p>
                </div>
              )}
            </>}
          </div>
        ))}
      </>}

      {tab === "schedule" && (
        <div>
          <div style={card({padding:"14px", marginBottom:10})}>
            <p style={{margin:"0 0 10px", fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>October 2026</p>
            <div style={{display:"flex", gap:8}}>
              <button style={oBtnS({flex:1, padding:"9px"})}>Lock</button>
              <button style={oBtnS({flex:1, padding:"9px"})}>Unlock</button>
              <button style={btnS({flex:1, padding:"9px", fontSize:12})}>Publish</button>
            </div>
          </div>
          <button style={btnS()}>Export PDF</button>
        </div>
      )}
    </div>
  );
}

export function MessagesPage({ recipient, onBack, currentProvider }) {
  const [txt,setTxt]   = useState("");
  const [msgs,setMsgs] = useState([]);

  useEffect(() => {
    if (!currentProvider || !recipient) return;
    fetchMessages(currentProvider.id, recipient.id).then(setMsgs);
    const interval = setInterval(() => {
      fetchMessages(currentProvider.id, recipient.id).then(setMsgs);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentProvider, recipient]);

  const send = async () => {
    if (!txt.trim() || !currentProvider || !recipient) return;
    const { data } = await sendMessage({ senderId:currentProvider.id, recipientId:recipient.id, text:txt });
    if (data) setMsgs(m => [...m, data]);
    setTxt("");
  };

  return (
    <div style={{display:"flex", flexDirection:"column", height:"100%"}}>
      <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:14, flexShrink:0}}>
        <button onClick={onBack} style={{background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.primary}}>‹</button>
        {recipient && <Avatar p={recipient} size={36} ring/>}
        <div>
          <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>{recipient?.name || "Messages"}</p>
          <p style={{margin:0, fontFamily:ffb, fontSize:11, color:C.teal}}>● Online</p>
        </div>
      </div>
      <div style={{flex:1, overflowY:"auto", marginBottom:12}}>
        {msgs.map(m => {
          const isMe = currentProvider && m.sender_id === currentProvider.id;
          return (
            <div key={m.id} style={{display:"flex", justifyContent:isMe?"flex-end":"flex-start", marginBottom:10}}>
              {!isMe && recipient && <div style={{marginRight:8, alignSelf:"flex-end"}}><Avatar p={recipient} size={26}/></div>}
              <div style={{
                maxWidth:"72%", padding:"9px 13px",
                borderRadius:isMe?"12px 12px 3px 12px":"12px 12px 12px 3px",
                background:isMe?C.teal:"#FFF", color:isMe?"#fff":C.text,
                fontFamily:ffb, fontSize:13, boxShadow:"0 1px 5px rgba(0,0,0,0.07)"
              }}>
                <p style={{margin:"0 0 3px"}}>{m.text}</p>
                <span style={{fontSize:10, opacity:.6}}>{new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex", gap:8, flexShrink:0}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..." style={{...inpS, flex:1}}/>
        <button onClick={send} style={btnS({width:"auto", padding:"10px 16px", fontSize:13})}>Send</button>
      </div>
    </div>
  );
}

export function SettingsPage({ onBack, onLogout, currentProvider }) {
  const [faceId,setFaceId] = useState(true);
  const [notifs,setNotifs] = useState({all:true, published:true, changes:true, messages:true});

  return (
    <div style={{paddingBottom:20}}>
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
        <button onClick={onBack} style={{background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.primary}}>‹</button>
        <span style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text}}>Settings</span>
      </div>
      <div style={card({padding:"16px", marginBottom:12})}>
        <div style={{display:"flex", alignItems:"center", gap:14, marginBottom:14}}>
          {currentProvider && <Avatar p={currentProvider} size={50} ring/>}
          <div>
            <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:15, color:C.text}}>{currentProvider?.name}</p>
            <p style={{margin:"3px 0 0", fontFamily:ffb, fontSize:12, color:C.sub}}>{currentProvider?.email}</p>
          </div>
        </div>
        {["Full Name","Phone Number","Display Name"].map(f => (
          <div key={f} style={{marginBottom:10}}>
            <span style={lblS}>{f}</span>
            <input style={inpS} placeholder={f}/>
          </div>
        ))}
      </div>
      <div style={card({padding:"16px", marginBottom:12})}>
        <p style={{margin:"0 0 14px", fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>Security</p>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
          <div>
            <p style={{margin:0, fontFamily:ff, fontWeight:700, fontSize:13, color:C.text}}>Face ID / Touch ID</p>
            <p style={{margin:"2px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>Quick, secure login</p>
          </div>
          <Toggle val={faceId} fn={setFaceId}/>
        </div>
        <button style={oBtnS({width:"100%", marginBottom:8, padding:"10px"})}>Change Password</button>
        <button onClick={onLogout} style={oBtnS({width:"100%", padding:"10px", color:C.coral, borderColor:C.coral})}>Logout</button>
      </div>
      <div style={card({padding:"16px"})}>
        <p style={{margin:"0 0 14px", fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>Notifications</p>
        {[["all","All Notifications"],["published","Schedule Published"],["changes","Schedule Changes"],["messages","Messages"]].map(([k,l]) => (
          <div key={k} style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
            <span style={{fontFamily:ff, fontWeight:700, fontSize:13, color:C.text}}>{l}</span>
            <Toggle val={notifs[k]} fn={v=>setNotifs(n=>({...n,[k]:v}))}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UpcomingVacationsPage({ onBack }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchRequests().then(all => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const upcoming = all
        .filter(r => r.status === "Approved" && new Date(r.end_date) >= today)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      setRequests(upcoming);
      setLoading(false);
    });
  }, []);

  const formatDate = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });

  const getDaysCount = (start, end) => {
    const s = new Date(start + "T00:00:00");
    const e = new Date(end + "T00:00:00");
    return Math.round((e - s) / (1000*60*60*24)) + 1;
  };

  return (
    <div style={{paddingBottom:20}}>
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
        <button onClick={onBack} style={{background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.primary}}>‹</button>
        <span style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text}}>Upcoming Vacations</span>
      </div>
      {loading && <div style={{textAlign:"center", padding:"20px", color:C.sub, fontFamily:ff, fontSize:13}}>Loading...</div>}
      {!loading && requests.length === 0 && (
        <div style={card({padding:"20px", textAlign:"center"})}>
          <p style={{fontFamily:ff, fontSize:13, color:C.sub, margin:0}}>No upcoming time off</p>
        </div>
      )}
      {requests.map(r => {
        const today = new Date(); today.setHours(0,0,0,0);
        const start = new Date(r.start_date + "T00:00:00");
        const isActive = start <= today;
        const days = getDaysCount(r.start_date, r.end_date);
        return (
          <div key={r.id} style={card({padding:"13px 16px", marginBottom:10, borderLeft:`3px solid ${r.providers?.color || C.teal}`})}>
            <div style={{display:"flex", alignItems:"center", gap:12}}>
              {r.providers && <Avatar p={r.providers} size={40} ring/>}
              <div style={{flex:1}}>
                <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:3}}>
                  <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:13, color:C.text}}>{r.providers?.name}</p>
                  {isActive && <span style={{fontFamily:ff, fontWeight:700, fontSize:10, color:"#fff", background:C.teal, borderRadius:4, padding:"2px 6px"}}>Active</span>}
                </div>
                <p style={{margin:0, fontFamily:ffb, fontSize:12, color:C.sub}}>{r.type}</p>
                <p style={{margin:"3px 0 0", fontFamily:ffb, fontSize:12, color:C.sub}}>
                  {formatDate(r.start_date)} → {formatDate(r.end_date)}
                  <span style={{marginLeft:8, fontFamily:ff, fontWeight:700, fontSize:11, color:r.providers?.color || C.teal}}>{days} day{days>1?"s":""}</span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FairnessPage({ onBack }) {
  const [providers, setProviders] = useState([]);
  const [allSchedules, setAllSchedules] = useState({});
  const [loading, setLoading]     = useState(true);
  const [interval, setIntervalKey] = useState("past3");

  // Define intervals relative to today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const shiftMonths = (date, n) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + n);
    return d;
  };

  const INTERVALS = [
    { key: "past3",     label: "Past 3 mo",    start: shiftMonths(today, -3), end: today },
    { key: "past6",     label: "Past 6 mo",    start: shiftMonths(today, -6), end: today },
    { key: "past12",    label: "Past 12 mo",   start: shiftMonths(today, -12), end: today },
    { key: "future3",   label: "Next 3 mo",    start: today, end: shiftMonths(today, 3) },
    { key: "future6",   label: "Next 6 mo",    start: today, end: shiftMonths(today, 6) },
  ];

  const selectedInterval = INTERVALS.find(i => i.key === interval);

  // Collect all year/month combos we need to fetch for the selected interval
  const getMonthsInRange = (start, end) => {
    const months = [];
    const cur = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(end.getFullYear(), end.getMonth(), 1);
    while (cur <= last) {
      months.push({ year: cur.getFullYear(), month: cur.getMonth() });
      cur.setMonth(cur.getMonth() + 1);
    }
    return months;
  };

  useEffect(() => {
    fetchProviders().then(setProviders);
  }, []);

  useEffect(() => {
    if (!selectedInterval) return;
    setLoading(true);
    const months = getMonthsInRange(selectedInterval.start, selectedInterval.end);
    Promise.all(months.map(({ year, month }) =>
      fetchSchedule(year, month).then(data => ({ year, month, data }))
    )).then(results => {
      const merged = {};
      results.forEach(({ data }) => Object.assign(merged, data));
      setAllSchedules(merged);
      setLoading(false);
    });
  }, [interval]);

  // Classify a date string (YYYY-MM-DD) into day type
  const getDayType = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    const dow = d.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    if (dow === 0 || dow === 6) return "weekend";
    if (dow === 5) return "friday";
    return "weekday"; // Mon-Thu
  };

  // Filter schedule to only dates within the selected interval
  const isInRange = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d >= selectedInterval.start && d <= selectedInterval.end;
  };

  // Build counts per provider per day type
  const buildCounts = () => {
    const counts = {};
    providers.forEach(p => {
      counts[p.id] = { weekday: 0, friday: 0, weekend: 0, total: 0 };
    });
    Object.entries(allSchedules).forEach(([dateStr, prov]) => {
      if (!prov || !isInRange(dateStr)) return;
      if (!counts[prov.id]) return;
      const type = getDayType(dateStr);
      counts[prov.id][type]++;
      counts[prov.id].total++;
    });
    return counts;
  };

  const counts = buildCounts();
  const maxTotal = Math.max(...providers.map(p => counts[p.id]?.total || 0), 1);

  const DAY_TYPES = [
    { key: "weekday", label: "Mon–Thu", color: C.teal },
    { key: "friday",  label: "Friday",  color: "#8b7cf6" },
    { key: "weekend", label: "Sat–Sun", color: C.coral },
  ];

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.primary }}>‹</button>
        <span style={{ fontFamily: ff, fontWeight: 900, fontSize: 16, color: C.text }}>Call Fairness</span>
      </div>

      {/* Interval selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {INTERVALS.map(iv => (
          <button key={iv.key} onClick={() => setIntervalKey(iv.key)} style={{
            padding: "7px 12px", borderRadius: 8, border: `1.5px solid ${interval === iv.key ? C.teal : C.grey}`,
            background: interval === iv.key ? C.teal : "#FFF",
            color: interval === iv.key ? "#fff" : C.sub,
            fontFamily: ff, fontWeight: 700, fontSize: 11, cursor: "pointer",
          }}>{iv.label}</button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
        {DAY_TYPES.map(dt => (
          <div key={dt.key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: dt.color }} />
            <span style={{ fontFamily: ffb, fontSize: 11, color: C.sub }}>{dt.label}</span>
          </div>
        ))}
      </div>

      {loading
        ? <div style={{ textAlign: "center", padding: "30px", color: C.sub, fontFamily: ff, fontSize: 13 }}>Loading...</div>
        : <div style={card({ padding: "14px" })}>
            {providers.map(p => {
              const c = counts[p.id] || { weekday: 0, friday: 0, weekend: 0, total: 0 };
              const totalPct = (c.total / maxTotal) * 100;
              const wdPct    = c.total > 0 ? (c.weekday / c.total) * 100 : 0;
              const frPct    = c.total > 0 ? (c.friday  / c.total) * 100 : 0;
              const wePct    = c.total > 0 ? (c.weekend / c.total) * 100 : 0;

              return (
                <div key={p.id} style={{ marginBottom: 16 }}>
                  {/* Provider row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Avatar p={p} size={28}/>
                    <span style={{ fontFamily: ff, fontWeight: 700, fontSize: 12, color: C.text, flex: 1 }}>
                      {p.name.split(" ").slice(1).join(" ")}
                    </span>
                    <span style={{ fontFamily: ff, fontWeight: 800, fontSize: 12, color: p.color }}>
                      {c.total} total
                    </span>
                  </div>

                  {/* Stacked bar */}
                  <div style={{ height: 8, background: C.grey, borderRadius: 4, overflow: "hidden", marginBottom: 5, width: "100%" }}>
                    <div style={{ height: "100%", width: `${totalPct}%`, display: "flex", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${wdPct}%`, background: C.teal }} />
                      <div style={{ width: `${frPct}%`, background: "#8b7cf6" }} />
                      <div style={{ width: `${wePct}%`, background: C.coral }} />
                    </div>
                  </div>

                  {/* Counts row */}
                  <div style={{ display: "flex", gap: 10 }}>
                    {DAY_TYPES.map(dt => (
                      <div key={dt.key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 7, height: 7, borderRadius: 1, background: dt.color, flexShrink: 0 }} />
                        <span style={{ fontFamily: ffb, fontSize: 11, color: C.sub }}>
                          {dt.label}: <strong style={{ color: C.text }}>{c[dt.key]}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}
