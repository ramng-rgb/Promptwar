const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const FRAMES_DIR = path.join(__dirname, '../demo_frames');

async function renderSlides() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 }
  });

  const page = await browser.newPage();

  // 1. Intro Slide
  const introHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        margin: 0;
        width: 1920px;
        height: 1080px;
        background: radial-gradient(circle at 50% 40%, #151e33 0%, #0b0f19 75%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }
      .badge {
        background: rgba(0, 200, 179, 0.15);
        color: #00c8b3;
        border: 1px solid rgba(0, 200, 179, 0.4);
        padding: 8px 24px;
        border-radius: 9999px;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 24px;
      }
      h1 {
        font-size: 88px;
        font-weight: 900;
        letter-spacing: -2px;
        margin: 0 0 16px 0;
        background: linear-gradient(135deg, #ffffff 60%, #00c8b3 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      p.sub {
        font-size: 32px;
        color: #e2e8f0;
        margin: 0 0 32px 0;
        font-weight: 500;
      }
      .chips {
        display: flex;
        gap: 16px;
      }
      .chip {
        background: #182032;
        border: 1px solid #283652;
        padding: 10px 22px;
        border-radius: 14px;
        font-size: 18px;
        color: #94a3b8;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="badge">Urban Air Intelligence • Project Demo</div>
    <h1>A E R O P U L S E</h1>
    <p class="sub">Urban Air Quality & Winter Smog Inversion Assistant</p>
    <div class="chips">
      <div class="chip">Live Open-Meteo Telemetry</div>
      <div class="chip">6-Pollutant Matrix</div>
      <div class="chip">Basin Sensor Map</div>
      <div class="chip">GenAI Smog Advisor</div>
    </div>
  </body>
  </html>
  `;
  await page.setContent(introHtml);
  await page.screenshot({ path: path.join(FRAMES_DIR, '00_intro.png') });

  // 2. Outro Slide
  const outroHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        margin: 0;
        width: 1920px;
        height: 1080px;
        background: radial-gradient(circle at 50% 40%, #151e33 0%, #0b0f19 75%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
      }
      .badge {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.4);
        padding: 8px 24px;
        border-radius: 9999px;
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-bottom: 24px;
      }
      h1 {
        font-size: 72px;
        font-weight: 900;
        margin: 0 0 40px 0;
      }
      .card {
        background: #182032;
        border: 1px solid #2a3754;
        border-radius: 24px;
        padding: 36px 64px;
        display: flex;
        flex-direction: column;
        gap: 24px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      }
      .row {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .label {
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: #94a3b8;
        font-weight: 700;
      }
      .val {
        font-size: 28px;
        font-family: monospace;
        font-weight: 800;
        color: #00c8b3;
      }
    </style>
  </head>
  <body>
    <div class="badge">Deployed & Ready</div>
    <h1>AeroPulse is Live</h1>
    <div class="card">
      <div class="row">
        <div class="label">Live Web Application</div>
        <div class="val">https://ramng-rgb.github.io/Promptwar/</div>
      </div>
      <div class="row">
        <div class="label">Open Source Repository</div>
        <div class="val" style="color: #ffffff;">https://github.com/ramng-rgb/Promptwar</div>
      </div>
    </div>
  </body>
  </html>
  `;
  await page.setContent(outroHtml);
  await page.screenshot({ path: path.join(FRAMES_DIR, '08_outro.png') });

  console.log('Title slides generated successfully!');
  await browser.close();
}

renderSlides().catch(console.error);
