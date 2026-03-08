export const C = {
  primary:"#5B6E9B", teal:"#5B6E9B", bg:"#F0EBE0", wave:"#D4C9B5",
  surface:"#FFFFFF", text:"#2C3354", sub:"#7A7A7A", grey:"#E2D9CC",
  greyMid:"#C4B8A8", coral:"#C97B5A"
};

export const PROVIDERS = [
  { id:1, name:"Dr. A", cred:"MD", color:"#5B6E9B", initials:"DA", short:"Dr. A" },
  { id:2, name:"Dr. B", cred:"MD", color:"#7A9E7E", initials:"DB", short:"Dr. B" },
  { id:3, name:"Dr. C", cred:"MD", color:"#D4A853", initials:"DC", short:"Dr. C" },
  { id:4, name:"Dr. D", cred:"DO", color:"#8B6F8E", initials:"DD", short:"Dr. D" },
  { id:5, name:"Dr. E", cred:"MD", color:"#C97B5A", initials:"DE", short:"Dr. E" },
];

export const CALL_SCHEDULE = {
  "2026-10-01":1,"2026-10-02":2,"2026-10-03":3,"2026-10-04":4,"2026-10-05":5,
  "2026-10-06":1,"2026-10-07":2,"2026-10-08":3,"2026-10-09":4,"2026-10-10":5,
  "2026-10-11":1,"2026-10-12":2,"2026-10-13":3,"2026-10-14":4,"2026-10-15":5,
  "2026-10-16":1,"2026-10-17":2,"2026-10-18":3,"2026-10-19":4,"2026-10-20":5,
  "2026-10-21":1,"2026-10-22":2,"2026-10-23":3,"2026-10-24":4,"2026-10-25":5,
  "2026-10-26":1,"2026-10-27":2,"2026-10-28":3,"2026-10-29":4,"2026-10-30":5,"2026-10-31":1,
};

export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const WD_SHORT = ["Su","Mo","Tu","We","Th","Fr","Sa"];
export const WD_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export const ff  = "Nunito, sans-serif";
export const ffb = "Nunito Sans, sans-serif";

export const pad      = n => String(n).padStart(2,"0");
export const dkey     = (y,m,d) => `${y}-${pad(m+1)}-${pad(d)}`;
export const byId     = id => PROVIDERS.find(p => p.id === id);
export const getDays  = (y,m) => new Date(y,m+1,0).getDate();
export const getFirst = (y,m) => new Date(y,m,1).getDay();

export const card  = (x={}) => Object.assign({ background:"#FFF", borderRadius:10, boxShadow:"0 1px 8px rgba(91,110,155,0.10)" }, x);
export const btnS  = (x={}) => Object.assign({ width:"100%", padding:"12px", borderRadius:8, border:"none", background:C.primary, color:"#fff", fontFamily:ff, fontWeight:800, fontSize:14, cursor:"pointer" }, x);
export const oBtnS = (x={}) => Object.assign({ padding:"10px 14px", borderRadius:8, border:`1.5px solid ${C.primary}`, background:"transparent", color:C.primary, fontFamily:ff, fontWeight:700, fontSize:12, cursor:"pointer" }, x);
export const inpS  = { width:"100%", padding:"10px 12px", borderRadius:8, border:"1.5px solid #E2D9CC", background:"#F7F3ED", fontFamily:"Nunito Sans, sans-serif", fontSize:13, color:"#2C3354", outline:"none", boxSizing:"border-box" };
export const lblS  = { fontFamily:ff, fontWeight:700, fontSize:10, color:"#7A7A7A", textTransform:"uppercase", letterSpacing:.8, display:"block", marginBottom:4 };
export const badge = s => ({ background:{ Pending:"#D4A853", Approved:"#7A9E7E", Denied:"#C97B5A" }[s]||"#E2D9CC", color:"#fff", padding:"3px 10px", borderRadius:6, fontFamily:ff, fontWeight:700, fontSize:11 });
