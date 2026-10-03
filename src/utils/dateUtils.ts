/**
 * Utility to format English date strings (e.g., "02 – 04 Oct 2026", "Fri 02 Oct", "20 Oct 2024")
 * into localized Vietnamese equivalents when lang === 'vi'.
 */

const MONTH_MAP_VI: Record<string, string> = {
  Jan: 'Thg 1',
  Feb: 'Thg 2',
  Mar: 'Thg 3',
  Apr: 'Thg 4',
  May: 'Thg 5',
  Jun: 'Thg 6',
  Jul: 'Thg 7',
  Aug: 'Thg 8',
  Sep: 'Thg 9',
  Oct: 'Thg 10',
  Nov: 'Thg 11',
  Dec: 'Thg 12',
  January: 'Tháng 1',
  February: 'Tháng 2',
  March: 'Tháng 3',
  April: 'Tháng 4',
  June: 'Tháng 6',
  July: 'Tháng 7',
  August: 'Tháng 8',
  September: 'Tháng 9',
  October: 'Tháng 10',
  November: 'Tháng 11',
  December: 'Tháng 12',
};

const DAY_MAP_VI: Record<string, string> = {
  Mon: 'T2',
  Tue: 'T3',
  Wed: 'T4',
  Thu: 'T5',
  Fri: 'T6',
  Sat: 'T7',
  Sun: 'CN',
  Monday: 'Thứ 2',
  Tuesday: 'Thứ 3',
  Wednesday: 'Thứ 4',
  Thursday: 'Thứ 5',
  Friday: 'Thứ 6',
  Saturday: 'Thứ 7',
  Sunday: 'Chủ Nhật',
};

export function formatDateStr(dateStr: string | undefined, lang: string): string {
  if (!dateStr) return '';
  if (lang !== 'vi') return dateStr;

  let localized = dateStr;

  // Replace English month names
  Object.entries(MONTH_MAP_VI).forEach(([en, vi]) => {
    // Match whole words to avoid partial matching errors
    const regex = new RegExp(`\\b${en}\\b`, 'g');
    localized = localized.replace(regex, vi);
  });

  // Replace English day names
  Object.entries(DAY_MAP_VI).forEach(([en, vi]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'g');
    localized = localized.replace(regex, vi);
  });

  return localized;
}
