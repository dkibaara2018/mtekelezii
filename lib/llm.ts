export async function callLLM(
  messages: {role:"system"|"user"|"assistant";content:string}[]
) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      // Optional attribution headers:
      "HTTP-Referer": "https://your-domain.vercel.app",
      "X-Title": "Mtekelezi"
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL_ID,
      temperature: 0.2,
      max_tokens: 1200,
      messages
    })
  });
  if (!res.ok) throw new Error(`LLM ${res.status}`);
  const json = await res.json();
  return json.choices[0].message.content;
}
