import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("landing page only exposes Vietnamese invitation content", async () => {
  const [component, config, layout] = await Promise.all([
    readFile(new URL("app/WeddingInvitation.tsx", root), "utf8"),
    readFile(new URL("src/config/wedding.ts", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);
  const publicContent = `${component}\n${config}\n${layout}`;

  assert.doesNotMatch(publicContent, /[\u3040-\u30ff\u3400-\u9fff]/u);
  assert.doesNotMatch(component, /language-switcher|LanguageMode|copy-ja/);
  assert.doesNotMatch(component, /family-message|noGiftMessage/);
  assert.match(layout, /<html lang="vi">/);
});

test("shows and submits both banquet time options", async () => {
  const [component, config] = await Promise.all([
    readFile(new URL("app/WeddingInvitation.tsx", root), "utf8"),
    readFile(new URL("src/config/wedding.ts", root), "utf8"),
  ]);

  assert.match(config, /banquetTimes: \["15:00", "17:00"\]/);
  assert.match(component, /VITE_RSVP_ENTRY_BANQUET_TIME/);
  assert.match(component, /form\.attendance === "yes"/);
  assert.match(component, /\[entries\.banquetTime!\]: isAttending \? form\.banquetTime : ""/);
});

test("does not retain the old Google Form connection", async () => {
  const [component, config, env] = await Promise.all([
    readFile(new URL("app/WeddingInvitation.tsx", root), "utf8"),
    readFile(new URL("src/config/wedding.ts", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
  ]);

  assert.doesNotMatch(config, /docs\.google\.com\/forms|entry\.\d+/);
  assert.doesNotMatch(component, /entry\.\d+/);
  assert.match(env, /VITE_RSVP_ENDPOINT=/);
  assert.match(env, /VITE_RSVP_ENTRY_BANQUET_TIME=/);
});
