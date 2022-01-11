const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '#': path.resolve(__dirname, 'src/')
    }
  },
  style: {
    sass: {
        loaderOptions: { 
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
            sassOptions: {
              fiber: false,
            },
          },
        },
        loaderOptions: (sassLoaderOptions, { env, paths }) => { return sassLoaderOptions; }
    },
  },
  babel: {
    presets: [],
    plugins: [],
    loaderOptions: {
      loader: 'babel-loader',
        options: {
          presets: [],
          plugins: ['@babel/plugin-transform-react-jsx', '@babel/plugin-syntax-jsx']
        }
    },
    loaderOptions: (babelLoaderOptions, { env, paths }) => { return babelLoaderOptions; }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
      "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js",
      // "#/(.*)": "<rootDir>/src/",
      "^#(.*)$": "<rootDir>/src$1",
      },
      // transformIgnorePatterns: ['/node_modules\/(?!my-package)(.*)'],
      modulePaths: ['src'],
      collectCoverageFrom: [
        "**/*.{js,jsx}",
        "!**/node_modules/**",
        "!**/vendor/**"
      ],
      // setupFiles: ['<rootDir>/src/setupTests.js'],
    }
  }
};