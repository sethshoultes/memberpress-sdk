# MemberPress SDK Examples

This document provides practical examples of using the MemberPress SDK for common tasks.

## Basic Examples

### Initialize the SDK

```javascript
const { MemberPressSDK } = require('memberpress-sdk');

const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key',
  baseUrl: 'https://yoursite.com/wp-json/mp/v1',
  debug: true, // Enable for development, disable in production
  cacheTimeout: 300000 // 5 minutes
});
```

### Retrieve and Display Memberships

```javascript
async function displayMemberships() {
  try {
    // Fetch all available memberships
    const memberships = await sdk.memberships.list();
    
    // Display membership information
    console.log(`Found ${memberships.length} memberships:`);
    
    memberships.forEach(membership => {
      console.log(`
        ID: ${membership.id}
        Title: ${membership.title || membership.name}
        Price: $${membership.price || '0.00'}
        Billing Type: ${membership.period_type || 'one-time'}
        Status: ${membership.status}
      `);
    });
    
    return memberships;
  } catch (error) {
    console.error('Error retrieving memberships:', error.message);
    return [];
  }
}
```

### Create a New Member and Check Access

```javascript
async function registerAndCheckAccess() {
  try {
    // 1. Create a new member
    const memberData = {
      email: 'newuser@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'janedoe',
      password: 'securePassword123'
    };
    
    console.log('Creating new member...');
    const newMember = await sdk.members.create(memberData);
    console.log(`Member created with ID ${newMember.id}`);
    
    // 2. Get available memberships
    const memberships = await sdk.memberships.list();
    if (memberships.length === 0) {
      console.log('No memberships found to check access against');
      return;
    }
    
    // 3. Check access to the first membership
    const membershipId = memberships[0].id;
    console.log(`Checking access to membership "${memberships[0].title || memberships[0].name}"...`);
    
    const access = await sdk.members.checkAccess(newMember.id, membershipId);
    
    if (access.hasAccess) {
      console.log(`Member has access until ${access.expiresAt || 'never'}`);
    } else {
      console.log('Member does not have access to this membership');
    }
    
    return { member: newMember, access };
  } catch (error) {
    console.error('Error in registration process:', error.message);
    return null;
  }
}
```

## Advanced Examples

### Member Management System

```javascript
class MemberManager {
  constructor(apiKey, baseUrl) {
    this.sdk = new MemberPressSDK({
      apiKey,
      baseUrl,
      debug: false,
      cacheTimeout: 600000 // 10 minutes
    });
  }
  
  async listActiveMembers(page = 1, limit = 20) {
    return this.sdk.members.list({
      limit,
      offset: (page - 1) * limit,
      status: 'active'
    });
  }
  
  async searchMembers(query) {
    return this.sdk.members.list({
      search: query
    });
  }
  
  async getMemberDetails(memberId) {
    try {
      const member = await this.sdk.members.get(memberId);
      
      // Get additional information
      const transactions = await this.sdk.transactions.list({ member_id: memberId });
      const subscriptions = await this.sdk.subscriptions.list({ member_id: memberId });
      
      return {
        ...member,
        transactions,
        subscriptions
      };
    } catch (error) {
      console.error(`Error fetching details for member ${memberId}:`, error.message);
      throw error;
    }
  }
  
  async deactivateMember(memberId) {
    return this.sdk.members.updateStatus(memberId, 'inactive');
  }
}

// Usage example
const memberManager = new MemberManager('your-api-key', 'https://yoursite.com/wp-json/mp/v1');

// List active members on page 1
const activeMembers = await memberManager.listActiveMembers(1);

// Search for members
const searchResults = await memberManager.searchMembers('smith');

// Get detailed member information
const memberDetails = await memberManager.getMemberDetails(123);

// Deactivate a member
await memberManager.deactivateMember(123);
```

### Membership Analytics Dashboard

```javascript
class MembershipAnalytics {
  constructor(apiKey, baseUrl) {
    this.sdk = new MemberPressSDK({
      apiKey,
      baseUrl
    });
  }
  
  async getMembershipStats() {
    try {
      // Get all memberships
      const memberships = await this.sdk.memberships.list();
      
      // Get all transactions
      const transactions = await this.sdk.transactions.list({ limit: 1000 });
      
      // Get all members
      const members = await this.sdk.members.list({ limit: 1000 });
      
      // Calculate statistics
      const stats = memberships.map(membership => {
        const membershipId = membership.id;
        
        // Filter transactions for this membership
        const membershipTransactions = transactions.filter(
          txn => txn.membership_id === membershipId
        );
        
        // Calculate revenue
        const revenue = membershipTransactions.reduce(
          (total, txn) => total + parseFloat(txn.amount || 0), 
          0
        );
        
        // Count members with this membership
        const memberCount = members.reduce((count, member) => {
          const hasMembership = member.active_memberships && 
            member.active_memberships.some(m => m.id === membershipId);
          return count + (hasMembership ? 1 : 0);
        }, 0);
        
        return {
          id: membershipId,
          name: membership.title || membership.name,
          memberCount,
          revenue: revenue.toFixed(2),
          transactionCount: membershipTransactions.length
        };
      });
      
      return stats;
    } catch (error) {
      console.error('Error generating membership statistics:', error.message);
      throw error;
    }
  }
}

// Usage example
const analytics = new MembershipAnalytics('your-api-key', 'https://yoursite.com/wp-json/mp/v1');
const stats = await analytics.getMembershipStats();

console.log('Membership Statistics:');
stats.forEach(stat => {
  console.log(`
    Membership: ${stat.name}
    Members: ${stat.memberCount}
    Revenue: $${stat.revenue}
    Transactions: ${stat.transactionCount}
  `);
});
```

### Express.js API Integration

```javascript
const express = require('express');
const { MemberPressSDK } = require('memberpress-sdk');

// Create Express app
const app = express();
app.use(express.json());

// Initialize MemberPress SDK
const sdk = new MemberPressSDK({
  apiKey: process.env.MEMBERPRESS_API_KEY,
  baseUrl: process.env.MEMBERPRESS_BASE_URL,
  debug: process.env.NODE_ENV !== 'production'
});

// Middleware to handle errors
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
app.get('/api/memberships', asyncHandler(async (req, res) => {
  const memberships = await sdk.memberships.list();
  res.json(memberships);
}));

app.get('/api/members', asyncHandler(async (req, res) => {
  const { search, limit = 20, page = 1 } = req.query;
  const offset = (page - 1) * limit;
  
  const members = await sdk.members.list({
    search,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
  
  res.json(members);
}));

app.get('/api/members/:id', asyncHandler(async (req, res) => {
  const member = await sdk.members.get(req.params.id);
  res.json(member);
}));

app.post('/api/members', asyncHandler(async (req, res) => {
  const newMember = await sdk.members.create(req.body);
  res.status(201).json(newMember);
}));

app.get('/api/members/:id/subscriptions', asyncHandler(async (req, res) => {
  const subscriptions = await sdk.subscriptions.list({
    member_id: req.params.id
  });
  res.json(subscriptions);
}));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Integration Examples

### React Component for Membership Display

```jsx
import React, { useState, useEffect } from 'react';
import { MemberPressSDK } from 'memberpress-sdk';

// Initialize SDK
const sdk = new MemberPressSDK({
  apiKey: process.env.REACT_APP_MEMBERPRESS_API_KEY,
  baseUrl: process.env.REACT_APP_MEMBERPRESS_BASE_URL
});

const MembershipList = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setLoading(true);
        const data = await sdk.memberships.list();
        setMemberships(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching memberships:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  if (loading) return <div>Loading memberships...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="membership-list">
      <h2>Available Memberships</h2>
      {memberships.length === 0 ? (
        <p>No memberships found</p>
      ) : (
        <div className="membership-grid">
          {memberships.map(membership => (
            <div key={membership.id} className="membership-card">
              <h3>{membership.title || membership.name}</h3>
              <p className="price">${membership.price}</p>
              <p className="description">{membership.excerpt}</p>
              <button className="sign-up-button">
                {membership.signup_button_text || 'Sign Up'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembershipList;
```

### Node.js CLI Tool for Member Management

```javascript
#!/usr/bin/env node
const { program } = require('commander');
const { MemberPressSDK } = require('memberpress-sdk');
const inquirer = require('inquirer');
require('dotenv').config();

// Initialize SDK
const sdk = new MemberPressSDK({
  apiKey: process.env.MEMBERPRESS_API_KEY,
  baseUrl: process.env.MEMBERPRESS_BASE_URL,
  debug: process.env.DEBUG === 'true'
});

program
  .version('1.0.0')
  .description('MemberPress CLI Management Tool');

// List memberships
program
  .command('list-memberships')
  .description('List all available memberships')
  .action(async () => {
    try {
      const memberships = await sdk.memberships.list();
      console.table(memberships.map(m => ({
        ID: m.id,
        Title: m.title || m.name,
        Price: `$${m.price || '0.00'}`,
        Type: m.period_type || 'one-time'
      })));
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

// List members
program
  .command('list-members')
  .description('List all members')
  .option('-l, --limit <number>', 'Number of members to return', '20')
  .option('-p, --page <number>', 'Page number', '1')
  .action(async (options) => {
    try {
      const limit = parseInt(options.limit);
      const offset = (parseInt(options.page) - 1) * limit;
      
      const members = await sdk.members.list({ limit, offset });
      console.table(members.map(m => ({
        ID: m.id,
        Name: `${m.first_name} ${m.last_name}`,
        Email: m.email,
        Status: m.status
      })));
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

// Add a new member
program
  .command('add-member')
  .description('Add a new member')
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'email',
          message: 'Email address:',
          validate: input => input.includes('@') ? true : 'Invalid email address'
        },
        {
          type: 'input',
          name: 'firstName',
          message: 'First name:'
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Last name:'
        },
        {
          type: 'input',
          name: 'username',
          message: 'Username (optional):'
        },
        {
          type: 'password',
          name: 'password',
          message: 'Password (leave empty to auto-generate):',
          mask: '*'
        }
      ]);
      
      // Remove empty fields
      Object.keys(answers).forEach(key => 
        answers[key] === '' && delete answers[key]
      );
      
      const newMember = await sdk.members.create(answers);
      console.log('Member created successfully:');
      console.log(`ID: ${newMember.id}`);
      console.log(`Email: ${newMember.email}`);
      console.log(`Name: ${newMember.first_name} ${newMember.last_name}`);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

program.parse(process.argv);
```

## Additional Examples

For more examples and use cases, check out the [examples directory](../examples/) in the SDK repository.