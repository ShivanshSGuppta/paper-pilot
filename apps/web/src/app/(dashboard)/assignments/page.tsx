import { DashboardShell } from "../../../components/layout/DashboardShell";
import { AssignmentsPageClient } from "../../../components/assignments/AssignmentsPageClient";

export default function AssignmentsPage() {
  return (
    <DashboardShell
      currentNav="assignments"
      title="Assignments"
      subtitle="Manage and create assignments for your classes"
    >
      <AssignmentsPageClient />
    </DashboardShell>
  );
}
