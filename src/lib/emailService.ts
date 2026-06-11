/**
 * emailService.ts
 * Forwards email requests to the standalone Node.js Email Backend.
 * Kept free of HTML templates and API keys to ensure maximum security.
 */

// If deploying to a different domain, replace localhost with the VPS IP/domain
const rawUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const BACKEND_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

async function postOnce(type: string, payload: any): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Backend Error ${res.status}: ${errText}`);
  }
}

async function sendToBackend(type: string, payload: any): Promise<void> {
  const recipient = payload?.email || payload?.toEmail || 'unknown';
  try {
    await postOnce(type, payload);
    console.log(`[EmailService] ✅ '${type}' email dispatched to backend for ${recipient}.`);
  } catch (firstError: any) {
    console.warn(`[EmailService] ⚠️ First attempt failed for '${type}' -> ${recipient}: ${firstError?.message}. Retrying in 1.5s...`);
    await new Promise(r => setTimeout(r, 1500));
    try {
      await postOnce(type, payload);
      console.log(`[EmailService] ✅ '${type}' email dispatched to backend for ${recipient} (after retry).`);
    } catch (secondError: any) {
      console.error(`[EmailService] ❌ Failed to dispatch '${type}' email to ${recipient} after retry:`, secondError?.message);
      throw new Error(`Email dispatch failed: ${secondError?.message || 'unknown error'}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════

export async function sendVerificationEmail(
  name: string,
  email: string,
  verificationLink: string
): Promise<void> {
  await sendToBackend("verification", { name, email, verificationLink });
}

export async function sendWelcomeEmail(
  name: string,
  email: string
): Promise<void> {
  await sendToBackend("welcome", { name, email });
}

export type NotificationEmailType = "deposit_approved" | "withdrawal_approved" | "investment_activated";

export interface NotificationEmailParams {
  toEmail: string;
  toName: string;
  emailType: NotificationEmailType;
  amount?: string | number;
  currency?: string;
  planName?: string;
  dailyReturn?: string | number;
}

export async function sendNotificationEmail(params: NotificationEmailParams): Promise<void> {
  await sendToBackend(params.emailType, params);
}

/**
 * Resend verification email (for manual retry by user)
 * Same as sendVerificationEmail but with clearer naming for UI purposes
 */
export async function resendVerificationEmail(
  name: string,
  email: string,
  verificationLink: string
): Promise<void> {
  await sendToBackend("verification", { name, email, verificationLink });
}
