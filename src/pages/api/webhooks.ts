import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";

import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = { api: { bodyParser: false } };

const relevantEvents = new Set([
  "checkout.session.completed",
  "checkout.subscription.updated",
  "checkout.subscription.deleted",
]);

export default async function webhooks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method not allowed");
  }

  const buf = await buffer(req);
  const secret = req.headers["stripe-signature"];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      secret,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send("Webhook error > " + error.message);
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "checkout.subscription.updated":
        case "checkout.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          await saveSubscription(
            subscription.id,
            subscription.customer.toString(),
            false
          );
          break;
        }
        case "checkout.session.completed": {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          await saveSubscription(
            checkoutSession.subscription.toString(),
            checkoutSession.customer.toString(),
            true
          );
          break;
        }
        default:
          break;
      }
    } catch (error) {
      res.json({ error: "Webhook handler failed" });
    }
  }

  res.json({ received: true });
}
