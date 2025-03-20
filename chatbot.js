// Chatbot for Dirty Laundromatic Radio Landing Page
// A simple, customizable chatbot to enhance listener engagement

// Chatbot configuration
const chatbotConfig = {
    name: "LaundroBot",
    initialMessage: "👋 Hey there! I'm LaundroBot, your friendly radio assistant. How can I help you today?",
    suggestedQuestions: [
        "What's playing right now?",
        "When is the next show?",
        "How can I request a song?",
        "Tell me about Dirty Laundromatic"
    ],
    typingSpeed: 50, // milliseconds per character
    responseDelay: 600 // milliseconds before starting to respond
};

// Knowledge base for chatbot responses
const knowledgeBase = {
    greetings: [
        "Hello there! How can I help you with Dirty Laundromatic radio today?",
        "Hey! Ready to talk music and radio. What's up?",
        "Welcome to Dirty Laundromatic! What would you like to know?"
    ],
    
    nowPlaying: [
        "Currently playing: 'Deep Cycle' by Spin Doctors. This track is part of our Midnight Spin show.",
        "Right now we're spinning 'Rinse & Repeat' by Riton. Tune in for more groovy tracks!",
        "Now playing: 'Fresh Linen' by DJ Soap - part of our Heavy Rinse Cycle show."
    ],
    
    schedule: [
        "Our next show is 'Heavy Rinse Cycle' with DJ Soap tonight at 8 PM.",
        "Coming up next is 'Fabric Softener' with Melody Tide on Wednesday at 7 PM.",
        "This Friday at 10 PM, don't miss 'Midnight Spin' with Dr. Drier!"
    ],
    
    songRequest: [
        "To request a song, just tell me the track name and artist, and I'll forward it to our DJ!",
        "I'd be happy to pass your song request to the current DJ. What would you like to hear?",
        "Song requests are always welcome! What track should we add to the queue?"
    ],
    
    about: [
        "Dirty Laundromatic is an independent online radio station streaming the freshest cuts and deepest grooves 24/7. From underground electronic music to rare funk, soul, and jazz - we're cleaning out the closet and spinning all the good stuff!",
        "We're a collective of music lovers who started this station in 2025. Our mission is to bring you the best underground tunes without commercial breaks.",
        "We broadcast 24/7 with live DJ shows throughout the week. We focus on electronic, funk, soul, and jazz - but you'll hear all sorts of gems in our rotation!"
    ],
    
    technical: [
        "Having trouble with the stream? Try refreshing the page or check your internet connection. If that doesn't work, you can also try a different browser.",
        "Our stream is compatible with most modern browsers and mobile devices. Make sure your volume is turned up and try clicking the play button again.",
        "If the player isn't working, you can also listen to us on platforms like TuneIn, RadioCult, or our mobile app."
    ],
    
    contact: [
        "You can reach us at hello@dirtylaundromatic.fm or through our social media channels.",
        "Want to get in touch with the team? Email us at hello@dirtylaundromatic.fm or DM us on Instagram.",
        "For business inquiries, partnerships, or just to say hi, drop us a line at hello@dirtylaundromatic.fm!"
    ],
    
    fallback: [
        "I'm not sure I understand. Could you try asking that in a different way?",
        "Hmm, I don't have information about that yet. Would you like to know about our schedule or current track instead?",
        "I'm still learning! That's beyond my current knowledge. Try asking about what's playing, our schedule, or how to contact us."
    ],
    
    // Added new knowledge categories
    genres: [
        "We primarily focus on Drum & Bass, Jungle, UKG, Breakbeat, 140bpm, Deep Dub & House Music. Each DJ has their own specialty!",
        "Our specialty is bass music - from Drum & Bass to Dubstep, UK Garage to Breakbeat. We also venture into House, Techno, and the occasional funk and soul selections.",
        "Dirty Laundromatic is all about those basslines! We play everything from rolling Drum & Bass and choppy Jungle to deep UKG and rumbling Dubstep."
    ],
    
    djs: {
        "dj soap": "DJ Soap hosts our 'Heavy Rinse Cycle' show every Monday from 8-10 PM. Known for deep, rolling Drum & Bass and jungle classics.",
        "melody tide": "Melody Tide brings the 'Fabric Softener' show every Wednesday from 7-9 PM, focusing on smooth UKG, deep dubstep, and soulful bass music.",
        "dr. drier": "Dr. Drier is our weekend specialist with the 'Midnight Spin' show Fridays from 10 PM to 1 AM, delivering fast-paced breakbeat, jungle, and experimental bass."
    },
    
    history: [
        "Dirty Laundromatic started in 2025 as a bedroom webcast and has grown into a proper online radio station with DJs from around the world.",
        "We began in early 2025 with just three friends and a love for underground electronic music. Now we have over 20 resident DJs and growing!",
        "The name 'Dirty Laundromatic' came from our founder's day job at a laundromat where they would mix tracks after hours. The name stuck, and here we are!"
    ],
    
    // Added new location info
    location: [
        "While we're primarily an online station, our studio is based in London, UK. Many of our DJs broadcast remotely from around the world!",
        "Our physical studio is in East London, but we have DJs broadcasting from Berlin, Detroit, Tokyo, and beyond!",
        "We're headquartered in London, but Dirty Laundromatic is a global community with contributors from all corners of the electronic music scene."
    ],
    
    // Add jokes for personality
    jokes: [
        "Why did the DJ go to the laundromat? To drop some clean beats! 🥁",
        "What do you call a washing machine that drops bass? A sub-woofer! 🔊",
        "Why don't DJs ever play at laundromats? Too many spin cycles! 🎧"
    ]
};

// Conversation memory to maintain context
let conversationMemory = {
    lastTopic: "",
    mentions: {
        tracks: [],
        djs: [],
        genres: []
    },
    questionsAsked: 0,
    sentiment: "neutral",
    lastMessageTime: Date.now()
};

// Track information from RadioCult embed
let currentTrackInfo = {
    title: '',
    artist: '',
    artwork: '',
    show: '',
    startTime: null,
    isLive: false
};

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
    initRadioCultEmbed();
});

// Main initialization function
function initChatbot() {
    createChatbotHTML();
    setupEventListeners();
    
    // Open with a slight delay to ensure smooth animation
    setTimeout(() => {
        document.querySelector('.chatbot-toggle').classList.add('show');
    }, 1000);
}

// Create HTML structure for the chatbot
function createChatbotHTML() {
    const chatbotHTML = `
        <div class="chatbot-container">
            <button class="chatbot-toggle">
                <span class="open-icon"><i class="fas fa-comment"></i></span>
                <span class="close-icon"><i class="fas fa-times"></i></span>
            </button>
            
            <div class="chatbot-box">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fas fa-headphones"></i>
                        ${chatbotConfig.name}
                    </div>
                    <button class="minimize-button">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
                
                <div class="chatbot-messages">
                    <!-- Messages will be added here -->
                </div>
                
                <div class="chatbot-suggestions">
                    <!-- Suggestion buttons will be added here -->
                </div>
                
                <div class="chatbot-input-container">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        placeholder="Type your message here..."
                        aria-label="Type your message here"
                    >
                    <button class="chatbot-send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Append chatbot HTML to the body
    const chatbotElement = document.createElement('div');
    chatbotElement.innerHTML = chatbotHTML;
    document.body.appendChild(chatbotElement);
    
    // Add initial message
    setTimeout(() => {
        addBotMessage(chatbotConfig.initialMessage);
        displaySuggestions(chatbotConfig.suggestedQuestions);
    }, 500);
}

// Setup event listeners for chatbot interactions
function setupEventListeners() {
    // Wait for elements to be available in DOM
    setTimeout(() => {
        // Toggle chatbot visibility
        document.querySelector('.chatbot-toggle').addEventListener('click', toggleChatbot);
        document.querySelector('.minimize-button').addEventListener('click', toggleChatbot);
        
        // Send message on button click
        document.querySelector('.chatbot-send').addEventListener('click', sendMessage);
        
        // Send message on Enter key
        document.querySelector('.chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Handle suggestion clicks
        document.querySelector('.chatbot-suggestions').addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-button')) {
                const message = e.target.textContent;
                document.querySelector('.chatbot-input').value = message;
                sendMessage();
            }
        });
    }, 700);
}

// Toggle chatbot open/closed state
function toggleChatbot() {
    const chatbotBox = document.querySelector('.chatbot-box');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    
    chatbotBox.classList.toggle('open');
    chatbotToggle.classList.toggle('open');
}

// Send user message and get response
function sendMessage() {
    const inputElement = document.querySelector('.chatbot-input');
    const message = inputElement.value.trim();
    
    if (message.length === 0) return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    inputElement.value = '';
    
    // Generate and display response with a natural delay
    setTimeout(() => {
        // Show typing indicator
        addTypingIndicator();
        
        // Generate response
        const response = generateResponse(message);
        
        // Calculate a realistic typing time based on response length
        const typingTime = Math.min(
            response.length * chatbotConfig.typingSpeed,
            3000 // Cap at 3 seconds for long responses
        );
        
        // Display response after "typing" delay
        setTimeout(() => {
            removeTypingIndicator();
            addBotMessage(response);
            
            // Generate and display contextual suggestions
            const suggestions = generateSuggestions(response);
            displaySuggestions(suggestions);
            
            // Increment questions counter
            conversationMemory.questionsAsked++;
            
            // After 3 questions, check time and potentially offer a proactive suggestion
            if (conversationMemory.questionsAsked % 3 === 0) {
                offerProactiveSuggestion();
            }
            
        }, typingTime);
    }, chatbotConfig.responseDelay);
}

// Add a user message to the chat
function addUserMessage(message) {
    const messagesContainer = document.querySelector('.chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.innerHTML = `<p>${escapeHTML(message)}</p>`;
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

// Add a bot message to the chat
function addBotMessage(message) {
    const messagesContainer = document.querySelector('.chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message';
    messageElement.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

// Add typing indicator
function addTypingIndicator() {
    const messagesContainer = document.querySelector('.chatbot-messages');
    const indicatorElement = document.createElement('div');
    indicatorElement.className = 'message bot-message typing-indicator';
    indicatorElement.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(indicatorElement);
    scrollToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Display suggested questions/responses
function displaySuggestions(suggestions) {
    const suggestionsContainer = document.querySelector('.chatbot-suggestions');
    suggestionsContainer.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const button = document.createElement('button');
        button.className = 'suggestion-button';
        button.textContent = suggestion;
        suggestionsContainer.appendChild(button);
    });
}

// Generate contextual suggestions based on conversation
function generateSuggestions(lastMessage) {
    // Default suggestions
    let suggestions = [...chatbotConfig.suggestedQuestions];
    
    // Get current time to provide time-sensitive suggestions
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    // Check for topic in the conversation memory
    if (conversationMemory.lastTopic) {
        switch(conversationMemory.lastTopic) {
            case "music":
                suggestions = [
                    "What genre is playing now?",
                    "Who are your regular DJs?",
                    "When is the next live show?"
                ];
                break;
                
            case "schedule":
                suggestions = [
                    "Tell me about DJ Soap",
                    "What genres does Dr. Drier play?",
                    "Are there any special events coming up?"
                ];
                break;
                
            case "request":
                suggestions = [
                    "How long until my request plays?",
                    "Do you take genre requests?",
                    "What's the most requested song?"
                ];
                break;
                
            case "technical":
                suggestions = [
                    "The player is still not working",
                    "Where else can I listen?",
                    "Is there a mobile app?"
                ];
                break;
                
            case "player":
                suggestions = [
                    "Play the music",
                    "Pause the player",
                    "What's playing now?"
                ];
                break;
        }
    }
    
    // If we have current track info from the embed, add related suggestions
    if (currentTrackInfo && currentTrackInfo.artist) {
        suggestions.push(`More tracks by ${currentTrackInfo.artist}?`);
        suggestions.push(`Who is ${currentTrackInfo.artist}?`);
    }
    
    // If previous message was about a DJ, suggest related questions
    if (lastMessage.toLowerCase().includes('dj soap')) {
        suggestions = [
            "What genre does DJ Soap play?",
            "When is DJ Soap's next show?",
            "What's DJ Soap's best set?"
        ];
    } else if (lastMessage.toLowerCase().includes('melody tide')) {
        suggestions = [
            "Tell me about Melody Tide's style",
            "When is Fabric Softener on next?",
            "How long has Melody been with the station?"
        ];
    }
    
    // Time-based suggestions
    if (currentHour >= 18 && currentHour < 22) {
        // Evening suggestions
        suggestions.push("What's the evening schedule?");
        suggestions.push("Who's DJing tonight?");
    } else if (currentHour >= 22 || currentHour < 3) {
        // Late night suggestions
        suggestions.push("Any late night shows on now?");
        suggestions.push("Is Midnight Spin on tonight?");
    }
    
    // If we have mock track data and the user is asking about music
    if (window.mockData && conversationMemory.lastTopic === "music") {
        try {
            const track = window.mockData.getCurrentTrack();
            if (track && track.artist) {
                suggestions.push(`More tracks by ${track.artist}?`);
                suggestions.push(`What genre is ${track.title}?`);
            }
        } catch (e) {
            console.log("Could not access mock data for suggestions");
        }
    }
    
    // Randomize and limit suggestions
    return shuffleArray(suggestions).slice(0, 3);
}

// Offer a proactive suggestion based on time and context
function offerProactiveSuggestion() {
    // Check if at least 3 minutes have passed since last message
    const timeNow = Date.now();
    const timeSinceLastMessage = timeNow - conversationMemory.lastMessageTime;
    
    if (timeSinceLastMessage > 180000) { // 3 minutes
        const currentHour = new Date().getHours();
        let proactiveMessage = '';
        
        // Night time suggestion
        if (currentHour >= 22 || currentHour < 3) {
            proactiveMessage = "Our late night show 'Midnight Spin' is on now! Would you like to know what they're playing?";
        } 
        // Evening suggestion
        else if (currentHour >= 18 && currentHour < 22) {
            proactiveMessage = "It's prime time for radio! Want to check out what shows are on this evening?";
        }
        // Random suggestion during the day
        else {
            const suggestions = [
                "Still exploring? Don't forget you can ask me about song requests or our DJ lineup!",
                "Just a reminder that you can ask me about the current track anytime!",
                "Did you know we have a weekly schedule of specialty shows? Want to hear more?"
            ];
            proactiveMessage = suggestions[Math.floor(Math.random() * suggestions.length)];
        }
        
        // Only send if we have a message
        if (proactiveMessage) {
            setTimeout(() => {
                addTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    addBotMessage(proactiveMessage);
                    
                    // Update conversation memory
                    conversationMemory.lastMessageTime = Date.now();
                }, 1500);
            }, 1000);
        }
    }
}

// Generate bot response based on user input
function generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Update conversation memory with the current time
    conversationMemory.lastMessageTime = Date.now();
    
    // Analyze sentiment (simple version)
    if (containsAny(message, ['love', 'great', 'awesome', 'amazing', 'good', 'excellent', 'thanks'])) {
        conversationMemory.sentiment = "positive";
    } else if (containsAny(message, ['hate', 'bad', 'terrible', 'awful', 'sucks', 'stupid', 'annoying'])) {
        conversationMemory.sentiment = "negative";
    } else {
        conversationMemory.sentiment = "neutral";
    }
    
    // Extract potential mentions in the message
    extractMentions(message);
    
    // Check for DJ specific questions
    for (const dj in knowledgeBase.djs) {
        if (message.includes(dj)) {
            conversationMemory.lastTopic = "djs";
            return knowledgeBase.djs[dj];
        }
    }
    
    // Handle jokes request
    if (containsAny(message, ['joke', 'funny', 'laugh', 'humor'])) {
        conversationMemory.lastTopic = "jokes";
        return getRandomResponse(knowledgeBase.jokes);
    }
    
    // Handle location questions
    if (containsAny(message, ['where', 'location', 'based', 'studio', 'country', 'city'])) {
        conversationMemory.lastTopic = "location";
        return getRandomResponse(knowledgeBase.location);
    }
    
    // Handle history questions
    if (containsAny(message, ['history', 'start', 'begin', 'found', 'origin', 'name'])) {
        conversationMemory.lastTopic = "history";
        return getRandomResponse(knowledgeBase.history);
    }
    
    // Handle genre questions
    if (containsAny(message, ['genre', 'style', 'music', 'sound', 'type of music', 'what do you play'])) {
        conversationMemory.lastTopic = "genres";
        return getRandomResponse(knowledgeBase.genres);
    }
    
    // Handle play/pause commands for the player
    if (containsAny(message, ['play music', 'start player', 'play radio', 'unpause', 'pause', 'stop music', 'stop radio', 'mute'])) {
        conversationMemory.lastTopic = "player";
        controlEmbedPlayer(message);
        return containsAny(message, ['pause', 'stop', 'mute']) ? 
            "I've paused the music for you. Let me know when you want to resume!" : 
            "Starting the music now! Enjoy the tunes!";
    }
    
    // Check for current track from RadioCult embed first, then fallback to mock data
    if (containsAny(message, ['playing', 'current', 'track', 'song', 'tune', 'now'])) {
        conversationMemory.lastTopic = "music";
        
        // If the user is asking about current track, force a refresh
        requestEmbedData();
        
        // First try to get track info from the embed
        if (currentTrackInfo && currentTrackInfo.title) {
            let trackResponse = `Now playing: "${currentTrackInfo.title}" by ${currentTrackInfo.artist}`;
            
            // Add time info if available
            if (currentTrackInfo.startTime) {
                const elapsedTime = getElapsedTime(currentTrackInfo.startTime);
                const formattedTime = formatTimeDisplay(elapsedTime);
                trackResponse += ` (${formattedTime} into the track)`;
            }
            
            // Add show info if available
            if (currentTrackInfo.show) {
                trackResponse += `. Part of the "${currentTrackInfo.show}" show.`;
            }
            
            return trackResponse;
        }
        
        // Fallback to mock data
        try {
            if (window.mockData) {
                const currentTrack = window.mockData.getCurrentTrack();
                if (currentTrack) {
                    const elapsedTime = window.mockData.getElapsedTime();
                    const formattedTime = formatTimeDisplay(elapsedTime);
                    return `Now playing: "${currentTrack.title}" by ${currentTrack.artist} (${formattedTime} into the track)`;
                }
            }
        } catch (e) {
            console.log("Could not access mock data for current track");
        }
        
        return `I'm trying to fetch the current track information from RadioCult, but I haven't received it yet. It might be due to cross-origin restrictions. Please check the player directly for now.`;
    }
    
    // Standard topic detection with memory update
    
    // Greeting detection
    if (containsAny(message, ['hi', 'hello', 'hey', 'greetings', 'sup', 'yo'])) {
        conversationMemory.lastTopic = "greeting";
        return getRandomResponse(knowledgeBase.greetings);
    }
    
    // Schedule inquiries
    if (containsAny(message, ['schedule', 'next', 'show', 'upcoming', 'when', 'time'])) {
        conversationMemory.lastTopic = "schedule";
        return getRandomResponse(knowledgeBase.schedule);
    }
    
    // Song requests
    if (containsAny(message, ['request', 'play', 'can you play', 'want to hear'])) {
        conversationMemory.lastTopic = "request";
        return getRandomResponse(knowledgeBase.songRequest);
    }
    
    // About the station
    if (containsAny(message, ['about', 'what is', 'tell me about', 'dirty laundromatic', 'station', 'radio'])) {
        conversationMemory.lastTopic = "about";
        return getRandomResponse(knowledgeBase.about);
    }
    
    // Technical issues
    if (containsAny(message, ['not working', 'problem', 'issue', 'can\'t hear', 'trouble', 'help'])) {
        conversationMemory.lastTopic = "technical";
        return getRandomResponse(knowledgeBase.technical);
    }
    
    // Contact information
    if (containsAny(message, ['contact', 'email', 'reach', 'talk', 'dj', 'social'])) {
        conversationMemory.lastTopic = "contact";
        return getRandomResponse(knowledgeBase.contact);
    }
    
    // If this is a follow-up question (using pronouns without context)
    if (containsAny(message, ['they', 'them', 'it', 'that', 'this']) && conversationMemory.lastTopic) {
        // Return a response based on the last topic
        switch(conversationMemory.lastTopic) {
            case "music":
                return "If you're asking about the current track, it's from our " + 
                       getRandomResponse(["deep cuts collection", "latest additions", "listener favorites"]) + 
                       ". Would you like to know about similar artists?";
                
            case "schedule":
                return "Regarding our schedule, we also have special themed weekends and guest DJs. " +
                       "Check our social media for last-minute additions!";
                
            case "about":
                return "Yes, Dirty Laundromatic is also involved in local music events and festivals. " +
                       "We love connecting with our community beyond just broadcasting!";
                
            default:
                // No specific context, fall back to default
                break;
        }
    }
    
    // Fallback response if no pattern is matched
    return getRandomResponse(knowledgeBase.fallback);
}

// Extract potential mentions from the user message
function extractMentions(message) {
    // Extract DJ mentions
    for (const dj in knowledgeBase.djs) {
        if (message.includes(dj) && !conversationMemory.mentions.djs.includes(dj)) {
            conversationMemory.mentions.djs.push(dj);
        }
    }
    
    // Extract genre mentions (simplified version)
    const genres = ['drum and bass', 'jungle', 'ukg', 'breakbeat', 'dubstep', 'house'];
    genres.forEach(genre => {
        if (message.includes(genre) && !conversationMemory.mentions.genres.includes(genre)) {
            conversationMemory.mentions.genres.push(genre);
        }
    });
    
    // Could extract track names here too with a more complex implementation
}

// Helper function to check if string contains any of the words
function containsAny(str, words) {
    return words.some(word => str.includes(word));
}

// Helper function to get a random response from an array
function getRandomResponse(responses) {
    if (!responses || !responses.length) return "I'm not sure how to respond to that.";
    return responses[Math.floor(Math.random() * responses.length)];
}

// Helper function to escape HTML (prevent XSS)
function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Helper function to scroll chat to bottom
function scrollToBottom() {
    const messagesContainer = document.querySelector('.chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Helper function to format time display
function formatTimeDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Helper function to shuffle array (for randomizing suggestions)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Fetch current track information from mock data
function fetchCurrentTrack() {
    if (window.mockData) {
        try {
            return window.mockData.getCurrentTrack();
        } catch (e) {
            console.error("Error accessing mock data:", e);
            return null;
        }
    }
    return null;
}

// Initialize communication with RadioCult embed
function initRadioCultEmbed() {
    console.log("Initializing RadioCult embed communication");
    
    // Listen for messages from the RadioCult iframe
    window.addEventListener('message', function(event) {
        console.log("Received postMessage event:", event);
        
        // Accept messages from RadioCult domain or any domain in development
        if (event.origin.includes('radiocult.fm') || event.origin.includes('localhost') || event.origin === window.location.origin) {
            try {
                const data = event.data;
                console.log("Processing message data:", data);
                
                // Handle track update events - handle different possible message formats
                if (data && (data.type === 'nowPlaying' || data.type === 'trackUpdate' || data.action === 'trackInfo' || data.event === 'trackChange')) {
                    // Extract track data using various possible property names
                    currentTrackInfo = {
                        title: data.title || data.trackTitle || data.track?.title || data.metadata?.title || '',
                        artist: data.artist || data.trackArtist || data.track?.artist || data.metadata?.artist || '',
                        artwork: data.artwork || data.coverArt || data.track?.artwork || data.metadata?.artwork || '',
                        show: data.show || data.showTitle || data.showName || data.metadata?.show || '',
                        startTime: data.startTime ? new Date(data.startTime) : new Date(),
                        isLive: data.isLive || data.live || false
                    };
                    
                    console.log('Track updated from RadioCult embed:', currentTrackInfo);
                }
                
                // Handle play state updates
                if (data && (data.type === 'playStateUpdate' || data.action === 'playState' || data.event === 'playStateChange')) {
                    console.log('Player state changed:', data.playing || data.state === 'playing' ? 'playing' : 'paused');
                }
            } catch (e) {
                console.error('Error processing message from RadioCult embed:', e);
            }
        } else {
            console.log("Ignored message from origin:", event.origin);
        }
    });
    
    // Set up a poller to request data updates from the embed
    setInterval(() => {
        requestEmbedData();
    }, 10000); // Every 10 seconds (increased frequency)
    
    // Initial request after a short delay
    setTimeout(requestEmbedData, 2000);
    
    // Also manually poll for data on user query
    document.getElementById('chatbot-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter' && event.target.value.toLowerCase().includes('playing')) {
            requestEmbedData();
        }
    });
}

// Request data from the RadioCult embed
function requestEmbedData() {
    console.log("Requesting data from RadioCult embed");
    const embed = document.querySelector('iframe.player-iframe');
    if (embed) {
        try {
            // Try multiple message formats that RadioCult might understand
            const messages = [
                { action: 'getTrackInfo' },
                { action: 'getCurrentTrack' },
                { command: 'getTrackInfo' },
                { type: 'getTrackInfo' },
                { request: 'trackInfo' }
            ];
            
            // Send all possible message formats
            messages.forEach(msg => {
                try {
                    console.log("Sending message to RadioCult embed:", msg);
                    embed.contentWindow.postMessage(msg, '*');
                } catch (e) {
                    console.error(`Error sending message format ${JSON.stringify(msg)}:`, e);
                }
            });
            
            // Direct DOM check - some players expose track info directly
            try {
                const iframeDoc = embed.contentDocument || embed.contentWindow.document;
                if (iframeDoc) {
                    const trackElement = iframeDoc.querySelector('.track-title, .track-name, .title');
                    const artistElement = iframeDoc.querySelector('.track-artist, .artist');
                    
                    if (trackElement && artistElement) {
                        currentTrackInfo = {
                            title: trackElement.textContent.trim(),
                            artist: artistElement.textContent.trim(),
                            artwork: '',
                            show: '',
                            startTime: new Date(),
                            isLive: false
                        };
                        console.log("Extracted track info from iframe DOM:", currentTrackInfo);
                    }
                }
            } catch (domError) {
                console.log("Could not access iframe DOM due to cross-origin policy:", domError);
            }
        } catch (e) {
            console.error('Error requesting data from RadioCult embed:', e);
        }
    } else {
        console.warn("RadioCult embed not found in the page");
    }
}

// Control the embedded player
function controlEmbedPlayer(message) {
    const embed = document.querySelector('iframe.player-iframe');
    if (embed) {
        try {
            // Determine action based on message
            let action = 'play';
            if (containsAny(message, ['pause', 'stop', 'mute'])) {
                action = 'pause';
            }
            
            // Send control message to the embed
            embed.contentWindow.postMessage({
                action: action
            }, 'https://app.radiocult.fm');
            
            console.log(`Sent ${action} command to RadioCult embed`);
        } catch (e) {
            console.error('Error controlling RadioCult embed:', e);
        }
    }
}

// Get elapsed time since a start time
function getElapsedTime(startTime) {
    if (!startTime) return 0;
    const now = new Date();
    return Math.floor((now - startTime) / 1000);
}
