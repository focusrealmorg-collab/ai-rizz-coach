"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Sparkles, Brain, Zap, Flame, RotateCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

const STARTER_PROMPTS = [
  { icon: "💬", text: "She said 'lol ok' — what does this mean and how do I reply?" },
  { icon: "📝", text: "Rewrite my Hinge bio: [paste your current bio]" },
  { icon: "🧊", text: "Give me 3 openers for a girl who loves hiking and travel" },
  { icon: "📱", text: "She hasn't texted in 2 days. Should I reach out? How?" },
];

const MODES = [
  { id: "coach", label: "Coach Mode", icon: Brain },
  { id: "reply", label: "Reply Drafter", icon: Zap },
  { id: "profile", label: "Profile Audit", icon: Sparkles },
];

export default function DashboardContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("coach");
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get("welcome") === "true";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isWelcome && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "🔥 Welcome to RizzCoach AI — I'm your personal dating strategist.\n\nHere's what I can do for you:\n• **Draft killer replies** to any message she sends\n• **Audit your profile** and rewrite it to get more matches\n• **Coach your strategy** — when to text, how to build tension, how to ask her out\n\nWhat's going on in your dating life right now? Give me the full situation and I'll tell you exactly what to do.",
        id: "welcome",
      }]);
    }
  }, [isWelcome, messages.length]);

  const sendMessage = useCallback(async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content, id: crypto.randomUUID() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          mode,
          userId: user?.id,
          sessionId,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      const aiMsg: Message = { role: "assistant", content: "", id: crypto.randomUUID() };
      setMessages((prev) => [...prev, aiMsg]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content || "";
                if (delta) {
                  aiMsg.content += delta;
                  setMessages((prev) =>
                    prev.map((m) => (m.id === aiMsg.id ? { ...m, content: aiMsg.content } : m))
                  );
                }
              } catch {}
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Try again.",
        id: crypto.randomUUID(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, messages, mode, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-secondary)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                borderRadius: 8, border: "1px solid",
                borderColor: mode === m.id ? "rgba(245,166,35,0.5)" : "var(--border)",
                background: mode === m.id ? "rgba(245,166,35,0.08)" : "transparent",
                color: mode === m.id ? "var(--accent-gold)" : "var(--text-muted)",
                fontSize: 13, fontWeight: mode === m.id ? 600 : 400,
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              <m.icon size={13} />
              {m.label}
            </button>
          ))}
        </div>
        <button onClick={() => setMessages([])} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}>
          <RotateCcw size={13} />
          Clear
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>
        {messages.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 32, paddingBottom: 40 }}>
            <div>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Flame size={32} color="#000" />
              </div>
              <h2 style={{ textAlign: "center", fontFamily: "Syne", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Your AI Wingman is Ready</h2>
              <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: 15 }}>Tell me what's happening and I'll coach you through it.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", maxWidth: 600 }}>
              {STARTER_PROMPTS.map((prompt, i) => (
                <button key={i} onClick={() => sendMessage(prompt.text)}
                  style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: 13, textAlign: "left", cursor: "pointer", lineHeight: 1.4 }}>
                  <span style={{ fontSize: 18, display: "block", marginBottom: 6 }}>{prompt.icon}</span>
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 720, margin: "0 auto" }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 10 }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                    <Flame size={14} color="#000" />
                  </div>
                )}
                <div className={msg.role === "user" ? "bubble-user" : "bubble-ai"}
                  style={{ maxWidth: "75%", padding: "12px 16px", fontSize: 15, lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                />
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #f5a623, #ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Flame size={14} color="#000" />
                </div>
                <div className="bubble-ai" style={{ padding: "14px 18px", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--text-muted)", display: "inline-block", animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", background: "var(--bg-secondary)", flexShrink: 0 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", gap: 12, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your situation, paste a conversation, or ask for advice..."
            className="input-field"
            rows={1}
            style={{ flex: 1, padding: "12px 16px", fontSize: 15, resize: "none", maxHeight: 120, lineHeight: 1.5, overflowY: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn-primary"
            style={{ width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: !input.trim() || loading ? 0.5 : 1 }}>
            <Send size={18} />
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>Press Enter to send · Shift+Enter for new line</p>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>
    </div>
  );
}
