/* ═══════════════════════════════════════════════════════════
   AILearn — app.js
   UI logic: views, lessons, projects, sandbox,
   prompt lab, AL chat, leaderboard, badges, toast
═══════════════════════════════════════════════════════════ */

// ── Global state (shared with auth.js) ───────────────────
let CU = null;   // current user  { username, displayName }
let UP = {       // user progress
  xp: 0, done: [], streak: 0,
  lastLogin: null, badges: ['first-login'], projects: []
};
let curLesson    = null;
let curTrack     = null;
let quizDone     = false;
let promptHistory = [];
let alHistory    = [];

// ── Kick off after successful sign-in (called by auth.js) ─
function doSignIn(uname, dname, data) {
  CU = { username: uname, displayName: dname };
  UP = {
    xp:        data.xp        || 0,
    done:      data.done      || [],
    streak:    data.streak    || 0,
    lastLogin: data.lastLogin || Date.now(),
    badges:    data.badges    || ['first-login'],
    projects:  data.projects  || []
  };
  closeAuthModal();
  document.getElementById('landing').style.display  = 'none';
  document.getElementById('app').style.display      = 'block';
  document.getElementById('al-panel').style.display = 'flex';
  initApp();
}

// ═══════════════════════════════════════════
// LANDING HELPERS
// ═══════════════════════════════════════════
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══════════════════════════════════════════
// APP INIT
// ═══════════════════════════════════════════
function initApp() {
  document.getElementById('su-name').textContent = CU.displayName;
  updateUI();
  renderLessons();
  renderBadges();
  renderProjects();
  showView('dashboard');
}

// ── Level info table ──────────────────────────────────────
function getLevelInfo(xp) {
  if (xp >= 2000) return { name: 'Master',       cls: 'level-master',       next: null,           cur: 2000, max: 3000 };
  if (xp >= 1000) return { name: 'Expert',        cls: 'level-expert',       next: 'Master',        cur: 1000, max: 2000 };
  if (xp >= 500)  return { name: 'Advanced',      cls: 'level-advanced',     next: 'Expert',        cur: 500,  max: 1000 };
  if (xp >= 200)  return { name: 'Intermediate',  cls: 'level-intermediate', next: 'Advanced',      cur: 200,  max: 500  };
  return             { name: 'Beginner',      cls: '',                   next: 'Intermediate',  cur: 0,    max: 200  };
}

// ── Refresh all dynamic UI ────────────────────────────────
function updateUI() {
  const { xp, done, streak, badges } = UP;
  const li    = getLevelInfo(xp);
  const total = Object.values(CUR).flat().length;
  const pct   = Math.round((done.length / total) * 100);

  document.body.className = li.cls;

  // Topbar pills
  document.getElementById('tp-xp').textContent     = '⚡ ' + xp + ' XP';
  document.getElementById('tp-streak').textContent = '🔥 ' + streak + ' day' + (streak !== 1 ? 's' : '');

  // Dashboard hero
  document.getElementById('dash-welcome').textContent = 'Welcome back, ' + CU.displayName + '! 👋';
  document.getElementById('sc-xp').textContent        = xp;
  document.getElementById('sc-lessons').textContent   = done.length;
  document.getElementById('sc-streak').textContent    = streak;
  document.getElementById('sc-badges').textContent    = badges.length;
  document.getElementById('badge-count-label').textContent = badges.length;
  document.getElementById('dash-pct').textContent     = pct + '%';
  document.getElementById('dash-bar').style.width     = pct + '%';

  // Sidebar user block
  document.getElementById('su-level').textContent     = '◈ ' + li.name;
  document.getElementById('su-xp-cur').textContent    = xp + ' XP';
  document.getElementById('su-xp-next').textContent   = li.next ? '→ ' + li.max + ' XP' : 'MAX LEVEL';
  const fillPct = li.next
    ? Math.min(100, Math.round(((xp - li.cur) / (li.max - li.cur)) * 100))
    : 100;
  document.getElementById('su-xp-fill').style.width   = fillPct + '%';

  // Track mini-progress pills
  ['build', 'code', 'data', 'prompt'].forEach(t => {
    const ls  = CUR[t];
    const n   = ls.filter(l => done.includes(l.id)).length;
    const tot = ls.length;
    const pill = document.getElementById('pill-' + t);
    const bar  = document.getElementById('bar-'  + t);
    if (pill) {
      if (n === 0)   { pill.textContent = 'Not started'; pill.className = 'tc-pill ns'; }
      else if (n === tot) { pill.textContent = 'Completed ✓'; pill.className = 'tc-pill done'; }
      else           { pill.textContent = n + '/' + tot + ' done'; pill.className = 'tc-pill ip'; }
    }
    if (bar) bar.style.width = Math.round((n / tot) * 100) + '%';
  });

  renderActivity();
}

function renderActivity() {
  const c      = document.getElementById('activity-list');
  const recent = UP.done.slice(-5).reverse();
  if (!recent.length) {
    c.innerHTML = '<div style="color:var(--text3);font-size:0.83rem;font-family:var(--font-d);padding:0.5rem 0">No lessons completed yet — pick a track below to start!</div>';
    return;
  }
  const allL   = Object.values(CUR).flat();
  const colors = { build: 'var(--lvl-primary)', code: 'var(--cyan)', data: 'var(--green)', prompt: 'var(--orange)' };
  c.innerHTML = recent.map(id => {
    const l = allL.find(x => x.id === id);
    if (!l) return '';
    const t = id.split('-')[0];
    return '<div class="activity-item">'
      + '<div class="ai-dot" style="background:' + colors[t] + '"></div>'
      + '<div class="ai-text"><strong>' + l.title + '</strong></div>'
      + '<div class="ai-time">+' + l.xp + ' XP</div>'
      + '</div>';
  }).join('');
}

// ═══════════════════════════════════════════
// VIEW ROUTER
// ═══════════════════════════════════════════
const VIEW_TITLES = {
  dashboard:      'Dashboard',
  'track-build':  'Build AI',
  'track-code':   'Code AI',
  'track-data':   'Collect Data',
  'track-prompt': 'Prompt AI',
  'lesson-content':'Lesson',
  sandbox:        'Code Sandbox',
  promptlab:      'Prompt Lab',
  achievements:   'Achievements',
  leaderboard:    'Leaderboard',
  projects:       'Projects',
  'project-detail':'Project Detail'
};

function showView(name) {
  document.querySelectorAll('.view').forEach(v  => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const el = document.getElementById('view-' + name);
  if (el) el.classList.add('active');

  document.getElementById('topbar-title').textContent = VIEW_TITLES[name] || name;

  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('data-view') === name) n.classList.add('active');
  });

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');

  if (name === 'leaderboard') loadLeaderboard();
}

// ═══════════════════════════════════════════
// LESSON RENDERING
// ═══════════════════════════════════════════
function renderLessons() {
  ['build', 'code', 'data', 'prompt'].forEach(track => {
    const c = document.getElementById('lessons-' + track);
    if (!c) return;
    c.innerHTML = '';
    CUR[track].forEach((l, i) => {
      const done   = UP.done.includes(l.id);
      const prev   = i === 0 || UP.done.includes(CUR[track][i - 1].id);
      const locked = !prev && !done;

      const item = document.createElement('div');
      item.className = 'lesson-item'
        + (done   ? ' completed' : '')
        + (locked ? ' locked'    : '');

      item.innerHTML =
        '<div class="lesson-num ' + (done ? 'ln-done' : prev ? 'ln-current' : 'ln-todo') + '">'
        + (done ? '✓' : (i + 1))
        + '</div>'
        + '<div class="li-info">'
        +   '<div class="li-title">' + l.title + '</div>'
        +   '<div class="li-sub">'   + l.desc  + '</div>'
        + '</div>'
        + '<span style="font-size:0.65rem;color:var(--text3);background:var(--bg3);border-radius:5px;padding:0.1rem 0.4rem;font-family:var(--font-d);margin-right:0.4rem">'
        +   l.level
        + '</span>'
        + '<div class="li-xp">+' + l.xp + ' XP</div>';

      if (!locked) item.onclick = () => openLesson(l, track);
      c.appendChild(item);
    });
  });
}

function openLesson(l, track) {
  curLesson = l;
  curTrack  = track;
  quizDone  = false;
  const done = UP.done.includes(l.id);
  const c    = l.content;
  const trackLabel = track.charAt(0).toUpperCase() + track.slice(1) + ' AI';

  document.getElementById('lesson-content-view').innerHTML =
    '<div class="lesson-hdr">'
    + '<button class="btn-back" onclick="showView(\'track-' + track + '\')">← ' + trackLabel + '</button>'
    + '<div class="lesson-hdr-info">'
    +   '<div class="lesson-hdr-title">' + l.title + '</div>'
    +   '<div class="lesson-hdr-meta">' + l.level + ' · +' + l.xp + ' XP · Ask AL if you need hints ↗</div>'
    + '</div></div>'
    + '<div class="content-block">' + c.text + '</div>'
    + '<div class="quiz-block">'
    +   '<div class="quiz-q">🧠 Comprehension Check: ' + c.quiz.q + '</div>'
    +   '<div class="quiz-options" id="quiz-opts">'
    +     c.quiz.options.map((o, i) =>
          '<div class="quiz-option" onclick="answerQuiz(' + i + ',' + c.quiz.answer + ',this)">'
          + '<span class="opt-letter">' + String.fromCharCode(65 + i) + '</span>' + o
          + '</div>'
        ).join('')
    +   '</div>'
    +   '<div class="quiz-result" id="quiz-result"></div>'
    + '</div>'
    + '<button class="btn-complete' + (done ? ' already-done' : '') + '" onclick="completeLesson()">'
    +   (done ? '✓ Already Completed — revisit anytime' : 'Mark Complete & Continue →')
    + '</button>';

  showView('lesson-content');
}

function answerQuiz(chosen, correct, el) {
  if (quizDone) return;
  quizDone = true;
  document.querySelectorAll('.quiz-option').forEach((o, i) => {
    o.classList.add('disabled');
    if (i === correct) o.classList.add('correct');
    else if (i === chosen) o.classList.add('wrong');
  });
  const r = document.getElementById('quiz-result');
  r.textContent  = chosen === correct
    ? '✓ Correct! Great work.'
    : '✗ Not quite — the answer is ' + String.fromCharCode(65 + correct) + '.';
  r.className    = 'quiz-result ' + (chosen === correct ? 'correct' : 'wrong');
  r.style.display = 'block';
}

async function completeLesson() {
  if (!curLesson) return;
  const id = curLesson.id;
  if (UP.done.includes(id)) { showView('track-' + curTrack); return; }
  UP.done.push(id);
  UP.xp += curLesson.xp;
  await saveProgress();
  checkBadges();
  updateUI();
  renderLessons();
  renderBadges();
  showToast('🎉', '+' + curLesson.xp + ' XP!', '"' + curLesson.title + '" completed');
  showView('track-' + curTrack);
}

// ═══════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = PROJECTS.map(p =>
    '<div class="project-card" onclick="openProject(\'' + p.id + '\')">'
    + '<div class="project-card-header" style="background:' + p.gradient + '">' + p.icon + '</div>'
    + '<div class="project-card-body">'
    +   '<div class="pj-title">' + p.title + '</div>'
    +   '<div class="pj-desc">'  + p.desc  + '</div>'
    +   '<div class="pj-tags">'  + p.tags.map(t => '<span class="pj-tag">' + t + '</span>').join('') + '</div>'
    +   '<div class="pj-footer">'
    +     '<span>' + p.time + ' · +' + p.xp + ' XP</span>'
    +     '<span class="pj-difficulty pj-d-' + p.difficulty + '">' + p.difficulty + '</span>'
    +   '</div>'
    + '</div></div>'
  ).join('');
}

function openProject(id) {
  const p    = PROJECTS.find(x => x.id === id);
  if (!p) return;
  const done = (UP.projects || []).includes(id);

  document.getElementById('project-detail-view').innerHTML =
    '<div class="project-detail">'
    + '<div class="project-detail-header">'
    +   '<button class="btn-back" onclick="showView(\'projects\')">← Projects</button>'
    +   '<div>'
    +     '<div style="font-family:var(--font-d);font-size:1.4rem;font-weight:700">' + p.icon + ' ' + p.title + '</div>'
    +     '<div style="font-size:0.78rem;color:var(--text3);font-family:var(--font-m);margin-top:0.2rem">'
    +       p.difficulty + ' · ' + p.time + ' · +' + p.xp + ' XP'
    +     '</div>'
    +   '</div>'
    + '</div>'
    + '<div class="content-block">'
    +   '<h3>Overview</h3><p>' + p.desc + '</p>'
    +   '<h3>Prerequisites</h3><p>' + (p.prereqs || p.skills || []).join(' · ') + '</p>'
    +   '<h3>Project Steps</h3>'
    +   '<ol style="padding-left:1.5rem;margin-top:0.5rem">'
    +     p.steps.map(s => '<li style="margin:0.5rem 0;line-height:1.6">' + s + '</li>').join('')
    +   '</ol>'
    +   '<h3>Technologies</h3>'
    +   '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.5rem">'
    +     p.tags.map(t => '<span class="pj-tag">' + t + '</span>').join('')
    +   '</div>'
    + '</div>'
    + '<button class="btn-complete' + (done ? ' already-done' : '') + '" onclick="completeProject(\'' + id + '\')">'
    +   (done ? '✓ Project Completed' : 'Mark Project Complete →')
    + '</button>'
    + '</div>';

  showView('project-detail');
}

async function completeProject(id) {
  if (!UP.projects) UP.projects = [];
  if (UP.projects.includes(id)) { showView('projects'); return; }
  const p = PROJECTS.find(x => x.id === id);
  UP.projects.push(id);
  UP.xp += (p ? p.xp : 200);
  await saveProgress();
  checkBadges();
  updateUI();
  renderBadges();
  showToast('🚀', 'Project Complete!', '+' + (p ? p.xp : 200) + ' XP earned');
  showView('projects');
}

// ═══════════════════════════════════════════
// CODE SANDBOX
// ═══════════════════════════════════════════
function loadSandboxPreset() {
  const v = document.getElementById('sandbox-preset').value;
  if (v && PRESETS[v]) document.getElementById('code-editor').value = PRESETS[v];
}

function insertSnippet(k) {
  const ed = document.getElementById('code-editor');
  ed.value += SNIPPETS[k] || '';
  ed.scrollTop = ed.scrollHeight;
}

function clearOutput() {
  document.getElementById('code-output').textContent = '// Output cleared\n';
}

function runCode() {
  const code = document.getElementById('code-editor').value;
  const out  = document.getElementById('code-output');
  out.style.color = 'var(--green)';

  const lines = [];
  const t0    = Date.now();

  // Pull print() calls for simple simulation
  const prints = code.match(/print\(f?["`']([^"`']+)["`']\)/g) || [];
  prints.forEach(p => {
    let s = p.replace(/print\(f?["`']([^"`']+)["`']\)/, '$1');
    s = s.replace(/\{[^}:]*:[^}]*\}/g, () => (Math.random() * 9 + 0.1).toFixed(4));
    s = s.replace(/\{[^}]+\}/g,        () => Math.floor(Math.random() * 100));
    lines.push(s);
  });

  // Heuristic output blocks for known presets
  if (code.includes('=== Attention') || code.includes('attention(')) {
    if (!lines.length) {
      lines.push('=== Attention Weights ===');
      lines.push('Row i = how much token i attends to each token');
    }
    for (let i = 0; i < 4; i++) {
      const r = [Math.random(), Math.random(), Math.random(), Math.random()];
      const s = r.reduce((a, b) => a + b);
      lines.push('Token ' + i + ': [' + r.map(v => (v / s).toFixed(3)).join(', ') + ']');
    }
  } else if (code.includes('=== Forward Pass') || code.includes('Net(')) {
    if (!lines.length) lines.push('=== Forward Pass Results ===');
    ['positive','negative','positive','positive','negative'].forEach((l, i) =>
      lines.push('Sample ' + (i + 1) + ': ' + Math.random().toFixed(4) + ' → ' + l)
    );
  } else if (code.includes('Gradient Descent') || code.includes('Minimizing')) {
    if (!lines.length) {
      lines.push(('Step').padEnd(5) + ('x').padStart(9) + ('f(x)').padStart(10) + ('grad').padStart(10));
      lines.push('-'.repeat(38));
    }
    let x = 10;
    for (let s = 0; s < 18; s++) {
      const loss = (x - 3) ** 2, grad = 2 * (x - 3);
      lines.push(String(s).padEnd(5) + x.toFixed(4).padStart(9) + loss.toFixed(4).padStart(10) + grad.toFixed(4).padStart(10));
      x = x - 0.15 * grad;
      if (Math.abs(grad) < 0.01) { lines.push('\nConverged! x≈' + x.toFixed(4)); break; }
    }
  } else if (code.includes('=== Activation') || code.includes('neuron(')) {
    if (!lines.length) {
      lines.push('=== Activation Comparison ===');
      lines.push('ReLU:    ' + Math.max(0, Math.random() * 2 - 0.5).toFixed(4));
      lines.push('Sigmoid: ' + (Math.random() * 0.4 + 0.3).toFixed(4));
      lines.push('Tanh:    ' + (Math.random() * 1.4 - 0.7).toFixed(4));
    }
  } else if (code.includes('Vocabulary') || code.includes('tokeniz')) {
    if (!lines.length) {
      lines.push('=== Vocabulary ===');
      ['again','and','cat','mat','on','sat','the'].forEach((w, i) =>
        lines.push('  ' + ("'" + w + "'").padEnd(14) + '→ ' + i)
      );
      lines.push('\nTokenized: [6, 2, 5, 4, 6, 3, 1, 6, 2, 5, 0]');
      lines.push('Unique tokens: 7, Total tokens: 11');
    }
  } else if (lines.length === 0) {
    if (code.includes('import')) lines.push('Imports loaded ✓');
    lines.push('Script executed (no print statements detected).');
  }

  const elapsed = ((Date.now() - t0) / 1000 + Math.random() * 0.08 + 0.02).toFixed(3);
  lines.push('');
  lines.push('[Finished in ' + elapsed + 's]');
  out.textContent = lines.join('\n');
}

// ═══════════════════════════════════════════
// PROMPT LAB
// ═══════════════════════════════════════════
function fillPrompt(el) {
  document.getElementById('prompt-input').value = el.textContent.trim();
  document.getElementById('prompt-input').focus();
}

async function sendPrompt() {
  const prompt = document.getElementById('prompt-input').value.trim();
  if (!prompt) return;
  const respEl = document.getElementById('prompt-response');
  const btn    = document.getElementById('btn-send-prompt');
  btn.disabled = true;
  respEl.className = 'prompt-response visible loading';
  respEl.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div> Claude is thinking…';

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: 'You are the AILearn Prompt Lab assistant — an expert AI/ML tutor. Help users learn about building AI models, machine learning engineering, data collection, and prompt engineering. Be clear, educational, and appropriately technical. Use markdown formatting when helpful. Focus exclusively on AI/ML topics.',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'HTTP ' + res.status);
    }
    const data = await res.json();
    const text = data.content?.[0]?.text || 'No response received.';

    respEl.className = 'prompt-response visible';
    respEl.innerHTML = fmtMd(text);

    promptHistory.unshift({ q: prompt, a: text });
    if (promptHistory.length > 5) promptHistory.pop();
    renderPromptHistory();
    document.getElementById('prompt-input').value = '';
    showToast('🧪', 'Response received!', 'AI answered your prompt');
  } catch (e) {
    respEl.className = 'prompt-response visible';
    respEl.style.color = 'var(--red)';
    respEl.textContent = 'API Error: ' + e.message
      + '. The Prompt Lab calls the Anthropic API directly from the browser — make sure the API key is configured server-side or via a proxy.';
  } finally {
    btn.disabled = false;
  }
}

function renderPromptHistory() {
  const c = document.getElementById('prompt-history-container');
  if (!c || promptHistory.length <= 1) { if(c) c.innerHTML = ''; return; }
  c.innerHTML = '<div class="section-heading" style="font-size:0.85rem;margin-bottom:0.65rem">📝 Previous Prompts</div>'
    + '<div class="prompt-history">'
    + promptHistory.slice(1).map(h =>
      '<div class="ph-entry">'
      + '<div class="ph-q">You: ' + esc(h.q) + '</div>'
      + '<div class="ph-a">' + fmtMd(h.a).slice(0, 600) + '</div>'
      + '</div>'
    ).join('')
    + '</div>';
}

// ═══════════════════════════════════════════
// AL CHAT
// ═══════════════════════════════════════════
function toggleALChat() {
  document.getElementById('al-window').classList.toggle('open');
}

function addALMsg(role, text) {
  const msgs = document.getElementById('al-messages');
  const div  = document.createElement('div');
  div.className = 'al-chat-msg' + (role === 'user' ? ' user-msg' : '');
  const init = CU ? CU.displayName.charAt(0).toUpperCase() : 'U';
  div.innerHTML = role === 'user'
    ? '<div class="al-chat-avatar usr-av">' + init + '</div><div class="al-chat-bubble">' + esc(text) + '</div>'
    : '<div class="al-chat-avatar al-av">◈</div><div class="al-chat-bubble al-bubble">' + fmtMd(text) + '</div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

async function sendALMessage() {
  const input = document.getElementById('al-input');
  const btn   = document.getElementById('al-send-btn');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';
  btn.disabled = true;

  addALMsg('user', text);
  alHistory.push({ role: 'user', content: text });

  const msgs    = document.getElementById('al-messages');
  const loading = document.createElement('div');
  loading.className = 'al-chat-msg';
  loading.id        = 'al-loading';
  loading.innerHTML = '<div class="al-chat-avatar al-av">◈</div>'
    + '<div class="al-chat-bubble al-bubble">'
    + '<div class="typing-dots"><span></span><span></span><span></span></div>'
    + '</div>';
  msgs.appendChild(loading);
  msgs.scrollTop = msgs.scrollHeight;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: `You are AL, the AI tutor built into AILearn. Personality: friendly, encouraging, and rigorous.

STRICT RULES:
1. Only discuss AI/ML topics: neural networks, machine learning, deep learning, data science, Python for AI, prompt engineering.
2. NEVER give quiz or lesson answers directly — give HINTS and ask guiding questions.
3. Keep responses concise (under 120 words) unless code is essential.
4. Be encouraging. Reference AILearn lessons when relevant, e.g. "Build AI Lesson 3 covers this!".
5. For off-topic questions, redirect: "I'm an AI/ML specialist — let me steer us back to that!".
6. Guide, don't solve. Foster independent thinking.`,
        messages: alHistory.slice(-8)
      })
    });

    const d     = await res.json();
    const reply = d.content?.[0]?.text || "I'm having trouble right now. Try again in a moment!";
    document.getElementById('al-loading')?.remove();
    alHistory.push({ role: 'assistant', content: reply });
    if (alHistory.length > 20) alHistory = alHistory.slice(-16);
    addALMsg('al', reply);
  } catch (e) {
    document.getElementById('al-loading')?.remove();
    addALMsg('al', "I can't connect right now — check your network and try again!");
  } finally {
    btn.disabled = false;
    input.focus();
  }
}

// ═══════════════════════════════════════════
// BADGES
// ═══════════════════════════════════════════
function checkBadges() {
  let changed = false;
  BADGES.forEach(b => {
    if (!UP.badges.includes(b.id) && b.cond(UP)) {
      UP.badges.push(b.id);
      setTimeout(() => showToast(b.icon, 'Badge Unlocked: ' + b.name, b.desc), 2000);
      changed = true;
    }
  });
  if (changed) saveProgress();
}

function renderBadges() {
  const grid = document.getElementById('badges-grid');
  if (!grid) return;
  grid.innerHTML = BADGES.map(b => {
    const earned = UP.badges.includes(b.id);
    return '<div class="badge-card ' + (earned ? 'earned' : 'locked') + '">'
      + '<div class="badge-icon">' + b.icon + '</div>'
      + '<div class="badge-name">' + b.name + '</div>'
      + '<div class="badge-desc">' + b.desc + '</div>'
      + (earned ? '<div class="badge-earned">✓ Earned</div>' : '')
      + '</div>';
  }).join('');
  document.getElementById('badge-count-label').textContent = UP.badges.length;
}

// ═══════════════════════════════════════════
// LEADERBOARD
// ═══════════════════════════════════════════
async function loadLeaderboard() {
  const c = document.getElementById('leaderboard-container');
  c.innerHTML = '<div class="empty-state"><div class="es-icon">⏳</div><div class="es-title">Loading leaderboard…</div></div>';
  try {
    const snap = await db.ref('users').get();
    if (!snap.exists()) {
      c.innerHTML = '<div class="empty-state"><div class="es-icon">📊</div><div class="es-title">No scores yet</div><div class="es-sub">Be the first to complete lessons!</div></div>';
      return;
    }
    const entries = [];
    snap.forEach(child => {
      const d = child.val();
      if (d.displayName && typeof d.xp === 'number') {
        entries.push({
          username: child.key,
          name:     d.displayName,
          xp:       d.xp,
          lessons:  (d.done    || []).length,
          badges:   (d.badges  || []).length
        });
      }
    });
    entries.sort((a, b) => b.xp - a.xp);

    if (!entries.length) {
      c.innerHTML = '<div class="empty-state"><div class="es-icon">📊</div><div class="es-title">No scores yet</div></div>';
      return;
    }
    const medals = ['🥇', '🥈', '🥉'];
    c.innerHTML =
      '<div style="margin-bottom:1rem;font-size:0.8rem;color:var(--text3);font-family:var(--font-d)">Top '
      + entries.length + ' learners globally · Updates live</div>'
      + entries.map((e, i) => {
          const isMe = CU && e.username === CU.username;
          const rc   = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
          return '<div class="lb-row' + (isMe ? ' me' : '') + '">'
            + '<div class="lb-rank ' + rc + '">' + (i < 3 ? medals[i] : i + 1) + '</div>'
            + '<div class="lb-name">' + esc(e.name) + (isMe ? '<span class="lb-badge">you</span>' : '') + '</div>'
            + '<div class="lb-info">' + e.lessons + ' lessons · ' + e.badges + ' badges</div>'
            + '<div class="lb-xp">⚡ ' + e.xp + ' XP</div>'
            + '</div>';
        }).join('');
  } catch (err) {
    c.innerHTML = '<div class="empty-state"><div class="es-icon">⚠️</div>'
      + '<div class="es-title">Could not load</div>'
      + '<div class="es-sub">' + esc(err.message) + '</div></div>';
  }
}

// ═══════════════════════════════════════════
// FIREBASE PERSISTENCE
// ═══════════════════════════════════════════
async function saveProgress() {
  if (!CU) return;
  try {
    await db.ref('users/' + CU.username).update({
      xp:       UP.xp,
      done:     UP.done,
      streak:   UP.streak,
      badges:   UP.badges,
      projects: UP.projects
    });
  } catch (e) {
    console.warn('Save failed:', e);
  }
}

// ═══════════════════════════════════════════
// MARKDOWN RENDERER
// ═══════════════════════════════════════════
function esc(s) {
  return String(s || '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function fmtMd(text) {
  if (!text) return '';
  return esc(text)
    // code blocks
    .replace(/```[\w]*\n?([\s\S]*?)```/g, (_, c) =>
      '<pre style="background:var(--bg);border:1px solid var(--border);border-radius:10px;'
      + 'padding:1rem;font-family:var(--font-m);font-size:0.8rem;overflow-x:auto;'
      + 'color:var(--cyan);margin:0.75rem 0;white-space:pre-wrap">' + c + '</pre>')
    // inline code
    .replace(/`([^`\n]+)`/g,
      '<code style="background:var(--bg);border:1px solid var(--border);border-radius:4px;'
      + 'padding:0.1rem 0.38rem;font-family:var(--font-m);font-size:0.83em;color:var(--cyan)">$1</code>')
    // bold
    .replace(/\*\*([^*\n]+)\*\*/g,
      '<strong style="color:var(--text)">$1</strong>')
    // h3
    .replace(/^### (.+)$/gm,
      '<h4 style="font-family:var(--font-d);font-size:0.93rem;color:var(--text);margin:1rem 0 0.4rem">$1</h4>')
    // h2
    .replace(/^## (.+)$/gm,
      '<h3 style="font-family:var(--font-d);font-size:1.05rem;color:var(--text);margin:1.1rem 0 0.5rem">$1</h3>')
    // h1
    .replace(/^# (.+)$/gm,
      '<h2 style="font-family:var(--font-d);font-size:1.2rem;color:var(--text);margin:1.2rem 0 0.6rem">$1</h2>')
    // list items
    .replace(/^[-*] (.+)$/gm,
      '<li style="margin:0.3rem 0;margin-left:1.2rem;list-style:disc">$1</li>')
    .replace(/(<li[^>]*>[\s\S]*?<\/li>\s*)+/g, m => '<ul style="margin:0.5rem 0">' + m + '</ul>')
    // paragraphs
    .replace(/\n\n/g, '</p><p style="margin-top:0.6rem">')
    .replace(/\n/g,   '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

// ═══════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════
let toastTimer;
function showToast(icon, title, sub) {
  const t = document.getElementById('toast');
  document.getElementById('toast-icon').textContent  = icon;
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-sub').textContent   = sub;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ═══════════════════════════════════════════
// MOBILE & KEYBOARD
// ═══════════════════════════════════════════
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('show');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('show');
    document.getElementById('al-window').classList.remove('open');
    closeAuthModal();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    if (document.getElementById('view-sandbox')?.classList.contains('active'))   runCode();
    if (document.getElementById('view-promptlab')?.classList.contains('active')) sendPrompt();
    if (document.getElementById('al-panel')?.style.display !== 'none') {
      const alInput = document.getElementById('al-input');
      if (document.activeElement === alInput) sendALMessage();
    }
  }
});

// Prompt Lab: Enter key on the textarea footer
document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('prompt-input');
  if (promptInput) {
    promptInput.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        sendPrompt();
      }
    });
  }
  const alInput = document.getElementById('al-input');
  if (alInput) {
    alInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendALMessage();
      }
    });
  }
});
