import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import scores from '../src/mock/scores.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'staff');
mkdirSync(outDir, { recursive: true });

/** 音高对应的 SVG Y 坐标（高音谱表近似位置） */
const NOTE_Y = {
  A3: 52,
  B3: 47,
  C4: 72,
  D4: 67,
  E4: 62,
  F4: 57,
  G4: 52,
  A4: 47,
  B4: 42,
  C5: 37,
  D5: 32,
  E5: 27,
};

const STAFF_LINES = [30, 40, 50, 60, 70];

/**
 * 根据音高数组生成五线谱 SVG
 * @param {string} title
 * @param {string[]} notes
 */
function buildStaffSvg(title, notes) {
  const width = Math.max(400, 60 + notes.length * 36);
  const noteEls = notes
    .map((note, i) => {
      const x = 80 + i * 32;
      const y = NOTE_Y[note] ?? 52;
      return `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#333"/>`;
    })
    .join('\n  ');

  const staffEls = STAFF_LINES.map(
    (y) =>
      `<line x1="40" y1="${y}" x2="${width - 20}" y2="${y}" stroke="#333" stroke-width="1.5"/>`,
  ).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 100" width="${width}" height="100">
  <text x="40" y="18" font-size="12" fill="#666">${title}</text>
  ${staffEls}
  <text x="48" y="58" font-size="28" fill="none" stroke="#333" stroke-width="1.5">𝄞</text>
  ${noteEls}
</svg>`;
}

for (const score of scores) {
  const svg = buildStaffSvg(score.title, score.noteArray);
  const filePath = join(outDir, `score-${score.id}.svg`);
  writeFileSync(filePath, svg, 'utf-8');
  console.log('Wrote', filePath);
}
