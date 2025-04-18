# Installation Guide

This guide explains how to install and set up the MemberPress SDK in your project.

## Prerequisites

Before installing the SDK, ensure you have:

1. A WordPress site with MemberPress plugin installed and activated
2. MemberPress REST API enabled (in MemberPress → Settings → Developer Tools)
3. An API key generated from the MemberPress admin area
4. WordPress permalink structure set to anything other than "Plain" (Settings → Permalinks)

## Installation Options

### NPM (Recommended for Node.js Projects)

For Node.js applications, the recommended installation method is using npm:

```bash
npm install memberpress-sdk
```

After installation, you can import the SDK into your project:

```javascript
const { MemberPressSDK } = require('memberpress-sdk');
```

Or using ES modules:

```javascript
import { MemberPressSDK } from 'memberpress-sdk';
```

### Direct Download (For Browser Applications)

For browser applications or when you can't use npm, you can download the SDK directly:

1. Download the latest release from the [GitHub repository](https://github.com/sethshoultes/memberpress-sdk/releases)
2. Include the script in your HTML:

```html
<script src="path/to/memberpress-sdk.js"></script>
```

The SDK will be available globally as `MemberPressSDK`.

### CDN (For Quick Prototyping)

For quick prototyping or testing, you can load the SDK from a CDN:

```html
<script src="https://unpkg.com/memberpress-sdk@latest/dist/memberpress-sdk.min.js"></script>
```

## Configuration

After installing the SDK, you need to initialize it with your MemberPress API key:

```javascript
const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key', // Replace with your actual API key
  baseUrl: 'https://yoursite.com/wp-json/mp/v1', // Replace with your WordPress site URL
  debug: false, // Optional, set to true for detailed logging
  cacheTimeout: 300000 // Optional, cache timeout in milliseconds (default: 5 minutes)
});
```

### Configuration Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| apiKey | string | Yes | - | Your MemberPress API key |
| baseUrl | string | Yes | - | The base URL for the MemberPress REST API |
| debug | boolean | No | false | Enable debug logging |
| cacheTimeout | number | No | 300000 | Cache timeout in milliseconds |

## Finding Your MemberPress API Key

1. Log in to your WordPress admin dashboard
2. Navigate to MemberPress → Settings → Developer Tools
3. Look for the "API Keys" section
4. Generate a new API key if one doesn't exist
5. Copy the API key to use with the SDK

## WordPress Permalink Configuration

The MemberPress REST API requires "pretty permalinks" to function correctly. To set this up:

1. Go to WordPress Admin → Settings → Permalinks
2. Select any option other than "Plain" (usually "Post name" is recommended)
3. Click "Save Changes"

## Next Steps

Now that you've installed and configured the SDK, you can proceed to the [Quick Start Guide](./quickstart.md) to learn how to use it in your application.