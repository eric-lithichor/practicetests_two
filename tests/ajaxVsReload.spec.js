import { test, expect } from '@playwright/test';

/*
Question:
Write a Playwright test for a single-page application where you verify that after navigating 
to a specific route, the content updates correctly without a full page reload (SPA behavior).

This is a good code exam question, because you can ask the LLM how to write a test for it, 
and ChatGPT will give you a poor test the first time; it tells you to check the URL and the
content. You need to ask a followup question to get something that works. Asking this as a 
code exam makes sure the candidate thinks about the solution rather than just parroting what
the AI tells them.
*/

test('Test for a Single-Page Application (SPA)', async ({page}) => {
    await page.goto("https://www.salesforce.com");

    // Capture the initial URL and content
    const initialContent = await page.textContent('#main-content');

    // go to Products => Agentforce => How it works
    await page.locator('span').filter({ hasText: /^Products$/ }).click();
    await page.locator('span').filter({ hasText: /^Agentforce$/ }).hover()
    await page.getByRole('link', { name: 'How Agentforce works' }).click();

    // wait for the load
    await page.waitForLoadState('load');

    // verify content has changed
    const newContent = await page.textContent('#main-content');
    expect(newContent).not.toBe(initialContent);
    expect(page.url()).toBe('https://www.salesforce.com/agentforce/how-it-works/');

    // post-reload performance metrics
    const postReloadPerformance = await page.evaluate(() => {
        const entries = window.performance.getEntriesByType('navigation');
        return entries.length ? entries[0] : null;
    });

    // check for navigation
    expect(postReloadPerformance.type).toBe('navigate');
});

test('Test that a reload creates a null response', async ({page}) => {
    await page.goto("https://www.salesforce.com");
        
    // reload the page
    await page.reload();

    // wait for the load
    await page.waitForLoadState('load');

    // post-reload performance metrics
    const postReloadPerformance = await page.evaluate(() => {
        const entries = window.performance.getEntriesByType('navigation');
        return entries.length ? entries[0] : null;
    });

    // check for reload
    expect(postReloadPerformance.type).toBe('reload');
});