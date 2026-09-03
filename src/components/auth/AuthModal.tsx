import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/api/auth.service";
import { tokenStore } from "@/services/api/tokens";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { auth as firebaseAuth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { AlertCircle, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AUTH_DIALOG_EVENT } from "@/lib/auth-dialog";

type ViewState = "login" | "signup" | "therapist_signup" | "otp" | "phone_prompt";

const THERAPIST_TYPES = [
  { value: "physiotherapist", label: "Physiotherapist" },
  { value: "yoga_therapist", label: "Yoga Therapist" },
  { value: "massage_therapist", label: "Massage Therapist" },
];
const QUALIFICATIONS = ["MPT", "BPT", "PT", "DPT"];

export function AuthModal() {
  const { isAuthenticated, isLoading, setUser } = useAuth();
  const router = useRouter();
  
  const [view, setView] = useState<ViewState>("login");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The dialog is opened on demand — either by a "Sign in" affordance anywhere
  // in the app, or by the API client when a request comes back unauthorized.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onOpen = (e: Event) => {
      const next = (e as CustomEvent<{ view?: ViewState }>).detail?.view;
      if (next) setView(next);
      setError(null);
      setOpen(true);
    };
    const onExpired = () => {
      setView("login");
      setOpen(true);
    };
    window.addEventListener(AUTH_DIALOG_EVENT, onOpen);
    window.addEventListener("hpi:auth:session-expired", onExpired);
    return () => {
      window.removeEventListener(AUTH_DIALOG_EVENT, onOpen);
      window.removeEventListener("hpi:auth:session-expired", onExpired);
    };
  }, []);

  // Close automatically once the user is signed in.
  useEffect(() => {
    if (isAuthenticated) setOpen(false);
  }, [isAuthenticated]);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [googleIdToken, setGoogleIdToken] = useState("");
  const [therapistType, setTherapistType] = useState("physiotherapist");
  const [qualification, setQualification] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleError = useCallback((err: any) => {
    setError(err.message || "An unexpected error occurred");
  }, []);

  // Handle redirect result on mount (fallback for COOP-blocked popups)
  useEffect(() => {
    if (typeof window === "undefined") return;
    getRedirectResult(firebaseAuth)
      .then(async (result) => {
        if (!result) return;
        const idToken = await result.user.getIdToken();
        setGoogleIdToken(idToken);
        setLoading(true);
        try {
          const res = await authService.googleLogin(idToken);
          tokenStore.set(res.access_token, res.refresh_token);
          setUser(res.user);
          toast.success("Logged in with Google!");
          router.navigate({ to: res.user.role === "therapist" ? "/therapist/dashboard" : "/user/dashboard" });
        } catch (err: any) {
          const msg = (err.message || "").toLowerCase();
          if (msg.includes("phone") && msg.includes("required")) {
            setView("phone_prompt");
          } else {
            setError(err.message || "An unexpected error occurred");
          }
        } finally {
          setLoading(false);
        }
      })
      .catch((err: any) => {
        if (err?.code !== "auth/popup-closed-by-user") {
          const msg = err?.message || "Google sign-in failed";
          setError(msg);
          toast.error(msg);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);
      tokenStore.set(res.access_token, res.refresh_token);
      setUser(res.user);
      toast.success("Logged in successfully!");
      router.navigate({ to: res.user.role === "therapist" ? "/therapist/dashboard" : "/user/dashboard" });
    } catch (err: any) {
      if (err.message === "EMAIL_NOT_VERIFIED") {
        setView("otp");
        try {
          await authService.resendOtp(email);
          toast.info("Please verify your email. A new OTP has been sent.");
        } catch (resendErr: any) {
          toast.error(resendErr?.message || "Failed to send a new OTP. Use \"Resend Code\" to try again.");
        }
      } else {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, setUser]);

  const handleSignup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.register({ name, email, password, phone });
      toast.success("Registration successful! Check your email for the OTP.");
      setPendingVerification(false);
      setView("otp");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [name, email, password, phone]);

  const handleTherapistSignup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.registerTherapist({
        name,
        email,
        password,
        phone,
        user_type: therapistType as "physiotherapist" | "yoga_therapist" | "massage_therapist",
        qualification: qualification || undefined,
      });
      toast.success("Application submitted! Check your email for the OTP.");
      setPendingVerification(true);
      setView("otp");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [name, email, password, phone, therapistType, qualification]);

  const handleVerifyOtp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("OTP must be 6 digits"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await authService.verifyEmail(email, otp);
      tokenStore.set(res.access_token, res.refresh_token);
      setUser(res.user);
      if (pendingVerification || res.user.verification_status === "pending") {
        toast.success("Email verified! Your therapist application is now under review.");
      } else {
        toast.success("Email verified successfully!");
      }
      router.navigate({ to: res.user.role === "therapist" ? "/therapist/dashboard" : "/user/dashboard" });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [email, otp, setUser, pendingVerification]);

  const handleGoogleLogin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      let result;
      try {
        result = await signInWithPopup(firebaseAuth, provider);
      } catch (popupErr: any) {
        // If popup is blocked by COOP or user's browser, fall back to redirect
        if (
          popupErr.code === "auth/popup-blocked" ||
          popupErr.code === "auth/popup-closed-by-user" ||
          popupErr.code === "auth/internal-error"
        ) {
          await signInWithRedirect(firebaseAuth, provider);
          return; // Page will redirect; result handled on mount
        }
        throw popupErr;
      }
      const idToken = await result.user.getIdToken();
      setGoogleIdToken(idToken);
      
      const res = await authService.googleLogin(idToken);
      tokenStore.set(res.access_token, res.refresh_token);
      setUser(res.user);
      toast.success("Logged in with Google!");
      router.navigate({ to: res.user.role === "therapist" ? "/therapist/dashboard" : "/user/dashboard" });
    } catch (err: any) {
      const msg = (err.message || "").toLowerCase();
      if (msg.includes("phone") && msg.includes("required")) {
        setView("phone_prompt");
      } else {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const handleProvidePhone = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authService.googleLogin(googleIdToken, phone);
      tokenStore.set(res.access_token, res.refresh_token);
      setUser(res.user);
      toast.success("Account created successfully!");
      router.navigate({ to: res.user.role === "therapist" ? "/therapist/dashboard" : "/user/dashboard" });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [googleIdToken, phone, setUser]);

  // Early return AFTER all hooks
  if (isLoading || isAuthenticated || !open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold tracking-tight">
              {view === "login" && "Welcome Back"}
              {view === "signup" && "Create Account"}
              {view === "therapist_signup" && "Join as a Therapist"}
              {view === "otp" && "Verify Email"}
              {view === "phone_prompt" && "Almost There"}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {view === "login" && "Log in to book your home healthcare services"}
              {view === "signup" && "Join us to get premium healthcare at home"}
              {view === "therapist_signup" && "Register as a Physiotherapist, Yoga Therapist or Massage Therapist"}
              {view === "otp" && `We sent a 6-digit code to ${email}`}
              {view === "phone_prompt" && "Please provide a mobile number to complete your profile"}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {view === "login" && (
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full h-11 relative" 
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-5 h-5 absolute left-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <button type="button" className="text-primary hover:underline font-medium" onClick={() => { setView("signup"); setError(null); }}>
                  Sign up
                </button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Are you a therapist?{" "}
                <button type="button" className="text-primary hover:underline font-medium" onClick={() => { setView("therapist_signup"); setError(null); }}>
                  Register as a Therapist
                </button>
              </div>
            </div>
          )}

          {view === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input id="phone" type="tel" placeholder="+91" value={phone} onChange={e => setPhone(e.target.value)} required minLength={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <button type="button" className="text-primary hover:underline font-medium" onClick={() => { setView("login"); setError(null); }}>
                  Log in
                </button>
              </div>
            </form>
          )}

          {view === "therapist_signup" && (
            <form onSubmit={handleTherapistSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="t-name">Full Name</Label>
                <Input id="t-name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-email">Email</Label>
                <Input id="t-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-phone">Mobile Number</Label>
                <Input id="t-phone" type="tel" placeholder="+91" value={phone} onChange={e => setPhone(e.target.value)} required minLength={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-password">Password</Label>
                <Input id="t-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Therapist Type</Label>
                  <Select value={therapistType} onValueChange={setTherapistType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THERAPIST_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Qualification</Label>
                  <Select value={qualification || "__none__"} onValueChange={(v) => setQualification(v === "__none__" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Not set</SelectItem>
                      {QUALIFICATIONS.map((q) => (
                        <SelectItem key={q} value={q}>{q}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Our team will review your application and documents before your account goes live.
              </p>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <button type="button" className="text-primary hover:underline font-medium" onClick={() => { setView("login"); setError(null); }}>
                  Log in
                </button>
              </div>
            </form>
          )}

          {view === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp} required>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Email
              </Button>
              <div className="text-center text-sm">
                <button 
                  type="button" 
                  className="text-muted-foreground hover:text-primary underline" 
                  onClick={async () => {
                    try {
                      await authService.resendOtp(email);
                      toast.success("OTP resent successfully!");
                    } catch (err: any) {
                      toast.error(err?.message || "Failed to resend OTP");
                    }
                  }}
                >
                  Resend Code
                </button>
              </div>
              <div className="text-center text-sm mt-4">
                <button type="button" className="text-primary hover:underline font-medium" onClick={() => { setView("login"); setError(null); }}>
                  Back to login
                </button>
              </div>
            </form>
          )}

          {view === "phone_prompt" && (
            <form onSubmit={handleProvidePhone} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phonePrompt">Mobile Number</Label>
                <Input 
                  id="phonePrompt" 
                  type="tel" 
                  placeholder="+91" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  required 
                  minLength={10} 
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Registration
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
