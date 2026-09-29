import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { applyChartTheme, withAlpha } from './chartSetup.js';
import { ASSESSMENT_HISTORY } from '../data/dashboardSampleData.js';
import './charts.css';

// Score trend for one sample architecture across its last 6 assessments.
function AssessmentHistoryChart() {
  const { t, i18n } = useTranslation();

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(i18n.resolvedLanguage, { year: 'numeric', month: 'short', day: 'numeric' });

  const labels = ASSESSMENT_HISTORY.map((entry) => formatDate(entry.date));
  const scores = ASSESSMENT_HISTORY.map((entry) => entry.score);
  const latest = ASSESSMENT_HISTORY[ASSESSMENT_HISTORY.length - 1];

  const { data, options } = useMemo(() => {
    const colors = applyChartTheme();
    return {
      data: {
        labels,
        datasets: [
          {
            label: t('dashboard.charts.assessmentHistory.datasetLabel'),
            data: scores,
            borderColor: colors.accent,
            backgroundColor: withAlpha(colors.accent, 0.15),
            pointBackgroundColor: colors.accent,
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { min: 0, max: 100, ticks: { stepSize: 20 }, grid: { color: colors.border } },
          x: { grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, i18n.resolvedLanguage]);

  return (
    <figure className="chart-figure">
      <div className="chart-canvas-wrap" aria-hidden="true">
        <Line data={data} options={options} />
      </div>
      <figcaption className="chart-caption">
        {t('dashboard.charts.assessmentHistory.caption', { score: latest.score })}
      </figcaption>
      <table className="visually-hidden">
        <caption>{t('dashboard.charts.assessmentHistory.tableCaption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('dashboard.table.date')}</th>
            <th scope="col">{t('dashboard.table.score')}</th>
          </tr>
        </thead>
        <tbody>
          {ASSESSMENT_HISTORY.map((entry) => (
            <tr key={entry.id}>
              <th scope="row">{formatDate(entry.date)}</th>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export default AssessmentHistoryChart;
