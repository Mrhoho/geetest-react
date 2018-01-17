// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {

  extends: [
    'airbnb',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
    'prettier/standard',
  ],

  plugins: ['prettier'],

  env: {
    browser: true,
  },

  rules: {
    // Allow js files to use jsx syntax, too
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': [
      'error',
      {
        // https://github.com/prettier/prettier#options
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    // Automatically convert pure class to function by
    // babel-plugin-transform-react-pure-class-to-function
    // https://github.com/kriasoft/react-starter-kit/pull/961
    'react/prefer-stateless-function': 'off',
  },

};
