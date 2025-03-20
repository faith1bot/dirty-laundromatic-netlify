/**
 * Now Playing Widget for Dirty Laundromatic
 * 
 * Displays real-time information about the currently playing track
 * using data from the RadioCult API.
 */

// Create and initialize the Now Playing widget
document.addEventListener('DOMContentLoaded', function() {
    console.log('Now Playing widget initializing...');
    
    // Create the Now Playing component
    createNowPlayingWidget();
    
    // Immediately show mock data to ensure something appears
    createMockData();
    
    // Connect to the RadioCult API (after it's initialized)
    setTimeout(() => {
        if (window.radioCult) {
            console.log('RadioCult API found, connecting...');
            connectToRadioCultAPI();
        } else {
            console.error('RadioCult API not found. Make sure radiocult-api.js is loaded before now-playing.js');
        }
    }, 1000); // Short delay to ensure API is initialized
});

/**
 * Create the Now Playing widget and add it to the page
 */
function createNowPlayingWidget() {
    console.log('Creating Now Playing widget...');
    
    // Find a suitable container for the widget
    const possibleContainers = [
        document.querySelector('.hero-content'),
        document.querySelector('.hero'),
        document.querySelector('main'),
        document.body
    ];
    
    let container = null;
    
    // Find the first valid container
    for (const possible of possibleContainers) {
        if (possible) {
            container = possible;
            break;
        }
    }
    
    if (!container) {
        console.error('Could not find a suitable container for the Now Playing widget');
        return;
    }
    
    console.log('Adding Now Playing widget to:', container);
    
    // Create the widget structure
    const widget = document.createElement('div');
    widget.className = 'now-playing-container';
    
    widget.innerHTML = `
        <div class="now-playing-header">
            <div class="live-indicator">
                <div class="live-dot"></div>
                <span>LIVE</span>
            </div>
            <div class="now-playing-label">Now Playing</div>
        </div>
        <div class="now-playing-content">
            <img class="track-artwork" src="https://i.scdn.co/image/ab67616d0000b273651a7b85c37e81a63022f824" alt="Album Artwork">
            <div class="track-info">
                <h3 class="track-title">Loading...</h3>
                <p class="track-artist">Please wait</p>
                <p class="track-album"></p>
                <div class="track-meta">
                    <span class="track-show"></span>
                    <span class="track-time"></span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        </div>
        <div class="recent-tracks-header">
            <div class="recent-tracks-label">Recent Tracks</div>
            <i class="toggle-icon fas fa-chevron-down"></i>
        </div>
        <div class="recent-tracks-content">
            <!-- Recent tracks will be added here -->
        </div>
    `;
    
    // Add the widget to the container
    container.appendChild(widget);
    
    // Set up the toggle behavior for recent tracks
    const toggleHeader = widget.querySelector('.recent-tracks-header');
    const toggleIcon = widget.querySelector('.toggle-icon');
    const tracksContent = widget.querySelector('.recent-tracks-content');
    
    toggleHeader.addEventListener('click', function() {
        toggleIcon.classList.toggle('open');
        tracksContent.classList.toggle('open');
    });
    
    // Store references for later updates
    nowPlayingElements = {
        container: widget,
        artwork: widget.querySelector('.track-artwork'),
        title: widget.querySelector('.track-title'),
        artist: widget.querySelector('.track-artist'),
        album: widget.querySelector('.track-album'),
        show: widget.querySelector('.track-show'),
        time: widget.querySelector('.track-time'),
        progressBar: widget.querySelector('.progress-fill'),
        recentTracks: widget.querySelector('.recent-tracks-content')
    };
}

/**
 * Connect to the RadioCult API and set up data listeners
 */
function connectToRadioCultAPI() {
    // Listen for now playing updates
    window.radioCult.addEventListener('nowPlayingUpdated', updateNowPlaying);
    
    // Listen for recent tracks updates
    window.radioCult.addEventListener('recentTracksUpdated', updateRecentTracks);
    
    // Ensure we have data by requesting it if not already cached
    const currentTrack = window.radioCult.getNowPlaying();
    if (currentTrack) {
        updateNowPlaying(currentTrack);
    }
    
    const recentTracks = window.radioCult.getRecentTracks();
    if (recentTracks && recentTracks.length > 0) {
        updateRecentTracks(recentTracks);
    }
}

/**
 * Create mock data for the Now Playing widget when API is not available
 */
function createMockData() {
    console.log('Creating mock data for Now Playing widget...');
    
    // Use the external mock data module if available
    if (window.mockData) {
        const trackData = window.mockData.getNowPlaying();
        updateNowPlaying(trackData);
        return;
    }
    
    // Basic fallback mock data
    const mockData = {
        title: "Groove Theory",
        artist: "The Laundromatic Crew",
        albumTitle: "Spin Cycle Sessions",
        artworkUrl: "https://picsum.photos/seed/laundromatic/300/300",
        startedAt: new Date(Date.now() - 180000), // 3 minutes ago
        duration: 360 // 6 minutes
    };
    
    updateNowPlaying(mockData);
}

/**
 * Update the Now Playing widget with track information
 */
function updateNowPlaying(track) {
    if (!nowPlayingElements || !track) return;
    
    console.log('Updating Now Playing widget with:', track);
    
    // Update track information
    nowPlayingElements.title.textContent = track.title || 'Unknown Track';
    nowPlayingElements.artist.textContent = track.artist || 'Unknown Artist';
    nowPlayingElements.album.textContent = track.albumTitle || '';
    
    // Update artwork if available
    if (track.artworkUrl) {
        nowPlayingElements.artwork.src = track.artworkUrl;
        nowPlayingElements.artwork.style.display = 'block';
    } else {
        nowPlayingElements.artwork.style.display = 'none';
    }
    
    // Show info if available
    if (track.show) {
        nowPlayingElements.show.textContent = track.show;
        nowPlayingElements.show.style.display = 'block';
    } else {
        nowPlayingElements.show.style.display = 'none';
    }
    
    // Update time info
    if (track.startedAt) {
        updateTimeDisplay(track);
        
        // Set up progress bar updates
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = setInterval(() => updateTimeDisplay(track), 1000);
    }
}

/**
 * Update the time display and progress bar
 */
function updateTimeDisplay(track) {
    if (!nowPlayingElements || !track || !track.startedAt) return;
    
    const now = new Date();
    const started = new Date(track.startedAt);
    const elapsed = Math.floor((now - started) / 1000);
    const duration = track.duration || 180; // Default to 3 minutes if no duration
    
    // Format as MM:SS
    const elapsedMin = Math.floor(elapsed / 60);
    const elapsedSec = elapsed % 60;
    const durationMin = Math.floor(duration / 60);
    const durationSec = duration % 60;
    
    const elapsedStr = `${elapsedMin}:${elapsedSec.toString().padStart(2, '0')}`;
    const durationStr = `${durationMin}:${durationSec.toString().padStart(2, '0')}`;
    
    // Update time display
    nowPlayingElements.time.textContent = `${elapsedStr} / ${durationStr}`;
    
    // Update progress bar
    const progress = Math.min(100, (elapsed / duration) * 100);
    nowPlayingElements.progressBar.style.width = `${progress}%`;
}

/**
 * Update the recent tracks display
 */
function updateRecentTracks(tracks) {
    if (!nowPlayingElements || !tracks || !tracks.length) return;
    
    console.log('Updating recent tracks:', tracks);
    
    const container = nowPlayingElements.recentTracks;
    container.innerHTML = '';
    
    tracks.forEach(track => {
        const item = document.createElement('div');
        item.className = 'recent-track-item';
        
        let timeAgo = 'Recently';
        if (track.playedAt) {
            const minutes = Math.floor((new Date() - new Date(track.playedAt)) / 60000);
            timeAgo = minutes < 60 
                ? `${minutes}m ago` 
                : `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
        }
        
        item.innerHTML = `
            <img class="recent-track-artwork" src="${track.artworkUrl || 'https://i.scdn.co/image/ab67616d0000b273651a7b85c37e81a63022f824'}" alt="Album Artwork">
            <div class="recent-track-info">
                <div class="recent-track-title">${track.title || 'Unknown Track'}</div>
                <div class="recent-track-artist">${track.artist || 'Unknown Artist'}</div>
            </div>
            <div class="recent-track-time">${timeAgo}</div>
        `;
        
        container.appendChild(item);
    });
}

/**
 * Update the chatbot knowledge base with current track information
 */
function updateChatbotWithTrackInfo(track) {
    // If the chatbot and its knowledge base exist, update it
    if (window.knowledgeBase && window.knowledgeBase.nowPlaying) {
        window.knowledgeBase.nowPlaying = [
            `Currently playing: "${track.title}" by ${track.artist}. This track is part of our ${track.show || 'current playlist'}.`,
            `Right now we're spinning "${track.title}" by ${track.artist}. Tune in for more groovy tracks!`,
            `Now playing: "${track.title}" by ${track.artist}${track.show ? ` - part of our ${track.show} show` : ''}.`
        ];
    }
}

let progressInterval = null;
let nowPlayingElements = null;
