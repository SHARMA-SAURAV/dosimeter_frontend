export const cpmToUSv = (cpm) => (parseFloat(cpm) * 0.0057).toFixed(3);

export const generateTrend = (data) => {
  if (data.length < 10) return '0%';
  const latest = parseFloat(data[data.length - 1].cpm);
  const previous = parseFloat(data[data.length - 10].cpm || latest);
  const trend = ((latest - previous) / previous) * 100;
  return `${trend.toFixed(1)}%`;
};
