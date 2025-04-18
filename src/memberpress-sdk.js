/**
 * MemberPress SDK - JavaScript client for the MemberPress REST API
 * @module memberpress-sdk
 */

class MemberPressSDK {
  /**
   * Creates a new MemberPress SDK instance
   * @param {Object} config - Configuration options
   * @param {string} config.apiKey - MemberPress API key (found in MemberPress admin area)
   * @param {string} config.baseUrl - Base URL for the MemberPress REST API (e.g., 'https://yoursite.com/wp-json/mp/v1')
   * @param {boolean} [config.debug=false] - Enable debug logging
   * @param {number} [config.cacheTimeout=300000] - Cache timeout in milliseconds (default: 5 minutes)
   */
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.debug = config.debug || false;
    this.cacheTimeout = config.cacheTimeout || 300000; // 5 minutes in milliseconds
    this.cache = new Map();
    
    // Initialize API modules
    this.members = {
      create: this.createMember.bind(this),
      get: this.getMember.bind(this),
      updateStatus: this.updateMemberStatus.bind(this),
      list: this.listMembers.bind(this),
      checkAccess: this.checkMemberAccess.bind(this)
    };
    
    this.memberships = {
      list: this.listMemberships.bind(this),
      get: this.getMembership.bind(this)
    };
    
    this.transactions = {
      list: this.listTransactions.bind(this),
      get: this.getTransaction.bind(this)
    };
    
    this.subscriptions = {
      list: this.listSubscriptions.bind(this),
      get: this.getSubscription.bind(this),
      cancel: this.cancelSubscription.bind(this)
    };
    
    if (this.debug) {
      console.log('MemberPress SDK initialized with:', {
        baseUrl: this.baseUrl,
        debug: this.debug,
        cacheTimeout: this.cacheTimeout
      });
    }
  }
  
  /**
   * Helper method for making API requests
   * @private
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} - API response
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/${endpoint}`;
    const cacheKey = `${options.method || 'GET'}-${url}-${JSON.stringify(options.body || {})}`;
    
    // Check cache for GET requests
    if (options.method === 'GET' || !options.method) {
      const cachedResponse = this.cache.get(cacheKey);
      if (cachedResponse && Date.now() - cachedResponse.timestamp < this.cacheTimeout) {
        if (this.debug) console.log('Using cached response for:', url);
        return cachedResponse.data;
      }
    }
    
    // Set up request headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `${this.apiKey}`,
      ...options.headers
    };
    
    try {
      if (this.debug) console.log(`Making ${options.method || 'GET'} request to:`, url);
      
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`API Error: ${data.message || response.statusText}`);
      }
      
      // Cache successful GET responses
      if (options.method === 'GET' || !options.method) {
        this.cache.set(cacheKey, {
          timestamp: Date.now(),
          data
        });
      }
      
      return data;
    } catch (error) {
      if (this.debug) console.error('API Request Error:', error);
      throw error;
    }
  }
  
  // Members API methods
  
  /**
   * Create a new member
   * @param {Object} memberData - Member data
   * @param {string} memberData.email - Member email
   * @param {string} [memberData.firstName] - Member first name
   * @param {string} [memberData.lastName] - Member last name
   * @returns {Promise<Object>} - Created member
   */
  async createMember(memberData) {
    return this.request('members', {
      method: 'POST',
      body: memberData
    });
  }
  
  /**
   * Get a member by ID
   * @param {string|number} memberId - Member ID
   * @returns {Promise<Object>} - Member data
   */
  async getMember(memberId) {
    return this.request(`members/${memberId}`);
  }
  
  /**
   * Update a member's status
   * @param {string|number} memberId - Member ID
   * @param {string} status - New status
   * @returns {Promise<Object>} - Updated member
   */
  async updateMemberStatus(memberId, status) {
    return this.request(`members/${memberId}/status`, {
      method: 'PUT',
      body: { status }
    });
  }
  
  /**
   * List members with optional filters
   * @param {Object} [filters={}] - Filter parameters
   * @returns {Promise<Array>} - List of members
   */
  async listMembers(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    return this.request(`members${queryString ? `?${queryString}` : ''}`);
  }
  
  /**
   * Check if a member has access to a specific membership
   * @param {string|number} memberId - Member ID
   * @param {string|number} membershipId - Membership ID
   * @returns {Promise<Object>} - Access status
   */
  async checkMemberAccess(memberId, membershipId) {
    return this.request(`members/${memberId}/access/${membershipId}`);
  }
  
  // Memberships API methods
  
  /**
   * List memberships with optional filters
   * @param {Object} [filters={}] - Filter parameters
   * @returns {Promise<Array>} - List of memberships
   */
  async listMemberships(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    return this.request(`memberships${queryString ? `?${queryString}` : ''}`);
  }
  
  /**
   * Get a membership by ID
   * @param {string|number} membershipId - Membership ID
   * @returns {Promise<Object>} - Membership data
   */
  async getMembership(membershipId) {
    return this.request(`memberships/${membershipId}`);
  }
  
  // Transactions API methods
  
  /**
   * List transactions with optional filters
   * @param {Object} [filters={}] - Filter parameters
   * @returns {Promise<Array>} - List of transactions
   */
  async listTransactions(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    return this.request(`transactions${queryString ? `?${queryString}` : ''}`);
  }
  
  /**
   * Get a transaction by ID
   * @param {string|number} transactionId - Transaction ID
   * @returns {Promise<Object>} - Transaction data
   */
  async getTransaction(transactionId) {
    return this.request(`transactions/${transactionId}`);
  }
  
  // Subscriptions API methods
  
  /**
   * List subscriptions with optional filters
   * @param {Object} [filters={}] - Filter parameters
   * @returns {Promise<Array>} - List of subscriptions
   */
  async listSubscriptions(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    return this.request(`subscriptions${queryString ? `?${queryString}` : ''}`);
  }
  
  /**
   * Get a subscription by ID
   * @param {string|number} subscriptionId - Subscription ID
   * @returns {Promise<Object>} - Subscription data
   */
  async getSubscription(subscriptionId) {
    return this.request(`subscriptions/${subscriptionId}`);
  }
  
  /**
   * Cancel a subscription
   * @param {string|number} subscriptionId - Subscription ID
   * @returns {Promise<Object>} - Cancellation result
   */
  async cancelSubscription(subscriptionId) {
    return this.request(`subscriptions/${subscriptionId}/cancel`, {
      method: 'PUT'
    });
  }
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MemberPressSDK };
}

// For browser environments
if (typeof window !== 'undefined') {
  window.MemberPressSDK = MemberPressSDK;
}
