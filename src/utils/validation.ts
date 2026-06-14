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

/** 校验结果 */
export interface ValidationResult {
  /** 是否正确 */
  correct: boolean;
  /** 第一个不匹配的位置索引（从 0 开始），正确时为 -1，长度不匹配时为较短数组的长度 */
  mismatchIndex: number;
  /** 输入长度是否与预期长度一致 */
  lengthMatch: boolean;
  /** 预期答案的元素个数 */
  expectedCount: number;
  /** 用户输入的元素个数 */
  userCount: number;
}

/**
 * 比对简谱答案
 */
export function checkJianpuAnswer(userInput: string, expected: string): ValidationResult {
  const userParts = normalizeJianpu(userInput).split(' ').filter(Boolean);
  const expectedParts = normalizeJianpu(expected).split(' ').filter(Boolean);
  const minLen = Math.min(userParts.length, expectedParts.length);

  for (let i = 0; i < minLen; i++) {
    if (userParts[i] !== expectedParts[i]) {
      return {
        correct: false,
        mismatchIndex: i,
        lengthMatch: userParts.length === expectedParts.length,
        expectedCount: expectedParts.length,
        userCount: userParts.length,
      };
    }
  }

  if (userParts.length !== expectedParts.length) {
    return {
      correct: false,
      mismatchIndex: minLen,
      lengthMatch: false,
      expectedCount: expectedParts.length,
      userCount: userParts.length,
    };
  }

  return {
    correct: true,
    mismatchIndex: -1,
    lengthMatch: true,
    expectedCount: expectedParts.length,
    userCount: userParts.length,
  };
}

/**
 * 比对音高数组答案（忽略大小写）
 */
export function checkNoteArrayAnswer(userInput: string, expected: string[]): ValidationResult {
  const userNotes = parseNoteInput(userInput);
  const minLen = Math.min(userNotes.length, expected.length);

  for (let i = 0; i < minLen; i++) {
    if (userNotes[i].toUpperCase() !== expected[i].toUpperCase()) {
      return {
        correct: false,
        mismatchIndex: i,
        lengthMatch: userNotes.length === expected.length,
        expectedCount: expected.length,
        userCount: userNotes.length,
      };
    }
  }

  if (userNotes.length !== expected.length) {
    return {
      correct: false,
      mismatchIndex: minLen,
      lengthMatch: false,
      expectedCount: expected.length,
      userCount: userNotes.length,
    };
  }

  return {
    correct: true,
    mismatchIndex: -1,
    lengthMatch: true,
    expectedCount: expected.length,
    userCount: userNotes.length,
  };
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
