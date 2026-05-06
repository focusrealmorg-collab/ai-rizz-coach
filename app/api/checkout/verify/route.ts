import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      userId,
    } = await req.json();

    // Verify Razorpay signature
    const body = razorpay_payment_id + "|" + razorpay_subscription_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Update user subscription status
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    await supabase.from("profiles").update({
      subscription_status: "trial",
      subscription_plan: "trial_99",
      razorpay_subscription_id,
      trial_started_at: new Date().toISOString(),
      trial_ends_at: trialEndsAt.toISOString(),
    }).eq("id", userId);

    // Record subscription payment
    await supabase.from("subscriptions").insert({
      user_id: userId,
      razorpay_subscription_id,
      razorpay_payment_id,
      plan_type: "trial_99",
      amount: 9900, // ₹99 in paise
      currency: "INR",
      status: "completed",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
