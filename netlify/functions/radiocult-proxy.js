// Netlify Serverless Function for secure RadioCult API proxy
// This allows you to use your secret key securely without exposing it in client-side code

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // The secret key would be stored as an environment variable in Netlify
    // Add this in your Netlify site dashboard under Settings > Build & deploy > Environment
    const secretKey = process.env.RADIOCULT_SECRET_KEY;
    
    if (!secretKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Extract endpoint from path parameters
    const pathSegments = event.path.split('/').filter(segment => segment.length > 0);
    
    // Extract endpoint type (last path segment)
    const endpointType = pathSegments[pathSegments.length - 1];
    
    // Get station ID from query params or use default
    const stationId = event.queryStringParameters?.station || 'dirty-laundromatic';
    
    // Determine the correct API endpoint based on the request
    let apiUrl = `https://api.radiocult.fm/v2/stations/${stationId}`;
    
    switch (endpointType) {
      case 'now-playing':
        apiUrl += '/now-playing';
        break;
      case 'recent-tracks':
        apiUrl += '/recent-tracks';
        break;
      case 'schedule':
        apiUrl += '/schedule';
        break;
      case 'listener-count':
        apiUrl += '/listeners';
        break;
      default:
        // If endpoint not recognized, return error
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid endpoint' })
        };
    }

    // Add any additional query parameters from the original request
    const queryParams = new URLSearchParams(event.queryStringParameters || {});
    
    // Don't include the station parameter in the URL twice
    queryParams.delete('station');
    
    const queryString = queryParams.toString();
    if (queryString) {
      apiUrl += `?${queryString}`;
    }

    console.log(`Proxying request to: ${apiUrl}`);

    // Make the request to RadioCult API with the secret key
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Get the response data
    const data = await response.json();

    // Return the response to the client
    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    // Handle any errors
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
