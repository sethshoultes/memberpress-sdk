# Quick Start Guide

This guide will help you quickly get started with the MemberPress SDK by walking through some common usage scenarios.

## Basic Setup

First, make sure you have installed the SDK and have your API key ready. If you haven't done this yet, see the [Installation Guide](./installation.md).

```javascript
// Import the SDK
const { MemberPressSDK } = require('memberpress-sdk');

// Initialize the SDK with your MemberPress API key
const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key', // Replace with your actual API key
  baseUrl: 'https://yoursite.com/wp-json/mp/v1', // Replace with your WordPress site URL
  debug: true // Enable debug logging
});
```

## Common Use Cases

### Listing Memberships

To retrieve all available memberships on your site:

```javascript
async function listMemberships() {
  try {
    console.log('Fetching available memberships...');
    const memberships = await sdk.memberships.list();
    
    console.log('Available Memberships:');
    console.log('=====================');
    
    memberships.forEach(membership => {
      console.log(`ID: ${membership.id}`);
      console.log(`Title: ${membership.title || membership.name}`);
      console.log(`Price: $${membership.price}`);
      console.log(`Billing Type: ${membership.billing_type}`);
      console.log('---------------------');
    });
    
    return memberships;
  } catch (error) {
    console.error('Error fetching memberships:', error.message);
    return [];
  }
}

// Run the function
listMemberships();
```

### Creating a New Member

To create a new member in MemberPress:

```javascript
async function createMember() {
  try {
    console.log('Creating a new member...');
    
    const memberData = {
      email: 'newuser@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'janedoe', // Optional
      password: 'securepassword123' // Optional
    };
    
    const newMember = await sdk.members.create(memberData);
    
    console.log('Member created successfully:');
    console.log(`ID: ${newMember.id}`);
    console.log(`Email: ${newMember.email}`);
    console.log(`Name: ${newMember.firstName} ${newMember.lastName}`);
    
    return newMember;
  } catch (error) {
    console.error('Error creating member:', error.message);
    return null;
  }
}

// Run the function
createMember();
```

### Checking Member Access to a Membership

To check if a member has access to a specific membership:

```javascript
async function checkMemberAccess(memberId, membershipId) {
  try {
    console.log(`Checking access for member ${memberId} to membership ${membershipId}...`);
    
    const access = await sdk.members.checkAccess(memberId, membershipId);
    
    console.log(`Access status: ${access.hasAccess ? 'Granted' : 'Denied'}`);
    if (access.hasAccess) {
      console.log(`Expires: ${access.expiresAt || 'Never'}`);
    }
    
    return access;
  } catch (error) {
    console.error('Error checking access:', error.message);
    return { hasAccess: false };
  }
}

// Example usage
checkMemberAccess(123, 456);
```

### Listing a Member's Transactions

To retrieve all transactions associated with a member:

```javascript
async function listMemberTransactions(memberId) {
  try {
    console.log(`Fetching transactions for member ${memberId}...`);
    
    const transactions = await sdk.transactions.list({
      member_id: memberId
    });
    
    console.log(`Found ${transactions.length} transactions:`);
    console.log('=====================');
    
    transactions.forEach(transaction => {
      console.log(`ID: ${transaction.id}`);
      console.log(`Status: ${transaction.status}`);
      console.log(`Amount: $${transaction.amount}`);
      console.log(`Date: ${transaction.created_at}`);
      console.log(`Membership: ${transaction.membership_id}`);
      console.log('---------------------');
    });
    
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    return [];
  }
}

// Example usage
listMemberTransactions(123);
```

### Managing Subscriptions

To list and cancel a member's subscriptions:

```javascript
async function manageSubscriptions(memberId) {
  try {
    // List active subscriptions
    console.log(`Fetching subscriptions for member ${memberId}...`);
    
    const subscriptions = await sdk.subscriptions.list({
      member_id: memberId,
      status: 'active'
    });
    
    console.log(`Found ${subscriptions.length} active subscriptions`);
    
    // Cancel the first subscription if any exist
    if (subscriptions.length > 0) {
      const subscriptionId = subscriptions[0].id;
      console.log(`Cancelling subscription ${subscriptionId}...`);
      
      const result = await sdk.subscriptions.cancel(subscriptionId);
      
      console.log('Subscription cancelled successfully:');
      console.log(`ID: ${result.id}`);
      console.log(`Status: ${result.status}`);
      console.log(`Cancelled Date: ${result.cancelled_at}`);
    }
    
    return subscriptions;
  } catch (error) {
    console.error('Error managing subscriptions:', error.message);
    return [];
  }
}

// Example usage
manageSubscriptions(123);
```

## Error Handling

All SDK methods return promises, so you can use try/catch blocks or .then()/.catch() chains for error handling:

```javascript
// Using async/await with try/catch
async function tryOperation() {
  try {
    const result = await sdk.members.get(123);
    // Process successful result
  } catch (error) {
    // Handle error based on message or status code
    if (error.message.includes('401')) {
      console.error('Authentication failed. Check your API key.');
    } else if (error.message.includes('404')) {
      console.error('Member not found. Check the ID.');
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Using promise chains
sdk.members.get(123)
  .then(member => {
    // Process member data
  })
  .catch(error => {
    // Handle error
    console.error('Error fetching member:', error.message);
  });
```

## Next Steps

Now that you understand the basics, explore the [API Reference](./api-reference.md) for detailed information about all available methods and parameters.