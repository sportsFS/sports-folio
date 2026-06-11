import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Stripe secret key is not configured");
  return new Stripe(secretKey);
}

const http = httpRouter();

http.route({
  path: "/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const stripe = getStripe();
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }

    const body = await request.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response("Stripe webhook secret is not configured", { status: 500 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      return new Response(
        `Webhook signature verification failed: ${(err as Error).message}`,
        { status: 400 }
      );
    }

    const session = event.type === "checkout.session.completed"
      ? (event.data.object as Stripe.Checkout.Session)
      : null;

    const result = await ctx.runMutation(internal.orders.processStripeEvent, {
      eventId: event.id,
      orderId: session?.metadata?.orderId || undefined,
      paymentIntent: (session?.payment_intent as string) || undefined,
    });

    if (!result.processed) {
      return new Response("Already processed", { status: 200 });
    }

    return new Response("OK", { status: 200 });
  }),
});

export default http;
