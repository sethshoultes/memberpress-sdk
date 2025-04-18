# MemberPress SDK

[![npm version](https://img.shields.io/npm/v/memberpress-sdk.svg)](https://www.npmjs.com/package/memberpress-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A JavaScript SDK for interacting with the MemberPress REST API. This SDK provides a simple and intuitive interface for accessing MemberPress functionality from Node.js and browser applications.

With the MemberPress SDK, you can manage members, access membership products, process transactions, and handle subscriptions programmatically through a clean, consistent API.

## Installation

### Node.js

```bash
npm install memberpress-sdk
```

### Browser

```html
<script src="path/to/memberpress-sdk.js"></script>
```

## Quick Start

```javascript
// Import the SDK
const { MemberPressSDK } = require('memberpress-sdk');

// Initialize the SDK with your MemberPress API key
const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key', // Found in MemberPress admin area
  baseUrl: 'https://yoursite.com/wp-json/mp/v1',
  debug: true // Optional
});

// Use the SDK to interact with MemberPress
async function getMemberships() {
  try {
    const memberships = await sdk.memberships.list();
    console.log('Available memberships:', memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
  }
}

getMemberships();
```

## Finding Your MemberPress API Key

1. Log in to your WordPress admin dashboard
2. Navigate to MemberPress → Settings → Developer Tools
3. Look for the "API Keys" section
4. You may need to generate a new API key if one doesn't exist
5. Copy the API key to use with the SDK

## WordPress Configuration Requirements

For the MemberPress REST API to function correctly:

1. Your WordPress site must have permalinks set to anything other than "Plain"
   - Go to Settings → Permalinks
   - Select any option other than "Plain" (usually "Post name" is recommended)
   - Save Changes

2. The MemberPress REST API must be enabled
   - Go to MemberPress → Settings → Developer Tools
   - Ensure the REST API option is enabled

## Features

- **Members Management**: Create, retrieve, and update members
- **Membership Access**: List memberships and check access rights
- **Transaction Handling**: View transaction history and details
- **Subscription Management**: List, retrieve, and cancel subscriptions
- **Automatic Caching**: Responses are cached to improve performance
- **Comprehensive Error Handling**: Detailed error information
- **Debug Mode**: Optional logging for troubleshooting

## API Reference

### Initialization

```javascript
const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key',
  baseUrl: 'https://yoursite.com/wp-json/mp/v1',
  debug: false, // Optional, defaults to false
  cacheTimeout: 300000 // Optional, defaults to 5 minutes (300000ms)
});
```

### Members API

```javascript
// Create a new member
const newMember = await sdk.members.create({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe'
});

// Get a member by ID
const member = await sdk.members.get(memberId);

// Update a member's status
const updatedMember = await sdk.members.updateStatus(memberId, 'active');

// List members with optional filters
const members = await sdk.members.list({
  limit: 10,
  offset: 0,
  status: 'active'
});

// Check if a member has access to a specific membership
const access = await sdk.members.checkAccess(memberId, membershipId);
```

### Memberships API

```javascript
// List all memberships
const memberships = await sdk.memberships.list();

// Get a membership by ID
const membership = await sdk.memberships.get(membershipId);
```

### Transactions API

```javascript
// List transactions with optional filters
const transactions = await sdk.transactions.list({
  limit: 10,
  status: 'complete'
});

// Get a transaction by ID
const transaction = await sdk.transactions.get(transactionId);
```

### Subscriptions API

```javascript
// List subscriptions with optional filters
const subscriptions = await sdk.subscriptions.list({
  member_id: memberId,
  status: 'active'
});

// Get a subscription by ID
const subscription = await sdk.subscriptions.get(subscriptionId);

// Cancel a subscription
const result = await sdk.subscriptions.cancel(subscriptionId);
```

## Error Handling

The SDK throws errors for API failures. We recommend using try/catch blocks:

```javascript
try {
  const result = await sdk.members.get(memberId);
  // Process successful result
} catch (error) {
  if (error.message.includes('401')) {
    console.error('Authentication failed. Check your API key.');
  } else if (error.message.includes('404')) {
    console.error('Resource not found. Check the ID.');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Browser Support

The SDK works in modern browsers and Node.js environments. For older browsers, you may need to use a polyfill for fetch.

## Documentation

For complete documentation, visit:

- [Installation Guide](docs/installation.md)
- [Quick Start Guide](docs/quickstart.md)
- [API Reference](docs/api-reference.md)
- [Examples](docs/examples.md)
- [Troubleshooting Guide](docs/troubleshooting.md)
- [Changelog](docs/changelog.md)

## Support

If you encounter any issues or have questions, please:

1. Check the [Troubleshooting Guide](docs/troubleshooting.md)
2. Search for similar issues in the [GitHub Issues](https://github.com/sethshoultes/memberpress-sdk/issues)
3. Open a new issue if your problem persists

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
