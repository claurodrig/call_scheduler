import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) return res.status(500).json({ error: "SUPABASE_URL is missing", env: Object.keys(process.env).filter(k => k.includes("SUPA")) });
  if (!key) return res.status(500).json({ error: "SUPABASE_SERVICE_ROLE_KEY is missing" });

  const supabase = createClient(url, key);

  const { providerId, isAdmin } = req.body;
  if (!providerId || isAdmin === undefined) return res.status(400).json({ error: "providerId and isAdmin are required" });

  try {
    const { error } = await supabase.from("providers").update({ is_admin: isAdmin }).eq("id", providerId);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: "Role updated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
