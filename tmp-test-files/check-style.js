import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set up logging
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });

  console.log('=== STARTING THEME & CONTRAST VERIFICATION ===');

  // 1. Translator page in Dark Mode
  await page.goto('http://localhost:5174/');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForSelector('header h1');
  const darkTranslatorH1 = await page.evaluate(() => {
    const el = document.querySelector('header h1');
    return {
      text: el.innerText,
      color: window.getComputedStyle(el).color,
      font: window.getComputedStyle(el).fontFamily
    };
  });
  console.log('[Dark Mode] Translator H1:', darkTranslatorH1);
  await page.screenshot({ path: 'f:/project/nextjs project/audio-morse-code-translator/tmp-test-files/dark_translator.png' });

  // 2. Translator page in Light Mode
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(500);
  const lightTranslatorH1 = await page.evaluate(() => {
    const el = document.querySelector('header h1');
    return {
      text: el.innerText,
      color: window.getComputedStyle(el).color,
      font: window.getComputedStyle(el).fontFamily
    };
  });
  console.log('[Light Mode] Translator H1:', lightTranslatorH1);
  await page.screenshot({ path: 'f:/project/nextjs project/audio-morse-code-translator/tmp-test-files/light_translator.png' });

  // 3. About page in Dark Mode
  await page.goto('http://localhost:5174/about');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForSelector('main h1');
  const darkAboutH1 = await page.evaluate(() => {
    const el = document.querySelector('main h1');
    return {
      text: el.innerText,
      color: window.getComputedStyle(el).color,
      font: window.getComputedStyle(el).fontFamily
    };
  });
  console.log('[Dark Mode] About H1:', darkAboutH1);
  await page.screenshot({ path: 'f:/project/nextjs project/audio-morse-code-translator/tmp-test-files/dark_about.png' });

  // 4. About page in Light Mode
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(500);
  const lightAboutH1 = await page.evaluate(() => {
    const el = document.querySelector('main h1');
    const p = document.querySelector('main p.text-text-main');
    return {
      titleText: el.innerText,
      titleColor: window.getComputedStyle(el).color,
      bodyColor: p ? window.getComputedStyle(p).color : 'N/A'
    };
  });
  console.log('[Light Mode] About Page Styles:', lightAboutH1);
  await page.screenshot({ path: 'f:/project/nextjs project/audio-morse-code-translator/tmp-test-files/light_about.png' });

  // 5. FAQ page in Dark Mode
  await page.goto('http://localhost:5174/faq');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForSelector('main h1');
  const darkFaqH1 = await page.evaluate(() => {
    const el = document.querySelector('main h1');
    return {
      text: el.innerText,
      color: window.getComputedStyle(el).color
    };
  });
  console.log('[Dark Mode] FAQ H1:', darkFaqH1);
  await page.screenshot({ path: 'f:/project/nextjs project/audio-morse-code-translator/tmp-test-files/dark_faq.png' });

  // 6. FAQ page in Light Mode
  await page.evaluate(() => document.documentElement.classList.remove('dark'));
  await page.waitForTimeout(500);
  const lightFaqH1 = await page.evaluate(() => {
    const el = document.querySelector('main h1');
    return {
      text: el.innerText,
      color: window.getComputedStyle(el).color
    };
  });
  console.log('[Light Mode] FAQ H1:', lightFaqH1);
  await page.screenshot({ path: 'f:/project/nextjs project/audio-morse-code-translator/tmp-test-files/light_faq.png' });

  console.log('=== VERIFICATION COMPLETED ===');
  await browser.close();
}

verify().catch(console.error);
