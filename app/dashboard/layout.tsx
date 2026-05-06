"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Flame, MessageSquare, User, LogOut, Menu, X, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
      else setUser(user);
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    { href: "/dashboard", icon: MessageSquare, label: "Coach Chat" },
    { href: "/dashboard/profile", icon: User, label: "My Profile" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: mobileOpen ? 0 : "-240px",
        bottom: 0,
        zIndex: 50,
        transition: "left 0.3s",
      }}
        className="md-sidebar"
      >
        <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Flame size={17} color="#000" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16 }}>RizzCoach</span>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--accent-gold)" : "var(--text-secondary)",
                  background: active ? "rgba(245,166,35,0.1)" : "transparent",
                  transition: "all 0.2s",
                }}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.user_metadata?.full_name || user.email}
            </div>
            <button
              onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
        />
      )}

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 240, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Mobile header */}
        <div style={{ display: "none", padding: "14px 20px", borderBottom: "1px solid var(--border)", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "var(--bg-secondary)", zIndex: 30 }} className="mobile-header">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Flame size={14} color="#000" />
            </div>
            <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16 }}>RizzCoach</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)" }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <main style={{ flex: 1, overflow: "hidden" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .md-sidebar { left: -240px !important; }
          .md-sidebar.open { left: 0 !important; }
          .mobile-header { display: flex !important; }
          div[style*="marginLeft: 240"] { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
