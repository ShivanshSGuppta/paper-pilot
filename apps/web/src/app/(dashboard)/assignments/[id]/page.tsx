import { DashboardShell } from "../../../../components/layout/DashboardShell";
import { AssignmentResultClient } from "../../../../components/result/AssignmentResultClient";

export default async function AssignmentDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardShell
      currentNav="toolkit"
      title="Generated Paper"
      subtitle="Live generation status, paper review, and export"
      showBack
    >
      <AssignmentResultClient assignmentId={id} />
    </DashboardShell>
  );
}
