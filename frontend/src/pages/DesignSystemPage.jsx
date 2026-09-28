import { Badge, Button, Card, SectionHeader, StatCard } from '../components/ui/index.js';
import './DesignSystemPage.css';

// DEV-ONLY style guide (route /design-system, excluded from production builds in App.jsx).
// Exists so the design system can be checked visually. Not a product feature, not in the nav.
// Strings here are intentionally not translated: this page never ships to users.

const palette = [
  '--bg-primary',
  '--bg-secondary',
  '--bg-card',
  '--accent',
  '--accent-hover',
  '--text-primary',
  '--text-secondary',
  '--success',
  '--warning',
  '--error',
  '--border',
];

const badgeTones = ['neutral', 'info', 'success', 'warning', 'error'];

function DesignSystemPage() {
  return (
    <div className="stack stack--lg">
      <SectionHeader
        level={1}
        title="Design System"
        description="Developer preview of tokens and reusable components. Available in development only."
        actions={<Badge tone="warning">Dev only</Badge>}
      />

      <section className="stack stack--sm">
        <SectionHeader level={2} title="Color tokens" />
        <div className="grid-auto">
          {palette.map((token) => (
            <div key={token} className="ds-swatch">
              <span className="ds-swatch__chip" style={{ background: `var(${token})` }} aria-hidden="true" />
              <code>{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="stack stack--sm">
        <SectionHeader level={2} title="Typography" />
        <Card className="stack stack--sm">
          <p>Inter — Assess your AWS architecture for reliability, security and cost.</p>
          <p lang="ja">Noto Sans JP — クラウド構成の信頼性・セキュリティ・コスト効率を診断します。</p>
        </Card>
      </section>

      <section className="stack stack--sm">
        <SectionHeader level={2} title="Buttons" />
        <div className="cluster">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
          <Button to="/" variant="secondary">
            Link button
          </Button>
        </div>
      </section>

      <section className="stack stack--sm">
        <SectionHeader level={2} title="Badges" />
        <div className="cluster">
          {badgeTones.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
      </section>

      <section className="stack stack--sm">
        <SectionHeader level={2} title="Stat cards" description="Sample Data / サンプルデータ — values are fictional." />
        <div className="grid-auto">
          <StatCard
            label="Architectures Created"
            value="12"
            helper="Sample value"
            badge={<Badge>Sample Data / サンプルデータ</Badge>}
          />
          <StatCard
            label="Average Score"
            value="68%"
            helper="Sample value"
            badge={<Badge>Sample Data / サンプルデータ</Badge>}
          />
          <StatCard
            label="Saved Designs"
            value="3"
            helper="Sample value"
            badge={<Badge>Sample Data / サンプルデータ</Badge>}
          />
        </div>
      </section>
    </div>
  );
}

export default DesignSystemPage;
