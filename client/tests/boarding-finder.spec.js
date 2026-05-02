import { test, expect } from '@playwright/test';

// The URL where your Vite frontend runs
const APP_URL = 'http://localhost:5173';

test.describe('Boarding Finder Module Tests', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto(`${APP_URL}/login`);
    
    // 🚨 IMPORTANT: Change these to a real username/password in your local database!
    await page.fill('input[type="text"]', 'playwright_tester'); 
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button:has-text("Login")');

    // 2. Wait for login to finish, then go to your module
    await page.waitForURL('**/'); // Waits for redirect to homepage
    await page.goto(`${APP_URL}/boardings?tab=add`);
  });

  test('Should block submission if validation fails (Gatekeeper Test)', async ({ page }) => {
    // Deliberately enter bad data
    await page.fill('input[placeholder="e.g. Cozy Room Near SLIIT"]', 'Room'); // Title too short
    await page.fill('input[placeholder="e.g. 12000"]', '0'); // Invalid price
    
    // Attempt to publish
    await page.click('button:has-text("Publish Listing")');

    // Verify your custom Toast catches the error
    const toastMessage = page.locator('.bf-toast.error').first();
    await expect(toastMessage).toBeVisible();
    await expect(toastMessage).toContainText('Title must be at least 5 characters long');
  });

  test('Should successfully upload image and publish listing (Happy Path)', async ({ page }) => {
    // 1. Upload the test image
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/room.jpg');
    
    // 2. Fill out the form perfectly
    await page.fill('input[placeholder="e.g. Cozy Room Near SLIIT"]', 'Luxury SLIIT Student Suite');
    await page.fill('input[placeholder="e.g. Malabe"]', 'Malabe North');
    await page.fill('input[placeholder="e.g. 12000"]', '25000');
    await page.fill('input[placeholder="e.g. 3"]', '2');
    
    // 3. Fill description to bypass the 10-word minimum
    await page.fill('textarea[placeholder="Describe the boarding house for students…"]', 
      'This is a beautiful, quiet space perfect for studying. Includes all modern amenities and is just a short walk to the university campus.'
    );

    // 4. Submit the form
    await page.click('button:has-text("Publish Listing")');

    // 5. Verify the success toast appears
    const successToast = page.locator('.bf-toast.success').first();
    await expect(successToast).toBeVisible();
    await expect(successToast).toContainText('Boarding published!');
  });
});