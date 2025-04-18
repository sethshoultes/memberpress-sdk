# Troubleshooting Guide

This guide addresses common issues you might encounter when using the MemberPress SDK and provides solutions to fix them.

## Common Issues

### 401 Unauthorized Errors

**Symptoms:**
- Errors containing "401 Unauthorized"
- Error messages like "API Error: Invalid API key"

**Possible Causes:**
1. Incorrect API key
2. API key has been revoked
3. Authorization header format issue

**Solutions:**
1. Verify the API key in MemberPress admin → Settings → Developer Tools
2. Generate a new API key if necessary
3. Ensure the API key is correctly formatted in the SDK initialization:

```javascript
const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key', // Make sure this matches exactly
  baseUrl: 'https://yoursite.com/wp-json/mp/v1',
  debug: true // Enable debug mode to see detailed logs
});
```

### 404 Not Found Errors

**Symptoms:**
- Errors containing "404 Not Found"
- Error messages indicating an endpoint cannot be found

**Possible Causes:**
1. Incorrect API endpoint URL
2. WordPress permalink structure is set to "Plain"
3. MemberPress REST API is not enabled

**Solutions:**
1. Check the baseUrl parameter in your SDK initialization
2. Update WordPress permalink structure:
   - Go to WordPress Admin → Settings → Permalinks
   - Select any option other than "Plain" (usually "Post name")
   - Save Changes
3. Enable the MemberPress REST API:
   - Go to MemberPress → Settings → Developer Tools
   - Ensure the REST API option is enabled

### CORS Issues (Browser Only)

**Symptoms:**
- Cross-Origin Resource Sharing (CORS) errors in the browser console
- Error messages mentioning "blocked by CORS policy"

**Possible Causes:**
1. CORS is not properly configured on your WordPress site

**Solutions:**
1. Install and configure a CORS plugin for WordPress
2. Add appropriate CORS headers to your server configuration
3. Consider using the SDK on the server side instead of in the browser

### Request Timeout Errors

**Symptoms:**
- Requests take a long time and then fail
- Error messages mentioning "timeout" or "request aborted"

**Possible Causes:**
1. Slow server response
2. Network connectivity issues

**Solutions:**
1. Check your server's performance and resources
2. Verify network connectivity
3. Consider implementing retry logic for failed requests

## Debugging Techniques

### Enable Debug Mode

The SDK has a built-in debug mode that provides detailed logging:

```javascript
const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key',
  baseUrl: 'https://yoursite.com/wp-json/mp/v1',
  debug: true // Enable debug logging
});
```

With debug mode enabled, the SDK will log:
- Request URLs
- Headers (with API key redacted)
- Response status codes
- Cache usage

### Check WordPress REST API Availability

To verify if the WordPress REST API is functioning correctly:

1. Open your browser and navigate to: `https://yoursite.com/wp-json/`
2. You should see JSON output with available endpoints
3. Then check: `https://yoursite.com/wp-json/mp/v1/` (may require authentication)

### Test API Directly

You can test the MemberPress API endpoints directly using a tool like cURL or Postman:

```bash
# Example cURL command
curl -X GET \
  "https://yoursite.com/wp-json/mp/v1/memberships" \
  -H "Authorization: your-api-key" \
  -H "Content-Type: application/json"
```

This helps determine if the issue is with the SDK or the API itself.

## Common Error Messages and Solutions

### "Authentication failed. API credentials are not valid."

**Solution:** Generate a new API key in MemberPress → Settings → Developer Tools and update your SDK configuration.

### "Resource not found."

**Solution:** Check the ID parameter you're passing to the method. Ensure the resource exists in your MemberPress admin area.

### "Cannot read property 'X' of undefined"

**Solution:** This typically indicates a parsing error with the API response. Enable debug mode to see the full response and check the API for changes.

### "Network error"

**Solution:** Check your internet connection and server availability. Verify that the WordPress site is online and accessible.

## When to Contact Support

If you've tried the troubleshooting steps above and are still experiencing issues:

1. Gather information:
   - Full error message and stack trace
   - SDK version
   - MemberPress version
   - WordPress version
   - Browser/Node.js version

2. Contact support:
   - Open an issue on the [GitHub repository](https://github.com/sethshoultes/memberpress-sdk/issues)
   - Include all the gathered information
   - Describe the steps to reproduce the issue
   - Mention what troubleshooting steps you've already tried