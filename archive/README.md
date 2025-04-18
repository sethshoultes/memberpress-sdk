# MemberPress JavaScript SDK

A modern, Promise-based JavaScript SDK for the MemberPress WordPress plugin.

## Features

- Full TypeScript support
- Promise-based API
- Request rate limiting
- Response caching
- Comprehensive error handling
- Support for both CommonJS and ES Modules

## Installation

```bash
npm install @memberpress/sdk
```

## Quick Start

```typescript
import { MemberPressSDK } from '@memberpress/sdk';

const sdk = new MemberPressSDK({
  apiKey: 'your-api-key',
  baseUrl: 'https://yourwebsite.com/wp-json/mp/v1',
  debug: true, // Optional
});

// Create a new member
const member = await sdk.members.create({
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
});

// Get member details
const memberDetails = await sdk.members.get(member.id);

// Update member status
await sdk.members.updateStatus(member.id, 'active');

// List members with filtering
const activeMembers = await sdk.members.list({
  status: 'active',
  page: 1,
  limit: 10,
});
```

## Error Handling

The SDK includes comprehensive error handling:

```typescript
try {
  const member = await sdk.members.get(123);
} catch (error) {
  if (error.message.includes('Not Found')) {
    console.error('Member does not exist');
  } else if (error.message.includes('Unauthorized')) {
    console.error('Invalid API key');
  } else {
    console.error('An unexpected error occurred:', error);
  }
}
```

## Rate Limiting

The SDK includes built-in rate limiting to prevent API abuse. You can configure the rate limit when initializing the SDK:

```typescript
const sdk = new MemberPressSDK({
  apiKey: 'your-api-key',
  baseUrl: 'https://yourwebsite.com/wp-json/mp/v1',
  rateLimitRequests: 100, // requests per second
});
```

## Caching

Response caching is enabled by default with a 5-minute TTL. You can configure the cache timeout:

```typescript
const sdk = new MemberPressSDK({
  apiKey: 'your-api-key',
  baseUrl: 'https://yourwebsite.com/wp-json/mp/v1',
  cacheTimeout: 300000, // 5 minutes in milliseconds
});
```

## Development

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm test

# Generate documentation
npm run docs
```

## License

MIT