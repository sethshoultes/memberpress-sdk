/**
 * Example showing how to create a new member and check their access
 */

// Import the SDK
const { MemberPressSDK } = require('../src/index');

// Initialize the SDK with your MemberPress API key
const sdk = new MemberPressSDK({
  apiKey: 'your-memberpress-api-key', // Replace with your actual API key
  baseUrl: 'https://yoursite.com/wp-json/mp/v1', // Replace with your WordPress site URL
  debug: true // Enable debug logging
});

// Function to create a new member
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

// Function to check if a member has access to a membership
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

// Run the example
async function runExample() {
  // First create a new member
  const member = await createMember();
  
  if (member) {
    // Then check their access to a membership (replace 123 with an actual membership ID)
    await checkMemberAccess(member.id, 123);
  }
}

runExample();
