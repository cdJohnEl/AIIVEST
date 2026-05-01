require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── HTML Templates ─────────────────────────────────────────────────────────

function verificationEmailHtml(name, link) {
  return `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#070a12;color:#f4f6ff;padding:40px;border:1px solid rgba(45,107,255,.2);border-radius:20px;">
  <div style="text-align:center;margin-bottom:30px;">
    <h1 style="margin:0;font-size:28px;"><span style="color:#2D6BFF;">Nexus</span><span style="color:#f4f6ff;">FinPro</span></h1>
    <p style="color:#5a6578;font-size:12px;margin-top:4px;">Secure Account Verification</p>
  </div>
  <p style="font-size:18px;margin-bottom:20px;">Hello ${name},</p>
  <p style="color:#a7b1c8;line-height:1.7;font-size:15px;">
    Thank you for registering with <strong>NexusFinPro</strong>. To activate your investment dashboard and secure your account, please verify your email address.
  </p>
  <div style="text-align:center;margin:35px 0;">
    <a href="${link}" style="background:#2D6BFF;color:#fff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">Verify My Account</a>
  </div>
  <p style="font-size:12px;color:#5a6578;line-height:1.6;">
    If the button doesn't work, copy and paste this link:<br/>
    <a href="${link}" style="color:#2D6BFF;word-break:break-all;">${link}</a>
  </p>
  <hr style="border:0;border-top:1px solid rgba(255,255,255,.06);margin:30px 0;"/>
  <p style="font-size:11px;color:#5a6578;text-align:center;">
    If you did not create an account, you can safely ignore this email.<br/>
    &copy; ${new Date().getFullYear()} NexusFinPro. All rights reserved.
  </p>
</div>`;
}

function welcomeEmailHtml(name) {
  return `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#070a12;color:#f4f6ff;padding:40px;border:1px solid rgba(45,107,255,.2);border-radius:20px;">
  <div style="text-align:center;margin-bottom:30px;">
    <h1 style="margin:0;font-size:28px;"><span style="color:#2D6BFF;">Nexus</span><span style="color:#f4f6ff;">FinPro</span></h1>
  </div>
  <h2 style="font-size:24px;margin-bottom:20px;">Welcome to the Elite, ${name}! 🚀</h2>
  <p style="color:#a7b1c8;line-height:1.7;font-size:15px;">
    Your account is now active. Welcome to <strong>NexusFinPro</strong> — the future of AI-powered wealth management.
  </p>
  <div style="background:#141b2d;padding:20px;border-radius:12px;margin:30px 0;border:1px solid rgba(255,255,255,.04);">
    <h3 style="margin-top:0;color:#2D6BFF;font-size:16px;">Get Started:</h3>
    <ul style="color:#a7b1c8;padding-left:20px;line-height:2;">
      <li>Deposit funds via our secure crypto gateway.</li>
      <li>Select an AI-managed investment plan.</li>
      <li>Watch your portfolio grow in real-time.</li>
    </ul>
  </div>
  <div style="text-align:center;margin:30px 0;">
    <a href="https://nexusfinpro.com/dashboard" style="background:#2D6BFF;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block;">Open Dashboard</a>
  </div>
  <p style="color:#a7b1c8;font-size:13px;">If you have questions, our AI Support is available 24/7 inside your dashboard.</p>
  <hr style="border:0;border-top:1px solid rgba(255,255,255,.06);margin:30px 0;"/>
  <p style="text-align:center;color:#5a6578;font-size:11px;">&copy; ${new Date().getFullYear()} NexusFinPro. All rights reserved.</p>
</div>`;
}

function notificationEmailHtml(name, title, message, label1, value1, label2, value2) {
  return `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#070a12;color:#f4f6ff;padding:40px;border:1px solid rgba(45,107,255,.2);border-radius:20px;">
  <div style="text-align:center;margin-bottom:30px;">
    <h2 style="color:#2D6BFF;margin:0;">${title}</h2>
  </div>
  <p style="color:#a7b1c8;line-height:1.7;font-size:15px;">Hello ${name}, ${message}</p>
  <div style="background:#141b2d;padding:20px;border-radius:12px;margin:30px 0;border:1px solid rgba(255,255,255,.04);">
    <table style="width:100%;color:#f4f6ff;">
      <tr>
        <td style="color:#5a6578;font-size:13px;padding-bottom:5px;">${label1}</td>
        <td style="color:#5a6578;font-size:13px;padding-bottom:5px;text-align:right;">${label2}</td>
      </tr>
      <tr>
        <td style="font-weight:bold;font-size:18px;">${value1}</td>
        <td style="font-weight:bold;font-size:18px;text-align:right;">${value2}</td>
      </tr>
    </table>
  </div>
  <div style="text-align:center;margin-top:30px;">
    <a href="https://nexusfinpro.com/dashboard" style="background:#2D6BFF;color:#fff;padding:12px 25px;border-radius:8px;text-decoration:none;font-weight:bold;">View Dashboard</a>
  </div>
  <hr style="border:0;border-top:1px solid rgba(255,255,255,.06);margin:30px 0;"/>
  <p style="text-align:center;color:#5a6578;font-size:11px;">This is an automated notification from NexusFinPro.</p>
</div>`;
}

// ─── API Routes ─────────────────────────────────────────────────────────────

app.post('/api/emails/send', async (req, res) => {
  try {
    const { type, payload } = req.body;
    let subject = "", html = "", from = "", to = payload.email || payload.toEmail;

    if (!to) {
      return res.status(400).json({ error: "Missing recipient email" });
    }

    switch (type) {
      case 'verification':
        from = "Security <security@nexusfinpro.com>";
        subject = "Verify your NexusFinPro Account";
        
        let link = payload.verificationLink;
        if (!link) {
           return res.status(400).json({ error: "Missing verificationLink" });
        }
        
        html = verificationEmailHtml(payload.name, link);
        break;

      case 'welcome':
        from = "Support <support@nexusfinpro.com>";
        subject = "Welcome to the Future of Investing | NexusFinPro";
        html = welcomeEmailHtml(payload.name);
        break;

      case 'deposit_approved':
        from = "NexusFinPro <notifications@nexusfinpro.com>";
        subject = `Your deposit of ${payload.amount} has been confirmed`;
        html = notificationEmailHtml(
            payload.toName, 
            "Deposit Confirmed! ✅", 
            "your deposit has been reviewed and approved. Your available balance has been updated.",
            "Amount", String(payload.amount), "Currency", String(payload.currency)
        );
        break;

      case 'withdrawal_approved':
        from = "NexusFinPro <notifications@nexusfinpro.com>";
        subject = `Your withdrawal of ${payload.amount} is being processed`;
        html = notificationEmailHtml(
            payload.toName, 
            "Withdrawal Approved 💸", 
            "your withdrawal request has been approved and is being processed to your wallet.",
            "Amount", String(payload.amount), "Currency", String(payload.currency)
        );
        break;

      case 'investment_activated':
        from = "NexusFinPro <notifications@nexusfinpro.com>";
        subject = `Your ${payload.planName} investment is now active`;
        html = notificationEmailHtml(
            payload.toName, 
            "Investment Activated! 📈", 
            "your investment has been activated. Your AI portfolio is now working for you.",
            "Plan", String(payload.planName), "Daily Return", String(payload.dailyReturn)
        );
        break;

      default:
        return res.status(400).json({ error: "Invalid email type" });
    }

    const data = await resend.emails.send({
      from,
      to: [to],
      subject,
      html
    });

    res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`NexusFinPro Email Backend running on port ${port}`);
});
