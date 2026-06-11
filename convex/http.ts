import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
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

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
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
