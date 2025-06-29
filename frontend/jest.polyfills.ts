// frontend/jest.polyfills.ts
// This file runs BEFORE the test environment is set up and modules are imported.
// It's ideal for global polyfills that need to be available very early.

import { TextEncoder, TextDecoder } from 'util';
import { TransformStream } from 'stream/web';
// Import BroadcastChannel from Node.js's worker_threads module
import { BroadcastChannel } from 'worker_threads'; // Note: This import requires Node.js 15.4.0 or newer

// Assign TextEncoder and TextDecoder to the global scope if they're not already defined.
if (typeof global.TextEncoder === 'undefined') {
  (global as any).TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  (global as any).TextDecoder = TextDecoder;
}

// Assign TransformStream to the global scope if it's not already defined.
if (typeof global.TransformStream === 'undefined') {
  (global as any).TransformStream = TransformStream;
}

// Assign BroadcastChannel to the global scope if it's not already defined.
if (typeof global.BroadcastChannel === 'undefined') {
  (global as any).BroadcastChannel = BroadcastChannel;
}

// Keep 'cross-fetch/polyfill' in jest.setup.ts unless it specifically causes early ReferenceErrors.