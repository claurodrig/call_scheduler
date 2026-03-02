import { supabase } from "./supabase";

// ─── Providers ────────────────────────────────────────────────────────────────
export async function fetchProviders() {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .order("name");
  if (error) console.error("fetchProviders:", error);
  return data || [];
}

// ─── Schedule ─────────────────────────────────────────────────────────────────
export async function fetchSchedule(year, month) {
  const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const end   = `${year}-${String(month + 1).padStart(2, "0")}-31`;

  const { data, error } = await supabase
    .from("call_schedule")
    .select("date, provider_id, providers(id, name, credentials, color, initials, email)")
    .gte("date", start)
    .lte("date", end)
    .order("date");

  if (error) console.error("fetchSchedule:", error);

  const schedule = {};
  (data || []).forEach(row => {
    schedule[row.date] = row.providers;
  });
  return schedule;
}

// ─── Requests ─────────────────────────────────────────────────────────────────
export async function fetchRequests(providerId = null) {
  let query = supabase
    .from("requests")
    .select("*, providers(name, initials, color)")
    .order("created_at", { ascending: false });

  if (providerId) {
    query = query.eq("provider_id", providerId);
  }

  const { data, error } = await query;
  if (error) console.error("fetchRequests:", error);
  return data || [];
}

export async function submitRequest({ providerId, type, startDate, endDate, notes }) {
  const { data, error } = await supabase
    .from("requests")
    .insert({
      provider_id: providerId,
      type,
      start_date: startDate,
      end_date:   endDate,
      notes,
      status: "Pending",
    })
    .select()
    .single();

  if (error) console.error("submitRequest:", error);
  return { data, error };
}

export async function updateRequestStatus(requestId, status) {
  const { error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", requestId);

  if (error) console.error("updateRequestStatus:", error);
  return !error;
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export async function fetchMessages(userId, recipientId) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${recipientId}),` +
      `and(sender_id.eq.${recipientId},recipient_id.eq.${userId})`
    )
    .order("created_at");

  if (error) console.error("fetchMessages:", error);
  return data || [];
}

export async function sendMessage({ senderId, recipientId, text }) {
  const { data, error } = await supabase
    .from("messages")
    .insert({ sender_id: senderId, recipient_id: recipientId, text })
    .select()
    .single();

  if (error) console.error("sendMessage:", error);
  return { data, error };
}

// ─── Current provider profile ─────────────────────────────────────────────────
export async function fetchCurrentProvider(email) {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("email", email)
    .single();

  if (error) console.error("fetchCurrentProvider:", error);
  return data || null;
}

// ─── AI Schedule Generator ────────────────────────────────────────────────────
export async function generateSchedule({ providers, requests, year, month, previousSchedule }) {
  const response = await fetch("/api/generate-schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ providers, requests, year, month, previousSchedule }),
  });
  if (!response.ok) throw new Error("Failed to generate schedule");
  return response.json();
}

export async function saveGeneratedSchedule(scheduleMap, providers) {
  const rows = Object.entries(scheduleMap).map(([date, email]) => {
    const provider = providers.find(p => p.email === email);
    return { date, provider_id: provider?.id };
  }).filter(r => r.provider_id);

  console.log("Saving rows:", rows);

  if (rows.length === 0) {
    console.error("No rows to save — emails may not match providers");
    return false;
  }

  const month = rows[0].date.slice(0, 7);
  await supabase
    .from("call_schedule")
    .delete()
    .gte("date", `${month}-01`)
    .lte("date", `${month}-31`);

  const { error } = await supabase.from("call_schedule").insert(rows);
  if (error) console.error("saveGeneratedSchedule error:", error);
  else console.log("Saved successfully!");
  return !error;
}
