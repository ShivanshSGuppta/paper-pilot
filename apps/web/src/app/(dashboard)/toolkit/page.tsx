import { ToolkitPageClient } from "../../../components/pages/ToolkitPageClient";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export default function ToolkitPage() {
  return (
    <DashboardShell
      currentNav="toolkit"
      title="AI Teacher's Toolkit"
      subtitle="Completed outputs, PDF export, and paper review"
    >
      <ToolkitPageClient />
    </DashboardShell>
  );
}
