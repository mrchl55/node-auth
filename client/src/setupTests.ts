import '@testing-library/jest-dom';

global.fetch = jest.fn();

beforeEach(() => {
  (fetch as jest.Mock).mockClear();
}); 