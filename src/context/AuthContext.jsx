/**
 * AuthContext.jsx
 * Global authentication and user profile state management.
 * Provides: currentUser, userProfile, authLoading, profileLoading, refreshProfile, updateUserProfileLocally
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { getUserProfile } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  
  // Initialize userProfile from local storage right away for zero-delay UX
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const raw = localStorage.getItem("prakriti_profile_current");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  /**
   * Immediately update profile in state and localStorage without waiting on network.
   */
  const updateUserProfileLocally = useCallback((profileData) => {
    setUserProfile((prev) => {
      const updated = { ...(prev || {}), ...profileData, hasCompletedAssessment: true };
      try {
        localStorage.setItem("prakriti_profile_current", JSON.stringify(updated));
        if (currentUser?.uid) {
          localStorage.setItem(`prakriti_profile_${currentUser.uid}`, JSON.stringify(updated));
        }
      } catch (e) {}
      return updated;
    });
  }, [currentUser]);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // First check local storage for instant profile
        let localData = null;
        try {
          const raw =
            localStorage.getItem(`prakriti_profile_${user.uid}`) ||
            localStorage.getItem("prakriti_profile_current");
          if (raw) {
            localData = JSON.parse(raw);
            setUserProfile(localData);
          }
        } catch (e) {}

        // Then perform non-blocking remote load
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          } else if (localData) {
            setUserProfile(localData);
          }
        } catch (err) {
          console.warn("Failed to load user profile remotely:", err);
        }
      } else {
        // If not logged in, keep guest profile if exists
        try {
          const raw = localStorage.getItem("prakriti_profile_current");
          if (raw) {
            setUserProfile(JSON.parse(raw));
          }
        } catch (e) {}
      }

      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Refresh the user profile from Firestore or local storage.
   */
  const refreshProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      const profile = await getUserProfile(currentUser.uid);
      if (profile) {
        setUserProfile(profile);
      }
    } catch (err) {
      console.warn("Failed to refresh profile:", err);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    userProfile,
    authLoading,
    profileLoading,
    refreshProfile,
    updateUserProfileLocally,
    hasCompletedAssessment:
      userProfile?.hasCompletedAssessment === true ||
      !!userProfile?.prakriti,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to use auth context in any component */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
