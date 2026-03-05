import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) return res.status(500).json({ error: "SUPABASE_URL is missing" });
  if (!key) return res.status(500).json({ error: "SUPABASE_SERVICE_ROLE_KEY is missing" });
  const supabase = createClient(url, key);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { providerId, email } = req.body;
  if (!providerId || !email) return res.status(400).json({ error: "providerId and email are required" });

  try {
    // 1. Delete call schedule entries first (foreign key constraint)
    const { error: scheduleError } = await supabase
      .from("call_schedule").delete().eq("provider_id", providerId);
    if (scheduleError) return res.status(400).json({ error: scheduleError.message });

    // 2. Delete time-off requests
    const { error: reqError } = await supabase
      .from("requests").delete().eq("provider_id", providerId);
    if (reqError) console.error("Delete requests error:", reqError);

    // 3. Delete no-call day requests
    const { error: noCallError } = await supabase
      .from("no_call_day_requests").delete().eq("provider_id", providerId);
    if (noCallError) console.error("Delete no-call requests error:", noCallError);

    // 4. Delete messages
    const { error: msgError } = await supabase
      .from("messages").delete()
      .or(`sender_id.eq.${providerId},recipient_id.eq.${providerId}`);
    if (msgError) console.error("Delete messages error:", msgError);

    // 5. Now safe to delete provider record
    const { error: dbError } = await supabase
      .from("providers").delete().eq("id", providerId);
    if (dbError) return res.status(400).json({ error: dbError.message });

    // 6. Delete auth user
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) return res.status(400).json({ error: listError.message });
    const authUser = users.users.find(u => u.email === email);
    if (authUser) {
      const { error: authError } = await supabase.auth.admin.deleteUser(authUser.id);
      if (authError) console.error("Delete auth user error:", authError);
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("admin-delete-user error:", err);
    return res.status(500).json({ error: err.message });
  }
}