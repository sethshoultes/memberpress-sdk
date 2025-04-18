# Changelog

All notable changes to the MemberPress SDK will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-04-17

### Added
- Initial release of the MemberPress SDK
- Core functionality for interacting with the MemberPress REST API
- Support for members, memberships, transactions, and subscriptions
- Comprehensive documentation and examples
- Browser and Node.js compatibility
- Response caching for improved performance
- Debug mode for development and troubleshooting

### Members API
- `members.create()`: Create new members
- `members.get()`: Retrieve member details
- `members.updateStatus()`: Update a member's status
- `members.list()`: List members with filters
- `members.checkAccess()`: Check member access to memberships

### Memberships API
- `memberships.list()`: List available memberships
- `memberships.get()`: Retrieve membership details

### Transactions API
- `transactions.list()`: List transactions with filters
- `transactions.get()`: Retrieve transaction details

### Subscriptions API
- `subscriptions.list()`: List subscriptions with filters
- `subscriptions.get()`: Retrieve subscription details
- `subscriptions.cancel()`: Cancel an active subscription