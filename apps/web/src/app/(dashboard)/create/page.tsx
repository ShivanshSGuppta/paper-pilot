import { DashboardShell } from "../../../components/layout/DashboardShell";
import { CreateAssignmentClient } from "../../../components/create/CreateAssignmentClient";

export default function CreatePage() {
  return (
    <DashboardShell
      currentNav="assignments"
      title="Create Assignment"
      subtitle="Set up the blueprint, upload reference material, and generate live"
    >
      <CreateAssignmentClient />
    </DashboardShell>
  );
}
