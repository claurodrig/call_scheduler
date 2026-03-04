import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { providers, requests, year, month, previousSchedule } = req.body;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month, 1).toLocaleString("default", { month: "long" });

  const providerEmailMap = {};
  for (const p of providers) providerEmailMap[p.id] = p.email;

  const approvedRequests = requests.filter(r => r.status === "Approved").map(r => ({
    ...r,
    email: r.providers?.email || providerEmailMap[r.provider_id] || null,
    name: r.providers?.name || providers.find(p => p.id === r.provider_id)?.name || "Unknown",
  })).filter(r => r.email);

  // Build all dates for this month (no Sundays)
  const allDates = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dow = date.getDay();
    if (dow === 0) continue;
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    allDates.push({ date: dateStr, dow });
  }

  const fridays   = allDates.filter(d => d.dow === 5).map(d => d.date);
  const saturdays = allDates.filter(d => d.dow === 6).map(d => d.date);
  const weekdays  = allDates.filter(d => d.dow >= 1 && d.dow <= 4).map(d => d.date);

  // Count cumulative history
  const hist = {};
  for (const p of providers) {
    hist[p.email] = { total: 0, weekends: 0, fridays: 0, weekdays: 0, lastDate: null };
  }
  if (previousSchedule) {
    for (const [date, prov] of Object.entries(previousSchedule)) {
      const email = prov?.email;
      if (!email || !hist[email]) continue;
      const dow = new Date(date + "T00:00:00").getDay();
      hist[email].total++;
      if (dow === 5) hist[email].fridays++;
      if (dow === 6 || dow === 0) hist[email].weekends++;
      if (dow >= 1 && dow <= 4) hist[email].weekdays++;
      if (!hist[email].lastDate || date > hist[email].lastDate) hist[email].lastDate = date;
    }
  }

  const isBlocked = (email, dateStr) =>
    approvedRequests.some(r => r.email === email && dateStr >= r.start_date && dateStr <= r.end_date);

  const daysSince = (email, dateStr) => {
    if (!hist[email].lastDate) return 999;
    return Math.floor(
      (new Date(dateStr + "T00:00:00") - new Date(hist[email].lastDate + "T00:00:00")) / 86400000
    );
  };

  const pickBest = (candidates, dateStr, category) => {
    const eligible = candidates.filter(p => {
      if (isBlocked(p.email, dateStr)) return false;
      if (daysSince(p.email, dateStr) < 3) return false;
      return true;
    });
    if (eligible.length === 0) {
      // Relax gap constraint if no one is eligible
      const relaxed = candidates.filter(p => !isBlocked(p.email, dateStr));
      if (relaxed.length === 0) return null;
      relaxed.sort((a, b) => {
        if (hist[a.email][category] !== hist[b.email][category]) return hist[a.email][category] - hist[b.email][category];
        return hist[a.email].total - hist[b.email].total;
      });
      return relaxed[0];
    }
    eligible.sort((a, b) => {
      if (hist[a.email][category] !== hist[b.email][category]) return hist[a.email][category] - hist[b.email][category];
      if (hist[a.email].total !== hist[b.email].total) return hist[a.email].total - hist[b.email].total;
      return daysSince(b.email, dateStr) - daysSince(a.email, dateStr);
    });
    return eligible[0];
  };

  const schedule = {};

  // 1. Assign Saturdays — max 1 per provider, prioritize fewest weekends
  const satAssigned = new Set();
  for (const satDate of saturdays) {
    const candidates = providers.filter(p => !satAssigned.has(p.email));
    const pick = pickBest(candidates, satDate, "weekends");
    if (pick) {
      schedule[satDate] = pick.email;
      satAssigned.add(pick.email);
      hist[pick.email].weekends++;
      hist[pick.email].total++;
      hist[pick.email].lastDate = satDate;
    }
  }

  // 2. Assign Fridays — must differ from adjacent Saturday
  for (const friDate of fridays) {
    const friD = parseInt(friDate.split("-")[2]);
    const satDate = saturdays.find(s => parseInt(s.split("-")[2]) === friD + 1);
    const satEmail = satDate ? schedule[satDate] : null;
    const candidates = providers.filter(p => p.email !== satEmail);
    const pick = pickBest(candidates, friDate, "fridays");
    if (pick) {
      schedule[friDate] = pick.email;
      hist[pick.email].fridays++;
      hist[pick.email].total++;
      hist[pick.email].lastDate = friDate;
    }
  }

  // 3. Assign weekdays
  for (const wdDate of weekdays) {
    const pick = pickBest(providers, wdDate, "weekdays");
    if (pick) {
      schedule[wdDate] = pick.email;
      hist[pick.email].weekdays++;
      hist[pick.email].total++;
      hist[pick.email].lastDate = wdDate;
    }
  }

  // 4. Mirror Saturday → Sunday
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (date.getDay() === 6) {
      const satStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const sunDate = new Date(year, month, d + 1);
      const sunStr = `${sunDate.getFullYear()}-${String(sunDate.getMonth()+1).padStart(2,"0")}-${String(sunDate.getDate()).padStart(2,"0")}`;
      if (schedule[satStr]) schedule[sunStr] = schedule[satStr];
    }
  }

  const counts = providers.map(p => {
    const n = Object.values(schedule).filter(e => e === p.email).length;
    return `${p.name.replace("Dr. ", "")}: ${n}`;
  }).join(", ");
  const summary = `${monthName} ${year} schedule: ${counts}. Distributed using fair rotation prioritizing providers with fewest historical calls.`;

  return res.status(200).json({ schedule, summary });
}