import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

// Disable body parsing for raw signature verification
export const runtime = "nodejs";

async function getRawBody(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) return Buffer.from("");
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers.get("x-razorpay-signature") || "";

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody.toString());
    const event = payload.event;
    const entity = payload.payload?.subscription?.entity || payload.payload?.payment?.entity;

    console.log("Razorpay webhook:", event);

    const supabase = await createServiceClient();

    switch (event) {
      case "subscription.activated": {
        // Trial subscription activated — already handled by verify endpoint
        const subscriptionId = entity.id;
        const notes = entity.notes || {};
        const userId = notes.user_id;

        if (userId) {
          await supabase.from("profiles").update({
            subscription_status: "trial",
            razorpay_subscription_id: subscriptionId,
          }).eq("id", userId);
        }
        break;
      }

      case "subscription.charged": {
        // Recurring charge — payment collected
        const subscriptionId = entity.id;
        const paymentId = payload.payload?.payment?.entity?.id;
        const amount = payload.payload?.payment?.entity?.amount;
        const notes = entity.notes || {};
        const userId = notes.user_id;

        if (userId) {
          // Check if this is the second charge (transition from trial to monthly)
          const { data: profile } = await supabase
            .from("profiles")
            .select("subscription_plan, subscription_status")
            .eq("id", userId)
            .single();

          const newPlan = profile?.subscription_plan === "trial_99" ? "monthly_299" : profile?.subscription_plan;
          const subscriptionEndsAt = new Date();
          subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + 1);

          await supabase.from("profiles").update({
            subscription_status: "active",
            subscription_plan: newPlan,
            subscription_started_at: new Date().toISOString(),
            subscription_ends_at: subscriptionEndsAt.toISOString(),
          }).eq("id", userId);

          // Record payment
          await supabase.from("subscriptions").insert({
            user_id: userId,
            razorpay_subscription_id: subscriptionId,
            razorpay_payment_id: paymentId,
            plan_type: newPlan || "monthly_299",
            amount: amount || 29900,
            currency: "INR",
            status: "completed",
          });
        }
        break;
      }

      case "subscription.cancelled":
      case "subscription.completed": {
        const subscriptionId = entity.id;

        // Find user by subscription ID
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("razorpay_subscription_id", subscriptionId)
          .single();

        if (profile) {
          await supabase.from("profiles").update({
            subscription_status: event === "subscription.cancelled" ? "cancelled" : "expired",
          }).eq("id", profile.id);
        }
        break;
      }

      case "payment.failed": {
        const subscriptionId = entity.subscription_id;
        if (subscriptionId) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("razorpay_subscription_id", subscriptionId)
            .single();

          if (profile) {
            await supabase.from("profiles").update({
              subscription_status: "expired",
            }).eq("id", profile.id);
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
