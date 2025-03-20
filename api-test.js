/**
 * RadioCult API Test
 * 
 * This file contains a simple function to test the RadioCult API directly.
 * Use it to verify API endpoints and authentication methods.
 */

async function testRadioCultAPI() {
    // Configuration
    const config = {
        stationId: 'dirty-laundromatic',
        publishableKey: 'pk_6057f99996444927bfcc31eed28d7ed0',
        baseUrl: 'https://api.radiocult.fm'
    };
    
    // List of endpoints to test
    const endpoints = [
        // v2 endpoints
        `/v2/stations/${config.stationId}/now-playing`,
        `/v2/stations/${config.stationId}/recent-tracks`,
        `/v2/stations/${config.stationId}/schedule`,
        
        // v1 endpoints
        `/v1/stations/${config.stationId}/now-playing`,
        `/v1/stations/${config.stationId}/recent-tracks`,
        `/v1/stations/${config.stationId}/schedule`,
        
        // Other potential formats
        `/v2/stations/now-playing?station=${config.stationId}`,
        `/v1/stations/now-playing?station=${config.stationId}`
    ];
    
    // Authentication methods to test
    const authMethods = [
        { name: "Bearer Token", headers: { 'Authorization': `Bearer ${config.publishableKey}` } },
        { name: "API Key Header", headers: { 'x-api-key': config.publishableKey } }
    ];
    
    console.log('Starting RadioCult API Test...');
    console.log('-----------------------------------');
    
    // Test all combinations
    const results = [];
    
    for (const endpoint of endpoints) {
        for (const auth of authMethods) {
            try {
                const url = `${config.baseUrl}${endpoint}`;
                console.log(`Testing: ${url} with ${auth.name}`);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...auth.headers
                    }
                });
                
                const status = response.status;
                let data = null;
                
                try {
                    if (response.ok) {
                        data = await response.json();
                    }
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                }
                
                const result = {
                    endpoint,
                    authMethod: auth.name,
                    status,
                    success: response.ok,
                    data: data ? (typeof data === 'object' ? 'Valid JSON response' : 'Invalid response format') : null
                };
                
                if (response.ok) {
                    console.log('✓ SUCCESS:', endpoint, 'with', auth.name);
                    console.log('Response:', data);
                } else {
                    console.log('✗ FAILED:', endpoint, 'with', auth.name, '- Status:', status);
                }
                
                results.push(result);
            } catch (error) {
                console.error('Request failed:', error);
                results.push({
                    endpoint,
                    authMethod: auth.name,
                    status: 'Error',
                    success: false,
                    error: error.message
                });
            }
            
            console.log('-----------------------------------');
        }
    }
    
    // Summary
    console.log('Test Complete. Summary:');
    const successful = results.filter(r => r.success);
    console.log(`${successful.length} successful out of ${results.length} tests`);
    
    if (successful.length > 0) {
        console.log('Successful Endpoints:');
        successful.forEach(r => console.log(`- ${r.endpoint} with ${r.authMethod}`));
    } else {
        console.log('No successful API calls found.');
        console.log('Using mock data is recommended.');
    }
    
    return { results, successful };
}

// Run the test when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Create a test results display
    const resultsContainer = document.createElement('div');
    resultsContainer.style.position = 'fixed';
    resultsContainer.style.top = '10px';
    resultsContainer.style.right = '10px';
    resultsContainer.style.padding = '10px';
    resultsContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
    resultsContainer.style.color = 'white';
    resultsContainer.style.borderRadius = '5px';
    resultsContainer.style.zIndex = '10000';
    resultsContainer.style.maxWidth = '400px';
    resultsContainer.style.maxHeight = '80vh';
    resultsContainer.style.overflow = 'auto';
    resultsContainer.style.fontSize = '12px';
    resultsContainer.style.fontFamily = 'monospace';
    
    resultsContainer.innerHTML = '<h3>Testing RadioCult API...</h3><p>Check the console for detailed results.</p>';
    document.body.appendChild(resultsContainer);
    
    try {
        const testResults = await testRadioCultAPI();
        
        if (testResults.successful.length > 0) {
            resultsContainer.innerHTML = `
                <h3>RadioCult API Test Results</h3>
                <p>✓ ${testResults.successful.length} successful endpoints found!</p>
                <ul>${testResults.successful.map(r => `<li>${r.endpoint} with ${r.authMethod}</li>`).join('')}</ul>
                <p><button id="close-test-results">Close</button></p>
            `;
        } else {
            resultsContainer.innerHTML = `
                <h3>RadioCult API Test Results</h3>
                <p>✗ No successful endpoints found.</p>
                <p>Using mock data is recommended.</p>
                <p><button id="close-test-results">Close</button></p>
            `;
        }
        
        document.getElementById('close-test-results').addEventListener('click', function() {
            document.body.removeChild(resultsContainer);
        });
    } catch (error) {
        resultsContainer.innerHTML = `
            <h3>RadioCult API Test Error</h3>
            <p>${error.message}</p>
            <p><button id="close-test-results">Close</button></p>
        `;
        
        document.getElementById('close-test-results').addEventListener('click', function() {
            document.body.removeChild(resultsContainer);
        });
    }
});
