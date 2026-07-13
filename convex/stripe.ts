import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("Stripe secret key is not configured");
  return new Stripe(secretKey);
}

export const createCheckoutSession = action({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      qty: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    if (process.env.DISABLE_ORDERS === "true") {
      throw new Error("Orders are temporarily disabled. The store is under maintenance.");
    }
    const stripe = getStripe();
    const user = await ctx.runQuery(internal.users.currentForAction, {});
    const checkout = await ctx.runQuery(internal.products.getCheckoutItems, { items: args.items });
    const shippingAmount = checkout.total > 99 ? 0 : 9.99;
    const orderTotal = Number((checkout.total + shippingAmount).toFixed(2));
    const reservationExpiresAt = Date.now() + 31 * 60 * 1000;

    const orderId = await ctx.runMutation(internal.orders.placeOrderInternal, {
      userId: user.id,
      userName: user.name,
      items: checkout.lineItems,
      total: orderTotal,
      shippingAmount,
      reservationExpiresAt,
    });

    const lineItems = checkout.lineItems.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    const siteUrl = process.env.SITE_URL || "https://sportsfoliostore.com";

    let session: Stripe.Checkout.Session | undefined;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        shipping_address_collection: { allowed_countries: ["CA"] },
        shipping_options: [{
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: Math.round(shippingAmount * 100), currency: "usd" },
            display_name: shippingAmount === 0 ? "Free Canada delivery" : "Canada delivery",
          },
        }],
        expires_at: Math.floor(reservationExpiresAt / 1000),
        success_url: `${siteUrl}/?order=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/?page=cart`,
        metadata: { orderId: orderId.toString() },
      });

      await ctx.runMutation(internal.orders.setStripeSession, {
        orderId,
        stripeSessionId: session.id,
      });
      return { url: session.url };
    } catch (error) {
      if (session) {
        try { await stripe.checkout.sessions.expire(session.id); } catch { /* Session may already be closed. */ }
      }
      await ctx.runMutation(internal.orders.releaseCheckoutReservation, { orderId });
      throw error;
    }
  },
});
