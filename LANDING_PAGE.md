# Nutri-Check Landing Page

## Overview
A modern, clean landing page with a health-and-wellness aesthetic designed to showcase Nutri-Check's features and benefits.

## Design Features

### Visual Style
- **Color Palette**: 
  - Primary Green: `#42b983`
  - Dark Green: `#369e73`
  - Dark Text: `#2d3748`
  - Light Background: `#f0fdf4` to `#ffffff` gradient
  - Soft Gray: `#4a5568`

- **Typography**: System fonts for clean, modern look
- **Spacing**: Generous white space for readability
- **Shapes**: Soft rounded corners (8px-16px border-radius)

### Sections

#### 1. Navigation Bar
- Fixed position with blur effect
- Logo with emoji icon
- Login button (top right)

#### 2. Hero Section
- Bold headline: "Your Health, Simplified"
- Descriptive tagline
- Primary CTA button: "Start Now"
- Animated BMI meter illustration with floating health cards

#### 3. Features Section
- Three feature cards:
  - ⚡ Fast BMI Calculation
  - 💡 Personalized Health Suggestions
  - 🔌 Arduino Integration Ready
- Hover effects with lift animation

#### 4. How It Works Section
- 3-step process with numbered circles
- Visual flow with arrows
- Clear, concise descriptions

#### 5. About Section
- Mission statement
- Target audience (clinics, schools, community health centers)
- Centered text layout

#### 6. CTA Footer
- Green gradient background
- Large "Try Nutri-Check Now" button
- Quick links (Login, Features, How It Works)

#### 7. Footer
- Dark background
- Copyright information

## Animations

- **fadeInUp**: Hero content entrance
- **fadeIn**: Hero image entrance
- **float**: Floating health cards (3s loop)
- **needleSwing**: BMI meter needle animation (3s loop)
- **Hover effects**: Lift and shadow on buttons and cards

## Responsive Design

- Desktop: Two-column hero layout
- Mobile (< 768px):
  - Single column layout
  - Stacked sections
  - Adjusted font sizes
  - Vertical step flow

## Navigation Flow

```
Landing Page (/) 
    ↓
Login Page (/login)
    ↓
Patient Info (/patient-info)
    ↓
BMI Calculator (/bmi-calculator)
    ↓
Patient List (/patients)
```

## Usage

The landing page is now the default route (`/`). Users can:
1. Click "Start Now" or "Login" to go to the login page
2. Sign up or log in
3. Access the full application

## Customization

To customize the landing page:
- Colors: Update CSS variables in the `<style>` section
- Content: Edit text in the `<template>` section
- Animations: Modify `@keyframes` in the style section
- Logo: Replace the emoji in `.logo-icon` with an image or SVG

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox
- CSS animations and transitions
- Backdrop filter for navigation blur
