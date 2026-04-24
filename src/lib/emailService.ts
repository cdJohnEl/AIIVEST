/**
 * emailService.ts
 * Centralized EmailJS helper for sending transactional emails from the browser.
 * 
 * FREE PLAN SETUP (only 2 templates needed):
 *    VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
 *    VITE_EMAILJS_PUBLIC_KEY=your_public_key
 *    VITE_EMAILJS_TEMPLATE_WELCOME=template_xxxxxxx        ← your "Welcome" template
 *    VITE_EMAILJS_TEMPLATE_NOTIFICATION=template_xxxxxxx   ← your "Order Confirmation" template (shared)
 */

import emailjs from '@emailjs/browser';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

const TEMPLATE_WELCOME       = import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME       || '';
const TEMPLATE_NOTIFICATION  = import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFICATION  || '';

export type EmailTemplate =
  | 'welcome'
  | 'deposit_approved'
  | 'withdrawal_approved'
  | 'investment_activated';

export interface EmailParams {
  to_name:  string;
  to_email: string;
  [key: string]: string | number;
}

/**
 * Maps each logical email type to the correct template ID and injects
 * generic label/value pairs so only 2 EmailJS templates are needed.
 */
function resolveTemplate(template: EmailTemplate, params: EmailParams): {
  templateId: string;
  payload: Record<string, unknown>;
} {
  if (template === 'welcome') {
    return { templateId: TEMPLATE_WELCOME, payload: { ...params } };
  }

  // All transactional emails share the generic "notification" template
  const base = { to_name: params.to_name, to_email: params.to_email };

  switch (template) {
    case 'deposit_approved':
      return {
        templateId: TEMPLATE_NOTIFICATION,
        payload: {
          ...base,
          email_subject: `Your deposit of ${params.amount} has been confirmed`,
          email_title:   'Deposit Confirmed! ✅',
          email_message: 'your deposit has been reviewed and approved. Your available balance has been updated.',
          label_1: 'Amount',    value_1: params.amount,
          label_2: 'Currency',  value_2: params.currency,
        },
      };

    case 'withdrawal_approved':
      return {
        templateId: TEMPLATE_NOTIFICATION,
        payload: {
          ...base,
          email_subject: `Your withdrawal of ${params.amount} is being processed`,
          email_title:   'Withdrawal Approved 💸',
          email_message: 'your withdrawal request has been approved and is being processed to your wallet.',
          label_1: 'Amount',    value_1: params.amount,
          label_2: 'Currency',  value_2: params.currency,
        },
      };

    case 'investment_activated':
      return {
        templateId: TEMPLATE_NOTIFICATION,
        payload: {
          ...base,
          email_subject: `Your ${params.plan_name} investment is now active`,
          email_title:   'Investment Activated! 📈',
          email_message: 'your investment has been activated. Your AI portfolio is now working for you.',
          label_1: 'Plan',         value_1: params.plan_name,
          label_2: 'Daily Return', value_2: params.daily_return,
        },
      };
  }
}

/**
 * Send a transactional email via EmailJS.
 * Silently no-ops if credentials are not configured.
 */
export async function sendEmail(
  template: EmailTemplate,
  params: EmailParams
): Promise<void> {
  const { templateId, payload } = resolveTemplate(template, params);

  if (!SERVICE_ID || !PUBLIC_KEY || !templateId) {
    console.warn(`[EmailService] Skipping — EmailJS not configured (template: "${template}")`);
    return;
  }

  try {
    await emailjs.send(SERVICE_ID, templateId, payload, PUBLIC_KEY);
    console.log(`[EmailService] ✉️ Sent "${template}" to ${params.to_email}`);
  } catch (error) {
    console.error(`[EmailService] Failed to send "${template}":`, error);
  }
}
