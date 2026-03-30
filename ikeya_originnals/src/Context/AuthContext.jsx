import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// ─── Token helpers ────────────────────────────────────────────────────────────

/**
 * Decode a JWT payload without verifying the signature.
 * Verification still happens on the server — this is only used
 * to read the expiry time on the client.
 */
const decodeTokenPayload = (token) => {
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

/** Returns true if the token's exp has already passed. */
const isTokenExpired = (token) => {
  const payload = decodeTokenPayload(token);
  if (!payload?.exp) return true;
  // exp is in seconds; Date.now() is in ms
  return Date.now() >= payload.exp * 1000;
};

/** Returns milliseconds until the token expires (0 if already expired). */
const msUntilExpiry = (token) => {
  const payload = decodeTokenPayload(token);
  if (!payload?.exp) return 0;
  return Math.max(0, payload.exp * 1000 - Date.now());
};

// ─── Axios interceptor (module-level, runs once) ──────────────────────────────
// Any 401 from the API triggers a custom event so AuthContext can log the user out
// regardless of which component made the request.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const code = error.response.data?.code;
      // Dispatch a custom event — AuthContext listens for this
      window.dispatchEvent(new CustomEvent("auth:expired", { detail: { code } }));
    }
    return Promise.reject(error);
  }
);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Refs for the auto-logout timers so we can clear them on logout
  const expiryTimerRef  = useRef(null);
  const warningTimerRef = useRef(null);

  // ── clearTimers ──────────────────────────────────────────────────────────────
  const clearTimers = () => {
    if (expiryTimerRef.current)  clearTimeout(expiryTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
  };

  // ── logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback((reason) => {
    clearTimers();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    if (reason === "expired") {
      toast.error("Your session has expired. Please log in again.", { duration: 5000 });
    } else if (reason === "silent") {
      // Called on mount when an expired token is found — no toast needed
    } else {
      toast.success("Logged out successfully.");
    }
  }, []);

  // ── scheduleAutoLogout ────────────────────────────────────────────────────────
  /**
   * Given a valid token, schedule:
   *  - A warning toast 2 minutes before expiry
   *  - An automatic logout exactly at expiry
   */
  const scheduleAutoLogout = useCallback((token) => {
    clearTimers();

    const remaining = msUntilExpiry(token);
    if (remaining <= 0) {
      logout("expired");
      return;
    }

    const WARNING_BEFORE_MS = 2 * 60 * 1000; // 2 minutes

    // Warning — only show if there's enough time left
    if (remaining > WARNING_BEFORE_MS) {
      warningTimerRef.current = setTimeout(() => {
        toast("Your session will expire in 2 minutes. Save your work.", {
          icon: "⏳",
          duration: 10000,
        });
      }, remaining - WARNING_BEFORE_MS);
    }

    // Hard logout at expiry
    expiryTimerRef.current = setTimeout(() => {
      logout("expired");
    }, remaining);
  }, [logout]);

  // ── checkAuth (runs on mount) ─────────────────────────────────────────────────
  const checkAuth = useCallback(() => {
    try {
      const token     = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        setLoading(false);
        return;
      }

      // Client-side expiry check — catches tokens that expired while the
      // browser was closed, before any API call is even made
      if (isTokenExpired(token)) {
        logout("silent"); // clear storage quietly; user will see login page
        setLoading(false);
        return;
      }

      setUser(JSON.parse(savedUser));
      scheduleAutoLogout(token);
    } catch {
      logout("silent");
    } finally {
      setLoading(false);
    }
  }, [logout, scheduleAutoLogout]);

  // ── Listen for 401s from the Axios interceptor ────────────────────────────────
  useEffect(() => {
    const handleExpired = () => logout("expired");
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [logout]);

  // ── On mount: validate the stored token ───────────────────────────────────────
  useEffect(() => {
    checkAuth();
    return () => clearTimers(); // clean up on unmount
  }, [checkAuth]);

  // ── login ─────────────────────────────────────────────────────────────────────
  const login = async (email, password, mergeGuestCart) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      scheduleAutoLogout(token); // start the expiry countdown

      if (mergeGuestCart && typeof mergeGuestCart === "function") {
        await mergeGuestCart();
      }

      toast.success("Welcome back to the House.");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      return { success: false, message };
    }
  };

  // ── register ──────────────────────────────────────────────────────────────────
  const register = async (name, email, password, confirmPassword) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      toast.success(response.data.message || "Registration successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};