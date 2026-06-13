import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as crypto from "node:crypto";
import { defineString } from "firebase-functions/params";

/**
 * Public Razorpay test Key ID — safe to keep in source.
 * The Key Secret is configured via Firebase params
 */
const RAZORPAY_KEY_ID = defineString("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineString("RAZORPAY_KEY_SECRET");
const BASIC_PLAN_AMOUNT_PAISE = 999900; // ₹9,999

interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}

/**
 * createRazorpayOrder
 * Creates a Razorpay order server-side and returns the id/amount/currency.
 */
export const createRazorpayOrder = onCall(async (request: any) => {
  const secret = RAZORPAY_KEY_SECRET.value();
  const keyId = RAZORPAY_KEY_ID.value();
  if (!secret) {
    throw new HttpsError("failed-precondition", "Razorpay secret is not configured.");
  }

    const auth = Buffer.from(`${keyId}:${secret}`).toString("base64");

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: BASIC_PLAN_AMOUNT_PAISE,
        currency: "INR",
        receipt: `hotel_basic_${Date.now()}`,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new HttpsError("internal", `Razorpay order creation failed: ${text}`);
    }

    const order = (await res.json()) as RazorpayOrderResponse;
    return { orderId: order.id, amount: order.amount, currency: order.currency };
  },
);

interface VerifyPayload {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

/**
 * verifyRazorpayPayment
 * Verifies the Razorpay signature using HMAC-SHA256(secret, order_id|payment_id).
 */
export const verifyRazorpayPayment = onCall(async (request: any) => {
  const secret = RAZORPAY_KEY_SECRET.value();
  if (!secret) {
    throw new HttpsError("failed-precondition", "Razorpay secret is not configured.");
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    (request.data ?? {}) as VerifyPayload;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new HttpsError("invalid-argument", "Missing payment verification fields.");
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

    const expectedBuf = Buffer.from(expected, "utf8");
    const signatureBuf = Buffer.from(razorpay_signature, "utf8");

    const valid =
      expectedBuf.length === signatureBuf.length &&
      crypto.timingSafeEqual(expectedBuf, signatureBuf);

    if (!valid) {
      throw new HttpsError("permission-denied", "Invalid signature");
    }

    return { success: true };
  },
);
