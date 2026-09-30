import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import './ConfigField.css';

// Renders one config field (boolean/number/select) as a native, semantic form
// control. Native controls are used deliberately — a real <input type="checkbox">
// or <select> gets correct keyboard behavior, labeling and screen-reader
// semantics for free, with none of the custom ARIA a styled toggle would need.
function ConfigField({ field, serviceId, value, errorKey, onChange }) {
  const { t } = useTranslation();
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const label = t(`architectureAnalyzer.fields.${field.key}`);

  if (field.type === 'boolean') {
    return (
      <div className="config-field config-field--boolean">
        <input
          id={fieldId}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(serviceId, field.key, e.target.checked)}
        />
        <label htmlFor={fieldId}>{label}</label>
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="config-field">
        <label htmlFor={fieldId}>{label}</label>
        <select
          id={fieldId}
          value={value}
          onChange={(e) => onChange(serviceId, field.key, e.target.value)}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // type === 'number'
  const hasError = Boolean(errorKey);
  return (
    <div className="config-field">
      <label htmlFor={fieldId}>{label}</label>
      <input
        id={fieldId}
        type="number"
        min={field.min}
        max={field.max}
        value={value}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        onChange={(e) => onChange(serviceId, field.key, e.target.value)}
      />
      {hasError && (
        <p id={errorId} className="config-field__error" role="alert">
          {t(`architectureAnalyzer.validation.${errorKey}`, { min: field.min, max: field.max })}
        </p>
      )}
    </div>
  );
}

export default ConfigField;
