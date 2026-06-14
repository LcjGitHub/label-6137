import type { HideMode } from '@/types/score';

/** 本地存储中保存隐藏模式的 key */
const HIDE_MODE_KEY = 'practice_hide_mode';

/** 默认隐藏模式：隐藏简谱 */
const DEFAULT_HIDE_MODE: HideMode = 'jianpu';

/**
 * 从本地存储读取用户上次选择的练习隐藏模式。
 *
 * 容错处理：
 * - 若本地存储不存在对应条目或值非法，返回默认模式
 * - 若浏览器环境不支持本地存储（如隐私模式），静默返回默认模式
 *
 * @returns 用户记忆的隐藏模式，若无记忆则返回默认的 'jianpu'
 */
export function getStoredHideMode(): HideMode {
  try {
    const stored = localStorage.getItem(HIDE_MODE_KEY);
    if (stored === 'jianpu' || stored === 'staff') {
      return stored;
    }
    return DEFAULT_HIDE_MODE;
  } catch {
    return DEFAULT_HIDE_MODE;
  }
}

/**
 * 将用户当前选择的练习隐藏模式写入本地存储。
 *
 * 仅在用户手动切换模式时调用，随机练习等自动分配模式的场景不应调用，
 * 避免覆盖用户已记忆的偏好。
 *
 * 容错处理：
 * - 若浏览器环境不支持本地存储（如隐私模式、配额超限），静默忽略异常
 *
 * @param mode - 用户手动选择的隐藏模式
 */
export function setStoredHideMode(mode: HideMode): void {
  try {
    localStorage.setItem(HIDE_MODE_KEY, mode);
  } catch {
    // ignore
  }
}
