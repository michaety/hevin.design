// Menu toggle
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

// Cursor trail effect
let cursorTrails = [];
const MAX_TRAILS = 15;

function createCursorTrail(x, y) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth <= 768) return; // Disable on mobile
    
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    trail.style.opacity = '1';
    document.body.appendChild(trail);
    
    cursorTrails.push(trail);
    
    setTimeout(() => {
        trail.style.opacity = '0';
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
            cursorTrails = cursorTrails.filter(t => t !== trail);
        }, 300);
    }, 200);
    
    if (cursorTrails.length > MAX_TRAILS) {
        const oldTrail = cursorTrails.shift();
        if (oldTrail && oldTrail.parentNode) {
            oldTrail.parentNode.removeChild(oldTrail);
        }
    }
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


    // Constants
    const MOBILE_BREAKPOINT = 768;
    const mobileCloudIndices = [0, 1, 2, 3, 4]; // Clouds 1-5 for mobile
    
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

    // Cloud scroll and bobbing animation
    const clouds = document.querySelectorAll('.cloud');
    const hero = document.querySelector('.hero');

    function updateInitialPositions() {
        const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
        clouds.forEach((cloud, index) => {
            const topPercent = parseFloat(cloud.style.top) || 0;
            if (isMobile && !mobileCloudIndices.includes(index)) {
                cloud.style.display = 'none'; // Hide clouds 6-9 on mobile
            } else {
                cloud.style.display = 'block';
                cloud.dataset.initialTop = (topPercent / 100 * hero.clientHeight).toString();
            }
        });
    }

    function updateCloudPositions() {
        const heroRect = hero.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroTop = heroRect.top + scrollTop;
        const heroBottom = heroTop + heroRect.height;
        const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
        const fadeMargin = isMobile ? 20 : 50; // Smaller fade margin for mobile

        clouds.forEach((cloud, index) => {
            if (isMobile && !mobileCloudIndices.includes(index)) {
                cloud.style.display = 'none'; // Ensure hidden on mobile
                return;
            }

            const speed = parseFloat(cloud.getAttribute('data-speed'));
            const initialTop = parseFloat(cloud.dataset.initialTop) || 0;
            const offset = scrollTop * (1 - speed); // Parallax effect
            const newTop = initialTop + offset;
            const cloudHeight = cloud.offsetHeight;
            const cloudBottom = newTop + cloudHeight;

            // Set cloud position
            cloud.style.top = `${newTop}px`;

            // Calculate fade based on proximity to hero boundaries
            const maxOpacity = 0.8;
            let opacity = maxOpacity;

            if (newTop < -cloudHeight + fadeMargin) {
                // Fade out when approaching top
                opacity = Math.max(0, maxOpacity * ((newTop + cloudHeight) / fadeMargin));
            } else if (cloudBottom > heroRect.height - fadeMargin) {
                // Fade out when approaching bottom
                opacity = Math.max(0, maxOpacity * ((heroRect.height - newTop) / fadeMargin));
            }

            cloud.style.opacity = opacity.toFixed(2);
        });
    }

    // Initial setup for clouds
    updateInitialPositions();
    clouds.forEach((cloud, index) => {
        const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
        if (isMobile && !mobileCloudIndices.includes(index)) {
            cloud.style.display = 'none'; // Initial hide for mobile
        } else {
            const speed = parseFloat(cloud.getAttribute('data-speed'));
            cloud.style.animation = `bounceHover ${2 + speed}s infinite ease-in-out`;
            cloud.style.animationDelay = `${speed * 0.5}s`; // Staggered start
        }
    });

    // Event listeners
    window.addEventListener('resize', () => {
        updateInitialPositions();
        updateCloudPositions();
    });
    window.addEventListener('scroll', updateCloudPositions);
    updateCloudPositions(); // Initial call

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
    
    // Cursor trail and hero portal effects
    let lastTrailTime = 0;
    const trailThrottle = 50; // milliseconds
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTrailTime > trailThrottle) {
            createCursorTrail(e.clientX, e.clientY);
            lastTrailTime = now;
        }
        
        updateHeroPortal(e);
    });
    
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