/**
 * Example showing how to manage subscriptions with the MemberPress SDK
 */

// Import the SDK
const { MemberPressSDK } = require('../src/index');

// Initialize the SDK with your MemberPress API key
const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key', // Replace with your actual API key
  baseUrl: 'https://yoursite.com/wp-json/mp/v1', // Replace with your WordPress site URL
  debug: true // Enable debug logging
});

// Function to list a member's active subscriptions
async function listMemberSubscriptions(memberId) {
  try {
    console.log(`Fetching subscriptions for member ${memberId}...`);
    
    const subscriptions = await sdk.subscriptions.list({
      member_id: memberId,
      status: 'active'
    });
    
    console.log(`Found ${subscriptions.length} active subscriptions:`);
    console.log('=====================');
    
    subscriptions.forEach(subscription => {
      console.log(`ID: ${subscription.id}`);
      console.log(`Membership: ${subscription.membership_name}`);
      console.log(`Status: ${subscription.status}`);
      console.log(`Created: ${subscription.created_at}`);
      console.log(`Next Payment: ${subscription.next_payment_date || 'N/A'}`);
      console.log('---------------------');
    });
    
    return subscriptions;
  } catch (error) {
    console.error('Error fetching subscriptions:', error.message);
    return [];
  }
}

// Function to cancel a subscription
async function cancelSubscription(subscriptionId) {
  try {
    console.log(`Cancelling subscription ${subscriptionId}...`);
    
    const result = await sdk.subscriptions.cancel(subscriptionId);
    
    console.log('Subscription cancelled successfully:');
    console.log(`ID: ${result.id}`);
    console.log(`Status: ${result.status}`);
    console.log(`Cancelled Date: ${result.cancelled_at}`);
    
    return result;
  } catch (error) {
    console.error('Error cancelling subscription:', error.message);
    return null;
  }
}

// Run the example
async function runExample() {
  // Replace 456 with an actual member ID
  const memberId = 456;
  
  // First list the member's subscriptions
  const subscriptions = await listMemberSubscriptions(memberId);
  
  if (subscriptions.length > 0) {
    // Then cancel the first subscription
    await cancelSubscription(subscriptions[0].id);
    
    // List subscriptions again to verify the cancellation
    await listMemberSubscriptions(memberId);
  } else {
    console.log('No active subscriptions found to cancel.');
  }
}

runExample();
