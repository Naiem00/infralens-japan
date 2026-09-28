import { Button, Card, SectionHeader } from '../components/ui/index.js';

function NotFoundPage() {
  return (
    <div className="stack">
      <SectionHeader level={1} title="404 — Page Not Found" description="That page does not exist." />
      <Card>
        <Button to="/">Return to Dashboard</Button>
      </Card>
    </div>
  );
}

export default NotFoundPage;
