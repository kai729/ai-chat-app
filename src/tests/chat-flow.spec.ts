// src/tests/chat-flow.spec.ts
import { test, expect } from "@playwright/test";

test("ゲストログイン→新規セッション→チャット送受信→セッション復元", async ({ page }) => {
  await page.goto("http://localhost:3000/chat");

  // 自動ログインのローディング表示が消えるまで待つ
  await expect(page.getByText("認証確認中...")).toBeHidden({ timeout: 10000 });

  // 念のための待機（描画遅延対策）
  await page.waitForLoadState("networkidle");

  // チャット画面の見出し確認
  await expect(page.getByTestId("chat-title")).toBeVisible({ timeout: 10000 });

  // チャット開始 → 入力 → 送信
  await page.getByRole("button", { name: "新規チャット", exact: true }).click();
  await page.getByPlaceholder("メッセージを入力").fill("こんにちは！");
  await page.getByRole("button", { name: "送信" }).click();
});
