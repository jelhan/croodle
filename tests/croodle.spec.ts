import { test, expect } from "@playwright/test";

test("create a poll", async ({ page }) => {
  // Arrange current date to be May 1, 2025
  await page.clock.setFixedTime(new Date("2025-05-01"));

  // Open landing page
  await page.goto("/");

  await expect(page).toHaveTitle("Croodle");
  await expect(page).toHaveURL("/");

  // Start poll creation
  await page.getByRole("link", { name: "Try it now" }).click();

  await expect(page).toHaveTitle("Create a poll | Croodle");
  await expect(page).toHaveURL("/#/create");

  // Continue with defaults for poll type
  await page.getByRole("button", { name: "Next" }).click();

  await expect(page).toHaveTitle("Create a poll | Croodle");
  await expect(page).toHaveURL("/#/create/meta");

  // Fillin required title and continue to next step
  await page.getByRole("textbox", { name: "Title" }).fill("Example poll");
  await page.getByRole("button", { name: "Next" }).click();

  await expect(page).toHaveTitle("Create a poll | Croodle");
  await expect(page).toHaveURL("/#/create/options");

  // Select two days and continue to next step
  await page.locator(`[data-date="2025-05-01"]`).click();
  await page.locator(`[data-date="2025-05-09"]`).click();
  await page.getByRole("button", { name: "Next" }).click();

  await expect(page).toHaveTitle("Create a poll | Croodle");
  await expect(page).toHaveURL("/#/create/options-datetime");

  // Continue without providing times
  await page.getByRole("button", { name: "Next" }).click();

  await expect(page).toHaveTitle("Create a poll | Croodle");
  await expect(page).toHaveURL("/#/create/settings");

  // Save the poll
  await page.getByRole("button", { name: "Save" }).click();

  // Assert that filled in poll data is shown
  await assertSavedPoll();

  // Reload the poll and ensure that filled in poll data is still shown
  await page.reload();

  await assertSavedPoll();

  async function assertSavedPoll() {
    await expect(page).toHaveTitle("Example poll | Croodle");
    await expect(page).toHaveURL(
      /\/#\/poll\/[a-zA-Z0-9]+\/participation\?encryptionKey=[a-zA-Z0-9]+/,
    );
    await expect(page.getByRole("heading", { level: 2 })).toHaveText(
      "Example poll",
    );
    await expect(
      page.locator(".selections label.col-form-label").first(),
    ).toHaveText("Thursday, May 1, 2025");
    await expect(
      page.locator(".selections label.col-form-label").last(),
    ).toHaveText("Friday, May 9, 2025");
  }
});
