import { supabase } from "./supabase";

export async function fetchProviders() {
  const { data, error } = await supabase.from("providers").select("*").order("name");
  if (error) console.error("fetchProviders:", error);
  return data || [];
}

export async function fetchSchedule(year, month) {
  const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  const { data, error } = await supabase
    .from("call_schedule")
    .select("date, provider_id, providers(id, name, credentials, color, initials, email, avatar_url)")
    .gte("date", start).lte("date", end).order("date");
  if (error) console.error("fetchSchedule:", error);
  const schedule = {};
  (data || []).forEach(row => { schedule[row.date] = row.providers; });
  return schedule;
}

export async function fetchRequests(providerId = null) {
  let query = supabase.from("requests").select("*, providers(id, name, initials, color, email, avatar_url)").order("created_at", { ascending: false });
  if (providerId) query = query.eq("provider_id", providerId);
  const { data, error } = await query;
  if (error) console.error("fetchRequests:", error);
  return data || [];
}

export async function submitRequest({ providerId, type, startDate, endDate, notes }) {
  const { data, error } = await supabase.from("requests").insert({ provider_id: providerId, type, start_date: startDate, end_date: endDate, notes, status: "Pending" }).select().single();
  if (error) console.error("submitRequest:", error);
  return { data, error };
}

export async function updateRequestStatus(requestId, status) {
  const { error } = await supabase.from("requests").update({ status }).eq("id", requestId);
  if (error) console.error("updateRequestStatus:", error);
  return !error;
}

export async function cancelRequest(requestId) {
  const { error } = await supabase.from("requests").delete().eq("id", requestId);
  if (error) console.error("cancelRequest:", error);
  return !error;
}

export async function fetchMessages(userId, recipientId) {
  const { data, error } = await supabase.from("messages").select("*")
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${userId})`)
    .order("created_at");
  if (error) console.error("fetchMessages:", error);
  return data || [];
}

export async function sendMessage({ senderId, recipientId, text }) {
  const { data, error } = await supabase.from("messages").insert({ sender_id: senderId, recipient_id: recipientId, text }).select().single();
  if (error) console.error("sendMessage:", error);
  return { data, error };
}

export async function fetchCurrentProvider(email) {
  const { data, error } = await supabase.from("providers").select("*").eq("email", email).single();
  if (error) console.error("fetchCurrentProvider:", error);
  return data || null;
}

export async function generateSchedule({ providers, requests, year, month, previousSchedule }) {
  const response = await fetch("/api/generate-schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ providers, requests, year, month, previousSchedule }),
  });
  if (!response.ok) throw new Error("Failed to generate schedule");
  return response.json();
}

export async function saveGeneratedSchedule(scheduleMap, providers, year, month) {
  const rows = Object.entries(scheduleMap).map(([date, email]) => {
    const provider = providers.find(p => p.email === email);
    return { date, provider_id: provider?.id };
  }).filter(r => r.provider_id);
  if (rows.length === 0) { console.error("No rows to save"); return false; }
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  const { error: deleteError } = await supabase.from("call_schedule").delete().gte("date", startDate).lte("date", endDate);
  console.log("Delete result:", deleteError, "from", startDate, "to", endDate);
  const { error } = await supabase.from("call_schedule").insert(rows);
  if (error) console.error("saveGeneratedSchedule error:", error);
  else console.log("Saved successfully!");
  return !error;
}

export async function fetchNoCallDayRequests(providerId = null) {
  let query = supabase.from("no_call_day_requests").select("*, providers(id, name, initials, color, email, avatar_url)").order("created_at", { ascending: false });
  if (providerId) query = query.eq("provider_id", providerId);
  const { data, error } = await query;
  if (error) console.error("fetchNoCallDayRequests:", error);
  return data || [];
}

export async function submitNoCallDayRequest({ providerId, requestedDay, notes }) {
  const { data, error } = await supabase.from("no_call_day_requests").insert({ provider_id: providerId, requested_day: requestedDay, notes, status: "Pending" }).select().single();
  if (error) console.error("submitNoCallDayRequest:", error);
  return { data, error };
}

export async function updateNoCallDayStatus(requestId, status, providerId, day) {
  const { error } = await supabase.from("no_call_day_requests").update({ status }).eq("id", requestId);
  if (error) { console.error("updateNoCallDayStatus:", error); return false; }
  if (status === "Approved") {
    const { error: e2 } = await supabase.from("providers").update({ no_call_day: day }).eq("id", providerId);
    if (e2) console.error("updateNoCallDay:", e2);
  }
  return !error;
}