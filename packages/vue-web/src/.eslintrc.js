/* eslint-disable no-undef */
module.exports = {
  root: true,
  extends: ['plugin:@elux/vue'],
  env: {
    browser: false,
    node: false,
  },
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
};
