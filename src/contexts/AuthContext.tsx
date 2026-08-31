import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService, type User } from "@/services/api/auth.service";
import { tokenStore } from "@/services/api/tokens";
import { auth as firebaseAuth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // start true to check session

  const setUser = useCallback((next: User) => {
    setUserState(next);
  }, []);

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setUserState(null);
    firebaseSignOut(firebaseAuth).catch(() => {});
  }, []);

  const logout = useCallback(async () => {
    const refresh = tokenStore.getRefresh();
    try {
      if (refresh) await authService.logout(refresh);
    } catch {
      // ignore
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("hpi:auth:unauthorized", handleUnauthorized);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("hpi:auth:unauthorized", handleUnauthorized);
      }
    };
  }, [clearSession]);

  useEffect(() => {
    if (!tokenStore.getAccess()) {
      setIsLoading(false);
      return;
    }
    let active = true;
    authService
      .me()
      .then((me) => active && setUser(me))
      .catch(() => active && clearSession())
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [clearSession, setUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      logout,
      setUser,
    }),
    [user, isLoading, logout, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
