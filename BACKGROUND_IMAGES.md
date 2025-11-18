# Background Image Options for Hero Section

## Current Implementation
The hero section now uses a background image with an overlay for better text readability.

## Recommended Background Images

### Option 1: Medical Professional (Current)
```css
background: url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop') center/cover;
```
- Clean medical environment
- Professional healthcare setting
- Soft, calming colors

### Option 2: Health & Wellness
```css
background: url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop') center/cover;
```
- Wellness and healthy lifestyle theme
- Bright and positive
- Fitness-focused

### Option 3: Medical Technology
```css
background: url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=2072&auto=format&fit=crop') center/cover;
```
- Modern medical technology
- Clean and professional
- Healthcare innovation

### Option 4: Healthcare Team
```css
background: url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop') center/cover;
```
- Collaborative healthcare
- Team-oriented
- Professional medical staff

### Option 5: Abstract Medical
```css
background: url('https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=2079&auto=format&fit=crop') center/cover;
```
- Abstract medical imagery
- Modern and clean
- Subtle healthcare theme

### Option 6: Nutrition Focus
```css
background: url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop') center/cover;
```
- Healthy food and nutrition
- Colorful and vibrant
- Wellness-focused

## Using Your Own Images

### Local Images
1. Create a `public/images` folder
2. Add your image (e.g., `hero-bg.jpg`)
3. Update the CSS:

```css
background: url('/images/hero-bg.jpg') center/cover;
```

### Image Requirements
- **Resolution**: Minimum 1920x1080px (Full HD)
- **Format**: JPG (optimized) or WebP for better performance
- **File Size**: Keep under 500KB for fast loading
- **Aspect Ratio**: 16:9 or wider works best

## Customizing the Overlay

### Lighter Overlay (More Image Visible)
```css
background: 
  linear-gradient(135deg, rgba(240, 253, 244, 0.85) 0%, rgba(255, 255, 255, 0.85) 100%),
  url('your-image-url') center/cover;
```

### Darker Overlay (Better Text Contrast)
```css
background: 
  linear-gradient(135deg, rgba(240, 253, 244, 0.98) 0%, rgba(255, 255, 255, 0.98) 100%),
  url('your-image-url') center/cover;
```

### Gradient Overlay (Left to Right)
```css
background: 
  linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 244, 0.85) 100%),
  url('your-image-url') center/cover;
```

### No Overlay (Full Image)
```css
background: url('your-image-url') center/cover;
```
**Note**: If using no overlay, ensure text has sufficient contrast. You may need to add text shadows:
```css
.hero-title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
```

## Performance Optimization

### Lazy Loading
For better performance, consider lazy loading the background:

```css
.hero-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

.hero-section.loaded {
  background: 
    linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%),
    url('your-image-url') center/cover;
}
```

### Responsive Images
Use different images for different screen sizes:

```css
/* Mobile */
@media (max-width: 768px) {
  .hero-section {
    background: 
      linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%),
      url('mobile-image.jpg') center/cover;
  }
}

/* Desktop */
@media (min-width: 769px) {
  .hero-section {
    background: 
      linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%),
      url('desktop-image.jpg') center/cover;
  }
}
```

## Free Stock Photo Resources

- **Unsplash**: https://unsplash.com/s/photos/medical
- **Pexels**: https://www.pexels.com/search/healthcare/
- **Pixabay**: https://pixabay.com/images/search/medical/
- **Freepik**: https://www.freepik.com/free-photos-vectors/medical

## Current Implementation Details

The hero section uses:
- **Base gradient overlay**: 95% opacity for text readability
- **Additional overlay**: Subtle green tint for brand consistency
- **Z-index management**: Content stays above background
- **Responsive**: Maintains aspect ratio on all devices

To change the background image, simply update the URL in the `.hero-section` CSS in `src/views/LandingPage.vue`.
