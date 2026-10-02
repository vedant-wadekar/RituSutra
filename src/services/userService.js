/**
 * userService.js
 * Handles all Firestore operations for user profiles and Prakriti data.
 * Abstracted so the database layer can be replaced independently.
 * Includes local storage caching and timeout resilience.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

const USERS_COLLECTION = "users";

/** Helper: timeout wrapper so network calls never hang indefinitely */
function withTimeout(promise, ms = 2500) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database operation timed out")), ms)
    ),
  ]);
}

/**
 * Get a user's profile.
 * Checks local storage first for instant load, then syncs with Firestore.
 */
export async function getUserProfile(uid) {
  let cached = null;
  try {
    const raw =
      localStorage.getItem(`prakriti_profile_${uid}`) ||
      localStorage.getItem("prakriti_profile_current");
    if (raw) {
      cached = JSON.parse(raw);
    }
  } catch (e) {}

  try {
    const ref = doc(db, USERS_COLLECTION, uid);
    const snap = await withTimeout(getDoc(ref));
    if (snap && snap.exists()) {
      const data = snap.data();
      try {
        localStorage.setItem(`prakriti_profile_${uid}`, JSON.stringify(data));
        localStorage.setItem("prakriti_profile_current", JSON.stringify(data));
      } catch (e) {}
      return data;
    }
  } catch (error) {
    console.warn("getUserProfile remote sync skipped or failed:", error.message);
  }

  return cached;
}

/**
 * Create or overwrite a user profile in Firestore.
 */
export async function saveUserProfile(uid, profileData) {
  try {
    localStorage.setItem(`prakriti_profile_${uid}`, JSON.stringify(profileData));
    localStorage.setItem("prakriti_profile_current", JSON.stringify(profileData));
  } catch (e) {}

  try {
    const ref = doc(db, USERS_COLLECTION, uid);
    await withTimeout(
      setDoc(ref, {
        ...profileData,
        updatedAt: serverTimestamp(),
      })
    );
  } catch (error) {
    console.warn("saveUserProfile remote sync skipped or failed:", error.message);
  }
}

/**
 * Partially update a user profile (merge).
 */
export async function updateUserProfile(uid, partialData) {
  try {
    const existing = await getUserProfile(uid);
    const merged = { ...(existing || {}), ...partialData };
    localStorage.setItem(`prakriti_profile_${uid}`, JSON.stringify(merged));
    localStorage.setItem("prakriti_profile_current", JSON.stringify(merged));
  } catch (e) {}

  try {
    const ref = doc(db, USERS_COLLECTION, uid);
    await withTimeout(
      updateDoc(ref, {
        ...partialData,
        updatedAt: serverTimestamp(),
      })
    );
  } catch (error) {
    console.warn("updateUserProfile remote sync skipped or failed:", error.message);
  }
}

/**
 * Save completed Prakriti assessment results to the user's profile.
 * Immediately saves to localStorage so UI updates with ZERO delay,
 * then attempts Firestore background sync with a timeout.
 */
export async function savePrakritiAssessment(uid, assessmentData) {
  const profileRecord = {
    prakriti: assessmentData.prakriti,
    prakritiLabel: assessmentData.prakritiLabel,
    primaryDosha: assessmentData.primaryDosha,
    secondaryDosha: assessmentData.secondaryDosha,
    doshaScores: assessmentData.doshaScores,
    doshaPercentages: assessmentData.doshaPercentages,
    questionnaireAnswers: assessmentData.answers || assessmentData.questionnaireAnswers,
    assessmentCompletedAt: new Date().toISOString(),
    hasCompletedAssessment: true,
    updatedAt: new Date().toISOString(),
  };

  // Immediate synchronous local cache across all lookup keys
  try {
    localStorage.setItem(`prakriti_profile_${uid}`, JSON.stringify(profileRecord));
    localStorage.setItem("prakriti_profile_current", JSON.stringify(profileRecord));
    localStorage.setItem("guest_prakriti_profile", JSON.stringify(profileRecord));
  } catch (e) {
    console.warn("Failed to write to localStorage:", e);
  }

  // Attempt remote Firestore sync with timeout (won't hang if offline/unconfigured)
  try {
    const ref = doc(db, USERS_COLLECTION, uid);
    await withTimeout(
      setDoc(
        ref,
        {
          ...profileRecord,
          assessmentCompletedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ),
      2500
    );
  } catch (error) {
    console.warn("savePrakritiAssessment Firestore sync note (local profile active):", error.message);
  }

  return profileRecord;
}

/**
 * Check if a user has completed the Prakriti assessment.
 * Returns true/false.
 */
export async function hasCompletedAssessment(uid) {
  try {
    const raw =
      localStorage.getItem(`prakriti_profile_${uid}`) ||
      localStorage.getItem("prakriti_profile_current");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.hasCompletedAssessment === true || parsed?.prakriti) {
        return true;
      }
    }
  } catch (e) {}

  try {
    const profile = await getUserProfile(uid);
    return profile?.hasCompletedAssessment === true || !!profile?.prakriti;
  } catch (error) {
    return false;
  }
}
