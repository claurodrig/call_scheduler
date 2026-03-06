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
        <div style={card({padding:"24px"})}>
          <div style={{marginBottom:16}}>
            <span style={lblS}>Email</span>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@beachesobgyn.com" style={inpS}/>
          </div>
          <div style={{marginBottom:20}}>
            <span style={lblS}>Password</span>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="Enter your password" style={inpS}/>
          </div>
          {error && <p style={{fontFamily:ffb, fontSize:12, color:"#e05555", marginBottom:12, textAlign:"center"}}>{error}</p>}
          <button onClick={handleLogin} disabled={loading} style={btnS({opacity:loading?0.7:1})}>{loading ? "Signing in..." : "Sign In"}</button>
        </div>
        <p style={{fontFamily:ffb, fontSize:11, color:C.sub, textAlign:"center", marginTop:20}}>Contact your administrator to reset your password.</p>
      </div>
    </div>
  );
}

function SetPasswordPage({ onDone }) {
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);

  const handleSet = async () => {
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
    setLoading(false);
    // Clear invite hash from URL and navigate to app
    window.history.replaceState(null, "", window.location.pathname);
    setTimeout(() => onDone(), 1500);
  };

  return (
    <div style={{minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:ff}}>
      <div style={{width:"100%", maxWidth:430, padding:"0 24px"}}>
        <div style={{display:"flex", justifyContent:"center", padding:"48px 0 24px"}}>
          <img src={logoSrc} alt="Beaches OBGYN" style={{height:64, objectFit:"contain"}}/>
        </div>
        <p style={{fontFamily:ff, fontWeight:900, fontSize:24, color:C.text, marginBottom:6, textAlign:"center"}}>Set Your Password</p>
        <p style={{fontFamily:ffb, fontSize:13, color:C.sub, marginBottom:32, textAlign:"center"}}>Choose a password to activate your account</p>
        <div style={card({padding:"24px"})}>
          {done ? (
            <p style={{fontFamily:ff, fontWeight:700, fontSize:14, color:C.teal, textAlign:"center"}}>
              ✓ Password set! You are now signed in.
            </p>
          ) : <>
            <div style={{marginBottom:16}}>
              <span style={lblS}>New Password</span>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" style={inpS}/>
            </div>
            <div style={{marginBottom:20}}>
              <span style={lblS}>Confirm Password</span>
              <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSet()} placeholder="Repeat password" style={inpS}/>
            </div>
            {error && <p style={{fontFamily:ffb, fontSize:12, color:"#e05555", marginBottom:12, textAlign:"center"}}>{error}</p>}
            <button onClick={handleSet} disabled={loading} style={btnS({opacity:loading?0.7:1})}>
              {loading ? "Setting password..." : "Set Password & Sign In"}
            </button>
          </>}
        </div>
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

export default function App() {
  const [session, setSession]                 = useState(null);
  const [authLoading, setAuthLoading]         = useState(true);
  const [currentProvider, setCurrentProvider] = useState(null);
  const [tab, setTab]                         = useState("home");
  const [sub, setSub]                         = useState(null);
  const [msgRecip, setMsgRecip]               = useState(null);
  const [isInvite, setIsInvite]               = useState(false);
  const [unreadCount, setUnreadCount]         = useState(0);

  // Listen for notification tap navigation from service worker
  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === "NOTIF_NAV") {
        const action = event.data.action;
        if (action === "admin-requests") { setSub("admin"); }
        else if (action === "my-requests") { setSub(null); setTab("request"); }
        else if (action === "messages") { setSub(null); setTab("request"); }
        else if (action === "home") { setSub(null); setTab("home"); }
      }
    };
    navigator.serviceWorker?.addEventListener("message", handler);
    return () => navigator.serviceWorker?.removeEventListener("message", handler);
  }, []);

  // Handle ?action= param when app opens fresh from notification tap
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
    // Detect invite link (Supabase puts type=invite in the hash)
    const hash = window.location.hash;
    if (hash.includes("type=invite")) {
      setIsInvite(true);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session?.user?.email) {
        fetchCurrentProvider(session.user.email).then(provider => {
          setCurrentProvider(provider);
          if (provider) registerPush(provider.id);
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        fetchCurrentProvider(session.user.email).then(provider => {
          setCurrentProvider(provider);
          if (provider) registerPush(provider.id);
        });
      } else {
        setCurrentProvider(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSub(null);
    setTab("home");
    setIsInvite(false);
  };

  if (authLoading) return null;
  if (isInvite && session) return <SetPasswordPage onDone={() => setIsInvite(false)}/>;
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
    if (tab === "home")      return <HomePage/>;
    if (tab === "providers") return <ProvidersPage onMessage={onMessage} currentProvider={currentProvider}/>;
    if (tab === "request")   return <RequestPage currentProvider={currentProvider}/>;
    if (tab === "more")      return <MorePage onNav={k=>setSub(k)} currentProvider={currentProvider}/>;
  }

  return (
    <div style={{minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", maxWidth:430, margin:"0 auto", fontFamily:ff}}>
      <Header logoSrc={logoSrc} onNotif={handleBell} onSettings={()=>setSub("settings")} unreadCount={unreadCount}/>
      <div style={{flex:1, overflowY:"auto", padding:"14px 14px 80px"}}>
        {renderBody()}
      </div>
      <div style={{position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, height:60, background:"#FFF", display:"flex", alignItems:"center", borderTop:`1px solid ${C.grey}`, paddingBottom:"env(safe-area-inset-bottom)", zIndex:50}}>
          {NAV.map(([key,label,Icon]) => {
            const active = tab===key;
            const color  = active ? C.teal : C.greyMid;
            return (
              <button key={key} onClick={()=>{ setTab(key); setSub(null); }} style={{flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"6px 0"}}>
                <Icon color={color}/>
                <span style={{fontFamily:ff, fontWeight:active?800:500, fontSize:10, color}}>{label}</span>
              </button>
            );
          })}
        </div>
    </div>
  );
}
