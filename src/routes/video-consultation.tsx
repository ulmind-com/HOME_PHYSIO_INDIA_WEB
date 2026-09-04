import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { openAuthDialog } from "@/lib/auth-dialog";
import { CONSULTATION_FEE } from "@/lib/plan";
import { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Video, ShieldCheck, PhoneOff, ArrowLeft, Loader2, MessageSquare, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/video-consultation")({
  head: () => ({
    meta: [
      { title: "24x7 Video Consultation — Home Physio India" },
      { name: "description", content: "Secure 1-on-1 healthcare video consultation with top specialists." },
    ],
  }),
  component: VideoConsultationPage,
});

function VideoConsultationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Read search parameters or generate defaults
  const searchParams = new URLSearchParams(window.location.search);
  const roomId = searchParams.get("roomId") || `session_${Math.floor(100000 + Math.random() * 900000)}`;
  // Identity is taken from the access token by the backend — these are only
  // used for local display and as effect dependencies.
  const userId = user?.id ?? "";
  const userName = user?.name ?? "";

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zegoInstance, setZegoInstance] = useState<any>(null);
  const [started, setStarted] = useState<boolean>(false);

  useEffect(() => {
    if (!started) return;
    let isMounted = true;

    async function initVideoCall() {
      try {
        setLoading(true);
        setError(null);

        // The backend mints the token against the signed-in user and checks
        // they're allowed in this room, so this call must carry the access token.
        let kitToken = "";
        {
          const tokenData = await api.get<{ token: string }>(
            "/video/generate-token",
            { roomId },
          );
          kitToken = tokenData?.token ?? "";
        }

        // The token is minted server-side only. A client-side fallback would
        // mean shipping the Zego server secret in the bundle, which lets anyone
        // join any room on the account.
        if (!kitToken) {
          throw new Error(
            "Could not start the consultation — the video service is unavailable. Please try again shortly.",
          );
        }

        if (!isMounted || !containerRef.current) return;

        // Initialize ZegoUIKitPrebuilt
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        setZegoInstance(zp);

        // Join Room with 1-on-1 Call Scenario and Full In-App Chat Configuration
        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          showPreJoinView: true,
          showTextChat: true,
          showUserList: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showLeavingView: true,
          maxUsers: 2,
          layout: "Auto",
          onLeaveRoom: () => {
            if (user?.role === "therapist") {
              navigate({ to: "/therapist/dashboard" as any });
            } else if (user) {
              navigate({ to: "/user/dashboard" as any });
            } else {
              navigate({ to: "/" });
            }
          },
        });

        setLoading(false);
      } catch (err: any) {
        console.error("ZegoCloud Video Call Initialization Error:", err);
        if (isMounted) {
          setError(err?.message || "Failed to initialize video consultation session.");
          setLoading(false);
        }
      }
    }

    initVideoCall();

    return () => {
      isMounted = false;
      if (zegoInstance) {
        try {
          zegoInstance.destroy();
        } catch (e) {
          console.warn("Cleanup Zego instance error:", e);
        }
      }
    };
  }, [roomId, userId, userName, started]);

  if (!started) {
    return <ConsultationIntro onStart={() => setStarted(true)} signedIn={Boolean(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 sm:px-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => history.back()}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
              <Video className="h-4 w-4 text-emerald-400" /> 1-on-1 Live Consultation
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="hidden md:inline-flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 256-bit Encrypted Session
          </span>
          <span className="bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 font-mono text-emerald-300">
            Room: {roomId}
          </span>
        </div>
      </header>

      {/* Main Video Call Area */}
      <main className="flex-1 relative flex flex-col justify-center items-center bg-slate-950 p-2 sm:p-4">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-slate-200">Connecting Secure Video Room...</h3>
            <p className="text-xs text-slate-400 mt-1">Preparing camera, microphone, and encryption token</p>
          </div>
        )}

        {error && (
          <div className="max-w-md w-full p-6 bg-slate-900 rounded-2xl border border-red-500/30 text-center z-20 my-auto shadow-2xl">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-red-200 mb-2">Video Call Connection Error</h3>
            <p className="text-xs text-slate-400 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
            >
              Retry Connection
            </Button>
          </div>
        )}

        {/* ZegoCloud Container */}
        <div
          ref={containerRef}
          className="w-full h-full min-h-[calc(100vh-5rem)] rounded-xl overflow-hidden border border-slate-800 bg-black shadow-2xl"
        />
      </main>
    </div>
  );
}


/**
 * Pre-call screen: what the ₹199 consultation covers, and the sign-in gate.
 * The room is only created once the patient explicitly starts the call.
 */
function ConsultationIntro({
  onStart,
  signedIn,
}: {
  onStart: () => void;
  signedIn: boolean;
}) {
  const INCLUDED = [
    "A qualified physiotherapist reviews your symptoms live",
    "Guidance on whether home visits are the right next step",
    "Which portable modalities are likely to help your condition",
    "A realistic estimate of how many sessions you need",
  ];

  return (
    <>
      <PageHero
        eyebrow="Online consultation"
        title="Talk to a physiotherapist, 24×7"
        description="A ₹199 video consultation before you commit to home visits — so you book the right care, not a guess."
        crumbs={[{ label: "Home", to: "/" }, { label: "Online consultation" }]}
        badges={["₹199 per consultation", "Available 24×7", "Secure 1-on-1 video"]}
      />

      <section className="py-14 lg:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <h2 className="font-display text-2xl tracking-tight">What's included</h2>
            <ul className="mt-6 space-y-4">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                    <ShieldCheck className="h-3 w-3 text-primary" />
                  </span>
                  <span className="text-sm text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-border/70 bg-secondary/40 p-5 text-sm text-muted-foreground">
              A consultation is advice, not a prescription. If you already have a
              doctor's prescription, X-Ray or MRI, upload it from your dashboard first —
              your physiotherapist can review it during the call.
            </div>
          </div>

          <aside className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">
              Consultation fee
            </p>
            <p className="mt-3 font-display text-5xl">₹{CONSULTATION_FEE}</p>
            <p className="mt-1 text-sm text-muted-foreground">per video consultation</p>

            {signedIn ? (
              <Button className="mt-8 w-full rounded-full" onClick={onStart}>
                <Video className="mr-2 h-4 w-4" />
                Start consultation
              </Button>
            ) : (
              <>
                <Button
                  className="mt-8 w-full rounded-full"
                  onClick={() => openAuthDialog("login")}
                >
                  Sign in to start
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Sign in so your consultation is attached to your medical history.
                </p>
              </>
            )}

            <Link
              to="/booking"
              className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
            >
              Or book a home visit directly →
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
