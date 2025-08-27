module.exports = {
  set: jest.fn(() => Promise.resolve()),
  get: jest.fn(() => Promise.resolve(null)),
  remove: jest.fn(() => Promise.resolve()),
};

