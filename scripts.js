// ==================================
//  Hevin Design - JavaScript
//  Pricing Calculator & Form Handler
//  Updated for New Pricing Structure
// ==================================

document.addEventListener('DOMContentLoaded', function() {
    // ==================================
    // Hero Canvas Fluid Gradient
    // ==================================
    
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        initHeroCanvas(canvas);
    }
    
    function initHeroCanvas(canvas) {
        // Feature detection and performance checks
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        
        // Don't initialize canvas if reduced motion is preferred or on mobile
        if (prefersReducedMotion || !isDesktop) {
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Detect dark mode
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Color palettes
        const dayPalette = [
            { r: 255, g: 182, b: 193, a: 0.60 }, // Pastel Peach - increased
            { r: 173, g: 216, b: 230, a: 0.60 }, // Soft Blue - increased
            { r: 221, g: 160, b: 221, a: 0.60 }, // Lilac - increased
            { r: 255, g: 239, b: 213, a: 0.50 }, // Peach Cream - increased
        ];
        
        const nightPalette = [
            { r: 99, g: 102, b: 241, a: 0.70 },  // Indigo - increased
            { r: 139, g: 92, b: 246, a: 0.70 },  // Violet - increased
            { r: 34, g: 211, b: 238, a: 0.60 },  // Cyan - increased
            { r: 236, g: 72, b: 153, a: 0.60 },  // Magenta - increased
        ];
        
        const palette = isDarkMode ? nightPalette : dayPalette;
        
        // Resize canvas to match display size
        function resizeCanvas() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
        
        // Throttle resize for performance
        let resizeTimeout;
        function handleResize() {
            if (resizeTimeout) {
                cancelAnimationFrame(resizeTimeout);
            }
            resizeTimeout = requestAnimationFrame(resizeCanvas);
        }
        
        resizeCanvas();
        window.addEventListener('resize', handleResize);
        
        // Fluid gradient blobs
        const blobs = palette.map((color, i) => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: 150 + Math.random() * 200,
            color: color,
            phase: Math.random() * Math.PI * 2,
        }));
        
        // Cursor glow (only on desktop with pointer)
        let cursorX = canvas.width / 2;
        let cursorY = canvas.height / 2;
        let targetCursorX = cursorX;
        let targetCursorY = cursorY;
        let cursorActive = false;
        
        if (hasPointer) {
            canvas.parentElement.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                targetCursorX = e.clientX - rect.left;
                targetCursorY = e.clientY - rect.top;
                cursorActive = true;
            });
            
            canvas.parentElement.addEventListener('mouseleave', () => {
                cursorActive = false;
            });
        }
        
        // Animation loop
        let animationFrame;
        let time = 0;
        
        function animate() {
            time += 0.005;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Smooth cursor movement
            cursorX += (targetCursorX - cursorX) * 0.1;
            cursorY += (targetCursorY - cursorY) * 0.1;
            
            // Update and draw blobs
            blobs.forEach((blob) => {
                // Update position with organic motion
                blob.x += blob.vx + Math.sin(time + blob.phase) * 0.5;
                blob.y += blob.vy + Math.cos(time + blob.phase * 0.7) * 0.5;
                
                // Boundary bounce
                if (blob.x < -blob.radius || blob.x > canvas.width + blob.radius) {
                    blob.vx *= -1;
                }
                if (blob.y < -blob.radius || blob.y > canvas.height + blob.radius) {
                    blob.vy *= -1;
                }
                
                // Draw blob with radial gradient using circular path
                const gradient = ctx.createRadialGradient(
                    blob.x, blob.y, 0,
                    blob.x, blob.y, blob.radius
                );
                
                gradient.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${blob.color.a})`);
                gradient.addColorStop(0.5, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, ${blob.color.a * 0.5})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Draw cursor glow (if active)
            if (cursorActive && hasPointer) {
                const glowRadius = 300; // Increased from 250
                const glowGradient = ctx.createRadialGradient(
                    cursorX, cursorY, 0,
                    cursorX, cursorY, glowRadius
                );
                
                const glowColor = isDarkMode 
                    ? 'rgba(255, 255, 255, 0.12)' // Increased from 0.08
                    : 'rgba(99, 102, 241, 0.15)'; // Increased from 0.1
                
                glowGradient.addColorStop(0, glowColor);
                glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(cursorX, cursorY, glowRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
            
            animationFrame = requestAnimationFrame(animate);
        }
        
        let isAnimating = false;
        
        function startAnimation() {
            if (!isAnimating) {
                isAnimating = true;
                animate();
            }
        }
        
        function stopAnimation() {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
            isAnimating = false;
        }
        
        function cleanup() {
            stopAnimation();
            window.removeEventListener('resize', handleResize);
        }
        
        startAnimation();
        
        // Cleanup on visibility change and page unload
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', cleanup);
    }
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !expanded);
        });
    }
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Package Selection CTAs
    document.querySelectorAll('[data-package]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const packageName = this.getAttribute('data-package');
            const packageRadio = document.querySelector(`input[name="package"][value="${packageName}"]`);
            if (packageRadio) {
                packageRadio.checked = true;
                // Trigger calculator update
                updatePriceCalculator();
            }
            // Scroll to enquiry form
            const enquirySection = document.querySelector('#enquiry');
            if (enquirySection) {
                enquirySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Pricing Calculator - Updated for New Structure
    const setupCostEl = document.getElementById('setup-cost');
    const monthlyCostEl = document.getElementById('monthly-cost');
    const firstYearCostEl = document.getElementById('first-year-cost');
    
    function updatePriceCalculator() {
        let setupCost = 0;
        let monthlyCost = 0;
        
        // Get selected package
        const selectedPackage = document.querySelector('input[name="package"]:checked');
        if (selectedPackage) {
            setupCost += parseInt(selectedPackage.getAttribute('data-setup')) || 0;
            monthlyCost += parseInt(selectedPackage.getAttribute('data-monthly')) || 0;
        }
        
        // Get selected addons
        const selectedAddons = document.querySelectorAll('input[type="checkbox"][name^="addon-"]:checked');
        selectedAddons.forEach(addon => {
            setupCost += parseInt(addon.getAttribute('data-setup')) || 0;
            monthlyCost += parseInt(addon.getAttribute('data-monthly')) || 0;
        });
        
        // Calculate first year total
        const firstYearCost = setupCost + (monthlyCost * 12);
        
        // Update display
        if (setupCostEl) {
            setupCostEl.textContent = '$' + setupCost.toLocaleString();
        }
        if (monthlyCostEl) {
            monthlyCostEl.textContent = '$' + monthlyCost.toLocaleString() + '/mo';
        }
        if (firstYearCostEl) {
            firstYearCostEl.textContent = '$' + firstYearCost.toLocaleString();
        }
    }
    
    // Add event listeners for calculator
    document.querySelectorAll('input[name="package"]').forEach(radio => {
        radio.addEventListener('change', updatePriceCalculator);
    });
    
    document.querySelectorAll('input[type="checkbox"][name^="addon-"]').forEach(checkbox => {
        checkbox.addEventListener('change', updatePriceCalculator);
    });
    
    // Form Submission Handler
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const formMessage = document.getElementById('form-message');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            // Validate legal checkboxes
            const privacyAgree = document.getElementById('privacy-agree');
            const contractAgree = document.getElementById('contract-agree');
            
            if (!privacyAgree.checked || !contractAgree.checked) {
                if (formMessage) {
                    formMessage.textContent = 'Please accept both legal acknowledgements to proceed.';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                }
                return;
            }
            
            // Disable button and show loader
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
            
            // Get form data
            const formData = new FormData(enquiryForm);
            
            // Get selected package info
            const selectedPackage = document.querySelector('input[name="package"]:checked');
            let packageData = {};
            if (selectedPackage) {
                packageData = {
                    package_name: selectedPackage.value,
                    setup_cost: parseInt(selectedPackage.getAttribute('data-setup')) || 0,
                    monthly_cost: parseInt(selectedPackage.getAttribute('data-monthly')) || 0
                };
            }
            
            // Get selected addons
            const addons = [];
            const addonDetails = [];
            document.querySelectorAll('input[type="checkbox"][name^="addon-"]:checked').forEach(addon => {
                addons.push(addon.value);
                addonDetails.push({
                    name: addon.value,
                    setup: parseInt(addon.getAttribute('data-setup')) || 0,
                    monthly: parseInt(addon.getAttribute('data-monthly')) || 0
                });
            });
            
            // Build complete enquiry data
            const enquiryData = {
                // Personal Info
                name: formData.get('name'),
                business: formData.get('business'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                business_type: formData.get('business-type'),
                location: formData.get('suburb'),
                
                // Package Selection
                package: packageData,
                
                // Add-ons
                addons: addonDetails,
                addons_list: addons.join(', '),
                
                // Pricing Summary
                total_setup: setupCostEl ? setupCostEl.textContent : '$0',
                total_monthly: monthlyCostEl ? monthlyCostEl.textContent : '$0/mo',
                first_year_total: firstYearCostEl ? firstYearCostEl.textContent : '$0',
                
                // Additional Message
                message: formData.get('message'),
                
                // Legal Acknowledgements
                privacy_agreed: privacyAgree.checked,
                contract_agreed: contractAgree.checked,
                
                // Metadata
                submitted_at: new Date().toISOString(),
                user_agent: navigator.userAgent
            };
            
            try {
                // TODO: PRODUCTION - Replace with actual Cloudflare Worker endpoint
                // Example Worker endpoint structure:
                // POST /api/enquiry
                // Expected request body: JSON object with enquiryData
                // Expected response: { success: boolean, message: string, enquiry_id?: string }
                //
                // const response = await fetch('/api/enquiry', {
                //     method: 'POST',
                //     headers: { 
                //         'Content-Type': 'application/json',
                //         'X-Requested-With': 'XMLHttpRequest'
                //     },
                //     body: JSON.stringify(enquiryData)
                // });
                // 
                // if (!response.ok) {
                //     throw new Error('Network response was not ok');
                // }
                // 
                // const result = await response.json();
                // 
                // if (!result.success) {
                //     throw new Error(result.message || 'Submission failed');
                // }
                
                // TODO: PRODUCTION - Remove console.log before deploying
                // Simulate API call for development
                if (window.DEBUG === true) {
                    console.log('Enquiry Data:', enquiryData);
                }
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                if (formMessage) {
                    formMessage.textContent = 'Thank you! We\'ve received your enquiry and will be in touch within 24 hours.';
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'block';
                }
                
                // Reset form
                enquiryForm.reset();
                updatePriceCalculator();
                
                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
            } catch (error) {
                // TODO: PRODUCTION - Integrate with error monitoring service (e.g., Sentry)
                console.error('Form submission error:', error);
                // Show error message
                if (formMessage) {
                    formMessage.textContent = 'Sorry, there was an error submitting your enquiry. Please email us directly at hello@hevin.design';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                }
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            }
        });
    }
    
    // Initial calculator update
    updatePriceCalculator();
    
    // ==================================
    // Mobile Pricing Card Accordion
    // ==================================
    
    if (window.matchMedia('(max-width: 767px)').matches) {
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        pricingCards.forEach(card => {
            const toggleBtn = card.querySelector('.pricing-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function() {
                    const isExpanded = card.classList.contains('expanded');
                    
                    // Optional: Close other cards (remove these lines to allow multiple open)
                    // pricingCards.forEach(c => {
                    //     if (c !== card) {
                    //         c.classList.remove('expanded');
                    //         const btn = c.querySelector('.pricing-toggle');
                    //         if (btn) btn.setAttribute('aria-expanded', 'false');
                    //     }
                    // });
                    
                    // Toggle current card
                    card.classList.toggle('expanded');
                    toggleBtn.setAttribute('aria-expanded', !isExpanded);
                });
            }
        });
    }
    
    // ==================================
    // Unified Portfolio Carousel Touch/Swipe Support
    // ==================================
    
    const portfolioCarousel = document.querySelector('.portfolio-carousel');
    
    if (portfolioCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // Mouse events for desktop drag
        portfolioCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            portfolioCarousel.style.cursor = 'grabbing';
            startX = e.pageX - portfolioCarousel.offsetLeft;
            scrollLeft = portfolioCarousel.scrollLeft;
        });
        
        portfolioCarousel.addEventListener('mouseleave', () => {
            isDown = false;
            portfolioCarousel.style.cursor = 'grab';
        });
        
        portfolioCarousel.addEventListener('mouseup', () => {
            isDown = false;
            portfolioCarousel.style.cursor = 'grab';
        });
        
        portfolioCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - portfolioCarousel.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            portfolioCarousel.scrollLeft = scrollLeft - walk;
        });
        
        // Set initial cursor
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            portfolioCarousel.style.cursor = 'grab';
        }
        
        // Touch events are handled natively by the browser with scroll-snap
        
        // Desktop Navigation Buttons for Portfolio Carousel
        const portfolioPrevBtn = document.querySelector('.portfolio-carousel-wrapper .carousel-nav-prev');
        const portfolioNextBtn = document.querySelector('.portfolio-carousel-wrapper .carousel-nav-next');
        
        if (portfolioPrevBtn && portfolioNextBtn) {
            // Configuration constants for carousel behavior
            const CAROUSEL_SCROLL_DURATION = 800; // Milliseconds for smooth scroll animation
            const WHEEL_SENSITIVITY = 0.5; // Reduce wheel speed for better control (0.5 = half speed)
            
            function updatePortfolioNavButtons() {
                const scrollLeft = portfolioCarousel.scrollLeft;
                const maxScroll = portfolioCarousel.scrollWidth - portfolioCarousel.clientWidth;
                
                // Update disabled state
                portfolioPrevBtn.disabled = scrollLeft <= 0;
                portfolioNextBtn.disabled = scrollLeft >= maxScroll - 1;
            }
            
            // Smooth scroll function with custom easing and slower speed
            function smoothScrollCarousel(targetScroll) {
                const startScroll = portfolioCarousel.scrollLeft;
                const distance = targetScroll - startScroll;
                const duration = CAROUSEL_SCROLL_DURATION;
                const startTime = performance.now();
                
                // easeOutCubic: starts fast, slows down at the end
                // Creates a more natural, deliberate feel for carousel navigation
                // Formula: 1 - (1 - t)^3 where t is progress from 0 to 1
                function easeOutCubic(t) {
                    return 1 - Math.pow(1 - t, 3);
                }
                
                function animateScroll(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easedProgress = easeOutCubic(progress);
                    
                    portfolioCarousel.scrollLeft = startScroll + (distance * easedProgress);
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateScroll);
                    }
                }
                
                requestAnimationFrame(animateScroll);
            }
            
            portfolioPrevBtn.addEventListener('click', () => {
                const cardWidth = portfolioCarousel.querySelector('.portfolio-card').offsetWidth;
                const gap = parseInt(getComputedStyle(portfolioCarousel).gap);
                const targetScroll = portfolioCarousel.scrollLeft - (cardWidth + gap);
                smoothScrollCarousel(Math.max(0, targetScroll));
            });
            
            portfolioNextBtn.addEventListener('click', () => {
                const cardWidth = portfolioCarousel.querySelector('.portfolio-card').offsetWidth;
                const gap = parseInt(getComputedStyle(portfolioCarousel).gap);
                const maxScroll = portfolioCarousel.scrollWidth - portfolioCarousel.clientWidth;
                const targetScroll = portfolioCarousel.scrollLeft + (cardWidth + gap);
                smoothScrollCarousel(Math.min(maxScroll, targetScroll));
            });
            
            // Update button states on scroll
            portfolioCarousel.addEventListener('scroll', updatePortfolioNavButtons);
            
            // Update on resize
            window.addEventListener('resize', updatePortfolioNavButtons);
            
            // Initial update
            updatePortfolioNavButtons();
        }
        
        // Add wheel event listener for smoother mouse wheel scrolling
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            const WHEEL_SENSITIVITY = 0.5; // Reduce wheel speed for better control
            let wheelTimeout;
            
            portfolioCarousel.addEventListener('wheel', (e) => {
                e.preventDefault();
                
                // Clear existing timeout
                if (wheelTimeout) {
                    clearTimeout(wheelTimeout);
                }
                
                // Reduce wheel sensitivity for slower, more controlled scroll
                const scrollAmount = e.deltaY * WHEEL_SENSITIVITY;
                const maxScroll = portfolioCarousel.scrollWidth - portfolioCarousel.clientWidth;
                const targetScroll = Math.max(0, Math.min(maxScroll, portfolioCarousel.scrollLeft + scrollAmount));
                
                // Smooth scroll to target
                portfolioCarousel.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
                
                // Debounce to prevent scroll accumulation
                wheelTimeout = setTimeout(() => {
                    wheelTimeout = null;
                }, 50);
            }, { passive: false });
        }
    }
    
    // ==================================
    // Mobile Pricing Card Scroll-Triggered Glow
    // ==================================
    
    // Only initialize on touch devices (no hover capability)
    if (window.matchMedia('(hover: none)').matches) {
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        if (pricingCards.length > 0 && 'IntersectionObserver' in window) {
            // Check if reduced motion is preferred
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (!prefersReducedMotion) {
                const observerOptions = {
                    root: null,
                    rootMargin: '-20% 0px -20% 0px',
                    threshold: 0.5
                };
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('in-view');
                        } else {
                            entry.target.classList.remove('in-view');
                        }
                    });
                }, observerOptions);
                
                pricingCards.forEach(card => {
                    observer.observe(card);
                });
            }
        }
    }
});
