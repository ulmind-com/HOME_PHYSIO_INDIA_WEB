import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/api/auth.service";
import { toast } from "sonner";
import { Camera, Loader2, Save, Calendar, Clock, MapPin, Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/user/dashboard")({
  component: UserDashboard,
});

function UserDashboard() {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Profile Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [isUploading, setIsUploading] = useState(false);

  // Queries
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ["myBookings"],
    queryFn: authService.getBookings,
  });

  // Mutations
  const updateProfileMut = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update profile.");
    }
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const updatedUser = await authService.uploadAvatar(file);
      setUser(updatedUser);
      toast.success("Profile picture updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload picture.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMut.mutate({ name, phone, address });
  };
  
  return (
    <div className="container-x py-24 md:py-32">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Patient Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your profile and track your healthcare bookings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Settings */}
          <div className="lg:col-span-1 space-y-8">
            <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" /> Profile Settings
              </h2>
              
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                    <AvatarImage src={user?.avatar?.url} alt={user?.name || "User"} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <label className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform group-hover:bg-primary/90">
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={isUploading} />
                  </label>
                </div>
                <p className="mt-4 font-medium text-foreground">{user?.email}</p>
                <div className="mt-1 inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                  Verified Account
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Detailed Address</label>
                  <textarea 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    rows={3}
                    className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none"
                    placeholder="Enter your complete address..."
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={updateProfileMut.isPending}
                  className="w-full mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                >
                  {updateProfileMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Historical Bookings */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-border bg-surface shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-border/50 bg-background/50 flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Booking History
                </h2>
              </div>
              
              <div className="p-6 md:p-8">
                {isLoadingBookings ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>Loading your appointments...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No bookings yet</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                      You haven't made any appointments. Book a trusted healthcare professional to your home today.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="p-5 rounded-2xl border border-border/60 hover:border-primary/30 hover:bg-primary-soft/30 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground text-lg">{booking.service_name}</h3>
                            <p className="text-sm text-muted-foreground">For: {booking.patient_name}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs font-medium text-muted-foreground">
                              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(booking.preferred_date).toLocaleDateString()}</span>
                              {booking.preferred_time && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {booking.preferred_time}</span>}
                            </div>
                            <p className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground line-clamp-1"><MapPin className="h-3 w-3 shrink-0" /> {booking.address}</p>
                          </div>
                          
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold
                              ${booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 
                                booking.status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-600' : 
                                booking.status === 'COMPLETED' ? 'bg-green-500/10 text-green-600' : 
                                'bg-red-500/10 text-red-600'}`}>
                              {booking.status}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{booking.reference}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// Just adding UserIcon because I aliased User in my head
const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
