import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, mode, tempPassword } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "SUPABASE_SERVICE_ROLE_KEY is not set" });
  }

  try {
    if (mode === "email") {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: `Password reset email sent to ${email}` });

    } else if (mode === "temp") {
      if (!tempPassword) return res.status(400).json({ error: "Temp password required" });

      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) return res.status(400).json({ error: listError.message });

      const user = users.users.find(u => u.email === email);
      if (!user) return res.status(404).json({ error: "User not found in auth" });

      const { error } = await supabase.auth.admin.updateUserById(user.id, { password: tempPassword });
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: `Password updated for ${email}` });
    }

    return res.status(400).json({ error: "Invalid mode" });
  } catch (err) {
    console.error("admin-reset-password error:", err);
    return res.status(500).json({ error: err.message });
  }
}
