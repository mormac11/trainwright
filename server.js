import 'dotenv/config';
import express from 'express';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.TO_EMAIL || 'train@wrightpt.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'website@wrightpt.com';
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/contact', async (req, res) => {
  const { firstName, lastName, email, phone, goal, message } = req.body;

  if (!firstName || !lastName || !email || !goal) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      reply_to: email,
      subject: `New Consultation Request — ${firstName} ${lastName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
          <div style="background:#0d0d0f;padding:32px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="font-family:Georgia,serif;font-size:28px;color:#E8A030;margin:0;letter-spacing:4px">WRIGHT PT</h1>
            <p style="color:#8a8a95;font-size:13px;margin:6px 0 0;letter-spacing:2px">NEW CONSULTATION REQUEST</p>
          </div>
          <div style="background:#f5f5f7;padding:32px;border-radius:0 0 12px 12px">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #ddd;font-size:14px;color:#666;width:140px">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #ddd;font-size:14px;font-weight:600">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #ddd;font-size:14px;color:#666">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #ddd;font-size:14px"><a href="mailto:${email}" style="color:#c4821a">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #ddd;font-size:14px;color:#666">Phone</td>
                <td style="padding:10px 0;border-bottom:1px solid #ddd;font-size:14px">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #ddd;font-size:14px;color:#666">Goal</td>
                <td style="padding:10px 0;border-bottom:1px solid #ddd;font-size:14px;font-weight:600;color:#c4821a">${goal}</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding:10px 0;font-size:14px;color:#666;vertical-align:top">Message</td>
                <td style="padding:10px 0;font-size:14px;line-height:1.6">${message.replace(/\n/g, '<br>')}</td>
              </tr>
              ` : ''}
            </table>
            <div style="margin-top:24px;padding:16px;background:#E8A030;border-radius:8px;text-align:center">
              <a href="mailto:${email}" style="color:#0d0d0f;font-weight:700;font-size:14px;text-decoration:none">Reply to ${firstName} &rarr;</a>
            </div>
          </div>
        </div>
      `,
    });

    // Send confirmation email to the prospect
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Got it, ${firstName}! We'll be in touch soon.`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
          <div style="background:#0d0d0f;padding:32px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="font-family:Georgia,serif;font-size:28px;color:#E8A030;margin:0;letter-spacing:4px">WRIGHT PT</h1>
            <p style="color:#8a8a95;font-size:13px;margin:6px 0 0;letter-spacing:2px">DEADWOOD, SOUTH DAKOTA</p>
          </div>
          <div style="background:#f5f5f7;padding:40px;border-radius:0 0 12px 12px">
            <h2 style="margin:0 0 16px;font-size:22px">Hey ${firstName}, you're on your way!</h2>
            <p style="color:#555;line-height:1.7;margin:0 0 16px">Thanks for reaching out to Wright Personal Training. I've received your consultation request and will be in touch within 24 hours to set up your free strategy session.</p>
            <p style="color:#555;line-height:1.7;margin:0 0 24px">In the meantime, feel free to reply to this email with any questions.</p>
            <div style="background:#0d0d0f;border-radius:8px;padding:20px;color:#fff;font-size:13px;line-height:1.8">
              <strong style="color:#E8A030;display:block;margin-bottom:8px">YOUR REQUEST SUMMARY</strong>
              Goal: ${goal}<br>
              ${phone ? `Phone: ${phone}<br>` : ''}
            </div>
            <p style="color:#999;font-size:12px;margin-top:32px;text-align:center">Wright Personal Training &bull; Deadwood, SD &bull; (605) 555-0190</p>
          </div>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Wright PT server running at http://localhost:${PORT}`);
});
