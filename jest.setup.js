import '@testing-library/jest-dom'
import 'whatwg-fetch'; // fornece fetch globalmente

// Mock global timer functions
global.setTimeout = setTimeout;
global.clearTimeout = clearTimeout;

if (!global.fetch) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
}
