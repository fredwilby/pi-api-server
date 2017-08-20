module.exports = {
  extends: 'airbnb-base',

  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  /* airbnb overrides */
  rules: {
    'no-underscore-dangle': 0, /* annoying for mongoose fields */
    'no-param-reassign': 0, /* annoying */
    'no-restricted-syntax': 0, /* nudges towards less compatible syntax */
    'no-console': 0,
    'no-plusplus': 0,
  },

  root: true,
};
