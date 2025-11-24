import { test, expect } from "@playwright/test";

test("create a poll for finding a date (without time) and participate in it", async ({
  page,
}) => {
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

  // Configure poll to never expire as server would clean it up
  // immediately otherwise
  await page.getByLabel("expire").selectOption({ label: "Never" });

  await expect(page).toHaveTitle("Create a poll | Croodle");
  await expect(page).toHaveURL("/#/create/settings");

  // Save the poll
  await page.getByRole("button", { name: "Save" }).click();

  // Assert that filled in poll data is shown
  await assertSavedPoll();

  // Participate in the poll
  await page.getByLabel("Name").fill("John Doe");
  await page
    .locator(".row")
    .filter({ hasText: "Thursday, May 1, 2025" })
    .getByLabel("Yes")
    .check({ force: true });
  await page
    .locator(".row")
    .filter({ hasText: "Friday, May 9, 2025" })
    .getByLabel("No")
    .check({ force: true });
  await page.getByRole('button', { name: 'Save' }).click();

  // Assert that participation is saved
  await assertSavedParticipation();

  // Go back to participation page
  await page.getByRole('link', { name: 'Attend' }).click();

  await expect(page).toHaveURL(
    /\/#\/poll\/[a-zA-Z0-9]+\/participation\?encryptionKey=[a-zA-Z0-9]+/,
  );

  // Reload the poll
  await page.reload();

  // Ensure that poll data is still shown as expected after reload
  await assertSavedPoll();

  // Ensure that participation is still shown as expected after reload
  await page.getByRole('link', { name: 'Evaluation' }).click();
  await assertSavedParticipation();

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

  async function assertSavedParticipation() {
    await expect(page).toHaveURL(
      /\/#\/poll\/[a-zA-Z0-9]+\/evaluation\?encryptionKey=[a-zA-Z0-9]+/,
    );
    await expect(
      page.getByRole('row', { name: 'John Doe' }).getByRole('cell').nth(1)
    ).toHaveText('Yes');
    await expect(
      page.getByRole('row', { name: 'John Doe' }).getByRole('cell').last()
    ).toHaveText('No');
  }
});
