import { Badge, Card, SectionHeader } from './ui/index.js';

// Shared body for feature pages that are planned but not built yet.
// Keeps the seven placeholder routes visually consistent without duplicating markup.
function PlaceholderPage({ title, description }) {
  return (
    <div className="stack">
      <SectionHeader
        level={1}
        title={title}
        description={description}
        actions={<Badge tone="info">Planned</Badge>}
      />
      <Card>
        <p>This feature is planned and not yet implemented.</p>
      </Card>
    </div>
  );
}

export default PlaceholderPage;
