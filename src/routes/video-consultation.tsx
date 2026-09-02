import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api/client";
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
  const userId = user?.id || searchParams.get("userId") || `user_${Math.floor(1000 + Math.random() * 9000)}`;
  const userName = user?.name || searchParams.get("userName") || `Guest_${userId.slice(-4)}`;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zegoInstance, setZegoInstance] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function initVideoCall() {
      try {
        setLoading(true);
        setError(null);

        // Fetch token from secure FastAPI Backend API
        const tokenRes = await fetch(
          `${API_BASE}/video/generate-token?roomId=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(userId)}&userName=${encodeURIComponent(userName)}`
        );

        let kitToken = "";
        if (tokenRes.ok) {
          const resData = await tokenRes.json();
          kitToken = resData?.data?.token;
        }

        // Fallback: Generate token if backend API is not reachable in dev
        if (!kitToken) {
          const appId = 149684840;
          const serverSecret = "a1ba3a9d4ff4b8316a7e97249742c9e4";
          kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appId,
            serverSecret,
            roomId,
            userId,
            userName,
            3600
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
  }, [roomId, userId, userName]);

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
