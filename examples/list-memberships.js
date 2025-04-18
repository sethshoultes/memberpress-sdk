/**
 * Basic example showing how to use the MemberPress SDK to list memberships
 */

// Import the SDK
const { MemberPressSDK } = require('../src/index');

// Initialize the SDK with your MemberPress API key
const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key', // Replace with your actual API key
  baseUrl: 'https://yoursite.com/wp-json/mp/v1', // Replace with your WordPress site URL
  debug: true // Enable debug logging
});

// Function to list all available memberships
async function listMemberships() {
  try {
    console.log('Fetching available memberships...');
    const memberships = await sdk.memberships.list();
    
    console.log('Available Memberships:');
    console.log('=====================');
    
    memberships.forEach(membership => {
      console.log(`ID: ${membership.id}`);
      console.log(`Name: ${membership.name}`);
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

// Run the example
listMemberships();
