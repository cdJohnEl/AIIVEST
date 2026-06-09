require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("Zoho SMTP Server is ready to take our messages");
  }
});

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

/**
 * Handle different email types and return standardized payload for SMTP dispatch
 */
function prepareEmail(type, payload) {
  let subject = "", html = "", from = '"NexusFinPro Support" <support@nexusfinpro.com>', to = payload.email || payload.toEmail;

  if (!to) throw new Error("Missing recipient email");

  switch (type) {
    case 'verification':
      subject = "Verify your NexusFinPro Account";
      if (!payload.verificationLink) throw new Error("Missing verificationLink");
      html = verificationEmailHtml(payload.name, payload.verificationLink);
      break;

    case 'welcome':
      subject = "Welcome to the Future of Investing | NexusFinPro";
      html = welcomeEmailHtml(payload.name);
      break;

    case 'deposit_approved':
      subject = `Your deposit of ${payload.amount} has been confirmed`;
      html = notificationEmailHtml(
          payload.toName, 
          "Deposit Confirmed! ✅", 
          "your deposit has been reviewed and approved. Your available balance has been updated.",
          "Amount", String(payload.amount), "Currency", String(payload.currency)
      );
      break;

    case 'withdrawal_approved':
      subject = `Your withdrawal of ${payload.amount} is being processed`;
      html = notificationEmailHtml(
          payload.toName, 
          "Withdrawal Approved 💸", 
          "your withdrawal request has been approved and is being processed to your wallet.",
          "Amount", String(payload.amount), "Currency", String(payload.currency)
      );
      break;

    case 'investment_activated':
      subject = `Your ${payload.planName} investment is now active`;
      html = notificationEmailHtml(
          payload.toName, 
          "Investment Activated! 📈", 
          "your investment has been activated. Your AI portfolio is now working for you.",
          "Plan", String(payload.planName), "Daily Return", String(payload.dailyReturn)
      );
      break;

    default:
      throw new Error("Invalid email type");
  }

  return { from, to, subject, html };
}

// Re-using the same logic for both endpoints to ensure consistency
async function handleEmailRequest(req, res) {
  try {
    const { type, payload } = req.body;
    const emailData = prepareEmail(type, payload);

    const info = await transporter.sendMail({
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html
    });

    console.log("Email sent successfully: %s", info.messageId);
    res.status(200).json({ success: true, id: info.messageId });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(error.message.includes("recipient") || error.message.includes("type") ? 400 : 500)
       .json({ error: error.message });
  }
}

app.post('/api/emails/send', handleEmailRequest);
app.post('/api/send-email', handleEmailRequest);

// ─── ADMIN AUTH MIDDLEWARE ──────────────────────────────────────────────────

async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ error: 'Missing bearer token' });

    const decoded = await admin.auth().verifyIdToken(match[1]);
    const userSnap = await db.collection('users').doc(decoded.uid).get();
    if (!userSnap.exists || userSnap.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    req.adminUid = decoded.uid;
    next();
  } catch (err) {
    console.error('requireAdmin error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ─── ADMIN: CREATE USER ─────────────────────────────────────────────────────

function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'NEXUS-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

app.post('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'name, email, and role are required' });
    }

    // Random throwaway password — the user resets via the email link below.
    const tempPassword = require('crypto').randomBytes(24).toString('base64');
    const userRecord = await admin.auth().createUser({
      email: email.trim().toLowerCase(),
      displayName: name,
      password: tempPassword,
      emailVerified: false,
    });

    const referralCode = generateReferralCode();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

    await Promise.all([
      db.collection('users').doc(userRecord.uid).set({
        name,
        email: email.trim().toLowerCase(),
        avatar,
        role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        referralCode,
        referredBy: '',
        isVerified: true, // admin-created accounts skip email verification
        createdByAdmin: req.adminUid,
      }),
      db.collection('portfolios').doc(userRecord.uid).set({
        totalInvested: 0,
        totalReturns: 0,
        dailyReturns: 0,
        activeInvestments: 0,
        availableBalance: 0,
      }),
      db.collection('referralCodes').doc(referralCode).set({
        ownerUid: userRecord.uid,
        ownerName: name,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    ]);

    // Send password setup link via existing SMTP transporter.
    const resetLink = await admin.auth().generatePasswordResetLink(email);
    try {
      await transporter.sendMail({
        from: `"NexusFinPro" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Set your NexusFinPro password',
        html: `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#070a12;color:#f4f6ff;padding:40px;border-radius:20px;">
  <h1 style="margin:0 0 20px;font-size:24px;"><span style="color:#2D6BFF;">Nexus</span>FinPro</h1>
  <p>Hi ${name},</p>
  <p>An administrator created a NexusFinPro account for you. Click the button below to set your password and log in.</p>
  <p style="text-align:center;margin:30px 0;">
    <a href="${resetLink}" style="background:#2D6BFF;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;">Set My Password</a>
  </p>
  <p style="font-size:11px;color:#5a6578;word-break:break-all;">${resetLink}</p>
</div>`,
      });
    } catch (mailErr) {
      console.error('Admin-create welcome email failed:', mailErr);
      // Don't fail the request — user exists, admin can resend manually.
    }

    res.status(201).json({ uid: userRecord.uid, email: userRecord.email, role });
  } catch (err) {
    console.error('Admin createUser error:', err);
    const status = err.code === 'auth/email-already-exists' ? 409 : 500;
    res.status(status).json({ error: err.message });
  }
});

// ─── ADMIN: DELETE USER (cascade) ───────────────────────────────────────────

async function deleteCollection(query) {
  const snap = await query.get();
  if (snap.empty) return;
  const batch = db.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();
}

app.delete('/api/admin/users/:uid', requireAdmin, async (req, res) => {
  const { uid } = req.params;
  if (!uid) return res.status(400).json({ error: 'uid required' });
  if (uid === req.adminUid) {
    return res.status(400).json({ error: 'Cannot delete your own admin account' });
  }

  try {
    // Look up the user's referral code so we can clear the public lookup doc.
    const userSnap = await db.collection('users').doc(uid).get();
    const referralCode = userSnap.exists ? userSnap.data().referralCode : null;
    const referredBy = userSnap.exists ? userSnap.data().referredBy : null;

    await Promise.all([
      // Auth account
      admin.auth().deleteUser(uid).catch(e => {
        if (e.code !== 'auth/user-not-found') throw e;
      }),
      // User profile + portfolio
      db.collection('users').doc(uid).delete(),
      db.collection('portfolios').doc(uid).delete(),
      // Owned investments and transactions
      deleteCollection(db.collection('investments').where('userId', '==', uid)),
      deleteCollection(db.collection('transactions').where('userId', '==', uid)),
      // Public referral code lookup
      referralCode
        ? db.collection('referralCodes').doc(referralCode).delete().catch(() => {})
        : Promise.resolve(),
      // Their downline subcollection (where they are the referrer)
      deleteCollection(db.collection('referrals').doc(uid).collection('list')),
      // Their entry in their own referrer's downline (where they are the referee)
      referredBy
        ? db.collection('referrals').doc(referredBy).collection('list').doc(uid).delete().catch(() => {})
        : Promise.resolve(),
    ]);

    res.status(200).json({ ok: true, deleted: uid });
  } catch (err) {
    console.error('Admin deleteUser error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`NexusFinPro Email Backend running on port ${port}`);
});

// ─── ROI ENGINE ─────────────────────────────────────────────────────────────

/**
 * Accumulates ROI for all active investments.
 * Runs in the background independently of the email system.
 */
async function accumulateROI() {
  console.log(`[ROI Engine] Starting accumulation cycle: ${new Date().toISOString()}`);
  
  try {
    const investmentsSnapshot = await db.collection('investments')
      .where('status', '==', 'active')
      .get();

    if (investmentsSnapshot.empty) {
      console.log('[ROI Engine] No active investments found.');
      return;
    }

    let updatedCount = 0;

    for (const invDoc of investmentsSnapshot.docs) {
      const invData = invDoc.data();
      const userId = invData.userId;
      
      // Calculate ROI increment
      const roiIncrement = invData.dailyReturn / 144;
      if (roiIncrement <= 0) continue;

      try {
        // Fetch user data to check for referrer
        const userSnap = await db.collection('users').doc(userId).get();
        const userData = userSnap.exists ? userSnap.data() : null;
        const referredBy = userData ? userData.referredBy : null;

        await db.runTransaction(async (transaction) => {
          // 1. Update Investor's Investment
          transaction.update(invDoc.ref, {
            totalReturn: admin.firestore.FieldValue.increment(roiIncrement),
            lastAccumulation: admin.firestore.Timestamp.now()
          });

          // 2. Update Investor's Portfolio
          const portfolioRef = db.collection('portfolios').doc(userId);
          transaction.update(portfolioRef, {
            totalReturns: admin.firestore.FieldValue.increment(roiIncrement),
            availableBalance: admin.firestore.FieldValue.increment(roiIncrement)
          });

          // 3. Handle Referral Commission (Dynamic Tiers)
          if (referredBy) {
            const referrerPortfolioRef = db.collection('portfolios').doc(referredBy);
            const referrerPortSnap = await transaction.get(referrerPortfolioRef);

            if (referrerPortSnap.exists) {
              const rCount = referrerPortSnap.data().referralCount || 0;
              
              // Tier-based logic: Starter (10%), Pro (20% for 11-50), Elite (30% for 51+)
              let commissionRate = 0.10;
              let tier = "Starter";
              if (rCount > 50) { commissionRate = 0.30; tier = "Elite"; }
              else if (rCount > 10) { commissionRate = 0.20; tier = "Pro"; }

              const commission = roiIncrement * commissionRate;

              transaction.update(referrerPortfolioRef, {
                availableBalance: admin.firestore.FieldValue.increment(commission),
                referralEarnings: admin.firestore.FieldValue.increment(commission)
              });

              // Log commission transaction
              const newTxRef = db.collection('transactions').doc();
              transaction.set(newTxRef, {
                userId: referredBy,
                userName: 'Referral System',
                type: 'referral_commission',
                amount: commission,
                currency: 'USD',
                status: 'confirmed',
                description: `[${tier}] Commission from ${invData.userName || 'Referral'}'s ROI`,
                createdAt: new Date().toISOString()
              });
            }
          }
        });
        
        updatedCount++;
      } catch (err) {
        console.error(`[ROI Engine] Failed to update ROI for investment ${invDoc.id}:`, err);
      }
    }

    console.log(`[ROI Engine] Successfully processed ROI for ${updatedCount} investments.`);
  } catch (error) {
    console.error('[ROI Engine] Critical Error in accumulation cycle:', error);
  }
}

// Run Every 10 Minutes
const ROI_INTERVAL_MS = 10 * 60 * 1000;
setInterval(accumulateROI, ROI_INTERVAL_MS);

// Run once on startup after 5 seconds to verify
setTimeout(accumulateROI, 5000);
