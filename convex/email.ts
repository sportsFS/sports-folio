export async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Sports Folio Store <delivered@resend.dev>",
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend error:", await res.text());
  }
}
