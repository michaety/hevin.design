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

// Cursor trail - Smooth comet-like trail
const trail = document.createElement('div');
trail.className = 'cursor-trail';
document.body.appendChild(trail);
let timeout;
let cursorTrailEnabled = false;

function initCursorTrails() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        trail.style.display = 'none';
        return;
    }
    if (window.innerWidth < 768) {
        trail.style.display = 'none';
        return;
    }
    cursorTrailEnabled = true;
    document.body.style.cursor = 'none';
}

function updateCursorTrails(x, y) {
    if (!cursorTrailEnabled) return;
    trail.style.transform = `translate(${x - 60}px, ${y - 10}px)`;
    trail.style.opacity = 0.7;
    clearTimeout(timeout);
    timeout = setTimeout(() => { 
        trail.style.opacity = 0; 
    }, 300);
}

// Hero portal mouse effect
function updateHeroPortal(e) {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    hero.style.setProperty('--mouse-x', x + '%');
    hero.style.setProperty('--mouse-y', y + '%');
}

// Enhanced scroll animations with IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
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

    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon');
            
            // Toggle current FAQ
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.display = isExpanded ? 'none' : 'block';
            icon.textContent = isExpanded ? '+' : '-';
        });
    });
    
    // Initialize cursor trails
    initCursorTrails();
    
    // Cursor trail and hero portal effects (passive for performance)
    document.addEventListener('mousemove', (e) => {
        updateCursorTrails(e.pageX, e.pageY);
        updateHeroPortal(e);
    }, { passive: true });
    
    // Section color shift on scroll
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
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
    
    // Add card tilt effect on mouse move
    const cards = document.querySelectorAll('.service-card, .project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            if (window.innerWidth <= 768) return; // Disable on mobile
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});