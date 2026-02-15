import type { PreviewModule } from '../../app/preview-registry';
import type { ControlModule } from '../../app/registry';
import type { ThemeConfig } from '../../compiler/types';
import { 
  getContrastRatio, 
  getWCAGLevel, 
} from '../../utils/colors';

export const accessibilityControlModule: ControlModule = {
  id: 'accessibility',
  title: 'Accessibility Audit',
  mount: (container) => {
    container.innerHTML = `
      <p class="controls-placeholder">
        The Master Audit scans all semantic color pairs and foundation tokens to ensure WCAG compliance.
      </p>
      <div style="padding: 1rem; background: var(--surface-bg); border-radius: 8px; border: 1px solid rgba(128,128,128,0.1); font-size: 11px; opacity: 0.8;">
        Use the live preview report to identify and fix contrast failures across your design system.
      </div>
    `;
  }
};

type AuditResult = {
  key: string;
  name: string;
  fg: string;
  bg: string;
  ratio: number;
  level: string;
  pass: boolean;
};

const renderAuditRow = (p: AuditResult) => {
  const statusColor = p.pass ? 'var(--color-success-500)' : 'var(--color-danger-500)';
  const onStatusColor = p.pass ? 'var(--on-success)' : 'var(--on-danger)';
  
  return `
    <div style="display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr; align-items: center; gap: 1rem; padding: 1rem; background: var(--surface-card); border-radius: 8px; border: 1px solid ${p.pass ? 'rgba(128,128,128,0.1)' : 'var(--color-danger-500)'};">
      <div>
        <div style="font-size: 12px; font-weight: 800;">${p.name}</div>
        <div style="font-size: 10px; opacity: 0.6; font-family: monospace;">${p.fg} on ${p.bg}</div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 24px; height: 24px; border-radius: 4px; border: 1px solid rgba(128,128,128,0.2); background: ${p.bg}; position: relative; display: flex; align-items: center; justify-content: center;">
          <span style="color: ${p.fg}; font-size: 14px; font-weight: 900;">A</span>
        </div>
        <span style="font-size: 11px; font-weight: 700;">${p.ratio.toFixed(2)}:1</span>
      </div>

      <div>
        <span style="font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: ${statusColor}; color: ${onStatusColor};">
          ${p.level}
        </span>
      </div>

      <div style="text-align: right;">
        ${p.pass ? '<span style="color: var(--color-success-500); font-size: 12px;">✔ Pass</span>' : `
          <button onclick="window.parent.auditFix('${p.key}', '${p.bg}', '${p.fg}')" 
                  style="font-size: 10px; padding: 4px 8px; border-radius: 4px; background: var(--color-primary-500); color: var(--on-primary); border: none; cursor: pointer; font-weight: 700;">
            Nudge Fix
          </button>
        `}
      </div>
    </div>
  `;
};

export const accessibilityPreviewModule: PreviewModule = {
  id: 'accessibility',
  title: 'Accessibility Master Audit',
  render: (config: ThemeConfig) => {
    const colors = config.colors;
    if (!colors) return '<p>No color configuration found.</p>';

    const n50 = colors.neutral?.[50] ?? '#fff';
    const n900 = colors.neutral?.[900] ?? '#000';

    const getOn = (bg: string) => {
        const r50 = getContrastRatio(bg, n50);
        const r900 = getContrastRatio(bg, n900);
        return r900 >= r50 ? n900 : n50;
    };

    const auditPair = (key: string, name: string, fg: string, bg: string): AuditResult => {
      const ratio = getContrastRatio(fg, bg);
      const level = getWCAGLevel(ratio);
      return { key, name, fg, bg, ratio, level, pass: level !== 'Fail' };
    };

    const pairs: AuditResult[] = [
      auditPair('primary', 'Primary vs Surface', colors.primary?.[500] ?? '', n50),
      auditPair('on-primary', 'Primary vs On-Primary', colors.primary?.[500] ?? '', getOn(colors.primary?.[500] ?? '')),
      auditPair('neutral-900', 'Text vs Surface', n900, n50), // Check text color vs background
      auditPair('success', 'Success vs On-Success', colors.success?.[500] ?? '', getOn(colors.success?.[500] ?? '')),
      auditPair('danger', 'Danger vs On-Danger', colors.danger?.[500] ?? '', getOn(colors.danger?.[500] ?? '')),
      auditPair('warning', 'Warning vs On-Warning', colors.warning?.[500] ?? '', getOn(colors.warning?.[500] ?? '')),
    ];

    if (colors.secondary) {
        pairs.push(auditPair('secondary', 'Secondary vs Surface', colors.secondary[500], n50));
    }
    if (colors.tertiary) {
        pairs.push(auditPair('tertiary', 'Tertiary vs Surface', colors.tertiary[500], n50));
    }

    const score = Math.round((pairs.filter(p => p.pass).length / pairs.length) * 100);
    let scoreColor = 'var(--color-danger-500)';
    if (score === 100) scoreColor = 'var(--color-success-500)';
    else if (score > 70) scoreColor = 'var(--color-warning-500)';

    return `
      <div style="color: var(--on-background); font-family: var(--font-family, sans-serif);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; padding: 1.5rem; background: var(--surface-card); border-radius: 12px; border: 1px solid rgba(128,128,128,0.1);">
          <div>
            <h3 style="margin: 0; font-size: 18px;">Theme Health Score</h3>
            <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.6;">Weighted audit of semantic contrast pairs.</p>
          </div>
          <div style="font-size: 32px; font-weight: 800; color: ${scoreColor}">${score}%</div>
        </div>

        <div style="display: grid; gap: 12px;">
          ${pairs.map(p => renderAuditRow(p)).join('')}
        </div>
      </div>
    `;
  }
};
