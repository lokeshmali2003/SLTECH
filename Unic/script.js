/* =========================================================
   WAYFARER TOURS & TRAVELS — script.js
   Handles: navbar scroll state, scroll reveals, counters,
   gallery lightbox, back-to-top, and form interactions.
   ========================================================= */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        setFooterYear();
        initNavbarScroll();
        initScrollReveal();
        initCounters();
        initGalleryLightbox();
        initBackToTop();
        initContactForm();
        initNewsletterForm();
        initQuickSearchForm();
    });

    /* ---------- Footer year ---------- */
    function setFooterYear() {
        var yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    }

    /* ---------- Navbar shrink-on-scroll ---------- */
    function initNavbarScroll() {
        var navbar = document.getElementById('mainNavbar');
        if (!navbar) return;

        function updateNavbar() {
            if (window.scrollY > 40) {
                navbar.classList.add('is-scrolled');
            } else {
                navbar.classList.remove('is-scrolled');
            }
        }

        updateNavbar();
        window.addEventListener('scroll', updateNavbar, { passive: true });
    }

    /* ---------- data-aos style scroll reveal ---------- */
    function initScrollReveal() {
        var targets = document.querySelectorAll('[data-aos]');
        if (!targets.length) return;

        if (!('IntersectionObserver' in window)) {
            targets.forEach(function (el) { el.classList.add('aos-in'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
                    setTimeout(function () {
                        el.classList.add('aos-in');
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(function (el) { observer.observe(el); });
    }

    /* ---------- Animated counters (About section) ---------- */
    function initCounters() {
        var counters = document.querySelectorAll('.counter[data-target]');
        if (!counters.length) return;

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-target'), 10) || 0;
            var duration = 1600;
            var startTime = null;

            function step(timestamp) {
                if (startTime === null) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                var current = Math.floor(eased * target);
                el.textContent = current.toLocaleString();
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target.toLocaleString();
                }
            }
            requestAnimationFrame(step);
        }

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animateCounter);
            return;
        }

        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(function (el) { counterObserver.observe(el); });
    }

    /* ---------- Gallery lightbox ---------- */
    function initGalleryLightbox() {
        var items = document.querySelectorAll('.gallery-item[data-img]');
        var overlay = document.getElementById('lightboxOverlay');
        var overlayImg = document.getElementById('lightboxImg');
        var closeBtn = document.getElementById('lightboxClose');
        if (!items.length || !overlay || !overlayImg || !closeBtn) return;

        var lastFocused = null;

        function openLightbox(src, alt) {
            lastFocused = document.activeElement;
            overlayImg.src = src;
            overlayImg.alt = alt || 'Gallery preview';
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }

        function closeLightbox() {
            overlay.classList.remove('show');
            document.body.style.overflow = '';
            overlayImg.src = '';
            if (lastFocused) lastFocused.focus();
        }

        items.forEach(function (item) {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'View larger image');

            item.addEventListener('click', function () {
                var img = item.querySelector('img');
                openLightbox(item.getAttribute('data-img'), img ? img.alt : '');
            });

            item.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    var img = item.querySelector('img');
                    openLightbox(item.getAttribute('data-img'), img ? img.alt : '');
                }
            });
        });

        closeBtn.addEventListener('click', closeLightbox);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeLightbox();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('show')) {
                closeLightbox();
            }
        });
    }

    /* ---------- Back to top button ---------- */
    function initBackToTop() {
        var btn = document.getElementById('backToTop');
        if (!btn) return;

        function toggleVisibility() {
            if (window.scrollY > 480) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }

        toggleVisibility();
        window.addEventListener('scroll', toggleVisibility, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Contact form validation + fake submit ---------- */
    function initContactForm() {
        var form = document.getElementById('contactForm');
        var successBox = document.getElementById('formSuccess');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                var firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            form.classList.add('was-validated');

            var submitBtn = form.querySelector('button[type="submit"]');
            var originalHTML = submitBtn ? submitBtn.innerHTML : null;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Sending...';
            }

            setTimeout(function () {
                if (successBox) {
                    successBox.classList.remove('d-none');
                }
                form.reset();
                form.classList.remove('was-validated');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                }
                if (successBox) {
                    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    setTimeout(function () {
                        successBox.classList.add('d-none');
                    }, 6000);
                }
            }, 700);
        });

        // Live-clear invalid state as the visitor types/selects
        form.querySelectorAll('input, textarea').forEach(function (field) {
            field.addEventListener('input', function () {
                if (form.classList.contains('was-validated')) {
                    field.classList.toggle('is-invalid', !field.checkValidity());
                }
            });
        });
    }

    /* ---------- Newsletter form (footer) ---------- */
    function initNewsletterForm() {
        var form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = form.querySelector('input[type="email"]');
            var button = form.querySelector('button');
            if (!input || !input.checkValidity()) {
                if (input) input.focus();
                return;
            }

            var icon = button ? button.querySelector('i') : null;
            var originalClass = icon ? icon.className : null;

            if (icon) icon.className = 'bi bi-check-lg';
            if (button) button.disabled = true;

            setTimeout(function () {
                input.value = '';
                if (icon && originalClass) icon.className = originalClass;
                if (button) button.disabled = false;
            }, 2200);
        });
    }

    /* ---------- Quick search strip (hero) ---------- */
    function initQuickSearchForm() {
        var form = document.getElementById('quickSearchForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var packages = document.getElementById('packages');
            if (packages) {
                packages.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
})();