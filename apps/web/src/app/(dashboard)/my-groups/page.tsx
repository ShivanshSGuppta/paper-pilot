import { GroupsPageClient } from "../../../components/pages/GroupsPageClient";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export default function MyGroupsPage() {
  return (
    <DashboardShell
      currentNav="groups"
      title="My Groups"
      subtitle="Class sections, assignment load, and coverage snapshots"
    >
      <GroupsPageClient />
    </DashboardShell>
  );
}
