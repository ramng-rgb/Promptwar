const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../demo_frames');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 }
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Hero Banner
  console.log('Capturing Hero Banner...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_hero.png') });

  // 2. Pollutants & Trending
  console.log('Scrolling to Pollutants Grid...');
  await page.evaluate(() => window.scrollBy({ top: 580, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_pollutants.png') });

  // 3. Map Tab
  console.log('Capturing Map View...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const mapBtn = buttons.find(b => b.textContent && b.textContent.trim().toLowerCase() === 'map');
    if (mapBtn) mapBtn.click();
  });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_map.png') });

  // 4. AQI Scale Tab
  console.log('Capturing AQI Scale View...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const scaleBtn = buttons.find(b => b.textContent && b.textContent.includes('AQI Scale'));
    if (scaleBtn) scaleBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_scale.png') });

  // 5. Rankings Tab
  console.log('Capturing World Smog Rankings...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const rankBtn = buttons.find(b => b.textContent && b.textContent.includes('Ranking'));
    if (rankBtn) rankBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_rankings.png') });

  // 6. GenAI Advisor Tab
  console.log('Capturing GenAI Smog Advisor...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const aiBtn = buttons.find(b => b.textContent && b.textContent.includes('GenAI Advisor'));
    if (aiBtn) aiBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_ai.png') });

  // 7. Household Actions & Corsi-Rosenthal
  console.log('Capturing Household Actions...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const dashBtn = buttons.find(b => b.textContent && b.textContent.includes('Dashboard'));
    if (dashBtn) dashBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => window.scrollTo({ top: 1600, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_actions.png') });

  console.log('Done capturing all screenshots!');
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
