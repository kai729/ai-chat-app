// app/api/test/route.ts
export async function GET() {
  console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
  const key = process.env.GEMINI_API_KEY;
  return new Response(`API Keyの存在チェック: ${!!key}`, {
    status: 200,
  });
}
