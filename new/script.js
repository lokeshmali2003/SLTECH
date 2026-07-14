/* ==========================================================================
   AURELIA VOYAGES — script.js
   Handles: sticky navbar state, scroll-reveal animations, animated stat
   counters, back-to-top button, and lightweight form feedback.
   No external JS dependencies beyond the Bootstrap bundle already loaded.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------------------------------------------------------------------
       1. Footer year
       --------------------------------------------------------------------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------------------------------------------------------------------
       2. Sticky navbar — switch to solid background after scrolling past hero
       --------------------------------------------------------------------- */
    var nav = document.getElementById('mainNav');
    var toggleNavBackground = function () {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    toggleNavBackground();
    window.addEventListener('scroll', toggleNavBackground, { passive: true });

    // Close the mobile menu automatically after a link is tapped
    var navLinks = document.querySelectorAll('#navMenu .nav-link, #navMenu .btn-nav-cta');
    var collapseEl = document.getElementById('navMenu');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (collapseEl.classList.contains('show') && window.bootstrap) {
                var collapse = window.bootstrap.Collapse.getOrCreateInstance(collapseEl);
                collapse.hide();
            }
        });
    });

    /* ---------------------------------------------------------------------
       3. Scroll-reveal animations via IntersectionObserver
       --------------------------------------------------------------------- */
    var revealTargets = document.querySelectorAll(
        '[data-aos], .dest-card, .package-card, .service-card, .gallery-item, .testimonial-card'
    );

    revealTargets.forEach(function (el) {
        el.classList.add('reveal');
    });

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: reveal everything immediately for older browsers
        revealTargets.forEach(function (el) {
            el.classList.add('aos-visible');
        });
    }

    /* ---------------------------------------------------------------------
       4. Animated stat counters (hero section)
       --------------------------------------------------------------------- */
    var counters = document.querySelectorAll('.stat-num');

    var animateCounter = function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var duration = 1600; // ms
        var startTime = null;

        var step = function (timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // ease-out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.floor(eased * target);
            el.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window && counters.length) {
        var counterObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    /* ---------------------------------------------------------------------
       5. Back-to-top button
       --------------------------------------------------------------------- */
    var backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------------------------------------------------------------------
       6. CTA form — lightweight client-side feedback (no backend wired up)
       --------------------------------------------------------------------- */
    var ctaForm = document.getElementById('ctaForm');
    var formNote = document.getElementById('formNote');

    if (ctaForm) {
        ctaForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!ctaForm.checkValidity()) {
                formNote.textContent = 'Please fill in every field before sending.';
                formNote.style.color = '#b3261e';
                return;
            }

            var name = document.getElementById('nameInput').value.trim();
            formNote.style.color = '';
            formNote.textContent = 'Thank you, ' + name.split(' ')[0] + '! A travel designer will be in touch within 24 hours.';
            ctaForm.reset();
        });
    }

    /* ---------------------------------------------------------------------
       7. Newsletter form — lightweight client-side feedback
       --------------------------------------------------------------------- */
    var newsletterForm = document.getElementById('newsletterForm');
    var newsletterNote = document.getElementById('newsletterNote');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            newsletterNote.style.color = '#8fd6ff';
            newsletterNote.textContent = "You're on the list — welcome aboard!";
            newsletterForm.reset();
        });
    }

});