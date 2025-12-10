# Enquiry Form Configuration

## ⚠️ IMPORTANT: Initial Setup Required

Before the form can work, you need to:
1. Create a Formspree account at https://formspree.io
2. Create a new form and get your unique form ID
3. Replace `xanykkdg` in `index.html` with your actual Formspree form ID
4. Configure Formspree to send emails to hello@hevin.design
5. Set up email forwarding at your domain provider (see below)

## Overview
The enquiry form on hevin.design is configured to send submissions to **hello@hevin.design** using Formspree, a third-party form handling service.

## Form Submission Flow
1. User fills out the enquiry form on the website
2. JavaScript collects form data including:
   - Contact information (name, email, phone, business)
   - Selected package and pricing
   - Add-on services
   - Project details
3. Data is submitted to Formspree endpoint via AJAX POST request
4. Formspree processes the submission and sends an email to hello@hevin.design
5. User receives confirmation message on the website

## Formspree Configuration

### Creating Your Formspree Form
1. Go to https://formspree.io and sign up for a free account
2. Click "New Form" or "Add Form"
3. Enter `hello@hevin.design` as the email address where submissions should be sent
4. Copy the Form ID (it will look like `xanykkdg`)
5. Update `index.html` line 543:
   ```html
   <form id="enquiry-form" class="enquiry-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
6. Replace `YOUR_FORM_ID` with your actual Form ID from step 4

### Endpoint Details
- **URL Pattern**: `https://formspree.io/f/{FORM_ID}`
- **Current Form ID**: `xanykkdg` (placeholder - replace with your actual ID)
- **Method**: POST
- **Format**: JSON
- **Timeout**: 30 seconds (configurable in scripts.js)

### Security Features
- Honeypot field (`_gotcha`) for spam protection
- AJAX submission prevents page reload
- 30-second request timeout to prevent hanging
- CSP headers already configured to allow Formspree connections
- Form validation on both client and server side

## Email Forwarding Setup

### Current Configuration
**Primary Email**: hello@hevin.design  
**Forwarding To**: michaelpaulfrancis@gmail.com

### Setting Up Email Forwarding
Email forwarding from hello@hevin.design to michaelpaulfrancis@gmail.com must be configured at your email provider/domain registrar level. This is NOT handled in the code.

#### Steps to Configure (varies by provider):

**For Cloudflare Email Routing:**
1. Log in to Cloudflare Dashboard
2. Select the `hevin.design` domain
3. Navigate to Email → Email Routing
4. Click "Add Route" or "Create Address"
5. Set up forwarding rule:
   - From: `hello@hevin.design`
   - To: `michaelpaulfrancis@gmail.com`
6. Verify the destination email address
7. Enable the routing rule

**For Other Providers:**
- Check your domain registrar's email forwarding settings
- Or set up using your email hosting provider (Google Workspace, Microsoft 365, etc.)

### Verification
To verify the email forwarding is working:
1. Submit a test enquiry through the form
2. Check that the email arrives at michaelpaulfrancis@gmail.com
3. Verify the sender shows as hello@hevin.design
4. Confirm all form data is included in the email

## Formspree Account Access
To manage the Formspree form:
1. Log in to Formspree account (formspree.io)
2. Navigate to the form with ID `xanykkdg`
3. You can view:
   - Submission history
   - Configure email templates
   - Set up auto-replies
   - Add reCAPTCHA protection
   - Export submissions

## Testing the Setup

### End-to-End Testing Checklist
After setting up Formspree and email forwarding, test the complete flow:

1. **Test Form Submission**:
   - Visit the website enquiry form
   - Fill out all required fields
   - Select a package and optional add-ons
   - Submit the form
   - Verify success message appears

2. **Verify Formspree Receipt**:
   - Log in to Formspree dashboard
   - Check that submission appears in form history
   - Verify all form data was captured correctly

3. **Verify Email Delivery**:
   - Check hello@hevin.design inbox (if accessible)
   - Confirm email from Formspree was received
   - Verify email contains all form data

4. **Verify Email Forwarding**:
   - Check michaelpaulfrancis@gmail.com inbox
   - Confirm forwarded email was received
   - Verify sender shows as hello@hevin.design
   - Confirm all form data is present

5. **Test Error Handling**:
   - Disconnect from internet and submit form (should show timeout error)
   - Re-enable internet and verify form works again
   - Check that error messages are helpful and include fallback email

### Expected Email Content
The email should include:
- Contact information (name, business, email, phone)
- Business type and location
- Selected package with pricing
- Selected add-ons
- Cost breakdown (setup, monthly, first year total)
- Project description message
- Timestamp and user agent

## Troubleshooting

### Form Not Submitting
1. Check browser console for JavaScript errors
2. Verify Formspree endpoint is accessible
3. Check CSP headers allow connections to formspree.io
4. Verify form fields match expected structure

### Emails Not Being Received
1. Check Formspree dashboard for submission history
2. Verify email forwarding is configured at domain level
3. Check spam folder in michaelpaulfrancis@gmail.com
4. Ensure destination email is verified with Formspree

### Form Displays Error Message
- The error message directs users to email hello@hevin.design directly
- This ensures enquiries are never lost even if form submission fails

## Future Enhancements
Consider implementing:
- Email notification auto-responder to users
- Submission tracking in a database
- Custom email templates for better formatting
- reCAPTCHA for additional spam protection
- Rate limiting to prevent abuse

## Support
For issues with:
- **Form functionality**: Contact web developer
- **Email forwarding**: Check domain/email provider settings
- **Formspree service**: Visit formspree.io/support
