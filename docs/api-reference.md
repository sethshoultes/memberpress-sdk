# API Reference

This document provides a comprehensive reference for all methods available in the MemberPress SDK.

## SDK Initialization

To create a new instance of the SDK:

```javascript
const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key',
  baseUrl: 'https://yoursite.com/wp-json/mp/v1',
  debug: false, // Optional, defaults to false
  cacheTimeout: 300000 // Optional, defaults to 5 minutes (300000ms)
});
```

## Members API

### `members.create(memberData)`

Creates a new member in MemberPress.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| memberData | Object | Yes | Member data |
| memberData.email | string | Yes | Member email address |
| memberData.firstName | string | No | Member first name |
| memberData.lastName | string | No | Member last name |
| memberData.username | string | No | Member username (defaults to email if not specified) |
| memberData.password | string | No | Member password (auto-generated if not specified) |

**Returns:** Promise that resolves to the created member object

**Example:**

```javascript
const newMember = await sdk.members.create({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  password: 'securepassword123'
});
```

### `members.get(memberId)`

Retrieves a member by ID.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| memberId | string\|number | Yes | Member ID |

**Returns:** Promise that resolves to the member object

**Example:**

```javascript
const member = await sdk.members.get(123);
```

### `members.updateStatus(memberId, status)`

Updates a member's status.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| memberId | string\|number | Yes | Member ID |
| status | string | Yes | New status (e.g., 'active', 'inactive') |

**Returns:** Promise that resolves to the updated member object

**Example:**

```javascript
const updatedMember = await sdk.members.updateStatus(123, 'active');
```

### `members.list(filters)`

Lists members with optional filters.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| filters | Object | No | Filter parameters |
| filters.limit | number | No | Number of members to return |
| filters.offset | number | No | Offset for pagination |
| filters.status | string | No | Filter by status |
| filters.search | string | No | Search term |

**Returns:** Promise that resolves to an array of member objects

**Example:**

```javascript
const members = await sdk.members.list({
  limit: 10,
  offset: 0,
  status: 'active',
  search: 'smith'
});
```

### `members.checkAccess(memberId, membershipId)`

Checks if a member has access to a specific membership.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| memberId | string\|number | Yes | Member ID |
| membershipId | string\|number | Yes | Membership ID |

**Returns:** Promise that resolves to an access object with `hasAccess` and potentially `expiresAt` properties

**Example:**

```javascript
const access = await sdk.members.checkAccess(123, 456);
if (access.hasAccess) {
  console.log(`Member has access until ${access.expiresAt || 'never'}`);
} else {
  console.log('Member does not have access');
}
```

## Memberships API

### `memberships.list(filters)`

Lists all memberships with optional filters.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| filters | Object | No | Filter parameters |
| filters.limit | number | No | Number of memberships to return |
| filters.offset | number | No | Offset for pagination |
| filters.status | string | No | Filter by status |
| filters.search | string | No | Search term |

**Returns:** Promise that resolves to an array of membership objects

**Example:**

```javascript
const memberships = await sdk.memberships.list({
  limit: 20,
  status: 'publish'
});
```

### `memberships.get(membershipId)`

Retrieves a membership by ID.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| membershipId | string\|number | Yes | Membership ID |

**Returns:** Promise that resolves to the membership object

**Example:**

```javascript
const membership = await sdk.memberships.get(456);
```

## Transactions API

### `transactions.list(filters)`

Lists transactions with optional filters.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| filters | Object | No | Filter parameters |
| filters.limit | number | No | Number of transactions to return |
| filters.offset | number | No | Offset for pagination |
| filters.status | string | No | Filter by status |
| filters.member_id | string\|number | No | Filter by member ID |
| filters.membership_id | string\|number | No | Filter by membership ID |

**Returns:** Promise that resolves to an array of transaction objects

**Example:**

```javascript
const transactions = await sdk.transactions.list({
  limit: 10,
  status: 'complete',
  member_id: 123
});
```

### `transactions.get(transactionId)`

Retrieves a transaction by ID.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| transactionId | string\|number | Yes | Transaction ID |

**Returns:** Promise that resolves to the transaction object

**Example:**

```javascript
const transaction = await sdk.transactions.get(789);
```

## Subscriptions API

### `subscriptions.list(filters)`

Lists subscriptions with optional filters.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| filters | Object | No | Filter parameters |
| filters.limit | number | No | Number of subscriptions to return |
| filters.offset | number | No | Offset for pagination |
| filters.status | string | No | Filter by status |
| filters.member_id | string\|number | No | Filter by member ID |
| filters.membership_id | string\|number | No | Filter by membership ID |

**Returns:** Promise that resolves to an array of subscription objects

**Example:**

```javascript
const subscriptions = await sdk.subscriptions.list({
  member_id: 123,
  status: 'active'
});
```

### `subscriptions.get(subscriptionId)`

Retrieves a subscription by ID.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| subscriptionId | string\|number | Yes | Subscription ID |

**Returns:** Promise that resolves to the subscription object

**Example:**

```javascript
const subscription = await sdk.subscriptions.get(789);
```

### `subscriptions.cancel(subscriptionId)`

Cancels a subscription.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| subscriptionId | string\|number | Yes | Subscription ID |

**Returns:** Promise that resolves to the cancelled subscription object

**Example:**

```javascript
const result = await sdk.subscriptions.cancel(789);
console.log(`Subscription ${result.id} has been cancelled`);
```

## Response Object Formats

### Member Object

```javascript
{
  id: 123,
  email: 'user@example.com',
  username: 'johndoe',
  nicename: 'john-doe',
  url: 'https://example.com',
  registered_at: '2023-01-15 10:30:45',
  first_name: 'John',
  last_name: 'Doe',
  display_name: 'John Doe',
  active_memberships: [ ... ],
  active_txn_count: 5,
  expired_txn_count: 2,
  trial_txn_count: 1,
  sub_count: 3,
  login_count: 27,
  first_txn: { ... },
  latest_txn: { ... },
  address: { ... },
  profile: { ... },
  recent_transactions: [ ... ],
  recent_subscriptions: [ ... ]
}
```

### Membership Object

```javascript
{
  id: 456,
  title: 'Gold Membership',
  content: 'Full access to premium content',
  excerpt: 'Our premier membership level',
  date: '2022-11-20 09:15:30',
  status: 'publish',
  author: { ... },
  price: '29.99',
  period: 1,
  period_type: 'months',
  signup_button_text: 'Join Now',
  trial: true,
  trial_days: 14,
  trial_amount: '0.00',
  group_order: 1,
  is_highlighted: true
  // ... additional fields
}
```

### Transaction Object

```javascript
{
  id: 789,
  status: 'complete',
  amount: '29.99',
  total: '29.99',
  tax_amount: '0.00',
  tax_rate: '0.00',
  tax_desc: '',
  member_id: 123,
  member_email: 'user@example.com',
  membership_id: 456,
  membership_name: 'Gold Membership',
  created_at: '2023-03-10 14:22:18',
  updated_at: '2023-03-10 14:22:18',
  subscription_id: 101,
  gateway: 'stripe',
  gateway_id: 'ch_123456789',
  // ... additional fields
}
```

### Subscription Object

```javascript
{
  id: 101,
  status: 'active',
  member_id: 123,
  member_email: 'user@example.com',
  membership_id: 456,
  membership_name: 'Gold Membership',
  created_at: '2023-03-10 14:22:18',
  updated_at: '2023-03-10 14:22:18',
  expires_at: '2024-03-10 14:22:18',
  gateway: 'stripe',
  gateway_id: 'sub_123456789',
  cc_last4: '4242',
  cc_exp_month: 12,
  cc_exp_year: 2025,
  renewal_amount: '29.99',
  next_payment_date: '2023-04-10 14:22:18',
  // ... additional fields
}
```