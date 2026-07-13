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

    if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.expired") {
      return new Response("Ignored", { status: 200 });
    }
    const eventType = event.type as "checkout.session.completed" | "checkout.session.expired";
    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed" && session?.payment_status !== "paid") {
      return new Response("Payment not completed", { status: 200 });
    }

    const shipping = session.collected_information?.shipping_details ?? (session as any).shipping_details;
    const address = shipping?.address;
    const shippingAddress = shipping?.name && address?.line1 && address.country === "CA" ? {
      name: shipping.name,
      line1: address.line1,
      ...(address.line2 ? { line2: address.line2 } : {}),
      ...(address.city ? { city: address.city } : {}),
      ...(address.state ? { state: address.state } : {}),
      ...(address.postal_code ? { postalCode: address.postal_code } : {}),
      country: address.country,
    } : undefined;

    const result = await ctx.runMutation(internal.orders.processStripeEvent, {
      eventId: event.id,
      eventType,
      orderId: session?.metadata?.orderId || undefined,
      paymentIntent: (session?.payment_intent as string) || undefined,
      shippingAddress,
    });

    if (!result.processed) {
      return new Response("Already processed", { status: 200 });
    }

    return new Response("OK", { status: 200 });
  }),
});

export default http;
