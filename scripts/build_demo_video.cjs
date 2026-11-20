const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FRAMES_DIR = path.join(__dirname, '../demo_frames');
const OUTPUT_VIDEO = path.join(__dirname, '../public/aeropulse_demo.mp4');
const ROOT_OUTPUT = path.join(__dirname, '../AeroPulse_Demo_Video.mp4');

// Verify frames exist
const frames = [
  { file: '01_hero.png', title: 'REAL-TIME US EPA AIR QUALITY INDEX', subtitle: 'Live Particulate Sensors & Smog Inversion Detection' },
  { file: '02_pollutants.png', title: '6-POLLUTANT SPECTROSCOPY MATRIX', subtitle: 'Continuous PM2.5, PM10, CO, SO2, NO2, O3 vs WHO Guidelines' },
  { file: '03_map.png', title: 'INTERACTIVE SENSOR & DISPERSION MAP', subtitle: 'Basin Geography, Micro-Climate Trap Dynamics & Commute Routes' },
  { file: '04_scale.png', title: 'AIR QUALITY INDEX SCALE & INDOOR MONITORS', subtitle: '6 Category Tiers with Visual Mascot Avatars & Health Impacts' },
  { file: '05_rankings.png', title: 'WORLD & REGIONAL SMOG LEADERBOARD', subtitle: 'Live City Pollution Comparison with Gauge Metrics & Standard Ratios' },
  { file: '06_ai.png', title: 'GENAI SMOG INVERSION ADVISOR', subtitle: 'Conversational Intelligence for Immediate Household Respiratory Protection' },
  { file: '07_actions.png', title: 'HOUSEHOLD ACTIONS & CORSI-ROSENTHAL BLUEPRINTS', subtitle: 'Vulnerability Profile & Quantifiable PM2.5/CO2 Emission Offset Ledger' },
];

console.log('Generating video clips for each feature...');
const clipFiles = [];

// 1. Intro clip
const introClip = path.join(FRAMES_DIR, 'clip_intro.mp4');
const introFilter = `
color=c=0x0b0f19:s=1920x1080:d=4[bg];
[bg]drawtext=text='A E R O P U L S E':fontsize=76:fontcolor=0x00c8b3:x=(w-text_w)/2:y=(h-text_h)/2-80:shadowcolor=black@0.8:shadowx=3:shadowy=3,
drawtext=text='Urban Air Quality & Winter Smog Assistant':fontsize=36:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2+20:shadowcolor=black@0.6:shadowx=2:shadowy=2,
drawtext=text='Live Telemetry • Multi-Gas Spectroscopy • GenAI Advisor':fontsize=24:fontcolor=0x94a3b8:x=(w-text_w)/2:y=(h-text_h)/2+80:shadowcolor=black@0.6:shadowx=2:shadowy=2[v]
`.replace(/\n/g, '');

execSync(`/opt/homebrew/bin/ffmpeg -y -f lavfi -i "${introFilter}" -c:v libx264 -pix_fmt yuv420p -r 30 "${introClip}"`, { stdio: 'inherit' });
clipFiles.push(introClip);

// 2. Feature clips with dynamic zoompan and lower-third badges
frames.forEach((f, idx) => {
  const imgPath = path.join(FRAMES_DIR, f.file);
  const outClip = path.join(FRAMES_DIR, `clip_${idx + 1}.mp4`);
  
  // Clean text strings for ffmpeg drawtext
  const titleClean = f.title.replace(/'/g, "");
  const subtitleClean = f.subtitle.replace(/'/g, "");

  const filter = `
zoompan=z='min(zoom+0.0008,1.06)':d=150:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080[v0];
[v0]drawbox=x=80:y=890:w=1760:h=120:color=0x0f141fe0@0.9:t=fill[v1];
[v1]drawbox=x=80:y=890:w=10:h=120:color=0x00c8b3:t=fill[v2];
[v2]drawtext=text='${titleClean}':fontsize=30:fontcolor=white:x=120:y=915:shadowcolor=black@0.8:shadowx=2:shadowy=2,
drawtext=text='${subtitleClean}':fontsize=20:fontcolor=0x00c8b3:x=120:y=960:shadowcolor=black@0.8:shadowx=2:shadowy=2[v]
`.replace(/\n/g, '');

  execSync(`/opt/homebrew/bin/ffmpeg -y -loop 1 -i "${imgPath}" -vf "${filter}" -t 5 -c:v libx264 -pix_fmt yuv420p -r 30 "${outClip}"`, { stdio: 'inherit' });
  clipFiles.push(outClip);
});

// 3. Outro clip
const outroClip = path.join(FRAMES_DIR, 'clip_outro.mp4');
const outroFilter = `
color=c=0x0b0f19:s=1920x1080:d=5[bg];
[bg]drawtext=text='AeroPulse is Live & Open Source':fontsize=56:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-90:shadowcolor=black@0.8:shadowx=3:shadowy=3,
drawtext=text='Live Web App':fontsize=26:fontcolor=0x94a3b8:x=(w-text_w)/2:y=(h-text_h)/2-10,
drawtext=text='https\\://ramng-rgb.github.io/Promptwar/':fontsize=32:fontcolor=0x00c8b3:x=(w-text_w)/2:y=(h-text_h)/2+30,
drawtext=text='GitHub Repository':fontsize=24:fontcolor=0x94a3b8:x=(w-text_w)/2:y=(h-text_h)/2+90,
drawtext=text='https\\://github.com/ramng-rgb/Promptwar':fontsize=28:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2+130[v]
`.replace(/\n/g, '');

execSync(`/opt/homebrew/bin/ffmpeg -y -f lavfi -i "${outroFilter}" -c:v libx264 -pix_fmt yuv420p -r 30 "${outroClip}"`, { stdio: 'inherit' });
clipFiles.push(outroClip);

// Create concat list file
const concatListFile = path.join(FRAMES_DIR, 'concat.txt');
fs.writeFileSync(concatListFile, clipFiles.map(c => `file '${c}'`).join('\n'));

// Generate ambient background audio track matching total video duration (~44s)
const audioTrack = path.join(FRAMES_DIR, 'audio.aac');
execSync(`/opt/homebrew/bin/ffmpeg -y -f lavfi -i "aevalsrc=sin(2*PI*180*t)*exp(-3*mod(t,1.2))*0.15+sin(2*PI*220*t)*0.08+sin(2*PI*330*t)*exp(-4*mod(t,2.4))*0.12:d=44:s=44100" -c:a aac -b:a 192k "${audioTrack}"`, { stdio: 'inherit' });

// Concat clips and mux audio
console.log('Concatenating clips into final demo video...');
execSync(`/opt/homebrew/bin/ffmpeg -y -f concat -safe 0 -i "${concatListFile}" -i "${audioTrack}" -c:v libx264 -preset fast -crf 20 -c:a aac -shortest "${OUTPUT_VIDEO}"`, { stdio: 'inherit' });

// Also copy to root for easy user download/preview
fs.copyFileSync(OUTPUT_VIDEO, ROOT_OUTPUT);

console.log(`Video successfully created at: ${ROOT_OUTPUT}`);
console.log(`Public video also placed at: ${OUTPUT_VIDEO}`);
