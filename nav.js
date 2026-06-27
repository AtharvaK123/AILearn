// nav.js — injects shared nav and footer into every page

function injectNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navHTML = `
    <nav>
      <a href="index.html" class="nav-logo">
        <div class="nav-logo-mark">◈</div>
        AILearn
      </a>
      <div class="nav-links">
        <a href="academies.html"   class="nav-link ${currentPage === 'academies.html'   ? 'active' : ''}">Academies</a>
        <a href="leaderboard.html" class="nav-link ${currentPage === 'leaderboard.html' ? 'active' : ''}">Leaderboard</a>
        <a href="dashboard.html"   class="nav-link ${currentPage === 'dashboard.html'   ? 'active' : ''}">Dashboard</a>
        <a href="auth.html"        class="nav-cta">Get Started Free</a>
      </div>
    </nav>`;

  const footerHTML = `
    <footer>
      <div class="footer-top">
        <div>
          <a href="index.html" class="nav-logo" style="margin-bottom: 0.25rem;">
            <div class="nav-logo-mark">◈</div>
            AILearn
          </a>
          <div class="footer-brand-desc">The next-generation AI education platform. 16 specialized academies take you from AI fundamentals to production-ready expertise — at your own pace, with your own AI tutor.</div>
          <div class="social-links">
            <a href="https://x.com"        target="_blank" class="social-btn" title="X/Twitter">𝕏</a>
            <a href="https://github.com"   target="_blank" class="social-btn" title="GitHub">⌨</a>
            <a href="https://discord.com"  target="_blank" class="social-btn" title="Discord">💬</a>
            <a href="https://linkedin.com" target="_blank" class="social-btn" title="LinkedIn">in</a>
            <a href="https://youtube.com"  target="_blank" class="social-btn" title="YouTube">▶</a>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Platform</div>
          <a href="index.html#features"  class="footer-link">Features</a>
          <a href="academies.html"        class="footer-link">Academies</a>
          <a href="auth.html"             class="footer-link">Sign Up</a>
          <a href="auth.html"             class="footer-link">Sign In</a>
        </div>
        <div>
          <div class="footer-col-title">Academies</div>
          <a href="academies.html?id=foundations"        class="footer-link">AI Foundations</a>
          <a href="academies.html?id=prompt-engineering" class="footer-link">Prompt Engineering</a>
          <a href="academies.html?id=machine-learning"   class="footer-link">Machine Learning</a>
          <a href="academies.html?id=deep-learning"      class="footer-link">Deep Learning</a>
          <a href="academies.html?id=agents"             class="footer-link">AI Agents</a>
          <a href="academies.html?id=rag"                class="footer-link">RAG</a>
        </div>
        <div>
          <div class="footer-col-title">Community</div>
          <a href="leaderboard.html" class="footer-link">Leaderboard</a>
          <a href="https://discord.com" target="_blank" class="footer-link">Discord</a>
          <a href="https://github.com"  target="_blank" class="footer-link">GitHub</a>
          <button class="footer-link">Blog</button>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 AILearn. Built with ◈ and a lot of gradient descent.</span>
        <span>Privacy · Terms · Contact</span>
      </div>
    </footer>`;

  // Prepend nav to body
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  // Append footer to body
  document.body.insertAdjacentHTML('beforeend', footerHTML);
}

document.addEventListener('DOMContentLoaded', injectNav);
