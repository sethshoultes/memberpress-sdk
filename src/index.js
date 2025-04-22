/**
 * MemberPress SDK - JavaScript client for the MemberPress REST API
 * @module memberpress-sdk
 */

const { MemberPressSDK } = require('./memberpress-sdk');

// Export the class for CommonJS
module.exports = {
  MemberPressSDK
};

// For default export with bundlers
module.exports.default = { MemberPressSDK };
