function parseDate(dateString) {
  if (!dateString) return null;
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function diffYears(start, end) {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e || e < s) return 0;

  let years = e.getFullYear() - s.getFullYear();
  const monthDiff = e.getMonth() - s.getMonth();
  const dayDiff = e.getDate() - s.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) years -= 1;
  return Math.max(0, years);
}

function monthsWorkedForProportion(start, end) {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e || e < s) return 0;

  let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (e.getDate() >= 15) months += 1;
  return Math.min(12, Math.max(0, months));
}

module.exports = {
  parseDate,
  diffYears,
  monthsWorkedForProportion
};
