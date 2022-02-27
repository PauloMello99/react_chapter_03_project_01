import { loadStripe } from "@stripe/stripe-js";

export const getStripeJS = async () =>
  loadStripe(String(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY));
