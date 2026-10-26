export function identifySide(value) {
  const s = String(value ?? '').trim();
  if (!/^\d+$/.test(s)) return s ? 'Verificar' : '';
  const n = Number(s);
  if (!Number.isSafeInteger(n) || n <= 0) return 'Verificar';
  return n % 2 === 0 ? 'Par' : 'Ímpar';
}
export function formatDatePt(value) { return value ? value.split('-').reverse().join('/') : '-'; }
export const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
