/**
 * RadioCult.fm API Integration for Dirty Laundromatic
 * 
 * This module provides secure access to RadioCult.fm API data
 * using only the publishable key for client-side requests.
 * 
 * If the API is unavailable, it falls back to mock data.
 */

// RadioCult API Client
const radioCultAPI = (function() {
    // Configuration with station information
    const config = {
        stationId: 'dirty-laundromatic',
        publishableKey: 'pk_6057f99996444927bfcc31eed28d7ed0',
        endpoints: {
            // Using v2 endpoints with station ID in the path
            nowPlaying: 'https://api.radiocult.fm/v2/stations/{station}/now-playing',
            recentTracks: 'https://api.radiocult.fm/v2/stations/{station}/recent-tracks',
            schedule: 'https://api.radiocult.fm/v2/stations/{station}/schedule'
        },
        refreshIntervals: {
            nowPlaying: 15000, // 15 seconds
            recentTracks: 60000 // 1 minute
        },
        // Whether to use mock data instead of making API calls
        useMockData: true // Set to false to attempt real API calls
    };

    // Cache to store API responses
    const cache = {
        nowPlaying: null,
        recentTracks: [],
        schedule: [],
        lastUpdated: {
            nowPlaying: null,
            recentTracks: null,
            schedule: null
        }
    };

    // Active refresh intervals
    const intervals = {};

    // Track event listeners
    const eventListeners = [];

    /**
     * Make a request to the RadioCult API
     */
    async function apiRequest(endpoint, params = {}) {
        // If we're configured to use mock data, don't make the API call
        if (config.useMockData) {
            console.log('Using mock data instead of API call');
            throw new Error('Using mock data');
        }
        
        try {
            // Replace {station} placeholder in URL with actual station ID
            const url = new URL(endpoint.replace('{station}', config.stationId));
            
            // Add any additional parameters
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
            
            console.log('Making request to:', url.toString());
            
            // Make the request with the publishable key
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    // Changed header from 'x-api-key' to 'Authorization' with Bearer token
                    'Authorization': `Bearer ${config.publishableKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.error('API response not OK:', response.status, response.statusText);
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API response data:', data);
            return data;
        } catch (error) {
            console.error('RadioCult API request failed:', error);
            throw error;
        }
    }

    /**
     * Get mock data from mock-data.js if available
     */
    function getMockData(type) {
        if (window.mockData) {
            console.log(`Getting ${type} from mockData`);
            switch (type) {
                case 'nowPlaying':
                    return window.mockData.getNowPlaying();
                case 'recentTracks':
                    return window.mockData.getRecentTracks();
                case 'schedule':
                    return window.mockData.getSchedule();
                case 'listeners':
                    return window.mockData.getListeners();
                default:
                    return null;
            }
        }
        
        // Fall back to basic mock data
        console.log(`Using basic mock data for ${type}`);
        return getBasicMockData(type);
    }

    /**
     * Basic mock data as fallback
     */
    function getBasicMockData(type) {
        switch (type) {
            case 'nowPlaying':
                return {
                    title: "Test Track",
                    artist: "Test Artist",
                    albumTitle: "Test Album",
                    artworkUrl: "https://picsum.photos/200",
                    startedAt: new Date(Date.now() - 120000), // 2 minutes ago
                    duration: 240, // 4 minutes
                    show: "Test Show",
                    dj: "Test DJ"
                };
            case 'recentTracks':
                return [
                    {
                        title: "Previous Track 1",
                        artist: "Artist 1",
                        albumTitle: "Album 1",
                        artworkUrl: "https://picsum.photos/200?random=1",
                        playedAt: new Date(Date.now() - 300000) // 5 minutes ago
                    },
                    {
                        title: "Previous Track 2",
                        artist: "Artist 2",
                        albumTitle: "Album 2",
                        artworkUrl: "https://picsum.photos/200?random=2",
                        playedAt: new Date(Date.now() - 600000) // 10 minutes ago
                    }
                ];
            case 'schedule':
                return [
                    {
                        name: "Morning Show",
                        description: "Wake up with the best music",
                        dj: "DJ Morning",
                        day: "Weekdays",
                        startTime: "06:00",
                        endTime: "10:00"
                    },
                    {
                        name: "Evening Grooves",
                        description: "Wind down with smooth tracks",
                        dj: "DJ Night",
                        day: "Weekdays",
                        startTime: "18:00",
                        endTime: "22:00"
                    }
                ];
            default:
                return null;
        }
    }

    /**
     * Refresh now playing information
     */
    async function refreshNowPlaying() {
        try {
            console.log('Refreshing now playing info...');
            const data = await apiRequest(config.endpoints.nowPlaying);
            
            // Process and store the data
            cache.nowPlaying = {
                title: data.title || 'Unknown Track',
                artist: data.artist || 'Unknown Artist',
                albumTitle: data.album_title || '',
                artworkUrl: data.artwork_url || '',
                startedAt: data.started_at ? new Date(data.started_at) : new Date(),
                duration: data.duration || 0,
                show: data.show || 'Regular Programming',
                dj: data.dj || null
            };
            
            cache.lastUpdated.nowPlaying = new Date();
            
            // Trigger event for subscribers
            triggerEvent('nowPlayingUpdated', cache.nowPlaying);
            
            return cache.nowPlaying;
        } catch (error) {
            console.error('Failed to update now playing:', error);
            
            // Use mock data
            console.log('Using mock data for now playing...');
            const mockData = getMockData('nowPlaying');
            cache.nowPlaying = mockData;
            
            // Still trigger the event with mock data
            triggerEvent('nowPlayingUpdated', mockData);
            
            return mockData;
        }
    }

    /**
     * Refresh recent tracks
     */
    async function refreshRecentTracks() {
        try {
            console.log('Refreshing recent tracks...');
            const data = await apiRequest(config.endpoints.recentTracks, { limit: 10 });
            
            // Process and store the data
            cache.recentTracks = Array.isArray(data) ? data.map(track => ({
                title: track.title || 'Unknown Track',
                artist: track.artist || 'Unknown Artist',
                albumTitle: track.album_title || '',
                artworkUrl: track.artwork_url || '',
                playedAt: track.played_at ? new Date(track.played_at) : new Date()
            })) : [];
            
            cache.lastUpdated.recentTracks = new Date();
            
            // Trigger event for subscribers
            triggerEvent('recentTracksUpdated', cache.recentTracks);
            
            return cache.recentTracks;
        } catch (error) {
            console.error('Failed to update recent tracks:', error);
            
            // Use mock data
            console.log('Using mock data for recent tracks...');
            const mockData = getMockData('recentTracks');
            cache.recentTracks = mockData;
            
            // Still trigger the event with mock data
            triggerEvent('recentTracksUpdated', mockData);
            
            return mockData;
        }
    }

    /**
     * Refresh schedule information
     */
    async function refreshSchedule() {
        try {
            console.log('Refreshing schedule...');
            const data = await apiRequest(config.endpoints.schedule);
            
            // Process and store the data
            cache.schedule = Array.isArray(data) ? data.map(show => ({
                name: show.name || 'Unnamed Show',
                description: show.description || '',
                dj: show.dj || 'Various',
                startTime: show.start_time ? new Date(show.start_time) : null,
                endTime: show.end_time ? new Date(show.end_time) : null,
                day: show.day || ''
            })) : [];
            
            cache.lastUpdated.schedule = new Date();
            
            // Trigger event for subscribers
            triggerEvent('scheduleUpdated', cache.schedule);
            
            return cache.schedule;
        } catch (error) {
            console.error('Failed to update schedule:', error);
            
            // Use mock data
            console.log('Using mock data for schedule...');
            const mockData = getMockData('schedule');
            cache.schedule = mockData;
            
            // Still trigger the event with mock data
            triggerEvent('scheduleUpdated', mockData);
            
            return mockData;
        }
    }

    /**
     * Get the currently playing track
     */
    function getNowPlaying() {
        return cache.nowPlaying;
    }

    /**
     * Get recently played tracks
     */
    function getRecentTracks() {
        return cache.recentTracks;
    }

    /**
     * Get the schedule
     */
    function getSchedule() {
        return cache.schedule;
    }

    /**
     * Add an event listener
     */
    function addEventListener(event, callback) {
        if (typeof callback !== 'function') return;
        
        eventListeners.push({ event, callback });
        
        // Immediately trigger with cached data if available
        if (event === 'nowPlayingUpdated' && cache.nowPlaying) {
            callback(cache.nowPlaying);
        } else if (event === 'recentTracksUpdated' && cache.recentTracks.length > 0) {
            callback(cache.recentTracks);
        } else if (event === 'scheduleUpdated' && cache.schedule.length > 0) {
            callback(cache.schedule);
        }
    }

    /**
     * Remove an event listener
     */
    function removeEventListener(event, callback) {
        const index = eventListeners.findIndex(
            listener => listener.event === event && listener.callback === callback
        );
        
        if (index !== -1) {
            eventListeners.splice(index, 1);
        }
    }

    /**
     * Trigger an event for all listeners
     */
    function triggerEvent(event, data) {
        eventListeners
            .filter(listener => listener.event === event)
            .forEach(listener => {
                try {
                    listener.callback(data);
                } catch (error) {
                    console.error('Error in event listener:', error);
                }
            });
    }

    /**
     * Stop all refresh intervals
     */
    function stopRefresh() {
        Object.values(intervals).forEach(interval => clearInterval(interval));
        console.log('RadioCult API refresh stopped');
    }

    // Public API
    return {
        /**
         * Initialize the API client
         */
        init: function() {
            // Skip initialization of real API if we're using mock data
            if (config.useMockData) {
                console.log('RadioCult API initialized in mock mode - no API calls will be made');
                
                // Still set up refresh intervals for mock data
                setInterval(() => {
                    const mockData = getMockData('nowPlaying');
                    cache.nowPlaying = mockData;
                    triggerEvent('nowPlayingUpdated', mockData);
                }, config.refreshIntervals.nowPlaying);
                
                setInterval(() => {
                    const mockData = getMockData('recentTracks');
                    cache.recentTracks = mockData;
                    triggerEvent('recentTracksUpdated', mockData);
                }, config.refreshIntervals.recentTracks);
                
                return this;
            }
            
            console.log('Initializing RadioCult API client...');
            
            // Initial data load
            refreshNowPlaying();
            refreshRecentTracks();
            refreshSchedule();
            
            // Set up refresh intervals
            intervals.nowPlaying = setInterval(refreshNowPlaying, config.refreshIntervals.nowPlaying);
            intervals.recentTracks = setInterval(refreshRecentTracks, config.refreshIntervals.recentTracks);
            
            return this;
        },
        getNowPlaying,
        getRecentTracks,
        getSchedule,
        addEventListener,
        removeEventListener,
        stopRefresh
    };
})();

// Auto-initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the API client
    window.radioCult = radioCultAPI.init();
});
