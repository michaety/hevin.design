// Menu toggle
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

// Debounce utility for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility for performance optimization
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

// Enhanced scroll animations with IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('section, .service-card, .project-card, .process-step');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
                
                // Remove will-change after animation completes to free GPU resources
                setTimeout(() => {
                    entry.target.style.willChange = 'auto';
                }, 1000);
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
    
    if (!clouds.length || !hero) return; // Early return if elements don't exist
    
    const isMobile = window.innerWidth <= 768;
    const mobileCloudIndices = [0, 1, 2, 3, 4]; // Clouds 1-5 for mobile

    function updateInitialPositions() {
        const currentMobile = window.innerWidth <= 768;
        clouds.forEach((cloud, index) => {
            const topPercent = parseFloat(cloud.style.top) || 0;
            if (currentMobile && !mobileCloudIndices.includes(index)) {
                cloud.style.display = 'none'; // Hide clouds 6-9 on mobile
            } else {
                cloud.style.display = 'block';
                cloud.dataset.initialTop = (topPercent / 100 * hero.clientHeight).toString();
            }
        });
    }

    // Optimized with requestAnimationFrame for smooth performance
    let ticking = false;
    function updateCloudPositions() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const heroRect = hero.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const heroTop = heroRect.top + scrollTop;
                const currentMobile = window.innerWidth <= 768;
                const fadeMargin = currentMobile ? 20 : 50; // Smaller fade margin for mobile

                clouds.forEach((cloud, index) => {
                    if (currentMobile && !mobileCloudIndices.includes(index)) {
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

                ticking = false;
            });
            ticking = true;
        }
    }

    // Initial setup for clouds
    updateInitialPositions();
    clouds.forEach((cloud, index) => {
        const currentMobile = window.innerWidth <= 768;
        if (currentMobile && !mobileCloudIndices.includes(index)) {
            cloud.style.display = 'none'; // Initial hide for mobile
        } else {
            const speed = parseFloat(cloud.getAttribute('data-speed'));
            cloud.style.animation = `bounceHover ${2 + speed}s infinite ease-in-out`;
            cloud.style.animationDelay = `${speed * 0.5}s`; // Staggered start
        }
    });

    // Event listeners with performance optimizations
    window.addEventListener('resize', debounce(() => {
        updateInitialPositions();
        updateCloudPositions();
    }, 150), { passive: true });
    
    window.addEventListener('scroll', updateCloudPositions, { passive: true });
    
    updateCloudPositions(); // Initial call
});