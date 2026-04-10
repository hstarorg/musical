import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIZE = 1024;
const ICON_SIZE = 192; // Android adaptive icon foreground

// 音符 + 波形圆环设计
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <!-- 主背景渐变 -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="50%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>

    <!-- 光晕 -->
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>

    <!-- 波形环渐变 -->
    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.6)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.15)"/>
    </linearGradient>
  </defs>

  <!-- 圆角背景 -->
  <rect width="${SIZE}" height="${SIZE}" rx="220" fill="url(#bg)"/>

  <!-- 顶部光晕 -->
  <rect width="${SIZE}" height="${SIZE}" rx="220" fill="url(#glow)"/>

  <!-- 波形条（短小，贴近白圆边缘） -->
  ${generateBars(512, 480, 290, 60)}

  <!-- 中心白色大圆（带阴影） -->
  <circle cx="512" cy="484" r="280" fill="rgba(0,0,0,0.12)"/>
  <circle cx="512" cy="480" r="280" fill="white"/>

  <!-- 大音符（放大） -->
  <g transform="translate(505, 458) scale(1.3)">
    <ellipse cx="-8" cy="62" rx="52" ry="40" fill="#e63946"/>
    <rect x="36" y="-110" width="14" height="176" rx="7" fill="#e63946"/>
    <path d="M50,-110 C105,-92 98,-48 55,-45 L50,-50 Z" fill="#e63946"/>
  </g>
</svg>
`;

function generateBars(cx, cy, radius, maxHeight) {
  const count = 36;
  let bars = '';
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    // 伪随机高度（固定 seed 保证一致性）
    const seed = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    const h = 15 + (seed - Math.floor(seed)) * maxHeight;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const x1 = cx + (radius + 25) * cos;
    const y1 = cy + (radius + 25) * sin;
    const x2 = cx + (radius + 25 + h) * cos;
    const y2 = cy + (radius + 25 + h) * sin;

    const opacity = 0.6 + (h / (15 + maxHeight)) * 0.4;
    bars += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="9" stroke-linecap="round" opacity="${opacity.toFixed(2)}"/>`;
  }
  return bars;
}

const assetsDir = path.join(__dirname, '..', 'assets', 'images');
const docsDir = path.join(__dirname, '..', 'docs', 'public');

const svgBuffer = Buffer.from(svg);

// 生成各种尺寸
async function generate() {
  // App 图标 1024x1024
  await sharp(svgBuffer).resize(1024, 1024).png().toFile(path.join(assetsDir, 'icon.png'));
  console.log('✓ icon.png (1024x1024)');

  // Splash icon
  await sharp(svgBuffer).resize(200, 200).png().toFile(path.join(assetsDir, 'splash-icon.png'));
  console.log('✓ splash-icon.png (200x200)');

  // Favicon
  await sharp(svgBuffer).resize(48, 48).png().toFile(path.join(assetsDir, 'favicon.png'));
  console.log('✓ favicon.png (48x48)');

  // Android adaptive icon foreground (无圆角，系统会裁切)
  const androidSvg = svg.replace('rx="220"', 'rx="0"').replace('rx="220"', 'rx="0"');
  await sharp(Buffer.from(androidSvg)).resize(1024, 1024).png().toFile(path.join(assetsDir, 'android-icon-foreground.png'));
  console.log('✓ android-icon-foreground.png (1024x1024)');

  // 官网 logo
  await sharp(svgBuffer).resize(256, 256).png().toFile(path.join(docsDir, 'logo.png'));
  console.log('✓ docs/logo.png (256x256)');

  console.log('\nDone! All icons generated.');
}

generate().catch(console.error);
