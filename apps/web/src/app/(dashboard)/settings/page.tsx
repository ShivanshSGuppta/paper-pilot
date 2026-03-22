import { SettingsPageClient } from "../../../components/pages/SettingsPageClient";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export default function SettingsPage() {
  return (
    <DashboardShell
      currentNav="settings"
      title="Settings"
      subtitle="Teacher profile, school details, and presentation defaults"
    >
      <SettingsPageClient />
    </DashboardShell>
  );
}
