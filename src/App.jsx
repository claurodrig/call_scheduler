import { useState, useEffect } from "react";
import logoSrc from "./assets/logo.png";
import { C, ff, ffb, btnS, card, inpS, lblS } from "./data";
import { supabase } from "./supabase";
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
} from "./components";

const NAV = [
  ["home",      "Home",      IcoHome],
  ["providers", "Providers", IcoProviders],
  ["request",   "Request",   IcoRequest],
  ["more",      "More",      IcoMore],
];

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#c4dde3",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: ff
    }}>
      <div style={{
        width: 393, minHeight: 852, maxHeight: "97vh",
        background: "#EDF6F7", borderRadius: 44,
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 28px 70px rgba(1,133,133,0.20), 0 0 0 10px #111, 0 0 0 12px #2a2a2a"
      }}>
        {/* Status bar */}
        <div style={{
          height: 44, background: "#FFF", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 26px", position: "relative"
        }}>
          <span style={{fontFamily: ff, fontWeight: 800, fontSize: 14, color: "#222"}}>9:41</span>
          <div style={{
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            top: 8, width: 120, height: 28, background: "#111", borderRadius: 20
          }}/>
          <span style={{fontFamily: ff, fontSize: 13, color: "#222"}}>●●● ⚡</span>
        </div>

        {/* Logo */}
        <div style={{display: "flex", justifyContent: "center", padding: "40px 0 20px"}}>
          <img src={logoSrc} alt="Beaches OBGYN" style={{height: 60, objectFit: "contain"}}/>
        </div>

        {/* Login form */}
        <div style={{padding: "0 24px", flex: 1}}>
          <p style={{fontFamily: ff, fontWeight:900, fontSize: 22, color: C.text, marginBottom: 6, textAlign: "center"}}>
            Welcome back
          </p>
          <p style={{fontFamily: ffb, fontSize: 13, color: C.sub, marginBottom: 32, textAlign: "center"}}>
            Sign in to your Beaches OBGYN account
          </p>

          <div style={card({padding: "20px"})}>
            <div style={{marginBottom: 16}}>
              <span style={lblS}>Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@beachesobgyn.com"
                style={inpS}
              />
            </div>
            <div style={{marginBottom: 20}}>
              <span style={lblS}>Password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
                style={inpS}
              />
            </div>

            {error && (
              <p style={{
                fontFamily: ffb, fontSize: 12, color: "#e05555",
                marginBottom: 12, textAlign: "center"
              }}>{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              style={btnS({opacity: loading ? 0.7 : 1})}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <p style={{
            fontFamily: ffb, fontSize: 11, color: C.sub,
            textAlign: "center", marginTop: 20
          }}>
            Contact your administrator to reset your password.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState("home");
  const [sub, setSub]               = useState(null);
  const [msgRecip, setMsgRecip]     = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSub(null);
    setTab("home");
  };

  // Show nothing while checking login status
  if (loading) return null;

  // Show login screen if not logged in
  if (!session) return <LoginPage/>;

  const onMessage = p => { setMsgRecip(p); setSub("messages"); };

  function renderBody() {
    if (sub === "messages") return <MessagesPage recipient={msgRecip} onBack={() => setSub(null)}/>;
    if (sub === "admin")    return <AdminPage    onBack={() => setSub(null)}/>;
    if (sub === "fairness") return <FairnessPage onBack={() => setSub(null)}/>;
    if (sub === "settings") return <SettingsPage onBack={() => setSub(null)} onLogout={handleLogout}/>;
    if (tab === "home")      return <HomePage/>;
    if (tab === "providers") return <ProvidersPage onMessage={onMessage}/>;
    if (tab === "request")   return <RequestPage/>;
    if (tab === "more")      return <MorePage onNav={k => setSub(k)}/>;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#c4dde3",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: ff
    }}>
      <div style={{
        width: 393, minHeight: 852, maxHeight: "97vh",
        background: "#EDF6F7", borderRadius: 44,
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 28px 70px rgba(1,133,133,0.20), 0 0 0 10px #111, 0 0 0 12px #2a2a2a"
      }}>
        {/* Status bar */}
        <div style={{
          height: 44, background: "#FFF", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 26px", position: "relative"
        }}>
          <span style={{fontFamily: ff, fontWeight: 800, fontSize: 14, color: "#222"}}>9:41</span>
          <div style={{
            position: "absolute", left: "50%", transform: "translateX(-50%)",
            top: 8, width: 120, height: 28, background: "#111", borderRadius: 20
          }}/>
          <span style={{fontFamily: ff, fontSize: 13, color: "#222"}}>●●● ⚡</span>
        </div>

        <Header
          logoSrc={logoSrc}
          onNotif={() => setSub("messages")}
          onSettings={() => setSub("settings")}
        />

        <div style={{flex: 1, overflowY: "auto", padding: "14px 14px 6px"}}>
          {renderBody()}
        </div>

        {!sub && (
          <div style={{
            height: 66, background: "#FFF", flexShrink: 0,
            display: "flex", alignItems: "center",
            borderTop: `1px solid ${C.grey}`, paddingBottom: 6
          }}>
            {NAV.map(([key, label, Icon]) => {
              const active = tab === key;
              const color  = active ? C.teal : C.greyMid;
              return (
                <button key={key} onClick={() => setTab(key)} style={{
                  flex: 1, background: "none", border: "none", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 3, padding: "6px 0"
                }}>
                  <Icon color={color}/>
                  <span style={{fontFamily: ff, fontWeight: active?800:500, fontSize: 10, color}}>{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
