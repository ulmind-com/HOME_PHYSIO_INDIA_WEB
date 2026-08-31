import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/therapist/dashboard")({
  component: TherapistDashboard,
});

function TherapistDashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div className="container-x py-24 md:py-32">
      <h1 className="text-3xl font-display font-bold text-primary">Therapist Dashboard</h1>
      <p className="mt-4 text-muted-foreground">Welcome back, {user?.name}!</p>
      
      <div className="mt-8 rounded-3xl border border-border bg-surface p-8">
        <h2 className="text-xl font-semibold mb-4">Your Schedule</h2>
        <p className="text-sm text-muted-foreground">No upcoming patients assigned to you yet.</p>
      </div>
      
      <button 
        onClick={logout}
        className="mt-8 px-6 py-2 rounded-full bg-destructive text-destructive-foreground hover:opacity-90"
      >
        Sign Out
      </button>
    </div>
  );
}
