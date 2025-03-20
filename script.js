document.addEventListener('DOMContentLoaded', function() {
    // Log CSS version to verify it's loading correctly
    console.log('CSS loaded - Logo width should be 200px');
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
        console.log('Actual logo width:', window.getComputedStyle(logoImg).width);
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });

    // Mobile navigation toggle (for future implementation)
    // This is a placeholder for adding mobile menu functionality
    
    // Animation for sections as they come into view
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
        section.classList.add('section-hidden');
    });
    
    // Current time display
    function updateCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTimeElement = document.querySelector('.current-time');
        
        if (currentTimeElement) {
            currentTimeElement.textContent = `${hours}:${minutes}`;
        }
    }
    
    // Update time every minute
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);
});
