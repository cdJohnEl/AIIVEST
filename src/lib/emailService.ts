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
 */
export async function sendEmail(
  template: EmailTemplate,
  params: EmailParams
): Promise<void> {
  const { templateId, payload } = resolveTemplate(template, params);

  // Debug check for local environment
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  if (!SERVICE_ID || !PUBLIC_KEY || !templateId) {
    const errorMsg = `[EmailService] ⚠️ Configuration Missing: ${!SERVICE_ID ? 'Service ID ' : ''}${!PUBLIC_KEY ? 'Public Key ' : ''}${!templateId ? 'Template ID ' : ''}`;
    console.warn(errorMsg);
    if (isLocal) alert(errorMsg + "\n\nEnsure your .env file is correct and you have RESTARTED the terminal (npm run dev).");
    return;
  }

  try {
    // Standard init + send pattern
    emailjs.init(PUBLIC_KEY);
    const response = await emailjs.send(SERVICE_ID, templateId, payload);
    
    console.log(`[EmailService] ✅ SUCCESS! Sent "${template}"`, response.status, response.text);
    
    if (isLocal) {
        console.info("%cEmail successfully sent! Check your inbox/spam.", "color: #10B981; font-weight: bold;");
    }
  } catch (error: any) {
    const errorDetail = error?.text || error?.message || JSON.stringify(error);
    console.error(`[EmailService] ❌ FAILED to send "${template}":`, errorDetail);
    
    if (isLocal) {
      alert(`EmailJS Error: ${errorDetail}\n\nCheck your EmailJS dashboard to ensure this Service/Template/Key is active.`);
    }
  }
}
