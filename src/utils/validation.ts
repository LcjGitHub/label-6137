/**
 * 规范化简谱字符串：统一分隔符、去除多余空白
 */
export function normalizeJianpu(text: string): string {
  return text
    .trim()
    .replace(/[|，,]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * 解析用户输入的音高数组
 */
export function parseNoteInput(input: string): string[] {
  return input
    .trim()
    .split(/[\s,，|]+/)
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => n.toUpperCase());
}

/**
 * 比对简谱答案
 */
export function checkJianpuAnswer(userInput: string, expected: string): boolean {
  return normalizeJianpu(userInput) === normalizeJianpu(expected);
}

/**
 * 比对音高数组答案（忽略大小写）
 */
export function checkNoteArrayAnswer(userInput: string, expected: string[]): boolean {
  const userNotes = parseNoteInput(userInput);
  if (userNotes.length !== expected.length) return false;
  return userNotes.every(
    (note, i) => note.toUpperCase() === expected[i].toUpperCase(),
  );
}

/**
 * 获取简谱提示：返回简谱文本的前三个字符
 */
export function getJianpuHint(jianpuText: string): string {
  const normalized = normalizeJianpu(jianpuText);
  const chars = normalized.split(' ').filter(Boolean);
  return chars.slice(0, 3).join(' ');
}

/**
 * 获取音高提示：返回音高数组的前三个音高
 */
export function getNoteHint(noteArray: string[]): string {
  return noteArray.slice(0, 3).join(' ');
}
