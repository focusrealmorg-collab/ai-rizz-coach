"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Zap,
  Shield,
  TrendingUp,
  Star,
  ChevronRight,
  Flame,
  Brain,
  Heart,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const DEMO_MESSAGES = [
  { role: "user", content: "She hasn't replied in 2 days. Should I double text?" },
  { role: "ai", content: "Wait 3 more days. When you do text, don't reference the silence — that's needy. Instead, send something with energy: a funny observation or an invite to something specific. You want her to feel like she missed out, not like you're chasing." },
  { role: "user", content: "Ok she just replied 'haha yeah lol'. How do I keep it going?" },
  { role: "ai", content: "\"haha yeah lol\" is low effort — she's testing if you'll carry the conversation. Don't reward that. Reply with something that flips the dynamic:\n\n\"that's the most commitment I've ever gotten from someone 😂 friday plans or nah?\"\n\nShort, playful, and moves toward something real." },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Profile Optimizer",
    description: "Paste your bio, upload photos, get a brutal honest audit + rewrite that actually gets matches.",
    tag: "Instant Analysis",
  },
  {
    icon: MessageSquare,
    title: "Rizz Chat Coach",
    description: "Real-time coaching on any conversation. Know exactly what to say, when to say it, and how to say it.",
    tag: "Live Guidance",
  },
  {
    icon: Zap,
    title: "Reply Drafter",
    description: "Screenshot their message, get 3 crafted reply options with explanations. Never overthink again.",
    tag: "AI Powered",
  },
];

const TESTIMONIALS = [
  { name: "Arjun K.", age: 26, text: "Went from 0 matches to 3 dates in my first week. The bio rewrite was insane.", city: "Mumbai" },
  { name: "Dev M.", age: 24, text: "I sent a reply it suggested word for word. She said it was the smoothest opener she'd ever gotten.", city: "Bangalore" },
  { name: "Rahul S.", age: 29, text: "The conversation coaching is on another level. It caught patterns I didn't even know I had.", city: "Delhi" },
];

const PLANS = [
  {
    name: "Trial",
    price: "₹99",
    period: "first month",
    highlight: "Start here",
    color: "#f5a623",
    features: [
      "Unlimited AI coaching chats",
      "Profile bio analysis & rewrite",
      "Reply drafting (unlimited)",
      "Conversation pattern analysis",
      "Priority AI responses",
    ],
    cta: "Get Started for ₹99",
    trial: true,
  },
  {
    name: "Monthly",
    price: "₹299",
    period: "per month",
    highlight: "After trial",
    color: "#94a3b8",
    features: [
      "Everything in Trial",
      "Advanced psychological frameworks",
      "Weekly strategy sessions",
      "Success tracking dashboard",
      "Cancel anytime",
    ],
    cta: "Continue Monthly",
    trial: false,
  },
];

function AnimatedDemo() {
  const [visible, setVisible] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (visible >= DEMO_MESSAGES.length) return;
    const delay = visible === 0 ? 800 : 1800;
    const t = setTimeout(() => {
      if (DEMO_MESSAGES[visible].role === "ai") {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setVisible((v) => v + 1);
        }, 1200);
      } else {
        setVisible((v) => v + 1);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Chat header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={18} color="#000" />
          </div>
          <div>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14 }}>RizzCoach AI</div>
            <div style={{ fontSize: 12, color: "var(--accent-green)", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", display: "inline-block" }} />
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ padding: "20px 16px", minHeight: 280, display: "flex", flexDirection: "column", gap: 12 }}>
          {DEMO_MESSAGES.slice(0, visible).map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div
                className={msg.role === "user" ? "bubble-user" : "bubble-ai"}
                style={{ maxWidth: "80%", padding: "10px 14px", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-line" }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div className="bubble-ai" style={{ padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-muted)", display: "inline-block", animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(8,11,18,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={16} color="#000" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18 }}>RizzCoach<span className="gradient-text">AI</span></span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--border)", color: "var(--text-secondary)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            Login
          </Link>
          <Link href="/signup" className="btn-primary" style={{ padding: "8px 20px", borderRadius: 8, textDecoration: "none", fontSize: 14 }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 60px", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(245,166,35,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, border: "1px solid rgba(245,166,35,0.3)", background: "rgba(245,166,35,0.05)", marginBottom: 24, fontSize: 13, color: "var(--accent-gold)" }}>
              <Sparkles size={14} />
              <span>AI-Powered Dating Intelligence</span>
            </div>

            <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
              Stop getting<br />
              <span className="gradient-text">left on read.</span><br />
              Get your AI<br />Wingman.
            </h1>

            <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
              Your dating life is stuck because you don't know what to say, when to say it, or why it's not working. RizzCoach fixes all three — instantly.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/signup" className="btn-primary" style={{ padding: "14px 28px", borderRadius: 12, textDecoration: "none", fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                Start for ₹99 <ArrowRight size={18} />
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: 14 }}>
                <Shield size={16} style={{ color: "var(--accent-green)" }} />
                Cancel anytime. No BS.
              </div>
            </div>

            <div style={{ marginTop: 40, display: "flex", gap: 32 }}>
              {[["2,400+", "Users coached"], ["94%", "Got more replies"], ["4.9★", "Average rating"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 22, color: "var(--accent-gold)" }}>{num}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-float">
            <AnimatedDemo />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 24px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 16 }}>
              Three tools. <span className="gradient-text">Unlimited game.</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 18, maxWidth: 500, margin: "0 auto" }}>
              Everything you need to go from confused to confident — in one dashboard.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="glow-card" style={{ padding: 32, borderRadius: 16, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 20, right: 20, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100, background: "rgba(245,166,35,0.1)", color: "var(--accent-gold)", border: "1px solid rgba(245,166,35,0.2)" }}>
                  {f.tag}
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, rgba(245,166,35,0.15), rgba(255,107,53,0.15))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, border: "1px solid rgba(245,166,35,0.2)" }}>
                  <f.icon size={24} style={{ color: "var(--accent-gold)" }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 15 }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 60 }}>
            Real guys. <span className="gradient-text">Real results.</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glow-card" style={{ padding: 28, borderRadius: 16 }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#f5a623" style={{ color: "#f5a623" }} />)}
                </div>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20, fontSize: 15 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `hsl(${i * 60 + 20}, 70%, 40%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne", fontWeight: 700, fontSize: 14 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}, {t.age}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 24px", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: 16 }}>
            Simple pricing. <span className="gradient-text">Serious results.</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 60, fontSize: 17 }}>
            Start with ₹99 — less than a coffee. Continue at ₹299/month after your trial.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {PLANS.map((plan, i) => (
              <div key={i} className="glow-card" style={{ padding: 32, borderRadius: 20, position: "relative", border: plan.trial ? "1px solid rgba(245,166,35,0.4)" : "1px solid var(--border)", boxShadow: plan.trial ? "0 0 40px rgba(245,166,35,0.1)" : "none" }}>
                {plan.trial && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #f5a623, #ff6b35)", color: "#000", padding: "4px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700, fontFamily: "Syne", whiteSpace: "nowrap" }}>
                    🔥 Most Popular
                  </div>
                )}
                <div style={{ marginBottom: 8, fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{plan.highlight}</div>
                <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 42, marginBottom: 4 }}>{plan.price}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>{plan.period}</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, textAlign: "left" }}>
                  {plan.features.map((feat, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                      <Check size={16} style={{ color: "var(--accent-green)", flexShrink: 0 }} />
                      <span style={{ color: "var(--text-secondary)" }}>{feat}</span>
                    </div>
                  ))}
                </div>

                {plan.trial ? (
                  <Link href="/signup" className="btn-primary" style={{ display: "block", padding: "12px 24px", borderRadius: 10, textDecoration: "none", textAlign: "center", fontSize: 15 }}>
                    {plan.cta}
                  </Link>
                ) : (
                  <div style={{ padding: "12px 24px", borderRadius: 10, border: "1px solid var(--border)", textAlign: "center", fontSize: 15, color: "var(--text-muted)" }}>
                    Automatic after trial
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Heart size={28} color="#000" fill="#000" />
          </div>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: 16 }}>
            Your future self will<br /><span className="gradient-text">thank you for this.</span>
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
            Every day you wait is another day of unanswered messages, awkward silences, and missed connections. Get your wingman now.
          </p>
          <Link href="/signup" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", borderRadius: 14, textDecoration: "none", fontSize: 17 }}>
            Start for ₹99 Today <ChevronRight size={20} />
          </Link>
          <p style={{ marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>No commitment. Cancel before day 30 and pay nothing more.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={12} color="#000" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14 }}>RizzCoach AI</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          © 2025 RizzCoach AI. All rights reserved. | <Link href="/privacy" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy</Link> | <Link href="/terms" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Terms</Link>
        </div>
      </footer>
    </div>
  );
}
