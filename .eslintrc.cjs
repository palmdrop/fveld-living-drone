/* eslint-env node */

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    'vite.config.ts'
  ],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    "@typescript-eslint/type-annotation-spacing": "error",
    "space-in-parens": [
      "error", "never"
    ]
  }
}
