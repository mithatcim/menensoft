/**
 * Tarayıcı tabanlı denetim — viewport taşması, konsol hataları, mobil menü.
 *
 * Repoya bağımlılık EKLEMEZ: playwright-core'u sırasıyla şuralardan çözer:
 *   1. yerel node_modules (varsa)
 *   2. PLAYWRIGHT_CORE_PATH ortam değişkeni
 *   3. bu makinedeki bilinen npx önbelleği (geliştirme ortamı)
 * Chromium yolu: CHROME_PATH ortam değişkeni ya da ms-playwright önbelleği.
 * Hiçbiri yoksa script açıklayıcı bir hata ile çıkar — CI zorunluluğu değildir;
 * statik kontroller için scripts/audit.mjs yeterlidir.
 *
 * Kullanım:
 *   BASE=http://localhost:3000 pnpm audit:browser
 *   SHOT_DIR=C:\path\to\review  (opsiyonel ekran görüntüsü klasörü)
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);

function resolvePlaywright() {
  try {
    return require("playwright-core");
  } catch {}
  const candidates = [
    process.env.PLAYWRIGHT_CORE_PATH,
    process.env.LOCALAPPDATA &&
      path.join(
        process.env.LOCALAPPDATA,
        "npm-cache",
        "_npx",
        "420ff84f11983ee5",
        "node_modules",
        "playwright-core",
      ),
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      return require(c);
    } catch {}
  }
  console.error(
    "playwright-core bulunamadı. PLAYWRIGHT_CORE_PATH ayarlayın ya da " +
      "yalnızca statik denetim için `pnpm audit` kullanın.",
  );
  process.exit(1);
}

function resolveChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.LOCALAPPDATA &&
      path.join(
        process.env.LOCALAPPDATA,
        "ms-playwright",
        "chromium-1217",
        "chrome-win64",
        "chrome.exe",
      ),
  ].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c)) return c;
  console.error("Chromium bulunamadı. CHROME_PATH ayarlayın.");
  process.exit(1);
}

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/+$/, "");
const SHOT_DIR = process.env.SHOT_DIR || "";
const VIEWPORTS = [1440, 1024, 768, 390, 360];

const { chromium } = resolvePlaywright();
const executablePath = resolveChrome();

const issues = [];

(async () => {
  if (SHOT_DIR) fs.mkdirSync(SHOT_DIR, { recursive: true });
  const browser = await chromium.launch({ executablePath });
  const ctx = await browser.newContext();

  // rota envanteri: çalışan sitenin sitemap'i
  const xml = await (await ctx.request.get(`${BASE}/sitemap.xml`)).text();
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname,
  );

  for (const route of routes) {
    const errors = [];
    const page = await ctx.newPage();
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const w of VIEWPORTS) {
      await page.setViewportSize({ width: w, height: w > 800 ? 900 : 844 });
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      const overflow = await page.evaluate(() => {
        const d = document.documentElement;
        return d.scrollWidth - d.clientWidth;
      });
      if (overflow > 1) issues.push(`taşma ${route} @${w} (+${overflow}px)`);
    }
    if (errors.length)
      issues.push(`konsol ${route}: ${errors.slice(0, 2).join(" | ")}`);
    await page.close();
  }

  // mobil menü + örnek ekran görüntüleri
  const page = await ctx.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.click('button[aria-controls="mobile-nav"]');
  await page.waitForTimeout(400);
  if (!(await page.isVisible("#mobile-nav")))
    issues.push("mobil menü açılmıyor");

  if (SHOT_DIR) {
    await page.screenshot({ path: path.join(SHOT_DIR, "mobile-menu.png") });
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [route, name] of [
      ["/", "home-desktop"],
      ["/sss", "sss-desktop"],
      ["/teklif-al", "teklif-al-desktop"],
    ]) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(SHOT_DIR, name + ".png"),
        fullPage: true,
      });
    }
    fs.writeFileSync(
      path.join(SHOT_DIR, "audit-result.txt"),
      issues.length ? "SORUNLAR:\n" + issues.join("\n") : "TEMİZ",
    );
  }

  await browser.close();
  console.log(
    `BASE = ${BASE} — ${routes.length} rota x ${VIEWPORTS.length} viewport`,
  );
  if (issues.length) {
    console.error(`SORUNLAR (${issues.length}):`);
    issues.forEach((i) => console.error("  FAIL " + i));
    process.exit(2);
  }
  console.log("TÜM TARAYICI KONTROLLERİ TEMİZ");
})().catch((e) => {
  console.error("Tarayıcı denetimi çalıştırılamadı:", e.message);
  process.exit(1);
});
