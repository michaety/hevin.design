// Menu toggle
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

// Constants
const FORM_MESSAGES = {
    success: 'Message sent successfully! We\'ll get back to you soon.',
    error: 'Error sending message. Please email us directly at info@hevin.design',
    networkError: 'Network error. Please email us directly at info@hevin.design'
};

// Hero portal mouse effect - REMOVED
/*
function updateHeroPortal(e) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    hero.style.setProperty('--mouse-x', x + '%');
    hero.style.setProperty('--mouse-y', y + '%');
}
*/

// Cursor-following gradient overlay effect
function initCursorGradient() {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Don't initialize on mobile or if user prefers reduced motion
    if (isMobile || prefersReducedMotion) {
        return;
    }
    
    const overlay = document.querySelector('.cursor-gradient-overlay');
    if (!overlay) return;
    
    let cursorX = 50;
    let cursorY = 50;
    let requestId = null;
    
    // Update cursor position
    function updateCursorPosition(e) {
        cursorX = (e.clientX / window.innerWidth) * 100;
        cursorY = (e.clientY / window.innerHeight) * 100;
        
        // Use requestAnimationFrame for smooth, throttled updates
        if (!requestId) {
            requestId = requestAnimationFrame(() => {
                // Set CSS variables on body for global access
                document.body.style.setProperty('--cursor-x', `${cursorX}%`);
                document.body.style.setProperty('--cursor-y', `${cursorY}%`);
                requestId = null;
            });
        }
    }
    
    // Add event listener with passive flag for better performance
    document.addEventListener('mousemove', updateCursorPosition, { passive: true });
}

// Enhanced scroll animations with IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cursor-following gradient effect
    initCursorGradient();
    
    // Hero subtitle unblur on page load
    document.body.classList.add('loaded');
    
    // Smooth scroll with nav offset
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('nav').offsetHeight;
                window.scrollTo({ top: target.offsetTop - navHeight - 20, behavior: 'smooth' });
            }
        });
    });

    // Enhanced hamburger menu behavior for mobile
    const menu = document.querySelector('#nav-menu');
    const hamburger = document.querySelector('.menu-toggle');
    const links = menu ? menu.querySelectorAll('a') : [];

    // Close menu on outside click
    if (menu && hamburger) {
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
                menu.classList.remove('active');
            }
        });

        // Close menu after selecting a link
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    }


    const elements = document.querySelectorAll('section, .service-card, .project-card, .process-step');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '50px'
    });

    elements.forEach(element => {
        observer.observe(element);
    });

    // FAQ Accordion functionality with cursor-follow effect
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Track mouse position for radial gradient effect
    faqItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            item.style.setProperty('--mouse-x', x + '%');
            item.style.setProperty('--mouse-y', y + '%');
        });
    });
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            
            // Toggle current FAQ
            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('open');
            icon.textContent = isExpanded ? '+' : '-';
        });
    });
    
    // Hero portal effect - REMOVED
    /*
    document.addEventListener('mousemove', (e) => {
        updateHeroPortal(e);
    }, { passive: true });
    */
    
    // Section color shift on scroll
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                entry.target.style.opacity = '1';
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.3
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // About section background fade on scroll
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    aboutSection.classList.add('fade-to-white');
                } else {
                    aboutSection.classList.remove('fade-to-white');
                }
            });
        }, {
            threshold: 0.2
        });
        
        aboutObserver.observe(aboutSection);
    }
    
    // Form submission handler
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Create or get message container
            let messageEl = document.getElementById('form-message');
            if (!messageEl) {
                messageEl = document.createElement('div');
                messageEl.id = 'form-message';
                messageEl.style.cssText = 'margin-top: 1rem; padding: 1rem; border-radius: 0.375rem; text-align: center; font-weight: 500;';
                form.appendChild(messageEl);
            }
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            messageEl.textContent = '';
            messageEl.style.display = 'none';
            
            const data = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    messageEl.textContent = FORM_MESSAGES.success;
                    messageEl.style.backgroundColor = '#D1FAE5';
                    messageEl.style.color = '#065F46';
                    messageEl.style.display = 'block';
                    messageEl.setAttribute('role', 'status');
                    messageEl.setAttribute('aria-live', 'polite');
                    form.reset();
                } else {
                    messageEl.textContent = FORM_MESSAGES.error;
                    messageEl.style.backgroundColor = '#FEE2E2';
                    messageEl.style.color = '#991B1B';
                    messageEl.style.display = 'block';
                    messageEl.setAttribute('role', 'alert');
                    messageEl.setAttribute('aria-live', 'assertive');
                }
            } catch (error) {
                messageEl.textContent = FORM_MESSAGES.networkError;
                messageEl.style.backgroundColor = '#FEE2E2';
                messageEl.style.color = '#991B1B';
                messageEl.style.display = 'block';
                messageEl.setAttribute('role', 'alert');
                messageEl.setAttribute('aria-live', 'assertive');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Add holographic shimmer effect on card mouse move
    const cards = document.querySelectorAll('.service-card, .project-card');
    
    // Check if device is touch-enabled or user prefers reduced motion
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    cards.forEach(card => {
        if (!isTouchDevice && !prefersReducedMotion && window.innerWidth > 768) {
            // Use requestAnimationFrame for smooth, throttled mousemove handler
            let rafId = null;
            let lastMouseEvent = null;
            
            const updateCardEffect = () => {
                if (!lastMouseEvent) return;
                
                const e = lastMouseEvent;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Update CSS custom properties for holographic effect
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                
                card.style.setProperty('--mouse-x', `${xPercent}%`);
                card.style.setProperty('--mouse-y', `${yPercent}%`);
                
                // Also apply tilt effect
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                
                rafId = null;
            };
            
            card.addEventListener('mousemove', (e) => {
                lastMouseEvent = e;
                
                if (!rafId) {
                    rafId = requestAnimationFrame(updateCardEffect);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                lastMouseEvent = null;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                card.style.transform = '';
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
            });
        }
    });
    
    // New Holographic Shimmer Effect for specific h2 elements
    const shimmerElements = document.querySelectorAll('.shimmer');

    const shimmerObserver = new IntersectionObserver(entries => {
        let delay = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    setTimeout(() => entry.target.classList.remove('visible'), 2000);
                }, delay);
                delay += 400;
            }
        });
    }, { threshold: 0.2 });

    shimmerElements.forEach(el => shimmerObserver.observe(el));

});