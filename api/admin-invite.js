const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function randomColor() {
  const colors = ["#4f9cf9","#f97b4f","#4fbf9c","#c07ef9","#f9c14f","#f94f7b","#4fc8f9","#9cf94f"];
  return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, credentials, mode, tempPassword } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Name and email are required" });

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "SUPABASE_SERVICE_ROLE_KEY is not set" });
  }

  try {
    if (mode === "invite") {
      const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { name, credentials }
      });
      if (error) return res.status(400).json({ error: error.message });

      await supabase.from("providers").insert({
        name, email, credentials,
        initials: name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
        color: randomColor(),
        is_admin: false,
      });

      return res.status(200).json({ message: `Invite sent to ${email}` });

    } else if (mode === "create") {
      if (!tempPassword) return res.status(400).json({ error: "Temp password required" });

      const { error: authError } = await supabase.auth.admin.createUser({
        email, password: tempPassword, email_confirm: true,
        user_metadata: { name, credentials }
      });
      if (authError) return res.status(400).json({ error: authError.message });

      await supabase.from("providers").insert({
        name, email, credentials,
        initials: name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
        color: randomColor(),
        is_admin: false,
      });

      return res.status(200).json({ message: `Account created for ${email}` });
    }

    return res.status(400).json({ error: "Invalid mode" });
  } catch (err) {
    console.error("admin-invite error:", err);
    return res.status(500).json({ error: err.message });
  }
};