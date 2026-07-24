/* ============================================================
   Next Time Technology — script.js
   ============================================================ */

// ---------- AOS ----------
if (window.AOS) {
  AOS.init({
    duration: 700,
    once: true,
    offset: 60,
  });
}

// ---------- Mobile Sidebar ----------
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function toggleSub(id, btn) {
  const submenu = document.getElementById(id);
  const isOpen = submenu.classList.contains('open');

  document.querySelectorAll('.sidebar-submenu.open').forEach((el) => {
    if (el.id !== id) {
      el.classList.remove('open');
    }
  });
  document.querySelectorAll('.sidebar-section-toggle.expanded').forEach((el) => {
    if (el !== btn) {
      el.classList.remove('expanded');
    }
  });

  submenu.classList.toggle('open', !isOpen);
  btn.classList.toggle('expanded', !isOpen);
}

// ---------- Navbar scroll state ----------
const mainNav = document.getElementById('mainNav');
function handleNavScroll() {
  if (!mainNav) return;
  if (window.scrollY > 40) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavScroll);
handleNavScroll();

// ---------- Back to top ----------
const backToTopBtn = document.getElementById('backToTop');
function handleBackToTop() {
  if (!backToTopBtn) return;
  if (window.scrollY > 500) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}
window.addEventListener('scroll', handleBackToTop);
handleBackToTop();

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Close sidebar on link click ----------
document.querySelectorAll('.sidebar-nav a, .sidebar-cta').forEach((link) => {
  link.addEventListener('click', closeSidebar);
});

// ---------- Contact form (demo submit -> WhatsApp handoff) ----------
const consultForm = document.getElementById('consultForm');
if (consultForm) {
  consultForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const service = document.getElementById('cf-service').value;
    const message = document.getElementById('cf-message').value.trim();

    const text = encodeURIComponent(
      `Hi Next Time Technology, I'm ${name} (${phone}). I'm interested in ${service}. ${message}`
    );
    window.open(`https://wa.me/919530377466?text=${text}`, '_blank');
    consultForm.reset();
  });
}