import { HomePageClient } from "../../../components/pages/HomePageClient";
import { DashboardShell } from "../../../components/layout/DashboardShell";

export default function HomePage() {
  return (
    <DashboardShell
      currentNav="home"
      title="Home"
      subtitle="Your teaching workspace overview"
    >
      <HomePageClient />
    </DashboardShell>
  );
}
