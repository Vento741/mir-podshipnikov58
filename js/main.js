/**
 * МИР ПОДШИПНИКОВ - Main JavaScript
 * Version: 2.0
 * Premium Website Interactions & Animations
 */

(function() {
    'use strict';

    // ===================================================================
    // CONFIGURATION
    // ===================================================================
    const CONFIG = {
        scrollOffset: 100,
        animationDelay: 100,
        counterDuration: 2000,
        preloaderDelay: 500,
        headerScrollThreshold: 50
    };

    // ===================================================================
    // DOM ELEMENTS
    // ===================================================================
    const DOM = {
        preloader: document.getElementById('preloader'),
        header: document.getElementById('header'),
        burger: document.getElementById('burger'),
        mobileMenu: document.getElementById('mobileMenu'),
        navMenu: document.getElementById('navMenu'),
        scrollTop: document.getElementById('scrollTop'),
        requestForm: document.getElementById('requestForm'),
        successModal: document.getElementById('successModal'),
        currentYear: document.getElementById('currentYear')
    };

    // ===================================================================
    // PRELOADER
    // ===================================================================
    function initPreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (DOM.preloader) {
                    DOM.preloader.classList.add('hidden');
                    document.body.style.overflow = '';

                    // Start animations after preloader
                    startHeroAnimations();
                }
            }, CONFIG.preloaderDelay);
        });

        // Fallback: hide preloader after 5 seconds
        setTimeout(() => {
            if (DOM.preloader && !DOM.preloader.classList.contains('hidden')) {
                DOM.preloader.classList.add('hidden');
            }
        }, 5000);
    }

    // ===================================================================
    // HERO ANIMATIONS
    // ===================================================================
    function startHeroAnimations() {
        const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-fade-in-up');

        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
            }, index * CONFIG.animationDelay);
        });

        // Start counter animations
        initCounters();
    }

    // ===================================================================
    // HEADER SCROLL BEHAVIOR
    // ===================================================================
    function initHeader() {
        let lastScroll = 0;
        let ticking = false;

        function updateHeader() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > CONFIG.headerScrollThreshold) {
                DOM.header.classList.add('scrolled');
            } else {
                DOM.header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateHeader();
    }

    // ===================================================================
    // MOBILE MENU
    // ===================================================================
    function initMobileMenu() {
        if (!DOM.burger || !DOM.mobileMenu) return;

        function toggleMenu() {
            const isOpen = DOM.burger.classList.toggle('active');
            DOM.mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            DOM.burger.setAttribute('aria-expanded', isOpen);
        }

        function closeMenu() {
            DOM.burger.classList.remove('active');
            DOM.mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            DOM.burger.setAttribute('aria-expanded', 'false');
        }

        DOM.burger.addEventListener('click', toggleMenu);

        // Close menu when clicking on links
        const mobileLinks = DOM.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (DOM.mobileMenu.classList.contains('active') &&
                !DOM.mobileMenu.contains(e.target) &&
                !DOM.burger.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // ===================================================================
    // SMOOTH SCROLL
    // ===================================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href === '#' || href === '#privacy') return;

                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }

    // ===================================================================
    // SCROLL TO TOP BUTTON
    // ===================================================================
    function initScrollTop() {
        if (!DOM.scrollTop) return;

        function toggleScrollButton() {
            if (window.pageYOffset > 400) {
                DOM.scrollTop.classList.add('visible');
            } else {
                DOM.scrollTop.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', throttle(toggleScrollButton, 100), { passive: true });

        DOM.scrollTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===================================================================
    // ANIMATED COUNTERS
    // ===================================================================
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = CONFIG.counterDuration;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-quad)
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(start + (target - start) * easeProgress);
            element.textContent = formatNumber(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = formatNumber(target);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return num.toLocaleString('ru-RU');
        }
        return num.toString();
    }

    // ===================================================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ===================================================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.catalog-card, .brand-card, .advantage-card, .contact-card, .guarantee-card, .about-feature'
        );

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }

    // ===================================================================
    // FORM HANDLING
    // ===================================================================
    function initForm() {
        if (!DOM.requestForm) return;

        // Phone mask
        const phoneInput = DOM.requestForm.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', handlePhoneMask);
            phoneInput.addEventListener('focus', function() {
                if (!this.value) {
                    this.value = '+7 ';
                }
            });
        }

        // Form submission
        DOM.requestForm.addEventListener('submit', handleFormSubmit);
    }

    function handlePhoneMask(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 0) {
            if (value[0] === '8') {
                value = '7' + value.slice(1);
            } else if (value[0] !== '7') {
                value = '7' + value;
            }
        }

        let formatted = '';
        if (value.length > 0) {
            formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.substring(1, 4);
            }
            if (value.length > 4) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length > 7) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length > 9) {
                formatted += '-' + value.substring(9, 11);
            }
        }

        e.target.value = formatted;
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Validate
        if (!validateForm(form)) {
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Отправка...</span>
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20">
                    <animate attributeName="stroke-dashoffset" dur="1s" repeatCount="indefinite" values="60;0"/>
                    <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" values="0 12 12;360 12 12"/>
                </circle>
            </svg>
        `;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success
            showModal(DOM.successModal);
            form.reset();

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }, 1500);
    }

    function validateForm(form) {
        const name = form.querySelector('#name');
        const phone = form.querySelector('#phone');
        const agreement = form.querySelector('#agreement');

        let isValid = true;

        // Name validation
        if (name && name.value.trim().length < 2) {
            showFieldError(name, 'Введите ваше имя');
            isValid = false;
        } else {
            clearFieldError(name);
        }

        // Phone validation
        if (phone) {
            const phoneDigits = phone.value.replace(/\D/g, '');
            if (phoneDigits.length < 11) {
                showFieldError(phone, 'Введите корректный номер телефона');
                isValid = false;
            } else {
                clearFieldError(phone);
            }
        }

        // Agreement validation
        if (agreement && !agreement.checked) {
            const label = agreement.parentElement;
            label.style.color = 'var(--error)';
            isValid = false;

            agreement.addEventListener('change', function handler() {
                label.style.color = '';
                this.removeEventListener('change', handler);
            });
        }

        return isValid;
    }

    function showFieldError(field, message) {
        field.style.borderColor = 'var(--error)';

        // Remove existing error message
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.style.cssText = 'display: block; color: var(--error); font-size: 0.875rem; margin-top: 0.25rem;';
        errorEl.textContent = message;
        field.parentElement.appendChild(errorEl);

        // Clear on input
        field.addEventListener('input', function handler() {
            clearFieldError(field);
            this.removeEventListener('input', handler);
        });
    }

    function clearFieldError(field) {
        if (!field) return;
        field.style.borderColor = '';
        const errorEl = field.parentElement.querySelector('.field-error');
        if (errorEl) {
            errorEl.remove();
        }
    }

    // ===================================================================
    // MODAL HANDLING
    // ===================================================================
    function showModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Global function for modal close button
    window.closeModal = closeModal;

    function initModals() {
        // Close on overlay click
        document.querySelectorAll('.modal').forEach(modal => {
            const overlay = modal.querySelector('.modal-overlay');
            const closeBtn = modal.querySelector('.modal-close');

            if (overlay) {
                overlay.addEventListener('click', closeModal);
            }
            if (closeBtn) {
                closeBtn.addEventListener('click', closeModal);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    // ===================================================================
    // CURRENT YEAR
    // ===================================================================
    function initCurrentYear() {
        if (DOM.currentYear) {
            DOM.currentYear.textContent = new Date().getFullYear();
        }
    }

    // ===================================================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ===================================================================
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav a');

        function highlightNav() {
            const scrollPos = window.pageYOffset + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', throttle(highlightNav, 100), { passive: true });
    }

    // ===================================================================
    // BRAND POPUPS (Mobile Tap)
    // ===================================================================
    function initBrandPopups() {
        const brandCards = document.querySelectorAll('.brand-card[data-brand]');

        if (brandCards.length === 0) return;

        // Check if touch device or small screen
        function isMobileView() {
            return window.innerWidth < 1024;
        }

        brandCards.forEach(card => {
            const popup = card.querySelector('.brand-popup');
            const closeBtn = card.querySelector('.brand-popup-close');

            if (!popup) return;

            // Handle card click (for mobile)
            card.addEventListener('click', (e) => {
                if (!isMobileView()) return;

                // Don't trigger if clicking close button
                if (e.target.closest('.brand-popup-close')) return;

                e.preventDefault();
                e.stopPropagation();

                // Close other open popups
                brandCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('active');
                    }
                });

                // Toggle current popup
                card.classList.toggle('active');

                // Prevent body scroll when popup is open
                if (card.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Handle close button click
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    card.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        });

        // Close popup on overlay click (clicking outside popup content)
        document.addEventListener('click', (e) => {
            if (!isMobileView()) return;

            const activeCard = document.querySelector('.brand-card.active');
            if (!activeCard) return;

            const popup = activeCard.querySelector('.brand-popup');

            // If click is not inside popup, close it
            if (!popup.contains(e.target) && !activeCard.contains(e.target)) {
                activeCard.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeCard = document.querySelector('.brand-card.active');
                if (activeCard) {
                    activeCard.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            if (!isMobileView()) {
                // Close all popups when switching to desktop view
                brandCards.forEach(card => {
                    card.classList.remove('active');
                });
                document.body.style.overflow = '';
            }
        }, 150));
    }

    // ===================================================================
    // PARALLAX EFFECTS
    // ===================================================================
    function initParallax() {
        const heroPattern = document.querySelector('.hero-pattern');

        if (!heroPattern) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroPattern.style.transform = `translateY(${scrolled * 0.3}px)`;
        }, { passive: true });
    }

    // ===================================================================
    // UTILITY FUNCTIONS
    // ===================================================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // ===================================================================
    // LAZY LOADING FOR IMAGES
    // ===================================================================
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            lazyImages.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // Fallback for older browsers
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ===================================================================
    // KEYBOARD ACCESSIBILITY
    // ===================================================================
    function initAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.tabIndex = -1;
                    target.focus();
                }
            });
        }

        // Focus trap for modals
        document.querySelectorAll('.modal').forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            modal.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            });
        });
    }

    // ===================================================================
    // PERFORMANCE MONITORING
    // ===================================================================
    function initPerformanceMonitoring() {
        if ('performance' in window && 'PerformanceObserver' in window) {
            // Report Core Web Vitals
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        console.log(`${entry.name}: ${entry.value || entry.duration}`);
                    }
                });

                observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
            } catch (e) {
                // PerformanceObserver not fully supported
            }
        }
    }

    // ===================================================================
    // INITIALIZE
    // ===================================================================
    function init() {
        // Core functionality
        initPreloader();
        initHeader();
        initMobileMenu();
        initSmoothScroll();
        initScrollTop();
        initScrollAnimations();
        initForm();
        initModals();
        initCurrentYear();
        initActiveNav();
        initBrandPopups();
        initParallax();
        initLazyLoading();
        initAccessibility();

        // Performance (only in production)
        if (window.location.hostname !== 'localhost') {
            initPerformanceMonitoring();
        }

        console.log('%c Мир Подшипников ',
            'background: linear-gradient(135deg, #1d4ed8, #1e3a8a); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 8px;'
        );
        console.log('%c Сайт разработан с любовью к деталям ',
            'color: #6b7280; font-style: italic;'
        );
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
