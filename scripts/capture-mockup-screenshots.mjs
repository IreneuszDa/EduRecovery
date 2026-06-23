import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let playwright;

try {
  playwright = require("playwright");
} catch {
  const fallbackPath =
    process.env.PLAYWRIGHT_MODULE_PATH ||
    "/Users/j/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright";

  playwright = require(fallbackPath);
}

const { chromium } = playwright;

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const outDir = path.resolve("mockup-screenshots");

async function ensureDir() {
  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
}

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(450);
}

async function shot(page, name, options = {}) {
  await settle(page);
  await page.screenshot({
    path: path.join(outDir, `${name}.png`),
    fullPage: options.fullPage ?? false
  });
}

async function click(page, roleName, options = {}) {
  const locator = page.getByRole("button", { name: roleName });
  await (options.last ? locator.last() : locator.first()).click();
  await settle(page);
}

async function main() {
  await ensureDir();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  page.on("console", (message) => {
    if (message.type() === "error") {
      console.error(`[browser:${message.type()}] ${message.text()}`);
    }
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await shot(page, "01-setup-desktop");

  await click(page, /Use demo data/);
  await shot(page, "02-teacher-dashboard-desktop");
  await shot(page, "02-teacher-dashboard-desktop-full", { fullPage: true });

  await page.getByRole("button", { name: /^Maksym$/ }).first().click();
  await shot(page, "03-student-profile-desktop");

  await click(page, /Run screening/);
  await shot(page, "04-screening-question-desktop");

  await click(page, /Use demo result/);
  await shot(page, "05-screening-demo-result-desktop");

  await click(page, /Open result/);
  await shot(page, "06-teacher-brief-desktop");
  await shot(page, "06-teacher-brief-desktop-full", { fullPage: true });

  await page.getByRole("button", { name: /^Dashboard$/ }).first().click();
  await settle(page);
  await click(page, /Input paper results/);
  await shot(page, "07-manual-input-desktop");

  await page.getByRole("button", { name: /^Dashboard$/ }).first().click();
  await settle(page);
  await click(page, /Generate AI tasks/);
  await shot(page, "08-ai-generating-desktop");
  await page.waitForTimeout(2300);
  await shot(page, "09-ai-tasks-generated-desktop");

  await page.getByRole("button", { name: /^Student$/ }).first().click();
  await settle(page);
  await shot(page, "10-student-dashboard-desktop");

  await context.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
  await shot(mobilePage, "11-setup-mobile");
  await click(mobilePage, /Use demo data/);
  await shot(mobilePage, "12-dashboard-mobile");
  await mobilePage.getByRole("button", { name: /Open sidebar/i }).click();
  await settle(mobilePage);
  await shot(mobilePage, "13-mobile-sidebar-open");

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
