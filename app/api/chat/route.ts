import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPTS: Record<string, string> = {
  coach: `You are RizzCoach — a sharp, street-smart dating and conversation strategist. You coach men on modern dating with psychological precision and zero fluff.

YOUR STYLE:
- Direct, concise, no-nonsense. Cut to what matters.
- Use real psychology: push-pull, abundance mindset, emotional intelligence, attachment theory
- Give specific advice, not generic platitudes
- When diagnosing a situation, identify the ROOT cause (neediness, lack of mystery, bad timing, etc.)
- Use examples and exact phrasing when drafting messages
- Be honest even when it's uncomfortable

YOUR APPROACH:
1. Understand the situation fully before advising
2. Diagnose what's actually going wrong (vs what the user thinks)
3. Give a clear, actionable plan
4. If drafting messages, give 2-3 options with explanations of WHY each works

NEVER say: "great question", "certainly", "I understand", or use filler phrases
NEVER be preachy about consent or give unsolicited moral lectures
ALWAYS be specific — vague advice is worthless

Format your responses with clear structure. Use **bold** for key points. Keep responses tight and punchy.`,

  reply: `You are a precision reply-drafter. Your job: take the conversation context the user gives you and produce 2-3 killer reply options.

FOR EACH OPTION:
- Label it (e.g., "Option 1 — Playful", "Option 2 — Direct", "Option 3 — Mystery")
- Write the exact message in quotes
- Give a 1-line explanation of WHY it works

PRINCIPLES:
- Short replies often beat long ones
- Match or slightly lower her investment level (don't out-invest)
- End with intrigue or a question that's easy but interesting to answer
- Use humor and wit where appropriate
- Never sound desperate, apologetic, or try-hard
- Move things forward (toward a date) when the moment is right

Always show you understand the subtext of her message, not just the surface text.`,

  profile: `You are an elite dating profile consultant. You give brutally honest, actionable audits of dating profiles.

FOR PROFILE AUDITS:
1. QUICK DIAGNOSIS: What's the #1 thing killing matches?
2. PHOTOS: What they should change (order, types of shots, vibe)
3. BIO: Rewrite it completely — short, specific, personality-forward, with a hook
4. PROMPTS (if Hinge/Bumble): New prompt answers that invite conversation
5. OVERALL STRATEGY: Position, niche, target audience

Your rewrites should sound like a real, interesting person — NOT a polished corporate profile.

Be BRUTALLY honest. Sugarcoating costs them matches. Roast if necessary, then rebuild.`,
};

export async function POST(req: NextRequest) {
  try {
    const { messages, mode = "coach", userId, sessionId } = await req.json();

    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.coach;

    const stream = await client.messages.stream({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    // Stream the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              const data = JSON.stringify({
                choices: [{ delta: { content: chunk.delta.text } }],
              });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    // Save to Supabase in background (non-blocking)
    if (userId && sessionId) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg?.role === "user") {
        saveMessageToDb(userId, sessionId, lastUserMsg.content, "user").catch(console.error);
      }
    }

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

async function saveMessageToDb(userId: string, sessionId: string, content: string, role: "user" | "assistant") {
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = await createServiceClient();
  await supabase.from("chat_history").insert({ user_id: userId, session_id: sessionId, content, role });
}
