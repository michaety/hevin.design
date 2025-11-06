// Menu toggle
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

// Enhanced multi-layered cursor trail effect (comet-like)
const trails = [];
const TRAIL_COUNT = 3;
const STAGGER_DELAY_MS = 50; // Delay between each trail layer update

function initCursorTrails() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return; // Disable on mobile
    
    // Create 3 layered trail elements
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.transitionDelay = `${i * 0.05}s`;
        trail.style.zIndex = 9999 - i; // Layer them properly
        document.body.appendChild(trail);
        trails.push(trail);
    }
}

function updateCursorTrails(x, y) {
    if (trails.length === 0) return;
    
    trails.forEach((trail, idx) => {
        setTimeout(() => {
            trail.style.left = `${x}px`;
            trail.style.top = `${y}px`;
            trail.style.opacity = 1 - (idx * 0.3); // Gradually fade each layer
        }, idx * STAGGER_DELAY_MS); // Stagger the movement
    });
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