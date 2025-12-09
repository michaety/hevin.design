// ==================================
//  Hevin Design - JavaScript
//  Pricing Calculator & Form Handler
//  Updated for New Pricing Structure
// ==================================

document.addEventListener('DOMContentLoaded', function() {
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
                
                // Simulate API call for development
                console.log('Enquiry Data:', enquiryData);
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
});
