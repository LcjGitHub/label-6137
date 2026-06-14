/**
 * 规范化简谱字符串：统一分隔符、去除多余空白
 */
export function normalizeJianpu(text: string): string {
  return text
    .trim()
    .replace(/[，,]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * 解析简谱为分段数组，按竖线 | 分隔，每段内再按空格拆分为音符
 */
function parseJianpuSegments(text: string): string[][] {
  const normalized = normalizeJianpu(text);
  return normalized
    .split('|')
    .map((seg) => seg.trim().split(' ').filter(Boolean))
    .filter((seg) => seg.length > 0);
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
  /** 第一个不匹配的位置索引（从 0 开始），正确时为 -1 */
  mismatchIndex: number;
  /** 输入长度是否与预期长度一致 */
  lengthMatch: boolean;
  /** 预期答案的元素个数 */
  expectedCount: number;
  /** 用户输入的元素个数 */
  userCount: number;
  /** 是否存在内容错误（已输入部分中有不正确的内容），用于优先级判断 */
  hasContentMismatch: boolean;
  /** 简谱分段不匹配的段索引（从 0 开始），仅简谱校验且分段不匹配时有值，否则为 -1 */
  jianpuSegmentIndex: number;
}

/**
 * 比对简谱答案
 */
export function checkJianpuAnswer(userInput: string, expected: string): ValidationResult {
  const userSegments = parseJianpuSegments(userInput);
  const expectedSegments = parseJianpuSegments(expected);

  const userParts = userSegments.flat();
  const expectedParts = expectedSegments.flat();

  const userCount = userParts.length;
  const expectedCount = expectedParts.length;
  const lengthMatch = userCount === expectedCount;

  let mismatchIndex = -1;
  let hasContentMismatch = false;
  let jianpuSegmentIndex = -1;

  let userNoteOffset = 0;
  let expectedNoteOffset = 0;
  const minSegLen = Math.min(userSegments.length, expectedSegments.length);

  for (let segIdx = 0; segIdx < minSegLen; segIdx++) {
    const userSeg = userSegments[segIdx];
    const expectedSeg = expectedSegments[segIdx];

    if (userSeg.length !== expectedSeg.length) {
      jianpuSegmentIndex = segIdx;
      const minNoteLen = Math.min(userSeg.length, expectedSeg.length);
      let segHasContentMismatch = false;
      let firstContentMismatch = -1;

      for (let i = 0; i < minNoteLen; i++) {
        if (userSeg[i] !== expectedSeg[i]) {
          segHasContentMismatch = true;
          firstContentMismatch = i;
          break;
        }
      }

      if (segHasContentMismatch) {
        hasContentMismatch = true;
        mismatchIndex = userNoteOffset + firstContentMismatch;
        jianpuSegmentIndex = -1;
      } else {
        mismatchIndex = userNoteOffset + minNoteLen;
      }

      return {
        correct: false,
        mismatchIndex,
        lengthMatch,
        expectedCount,
        userCount,
        hasContentMismatch,
        jianpuSegmentIndex,
      };
    }

    for (let i = 0; i < userSeg.length; i++) {
      if (userSeg[i] !== expectedSeg[i]) {
        mismatchIndex = userNoteOffset + i;
        hasContentMismatch = true;
        return {
          correct: false,
          mismatchIndex,
          lengthMatch,
          expectedCount,
          userCount,
          hasContentMismatch,
          jianpuSegmentIndex: -1,
        };
      }
    }

    userNoteOffset += userSeg.length;
    expectedNoteOffset += expectedSeg.length;
  }

  if (userSegments.length !== expectedSegments.length) {
    jianpuSegmentIndex = minSegLen;
    mismatchIndex = Math.min(userCount, expectedCount);

    return {
      correct: false,
      mismatchIndex,
      lengthMatch,
      expectedCount,
      userCount,
      hasContentMismatch: false,
      jianpuSegmentIndex,
    };
  }

  if (userCount !== expectedCount) {
    mismatchIndex = Math.min(userCount, expectedCount);
    return {
      correct: false,
      mismatchIndex,
      lengthMatch,
      expectedCount,
      userCount,
      hasContentMismatch: false,
      jianpuSegmentIndex: -1,
    };
  }

  return {
    correct: true,
    mismatchIndex: -1,
    lengthMatch: true,
    expectedCount,
    userCount,
    hasContentMismatch: false,
    jianpuSegmentIndex: -1,
  };
}

/**
 * 比对音高数组答案（忽略大小写）
 */
export function checkNoteArrayAnswer(userInput: string, expected: string[]): ValidationResult {
  const userNotes = parseNoteInput(userInput);
  const minLen = Math.min(userNotes.length, expected.length);
  const lengthMatch = userNotes.length === expected.length;

  for (let i = 0; i < minLen; i++) {
    if (userNotes[i].toUpperCase() !== expected[i].toUpperCase()) {
      return {
        correct: false,
        mismatchIndex: i,
        lengthMatch,
        expectedCount: expected.length,
        userCount: userNotes.length,
        hasContentMismatch: true,
        jianpuSegmentIndex: -1,
      };
    }
  }

  if (!lengthMatch) {
    return {
      correct: false,
      mismatchIndex: minLen,
      lengthMatch,
      expectedCount: expected.length,
      userCount: userNotes.length,
      hasContentMismatch: false,
      jianpuSegmentIndex: -1,
    };
  }

  return {
    correct: true,
    mismatchIndex: -1,
    lengthMatch: true,
    expectedCount: expected.length,
    userCount: userNotes.length,
    hasContentMismatch: false,
    jianpuSegmentIndex: -1,
  };
}

/**
 * 获取简谱提示：返回简谱文本的前三个字符
 */
export function getJianpuHint(jianpuText: string): string {
  const normalized = normalizeJianpu(jianpuText);
  const chars = normalized.replace(/\|/g, ' ').split(' ').filter(Boolean);
  return chars.slice(0, 3).join(' ');
}

/**
 * 获取音高提示：返回音高数组的前三个音高
 */
export function getNoteHint(noteArray: string[]): string {
  return noteArray.slice(0, 3).join(' ');
}
