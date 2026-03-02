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

  const requestList = requests.length > 0
    ? requests.filter(r => r.status === "Approved").map(r =>
        `- ${r.providers?.name}: ${r.type} from ${r.start_date} to ${r.end_date}`
      ).join("\n")
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

APPROVED TIME-OFF REQUESTS (these dates must be excluded for those providers):
${requestList}

PREVIOUS MONTH CALL HISTORY (use this to ensure fairness continuity):
${previousCalls}

FRIDAYS THIS MONTH: ${fridays.join(", ")}
SATURDAYS THIS MONTH: ${saturdays.join(", ")}
(Note: Sundays are automatically assigned to the same provider as Saturday — do NOT include Sundays in your output)

STRICT CALL RULES:
1. Each day needs exactly one provider on call
2. Minimum 3 days between any two call shifts for the same provider
3. FRIDAY and SATURDAY must ALWAYS be different providers
4. Each provider may have AT MOST ONE Saturday this month — no provider gets two Saturdays in the same month
5. Distribute Saturdays as evenly as possible — ideally each provider gets at most 1 Saturday per month
6. Distribute Fridays as evenly as possible across providers
7. Track cumulative Friday and Saturday counts from previous months to ensure year-long fairness
8. Minimum 3 weeks between weekend shifts (Fri OR Sat) for the same provider
9. Respect all approved time-off requests
10. MAXIMIZE the gap between each provider's call shifts
11. Balance total weekday calls fairly across all providers
12. Do not assign a provider who had the last call of the previous month to the first day of this month

CRITICAL: Use ONLY these exact email addresses: ${emailList}
Do NOT invent or modify any emails.
Do NOT include Sundays in the schedule — they are handled automatically.

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

    // ─── Enforce Saturday = Sunday rule in code ───────────────────────────────
    const schedule = { ...result.schedule };
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      if (date.getDay() === 6) { // Saturday
        const satStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const sunDate = new Date(year, month, d + 1);
        const sunStr = `${sunDate.getFullYear()}-${String(sunDate.getMonth()+1).padStart(2,"0")}-${String(sunDate.getDate()).padStart(2,"0")}`;
        if (schedule[satStr]) {
          schedule[sunStr] = schedule[satStr];
        }
      }
    }

    // ─── Enforce max 1 Saturday per provider per month in code ───────────────
    const satCounts = {};
    for (const satDate of saturdays) {
      const email = schedule[satDate];
      if (!email) continue;
      if (satCounts[email]) {
        // This provider already has a Saturday — find someone else
        const usedEmails = Object.values(satCounts);
        const available = providers.map(p => p.email).filter(e => !usedEmails.includes(e));
        if (available.length > 0) {
          schedule[satDate] = available[0];
          // Also update Sunday
          const satD = parseInt(satDate.split("-")[2]);
          const sunDate = new Date(year, month, satD + 1);
          const sunStr = `${sunDate.getFullYear()}-${String(sunDate.getMonth()+1).padStart(2,"0")}-${String(sunDate.getDate()).padStart(2,"0")}`;
          schedule[sunStr] = available[0];
        }
      } else {
        satCounts[email] = (satCounts[email] || 0) + 1;
      }
    }

    return res.status(200).json({ schedule, summary: result.summary });
  } catch (err) {
    console.error("AI schedule error:", err);
    return res.status(500).json({ error: err.message });
  }
}