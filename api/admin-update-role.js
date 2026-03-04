import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { providerId, isAdmin } = req.body;
  if (!providerId || isAdmin === undefined) return res.status(400).json({ error: "providerId and isAdmin are required" });

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "SUPABASE_SERVICE_ROLE_KEY is not set" });
  }

  try {
    const { error } = await supabase
      .from("providers")
      .update({ is_admin: isAdmin })
      .eq("id", providerId);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: "Role updated" });
  } catch (err) {
    console.error("admin-update-role error:", err);
    return res.status(500).json({ error: err.message });
  }
}
