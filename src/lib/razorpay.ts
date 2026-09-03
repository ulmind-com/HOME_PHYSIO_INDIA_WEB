/**
 * Lazily loads the Razorpay checkout script.
 *
 * Returns `null` when the script can't load (offline, blocked, SSR) so callers
 * can keep the booking they just created and let the patient pay later from the
 * dashboard, rather than throwing away a confirmed server-side record.
 */
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
  handler: (res: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
};

type RazorpayCtor = new (options: RazorpayOptions) => { open: () => void };

const SRC = "https://checkout.razorpay.com/v1/checkout.js";

let pending: Promise<RazorpayCtor | null> | null = null;

export function loadRazorpay(): Promise<RazorpayCtor | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const existing = (window as unknown as { Razorpay?: RazorpayCtor }).Razorpay;
  if (existing) return Promise.resolve(existing);

  if (!pending) {
    pending = new Promise<RazorpayCtor | null>((resolve) => {
      const script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      script.onload = () =>
        resolve((window as unknown as { Razorpay?: RazorpayCtor }).Razorpay ?? null);
      script.onerror = () => {
        pending = null;
        resolve(null);
      };
      document.head.appendChild(script);
    });
  }
  return pending;
}
