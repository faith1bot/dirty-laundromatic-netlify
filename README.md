# Dirty Laundromatic Radio

A modern landing page for the Dirty Laundromatic online radio stream, featuring an embedded player from RadioCult.fm, real-time track information, and an interactive chatbot.

## Features

- Clean, responsive design with modern aesthetics
- Embedded Radio player from RadioCult.fm
- Real-time now playing information via RadioCult API
- Interactive chatbot for listener engagement
- Mobile-friendly layout
- Interactive UI elements with subtle animations
- Schedule display for radio shows
- Contact information and social media links

## Tech Stack

- HTML5
- CSS3 (with modern features like CSS Grid, Flexbox, and CSS Variables)
- JavaScript (vanilla)
- Font Awesome for icons
- Google Fonts (Poppins)
- RadioCult.fm API for station data
- Netlify for deployment (with serverless functions)

## API Integration

This project integrates with the RadioCult.fm API to provide real-time information:

- **Now Playing Widget**: Shows current track, artist, artwork, and when the track started
- **Recent Tracks**: Displays recently played songs
- **Schedule**: Shows upcoming shows and programming

The integration has two components:

1. **Client-side API (publishable key)**: For basic, non-sensitive operations
2. **Serverless Functions (secret key)**: For operations requiring higher privileges

### API Keys

To use the RadioCult API integration:

1. Get your API keys from RadioCult.fm
2. The publishable key is already added to `radiocult-api.js`
3. For the secret key, add it as an environment variable in Netlify:
   - Go to Netlify Site Settings > Build & Deploy > Environment Variables
   - Add `RADIOCULT_SECRET_KEY` with your secret key

## Development

To run this project locally:

1. Clone the repository
2. Open the folder in your favorite editor
3. Use a local server (like Live Server for VS Code or http-server) to serve the files

```bash
# Example using Node.js http-server
npx http-server
```

## Deployment

This project is set up for easy deployment to Netlify. The netlify.toml file configures:

- Basic security headers
- Serverless functions directory
- No build process needed (static site)
- Content Security Policy for API access and embedded content

### Netlify Deployment Steps

1. Connect your Git repository to Netlify
2. Add your RadioCult secret key as an environment variable
3. Deploy your site - Netlify will automatically recognize the configuration

## API Fallbacks

The API integration includes fallback mechanisms:

- Mock data is displayed if the API is unavailable
- Caching for reliable performance
- Graceful error handling for uninterrupted user experience

## Credits

- Design & Development: [Your Name]
- Logo: Custom SVG with PNG fallback
- Radio Player: Powered by RadioCult.fm

## License

MIT License - Feel free to use and modify as needed.
