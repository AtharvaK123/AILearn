/* ═══════════════════════════════════════════════════════════
   AILearn — auth.js
   Firebase auth: username/password + Google OAuth, logout
═══════════════════════════════════════════════════════════ */

// ── Firebase init ──────────────────────────────────────────
const firebaseConfig = {
  databaseURL: "https://ailearndef-default-rtdb.firebaseio.com/",
  apiKey: "AIzaSyPlaceholder",
  authDomain: "ailearndef.firebaseapp.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let fbAuth;
try { fbAuth = firebase.auth(); } catch (e) { console.warn("Firebase Auth unavailable:", e); }

// ── Auth modal helpers ─────────────────────────────────────
function openAuthModal(tab = 'signin') {
  document.getElementById('auth-modal').classList.add('open');
  switchTab(tab);
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('open');
}

function closeAuthOnBg(e) {
  if (e.target === document.getElementById('auth-modal')) closeAuthModal();
}

function switchTab(tab) {
  document.getElementById('tab-signin').classList.toggle('active', tab === 'signin');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('form-signin').style.display = tab === 'signin' ? 'block' : 'none';
  document.getElementById('form-signup').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('modal-title').textContent =
    tab === 'signin' ? 'Welcome back' : 'Create your account';
  document.getElementById('modal-sub').textContent =
    tab === 'signin'
      ? 'Sign in to continue your AI journey.'
      : 'Join thousands mastering AI with AILearn.';
}

// ── Google sign-in ─────────────────────────────────────────
async function signInWithGoogle() {
  if (!fbAuth) {
    setMsg('signin-msg',
      'Google Sign-In requires Firebase Auth to be fully configured. Use username/password for now.',
      'error');
    return;
  }
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result   = await fbAuth.signInWithPopup(provider);
    const user     = result.user;
    const uname    = user.email
      .split('@')[0]
      .replace(/[^a-z0-9_]/gi, '_')
      .toLowerCase();

    const snap = await db.ref('users/' + uname).get();
    if (!snap.exists()) {
      const fresh = {
        displayName: user.displayName || uname,
        password:    'google_oauth',
        xp: 0, done: [], streak: 1,
        lastLogin: Date.now(),
        badges: ['first-login'],
        projects: [],
        createdAt: Date.now()
      };
      await db.ref('users/' + uname).set(fresh);
      doSignIn(uname, fresh.displayName, fresh);
    } else {
      const d   = snap.val();
      const now = Date.now();
      const days = Math.floor((now - (d.lastLogin || 0)) / 86400000);
      let s = d.streak || 0;
      if (days === 1) s++;
      else if (days > 1) s = 1;
      await db.ref('users/' + uname).update({ lastLogin: now, streak: s });
      doSignIn(uname, d.displayName, { ...d, streak: s });
    }
  } catch (err) {
    setMsg('signin-msg', 'Google Sign-In error: ' + err.message, 'error');
  }
}

// ── Username sign-up ───────────────────────────────────────
async function signUp() {
  const uname = document.getElementById('signup-username').value.trim().toLowerCase();
  const dname = document.getElementById('signup-displayname').value.trim();
  const pass  = document.getElementById('signup-password').value;
  const btn   = document.getElementById('btn-signup');

  if (!uname || !dname || !pass) {
    setMsg('signup-msg', 'All fields are required.', 'error'); return;
  }
  if (uname.length < 3) {
    setMsg('signup-msg', 'Username must be at least 3 characters.', 'error'); return;
  }
  if (!/^[a-z0-9_]+$/.test(uname)) {
    setMsg('signup-msg', 'Letters, numbers, underscores only.', 'error'); return;
  }
  if (pass.length < 6) {
    setMsg('signup-msg', 'Password must be at least 6 characters.', 'error'); return;
  }

  btn.disabled = true;
  btn.textContent = 'Creating…';

  try {
    const snap = await db.ref('users/' + uname).get();
    if (snap.exists()) {
      setMsg('signup-msg', 'Username taken. Try another.', 'error');
      btn.disabled = false; btn.textContent = 'Create Account →'; return;
    }
    const fresh = {
      displayName: dname,
      password:    btoa(pass + '_ailearn_2025'),
      xp: 0, done: [], streak: 1,
      lastLogin: Date.now(),
      badges: ['first-login'],
      projects: [],
      createdAt: Date.now()
    };
    await db.ref('users/' + uname).set(fresh);
    setMsg('signup-msg', 'Account created! Signing you in…', 'success');
    setTimeout(() => doSignIn(uname, dname, fresh), 700);
  } catch (e) {
    setMsg('signup-msg', 'Error: ' + e.message, 'error');
    btn.disabled = false; btn.textContent = 'Create Account →';
  }
}

// ── Username sign-in ───────────────────────────────────────
async function signIn() {
  const uname = document.getElementById('signin-username').value.trim().toLowerCase();
  const pass  = document.getElementById('signin-password').value;
  const btn   = document.getElementById('btn-signin');

  if (!uname || !pass) {
    setMsg('signin-msg', 'Enter username and password.', 'error'); return;
  }
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  try {
    const snap = await db.ref('users/' + uname).get();
    if (!snap.exists()) {
      setMsg('signin-msg', 'User not found.', 'error');
      btn.disabled = false; btn.textContent = 'Sign In →'; return;
    }
    const d = snap.val();
    const h = btoa(pass + '_ailearn_2025');
    if (d.password !== h && d.password !== 'google_oauth') {
      setMsg('signin-msg', 'Incorrect password.', 'error');
      btn.disabled = false; btn.textContent = 'Sign In →'; return;
    }
    const now  = Date.now();
    const days = Math.floor((now - (d.lastLogin || 0)) / 86400000);
    let s = d.streak || 0;
    if (days === 1) s++;
    else if (days > 1) s = 1;
    await db.ref('users/' + uname).update({ lastLogin: now, streak: s });
    doSignIn(uname, d.displayName, { ...d, streak: s });
  } catch (e) {
    setMsg('signin-msg', 'Connection error. Try again.', 'error');
    btn.disabled = false; btn.textContent = 'Sign In →';
  }
}

// ── Utility ───────────────────────────────────────────────
function setMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className   = 'auth-msg' + (type ? ' ' + type : '');
}

// ── Logout ────────────────────────────────────────────────
function logOut() {
  // Reset global state (defined in app.js)
  CU = null;
  UP = { xp: 0, done: [], streak: 0, badges: ['first-login'], projects: [] };
  promptHistory = [];
  alHistory     = [];

  document.body.className = '';
  document.getElementById('landing').style.display = 'flex';
  document.getElementById('app').style.display     = 'none';
  document.getElementById('al-panel').style.display = 'none';
  document.getElementById('al-window').classList.remove('open');

  // Clear form fields
  ['signin-username','signin-password',
   'signup-username','signup-displayname','signup-password'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['signin-msg','signup-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  document.getElementById('btn-signin').disabled = false;
  document.getElementById('btn-signin').textContent = 'Sign In →';
  document.getElementById('btn-signup').disabled = false;
  document.getElementById('btn-signup').textContent = 'Create Account →';

  window.scrollTo(0, 0);
}
