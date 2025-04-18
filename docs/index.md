# MemberPress SDK Documentation

Welcome to the official documentation for the MemberPress SDK. This JavaScript SDK provides a simple and powerful interface for interacting with the MemberPress REST API, allowing you to integrate MemberPress functionality into your JavaScript applications.

## Overview

The MemberPress SDK simplifies the process of connecting to your MemberPress-powered WordPress site by providing a clean, intuitive interface that abstracts away the complexities of API authentication and request handling.

With this SDK, you can:

- Manage members and their subscription data
- List and access membership products
- Process transactions
- Manage subscriptions
- Check access rights to protected content

## Getting Started

To get started with the MemberPress SDK, check out the [Installation Guide](./installation.md) and [Quick Start Guide](./quickstart.md).

## Core Concepts

The SDK is organized around the main MemberPress entities:

- **Members**: Users who have registered for your site
- **Memberships**: Products or subscription plans that you sell
- **Transactions**: Payment records for memberships
- **Subscriptions**: Recurring payment plans

Each entity has its own set of methods for interacting with the corresponding API endpoints.

## Prerequisites

Before using the SDK, you'll need:

1. A WordPress site with MemberPress installed and activated
2. MemberPress REST API enabled in MemberPress settings
3. An API key generated in the MemberPress admin area
4. Proper permalink structure in WordPress (not set to "Plain")

## SDK Structure

The SDK provides a modular structure that allows you to interact with different parts of the MemberPress system:

```
MemberPressSDK
├── members
│   ├── create()
│   ├── get()
│   ├── updateStatus()
│   ├── list()
│   └── checkAccess()
├── memberships
│   ├── list()
│   └── get()
├── transactions
│   ├── list()
│   └── get()
└── subscriptions
    ├── list()
    ├── get()
    └── cancel()
```

## API Reference

For detailed information about each API method, parameters, and return values, see the [API Reference](./api-reference.md).

## Additional Resources

- [Troubleshooting Guide](./troubleshooting.md)
- [Examples](./examples.md)
- [Changelog](./changelog.md)