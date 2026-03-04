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

  // Build all dates (no Sundays)
  const allDates = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow === 0) continue;
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    allDates.push({ date: dateStr, dow });
  }

  const fridays   = allDates.filter(d => d.dow === 5).map(d => d.date);
  const saturdays = allDates.filter(d => d.dow === 6).map(d => d.date);
  const weekdays  = allDates.filter(d => d.dow >= 1 && d.dow <= 4).map(d => d.date);

  // Count cumulative history from ALL previous months
  const historyEntries = previousSchedule ? Object.keys(previousSchedule).length : 0;
  console.log(`[generate-schedule] ${monthName} ${year} — history entries received: ${historyEntries}`);
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

  const lastAssigned = {}; // track last date assigned IN THIS MONTH for gap enforcement
  for (const p of providers) lastAssigned[p.email] = hist[p.email].lastDate;

  const gapOk = (email, dateStr, minGap = 4) => {
    const last = lastAssigned[email];
    if (!last) return true;
    const diff = Math.floor((new Date(dateStr + "T00:00:00") - new Date(last + "T00:00:00")) / 86400000);
    return diff > minGap;
  };

  // Pick best provider: sort by category count asc, then total asc, then gap desc
  const pickBest = (candidates, dateStr, category, excludeEmails = [], minGap = 4) => {
    let eligible = candidates.filter(p =>
      !excludeEmails.includes(p.email) &&
      !isBlocked(p.email, dateStr) &&
      gapOk(p.email, dateStr, minGap)
    );
    // Relax gap if needed
    if (eligible.length === 0) {
      eligible = candidates.filter(p =>
        !excludeEmails.includes(p.email) &&
        !isBlocked(p.email, dateStr)
      );
    }
    if (eligible.length === 0) return null;
    eligible.sort((a, b) => {
      if (hist[a.email][category] !== hist[b.email][category])
        return hist[a.email][category] - hist[b.email][category];
      if (hist[a.email].total !== hist[b.email].total)
        return hist[a.email].total - hist[b.email].total;
      // Most rested (longest gap)
      const gapA = lastAssigned[a.email] ? (new Date(dateStr+"T00:00:00") - new Date(lastAssigned[a.email]+"T00:00:00")) / 86400000 : 999;
      const gapB = lastAssigned[b.email] ? (new Date(dateStr+"T00:00:00") - new Date(lastAssigned[b.email]+"T00:00:00")) / 86400000 : 999;
      return gapB - gapA;
    });
    return eligible[0];
  };

  const assign = (email, dateStr, category) => {
    schedule[dateStr] = email;
    hist[email][category]++;
    hist[email].total++;
    lastAssigned[email] = dateStr;
  };

  const schedule = {};

  // 1. Assign Saturdays — strict round-robin by fewest weekends, max 1 per provider per month
  const satAssignedThisMonth = {};
  for (const satDate of saturdays) {
    const candidates = providers.filter(p => !satAssignedThisMonth[p.email]);
    const pick = pickBest(candidates, satDate, "weekends");
    if (pick) {
      assign(pick.email, satDate, "weekends");
      satAssignedThisMonth[pick.email] = true;
    }
  }

  // 2. Assign Fridays — must differ from the Saturday of same weekend
  for (const friDate of fridays) {
    const friD = parseInt(friDate.split("-")[2]);
    const satDate = saturdays.find(s => parseInt(s.split("-")[2]) === friD + 1);
    const satEmail = satDate ? schedule[satDate] : null;
    const pick = pickBest(providers, friDate, "fridays", satEmail ? [satEmail] : []);
    if (pick) assign(pick.email, friDate, "fridays");
  }

  // 3. Assign weekdays — pick most rested with fewest calls
  for (const wdDate of weekdays) {
    const pick = pickBest(providers, wdDate, "weekdays");
    if (pick) assign(pick.email, wdDate, "weekdays");
  }

  // 4. Mirror Saturday → Sunday
  for (let d = 1; d <= daysInMonth; d++) {
    if (new Date(year, month, d).getDay() === 6) {
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

  console.log("[generate-schedule] Final counts:", counts);
  return res.status(200).json({
    schedule,
    summary: `${monthName} ${year}: ${counts}. Code-enforced fair rotation.`
  });
}