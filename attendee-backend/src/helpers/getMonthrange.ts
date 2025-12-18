function getMonthRange(month?: string) {
  // month format: YYYY-MM (e.g. "2025-12")
  let year: number;
  let monthIndex: number;

  if (month) {
    const [y, m] = month.split('-').map(Number);
    year = y;
    monthIndex = m - 1;
  } else {
    const now = new Date();
    year = now.getFullYear();
    monthIndex = now.getMonth();
  }

  const start = new Date(year, monthIndex, 1, 0, 0, 0);
  const end = new Date(year, monthIndex + 1, 0, 23, 59, 59);

  return { start, end };
}

export default getMonthRange;
