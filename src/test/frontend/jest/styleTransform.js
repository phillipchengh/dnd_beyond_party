// jest recommends mocking all style stuff under https://jestjs.io/docs/en/webpack
module.exports = {
  process() {
    return 'module.exports = {};';
  },
};
