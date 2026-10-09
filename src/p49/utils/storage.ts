/** localStorage that never throws (private windows, blocked storage). */
export const store = {
  get(key: string): string | null { try { return localStorage.getItem(key); } catch { return null; } },
  set(key: string, value: string) { try { localStorage.setItem(key, value); } catch { /* ignore */ } },
  del(key: string) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
};
export const KEYS = { sound: 'p49.sound', filmSeen: 'p49.filmSeen', motion: 'p49.motion', index: 'p49.humanIndex' };
