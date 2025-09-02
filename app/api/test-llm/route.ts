import { NextResponse } from "next/server";
import { callLLM } from "@/lib/llm";

export async function GET() {
  const system = { role: "system", content: "Return ONLY valid JSON: {\"ok\":true}" };
  const user   = { role: "user", content: "Say ok" };
  const out = await callLLM([system, user]);
  return NextResponse.json({ raw: out });
}
