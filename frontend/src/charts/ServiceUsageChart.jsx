import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { applyChartTheme } from './chartSetup.js';
import { SERVICE_USAGE } from '../data/dashboardSampleData.js';
import './charts.css';

// How many sample architectures use each AWS service. Distinguished by both
// color AND the legend's text labels, so it never depends on color alone.
function ServiceUsageChart() {
  const { t } = useTranslation();

  const labels = SERVICE_USAGE.map((s) => t(`dashboard.services.${s.id}`));
  const counts = SERVICE_USAGE.map((s) => s.count);
  const mostUsed = [...SERVICE_USAGE].sort((a, b) => b.count - a.count)[0];

  const { data, options } = useMemo(() => {
    const colors = applyChartTheme();
    // Six slices drawn only from existing design tokens (no new hex values).
    const palette = [
      colors.accent,
      colors.success,
      colors.warning,
      colors.error,
      colors.accentHover,
      colors.textSecondary,
    ];
    return {
      data: {
        labels,
        datasets: [
          {
            label: t('dashboard.charts.serviceUsage.datasetLabel'),
            data: counts,
            backgroundColor: palette,
            borderColor: colors.bgCard,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  return (
    <figure className="chart-figure">
      <div className="chart-canvas-wrap" aria-hidden="true">
        <Doughnut data={data} options={options} />
      </div>
      <figcaption className="chart-caption">
        {t('dashboard.charts.serviceUsage.caption', {
          service: t(`dashboard.services.${mostUsed.id}`),
          count: mostUsed.count,
        })}
      </figcaption>
      <table className="visually-hidden">
        <caption>{t('dashboard.charts.serviceUsage.tableCaption')}</caption>
        <thead>
          <tr>
            <th scope="col">{t('dashboard.table.service')}</th>
            <th scope="col">{t('dashboard.table.count')}</th>
          </tr>
        </thead>
        <tbody>
          {SERVICE_USAGE.map((s) => (
            <tr key={s.id}>
              <th scope="row">{t(`dashboard.services.${s.id}`)}</th>
              <td>{s.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export default ServiceUsageChart;
