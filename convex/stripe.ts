import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createCheckoutSession = action({
  args: {
    userId: v.id("users"),
    userName: v.string(),
    items: v.array(v.object({
      productId: v.number(),
      name: v.string(),
      price: v.number(),
      qty: v.number(),
    })),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.runMutation(internal.orders.placeOrderInternal, {
      userId: args.userId,
      userName: args.userName,
      items: args.items,
      total: args.total,
    });

    const lineItems = args.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const siteUrl = process.env.SITE_URL || "https://flexible-bulldog-411.convex.cloud";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${siteUrl}/?order=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?page=cart`,
      metadata: { orderId: orderId.toString() },
    });

    await ctx.runMutation(internal.orders.setStripeSession, {
      orderId,
      stripeSessionId: session.id,
    });

    return { url: session.url };
  },
});
