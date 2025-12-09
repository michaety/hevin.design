# Pricing System Implementation Guide

## Overview
This document describes the complete pricing system implementation for hevin.design, including the pricing structure, dynamic calculator, enquiry form, and integration points for the Cloudflare Worker backend.

## Pricing Structure (Source of Truth)

### Packages

#### 1. Basic - One Page Launch Site
- **Price**: $250 flat fee (no ongoing costs)
- **Features**:
  - Domain (1 year included)
  - 1-page site
  - SSL certificate
  - Mobile responsive
  - Contact form
  - ⚠️ No hosting or updates included

#### 2. Starter - Ongoing Web Presence
- **Price**: $300 setup + $30/month
- **Features**:
  - 1–2 pages
  - Hosting included
  - Basic SEO
  - Backups & SSL
  - 1 small update/month
  - Email support

#### 3. Pro Booking - Services & Payments (Most Popular)
- **Price**: $500 setup + $90/month
- **Features**:
  - 4–6 pages
  - Booking system
  - Stripe payments
  - Automated emails
  - Hosting & backups
  - SEO optimization
  - Priority support

#### 4. Elite Custom Store - Cloudflare Ecommerce
- **Price**: $1,200 setup + $120/month
- **Features**:
  - Full ecommerce build
  - Content management system
  - Stripe integration
  - R2 storage
  - Hosting included
  - Performance optimization
  - Dedicated support

#### 5. Shopify Store - Fully Managed
- **Price**: $950 setup + $100/month + Shopify fees (client pays directly)
- **Features**:
  - Full Shopify setup
  - Custom theme
  - Product catalog
  - Payment processing
  - Shipping configuration
  - App integrations
  - Training & support

### Add-Ons

1. **Google My Business Setup**: $80 one-time
2. **Basic SEO Pack**: $120 one-time
3. **Google Workspace Setup**: $60 one-time
4. **Extra Pages**: $80–$150 per page (estimated at $100 for calculator)
5. **Copywriting**: $100 one-time
6. **Logo & Brand Kit**: $150 one-time

## Dynamic Pricing Calculator

### How It Works
The calculator is implemented in `scripts.js` and provides real-time pricing updates as users select packages and add-ons.

### Calculation Logic
```javascript
setupCost = packageSetupCost + sum(addonSetupCosts)
monthlyCost = packageMonthlyCost + sum(addonMonthlyCosts)
firstYearTotal = setupCost + (monthlyCost * 12)
```

### Display Elements
- **Setup Cost**: Shows total one-time setup fee
- **Monthly Cost**: Shows total recurring monthly fee
- **First Year Total**: Shows complete first year investment

### Event Handlers
- Package selection (radio buttons) triggers immediate recalculation
- Add-on selection (checkboxes) triggers immediate recalculation
- All updates are instant with no page reload required

## Enquiry Form Data Structure

### Form Fields

#### Personal Information
- `name`: Full Name (required)
- `business`: Business Name (required)
- `email`: Email Address (required)
- `phone`: Phone Number (required)
- `business_type`: Business Type dropdown (required)
- `suburb`: Suburb/Location in NSW (required)

#### Package Selection
- Single choice from 5 packages (radio buttons)
- Captured as object with: `package_name`, `setup_cost`, `monthly_cost`

#### Add-Ons Selection
- Multiple choice from 6 add-ons (checkboxes)
- Captured as array of objects with: `name`, `setup`, `monthly`

#### Additional Information
- `message`: Project description (optional)

#### Legal Acknowledgements
- `privacy_agreed`: Privacy Policy acceptance (required)
- `contract_agreed`: Contract understanding (required)

### Submission Data Format

```json
{
  "name": "string",
  "business": "string",
  "email": "string",
  "phone": "string",
  "business_type": "string",
  "location": "string",
  "package": {
    "package_name": "string",
    "setup_cost": number,
    "monthly_cost": number
  },
  "addons": [
    {
      "name": "string",
      "setup": number,
      "monthly": number
    }
  ],
  "addons_list": "string (comma-separated)",
  "total_setup": "string (formatted with $)",
  "total_monthly": "string (formatted with $)",
  "first_year_total": "string (formatted with $)",
  "message": "string",
  "privacy_agreed": boolean,
  "contract_agreed": boolean,
  "submitted_at": "ISO 8601 timestamp",
  "user_agent": "string"
}
```

## Cloudflare Worker Backend Integration

### Endpoint Specification

**URL**: `/api/enquiry`
**Method**: `POST`
**Content-Type**: `application/json`

### Required Worker Functionality

1. **Validation**
   - Verify all required fields are present
   - Validate email format
   - Check legal acknowledgements are true
   - Validate package and addon selections

2. **Anti-Spam Protection**
   - Check honeypot field (`_gotcha`) is empty
   - Rate limiting per IP address
   - Optional: CAPTCHA integration

3. **Email Notifications**
   - **Admin Email** (to hello@hevin.design):
     - Subject: "New Enquiry: [Business Name]"
     - Include all enquiry details
     - Formatted for readability
     - Include pricing breakdown
   
   - **Client Email** (to submitted email):
     - Subject: "Thank you for your enquiry - Hevin Design"
     - Confirmation of submission
     - Summary of selected package and pricing
     - Next steps information

4. **Data Storage** (Optional)
   - Store in Cloudflare D1 database
   - Table schema should match enquiry data structure
   - Include creation timestamp and status fields

5. **Response Format**
   ```json
   {
     "success": boolean,
     "message": "string",
     "enquiry_id": "string (optional)"
   }
   ```

### Error Handling

**400 Bad Request**: Missing required fields or validation failure
**429 Too Many Requests**: Rate limit exceeded
**500 Internal Server Error**: Server-side processing error

Each error should return:
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

## Frontend Implementation Details

### Files Modified
- `index.html`: Updated pricing cards, form fields, and package/addon options
- `scripts.js`: Enhanced calculator logic and form submission handler
- `styles.css`: Added `.monthly-note` styling for Basic package

### Data Attributes Used
All pricing information is stored in HTML data attributes:
- `data-setup`: Setup fee amount (number)
- `data-monthly`: Monthly fee amount (number)
- `data-package`: Package identifier (string)

### Form Validation
- HTML5 required attributes on all mandatory fields
- JavaScript validation for legal checkboxes before submission
- Honeypot field for spam prevention

## Testing Completed

### Calculator Tests
✅ Basic package ($250 flat): Shows $0 monthly, $250 first year
✅ Starter package ($300 + $30/mo): Shows $30 monthly, $660 first year
✅ Pro Booking ($500 + $90/mo): Shows $90 monthly, $1,580 first year
✅ Elite Custom Store ($1,200 + $120/mo): Shows $120 monthly, $2,640 first year
✅ Shopify Store ($950 + $100/mo): Shows $100 monthly, $2,150 first year

### Add-Ons Tests
✅ Single add-on: Correctly adds to setup cost
✅ Multiple add-ons: Correctly sums all setup costs
✅ Add-ons with monthly fees: No longer used in new structure (all one-time)
✅ First year calculation: Accurate for all combinations

### Form Tests
✅ Required field validation working
✅ Legal checkbox validation enforced
✅ Package selection required
✅ Form submission creates correct data structure
✅ Success/error messages display correctly

## Future Enhancements

### Potential Improvements
1. **Progress Indicators**: Show user where they are in the enquiry process
2. **Package Comparison**: Side-by-side feature comparison table
3. **Testimonials**: Add social proof near pricing section
4. **FAQ**: Common questions about packages and pricing
5. **Live Chat**: Integration for immediate questions
6. **Payment Integration**: Direct payment processing (for deposits)
7. **Client Portal**: Dashboard for managing ongoing services
8. **Analytics**: Track which packages are most popular
9. **A/B Testing**: Test different pricing presentations
10. **Calendar Integration**: Schedule consultation calls directly from form

## Maintenance Notes

### Updating Prices
To update pricing, modify:
1. HTML data attributes in `index.html` (form package/addon inputs)
2. Pricing display in pricing section cards
3. Services section starting prices
4. Meta description if starting price changes

### Adding New Packages
1. Add pricing card in pricing section
2. Add radio button in form with correct data attributes
3. Update JavaScript if new logic is needed
4. Update this documentation

### Adding New Add-Ons
1. Add add-on card in pricing section
2. Add checkbox in form with correct data attributes
3. Calculator will automatically include it
4. Update this documentation

## Support and Documentation

For questions or issues related to the pricing system:
- Review this documentation first
- Check browser console for JavaScript errors
- Verify data attributes match expected format
- Test calculator in multiple browsers
- Validate form submission data structure

---

**Last Updated**: December 2025
**Version**: 1.0
**Author**: Hevin Design Development Team
