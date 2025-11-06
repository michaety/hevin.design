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
    
    // Hero portal effect (passive for performance)
    document.addEventListener('mousemove', (e) => {
        updateHeroPortal(e);
    }, { passive: true });
    
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
    
    // Shimmer effect for specific titles - triggered on scroll
    const shimmerTitles = [
        "Your Creative Growth Partner",
        "Our Services",
        "Skills & Tech Stack",
        "Sample Projects",
        "What Our Clients Say",
        "Why Choose Hevin Design",
        "Our Process",
        "Frequently Asked Questions",
        "Let's Elevate Your Brand"
    ];

    // Add shimmer class only to specific titles
    document.querySelectorAll('h1, h2, h3').forEach(el => {
        if (shimmerTitles.includes(el.textContent.trim())) {
            el.classList.add('shimmer');
        } else {
            el.classList.remove('shimmer');
        }
    });

    // Function to get average luminance of background color at element position
    function getBackgroundLuminance(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Try to get computed background color from element or ancestors
        let currentEl = element;
        let bgColor = null;
        
        while (currentEl && currentEl !== document.body) {
            const style = window.getComputedStyle(currentEl);
            const bg = style.backgroundColor;
            
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                bgColor = bg;
                break;
            }
            currentEl = currentEl.parentElement;
        }
        
        // Default to body background if no specific background found
        if (!bgColor) {
            bgColor = window.getComputedStyle(document.body).backgroundColor;
        }
        
        // Parse RGB values
        const rgbMatch = bgColor.match(/\d+/g);
        if (!rgbMatch || rgbMatch.length < 3) {
            return 0.5; // Default to medium luminance
        }
        
        const r = parseInt(rgbMatch[0]);
        const g = parseInt(rgbMatch[1]);
        const b = parseInt(rgbMatch[2]);
        
        // Calculate relative luminance using WCAG formula
        const rsRGB = r / 255;
        const gsRGB = g / 255;
        const bsRGB = b / 255;
        
        const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
        
        return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    }

    // Function to update shimmer gradient based on background
    function updateShimmerColors(element) {
        const luminance = getBackgroundLuminance(element);
        
        // If background is light (luminance > 0.5), use dark shimmer
        // If background is dark (luminance <= 0.5), use light shimmer
        if (luminance > 0.5) {
            // Dark shimmer for light backgrounds
            element.style.background = 'linear-gradient(90deg, #333, #666, #333)';
        } else {
            // Light shimmer for dark backgrounds
            element.style.background = 'linear-gradient(90deg, #fff, #ddd, #fff)';
        }
        
        // Maintain shimmer properties
        element.style.backgroundSize = '200% auto';
        element.style.backgroundClip = 'text';
        element.style.webkitBackgroundClip = 'text';
        element.style.webkitTextFillColor = 'transparent';
    }

    // Sync all shimmer texts with their backgrounds
    function syncShimmerTexts() {
        document.querySelectorAll('.shimmer').forEach(element => {
            updateShimmerColors(element);
        });
    }

    // Initial sync
    syncShimmerTexts();

    // Update shimmer colors on scroll (passive for performance)
    document.addEventListener('scroll', syncShimmerTexts, { passive: true });

    // Update shimmer colors on resize
    window.addEventListener('resize', syncShimmerTexts);

    // Update shimmer colors on animation frame for smooth transitions with the background
    let lastUpdateTime = 0;
    const updateInterval = 500; // Update every 500ms to avoid performance issues

    function updateShimmerOnFrame(timestamp) {
        if (timestamp - lastUpdateTime >= updateInterval) {
            syncShimmerTexts();
            lastUpdateTime = timestamp;
        }
        requestAnimationFrame(updateShimmerOnFrame);
    }

    requestAnimationFrame(updateShimmerOnFrame);
});