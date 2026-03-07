import { useState, useEffect } from "react";
import logoSrc from "./assets/logo.png";
import { C, ff, ffb, btnS, card, inpS, lblS } from "./data";
import { supabase } from "./supabase";
import { fetchCurrentProvider, registerPushSubscription, fetchNotifications, markNotificationsRead } from "./api";
import {
  IcoHome, IcoProviders, IcoRequest, IcoMore,
  Header,
  HomePage,
  ProvidersPage,
  RequestPage,
  MorePage,
  AdminPage,
  MessagesPage,
  SettingsPage,
  NotificationsPage,
  FairnessPage,
  UpcomingVacationsPage,
  CallLogicPage,
  PrintSchedulePage,
  PrintRenderer,
  PrintCalendarView,
} from "./components";

const NAV = [
  ["home",      "Home",      IcoHome],
  ["providers", "Providers", IcoProviders],
  ["request",   "Request",   IcoRequest],
  ["more",      "More",      IcoMore],
];

function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Invalid email or password. Please try again.");
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:ff}}>
      <div style={{width:"100%", maxWidth:430, padding:"0 24px"}}>
        <div style={{display:"flex", justifyContent:"center", padding:"48px 0 24px"}}>
          <img src={logoSrc} alt="Beaches OBGYN" style={{height:64, objectFit:"contain"}}/>
        </div>
        <p style={{fontFamily:ff, fontWeight:900, fontSize:24, color:C.text, marginBottom:6, textAlign:"center"}}>Welcome back</p>
        <p style={{fontFamily:ffb, fontSize:13, color:C.sub, marginBottom:32, textAlign:"center"}}>Sign in to your Beaches OBGYN account</p>
        <div style={{marginBottom:16}}>
          <label style={lblS}>Email</label>
          <input style={inpS} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}/>
        </div>
        <div style={{marginBottom:24}}>
          <label style={lblS}>Password</label>
          <input style={inpS} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}/>
        </div>
        {error && <p style={{color:C.coral, fontSize:13, marginBottom:12, fontFamily:ffb}}>{error}</p>}
        <button style={{...btnS, width:"100%", opacity: loading ? 0.7 : 1}} onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </div>
    </div>
  );
}

function SetPasswordPage({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleSet = async () => {
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    onDone();
  };

  return (
    <div style={{minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:ff}}>
      <div style={{width:"100%", maxWidth:430, padding:"0 24px"}}>
        <div style={{display:"flex", justifyContent:"center", padding:"48px 0 24px"}}>
          <img src={logoSrc} alt="Beaches OBGYN" style={{height:64, objectFit:"contain"}}/>
        </div>
        <p style={{fontFamily:ff, fontWeight:900, fontSize:24, color:C.text, marginBottom:6, textAlign:"center"}}>Set Your Password</p>
        <p style={{fontFamily:ffb, fontSize:13, color:C.sub, marginBottom:32, textAlign:"center"}}>Choose a password to complete your account setup.</p>
        <div style={{marginBottom:16}}>
          <label style={lblS}>New Password</label>
          <input style={inpS} type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div style={{marginBottom:24}}>
          <label style={lblS}>Confirm Password</label>
          <input style={inpS} type="password" placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)}/>
        </div>
        {error && <p style={{color:C.coral, fontSize:13, marginBottom:12, fontFamily:ffb}}>{error}</p>}
        <button style={{...btnS, width:"100%", opacity: loading ? 0.7 : 1}} onClick={handleSet} disabled={loading}>
          {loading ? "Saving…" : "Set Password & Continue"}
        </button>
      </div>
    </div>
  );
}

async function registerPush(providerId) {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    const reg = await navigator.serviceWorker.register("/sw.js");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    const existing = await reg.pushManager.getSubscription();
    const sub = existing || await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    });
    await registerPushSubscription(providerId, sub);
  } catch (err) {
    console.error("registerPush:", err);
  }
}

function AppInner() {
  const [session, setSession]                 = useState(null);
  const [authLoading, setAuthLoading]         = useState(true);
  const [currentProvider, setCurrentProvider] = useState(null);
  const [tab, setTab]                         = useState("home");
  const [sub, setSub]                         = useState(null);
  const [msgRecip, setMsgRecip]               = useState(null);
  const [isInvite, setIsInvite]               = useState(false);
  const [unreadCount, setUnreadCount]         = useState(0);

  useEffect(() => {
    const bc = new BroadcastChannel("notif_nav");
    bc.onmessage = (event) => {
      const action = event.data?.action;
      if (action === "admin-requests") setSub("admin");
      else if (action === "my-requests") { setSub(null); setTab("request"); }
      else if (action === "messages") { setSub(null); setTab("request"); }
      else if (action === "home") { setSub(null); setTab("home"); }
    };
    return () => bc.close();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");
    if (!action) return;
    window.history.replaceState({}, "", "/");
    if (action === "admin-requests") setSub("admin");
    else if (action === "my-requests") { setSub(null); setTab("request"); }
    else if (action === "home") { setSub(null); setTab("home"); }
  }, []);

  useEffect(() => {
    if (!currentProvider) return;
    const refresh = () => fetchNotifications(currentProvider.id).then(notifs => {
      setUnreadCount(notifs.filter(n => !n.read).length);
    });
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [currentProvider]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=invite")) setIsInvite(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session?.user?.email) fetchCurrentProvider(session.user.email).then(setCurrentProvider);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) fetchCurrentProvider(session.user.email).then(setCurrentProvider);
      else setCurrentProvider(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSub(null); setTab("home"); setIsInvite(false);
  };

  if (authLoading) return (
    <div style={{minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <p style={{fontFamily:ff, color:C.sub, fontSize:14}}>Loading…</p>
    </div>
  );

  if (isInvite) return <SetPasswordPage onDone={() => { setIsInvite(false); registerPush(currentProvider?.id); }} />;
  if (!session) return <LoginPage/>;

  const onMessage = p => { setMsgRecip(p); setSub("messages"); };
  const handleBell = () => {
    setSub("notifications");
    setUnreadCount(0);
    if (currentProvider) markNotificationsRead(currentProvider.id);
  };

  function renderBody() {
    if (sub === "messages")      return <MessagesPage recipient={msgRecip} onBack={()=>setSub(null)} currentProvider={currentProvider}/>;
    if (sub === "admin")         return <AdminPage onBack={()=>setSub(null)} currentProvider={currentProvider}/>;
    if (sub === "fairness")      return <FairnessPage onBack={()=>setSub(null)}/>;
    if (sub === "vacations")     return <UpcomingVacationsPage onBack={()=>setSub(null)}/>;
    if (sub === "logic")         return <CallLogicPage onBack={()=>setSub(null)} currentProvider={currentProvider}/>;
    if (sub === "print")         return <PrintSchedulePage onBack={()=>setSub(null)}/>;
    if (sub === "settings")      return <SettingsPage onBack={()=>setSub(null)} onLogout={handleLogout} currentProvider={currentProvider}/>;
    if (sub === "notifications") return <NotificationsPage onBack={()=>setSub(null)} currentProvider={currentProvider}/>;
    if (tab === "home")      return <HomePage currentProvider={currentProvider}/>;
    if (tab === "providers") return <ProvidersPage onMessage={onMessage} currentProvider={currentProvider}/>;
    if (tab === "request")   return <RequestPage currentProvider={currentProvider}/>;
    if (tab === "more")      return <MorePage onNav={k=>setSub(k)} currentProvider={currentProvider}/>;
  }

  return (
    <div id="app-root" style={{minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", maxWidth:430, margin:"0 auto", fontFamily:ff}}>
      <Header logoSrc={logoSrc} onNotif={handleBell} onSettings={()=>setSub("settings")} unreadCount={unreadCount}/>
      <div style={{flex:1, padding:"16px 16px 0", overflowY:"auto"}}>
        {renderBody()}
      </div>
      {!sub && (
        <nav style={{display:"flex", borderTop:`1px solid ${C.grey}`, background:"#fff", position:"sticky", bottom:0, zIndex:10}}>
          {NAV.map(([key, label, Icon]) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => { setTab(key); setSub(null); }}
                style={{flex:1, border:"none", background:"none", padding:"10px 0 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer"}}>
                <Icon color={active ? C.teal : C.sub}/>
                <span style={{fontFamily:ffb, fontSize:10, color: active ? C.teal : C.sub, fontWeight: active ? 800 : 500}}>{label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default function App() {
  const [printPayload, setPrintPayload] = useState(null);
  const isPrintRoute = new URLSearchParams(window.location.search).get("print") === "1";

  // Listen for beaches-print event from PrintSchedulePage
  useEffect(() => {
    const handler = (e) => setPrintPayload(e.detail);
    window.addEventListener("beaches-print", handler);
    return () => window.removeEventListener("beaches-print", handler);
  }, []);

  // Trigger print after PrintCalendarView renders at top level
  useEffect(() => {
    if (!printPayload) return;
    const t = setTimeout(() => {
      window.print();
      const done = () => setPrintPayload(null);
      window.addEventListener("afterprint", done, { once: true });
      setTimeout(done, 30000); // iOS fallback — afterprint may not fire
    }, 1500);
    return () => clearTimeout(t);
  }, [printPayload]);

  // iOS: PrintCalendarView renders as the ENTIRE app — no header, no nav, nothing else in DOM
  if (printPayload) {
    return <PrintCalendarView
      months={printPayload.months}
      logoDataUrl={printPayload.logoDataUrl}
      providers={printPayload.providers}
    />;
  }

  if (isPrintRoute) return <PrintRenderer />;
  return <AppInner />;
}
