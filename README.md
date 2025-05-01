# `ip`

Basic `ip` functionality for controlling VLANs on all platforms from Node.js.

## Installation

```bash
npm install cinderblock/ip # From GitHub
npm install @cinderblock/ip # From NPM
```

## Usage

```typescript
import { getNetworkManager } from "@cinderblock/ip";

getNetworkManager().then(networkManager => {
  // Get Map of network interfaces
  const interfaces = networkManager.getInterfaces();
  console.log(interfaces);

  // Create a new interface
  const newInterface = networkManager.createInterface("eth0.10");
  console.log(newInterface);

  // Configure the interface
  newInterface.configure({
    ipAddress: "10.20.30.40/24", // Can be an array and/or IPv6
    gateway: "10.20.30.1",
    vlanId: 69,
  });
});
```

## Development

```bash
npm install
code .
```
