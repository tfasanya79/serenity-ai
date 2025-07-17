// Jest setup file for Node.js environment

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  // Uncomment to silence console output during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Add any global test utilities here
global.testUtils = {
  timeout: 5000,
};
