export const runtime = "nodejs";

export async function POST(req: Request) {
  // const { prompt, history, systemPrompt } = await req.json();
  const { prompt, history } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response("APIキー未設定", { status: 500 });
  }

  const contents = [];

  // // ✅ まずシステムプロンプトを先頭に追加（もし入力されていれば）
  // if (systemPrompt && systemPrompt.trim()) {
  //   contents.push({
  //     role: "user",
  //     parts: [{ text: systemPrompt }],
  //   });
  // }

  // ✅ 過去の履歴を追加
  for (const msg of history) {
    contents.push({
      role: msg.role, // "user" or "model"
      parts: [{ text: msg.content }],
    });
  }

  // ✅ 今回のプロンプトを追加
  contents.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();
    console.log("🌐 Geminiレスポンス:", data);

    if (!response.ok) {
      console.error("❌ Gemini API Error Response:", data);
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 500,
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "応答が取得できませんでした";

    if (!text) {
      return new Response(JSON.stringify({ error: "Gemini APIからテキスト応答が得られませんでした" }), { status: 500 });
    }

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ fetchエラー:", err instanceof Error ? err.message : err);
    return new Response(JSON.stringify({ error: "Gemini API 呼び出しエラー" }), {
      status: 500,
    });
  }
}
