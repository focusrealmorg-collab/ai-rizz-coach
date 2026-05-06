"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flame, Check, Shield, Zap, ArrowRight, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

interface RazorpayOptions {
  key: string;
  subscription_id?: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: { razorpay_payment_id: string; razorpay_subscription_id: string; razorpay_signature: string }) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

const FEATURES = [
  "Unlimited AI coaching conversations",
  "Profile bio analysis & rewrite",
  "Reply drafting with multiple options",
  "Conversation pattern analysis",
  "Psychology-backed dating strategies",
  "Priority AI responses (< 2 seconds)",
];

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);
    };
    getUser();

    // Load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [router]);

  const handlePayment = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        subscription_id: data.subscriptionId,
        name: "RizzCoach AI",
        description: "1-Month Trial — ₹99",
        handler: async (response) => {
          // Verify payment on backend
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, userId: user.id }),
          });
          if (verifyRes.ok) {
            router.push("/dashboard?welcome=true");
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
        },
        theme: { color: "#f5a623" },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 500, background: "radial-gradient(ellipse, rgba(245,166,35,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Flame size={26} color="#000" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Activate Your Wingman</h1>
          <p style={{ color: "var(--text-secondary)" }}>One payment. Instant access. Cancel anytime.</p>
        </div>

        <div className="glow-card" style={{ padding: 32, borderRadius: 20, border: "1px solid rgba(245,166,35,0.3)", boxShadow: "0 0 40px rgba(245,166,35,0.08)" }}>
          {/* Price display */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: "1px solid var(--border)", marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17 }}>Trial Month</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>Then ₹299/month — cancel anytime</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28 }} className="gradient-text">₹99</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>first month</div>
            </div>
          </div>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(46,213,115,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={12} style={{ color: "var(--accent-green)" }} />
                </div>
                <span style={{ color: "var(--text-secondary)" }}>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !user}
            className="btn-primary"
            style={{ width: "100%", padding: "15px", borderRadius: 12, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <span>Opening checkout...</span>
            ) : (
              <>
                <Zap size={18} />
                Pay ₹99 & Get Instant Access
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
              <Shield size={14} style={{ color: "var(--accent-green)" }} />
              Secured by Razorpay
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
              <Lock size={14} style={{ color: "var(--accent-green)" }} />
              256-bit SSL Encryption
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
          After your 30-day trial, billing automatically continues at ₹299/month.
          Cancel any time from your dashboard — no questions asked.
        </p>
      </div>
    </div>
  );
}
