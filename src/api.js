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
    .select("date, provider_id, providers!call_schedule_provider_id_fkey(id, name, credentials, color, initials, email, avatar_url)")
    .gte("date", start).lte("date", end).order("date");
  if (error) console.error("fetchSchedule:", error);
  const schedule = {};
  (data || []).forEach(row => { schedule[row.date] = row.providers; });
  return schedule;
}

export async function fetchRequests(providerId = null) {
  let query = supabase
    .from("requests")
    .select("*, providers!requests_provider_id_fkey(id, name, initials, color, email, avatar_url)")
    .order("created_at", { ascending: false });
  if (providerId) query = query.eq("provider_id", providerId);
  const { data, error } = await query;
  if (error) console.error("fetchRequests:", error);
  return data || [];
}

export async function fetchIncomingSwitchRequests(providerId) {
  const { data, error } = await supabase
    .from("requests")
    .select("*, providers!requests_provider_id_fkey(id, name, initials, color, email, avatar_url)")
    .eq("type", "Call Switch")
    .eq("target_provider_id", providerId)
    .eq("status", "Pending")
    .order("created_at", { ascending: false });
  if (error) console.error("fetchIncomingSwitchRequests:", error);
  return data || [];
}

export async function submitRequest({ providerId, type, startDate, endDate, notes, targetProviderId = null }) {
  const { data, error } = await supabase
    .from("requests")
    .insert({
      provider_id: providerId,
      type,
      start_date: startDate,
      end_date: endDate,
      notes,
      status: "Pending",
      target_provider_id: targetProviderId,
    })
    .select().single();
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
  let query = supabase
    .from("no_call_day_requests")
    .select("*, providers!no_call_day_requests_provider_id_fkey(id, name, initials, color, email, avatar_url)")
    .order("created_at", { ascending: false });
  if (providerId) query = query.eq("provider_id", providerId);
  const { data, error } = await query;
  if (error) console.error("fetchNoCallDayRequests:", error);
  return data || [];
}

export async function submitNoCallDayRequest({ providerId, requestedDay, notes }) {
  const { data, error } = await supabase
    .from("no_call_day_requests")
    .insert({ provider_id: providerId, requested_day: requestedDay, notes, status: "Pending" })
    .select().single();
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

export async function uploadAvatar(providerId, file) {
  const ext = file.name.split(".").pop();
  const path = `avatars/${providerId}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("provider-avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) { console.error("uploadAvatar:", uploadError); return null; }
  const { data } = supabase.storage.from("provider-avatars").getPublicUrl(path);
  const cleanUrl = data.publicUrl;
  const { error: updateError } = await supabase
    .from("providers")
    .update({ avatar_url: cleanUrl })
    .eq("id", providerId);
  if (updateError) { console.error("updateAvatar:", updateError); return null; }
  return `${cleanUrl}?t=${Date.now()}`;
}

export async function executeCallSwitch(requestId, requesterProviderId, targetProviderId, requesterDate, targetDate) {
  const { error: e1 } = await supabase
    .from("call_schedule")
    .update({ provider_id: targetProviderId })
    .eq("date", requesterDate);
  if (e1) { console.error("executeCallSwitch e1:", e1); return false; }

  const { error: e2 } = await supabase
    .from("call_schedule")
    .update({ provider_id: requesterProviderId })
    .eq("date", targetDate);
  if (e2) { console.error("executeCallSwitch e2:", e2); return false; }

  for (const [date, providerId] of [[requesterDate, targetProviderId], [targetDate, requesterProviderId]]) {
    const d = new Date(date + "T00:00:00");
    if (d.getDay() === 6) {
      const sun = new Date(d);
      sun.setDate(sun.getDate() + 1);
      const sunStr = `${sun.getFullYear()}-${String(sun.getMonth()+1).padStart(2,"0")}-${String(sun.getDate()).padStart(2,"0")}`;
      await supabase.from("call_schedule").update({ provider_id: providerId }).eq("date", sunStr);
    }
  }

  const { error: e3 } = await supabase.from("requests").update({ status: "Approved" }).eq("id", requestId);
  if (e3) { console.error("executeCallSwitch e3:", e3); return false; }

  return true;
}

export async function updateScheduleDate(date, providerEmail) {
  const { data: provData } = await supabase
    .from("providers")
    .select("id")
    .eq("email", providerEmail)
    .single();
  if (!provData) { console.error("updateScheduleDate: provider not found", providerEmail); return false; }
  const { error } = await supabase
    .from("call_schedule")
    .update({ provider_id: provData.id })
    .eq("date", date);
  if (error) console.error("updateScheduleDate:", error);
  return !error;
}

export async function fetchNotifications(providerId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("provider_id", providerId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) console.error("fetchNotifications:", error);
  return data || [];
}

export async function markNotificationsRead(providerId) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("provider_id", providerId)
    .eq("read", false);
  if (error) console.error("markNotificationsRead:", error);
  return !error;
}

export async function createNotification({ providerId, title, body }) {
  const { error } = await supabase
    .from("notifications")
    .insert({ provider_id: providerId, title, body, read: false });
  if (error) console.error("createNotification:", error);
  return !error;
}

export async function updateProviderPrefs(providerId, prefs) {
  const { error } = await supabase
    .from("providers")
    .update({ notif_prefs: prefs })
    .eq("id", providerId);
  if (error) console.error("updateProviderPrefs:", error);
  return !error;
}

export async function updateProviderProfile(providerId, { full_name, phone, display_name }) {
  const { error } = await supabase
    .from("providers")
    .update({ full_name, phone, display_name })
    .eq("id", providerId);
  if (error) console.error("updateProviderProfile:", error);
  if (error) throw error;
  return true;
}

export async function registerPushSubscription(providerId, subscription) {
  const { endpoint, keys: { p256dh, auth } } = subscription.toJSON();
  const { error } = await supabase.from("push_subscriptions").upsert(
    { provider_id: providerId, endpoint, p256dh, auth },
    { onConflict: "endpoint" }
  );
  if (error) console.error("registerPushSubscription:", error);
  return !error;
}

export async function sendPushNotification({ providerIds, title, body, data = {}, notifKey = null }) {
  try {
    let filteredIds = providerIds;
    if (notifKey) {
      const { data: provs } = await supabase.from("providers").select("id, notif_prefs").in("id", providerIds);
      if (provs) {
        filteredIds = provs
          .filter(p => {
            const prefs = p.notif_prefs || {};
            if (prefs.all === false) return false;
            if (notifKey && prefs[notifKey] === false) return false;
            return true;
          })
          .map(p => p.id);
      }
    }
    if (filteredIds.length === 0) return;
    await Promise.all(filteredIds.map(id => createNotification({ providerId: id, title, body })));
    await fetch("/api/send-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerIds: filteredIds, title, body, data }),
    });
  } catch (err) {
    console.error("sendPushNotification:", err);
  }
}

export async function fetchScheduleLocks() {
  const { data, error } = await supabase.from("schedule_locks").select("month");
  if (error) console.error("fetchScheduleLocks:", error);
  return new Set((data || []).map(r => r.month));
}

export async function lockMonth(year, month, email) {
  const key = `${year}-${String(month + 1).padStart(2, "0")}`;
  const { error } = await supabase.from("schedule_locks")
    .upsert({ month: key, locked_by: email, locked_at: new Date().toISOString() });
  if (error) console.error("lockMonth:", error);
  return !error;
}

export async function unlockMonth(year, month) {
  const key = `${year}-${String(month + 1).padStart(2, "0")}`;
  const { error } = await supabase.from("schedule_locks").delete().eq("month", key);
  if (error) console.error("unlockMonth:", error);
  return !error;
}