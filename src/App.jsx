import { useState, useEffect } from "react";
import logoSrc from "./assets/logo.png";
import { C, ff, ffb, btnS, card, inpS, lblS } from "./data";
import { supabase } from "./supabase";
import { fetchCurrentProvider } from "./api";
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
  FairnessPage,
  UpcomingVacationsPage,
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

export default function App() {
  const [session, setSession]                 = useState(null);
  const [authLoading, setAuthLoading]         = useState(true);
  const [currentProvider, setCurrentProvider] = useState(null);
  const [tab, setTab]                         = useState("home");
  const [sub, setSub]                         = useState(null);
  const [msgRecip, setMsgRecip]               = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
      if (session?.user?.email) {
        fetchCurrentProvider(session.user.email).then(setCurrentProvider);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.email) {
        fetchCurrentProvider(session.user.email).then(setCurrentProvider);
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
  };

  if (authLoading) return null;
  if (!session) return <LoginPage/>;

  const onMessage = p => { setMsgRecip(p); setSub("messages"); };

  function renderBody() {
    if (sub === "messages") return <MessagesPage recipient={msgRecip} onBack={()=>setSub(null)} currentProvider={currentProvider}/>;
    if (sub === "admin")    return <AdminPage onBack={()=>setSub(null)}/>;
    if (sub === "fairness") return <FairnessPage onBack={()=>setSub(null)}/>;
    if (sub === "vacations") return <UpcomingVacationsPage onBack={()=>setSub(null)}/>;
    if (sub === "settings") return <SettingsPage onBack={()=>setSub(null)} onLogout={handleLogout} currentProvider={currentProvider}/>;
    if (tab === "home")     return <HomePage/>;
    if (tab === "providers") return <ProvidersPage onMessage={onMessage}/>;
    if (tab === "request")  return <RequestPage currentProvider={currentProvider}/>;
    if (tab === "more")     return <MorePage onNav={k=>setSub(k)} currentProvider={currentProvider}/>;
  }

  return (
    <div style={{minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", maxWidth:430, margin:"0 auto", fontFamily:ff}}>
      <Header logoSrc={logoSrc} onNotif={()=>setSub("messages")} onSettings={()=>setSub("settings")}/>
      <div style={{flex:1, overflowY:"auto", padding:"14px 14px 80px"}}>
        {renderBody()}
      </div>
      {!sub && (
        <div style={{position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, height:60, background:"#FFF", display:"flex", alignItems:"center", borderTop:`1px solid ${C.grey}`, paddingBottom:"env(safe-area-inset-bottom)"}}>
          {NAV.map(([key,label,Icon]) => {
            const active = tab===key;
            const color  = active ? C.teal : C.greyMid;
            return (
              <button key={key} onClick={()=>setTab(key)} style={{flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"6px 0"}}>
                <Icon color={color}/>
                <span style={{fontFamily:ff, fontWeight:active?800:500, fontSize:10, color}}>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
