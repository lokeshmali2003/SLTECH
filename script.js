/* ============================================================
   NexaCore — script.js
   ============================================================ */

/* ---------- AOS Init ---------- */
AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
});

/* ---------- Navbar Scroll Behaviour ---------- */
(function () {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    function updateNav() {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav(); // run on load in case page is already scrolled
})();

function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
    document.body.style.overflow = '';
}
function toggleSub(id, btn) {
    document.getElementById(id).classList.toggle('open');
    btn.querySelector('.chevron').classList.toggle('rotated');
}
/* ---------- Active Nav Link on Scroll ---------- */
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#mainNav .nav-link');

    function setActiveLink() {
        let currentId = '';
        sections.forEach((section) => {
            const top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();
})();

/* ---------- Smooth Scroll for Anchor Links ---------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();

        // Close mobile navbar dropdown if open
        const navCollapse = document.getElementById('navMenu');
        if (navCollapse && navCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
            if (bsCollapse) bsCollapse.hide();
        }

        // Close the slide-in sidebar drawer if it's open
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        }

        const navHeight = document.getElementById('mainNav')?.offsetHeight || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ---------- Back to Top ---------- */
(function () {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* ---------- Newsletter Form ---------- */
(function () {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');

    btn.addEventListener('click', () => {
        const email = input.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('Please enter a valid email address.', 'warning');
            input.focus();
            return;
        }
        // Simulate submission
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;
        setTimeout(() => {
            input.value = '';
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
            btn.disabled = false;
            showToast('You\'re subscribed! Welcome aboard 🎉', 'success');
        }, 1200);
    });
})();

/* ---------- Toast Helper ---------- */
function showToast(message, type = 'success') {
    // Remove any existing toast
    document.querySelectorAll('.nexa-toast').forEach(t => t.remove());

    const colors = {
        success: 'linear-gradient(135deg,#ff6b00,#ff8c42)',
        warning: 'linear-gradient(135deg,#e0a800,#ffc107)',
        error: 'linear-gradient(135deg,#c0392b,#e74c3c)',
    };

    const toast = document.createElement('div');
    toast.className = 'nexa-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '80px',
        right: '28px',
        background: colors[type] || colors.success,
        color: '#fff',
        padding: '12px 22px',
        borderRadius: '12px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: '600',
        fontSize: '.88rem',
        boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateY(10px)',
        transition: 'opacity .3s ease, transform .3s ease',
        maxWidth: '300px',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3500);
}

/* ---------- Animated Counters (hero stats) ---------- */
(function () {
    const statNums = document.querySelectorAll('.stat-num');
    if (!statNums.length) return;

    // Extract raw numbers for animation target
    function parseNum(el) {
        const raw = el.textContent.replace(/[^0-9.]/g, '');
        return parseFloat(raw) || 0;
    }

    function formatNum(el, value) {
        const original = el.dataset.original;
        // Reconstruct with original suffix
        return original.replace(/[\d.]+/, Math.round(value));
    }

    // Store originals
    statNums.forEach(el => { el.dataset.original = el.textContent; });

    let animated = false;

    function animateCounters() {
        if (animated) return;
        animated = true;

        statNums.forEach(el => {
            const target = parseNum(el);
            const duration = 1600;
            const start = performance.now();

            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                el.textContent = formatNum(el, eased * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = el.dataset.original; // restore exact text
            }

            requestAnimationFrame(step);
        });
    }

    // Trigger when hero stats come into view
    const hero = document.querySelector('.hero-stats');
    if (!hero) return;

    const observer = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting) animateCounters(); },
        { threshold: 0.5 }
    );
    observer.observe(hero);
})();

/* ---------- Pricing Toggle (Annual / Monthly) — future-ready ---------- */
// No toggle exists in current HTML; wired up for easy extension.
(function () {
    const toggle = document.getElementById('pricingToggle');
    if (!toggle) return;

    const prices = document.querySelectorAll('[data-monthly]');
    let isAnnual = false;

    toggle.addEventListener('change', () => {
        isAnnual = toggle.checked;
        prices.forEach(el => {
            el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
        });
    });
})();

/* ---------- Navbar Dropdown — close on outside click (mobile) ---------- */
document.addEventListener('click', (e) => {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        if (!menu.closest('.dropdown').contains(e.target)) {
            const toggle = menu.closest('.dropdown').querySelector('.dropdown-toggle');
            bootstrap.Dropdown.getInstance(toggle)?.hide();
        }
    });
});

/* ---------- Close sidebar with Escape key ---------- */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    }
});