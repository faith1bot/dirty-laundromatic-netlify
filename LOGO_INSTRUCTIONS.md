# How to Replace the Logo

This document explains how to replace the logo in your Dirty Laundromatic website.

## Option 1: Use the Logo Creator Tool

I've created a simple logo creator tool to help you customize your logo:

1. Open the `logo-creator.html` file in your browser
2. Customize your logo using the interface:
   - Change the text, colors, and icon style
   - Preview the results in real-time
3. When you're happy with your logo:
   - Copy the SVG code from the "SVG Code" section
   - Open `logo.svg` and replace all its contents with your new code
   - OR use the "Download as PNG" button to get a PNG version

## Option 2: Use Your Own Image File

If you already have a logo image file:

1. **For PNG/JPG/GIF logo:**
   - Simply replace the existing `logo.png` file with your own image
   - For best results, use an image that's approximately 240px wide

2. **For SVG logo:**
   - Replace the contents of `logo.svg` with your own SVG code
   - Or replace the file entirely

## Option 3: Make the PNG Logo Primary

If you prefer to use a PNG file as your primary logo (instead of SVG with PNG fallback):

1. Open `index.html`
2. Find this line:
   ```html
   <img src="logo.svg" alt="Dirty Laundromatic Logo" onerror="this.src='logo.png'; this.onerror=null;">
   ```
3. Change it to:
   ```html
   <img src="logo.png" alt="Your Logo Alt Text">
   ```

## Option 4: Use an External Image

If your logo is hosted elsewhere:

1. Open `index.html`
2. Find the logo image line and update it to:
   ```html
   <img src="https://your-website.com/path-to-your-logo.png" alt="Your Logo Alt Text">
   ```

## Adjusting Logo Size and Position

If you need to adjust how your logo displays:

1. Open `styles.css`
2. Find the `.logo img` styles (around line 45)
3. Modify the height or add width properties as needed:
   ```css
   .logo img {
       height: 60px; /* Adjust this value */
       /* Add width if needed */
       transition: transform 0.3s ease;
   }
   ```

Remember to refresh your browser to see the changes after saving your files.
