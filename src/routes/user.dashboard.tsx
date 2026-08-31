import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/user/dashboard")({
  component: UserDashboard,
});

function UserDashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div className="container-x py-24 md:py-32">
      <h1 className="text-3xl font-display font-bold">Patient Dashboard</h1>
      <p className="mt-4 text-muted-foreground">Welcome back, {user?.name}!</p>
      
      <div className="mt-8 rounded-3xl border border-border bg-surface p-8">
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
        <p className="text-sm text-muted-foreground">You have no upcoming appointments.</p>
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
