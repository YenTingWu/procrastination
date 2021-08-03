/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

const TSCONFIG_PATH = './tsconfig.json';

/**
 * For example, {'@alias/*': [ 'path/to/alias/*' ]}
 * Becomes {'@alias/(.*)':  '<rootDir>/path/to/alias/$1' }
 */

function getJestModuleNameMapper() {
  const { paths } = require(TSCONFIG_PATH).compilerOptions;
  const absolutePaths = Object.keys(paths);

  return absolutePaths.reduce((acc, cur) => {
    const newKey = cur.replace('*', '(.*)');
    const path = '<rootDir>/' + paths[cur][0].replace('/*', '/$1');

    return {
      ...acc,
      [newKey]: path,
    };
  }, {});
}

const config = {
  // The root of your source code, typically /src
  // `<rootDir>` is a token Jest substitutes
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  // Runs special logic, such as cleaning up components
  // when using React Testing Library and adds special
  // extended assertions to Jest
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  // and the extensions should be .ts or .tsx
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    ...getJestModuleNameMapper(),
    '\\.(css)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/?!(d3)/'],
};

module.exports = config;
