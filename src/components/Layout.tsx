import { Outlet } from "react-router-dom";
import { WeddingNavigation } from "./WeddingNavigation";

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <WeddingNavigation />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}