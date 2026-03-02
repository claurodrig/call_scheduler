import { useState, useEffect } from "react";
import {
  C, MONTHS, WD_SHORT, WD_FULL,
  ff, ffb, dkey, getDays, getFirst,
  card, btnS, oBtnS, inpS, lblS, badge
} from "./data";
import { fetchSchedule, fetchProviders, fetchRequests, submitRequest, updateRequestStatus, fetchMessages, sendMessage } from "./api";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
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

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ p, size=40, ring=false }) {
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

// ─── Toggle ───────────────────────────────────────────────────────────────────
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

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header({ onNotif, onSettings, logoSrc }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"8px 16px", background:"#FFF", borderBottom:`1px solid ${C.grey}`
    }}>
      <div style={{width:50}}/>
      <img src={logoSrc} alt="Beaches OBGYN" style={{height:38, objectFit:"contain"}}/>
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

// ─── Next 5 Days Strip ────────────────────────────────────────────────────────
export function NextStrip({ schedule={} }) {
  const base = new Date(2026,9,15);
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

// ─── Home Page ────────────────────────────────────────────────────────────────
export function HomePage() {
  const [yr,setYr]             = useState(2026);
  const [mo,setMo]             = useState(9);
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

  const isToday = d => yr===2026 && mo===9 && d===15;
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
                    {p
                      ? <div style={{width:6, height:6, borderRadius:"50%", background:p.color, marginTop:2}}/>
                      : <div style={{width:6, height:6, marginTop:2}}/>
                    }
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
              ? <>
                  <Avatar p={selProv} size={40} ring/>
                  <div style={{flex:1}}>
                    <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:13, color:C.text}}>{selProv.name}, {selProv.credentials}</p>
                    <p style={{margin:"2px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>On call 7AM → 7AM next day</p>
                  </div>
                </>
              : <p style={{fontFamily:ffb, fontSize:13, color:C.sub, margin:0}}>No call assigned</p>
            }
          </div>
        )}
      </div>

      <NextStrip schedule={schedule}/>
      <button style={btnS({marginTop:14})}>Sync to Calendar</button>
    </div>
  );
}

// ─── Providers Page ───────────────────────────────────────────────────────────
export function ProvidersPage({ onMessage }) {
  const [providers, setProviders] = useState([]);
  const [open, setOpen]           = useState(null);

  useEffect(() => {
    fetchProviders().then(setProviders);
  }, []);

  return (
    <div style={{paddingBottom:20}}>
      <p style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text, marginBottom:12}}>Provider Directory</p>
      {providers.map(p => (
        <div key={p.id} onClick={()=>setOpen(open===p.id?null:p.id)}
          style={card({padding:"13px 16px", marginBottom:10, cursor:"pointer", borderLeft:`3px solid ${open===p.id?p.color:"transparent"}`})}>
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <Avatar p={p} size={46} ring={open===p.id}/>
            <div style={{flex:1}}>
              <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>{p.name}</p>
              <p style={{margin:"3px 0 0", fontFamily:ffb, fontSize:12, color:C.sub}}>{p.credentials}</p>
            </div>
            <span style={{color:C.greyMid, fontSize:18}}>{open===p.id?"∨":"›"}</span>
          </div>
          {open===p.id && (
            <div style={{display:"flex", gap:10, marginTop:12, paddingTop:12, borderTop:`1px solid ${C.grey}`}}>
              <button style={btnS({flex:1, padding:"9px", fontSize:13})}
                onClick={ev=>{ev.stopPropagation(); onMessage(p);}}>Message</button>
              <button style={oBtnS({flex:1, padding:"9px", fontSize:13})}
                onClick={ev=>ev.stopPropagation()}>Switch Call</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Request Page ─────────────────────────────────────────────────────────────
export function RequestPage({ currentProvider }) {
  const [tab,setTab]     = useState("new");
  const [type,setType]   = useState("Days Off");
  const [done,setDone]   = useState(false);
  const [loading,setLoading] = useState(false);
  const [myReqs,setMyReqs]   = useState([]);
  const [start,setStart] = useState("");
  const [end,setEnd]     = useState("");

  useEffect(() => {
    if (currentProvider) {
      fetchRequests(currentProvider.id).then(setMyReqs);
    }
  }, [currentProvider]);

  const opts = [
    ["Days Off",     "Completely unavailable"],
    ["Off Call Only","Available for clinic, no call"],
    ["Call Switch",  "Swap with another provider"],
  ];

  const handleSubmit = async () => {
    if (!start || !end || !currentProvider) return;
    setLoading(true);
    const { error } = await submitRequest({
      providerId: currentProvider.id,
      type,
      startDate: start,
      endDate: end,
      notes: "",
    });
    if (!error) {
      setDone(true);
      const updated = await fetchRequests(currentProvider.id);
      setMyReqs(updated);
      setTimeout(() => setDone(false), 2500);
    }
    setLoading(false);
  };

  return (
    <div style={{paddingBottom:20}}>
      <div style={{display:"flex", background:"#FFF", borderRadius:8, padding:3, marginBottom:16, border:`1px solid ${C.grey}`}}>
        {[["new","New Request"],["mine",`My Requests (${myReqs.length})`]].map(([k,l]) => (
          <button key={k} onClick={()=>setTab(k)} style={{
            flex:1, padding:"9px", borderRadius:6, border:"none",
            fontFamily:ff, fontWeight:800, fontSize:12, cursor:"pointer",
            background:tab===k?C.teal:"transparent", color:tab===k?"#fff":C.sub
          }}>{l}</button>
        ))}
      </div>

      {tab==="new" && <>
        <div style={card({padding:"14px", marginBottom:12, display:"flex", gap:10, alignItems:"center"})}>
          <div style={{flex:1}}>
            <span style={lblS}>Start</span>
            <input type="date" value={start} onChange={e=>setStart(e.target.value)} style={inpS}/>
          </div>
          <span style={{fontSize:18, color:C.teal, marginTop:16}}>→</span>
          <div style={{flex:1}}>
            <span style={lblS}>End</span>
            <input type="date" value={end} onChange={e=>setEnd(e.target.value)} style={inpS}/>
          </div>
        </div>

        {opts.map(([title,sub]) => (
          <div key={title} onClick={()=>setType(title)} style={card({
            padding:"13px 16px", marginBottom:10, cursor:"pointer",
            border:`1.5px solid ${type===title?C.teal:C.grey}`,
            background:type===title?`${C.wave}55`:"#FFF",
            display:"flex", alignItems:"center", gap:14
          })}>
            <div style={{
              width:20, height:20, borderRadius:"50%", flexShrink:0,
              border:`2px solid ${type===title?C.teal:C.greyMid}`,
              background:type===title?C.teal:"transparent",
              display:"flex", alignItems:"center", justifyContent:"center"
            }}>
              {type===title && <div style={{width:7, height:7, borderRadius:"50%", background:"#fff"}}/>}
            </div>
            <div>
              <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>{title}</p>
              <p style={{margin:"2px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>{sub}</p>
            </div>
          </div>
        ))}

        {done
          ? <div style={{padding:13, borderRadius:8, textAlign:"center", background:C.wave, border:`1.5px solid ${C.teal}`}}>
              <span style={{fontFamily:ff, fontWeight:900, fontSize:14, color:C.teal}}>Request Submitted!</span>
            </div>
          : <button style={btnS({opacity:loading?0.7:1})} onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>
        }
      </>}

      {tab==="mine" && myReqs.map(r => (
        <div key={r.id} style={card({padding:"13px 16px", marginBottom:10, display:"flex", alignItems:"center", justifyContent:"space-between"})}>
          <div>
            <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>{r.type}</p>
            <p style={{margin:"3px 0 0", fontFamily:ffb, fontSize:12, color:C.sub}}>{r.start_date} → {r.end_date}</p>
          </div>
          <span style={badge(r.status)}>{r.status}</span>
        </div>
      ))}
    </div>
  );
}

// ─── More Page ────────────────────────────────────────────────────────────────
export function MorePage({ onNav }) {
  const items = [
    ["🔐","Admin Panel","admin"],
    ["📋","Call Logic","logic"],
    ["⚖️","Call Fairness","fairness"],
    ["⚙️","Settings","settings"],
  ];
  return (
    <div style={{paddingBottom:20}}>
      <p style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text, marginBottom:12}}>More</p>
      {items.map(([icon,label,key]) => (
        <div key={key} onClick={()=>onNav(key)}
          style={card({padding:"13px 16px", marginBottom:10, display:"flex", alignItems:"center", gap:14, cursor:"pointer"})}>
          <div style={{width:36, height:36, borderRadius:8, background:C.wave, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0}}>{icon}</div>
          <span style={{fontFamily:ff, fontWeight:700, fontSize:14, color:C.text, flex:1}}>{label}</span>
          <span style={{color:C.greyMid, fontSize:18}}>›</span>
        </div>
      ))}
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
export function AdminPage({ onBack }) {
  const [tab,setTab]   = useState("requests");
  const [reqs,setReqs] = useState([]);

  useEffect(() => {
    fetchRequests().then(setReqs);
  }, []);

  const handleStatus = async (id, status) => {
    await updateRequestStatus(id, status);
    fetchRequests().then(setReqs);
  };

  return (
    <div style={{paddingBottom:20}}>
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
        <button onClick={onBack} style={{background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.primary}}>‹</button>
        <span style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text}}>Admin Panel</span>
      </div>

      <div style={{display:"flex", background:"#FFF", borderRadius:8, padding:3, marginBottom:16, border:`1px solid ${C.grey}`}}>
        {[["requests","Requests"],["schedule","Schedule"]].map(([k,l]) => (
          <button key={k} onClick={()=>setTab(k)} style={{
            flex:1, padding:"9px", borderRadius:6, border:"none",
            fontFamily:ff, fontWeight:800, fontSize:12, cursor:"pointer",
            background:tab===k?C.teal:"transparent", color:tab===k?"#fff":C.sub
          }}>{l}</button>
        ))}
      </div>

      {tab==="requests" && <>
        {reqs.length === 0 && (
          <div style={card({padding:"20px", textAlign:"center"})}>
            <p style={{fontFamily:ff, fontSize:13, color:C.sub}}>No requests yet</p>
          </div>
        )}
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
            {r.status==="Pending" && (
              <div style={{display:"flex", gap:8}}>
                <button style={btnS({flex:1, padding:"9px", fontSize:12, background:"#65b896"})}
                  onClick={()=>handleStatus(r.id,"Approved")}>Approve</button>
                <button style={btnS({flex:1, padding:"9px", fontSize:12, background:C.coral})}
                  onClick={()=>handleStatus(r.id,"Denied")}>Deny</button>
              </div>
            )}
          </div>
        ))}
        <div style={card({padding:"14px"})}>
          <p style={{margin:"0 0 6px", fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>AI Schedule Generator</p>
          <p style={{margin:"0 0 12px", fontFamily:ffb, fontSize:12, color:C.sub}}>Generate an equitable call schedule for next month.</p>
          <button style={btnS()}>Generate with AI</button>
        </div>
      </>}

      {tab==="schedule" && (
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

// ─── Messages Page ────────────────────────────────────────────────────────────
export function MessagesPage({ recipient, onBack, currentProvider }) {
  const [txt,setTxt]   = useState("");
  const [msgs,setMsgs] = useState([]);

  useEffect(() => {
    if (currentProvider && recipient) {
      fetchMessages(currentProvider.id, recipient.id).then(setMsgs);
    }
  }, [currentProvider, recipient]);

  const send = async () => {
    if (!txt.trim() || !currentProvider || !recipient) return;
    const { data } = await sendMessage({
      senderId: currentProvider.id,
      recipientId: recipient.id,
      text: txt,
    });
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
              {!isMe && recipient && (
                <div style={{marginRight:8, alignSelf:"flex-end"}}><Avatar p={recipient} size={26}/></div>
              )}
              <div style={{
                maxWidth:"72%", padding:"9px 13px",
                borderRadius:isMe?"12px 12px 3px 12px":"12px 12px 12px 3px",
                background:isMe?C.teal:"#FFF",
                color:isMe?"#fff":C.text,
                fontFamily:ffb, fontSize:13, boxShadow:"0 1px 5px rgba(0,0,0,0.07)"
              }}>
                <p style={{margin:"0 0 3px"}}>{m.text}</p>
                <span style={{fontSize:10, opacity:.6}}>{new Date(m.created_at).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{display:"flex", gap:8, flexShrink:0}}>
        <input value={txt} onChange={e=>setTxt(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Type a message..."
          style={{...inpS, flex:1}}/>
        <button onClick={send} style={btnS({width:"auto", padding:"10px 16px", fontSize:13})}>Send</button>
      </div>
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────
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

// ─── Fairness Page ────────────────────────────────────────────────────────────
export function FairnessPage({ onBack }) {
  const [providers,setProviders] = useState([]);
  const [schedule,setSchedule]   = useState({});

  useEffect(() => {
    fetchProviders().then(setProviders);
    fetchSchedule(2026, 9).then(setSchedule);
  }, []);

  const scheduleValues = Object.values(schedule);
  const data = providers.map(p => ({
    p,
    calls: scheduleValues.filter(s => s?.id === p.id).length,
  }));
  const maxCalls = Math.max(...data.map(d=>d.calls), 1);

  return (
    <div style={{paddingBottom:20}}>
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
        <button onClick={onBack} style={{background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.primary}}>‹</button>
        <span style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text}}>Call Fairness</span>
      </div>

      <div style={card({padding:"14px", marginBottom:12})}>
        <p style={{margin:"0 0 12px", fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>October 2026 — Call Distribution</p>
        {data.map(row => (
          <div key={row.p.id} style={{marginBottom:12}}>
            <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:4}}>
              <Avatar p={row.p} size={26}/>
              <span style={{fontFamily:ff, fontWeight:700, fontSize:12, color:C.text, flex:1}}>
                {row.p.name.split(" ").slice(1).join(" ")}
              </span>
              <span style={{fontFamily:ff, fontWeight:800, fontSize:12, color:row.p.color}}>{row.calls} calls</span>
            </div>
            <div style={{height:6, background:C.grey, borderRadius:3, overflow:"hidden"}}>
              <div style={{height:"100%", width:`${(row.calls/maxCalls)*100}%`, background:row.p.color, borderRadius:3}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
