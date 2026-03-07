import { useState, useEffect, useRef } from "react";
import {
  C, MONTHS, WD_SHORT, WD_FULL,
  ff, ffb, dkey, getDays, getFirst,
  card, btnS, oBtnS, inpS, lblS, badge
} from "./data";
import { fetchSchedule, fetchProviders, fetchRequests, submitRequest, updateRequestStatus, fetchMessages, sendMessage, generateSchedule, saveGeneratedSchedule, cancelRequest, fetchNoCallDayRequests, submitNoCallDayRequest, updateNoCallDayStatus, fetchIncomingSwitchRequests, updateScheduleDate, uploadAvatar, fetchCurrentProvider, executeCallSwitch, sendPushNotification, fetchNotifications, markNotificationsRead, updateProviderPrefs } from "./api";
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
      <path d="M12 2C8.13 2 5 5.13 5 9v5l-1.5 1.5A1 1 0 0 0 4 17h16a1 1 0 0 0 .71-1.71L19 14V9c0-3.87-3.13-7-7-7z" fill={color}/>
      <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z" fill={color}/>
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
    // Strip any existing timestamp and add a fresh one based on the URL itself
    // so the same URL always shows the latest image without browser caching issues
    const baseUrl = p.avatar_url.split("?")[0];
    const src = `${baseUrl}?t=${encodeURIComponent(baseUrl.slice(-8))}`;
    return (
      <div style={{
        width:size, height:size, borderRadius:"50%", flexShrink:0,
        outline:ring?`3px solid ${p.color}55`:"none", outlineOffset:2,
        overflow:"hidden"
      }}>
        <img src={src} alt={p.name} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
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

export function Header({ onNotif, onSettings, logoSrc, unreadCount=0 }) {
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
          {unreadCount > 0 && (
            <div style={{
              position:"absolute", top:-3, right:-3, width:16, height:16,
              background:C.coral, borderRadius:"50%", display:"flex",
              alignItems:"center", justifyContent:"center", border:"2px solid #fff"
            }}>
              <span style={{fontSize:8, color:"#fff", fontWeight:900}}>{unreadCount > 9 ? "9+" : unreadCount}</span>
            </div>
          )}
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

export function ProvidersPage({ onMessage, currentProvider }) {
  const [providers, setProviders]   = useState([]);
  const [open, setOpen]             = useState(null);
  const [schedules, setSchedules]   = useState({});
  const [messages, setMessages]     = useState({});
  const [loadingId, setLoadingId]   = useState(null);

  useEffect(() => { fetchProviders().then(setProviders); }, []);

  const handleOpen = async (p) => {
    const newOpen = open === p.id ? null : p.id;
    setOpen(newOpen);
    if (!newOpen) return;
    setLoadingId(p.id);

    // Fetch this month + next month schedule and recent messages in parallel
    const now = new Date();
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const [thisMonth, nextMonth, msgs] = await Promise.all([
      fetchSchedule(now.getFullYear(), now.getMonth()),
      fetchSchedule(nextMonthDate.getFullYear(), nextMonthDate.getMonth()),
      fetchMessages(p.id, currentProvider?.id),
    ]);

    // Find upcoming call dates for this provider
    const combined = { ...thisMonth, ...nextMonth };
    const upcoming = Object.entries(combined)
      .filter(([date, prov]) => prov?.id === p.id && date >= now.toISOString().split("T")[0])
      .map(([date]) => date)
      .sort()
      .slice(0, 5);

    setSchedules(prev => ({ ...prev, [p.id]: upcoming }));
    setMessages(prev => ({ ...prev, [p.id]: (msgs || []).slice(0, 3) }));
    setLoadingId(null);
  };

  const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div style={{paddingBottom:20}}>
      <p style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text, marginBottom:12}}>Provider Directory</p>
      {providers.map(p => (
        <div key={p.id} onClick={()=>handleOpen(p)}
          style={card({padding:"13px 16px", marginBottom:10, cursor:"pointer", borderLeft:`3px solid ${open===p.id?p.color:"transparent"}`})}>
          <div style={{display:"flex", alignItems:"center", gap:14}}>
            <Avatar p={p} size={46} ring/>
            <div style={{flex:1}}>
              <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>{p.name}</p>
              <p style={{margin:"3px 0 0", fontFamily:ffb, fontSize:12, color:C.sub}}>{p.credentials}</p>
              {p.no_call_day && (
                <p style={{margin:"3px 0 0", fontFamily:ffb, fontSize:11, color:C.teal}}>
                  No-call: {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][p.no_call_day] || p.no_call_day}s
                </p>
              )}
            </div>
            <span style={{color:C.greyMid, fontSize:18}}>{open===p.id?"∨":"›"}</span>
          </div>

          {open===p.id && (
            <div onClick={ev=>ev.stopPropagation()} style={{marginTop:12, paddingTop:12, borderTop:`1px solid ${C.grey}`}}>
              {loadingId===p.id
                ? <p style={{fontFamily:ffb, fontSize:12, color:C.sub, textAlign:"center", padding:"8px 0"}}>Loading…</p>
                : <>
                  {/* Upcoming call dates */}
                  <p style={{margin:"0 0 6px", fontFamily:ff, fontWeight:800, fontSize:12, color:C.text}}>Upcoming Calls</p>
                  {schedules[p.id]?.length > 0
                    ? <div style={{display:"flex", flexWrap:"wrap", gap:6, marginBottom:12}}>
                        {schedules[p.id].map(date => {
                          const d = new Date(date + "T00:00:00");
                          const isWeekend = d.getDay()===0||d.getDay()===6;
                          return (
                            <div key={date} style={{
                              padding:"4px 10px", borderRadius:20,
                              background: isWeekend ? "#fff0f0" : C.wave,
                              border: `1px solid ${isWeekend ? "#f5c0c0" : C.teal+"44"}`,
                              display:"flex", alignItems:"center", gap:5,
                            }}>
                              <span style={{fontFamily:ff, fontWeight:800, fontSize:11, color: isWeekend?"#c0392b":C.teal}}>
                                {DAYS_SHORT[d.getDay()]}
                              </span>
                              <span style={{fontFamily:ffb, fontSize:11, color:C.text}}>
                                {d.toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    : <p style={{fontFamily:ffb, fontSize:12, color:C.sub, marginBottom:12}}>No upcoming calls scheduled</p>
                  }

                  {/* No-call day */}
                  {p.no_call_day && (
                    <>
                      <p style={{margin:"0 0 6px", fontFamily:ff, fontWeight:800, fontSize:12, color:C.text}}>No-Call Day Preference</p>
                      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:12, padding:"7px 10px", borderRadius:8, background:C.wave, border:`1px solid ${C.teal}44`}}>
                        <span style={{fontSize:14}}>🚫</span>
                        <span style={{fontFamily:ffb, fontSize:12, color:C.text}}>
                          {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][p.no_call_day] || p.no_call_day}s — approved recurring no-call day
                        </span>
                      </div>
                    </>
                  )}

                  {/* Recent messages */}
                  <p style={{margin:"0 0 6px", fontFamily:ff, fontWeight:800, fontSize:12, color:C.text}}>Recent Messages</p>
                  {messages[p.id]?.length > 0
                    ? <div style={{marginBottom:12}}>
                        {messages[p.id].map((m,i) => (
                          <div key={i} style={{padding:"6px 10px", borderRadius:8, marginBottom:4, background: m.sender_id===currentProvider?.id?"#f0faf8":"#f7f7f7"}}>
                            <p style={{margin:0, fontFamily:ffb, fontSize:11, color:C.sub}}>
                              {m.sender_id===currentProvider?.id ? "You" : p.name.replace("Dr. ","")} · {new Date(m.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                            </p>
                            <p style={{margin:"2px 0 0", fontFamily:ff, fontSize:12, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{m.text || m.content}</p>
                          </div>
                        ))}
                      </div>
                    : <p style={{fontFamily:ffb, fontSize:12, color:C.sub, marginBottom:12}}>No messages yet</p>
                  }

                  {/* Message button */}
                  <button style={btnS({width:"100%", padding:"9px", fontSize:13})}
                    onClick={()=>onMessage(p)}>
                    Message {p.name.replace("Dr. ","")}
                  </button>
                </>
              }
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
  const [allProviders, setAllProviders] = useState([]);

  const [noCallReqs, setNoCallReqs]       = useState([]);
  const [noCallDay, setNoCallDay]         = useState("");
  const [noCallNotes, setNoCallNotes]     = useState("");
  const [noCallDone, setNoCallDone]       = useState(false);
  const [noCallLoading, setNoCallLoading] = useState(false);

  const [incomingSwitch, setIncomingSwitch] = useState([]);

  const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  useEffect(() => {
    if (!currentProvider) return;
    fetchRequests(currentProvider.id).then(setMyReqs);
    fetchNoCallDayRequests(currentProvider.id).then(setNoCallReqs);
    fetchIncomingSwitchRequests(currentProvider.id).then(setIncomingSwitch);
    fetchProviders().then(setAllProviders);
  }, [currentProvider]);

  const adminIds = allProviders.filter(p => p.is_admin).map(p => p.id);

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
      // Notify admins of new request
      if (adminIds.length > 0) {
        sendPushNotification({
          providerIds: adminIds,
          title: "New Time-Off Request",
          body: `${currentProvider.name} requested ${type} from ${start} to ${end}`,
          data: { action: "admin-requests" },
          notifKey: "changes",
        });
      }
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

  const [switchDate, setSwitchDate]         = useState("");
  const [switchToDate, setSwitchToDate]     = useState("");
  const [switchSchedule, setSwitchSchedule] = useState({});
  const [switchLoading, setSwitchLoading] = useState(false);

  // Load schedule for next 3 months when Call Switch is selected
  useEffect(() => {
    if (type !== "Call Switch") return;
    setSwitchLoading(true);
    const now = new Date();
    const months = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() });
    }
    Promise.all(months.map(({ year, month }) =>
      fetchSchedule(year, month).then(data => ({ year, month, data }))
    )).then(results => {
      const merged = {};
      results.forEach(({ data }) => Object.assign(merged, data));
      setSwitchSchedule(merged);
      setSwitchLoading(false);
    });
  }, [type]);

  // Find dates where currentProvider is on call (next 3 months)
  const myCallDates = Object.entries(switchSchedule)
    .filter(([, p]) => p?.id === currentProvider?.id)
    .map(([date]) => date)
    .filter(date => new Date(date + "T00:00:00") >= new Date())
    .sort();

  const switchProviderOnDate = switchDate ? switchSchedule[switchDate] : null;

  const handleSwitchSubmit = async () => {
    if (!switchDate || !switchToDate || !currentProvider) return;
    setLoading(true);
    const provOnSwitchTo = switchSchedule[switchToDate];
    const { error } = await submitRequest({
      providerId: currentProvider.id,
      type: "Call Switch",
      startDate: switchDate,
      endDate: switchToDate,
      notes: `Requesting to give away ${switchDate} and take ${switchToDate} (currently assigned to ${provOnSwitchTo?.name || "nobody"})`,
      targetProviderId: provOnSwitchTo?.id || null,
    });
    if (!error) {
      setDone(true);
      setSwitchDate("");
      setSwitchToDate("");
      fetchRequests(currentProvider.id).then(setMyReqs);
      // Notify the target provider
      if (provOnSwitchTo?.id) {
        sendPushNotification({
          providerIds: [provOnSwitchTo.id],
          title: "Call Switch Request",
          body: `${currentProvider.name} wants to swap their call on ${switchDate} with yours on ${switchToDate}`,
          data: { action: "my-requests" },
          notifKey: "changes",
        });
      }
      setTimeout(() => setDone(false), 2500);
    }
    setLoading(false);
  };

  const today = new Date().toISOString().split("T")[0];
  const activeReqs = myReqs.filter(r => !r.end_date || r.end_date >= today);

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ display: "flex", background: "#FFF", borderRadius: 8, padding: 3, marginBottom: 16, border: `1px solid ${C.grey}` }}>
        {[
          ["new",    "New Request"],
          ["mine",   `My Requests (${activeReqs.length})`],
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
        {/* Type selector */}
        {opts.map(([title, sub]) => (
          <div key={title} onClick={() => { setType(title); setSwitchDate(""); setStart(""); setEnd(""); }} style={card({
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

        {/* Days Off / Off Call Only — date range pickers */}
        {type !== "Call Switch" && (
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
        )}

        {/* Call Switch — show provider's on-call dates */}
        {type === "Call Switch" && (
          <div style={card({ padding: "14px", marginBottom: 12 })}>
            <p style={{ margin: "0 0 10px", fontFamily: ff, fontWeight: 800, fontSize: 13, color: C.text }}>
              Your On-Call Dates
            </p>
            <p style={{ margin: "0 0 12px", fontFamily: ffb, fontSize: 11, color: C.sub }}>
              Select a date you are scheduled for call to request a switch.
            </p>
            {switchLoading
              ? <p style={{ fontFamily: ffb, fontSize: 12, color: C.sub, textAlign: "center", padding: "10px 0" }}>Loading your call dates…</p>
              : myCallDates.length === 0
                ? <p style={{ fontFamily: ffb, fontSize: 12, color: C.sub, textAlign: "center", padding: "10px 0" }}>No upcoming call dates found in the next 3 months.</p>
                : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {myCallDates.map(date => {
                      const d = new Date(date + "T00:00:00");
                      const isSelected = switchDate === date;
                      const provOnDate = switchSchedule[date];
                      return (
                        <div key={date} onClick={() => setSwitchDate(isSelected ? "" : date)} style={{
                          padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                          border: `1.5px solid ${isSelected ? C.teal : C.grey}`,
                          background: isSelected ? `${C.wave}88` : "#FFF",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 13, color: isSelected ? C.teal : C.text }}>
                                {d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                              </p>
                            </div>
                            <div style={{
                              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                              border: `2px solid ${isSelected ? C.teal : C.greyMid}`,
                              background: isSelected ? C.teal : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {isSelected && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
            }

            {/* Show who is on call on the selected give-away date */}
            {switchDate && (
              <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8, background: `${C.wave}88`, border: `1px solid ${C.teal}33` }}>
                <p style={{ margin: "0 0 8px", fontFamily: ff, fontWeight: 700, fontSize: 11, color: C.sub, textTransform: "uppercase", letterSpacing: 1 }}>
                  You are giving away
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {currentProvider && <Avatar p={currentProvider} size={36} ring />}
                  <div>
                    <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 13, color: C.text }}>{currentProvider?.name}</p>
                    <p style={{ margin: "2px 0 0", fontFamily: ffb, fontSize: 11, color: C.sub }}>
                      Your call on {new Date(switchDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — pick the date to take in return */}
            {switchDate && <>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.grey}` }}>
                <p style={{ margin: "0 0 6px", fontFamily: ff, fontWeight: 800, fontSize: 13, color: C.text }}>
                  Which date do you want to take instead?
                </p>
                <p style={{ margin: "0 0 12px", fontFamily: ffb, fontSize: 11, color: C.sub }}>
                  Pick a date from the schedule to offer as your side of the swap.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {Object.entries(switchSchedule)
                    .filter(([date]) => {
                      const d = new Date(date + "T00:00:00");
                      return d >= new Date() && date !== switchDate;
                    })
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, prov]) => {
                      const d = new Date(date + "T00:00:00");
                      const isSelected = switchToDate === date;
                      return (
                        <div key={date} onClick={() => setSwitchToDate(isSelected ? "" : date)} style={{
                          padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                          border: `1.5px solid ${isSelected ? "#8b7cf6" : C.grey}`,
                          background: isSelected ? "#f5f3ff" : "#FFF",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 12, color: isSelected ? "#8b7cf6" : C.text }}>
                                {d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                              </p>
                              {prov && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                                  <Avatar p={prov} size={18} />
                                  <p style={{ margin: 0, fontFamily: ffb, fontSize: 11, color: C.sub }}>
                                    {prov.name} is on call
                                  </p>
                                </div>
                              )}
                            </div>
                            <div style={{
                              width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                              border: `2px solid ${isSelected ? "#8b7cf6" : C.greyMid}`,
                              background: isSelected ? "#8b7cf6" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {isSelected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>

              {/* Summary of the full swap */}
              {switchToDate && (() => {
                const provOnTo = switchSchedule[switchToDate];
                return (
                  <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8, background: "#f5f3ff", border: `1.5px solid #8b7cf6` }}>
                    <p style={{ margin: "0 0 10px", fontFamily: ff, fontWeight: 800, fontSize: 12, color: "#8b7cf6" }}>
                      Swap Summary
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Avatar p={currentProvider} size={28} />
                      <div>
                        <p style={{ margin: 0, fontFamily: ff, fontWeight: 700, fontSize: 11, color: C.text }}>You give away</p>
                        <p style={{ margin: 0, fontFamily: ffb, fontSize: 11, color: C.sub }}>
                          {new Date(switchDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <span style={{ fontSize: 18, color: "#8b7cf6", margin: "0 4px" }}>⇄</span>
                      {provOnTo && <Avatar p={provOnTo} size={28} />}
                      <div>
                        <p style={{ margin: 0, fontFamily: ff, fontWeight: 700, fontSize: 11, color: C.text }}>
                          {provOnTo ? `${provOnTo.name} gives away` : "You take"}
                        </p>
                        <p style={{ margin: 0, fontFamily: ffb, fontSize: 11, color: C.sub }}>
                          {new Date(switchToDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontFamily: ffb, fontSize: 11, color: "#8b7cf6" }}>
                      {provOnTo ? `${provOnTo.name} will need to approve this swap.` : "No provider is currently assigned to that date."}
                    </p>
                  </div>
                );
              })()}
            </>}
          </div>
        )}

        {done
          ? <div style={{ padding: 13, borderRadius: 8, textAlign: "center", background: C.wave, border: `1.5px solid ${C.teal}` }}>
              <span style={{ fontFamily: ff, fontWeight: 900, fontSize: 14, color: C.teal }}>Request Submitted!</span>
            </div>
          : <button
              style={btnS({ opacity: (loading || (type === "Call Switch" ? (!switchDate || !switchToDate) : (!start || !end))) ? 0.6 : 1 })}
              onClick={type === "Call Switch" ? handleSwitchSubmit : handleSubmit}
              disabled={loading || (type === "Call Switch" ? (!switchDate || !switchToDate) : (!start || !end))}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
        }
      </>}

      {tab === "mine" && <>
        {/* Incoming switch requests — needs provider's approval */}
        {incomingSwitch.length > 0 && <>
          <div style={{ padding: "8px 12px", borderRadius: 8, marginBottom: 10, background: "#fff7ed", border: "1px solid #f59e0b" }}>
            <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 12, color: "#b45309" }}>
              ⇄ Incoming Switch Requests — Your Approval Needed
            </p>
          </div>
          {incomingSwitch.map(r => (
            <div key={r.id} style={card({ padding: "13px 16px", marginBottom: 10, borderLeft: `3px solid #f59e0b` })}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                {r.providers && <Avatar p={r.providers} size={36} ring />}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 13, color: C.text }}>
                    {r.providers?.name}
                  </p>
                  <p style={{ margin: "2px 0 0", fontFamily: ffb, fontSize: 11, color: C.sub }}>
                    Wants to swap calls
                  </p>
                </div>
              </div>
              <div style={{ background: C.wave, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontFamily: ffb, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>They give up</p>
                    <p style={{ margin: "3px 0 0", fontFamily: ff, fontWeight: 800, fontSize: 13, color: C.text }}>
                      {new Date(r.start_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <span style={{ fontSize: 18, color: C.teal }}>⇄</span>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: 0, fontFamily: ffb, fontSize: 10, color: C.sub, textTransform: "uppercase" }}>You give up</p>
                    <p style={{ margin: "3px 0 0", fontFamily: ff, fontWeight: 800, fontSize: 13, color: C.text }}>
                      {new Date(r.end_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={btnS({ flex: 1, padding: "9px", fontSize: 12, background: "#65b896" })}
                  onClick={async () => {
                    const ok = await executeCallSwitch(
                      r.id,
                      r.provider_id,
                      currentProvider.id,
                      r.start_date,
                      r.end_date
                    );
                    if (ok) {
                      fetchIncomingSwitchRequests(currentProvider.id).then(setIncomingSwitch);
                      // Notify the requester their switch was accepted
                      sendPushNotification({
                        providerIds: [r.provider_id],
                        title: "Call Switch Accepted ✓",
                        body: `${currentProvider.name} accepted your switch request`,
                        data: { action: "my-requests" },
                        notifKey: "changes",
                      });
                    }
                  }}
                >
                  Accept Swap
                </button>
                <button
                  style={btnS({ flex: 1, padding: "9px", fontSize: 12, background: C.coral })}
                  onClick={async () => {
                    await updateRequestStatus(r.id, "Denied");
                    fetchIncomingSwitchRequests(currentProvider.id).then(setIncomingSwitch);
                    // Notify the requester their switch was declined
                    sendPushNotification({
                      providerIds: [r.provider_id],
                      title: "Call Switch Declined",
                      body: `${currentProvider.name} declined your switch request`,
                      data: { action: "my-requests" },
                      notifKey: "changes",
                    });
                  }}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: C.grey, marginBottom: 14 }} />
        </>}

        {/* My outgoing requests */}
        {activeReqs.length === 0 && incomingSwitch.length === 0 && (
          <div style={card({ padding: "20px", textAlign: "center" })}>
            <p style={{ fontFamily: ff, fontSize: 13, color: C.sub, margin: 0 }}>No requests yet</p>
          </div>
        )}
        {activeReqs.map(r => {
          const canCancel = new Date(r.start_date) > new Date();
          const isSwitch = r.type === "Call Switch";
          return (
            <div key={r.id} style={card({ padding: "13px 16px", marginBottom: 10 })}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: canCancel ? 10 : 0 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 14, color: C.text }}>{r.type}</p>
                  {isSwitch
                    ? <p style={{ margin: "3px 0 0", fontFamily: ffb, fontSize: 12, color: C.sub }}>
                        You give up {r.start_date} · You take {r.end_date}
                      </p>
                    : <p style={{ margin: "3px 0 0", fontFamily: ffb, fontSize: 12, color: C.sub }}>{r.start_date} → {r.end_date}</p>
                  }
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
      </>}
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

export function IcoPrint({color}) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <path d="M6 9V2h12v7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
      <rect x={6} y={14} width={12} height={8} rx={1} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={18} cy={11.5} r={1} fill={color}/>
    </svg>
  );
}

export function PrintSchedulePage({ onBack }) {
  const today = new Date();
  const [selectedMonths, setSelectedMonths] = useState([
    { year: today.getFullYear(), month: today.getMonth() }
  ]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState(null);

  const monthOptions = [];
  for (let i = -6; i <= 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    monthOptions.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  const toggleMonth = (year, month) => {
    setSelectedMonths(prev => {
      const exists = prev.find(m => m.year === year && m.month === month);
      if (exists) return prev.filter(m => !(m.year === year && m.month === month));
      return [...prev, { year, month }].sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
    });
  };

  const isSelected = (year, month) => !!selectedMonths.find(m => m.year === year && m.month === month);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      setLogoDataUrl(canvas.toDataURL("image/png"));
    };
    img.src = "/logo.png";
  }, []);

  useEffect(() => { fetchProviders().then(setProviders); }, []);

  const handlePrint = async () => {
    if (selectedMonths.length === 0) return;
    setLoading(true);

    const results = await Promise.all(
      selectedMonths.map(({ year, month }) =>
        fetchSchedule(year, month).then(data => ({ year, month, data }))
      )
    );
    const merged = {};
    results.forEach(({ year, month, data }) => { merged[`${year}-${month}`] = data; });

    const toBase64 = (url) => new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width; canvas.height = img.height;
          canvas.getContext("2d").drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch { resolve(null); }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

    const avatarMap = {};
    await Promise.all(providers.filter(p => p.avatar_url).map(async p => {
      avatarMap[p.id] = await toBase64(p.avatar_url);
    }));

    setLoading(false);

    // Build per-month print data as React-renderable objects
    const months = selectedMonths.map(({ year, month }) => {
      const scheduleData = merged[`${year}-${month}`];
      const days = getDays(year, month);
      const firstDay = getFirst(year, month);
      const cells = [];
      for (let i = 0; i < firstDay; i++) cells.push(null);
      for (let d = 1; d <= days; d++) cells.push(d);
      while (cells.length % 7 !== 0) cells.push(null);
      return { year, month, scheduleData, cells, numRows: Math.ceil(cells.length / 7) };
    });

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (!isIOS) {
      // Desktop: build HTML string and open new tab
      const pagesHtml = months.map(({ year, month, scheduleData, cells, numRows }) => {
        const monthName = MONTHS[month];
        const firstDay = getFirst(year, month);
        const cellsHtml = cells.map((d) => {
          if (!d) return `<div style="background:#fafafa;border-radius:4px;"></div>`;
          const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const prov = scheduleData?.[dateKey];
          const dow = (firstDay + d - 1) % 7;
          const isWeekend = dow === 0 || dow === 6;
          const b64 = prov ? avatarMap[prov.id] : null;
          const avatarHtml = b64 ? `<img src="${b64}" style="width:20px;height:20px;border-radius:50%;object-fit:cover;margin-bottom:2px;border:2px solid ${prov.color};display:block;"/>` : prov ? `<div style="width:20px;height:20px;border-radius:50%;background:${prov.color};margin-bottom:2px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:900;color:#fff;">${prov.initials}</div>` : "";
          const nameHtml = prov ? `<div style="font-size:7.5px;font-weight:700;color:#333;line-height:1.2;">${prov.name.replace("Dr. ","")}</div>` : "";
          return `<div style="border:1px solid ${prov?prov.color+"55":"#e8e8e8"};border-top:3px solid ${prov?prov.color:"#e8e8e8"};border-radius:4px;padding:3px 4px;background:${isWeekend?"#fdf8f8":"#fff"};display:flex;flex-direction:column;overflow:hidden;"><div style="font-size:10px;font-weight:800;color:${isWeekend?"#e05c5c":"#1a3a35"};margin-bottom:2px;">${d}</div>${avatarHtml}${nameHtml}</div>`;
        }).join("");
        const legendHtml = providers.map(p => { const b64 = avatarMap[p.id]; const dot = b64 ? `<img src="${b64}" style="width:10px;height:10px;border-radius:50%;object-fit:cover;"/>` : `<div style="width:8px;height:8px;border-radius:50%;background:${p.color};"></div>`; return `<div style="display:flex;align-items:center;gap:4px;">${dot}<span style="font-size:7px;color:#555;font-weight:600;">${p.name}</span></div>`; }).join("");
        const logoHtml = logoDataUrl ? `<img src="${logoDataUrl}" style="height:32px;object-fit:contain;"/>` : `<span style="font-weight:900;font-size:15px;color:#1a8c78;">Beaches OBGYN</span>`;
        return `<div style="width:100%;height:99vh;box-sizing:border-box;background:#fff;page-break-after:always;page-break-inside:avoid;display:flex;flex-direction:column;padding:12px 14px;overflow:hidden;"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;border-bottom:2px solid #1a8c78;padding-bottom:6px;flex-shrink:0;">${logoHtml}<div style="text-align:right;"><div style="font-size:17px;font-weight:900;color:#1a3a35;">${monthName} ${year}</div><div style="font-size:8px;color:#888;">Call Schedule</div></div></div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:2px;flex-shrink:0;">${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i)=>`<div style="text-align:center;padding:2px 0;font-size:8px;font-weight:900;color:${i===0||i===6?"#e05c5c":"#1a8c78"};background:#f0faf8;border-radius:3px;">${d}</div>`).join("")}</div><div style="display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(${numRows},1fr);gap:2px;flex:1;overflow:hidden;">${cellsHtml}</div><div style="margin-top:4px;padding-top:4px;border-top:1px solid #e8e8e8;display:flex;flex-wrap:wrap;gap:2px 10px;flex-shrink:0;">${legendHtml}</div></div>`;
      }).join("");
      const w = window.open("", "_blank");
      if (w) { w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}body{background:#fff;}@page{margin:0.2in;}</style></head><body>${pagesHtml}</body></html>`); w.document.close(); setTimeout(() => w.print(), 800); }
      return;
    }

    // iOS: fire a window event so App can render PrintCalendarView at the top level
    // (replacing the entire app DOM, not just overlaying it)
    const payload = {
      months: months.map(m => ({ ...m, scheduleData: m.scheduleData })),
      providers: providers.map(p => ({ id: p.id, name: p.name, color: p.color, initials: p.initials, avatar_url: p.avatar_url })),
      logoDataUrl,
    };
    window.dispatchEvent(new CustomEvent("beaches-print", { detail: payload }));
  };

  return (
    <div style={{paddingBottom:20}}>
      {/* Normal app UI */}
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
        <button onClick={onBack} style={{background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.primary}}>‹</button>
        <span style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text}}>Print Schedule</span>
      </div>

      <div style={card({padding:"12px 14px", marginBottom:14, background:`${C.wave}88`, border:`1px solid ${C.teal}33`})}>
        <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:13, color:C.teal}}>Select Months to Print</p>
        <p style={{margin:"4px 0 0", fontFamily:ffb, fontSize:12, color:C.sub}}>Each month prints as a full 8.5×11 page. Select one or more.</p>
      </div>

      <div style={{display:"flex", flexDirection:"column", gap:8, marginBottom:16}}>
        {monthOptions.map(({ year, month }) => {
          const sel = isSelected(year, month);
          const isCurrent = year === today.getFullYear() && month === today.getMonth();
          return (
            <div key={`${year}-${month}`} onClick={() => toggleMonth(year, month)} style={{
              ...card({padding:"12px 16px"}),
              border:`1.5px solid ${sel ? C.teal : C.grey}`,
              background: sel ? `${C.wave}88` : "#FFF",
              display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer",
            }}>
              <div style={{display:"flex", alignItems:"center", gap:10}}>
                <span style={{fontFamily:ff, fontWeight:800, fontSize:14, color:sel ? C.teal : C.text}}>{MONTHS[month]} {year}</span>
                {isCurrent && <span style={{fontFamily:ff, fontWeight:700, fontSize:10, color:"#fff", background:C.teal, borderRadius:4, padding:"2px 6px"}}>Current</span>}
              </div>
              <div style={{width:22, height:22, borderRadius:5, flexShrink:0, border:`2px solid ${sel ? C.teal : C.greyMid}`, background:sel ? C.teal : "transparent", display:"flex", alignItems:"center", justifyContent:"center"}}>
                {sel && <span style={{color:"#fff", fontSize:13, fontWeight:900}}>✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      {selectedMonths.length > 0 && (
        <div style={card({padding:"10px 14px", marginBottom:14, background:`${C.wave}44`})}>
          <p style={{margin:0, fontFamily:ffb, fontSize:12, color:C.teal}}>
            {selectedMonths.length} month{selectedMonths.length > 1 ? "s" : ""} selected →{" "}
            {selectedMonths.map(({year, month}) => `${MONTHS[month]} ${year}`).join(", ")}
          </p>
        </div>
      )}

      <button
        style={btnS({opacity:(loading || selectedMonths.length === 0) ? 0.5 : 1})}
        disabled={loading || selectedMonths.length === 0}
        onClick={handlePrint}
      >
        {loading ? "Loading schedule…" : `Print ${selectedMonths.length} Month${selectedMonths.length !== 1 ? "s" : ""}`}
      </button>
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
    [IcoPrint,"Print Schedule","print"],
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
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Find the first scheduled day
  let firstScheduledDay = null;
  for (let d = 1; d <= total; d++) {
    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    if (scheduleData[key]) { firstScheduledDay = d; break; }
  }
  if (!firstScheduledDay) return false;

  // For current month: only check from first scheduled day up to today
  // For all other months: check every day from first scheduled day to end of month
  const checkFrom = firstScheduledDay;
  const checkUntil = isCurrentMonth ? today.getDate() : total;

  for (let d = checkFrom; d <= checkUntil; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow === 0) continue; // Sundays mirror Saturday
    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
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

  const refreshCompleteness = async () => {
    const today = new Date();
    const toScan = monthsBetween(today.getFullYear() - 1, 0, today.getFullYear() + 2, 11 + 1);
    const results = await Promise.all(
      toScan.map(({ year, month }) =>
        fetchSchedule(year, month).then(data => ({ year, month, data }))
      )
    );
    let origin = null;
    for (const { year, month, data } of results) {
      if (Object.keys(data).length > 0) {
        if (!origin || year < origin.year || (year === origin.year && month < origin.month)) {
          origin = { year, month };
        }
      }
    }
    setOriginYM(origin);
    const completeness = {};
    for (const { year, month, data } of results) {
      completeness[`${year}-${month}`] = isMonthComplete(data, year, month);
    }
    setCompleteMonths(completeness);
  };

  // For a given target year/month, check if all months from origin up to (not including) target are complete
  const getBlockingMonths = (targetYear, targetMonth) => {
    if (!originYM) return [];
    const today = new Date();
    const prior = monthsBetween(originYM.year, originYM.month, targetYear, targetMonth);
    return prior.filter(({ year, month }) => {
      // Current month: if it has any data at all, don't block future generation
      if (year === today.getFullYear() && month === today.getMonth()) return false;
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

  // For bulk mode, find which months can actually be generated (up to first blocked)
  const bulkBlockingMap = bulk
    ? bulkMonths.map(({ year: y, month: m }) => ({ year: y, month: m, blocking: getBlockingMonths(y, m) }))
    : [];
  // Find how many months from the start are generatable (stop before first blocked)
  const generatableMonths = [];
  for (const b of bulkBlockingMap) {
    if (b.blocking.length > 0) break;
    generatableMonths.push({ year: b.year, month: b.month });
  }
  const bulkBlocked = generatableMonths.length === 0;

  const handleGenerate = async () => {
    if (bulk ? bulkBlocked : isBlocked) return;
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const [providers, requests] = await Promise.all([fetchProviders(), fetchRequests()]);
      const monthsToGenerate = bulk ? generatableMonths : [{ year, month }];
      const summaries = [];

      // Fetch full history — all months from 12 months back up to current
      const now = new Date();
      const historyMonths = [];
      for (let i = 12; i >= 1; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        historyMonths.push({ year: d.getFullYear(), month: d.getMonth() });
      }
      const historyResults = await Promise.all(
        historyMonths.map(({ year: hy, month: hm }) => fetchSchedule(hy, hm))
      );
      // Merge all history into one big schedule map
      const fullHistory = {};
      historyResults.forEach(data => Object.assign(fullHistory, data));

      for (const { year: y, month: m } of monthsToGenerate) {
        // Also include any months already generated in this bulk run
        const previousSchedule = { ...fullHistory };
        const result = await generateSchedule({ providers, requests, year: y, month: m, previousSchedule });
        await saveGeneratedSchedule(result.schedule, providers, y, m);
        // Add this month to history for next iteration in bulk mode
        const savedData = await fetchSchedule(y, m);
        Object.assign(fullHistory, savedData);
        await refreshCompleteness();
        summaries.push(`${MONTHS[m]} ${y}: ${result.summary}`);
        setCompleteMonths(prev => ({
          ...prev,
          [`${y}-${m}`]: isMonthComplete(savedData, y, m),
        }));
      }

      setSummary(summaries.join("\n\n"));

      // Notify all providers that a new schedule was published
      const monthNames = monthsToGenerate.map(({ year: y, month: m }) => `${MONTHS[m]} ${y}`).join(", ");
      sendPushNotification({
        providerIds: providers.map(p => p.id),
        title: "Schedule Published 📅",
        body: `The call schedule for ${monthNames} is now available`,
        data: { action: "home" },
        notifKey: "published",
      });
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

            {/* Partial warning — bulk can generate some months */}
            {bulk && !bulkBlocked && generatableMonths.length < bulkMonths.length && (
              <div style={{padding:"10px 12px", borderRadius:8, marginBottom:12, background:"#f0fdf4", border:"1px solid #86efac"}}>
                <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:12, color:"#166534"}}>
                  ✓ Will generate {generatableMonths.map(m => MONTHS[m.month]).join(", ")} — remaining months unlock after
                </p>
              </div>
            )}

            {/* Blocking warning — bulk, all blocked */}
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
                : bulk && generatableMonths.length > 0
                  ? `Generate ${MONTHS[generatableMonths[0].month]}${generatableMonths.length > 1 ? "–"+MONTHS[generatableMonths[generatableMonths.length-1].month] : ""} ${year}`
                  : bulk
                    ? `Generate ${MONTHS[month]}–${MONTHS[bulkMonths[2].month]} ${year}`
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

  const [conflictModal, setConflictModal] = useState(null);
  // conflictModal: { requestId, conflicts: [{ date, currentEmail, currentProv, suggestions: [provider] }], selections: { date: email }, blocked: [date] }

  const handleStatus = async (id, status) => {
    if (status !== "Approved") {
      await updateRequestStatus(id, status);
      fetchRequests().then(setReqs);
      // Notify provider their request was denied
      const req = reqs.find(r => r.id === id);
      if (req?.provider_id) {
        sendPushNotification({
          providerIds: [req.provider_id],
          title: "Request Update",
          body: `Your ${req.type} request from ${req.start_date} to ${req.end_date} was denied`,
          data: { action: "my-requests" },
          notifKey: "changes",
        });
      }
      return;
    }

    // Check for schedule conflicts
    const req = reqs.find(r => r.id === id);
    if (!req) return;

    const allProviders = await fetchProviders();
    const start = new Date(req.start_date + "T00:00:00");
    const end   = new Date(req.end_date   + "T00:00:00");

    // Collect all dates in range
    const conflictDates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      // Fetch schedule for that month
      const monthData = await fetchSchedule(d.getFullYear(), d.getMonth());
      if (monthData[dateStr]) {
        const assignedEmail = monthData[dateStr]?.email;
        if (assignedEmail === req.providers?.email) {
          conflictDates.push({ date: dateStr, currentProv: monthData[dateStr] });
        }
      }
    }

    if (conflictDates.length === 0) {
      // No conflicts, approve directly
      await updateRequestStatus(id, "Approved");
      fetchRequests().then(setReqs);
      return;
    }

    // Build suggestions for each conflict, sorted by fairness
    const allReqs = await fetchRequests();
    const otherApproved = allReqs.filter(r => r.status === "Approved" && r.id !== id);

    const isProvBlocked = (email, dateStr) =>
      otherApproved.some(r => {
        const pEmail = r.providers?.email;
        if (pEmail !== email) return false;
        return dateStr >= r.start_date && dateStr <= r.end_date;
      });

    // Fetch full call history across ALL months including current
    const now = new Date();
    const historyFetches = [];
    for (let i = 0; i <= 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      historyFetches.push(fetchSchedule(d.getFullYear(), d.getMonth()));
    }
    // Also fetch future months that may have been generated
    for (let i = 1; i <= 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      historyFetches.push(fetchSchedule(d.getFullYear(), d.getMonth()));
    }
    const historyResults = await Promise.all(historyFetches);
    const allScheduleData = {};
    historyResults.forEach(data => Object.assign(allScheduleData, data));

    // Count calls per provider from full history
    const callCounts = {};
    const lastCallDate = {};
    for (const p of allProviders) { callCounts[p.email] = 0; lastCallDate[p.email] = null; }
    for (const [date, prov] of Object.entries(allScheduleData)) {
      const email = prov?.email;
      if (!email || callCounts[email] === undefined) continue;
      callCounts[email]++;
      if (!lastCallDate[email] || date > lastCallDate[email]) lastCallDate[email] = date;
    }

    console.log("Conflict suggestion call counts:", JSON.stringify(callCounts));

    const requesterEmail = req.providers?.email;

    // Build a map of email -> sorted list of all their call dates from full schedule
    const providerCallDates = {};
    for (const p of allProviders) providerCallDates[p.email] = [];
    for (const [date, prov] of Object.entries(allScheduleData)) {
      const email = prov?.email;
      if (email && providerCallDates[email]) providerCallDates[email].push(date);
    }
    for (const email of Object.keys(providerCallDates)) {
      providerCallDates[email].sort();
    }

    // Check if assigning a provider to a date would violate 3-day gap
    const hasGapConflict = (email, dateStr) => {
      const dates = providerCallDates[email];
      for (const d of dates) {
        const gap = Math.abs(Math.floor((new Date(dateStr + "T00:00:00") - new Date(d + "T00:00:00")) / 86400000));
        if (gap > 0 && gap <= 3) return true;
      }
      return false;
    };

    // Build conflicts one by one, updating counts as we go
    const sessionCounts = { ...callCounts };

    const conflicts = conflictDates.map(({ date, currentProv }) => {
      // Primary list: eligible with gap check
      const eligible = allProviders.filter(p => {
        if (p.email === requesterEmail) return false;
        if (isProvBlocked(p.email, date)) return false;
        if (hasGapConflict(p.email, date)) return false;
        return true;
      }).sort((a, b) => sessionCounts[a.email] - sessionCounts[b.email]);

      // Fallback: ignore gap if no one eligible
      const fallback = eligible.length > 0 ? eligible : allProviders
        .filter(p => p.email !== requesterEmail && !isProvBlocked(p.email, date))
        .sort((a, b) => sessionCounts[a.email] - sessionCounts[b.email]);

      // Show all providers sorted (eligible first, then rest) so admin can still pick anyone
      const eligibleEmails = new Set(eligible.map(p => p.email));
      const ineligible = allProviders
        .filter(p => p.email !== requesterEmail && !isProvBlocked(p.email, date) && !eligibleEmails.has(p.email))
        .sort((a, b) => sessionCounts[a.email] - sessionCounts[b.email]);
      const suggestions = [...eligible, ...ineligible];

      // Pre-increment top suggestion and add date to their call list
      if (fallback.length > 0) {
        sessionCounts[fallback[0].email]++;
        providerCallDates[fallback[0].email].push(date);
        providerCallDates[fallback[0].email].sort();
      }

      return { date, currentProv, suggestions, blocked: suggestions.length === 0 };
    });

    const hardBlocked = conflicts.filter(c => c.blocked).map(c => c.date);
    const selections = {};
    conflicts.filter(c => !c.blocked).forEach(c => {
      selections[c.date] = c.suggestions[0]?.email || null;
    });

    setConflictModal({ requestId: id, conflicts, selections, hardBlocked, req });
  };

  const [conflictSaving, setConflictSaving] = useState(false);

  const handleConflictConfirm = async () => {
    const { requestId, conflicts, selections, req } = conflictModal;
    setConflictSaving(true);

    const updates = conflicts.filter(c => !c.blocked).map(({ date }) => ({
      date,
      email: selections[date]
    }));

    for (const { date, email } of updates) {
      if (!email) continue;
      await updateScheduleDate(date, email);
      const d = new Date(date + "T00:00:00");
      if (d.getDay() === 6) {
        const sunDate = new Date(d);
        sunDate.setDate(sunDate.getDate() + 1);
        const sunStr = `${sunDate.getFullYear()}-${String(sunDate.getMonth()+1).padStart(2,"0")}-${String(sunDate.getDate()).padStart(2,"0")}`;
        await updateScheduleDate(sunStr, email);
      }
    }

    await updateRequestStatus(requestId, "Approved");

    // Notify the requesting provider their request was approved
    if (req?.provider_id) {
      sendPushNotification({
        providerIds: [req.provider_id],
        title: "Request Approved ✓",
        body: `Your ${req.type} request from ${req.start_date} to ${req.end_date} was approved`,
        data: { action: "my-requests" },
        notifKey: "changes",
      });
    }

    fetchRequests().then(setReqs);
    setConflictSaving(false);
    setConflictModal(null);
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

      {/* Conflict modal overlay */}
      {conflictModal && tab === "requests" && (() => {
        const { conflicts, selections, hardBlocked, req } = conflictModal;
        return (
          <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.4)", zIndex:1000, display:"flex", alignItems:"flex-end", justifyContent:"center"}}>
            <div style={{background:C.bg, borderRadius:"16px 16px 0 0", padding:"20px 16px 32px", width:"100%", maxWidth:430, maxHeight:"85vh", overflowY:"auto"}}>
              <p style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text, marginBottom:4}}>Schedule Conflicts</p>
              <div style={{background:"#fff8f0", border:"1.5px solid #f5a623", borderRadius:8, padding:"10px 12px", marginBottom:14}}>
                <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:12, color:"#c47d0a"}}>
                  {conflicts.length} scheduled date{conflicts.length > 1 ? "s" : ""} conflict with this time off
                </p>
                <p style={{margin:"3px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>{req.providers?.name} · {req.start_date} → {req.end_date}</p>
              </div>

              {hardBlocked.length > 0 && (
                <div style={{background:"#fff0f0", border:"1.5px solid #e05c5c", borderRadius:8, padding:"10px 12px", marginBottom:14}}>
                  <p style={{margin:0, fontFamily:ff, fontWeight:800, fontSize:12, color:"#c0392b"}}>⚠ Cannot approve</p>
                  <p style={{margin:"4px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>No available replacement for:</p>
                  {hardBlocked.map(d => <p key={d} style={{margin:"3px 0 0", fontFamily:ff, fontWeight:700, fontSize:12, color:"#c0392b"}}>{d}</p>)}
                  <p style={{margin:"6px 0 0", fontFamily:ffb, fontSize:11, color:C.sub}}>Resolve conflicting time-off first.</p>
                </div>
              )}

              {conflicts.filter(c => !c.blocked).map(({ date, currentProv, suggestions }) => (
                <div key={date} style={card({padding:"12px 14px", marginBottom:10})}>
                  <p style={{margin:"0 0 2px", fontFamily:ff, fontWeight:800, fontSize:13, color:C.text}}>{date}</p>
                  <p style={{margin:"0 0 8px", fontFamily:ffb, fontSize:11, color:C.sub}}>Replace <strong>{currentProv?.name}</strong> with:</p>
                  {suggestions.map(p => (
                    <div key={p.email} onClick={() => setConflictModal(prev => ({...prev, selections:{...prev.selections,[date]:p.email}}))} style={{
                      display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                      borderRadius:8, cursor:"pointer", marginBottom:6,
                      border:`2px solid ${selections[date]===p.email ? C.teal : C.grey}`,
                      background: selections[date]===p.email ? `${C.wave}88` : "#fff",
                    }}>
                      <Avatar p={p} size={26}/>
                      <span style={{fontFamily:ff, fontWeight:700, fontSize:13, color:C.text, flex:1}}>{p.name}</span>
                      {selections[date]===p.email && <span style={{color:C.teal, fontWeight:900}}>✓</span>}
                    </div>
                  ))}
                </div>
              ))}

              {hardBlocked.length === 0 && (
                <button style={btnS({marginBottom:8, opacity: conflictSaving ? 0.7 : 1})} onClick={handleConflictConfirm} disabled={conflictSaving}>
                  {conflictSaving ? "Saving..." : "Confirm & Approve"}
                </button>
              )}
              <button style={{...oBtnS(), width:"100%"}} onClick={()=>setConflictModal(null)}>Cancel</button>
            </div>
          </div>
        );
      })()}
      <div style={{display:"flex", background:"#FFF", borderRadius:8, padding:3, marginBottom:16, border:`1px solid ${C.grey}`}}>
        {[
          ["requests", "Requests"],
          ["nocall",   `No-Call${pendingNoCall > 0 ? ` (${pendingNoCall})` : ""}`],
          ["users",    "Users"],
        ].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            flex: 1, padding: "9px 2px", borderRadius: 6, border: "none",
            fontFamily: ff, fontWeight: 800, fontSize: 10, cursor: "pointer",
            background: tab === k ? C.teal : "transparent",
            color: tab === k ? "#fff" : C.sub,
          }}>{l}</button>
        ))}
      </div>

      {tab === "requests" && (() => {
        const today = new Date().toISOString().split("T")[0];
        const activeReqs = reqs.filter(r => !r.end_date || r.end_date >= today);
        return <>
          {activeReqs.length === 0 && <div style={card({padding:"20px", textAlign:"center"})}><p style={{fontFamily:ff, fontSize:13, color:C.sub}}>No requests yet</p></div>}
          {activeReqs.map(r => (
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
      </>; })()}

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
    if (data) {
      setMsgs(m => [...m, data]);
      // Notify the recipient
      sendPushNotification({
        providerIds: [recipient.id],
        title: `Message from ${currentProvider.name}`,
        body: txt.trim().length > 60 ? txt.trim().slice(0, 60) + "…" : txt.trim(),
        data: { action: "messages", senderId: currentProvider.id },
        notifKey: "messages",
      });
    }
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

export function NotificationsPage({ onBack, currentProvider, onNavigate }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProvider) return;
    fetchNotifications(currentProvider.id).then(data => {
      setNotifs(data);
      setLoading(false);
    });
    markNotificationsRead(currentProvider.id);
  }, [currentProvider]);

  const timeAgo = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  };

  const getAction = (title) => {
    if (title?.includes("New Time-Off Request") || title?.includes("New No-Call")) return "admin-requests";
    if (title?.includes("Switch Accepted") || title?.includes("Switch Declined") || title?.includes("Approved") || title?.includes("Denied")) return "my-requests";
    if (title?.includes("Call Switch Request")) return "my-requests";
    if (title?.includes("Schedule")) return "home";
    if (title?.includes("Message")) return "messages";
    return null;
  };

  const handleTap = (n) => {
    const action = getAction(n.title);
    if (action && onNavigate) onNavigate(action);
  };

  return (
    <div style={{paddingBottom:20}}>
      <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:16}}>
        <button onClick={onBack} style={{background:"none", border:"none", fontSize:22, cursor:"pointer", color:C.primary}}>‹</button>
        <span style={{fontFamily:ff, fontWeight:900, fontSize:16, color:C.text}}>Notifications</span>
      </div>
      {loading && <p style={{fontFamily:ff, fontSize:13, color:C.sub, textAlign:"center", padding:20}}>Loading…</p>}
      {!loading && notifs.length === 0 && (
        <div style={card({padding:"32px 20px", textAlign:"center"})}>
          <p style={{fontSize:32, margin:"0 0 8px"}}>🔔</p>
          <p style={{fontFamily:ff, fontWeight:800, fontSize:14, color:C.text, margin:"0 0 4px"}}>All caught up!</p>
          <p style={{fontFamily:ffb, fontSize:12, color:C.sub, margin:0}}>No notifications yet</p>
        </div>
      )}
      {notifs.map(n => {
        const action = getAction(n.title);
        return (
          <div key={n.id} onClick={() => handleTap(n)} style={card({
            padding:"13px 16px", marginBottom:10,
            borderLeft: n.read ? "none" : `3px solid ${C.teal}`,
            background: n.read ? "#fff" : `${C.wave}88`,
            cursor: action ? "pointer" : "default",
          })}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
              <p style={{margin:"0 0 3px", fontFamily:ff, fontWeight:800, fontSize:13, color:C.text}}>{n.title}</p>
              <div style={{display:"flex", alignItems:"center", gap:6, flexShrink:0, marginLeft:8}}>
                <span style={{fontFamily:ffb, fontSize:10, color:C.sub}}>{timeAgo(n.created_at)}</span>
                {action && <span style={{fontSize:12, color:C.teal}}>›</span>}
              </div>
            </div>
            <p style={{margin:0, fontFamily:ffb, fontSize:12, color:C.sub}}>{n.body}</p>
          </div>
        );
      })}
    </div>
  );
}

export function SettingsPage({ onBack, onLogout, currentProvider }) {
  const defaultPrefs = {all:true, published:true, changes:true, messages:true};
  const [faceId, setFaceId] = useState(true);
  const [notifs, setNotifs] = useState(defaultPrefs);
  const [showPwForm, setShowPwForm] = useState(false);

  useEffect(() => {
    if (currentProvider?.notif_prefs) {
      setNotifs({ ...defaultPrefs, ...currentProvider.notif_prefs });
    }
  }, [currentProvider]);

  const handleToggleNotif = (key, val) => {
    const updated = { ...notifs, [key]: val };
    // If "all" turned off, turn off everything
    if (key === "all" && !val) {
      const allOff = { all: false, published: false, changes: false, messages: false };
      setNotifs(allOff);
      if (currentProvider) updateProviderPrefs(currentProvider.id, allOff);
      return;
    }
    setNotifs(updated);
    if (currentProvider) updateProviderPrefs(currentProvider.id, updated);
  };
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

  const handleChangePassword = async () => {
    setPwMsg(null);
    if (!newPw || newPw.length < 6) return setPwMsg({ ok: false, text: "New password must be at least 6 characters." });
    if (newPw !== confirmPw) return setPwMsg({ ok: false, text: "Passwords do not match." });
    setPwLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      setPwMsg({ ok: true, text: "Password updated successfully!" });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => { setShowPwForm(false); setPwMsg(null); }, 2000);
    } catch (err) {
      setPwMsg({ ok: false, text: err.message || "Failed to update password." });
    }
    setPwLoading(false);
  };

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
        <button onClick={() => { setShowPwForm(v => !v); setPwMsg(null); }} style={oBtnS({width:"100%", marginBottom: showPwForm ? 12 : 8, padding:"10px"})}>
          {showPwForm ? "Cancel" : "Change Password"}
        </button>
        {showPwForm && (
          <div style={{marginBottom:8}}>
            <div style={{marginBottom:8}}>
              <span style={lblS}>New Password</span>
              <input type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="Min 6 characters" style={inpS}/>
            </div>
            <div style={{marginBottom:12}}>
              <span style={lblS}>Confirm New Password</span>
              <input type="password" value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} placeholder="Repeat new password" style={inpS}/>
            </div>
            {pwMsg && <p style={{margin:"0 0 10px", fontFamily:ffb, fontSize:12, color: pwMsg.ok ? C.teal : C.coral}}>{pwMsg.text}</p>}
            <button onClick={handleChangePassword} disabled={pwLoading} style={btnS({width:"100%", padding:"10px", marginBottom:8})}>
              {pwLoading ? "Updating…" : "Update Password"}
            </button>
          </div>
        )}
        <button onClick={onLogout} style={oBtnS({width:"100%", padding:"10px", color:C.coral, borderColor:C.coral})}>Logout</button>
      </div>
      <div style={card({padding:"16px"})}>
        <p style={{margin:"0 0 14px", fontFamily:ff, fontWeight:800, fontSize:14, color:C.text}}>Notifications</p>
        {[["all","All Notifications"],["published","Schedule Published"],["changes","Schedule Changes"],["messages","Messages"]].map(([k,l]) => (
          <div key={k} style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
            <span style={{fontFamily:ff, fontWeight:700, fontSize:13, color:C.text}}>{l}</span>
            <Toggle val={notifs[k]} fn={v => handleToggleNotif(k, v)}/>
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

const DEFAULT_RULES = [
  {
    id: "even_distribution",
    label: "Even Call Distribution",
    description: "All physicians receive equal weekday calls, equal weekend calls, and equal holiday calls per year (over 6–12 month window).",
    editable: false,
  },
  {
    id: "max_frequency",
    label: "Max Call Frequency",
    description: "No provider assigned call more than once every 3 days. Minimum 3 weeks between weekend calls for the same provider.",
    editable: false,
  },
  {
    id: "time_off",
    label: "Availability — Time Off",
    description: "No call assigned to providers on approved time-off dates.",
    editable: false,
  },
  {
    id: "no_call_day",
    label: "Recurring No-Call Day",
    description: "Providers with an approved recurring no-call day are never assigned call on that weekday.",
    editable: false,
  },
  {
    id: "weekend_split",
    label: "Weekend Call Split",
    description: "Weekend call is divided: one provider covers Friday, a different provider covers Saturday & Sunday.",
    editable: false,
  },
  {
    id: "long_weekend_split",
    label: "Holiday / Long Weekend Split",
    description: "On long weekends, call is divided: one provider covers Friday & Saturday, another covers Sunday & Monday.",
    editable: false,
  },
  {
    id: "holidays",
    label: "Holiday Recognition",
    description: "Recognized holidays: Christmas, Thanksgiving, New Year's, July 4th, Memorial Day, Labor Day. Holiday calls are tracked and balanced equally.",
    editable: false,
  },
  {
    id: "fairness_window",
    label: "Fairness Tracking Window",
    description: "Call parity is enforced over a rolling 6–12 month window. Prior months must be fully scheduled before generating future months.",
    editable: false,
  },
];

export function CallLogicPage({ onBack, currentProvider }) {
  const isAdmin = currentProvider?.is_admin;
  const STORAGE_KEY = "call_logic_rules";

  const [rules, setRules] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedRules = JSON.parse(saved);
        // Merge saved toggles with default rules (in case new rules were added)
        return DEFAULT_RULES.map(r => ({
          ...r,
          enabled: savedRules[r.id] !== undefined ? savedRules[r.id] : true,
        }));
      }
    } catch {}
    return DEFAULT_RULES.map(r => ({ ...r, enabled: true }));
  });

  const [saved, setSaved] = useState(false);

  const toggle = (id) => {
    if (!isAdmin) return;
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleSave = () => {
    const toStore = {};
    rules.forEach(r => { toStore[r.id] = r.enabled; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const enabledCount = rules.filter(r => r.enabled).length;

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.primary }}>‹</button>
        <span style={{ fontFamily: ff, fontWeight: 900, fontSize: 16, color: C.text }}>Call Logic</span>
      </div>

      {/* Info banner */}
      <div style={card({ padding: "12px 14px", marginBottom: 16, background: `${C.wave}88`, border: `1px solid ${C.teal}33` })}>
        <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 13, color: C.teal }}>
          Schedule Generation Rules
        </p>
        <p style={{ margin: "4px 0 0", fontFamily: ffb, fontSize: 12, color: C.sub }}>
          {isAdmin
            ? `These rules govern how the AI generates call schedules. ${enabledCount} of ${rules.length} rules currently active. Toggle rules on or off to customize schedule generation.`
            : `These rules govern how the AI generates call schedules. ${enabledCount} of ${rules.length} rules are currently active. Contact your administrator to modify rules.`
          }
        </p>
      </div>

      {/* Rules list */}
      {rules.map(rule => (
        <div key={rule.id} style={card({
          padding: "13px 16px", marginBottom: 10,
          borderLeft: `3px solid ${rule.enabled ? C.teal : C.greyMid}`,
          opacity: rule.enabled ? 1 : 0.6,
        })}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <p style={{ margin: 0, fontFamily: ff, fontWeight: 800, fontSize: 13, color: C.text }}>{rule.label}</p>
                <span style={{
                  fontFamily: ff, fontWeight: 700, fontSize: 9, padding: "2px 6px", borderRadius: 4,
                  background: rule.enabled ? `${C.teal}22` : `${C.greyMid}33`,
                  color: rule.enabled ? C.teal : C.greyMid,
                }}>
                  {rule.enabled ? "ACTIVE" : "OFF"}
                </span>
              </div>
              <p style={{ margin: 0, fontFamily: ffb, fontSize: 11, color: C.sub, lineHeight: 1.5 }}>
                {rule.description}
              </p>
            </div>
            {isAdmin && (
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <Toggle val={rule.enabled} fn={() => toggle(rule.id)} />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Save button — admin only */}
      {isAdmin && (
        saved
          ? <div style={{ padding: 13, borderRadius: 8, textAlign: "center", background: C.wave, border: `1.5px solid ${C.teal}`, marginTop: 4 }}>
              <span style={{ fontFamily: ff, fontWeight: 900, fontSize: 14, color: C.teal }}>Rules Saved!</span>
            </div>
          : <button style={btnS({ marginTop: 4 })} onClick={handleSave}>Save Rules</button>
      )}
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
    { key: "past3",     label: "Past 3 mo",    start: shiftMonths(today, -3),  end: today },
    { key: "past6",     label: "Past 6 mo",    start: shiftMonths(today, -6),  end: today },
    { key: "past12",    label: "Past 12 mo",   start: shiftMonths(today, -12), end: today },
    { key: "future3",   label: "Next 3 mo",    start: today, end: shiftMonths(today, 3) },
    { key: "future6",   label: "Next 6 mo",    start: today, end: shiftMonths(today, 6) },
    { key: "future9",   label: "Next 9 mo",    start: today, end: shiftMonths(today, 9) },
    { key: "future12",  label: "Next 12 mo",   start: today, end: shiftMonths(today, 12) },
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

// Renders calendar-only page from sessionStorage, auto-prints, then redirects back
export function PrintRenderer() {
  // Read structured data synchronously — before first render
  let printData = null;
  try {
    const raw = sessionStorage.getItem("printData") || localStorage.getItem("printData");
    const ssRaw = sessionStorage.getItem("printData");
    const lsRaw = localStorage.getItem("printData");
    console.log("[PrintRenderer] sessionStorage:", ssRaw ? ssRaw.length : "null");
    console.log("[PrintRenderer] localStorage:", lsRaw ? lsRaw.length : "null");
    console.log("[PrintRenderer] url:", window.location.href);
    if (raw) printData = JSON.parse(raw);
    // Do NOT remove — iOS reloads page on orientation change and needs to re-read
  } catch(e) { console.log("[PrintRenderer] error:", e); }

  console.log("[PrintRenderer] printData:", printData ? "FOUND" : "NULL - will redirect to /");

  // If no data, redirect immediately
  if (!printData) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  const { months, avatarMap, logoDataUrl, providers } = printData;

  // Render calendar as JSX — this IS the first paint, so iOS sees it immediately
  return (
    <PrintCalendarView
      months={months}
      avatarMap={avatarMap}
      logoDataUrl={logoDataUrl}
      providers={providers}
    />
  );
}

export function PrintCalendarView({ months, avatarMap, logoDataUrl, providers }) {
  return (
    <div style={{background:"#fff", fontFamily:"-apple-system,Helvetica,sans-serif"}}>
      <style>{`*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}@page{margin:0.2in;size:landscape;}body{background:#fff;}`}</style>
      {months.map(({ year, month, scheduleData, cells, numRows }) => {
        const firstDay = getFirst(year, month);
        const monthName = MONTHS[month];
        return (
          <div key={`${year}-${month}`} style={{width:"100%", minHeight:"100vh", background:"#fff", pageBreakAfter:"always", display:"flex", flexDirection:"column", padding:"12px 14px", boxSizing:"border-box"}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, borderBottom:"2px solid #1a8c78", paddingBottom:6, flexShrink:0}}>
              {logoDataUrl ? <img src={logoDataUrl} style={{height:32, objectFit:"contain"}}/> : <span style={{fontWeight:900, fontSize:15, color:"#1a8c78"}}>Beaches OBGYN</span>}
              <div style={{textAlign:"right"}}><div style={{fontSize:17, fontWeight:900, color:"#1a3a35"}}>{monthName} {year}</div><div style={{fontSize:8, color:"#888"}}>Call Schedule</div></div>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:2, flexShrink:0}}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d,i) => <div key={d} style={{textAlign:"center", padding:"2px 0", fontSize:8, fontWeight:900, color:i===0||i===6?"#e05c5c":"#1a8c78", background:"#f0faf8", borderRadius:3}}>{d}</div>)}
            </div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(7,1fr)", gridTemplateRows:`repeat(${numRows},1fr)`, gap:2, flex:1}}>
              {cells.map((d, i) => {
                if (!d) return <div key={i} style={{background:"#fafafa", borderRadius:4}}/>;
                const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                const prov = scheduleData?.[dateKey];
                const dow = (firstDay + d - 1) % 7;
                const isWeekend = dow === 0 || dow === 6;
                return (
                  <div key={i} style={{border:`1px solid ${prov?prov.color+"55":"#e8e8e8"}`, borderTop:`3px solid ${prov?prov.color:"#e8e8e8"}`, borderRadius:4, padding:"3px 4px", background:isWeekend?"#fdf8f8":"#fff", display:"flex", flexDirection:"column", overflow:"hidden"}}>
                    <div style={{fontSize:10, fontWeight:800, color:isWeekend?"#e05c5c":"#1a3a35", marginBottom:2}}>{d}</div>
                    {prov?.avatar_url ? <img src={prov.avatar_url} crossOrigin="anonymous" style={{width:20, height:20, borderRadius:"50%", objectFit:"cover", marginBottom:2, border:`2px solid ${prov.color}`, display:"block"}}/> : prov ? <div style={{width:20, height:20, borderRadius:"50%", background:prov.color, marginBottom:2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:7, fontWeight:900, color:"#fff"}}>{prov.initials}</div> : null}
                    {prov && <div style={{fontSize:"7.5px", fontWeight:700, color:"#333", lineHeight:1.2}}>{prov.name.replace("Dr. ","")}</div>}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:4, paddingTop:4, borderTop:"1px solid #e8e8e8", display:"flex", flexWrap:"wrap", gap:"2px 10px", flexShrink:0}}>
              {providers.map(p => <div key={p.id} style={{display:"flex", alignItems:"center", gap:4}}>{p.avatar_url ? <img src={p.avatar_url} crossOrigin="anonymous" style={{width:10, height:10, borderRadius:"50%", objectFit:"cover"}}/> : <div style={{width:8, height:8, borderRadius:"50%", background:p.color}}/>}<span style={{fontSize:7, color:"#555", fontWeight:600}}>{p.name}</span></div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
