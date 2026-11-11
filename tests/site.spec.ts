import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("masked headings reveal and internal links have valid targets", async ({
  page,
}) => {
  await page.goto("/");
  for (const id of ["#intro-title", "#approach-title"]) {
    const heading = page.locator(id);
    await heading.scrollIntoViewIfNeeded();
    for (const line of await heading.locator(".line-mask > span").all()) {
      await expect(line).toHaveCSS("transform", "none");
    }
  }
  const broken = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href")!)
        .filter((href) => !document.getElementById(href.slice(1))),
    );
  expect(broken).toEqual([]);
});

test("page and contact dialog pass automated WCAG checks", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1300);
  const pageAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(pageAudit.violations).toEqual([]);
  await page.getByRole("button", { name: "LET'S TALK", exact: true }).click();
  await page.waitForTimeout(400);
  const dialogAudit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(dialogAudit.violations).toEqual([]);
});

test("desktop navigation and all five service experiences work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "digital performance",
  );
  await expect(page.locator(".hero-content")).toHaveCSS("opacity", "1");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(page).toHaveURL(/#services$/);
  for (const name of [
    "Web design & development",
    "Video editing",
    "Motion graphics",
    "Social media management",
    "Performance marketing",
  ]) {
    const service = page
      .getByRole("button", { name: new RegExp(name, "i") })
      .filter({ has: page.locator(".service-number") });
    await service.click();
    await expect(service).toHaveAttribute("aria-expanded", "true");
  }
  await page.getByRole("button", { name: "EXPLORE THE POSSIBILITIES" }).click();
  const dialog = page.getByRole("dialog", { name: "Performance Marketing" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("Audience targeting", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  expect(errors).toEqual([]);
});

test("project previews disclose concept status and navigate between projects", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "View Aether concept project", exact: true })
    .click();
  let dialog = page.getByRole("dialog", { name: "Aether concept project" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText("INDEPENDENT CONCEPT / NOT CLIENT WORK"),
  ).toBeVisible();
  await expect(
    dialog.getByText(/does not represent a real client engagement/),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "NEXT CONCEPT" }).click();
  dialog = page.getByRole("dialog", { name: "Velocity concept project" });
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: "LET'S CREATE YOUR NEXT CHAPTER" })
    .click();
  const contact = page.getByRole("dialog", {
    name: "Start your Struvoo project",
  });
  await expect(contact).toBeVisible();
  await expect(contact.getByLabel("Project focus")).toHaveValue(
    "A little of everything",
  );
  await expect(contact.getByLabel("A little about your idea")).toContainText(
    "Velocity",
  );
  await page.keyboard.press("Escape");
  await expect(contact).toBeHidden();
  await expect(
    page.getByRole("button", {
      name: "View Aether concept project",
      exact: true,
    }),
  ).toBeFocused();
});

test("project brief validates input, prepares honestly, and downloads", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "LET'S TALK", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "Start your Struvoo project",
  });
  await dialog
    .getByRole("button", { name: "CREATE YOUR PROJECT BRIEF" })
    .click();
  await expect(dialog.getByLabel("Your name")).toBeVisible();
  await dialog.getByLabel("Your name").fill("Test Creative");
  await dialog.getByLabel("Email address").fill("creative@example.com");
  await dialog.getByLabel("Company", { exact: true }).fill("Example Studio");
  await dialog
    .getByLabel("Project focus")
    .selectOption("Web Design & Development");
  await dialog
    .getByLabel("A little about your idea")
    .fill(
      "We want a distinctive, accessible digital experience for our new brand.",
    );
  await dialog
    .getByRole("button", { name: "CREATE YOUR PROJECT BRIEF" })
    .click();
  await expect(
    dialog.getByRole("heading", { name: /A little clarity/ }),
  ).toBeVisible();
  await expect(dialog.getByText(/Nothing has been sent/)).toBeVisible();
  const downloading = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "DOWNLOAD BRIEF" }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe("struvoo-project-brief.txt");
  const stream = await download.createReadStream();
  let content = "";
  for await (const part of stream!) content += part.toString();
  expect(content).toContain("Test Creative");
  expect(content).toContain("No inquiry has been sent");
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await dialog.getByRole("button", { name: "COPY BRIEF" }).click();
  await expect(dialog.getByRole("button", { name: "COPIED" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Test Creative",
  );
  await dialog.getByRole("button", { name: "EDIT YOUR BRIEF" }).click();
  await expect(dialog.getByLabel("Your name")).toHaveValue("Test Creative");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: "LET'S TALK", exact: true }),
  ).toBeFocused();
});

test("process stages support pointer and keyboard exploration", async ({
  page,
}) => {
  await page.goto("/");
  const tab = page.getByRole("tab", { name: /Strategize/ });
  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("roadmap");
  await tab.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Create/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "design, develop, edit",
  );
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: /Optimize/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page
      .getByRole("heading", { name: /Everything your brand/ })
      .scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page
      .getByRole("heading", { name: /Your next growth story/ })
      .scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
}

test.describe("mobile", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test("menu navigates, closes, and does not trap scrolling", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation" }).click();
    const nav = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(nav).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await nav.getByRole("link", { name: "Work", exact: false }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(nav).toBeHidden();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.keyboard.press("Escape");
    await expect(nav).toBeHidden();
    await expect(
      page.getByRole("button", { name: "Open navigation" }),
    ).toBeFocused();
  });

  test("project CTA opens a usable form on mobile", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "START YOUR PROJECT", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Your name")).toBeVisible();
    expect(
      await dialog.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    await dialog.getByRole("button", { name: "Close dialog" }).click();
    await expect(dialog).toBeHidden();
  });
});

test("reduced motion disables looping effects and custom cursor", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(400);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".custom-cursor")).toHaveCount(0);
  expect(
    await page
      .locator(".hero-speed-lines i")
      .first()
      .evaluate((el) => getComputedStyle(el).animationDuration),
  ).toBe("1e-05s");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
