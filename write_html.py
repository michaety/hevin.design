#!/usr/bin/env python3

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Hevin Design: Custom websites & ecommerce for small businesses. Fast, secure, high-performance sites built in Sydney using Cloudflare & Shopify. Starting at $1,999.">
    <meta name="keywords" content="custom websites, ecommerce, web design Sydney, Shopify, Cloudflare, small business websites, booking systems, branding, SEO, Google Business">
    <meta property="og:title" content="Hevin Design - Custom Websites & Ecommerce for Small Businesses">
    <meta property="og:description" content="Fast, secure, high-performance sites built in Sydney. Custom websites, Shopify stores, booking systems, and branding solutions.">
    <meta property="og:image" content="https://hevin.design/logo.svg">
    <meta property="og:url" content="https://hevin.design">
    <meta name="author" content="Hevin Design">
    <meta name="robots" content="index, follow">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; base-uri 'self'; form-action 'self';">
    <link rel="canonical" href="https://hevin.design">
    <title>Hevin Design - Custom Websites & Ecommerce for Small Businesses | Sydney</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="icon" type="image/svg+xml" href="favicon.svg">
    <link rel="apple-touch-icon" sizes="192x192" href="favicon-192.png">
    <link rel="manifest" href="site.webmanifest">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="styles.css">
    <script defer src="scripts.js"></script>
</head>
<body>
    <!-- Navigation -->
    <nav class="main-nav">
        <div class="nav-container">
            <a href="#home" class="nav-logo">
                <img src="logo.svg" alt="Hevin Design" width="120" height="48">
            </a>
            <button class="menu-toggle" aria-label="Toggle menu" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-menu">
                <li><a href="#services">Services</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#enquiry" class="nav-cta">Start a Project</a></li>
            </ul>
        </div>
    </nav>

    <main>
        <!-- Hero Section -->
        <section id="home" class="hero">
            <div class="hero-content">
                <h1>Custom Websites & Ecommerce for Small Businesses</h1>
                <p class="hero-subtitle">Fast, secure, high-performance sites built in Sydney using Cloudflare & Shopify.</p>
                <div class="hero-cta">
                    <a href="#pricing" class="btn btn-primary">View Pricing</a>
                    <a href="#enquiry" class="btn btn-secondary">Start a Project</a>
                </div>
            </div>
            <div class="hero-visual">
                <div class="gradient-orb"></div>
            </div>
        </section>
"""

# Write the first part
with open('index.html', 'w') as f:
    f.write(html_content)

print("Part 1 written")
