/**
 * emailService.ts
 * Forwards email requests to the standalone Node.js Email Backend.
 * Kept free of HTML templates and API keys to ensure maximum security.
 */

// If deploying to a different domain, replace localhost with the VPS IP/domain
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

async function sendToBackend(type: string, payload: any): Promise<void> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Backend Error ${res.status}: ${errText}`);
    }

    console.log(`[EmailService] ✅ '${type}' email dispatched to backend.`);
  } catch (error: any) {
    console.error(`[EmailService] ❌ Failed to dispatch '${type}' email:`, error.message);
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
