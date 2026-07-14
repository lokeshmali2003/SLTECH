/* =====================================================================
   UNIक CAB SERVICE — MAIN JAVASCRIPT
   Handles: sticky navbar state, scroll-reveal animations, counters,
   back-to-top button, booking/notify forms, smooth scroll, footer year.
===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------------------------
       1. STICKY NAVBAR — add solid background after scrolling
    ----------------------------------------------------------- */
    const navbar = document.getElementById('mainNavbar');
    const NAV_SCROLL_THRESHOLD = 60;

    const handleNavbarScroll = () => {
        if (window.scrollY > NAV_SCROLL_THRESHOLD) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    /* -----------------------------------------------------------
       2. SCROLL-REVEAL ANIMATIONS (IntersectionObserver)
    ----------------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    /* -----------------------------------------------------------
       3. ANIMATED STAT COUNTERS
    ----------------------------------------------------------- */
    const counters = document.querySelectorAll('.counter');

    const animateCounter = (el) => {
        const target = parseFloat(el.dataset.target);
        const isDecimal = !Number.isInteger(target);
        const duration = 1600; // ms
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = target * eased;
            el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
            }
        };
        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObserver.observe(el));

    /* -----------------------------------------------------------
       4. BACK TO TOP BUTTON
    ----------------------------------------------------------- */
    const backToTopBtn = document.getElementById('backToTop');
    const toggleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* -----------------------------------------------------------
       5. NOTIFY / FARE-ALERTS FORM — front-end only success state
    ----------------------------------------------------------- */
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phoneInput = newsletterForm.querySelector('input[type="tel"]');
            if (phoneInput.checkValidity()) {
                newsletterSuccess.classList.add('show');
                newsletterForm.reset();
                setTimeout(() => newsletterSuccess.classList.remove('show'), 5000);
            }
        });
    }

    /* -----------------------------------------------------------
       6. BOOKING WIDGET — prevent real submission, gentle feedback
    ----------------------------------------------------------- */
    const bookingWidget = document.querySelector('.booking-widget');
    if (bookingWidget) {
        bookingWidget.addEventListener('submit', (e) => {
            e.preventDefault();
            const pricingSection = document.getElementById('pricing');
            if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* -----------------------------------------------------------
       7. FOOTER — current year
    ----------------------------------------------------------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* -----------------------------------------------------------
       8. SMOOTH SCROLL FOR ANY REMAINING ANCHOR LINKS
       (Offcanvas links close the menu automatically via
       data-bs-dismiss="offcanvas" set directly in the HTML.)
    ----------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

});