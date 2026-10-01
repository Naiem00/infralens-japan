import { useTranslation } from 'react-i18next';
import { classNames } from '../../utils/classNames.js';
import './RuleImpactList.css';

// Every item shows its sign-prefixed number as TEXT ("+10" / "-15"), not just
// a colored bar — so the positive/negative meaning never depends on color.
// Color (via severity) is additional reinforcement only.
function RuleImpactList({ rules }) {
  const { t } = useTranslation();

  if (rules.length === 0) {
    return <p className="rule-impact-list__empty">{t('assessment.noRulesApplied')}</p>;
  }

  return (
    <ul className="rule-impact-list">
      {rules.map((rule) => {
        const isPositive = rule.impact > 0;
        const sign = isPositive ? '+' : '';
        return (
          <li key={rule.ruleId} className="rule-impact-list__item">
            <span
              className={classNames(
                'rule-impact-list__impact',
                isPositive ? 'is-positive' : 'is-negative',
                rule.severity === 'critical' && 'is-critical'
              )}
            >
              {sign}
              {rule.impact}
            </span>
            <span className="rule-impact-list__description">{t(rule.descriptionKey)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default RuleImpactList;
