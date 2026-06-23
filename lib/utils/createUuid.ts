export function createUuid(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `uuid-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  );
}
