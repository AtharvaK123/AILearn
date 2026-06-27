/* ═══════════════════════════════════════════════════════════
   AILearn — firebase-config.js
   ► Replace the values below with YOUR Firebase project config
   ► Get them from: Firebase Console → Project Settings → General → Your apps
═══════════════════════════════════════════════════════════ */

const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ── Init (guard against double-init across pages) ─────────
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

const db     = firebase.database();
const fbAuth = firebase.auth();

/* ── Helpers shared across pages ─────────────────────────── */

/**
 * Save/merge user progress to Firebase.
 * Fields: xp, done, streak, badges, projects, lastLogin
 */
async function saveUserProgress(username, data) {
  if (!username) return;
  try {
    await db.ref('users/' + username).update(data);
  } catch (e) {
    console.warn('[AILearn] saveUserProgress failed:', e.message);
  }
}

/**
 * Get a user record by username key.
 * Returns the value object or null.
 */
async function getUserByUsername(username) {
  try {
    const snap = await db.ref('users/' + username).get();
    return snap.exists() ? snap.val() : null;
  } catch (e) {
    console.warn('[AILearn] getUserByUsername failed:', e.message);
    return null;
  }
}

/**
 * Get the username key stored against a Firebase Auth UID.
 * Used after Google OAuth to look up the username record.
 */
async function getUsernameForUID(uid) {
  try {
    const snap = await db.ref('uid_map/' + uid).get();
    return snap.exists() ? snap.val() : null;
  } catch (e) {
    return null;
  }
}

/** Store UID → username mapping so Google auth users can be found */
async function setUIDMapping(uid, username) {
  try {
    await db.ref('uid_map/' + uid).set(username);
  } catch (e) {
    console.warn('[AILearn] setUIDMapping failed:', e.message);
  }
}

/**
 * Hash a password client-side (simple, matches existing auth.js scheme).
 * NOTE: For production use Firebase Auth email/password instead.
 */
function hashPassword(raw) {
  return btoa(raw + '_ailearn_2025');
}

/**
 * Derive a clean username from an email address.
 * "Ada.Lovelace+1@gmail.com" → "ada_lovelace"
 */
function usernameFromEmail(email) {
  return email.split('@')[0]
    .replace(/[^a-z0-9_]/gi, '_')
    .toLowerCase()
    .slice(0, 24);
}

/**
 * Compute new streak value given the stored lastLogin timestamp.
 */
function computeStreak(lastLogin, currentStreak) {
  const now  = Date.now();
  const days = Math.floor((now - (lastLogin || 0)) / 86400000);
  let s = currentStreak || 0;
  if (days === 1) s++;
  else if (days > 1) s = 1;
  return s;
}
