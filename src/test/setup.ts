import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Azure DevOps SDK
(global as any).SDK = {
  init: vi.fn(),
  ready: vi.fn(() => Promise.resolve()),
  notifyLoadSucceeded: vi.fn(),
  notifyLoadFailed: vi.fn(),
};
