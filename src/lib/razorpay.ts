import { httpsCallable } from "firebase/functions";
import { getFns } from "./firebase";

/** Public Razorpay test Key ID — safe to expose on the frontend. */
export const RAZORPAY_KEY_ID =
  (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) ?? "rzp_live_Sz3oJwyVmTx5y2";

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
}

export interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** Calls the `createRazorpayOrder` Firebase Function (server-side, uses Key Secret). */
export async function createRazorpayOrder(): Promise<RazorpayOrder> {
  const fn = httpsCallable<unknown, RazorpayOrder>(getFns(), "createRazorpayOrder");
  const { data } = await fn();
  return data;
}

/** Calls the `verifyRazorpayPayment` Firebase Function (server-side HMAC check). */
export async function verifyRazorpayPayment(
  payload: RazorpayHandlerResponse,
): Promise<{ success: boolean }> {
  const fn = httpsCallable<RazorpayHandlerResponse, { success: boolean }>(
    getFns(),
    "verifyRazorpayPayment",
  );
  const { data } = await fn(payload);
  return data;
}

/** Dynamically loads the Razorpay checkout script once. */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  theme?: { color?: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: { ondismiss?: () => void };
  prefill?: { name?: string; email?: string; contact?: string };
}

export interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
