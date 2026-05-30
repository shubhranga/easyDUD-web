import emailjs from "@emailjs/browser";

/**
 * EmailJS credentials are read from VITE_* env vars so they can be set
 * later without changing code. Until they're configured, the function
 * resolves silently with `{ skipped: true }` so the form still works.
 *
 * Set in your environment:
 *   VITE_EMAILJS_SERVICE_ID
 *   VITE_EMAILJS_TEMPLATE_ID
 *   VITE_EMAILJS_PUBLIC_KEY
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export async function sendAckEmail(toEmail: string, name: string) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn(
      "[sendAckEmail] EmailJS credentials missing — acknowledgment email skipped.",
    );
    return { skipped: true as const };
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { to_email: toEmail, to_name: name },
    { publicKey: PUBLIC_KEY },
  );
  return { skipped: false as const };
}
