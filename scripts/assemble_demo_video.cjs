const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FRAMES_DIR = path.join(__dirname, '../demo_frames');
const OUTPUT_VIDEO = path.join(__dirname, '../AeroPulse_Demo_Video.mp4');
const PUBLIC_VIDEO = path.join(__dirname, '../public/aeropulse_demo.mp4');

const scenes = [
  { file: '00_intro.png', duration: 4 },
  { file: '01_hero.png', duration: 5 },
  { file: '02_pollutants.png', duration: 5 },
  { file: '03_map.png', duration: 5 },
  { file: '04_scale.png', duration: 5 },
  { file: '05_rankings.png', duration: 5 },
  { file: '06_ai.png', duration: 5 },
  { file: '07_actions.png', duration: 5 },
  { file: '08_outro.png', duration: 5 },
];

console.log('Rendering high-definition clips for each scene...');
const clipPaths = [];

scenes.forEach((sc, i) => {
  const inImg = path.join(FRAMES_DIR, sc.file);
  const outClip = path.join(FRAMES_DIR, `scene_${i}.mp4`);
  const fps = 30;
  const totalFrames = sc.duration * fps;

  // Zoompan filter for cinematic motion
  const filter = `zoompan=z='min(zoom+0.0006,1.04)':d=${totalFrames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080`;
  
  execSync(
    `/opt/homebrew/bin/ffmpeg -y -loop 1 -i "${inImg}" -vf "${filter}" -t ${sc.duration} -c:v libx264 -pix_fmt yuv420p -r ${fps} "${outClip}"`,
    { stdio: 'inherit' }
  );
  clipPaths.push(outClip);
});

// Write concat file
const concatFile = path.join(FRAMES_DIR, 'concat.txt');
fs.writeFileSync(concatFile, clipPaths.map(p => `file '${p}'`).join('\n'));

// Generate ambient melodic synth audio
const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
const audioFile = path.join(FRAMES_DIR, 'soundtrack.aac');
console.log(`Generating soundtrack for total duration: ${totalDuration}s...`);

execSync(
  `/opt/homebrew/bin/ffmpeg -y -f lavfi -i "aevalsrc=sin(2*PI*220*t)*exp(-2*mod(t,1))*0.08+sin(2*PI*330*t)*exp(-3*mod(t,2))*0.06+sin(2*PI*440*t)*exp(-4*mod(t,4))*0.05:d=${totalDuration}:s=44100" -c:a aac -b:a 192k "${audioFile}"`,
  { stdio: 'inherit' }
);

// Assemble final video
console.log('Assembling final composite MP4 video...');
execSync(
  `/opt/homebrew/bin/ffmpeg -y -f concat -safe 0 -i "${concatFile}" -i "${audioFile}" -c:v libx264 -preset medium -crf 19 -c:a aac -shortest "${OUTPUT_VIDEO}"`,
  { stdio: 'inherit' }
);

// Copy to public directory
fs.copyFileSync(OUTPUT_VIDEO, PUBLIC_VIDEO);

const stats = fs.statSync(OUTPUT_VIDEO);
console.log(`Demo video successfully assembled!`);
console.log(`Path: ${OUTPUT_VIDEO}`);
console.log(`Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
