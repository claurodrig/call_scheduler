import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.VITE_ANTHROPIC_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { providers, requests, year, month, previousSchedule } = req.body;

  const monthName = new Date(year, month, 1).toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const providerList = providers.map(p =>
    `- ${p.name} (${p.credentials}, email: ${p.email}, no-call day preference: ${p.no_call_day || "none"}, participation: ${p.participation_percent || 100}%)`
  ).join("\n");

  // Build a map of provider_id -> email for fast lookup
  const providerEmailMap = {};
  for (const p of providers) {
    providerEmailMap[p.id] = p.email;
  }

  // Build approved requests with correct email lookup
  const approvedRequests = requests.filter(r => r.status === "Approved").map(r => ({
    ...r,
    email: r.providers?.email || providerEmailMap[r.provider_id] || null,
    name: r.providers?.name || providers.find(p => p.id === r.provider_id)?.name || "Unknown",
  })).filter(r => r.email);

  const requestList = approvedRequests.length > 0
    ? approvedRequests.map(r => {
        const endDate = new Date(r.end_date);
        const nextDay = new Date(endDate);
        nextDay.setDate(endDate.getDate() + 1);
        const nextDayStr = `${nextDay.getFullYear()}-${String(nextDay.getMonth()+1).padStart(2,"0")}-${String(nextDay.getDate()).padStart(2,"0")}`;
        return `- ${r.name} (${r.email}): ${r.type} from ${r.start_date} to ${r.end_date} — BLOCKED on ALL dates inclusive through ${r.end_date}. First available date is ${nextDayStr}.`;
      }).join("\n")
    : "No approved time-off requests.";

  const previousCalls = previousSchedule
    ? Object.entries(previousSchedule).map(([date, p]) => `${date}: ${p.name}`).join("\n")
    : "No previous schedule data available.";

  const emailList = providers.map(p => p.email).join(", ");
  const providerCount = providers.length;

  // Build list of Fridays and Saturdays in the month
  const fridays = [];
  const saturdays = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    if (date.getDay() === 5) fridays.push(dateStr);
    if (date.getDay() === 6) saturdays.push(dateStr);
  }

  const prompt = `You are scheduling on-call assignments for an OBGYN practice called Beaches OBGYN for ${monthName} ${year}.

The month has ${daysInMonth} days and ${providerCount} providers.

PROVIDERS:
${providerList}

APPROVED TIME-OFF REQUESTS:
${requestList}

IMPORTANT TIME-OFF RULE: The end date of time off is the LAST day the provider is OFF. They are NOT available on that date. Their FIRST available date is the day AFTER the end date.

PREVIOUS MONTH CALL HISTORY:
${previousCalls}

FRIDAYS THIS MONTH: ${fridays.join(", ")}
SATURDAYS THIS MONTH: ${saturdays.join(", ")}
(Sundays are automatically copied from Saturday — do NOT include Sundays in your output)

STRICT CALL RULES:
1. Each day needs exactly one provider on call
2. Minimum 3 days between any two call shifts for the same provider
3. FRIDAY and SATURDAY must ALWAYS be different providers
4. Each provider may have AT MOST ONE Saturday this month
5. Distribute Saturdays as evenly as possible across providers
6. Distribute Fridays as evenly as possible across providers
7. Minimum 3 weeks between weekend shifts (Fri OR Sat) for the same provider
8. A provider on time off is BLOCKED on ALL days from start_date through end_date INCLUSIVE
9. MAXIMIZE the gap between each provider's call shifts
10. Balance total weekday calls fairly across all providers
11. Do not assign a provider who had the last call of the previous month to the first day of this month

CRITICAL: Use ONLY these exact email addresses: ${emailList}
Do NOT include Sundays in the schedule.

Respond ONLY with a valid JSON object, no explanation, no markdown:
{
  "schedule": {
    "YYYY-MM-DD": "provider_email"
  },
  "summary": "A brief 2-sentence summary of how fairness was achieved"
}`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    const schedule = { ...result.schedule };

    // ─── Enforce Saturday = Sunday in code ───────────────────────────────────
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      if (date.getDay() === 6) {
        const satStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const sunDate = new Date(year, month, d + 1);
        const sunStr = `${sunDate.getFullYear()}-${String(sunDate.getMonth()+1).padStart(2,"0")}-${String(sunDate.getDate()).padStart(2,"0")}`;
        if (schedule[satStr]) schedule[sunStr] = schedule[satStr];
      }
    }

    // ─── Enforce max 1 Saturday per provider in code ─────────────────────────
    const satCounts = {};
    for (const satDate of saturdays) {
      const email = schedule[satDate];
      if (!email) continue;
      if (satCounts[email]) {
        const usedEmails = new Set(Object.keys(satCounts));
        const available = providers.map(p => p.email).find(e => !usedEmails.has(e));
        if (available) {
          schedule[satDate] = available;
          const satD = parseInt(satDate.split("-")[2]);
          const sunDate = new Date(year, month, satD + 1);
          const sunStr = `${sunDate.getFullYear()}-${String(sunDate.getMonth()+1).padStart(2,"0")}-${String(sunDate.getDate()).padStart(2,"0")}`;
          schedule[sunStr] = available;
          satCounts[available] = 1;
        }
      } else {
        satCounts[email] = 1;
      }
    }

    // ─── Enforce time-off blocks in code ─────────────────────────────────────
    for (const r of approvedRequests) {
      const start = new Date(r.start_date + "T00:00:00");
      const end = new Date(r.end_date + "T00:00:00");
      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        const dateStr = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
        if (schedule[dateStr] === r.email) {
          // Replace with a provider not on time off that day
          const replacement = providers.find(p => {
            if (p.email === r.email) return false;
            // Check this provider is not also on time off
            return !approvedRequests.some(req => {
              if (req.email !== p.email) return false;
              const s = new Date(req.start_date + "T00:00:00");
              const e = new Date(req.end_date + "T00:00:00");
              return dt >= s && dt <= e;
            });
          });
          if (replacement) schedule[dateStr] = replacement.email;
        }
      }
    }

    return res.status(200).json({ schedule, summary: result.summary });
  } catch (err) {
    console.error("AI schedule error:", err);
    return res.status(500).json({ error: err.message });
  }
}