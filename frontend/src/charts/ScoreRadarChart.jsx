import { useMemo } from 'react';
import { Radar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { applyChartTheme, withAlpha } from './chartSetup.js';
import { CATEGORY_SCORES, OVERALL_SCORE } from '../data/dashboardSampleData.js';
import './charts.css';

// Radar of the five assessment categories for one sample architecture.
// One dataset only, so a single accent color is enough — no reliance on
// distinguishing multiple hues (each axis is already labeled by category name).
function ScoreRadarChart() {
  const { t } = useTranslation();

  const categoryLabels = CATEGORY_SCORES.map((c) => t(`categories.${c.id}`));
  const scores = CATEGORY_SCORES.map((c) => c.score);

  const { data, options } = useMemo(() => {
    const colors = applyChartTheme();
    return {
      data: {
        labels: categoryLabels,
        datasets: [
          {
            label: t('dashboard.charts.scoreRadar.datasetLabel'),
            data: scores,
            backgroundColor: withAlpha(colors.accent, 0.25),
            borderColor: colors.accent,
            pointBackgroundColor: colors.accent,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { stepSize: 20, backdropColor: 'transparent' },
            grid: { color: colors.border },
            angleLines: { color: colors.border },
            pointLabels: { color: colors.textSecondary },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  return (
    <figure className="chart-figure">
      {/* Canvas is decorative to assistive tech: the figcaption + hidden table below carry the same information as text. */}
      <div className="chart-canvas-wrap" aria-hidden="true">
        <Radar data={data} options={options} />
      </div>
      <figcaption className="chart-caption">{t('dashboard.charts.scoreRadar.caption', { score: OVERALL_SCORE })}</figcaption>
      <table className="visually-hidden">
        <caption>{t('dashboard.charts.scoreRadar.tableCaption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('dashboard.table.category')}</th>
            <th scope="col">{t('dashboard.table.score')}</th>
          </tr>
        </thead>
        <tbody>
          {CATEGORY_SCORES.map((c) => (
            <tr key={c.id}>
              <th scope="row">{t(`categories.${c.id}`)}</th>
              <td>{c.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export default ScoreRadarChart;
