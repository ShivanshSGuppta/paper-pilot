import { LibraryPageClient } from "../../../components/pages/LibraryPageClient";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export default function LibraryPage() {
  return (
    <DashboardShell
      currentNav="library"
      title="My Library"
      subtitle="Reference material, rubrics, and source packs"
    >
      <LibraryPageClient />
    </DashboardShell>
  );
}
