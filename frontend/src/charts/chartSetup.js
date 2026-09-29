import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js requires each element/scale/plugin type to be registered once,
// globally, before any chart using it renders. Centralized here so every
// chart component just imports this module instead of repeating the list.
ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

// Reads real colors out of the Day 3 design tokens (tokens.css) so charts use
// the same palette as the rest of the app instead of new, hardcoded hex values.
// Read lazily (not at module load) so the tokens are already applied to <html>.
export function getChartColors() {
  const styles = getComputedStyle(document.documentElement);
  const v = (name) => styles.getPropertyValue(name).trim();
  return {
    accent: v('--accent'),
    accentHover: v('--accent-hover'),
    success: v('--success'),
    warning: v('--warning'),
    error: v('--error'),
    textPrimary: v('--text-primary'),
    textSecondary: v('--text-secondary'),
    border: v('--border'),
    bgCard: v('--bg-card'),
  };
}

export function getChartFontFamily() {
  return getComputedStyle(document.documentElement).getPropertyValue('--font-sans').trim();
}

// Shared look for every chart: axis/legend text in --text-secondary, gridlines
// in --border, tooltips styled like a Card (--bg-card / --border), and the
// existing font stack (which already switches to Noto Sans JP under lang="ja").
export function applyChartTheme() {
  const colors = getChartColors();
  const fontFamily = getChartFontFamily();

  ChartJS.defaults.color = colors.textSecondary;
  ChartJS.defaults.font.family = fontFamily;
  ChartJS.defaults.borderColor = colors.border;
  ChartJS.defaults.plugins.tooltip.backgroundColor = colors.bgCard;
  ChartJS.defaults.plugins.tooltip.titleColor = colors.textPrimary;
  ChartJS.defaults.plugins.tooltip.bodyColor = colors.textPrimary;
  ChartJS.defaults.plugins.tooltip.borderColor = colors.border;
  ChartJS.defaults.plugins.tooltip.borderWidth = 1;
  ChartJS.defaults.plugins.legend.labels.color = colors.textSecondary;

  return colors;
}

// Canvas fillStyle needs a plain rgb()/rgba() string. getComputedStyle() already
// resolves --accent etc. to "rgb(r, g, b)", so add alpha by string substitution
// rather than depending on canvas support for CSS color-mix().
export function withAlpha(rgbColor, alpha) {
  const match = rgbColor.match(/rgb\(([^)]+)\)/);
  return match ? `rgba(${match[1]}, ${alpha})` : rgbColor;
}

export default ChartJS;
