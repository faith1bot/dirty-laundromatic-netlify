/**
 * Mock Data for Dirty Laundromatic
 * 
 * This file provides realistic mock data for the radio website
 * when the real RadioCult API is unavailable.
 */

const mockData = (function() {
    // Current track data
    const nowPlaying = {
        title: "Midnight Haze",
        artist: "DJ Shadow",
        albumTitle: "Endtroducing.....",
        artworkUrl: "https://i.scdn.co/image/ab67616d0000b273651a7b85c37e81a63022f824",
        startedAt: new Date(Date.now() - 135000), // 2:15 ago
        duration: 300, // 5 minutes
        show: "Late Night Sessions",
        dj: "DJ Mixmaster"
    };
    
    // Recent tracks
    const recentTracks = [
        {
            title: "Windowlicker",
            artist: "Aphex Twin",
            albumTitle: "Windowlicker EP",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b2734c8f091f8090e0fddce94a20",
            playedAt: new Date(Date.now() - 450000) // 7:30 ago
        },
        {
            title: "Stella By Starlight",
            artist: "Miles Davis",
            albumTitle: "My Funny Valentine",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273e6b7f213e96e97108412556d",
            playedAt: new Date(Date.now() - 750000) // 12:30 ago
        },
        {
            title: "Harvest Moon",
            artist: "Neil Young",
            albumTitle: "Harvest Moon",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273907f19f6f5957be0010deb54",
            playedAt: new Date(Date.now() - 1050000) // 17:30 ago
        },
        {
            title: "Inner City Life",
            artist: "Goldie",
            albumTitle: "Timeless",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b2739548abfd67de5b796dd69fae",
            playedAt: new Date(Date.now() - 1350000) // 22:30 ago
        },
        {
            title: "As",
            artist: "Stevie Wonder",
            albumTitle: "Songs in the Key of Life",
            artworkUrl: "https://i.scdn.co/image/ab67616d0000b273199ce201ceb289fb2279945e",
            playedAt: new Date(Date.now() - 1650000) // 27:30 ago
        }
    ];
    
    // Weekly schedule
    const schedule = [
        {
            name: "Morning Groove",
            description: "Wake up with smooth beats and gentle rhythms to start your day right.",
            dj: "DJ Sunrise",
            day: "Monday",
            startTime: "06:00",
            endTime: "09:00",
            image: "https://picsum.photos/seed/show1/200/200"
        },
        {
            name: "Jazz Explorations",
            description: "Dive into the rich world of jazz with classics and modern interpretations.",
            dj: "Sarah Blue",
            day: "Monday",
            startTime: "15:00",
            endTime: "17:00",
            image: "https://picsum.photos/seed/show2/200/200"
        },
        {
            name: "Electronic Frontiers",
            description: "Cutting-edge electronic music from across the globe.",
            dj: "Pulse",
            day: "Tuesday",
            startTime: "20:00",
            endTime: "22:00",
            image: "https://picsum.photos/seed/show3/200/200"
        },
        {
            name: "Late Night Sessions",
            description: "Deep cuts and ambient sounds for the night owls.",
            dj: "DJ Mixmaster",
            day: "Tuesday",
            startTime: "23:00",
            endTime: "02:00",
            image: "https://picsum.photos/seed/show4/200/200"
        },
        {
            name: "Vinyl Vintage",
            description: "Classic hits from the golden era of vinyl records.",
            dj: "The Collector",
            day: "Wednesday",
            startTime: "18:00",
            endTime: "20:00",
            image: "https://picsum.photos/seed/show5/200/200"
        },
        {
            name: "Global Rhythms",
            description: "World music showcasing diverse cultural sounds and traditions.",
            dj: "Globetrotter",
            day: "Thursday",
            startTime: "14:00",
            endTime: "16:00",
            image: "https://picsum.photos/seed/show6/200/200"
        },
        {
            name: "Underground Hip-Hop",
            description: "The best in underground and independent hip-hop.",
            dj: "MC Truth",
            day: "Friday",
            startTime: "21:00",
            endTime: "23:30",
            image: "https://picsum.photos/seed/show7/200/200"
        },
        {
            name: "Weekend Mix",
            description: "Upbeat tracks to kickstart your weekend.",
            dj: "DJ Weekender",
            day: "Saturday",
            startTime: "16:00",
            endTime: "19:00",
            image: "https://picsum.photos/seed/show8/200/200"
        },
        {
            name: "Sunday Chill",
            description: "Relaxing beats and ambient soundscapes for your Sunday.",
            dj: "Zen Master",
            day: "Sunday",
            startTime: "10:00",
            endTime: "13:00",
            image: "https://picsum.photos/seed/show9/200/200"
        }
    ];
    
    // Listener statistics
    const listeners = {
        current: 42,
        peak: 87,
        average: 35
    };
    
    // Station info
    const stationInfo = {
        name: "Dirty Laundromatic",
        slogan: "Fresh Cuts. Deep Grooves.",
        description: "Independent online radio streaming eclectic music 24/7.",
        location: "Worldwide",
        website: "https://dirtylaundromatic.radio",
        email: "info@dirtylaundromatic.radio",
        founded: "2020",
        genres: ["Electronic", "Jazz", "Hip-Hop", "Ambient", "World", "Funk", "Soul"]
    };
    
    // Chat suggestions based on current content
    const chatSuggestions = [
        "What's playing right now?",
        "When is the next Jazz show?",
        "Tell me about Late Night Sessions",
        "How can I submit music?",
        "Who is DJ Mixmaster?",
        "What genre is this station?",
        "How many people are listening now?"
    ];
    
    // Update times periodically to keep mock data fresh
    function refreshMockTimes() {
        // Update now playing time
        nowPlaying.startedAt = new Date(Date.now() - 135000);
        
        // Update recent tracks times
        recentTracks.forEach((track, index) => {
            const minutesAgo = 7.5 + (index * 5);
            track.playedAt = new Date(Date.now() - (minutesAgo * 60000));
        });
    }
    
    // Refresh times every minute
    setInterval(refreshMockTimes, 60000);
    
    // Public API
    return {
        getNowPlaying: function() {
            refreshMockTimes();
            return { ...nowPlaying };
        },
        getRecentTracks: function() {
            refreshMockTimes();
            return [...recentTracks];
        },
        getSchedule: function() {
            return [...schedule];
        },
        getListeners: function() {
            // Randomize listener count slightly to simulate real-time changes
            const variation = Math.floor(Math.random() * 10) - 5;
            return {
                ...listeners,
                current: Math.max(5, listeners.current + variation)
            };
        },
        getStationInfo: function() {
            return { ...stationInfo };
        },
        getChatSuggestions: function() {
            return [...chatSuggestions];
        },
        
        // Helper to initialize all mock data into the global knowledge base
        initializeChatbotKnowledge: function() {
            if (window.knowledgeBase) {
                window.knowledgeBase.nowPlaying = [
                    `Currently playing: "${nowPlaying.title}" by ${nowPlaying.artist}. This track is part of our ${nowPlaying.show} show.`,
                    `Right now we're spinning "${nowPlaying.title}" by ${nowPlaying.artist}. Tune in for more groovy tracks!`,
                    `Now playing: "${nowPlaying.title}" by ${nowPlaying.artist} - part of our ${nowPlaying.show} show.`
                ];
                
                window.knowledgeBase.schedule = schedule.map(show => 
                    `${show.name} with ${show.dj} airs on ${show.day}s from ${show.startTime} to ${show.endTime}. ${show.description}`
                );
                
                window.knowledgeBase.aboutStation = [
                    `${stationInfo.name} is ${stationInfo.description} We were founded in ${stationInfo.founded} and focus on genres like ${stationInfo.genres.join(', ')}.`,
                    `Our slogan is "${stationInfo.slogan}" and we broadcast from ${stationInfo.location}.`,
                    `You can contact us at ${stationInfo.email} for any inquiries or music submissions.`
                ];
            }
        }
    };
})();

// Auto-initialize the mock data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.mockData = mockData;
    
    // Initialize chatbot knowledge if needed
    setTimeout(() => {
        if (window.knowledgeBase) {
            mockData.initializeChatbotKnowledge();
        }
    }, 1000);
});
