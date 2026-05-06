"use client";

import { useState, useEffect } from "react";
import { User, Mail, Calendar, CreditCard, LogOut, CheckCircle, XCircle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Profile {
  full_name: string;
  email: string;
  subscription_status: string;
  subscription_plan: string;
  trial_ends_at: string;
  subscription_ends_at: string;
  created_at: string;
}

const STATUS_CONFIG = {
  trial: { label: "Trial Active", color: "#f5a623", icon: Clock },
  active: { label: "Subscribed", color: "#2ed573", icon: CheckCircle },
  free: { label: "Free Plan", color: "#94a3b8", icon: XCircle },
  cancelled: { label: "Cancelled", color: "#ff4757", icon: XCircle },
  expired: { label: "Expired", color: "#ff4757", icon: XCircle },
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserEmail(user.email || "");
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    };
    load();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    // In a real app, call Razorpay API to cancel subscription
    alert("To cancel, please contact support or use the Razorpay customer portal.");
  };

  const status = profile?.subscription_status as keyof typeof STATUS_CONFIG || "free";
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.free;
  const StatusIcon = statusConfig.icon;

  const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 24, marginBottom: 32 }}>My Account</h1>

      {/* Profile card */}
      <div className="glow-card" style={{ padding: 28, borderRadius: 16, marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Profile</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={18} color="#000" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{profile?.full_name || "User"}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Member since {formatDate(profile?.created_at || "")}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
            <Mail size={16} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{userEmail}</span>
          </div>
        </div>
      </div>

      {/* Subscription card */}
      <div className="glow-card" style={{ padding: 28, borderRadius: 16, marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Subscription</h2>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <StatusIcon size={18} style={{ color: statusConfig.color }} />
            <span style={{ fontWeight: 600, color: statusConfig.color }}>{statusConfig.label}</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {status === "trial" ? `Plan: ₹99 trial` : status === "active" ? `Plan: ₹299/month` : "No active plan"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {status === "trial" && profile?.trial_ends_at && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.15)" }}>
              <Calendar size={14} style={{ color: "var(--accent-gold)" }} />
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Trial ends {formatDate(profile.trial_ends_at)} · Then ₹299/month</span>
            </div>
          )}
          {status === "active" && profile?.subscription_ends_at && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "rgba(46,213,115,0.05)", border: "1px solid rgba(46,213,115,0.15)" }}>
              <Calendar size={14} style={{ color: "var(--accent-green)" }} />
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Renews {formatDate(profile.subscription_ends_at)}</span>
            </div>
          )}
        </div>

        {(status === "trial" || status === "active") && (
          <button onClick={handleCancel} style={{ marginTop: 20, padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,71,87,0.3)", background: "rgba(255,71,87,0.05)", color: "#ff4757", fontSize: 13, cursor: "pointer" }}>
            Cancel Subscription
          </button>
        )}

        {(status === "free" || status === "expired" || status === "cancelled") && (
          <button onClick={() => router.push("/checkout")} className="btn-primary" style={{ marginTop: 20, padding: "10px 20px", borderRadius: 8, fontSize: 14, display: "flex", alignItems: "center", gap: 8, border: "none" }}>
            <CreditCard size={16} />
            Reactivate — ₹99/month
          </button>
        )}
      </div>

      {/* Logout */}
      <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 14, cursor: "pointer", width: "100%", justifyContent: "center" }}>
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
}
